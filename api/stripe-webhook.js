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
// customer.subscription.deleted et charge.refunded.

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getStripePeriodEndIso, getStripePeriodEndSeconds } from "./_stripe-subscription.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");
const LEVELS = new Set(["sixieme", "cinquieme", "quatrieme", "troisieme", "seconde", "premiere-spe", "premiere-non-spe", "premiere-techno", "terminale-spe", "terminale-techno"]);

// Vercel doit recevoir le corps brut (non parsé) pour vérifier la signature Stripe.
export const config = { api: { bodyParser: false } };

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

async function claimEvent(eventId) {
  const { error } = await supabaseAdmin.from("stripe_webhook_events").insert({ event_id: eventId });
  if (!error) return true;
  if (error.code === "23505") return false;
  throw error;
}

async function releaseEvent(eventId) {
  await supabaseAdmin.from("stripe_webhook_events").delete().eq("event_id", eventId);
}

async function saveCheckoutSession(session) {
  const userId = session.client_reference_id;
  const plan = session.metadata?.plan;
  const level = session.metadata?.level || null;
  const validShape =
    (plan === "mensuel" && session.mode === "subscription" && LEVELS.has(level)) ||
    (plan === "special_examen" && session.mode === "payment");
  const paymentConfirmed = ["paid", "no_payment_required"].includes(session.payment_status);

  if (!userId || !validShape || !paymentConfirmed) return;

  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (authError || !authUser?.user) throw new Error("Utilisateur Supabase du paiement introuvable");

  const row = {
    user_id: userId,
    stripe_customer_id: session.customer,
    stripe_subscription_id: null,
    status: "active",
    plan,
    stripe_payment_intent_id:
      plan === "special_examen"
        ? typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null
        : null,
    ...(plan === "mensuel" ? { subscription_level: level, subscription_level_selected_at: new Date().toISOString() } : {}),
    updated_at: new Date().toISOString(),
  };
  if (session.mode === "subscription") {
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    if (!subscriptionId) throw new Error("Abonnement Stripe absent de la session Checkout");
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    row.stripe_subscription_id = stripeSubscription.id;
    row.status = stripeSubscription.status;
    row.current_period_end = getStripePeriodEndIso(stripeSubscription);
    row.cancel_at_period_end = !!stripeSubscription.cancel_at_period_end;
  } else {
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    row.current_period_end = threeMonthsLater.toISOString();
  }

  const { error } = await supabaseAdmin.from("subscriptions").upsert(row);
  if (error) throw error;
  await grantReferralFreeMonthIfEligible(userId);
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
      status: "all",
      limit: 5,
    });
    // "all" + filtre JS (et pas status: "active" directement) : un parrain
    // encore en période d'essai Stripe ("trialing", déjà autorisé par le
    // check de statut DB ci-dessus) doit aussi pouvoir être trouvé — un
    // filtre "active" strict le manquerait et le mois gratuit ne serait
    // jamais crédité dans ce cas.
    const stripeSub = existing.data.find((s) => ["active", "trialing"].includes(s.status));
    if (!stripeSub) return;

    const oneMonthLater = getStripePeriodEndSeconds(stripeSub) + 30 * 24 * 60 * 60;
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

  let claimed = false;
  try {
    claimed = await claimEvent(event.id);
    if (!claimed) {
      res.status(200).json({ received: true, duplicate: true });
      return;
    }

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        await saveCheckoutSession(event.data.object);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        // On retrouve l'utilisateur via le customer_id déjà enregistré.
        // cancel_at_period_end resynchronisé ici aussi (pas seulement dans
        // api/cancel-subscription.js) pour rester cohérent même si
        // l'abonnement est résilié/réactivé directement dans le dashboard
        // Stripe plutôt que depuis l'app.
        const subscriptionUpdate = {
          status: sub.status, // active | trialing | canceled | past_due ...
          current_period_end: getStripePeriodEndIso(sub),
          cancel_at_period_end: !!sub.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        };
        const { data: updatedRows, error } = await supabaseAdmin
          .from("subscriptions")
          .update(subscriptionUpdate)
          // L'identifiant de l'abonnement évite qu'un événement tardif lié à
          // un ancien abonnement du même client n'écrase l'accès actuel.
          .eq("stripe_subscription_id", sub.id)
          .select("user_id");
        if (error) throw error;
        if ((updatedRows ?? []).length === 0) {
          // Migration douce des abonnements historiques qui ne possédaient
          // que le customer Stripe. On ne touche jamais une ligne déjà liée
          // à un autre abonnement précis.
          const { error: legacyError } = await supabaseAdmin
            .from("subscriptions")
            .update({ ...subscriptionUpdate, stripe_subscription_id: sub.id })
            .eq("stripe_customer_id", sub.customer)
            .is("stripe_subscription_id", null);
          if (legacyError) throw legacyError;
        }
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object;
        const paymentIntentId =
          typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
        const fullyRefunded = charge.refunded === true || charge.amount_refunded >= charge.amount;
        if (!paymentIntentId || !fullyRefunded) break;

        // Un remboursement intégral du paiement unique retire immédiatement
        // le Pack correspondant. Le payment_intent est enregistré lors du
        // Checkout : un remboursement tardif d'un ancien achat ne peut donc
        // jamais supprimer un Pack racheté ensuite par le même client.
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "canceled",
            current_period_end: new Date().toISOString(),
            cancel_at_period_end: false,
            pack_examen_level: null,
            pack_examen_bonus_chapters: null,
            updated_at: new Date().toISOString(),
          })
          .eq("plan", "special_examen")
          .eq("stripe_payment_intent_id", paymentIntentId);
        if (error) throw error;
        break;
      }
      default:
        break; // événements non gérés, ignorés volontairement
    }
    res.status(200).json({ received: true });
  } catch (err) {
    if (claimed) await releaseEvent(event.id);
    console.error("[stripe-webhook] erreur de traitement:", err);
    res.status(500).json({ error: "internal error" });
  }
}
