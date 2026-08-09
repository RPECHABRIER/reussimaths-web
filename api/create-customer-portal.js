import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseUser } from "./_auth.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const user = await requireSupabaseUser(req, res, supabaseAdmin);
  if (!user) return;
  const { data, error } = await supabaseAdmin.from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
  if (error || !data?.stripe_customer_id?.startsWith("cus_")) return res.status(400).json({ error: "Aucun espace de facturation disponible." });
  try {
    const session = await stripe.billingPortal.sessions.create({ customer: data.stripe_customer_id, return_url: `${process.env.PUBLIC_APP_URL}/compte` });
    return res.status(200).json({ url: session.url });
  } catch (portalError) {
    console.error("[create-customer-portal]", portalError.message);
    return res.status(500).json({ error: "Impossible d'ouvrir l'espace de facturation." });
  }
}
