import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseUser } from "./_auth.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const user = await requireSupabaseUser(req, res, supabaseAdmin);
  if (!user) return;
  const sessionId = req.query?.session_id;
  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) return res.status(400).json({ error: "Session invalide" });
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.client_reference_id !== user.id) return res.status(403).json({ error: "Accès refusé" });
    const { data: subscription } = await supabaseAdmin.from("subscriptions").select("status, plan, current_period_end").eq("user_id", user.id).maybeSingle();
    const paid = ["paid", "no_payment_required"].includes(session.payment_status);
    const notExpired = !subscription?.current_period_end || new Date(subscription.current_period_end) > new Date();
    const expectedPlan = session.metadata?.plan;
    const activated = paid && subscription?.plan === expectedPlan && ["active", "trialing"].includes(subscription?.status) && notExpired;
    return res.status(200).json({ paid, activated, plan: expectedPlan });
  } catch (error) {
    console.error("[checkout-status]", error.message);
    return res.status(500).json({ error: "Vérification momentanément indisponible" });
  }
}
