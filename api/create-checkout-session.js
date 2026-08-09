// Vercel serverless function (Node.js runtime) — POST /api/create-checkout-session
// Crée une session Stripe Checkout pour un utilisateur déjà authentifié côté
// Supabase. Le webhook (stripe-webhook.js) est celui qui écrira ensuite le
// statut "active" dans la table `subscriptions` une fois le paiement confirmé.
// L'identité est dérivée du Bearer token Supabase, jamais du body.
//
// Variables d'environnement nécessaires (à définir dans Vercel, PAS dans le
// bundle client) : STRIPE_SECRET_KEY, STRIPE_PRICE_MENSUEL, STRIPE_PRICE_EXAMEN.

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseUser } from "./_auth.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");

const PRICE_BY_PLAN = {
  mensuel: process.env.STRIPE_PRICE_MENSUEL,
  special_examen: process.env.STRIPE_PRICE_EXAMEN,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const user = await requireSupabaseUser(req, res, supabaseAdmin);
  if (!user) return;

  const { plan } = req.body ?? {};
  const price = PRICE_BY_PLAN[plan];

  if (!price) {
    res.status(400).json({ error: "plan (mensuel | special_examen) requis" });
    return;
  }

  // "mensuel" = abonnement Stripe classique (renouvellement automatique).
  // "special_examen" = paiement UNIQUE (mode "payment", pas "subscription") :
  // volontairement non reconductible, pour ne pas permettre d'enchaîner
  // l'offre tous les 3 mois à la place du tarif mensuel (voir stripe-webhook.js
  // pour le calcul des 3 mois d'accès à partir de ce paiement ponctuel).
  const mode = plan === "special_examen" ? "payment" : "subscription";

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price, quantity: 1 }],
      // On passe l'id Supabase en metadata pour que le webhook sache à quel
      // compte rattacher l'abonnement (voir stripe-webhook.js).
      client_reference_id: user.id,
      metadata: { supabase_user_id: user.id, plan },
      success_url: `${process.env.PUBLIC_APP_URL}/compte?checkout=success`,
      cancel_url: `${process.env.PUBLIC_APP_URL}/compte?checkout=cancel`,
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("[create-checkout-session]", err);
    res.status(500).json({ error: "Impossible de créer la session de paiement" });
  }
}
