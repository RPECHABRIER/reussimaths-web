// Vercel serverless function — POST /api/stripe-webhook
// Reçoit les événements Stripe et met à jour la table `subscriptions` via la
// clé service_role Supabase (jamais exposée au client). C'est la SEULE voie
// autorisée à écrire dans cette table (voir supabase/schema.sql : le client
// n'a qu'un droit de lecture dessus).
//
// Variables d'environnement nécessaires : STRIPE_SECRET_KEY,
// STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
//
// Config Stripe : ajoute cette URL dans le dashboard Stripe > Webhooks, sur
// les événements checkout.session.completed, customer.subscription.updated,
// customer.subscription.deleted.

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");

// Vercel doit recevoir le corps brut (non parsé) pour vérifier la signature Stripe.
export const config = { api: { bodyParser: false } };

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

// Récompense de parrainage : si l'utilisateur qui vient de payer (referredUserId)
// a été parrainé (table `referrals`) et que son parrain a un abonnement
// complet ("mensuel") actif, on crédite un mois gratuit au parrain — voir
// supabase/schema.sql (colonne subscription_reward_granted_at, qui empêche de
// créditer deux fois le même filleul, par ex. s'il se désabonne puis se
// réabonne). Le "mois gratuit" est implémenté en repoussant trial_end de 30
// jours sur l'abonnement Stripe du parrain (proration_behavior: "none") :
// aucune facture n'est émise pendant cette période, puis la facturation
// normale reprend. N'échoue jamais bruyamment : une erreur ici ne doit pas
// faire échouer le traitement du paiement du filleul.
async function grantReferralFreeMonthIfEligible(referredUserId) {
  try {
    const { data: referral } = await supabaseAdmin
      .from("referrals")
      .select("referrer_id, subscription_reward_granted_at")
      .eq("referred_id", referredUserId)
      .maybeSingle();
    if (!referral || referral.subscription_reward_granted_at) return;

    const { data: referrerSub } = await supabaseAdmin
      .from("subscriptions")
      .select("plan, status, stripe_customer_id")
      .eq("user_id", referral.referrer_id)
      .maybeSingle();
    if (!referrerSub || referrerSub.plan !== "mensuel") return;
    if (!["active", "trialing"].includes(referrerSub.status)) return;
    if (!referrerSub.stripe_customer_id) return;

    const existing = await stripe.subscriptions.list({
      customer: referrerSub.stripe_customer_id,
      status: "active",
      limit: 1,
    });
    const stripeSub = existing.data[0];
    if (!stripeSub) return;

    const oneMonthLater = stripeSub.current_period_end + 30 * 24 * 60 * 60;
    await stripe.subscriptions.update(stripeSub.id, {
      trial_end: oneMonthLater,
      proration_behavior: "none",
    });

    await supabaseAdmin
      .from("referrals")
      .update({ subscription_reward_granted_at: new Date().toISOString() })
      .eq("referred_id", referredUserId);
  } catch (err) {
    console.error("[stripe-webhook] échec du mois gratuit parrainage:", err.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe-webhook] signature invalide:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id ?? session.metadata?.supabase_user_id;
        const plan = session.metadata?.plan ?? null;
        if (userId) {
          const row = {
            user_id: userId,
            stripe_customer_id: session.customer,
            status: "active",
            plan,
            updated_at: new Date().toISOString(),
          };
          // "special_examen" est un paiement UNIQUE (mode "payment", voir
          // create-checkout-session.js), volontairement non reconductible :
          // pas d'abonnement Stripe derrière, donc pas de renouvellement
          // possible. On fixe nous-mêmes la fin d'accès à +3 mois.
          if (session.mode === "payment" && plan === "special_examen") {
            const threeMonthsLater = new Date();
            threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
            row.current_period_end = threeMonthsLater.toISOString();
          }
          await supabaseAdmin.from("subscriptions").upsert(row);
          // Ce filleul vient de payer (mensuel ou special_examen) : son
          // éventuel parrain abonné complet reçoit un mois gratuit.
          await grantReferralFreeMonthIfEligible(userId);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        // On retrouve l'utilisateur via le customer_id déjà enregistré.
        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: sub.status, // active | trialing | canceled | past_due ...
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", sub.customer);
        break;
      }
      default:
        break; // événements non gérés, ignorés volontairement
    }
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("[stripe-webhook] erreur de traitement:", err);
    res.status(500).json({ error: "internal error" });
  }
}
