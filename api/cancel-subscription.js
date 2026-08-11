// Vercel serverless function (Node.js runtime) — POST /api/cancel-subscription
// Résiliation en libre-service (voir src/pages/Account.jsx). Ne concerne que
// le plan "mensuel" (abonnement Stripe classique) : "special_examen" est un
// paiement unique déjà non reconductible (voir create-checkout-session.js),
// rien à résilier côté Stripe pour ce plan-là.
//
// body: { action: "cancel" | "reactivate" } — l'utilisateur est dérivé du
// Bearer token Supabase, jamais du body.
// "cancel"     -> cancel_at_period_end: true  (accès conservé jusqu'à la fin
//                 de la période déjà payée, comme demandé par Romain)
// "reactivate" -> cancel_at_period_end: false (annule une résiliation prévue,
//                 tant que la période en cours n'est pas terminée)
//
// Variables d'environnement nécessaires : STRIPE_SECRET_KEY, SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY (même clé service_role que stripe-webhook.js —
// c'est la seule voie autorisée à écrire dans `subscriptions`, voir
// supabase/schema.sql).

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseUser } from "./_auth.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const user = await requireSupabaseUser(req, res, supabaseAdmin);
  if (!user) return;

  const { action } = req.body ?? {};
  if (!["cancel", "reactivate"].includes(action)) {
    res.status(400).json({ error: "action (cancel | reactivate) requise" });
    return;
  }

  try {
    const { data: subRow, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("plan, status, stripe_customer_id, stripe_subscription_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (subError) throw subError;

    if (!subRow || subRow.plan !== "mensuel") {
      res.status(400).json({ error: "Rien à résilier : cette action ne concerne que l'abonnement mensuel." });
      return;
    }
    if (!subRow.stripe_customer_id) {
      res.status(400).json({ error: "Aucun abonnement Stripe trouvé pour ce compte." });
      return;
    }

    let stripeSub = null;
    if (subRow.stripe_subscription_id?.startsWith("sub_")) {
      stripeSub = await stripe.subscriptions.retrieve(subRow.stripe_subscription_id);
    } else {
      // Compatibilité avec les abonnements créés avant cette colonne.
      const existing = await stripe.subscriptions.list({ customer: subRow.stripe_customer_id, status: "all", limit: 5 });
      stripeSub = existing.data.find((item) => ["active", "trialing"].includes(item.status));
    }
    if (!stripeSub || !["active", "trialing"].includes(stripeSub.status)) {
      res.status(400).json({ error: "Aucun abonnement Stripe actif trouvé." });
      return;
    }

    const cancelAtPeriodEnd = action === "cancel";
    const updated = await stripe.subscriptions.update(stripeSub.id, { cancel_at_period_end: cancelAtPeriodEnd });

    const { error: updateError } = await supabaseAdmin
      .from("subscriptions")
      .update({
        stripe_subscription_id: stripeSub.id,
        cancel_at_period_end: cancelAtPeriodEnd,
        current_period_end: new Date(updated.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
    if (updateError) throw updateError;

    res.status(200).json({
      ok: true,
      cancelAtPeriodEnd,
      currentPeriodEnd: new Date(updated.current_period_end * 1000).toISOString(),
    });
  } catch (err) {
    console.error("[cancel-subscription]", err);
    res.status(500).json({ error: "Impossible de mettre à jour l'abonnement" });
  }
}
