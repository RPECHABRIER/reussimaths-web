// Vercel serverless function (Node.js runtime) — POST /api/create-checkout-session
// Crée une session Stripe Checkout pour un utilisateur déjà authentifié côté
// Supabase. Le webhook (stripe-webhook.js) est celui qui écrira ensuite le
// statut "active" dans la table `subscriptions` une fois le paiement confirmé.
//
// Variables d'environnement nécessaires (à définir dans Vercel, PAS dans le
// bundle client) : STRIPE_SECRET_KEY, STRIPE_PRICE_MENSUEL, STRIPE_PRICE_EXAMEN.

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

const PRICE_BY_PLAN = {
  mensuel: process.env.STRIPE_PRICE_MENSUEL,
  special_examen: process.env.STRIPE_PRICE_EXAMEN,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { userId, plan } = req.body ?? {};
  const price = PRICE_BY_PLAN[plan];

  if (!userId || !price) {
    res.status(400).json({ error: "userId et plan (mensuel | special_examen) requis" });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      // On passe l'id Supabase en metadata pour que le webhook sache à quel
      // compte rattacher l'abonnement (voir stripe-webhook.js).
      client_reference_id: userId,
      metadata: { supabase_user_id: userId, plan },
      success_url: `${process.env.PUBLIC_APP_URL}/compte?checkout=success`,
      cancel_url: `${process.env.PUBLIC_APP_URL}/compte?checkout=cancel`,
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("[create-checkout-session]", err);
    res.status(500).json({ error: "Impossible de créer la session de paiement" });
  }
}
