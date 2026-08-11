import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseUser } from "./_auth.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");

async function syncPaidSession(session, user) {
  if (session.client_reference_id !== user.id) throw Object.assign(new Error("Accès refusé"), { statusCode: 403 });
  const plan = session.metadata?.plan;
  const validShape = (plan === "mensuel" && session.mode === "subscription") || (plan === "special_examen" && session.mode === "payment");
  if (!validShape || !["paid", "no_payment_required"].includes(session.payment_status)) return null;

  const row = {
    user_id: user.id,
    stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id,
    stripe_subscription_id: null,
    status: "active",
    plan,
    updated_at: new Date().toISOString(),
    cancel_at_period_end: false,
  };
  if (session.mode === "subscription") {
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    if (!subscriptionId) throw new Error("Abonnement Stripe absent de la session Checkout");
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    row.stripe_subscription_id = stripeSubscription.id;
    row.status = stripeSubscription.status;
    row.current_period_end = new Date(stripeSubscription.current_period_end * 1000).toISOString();
    row.cancel_at_period_end = !!stripeSubscription.cancel_at_period_end;
  } else {
    const periodEnd = new Date(session.created * 1000);
    periodEnd.setMonth(periodEnd.getMonth() + 3);
    row.current_period_end = periodEnd.toISOString();
  }
  const { error } = await supabaseAdmin.from("subscriptions").upsert(row);
  if (error) throw error;
  return row;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const user = await requireSupabaseUser(req, res, supabaseAdmin);
  if (!user) return;
  const sessionId = req.query?.session_id;
  const reconcile = req.query?.reconcile === "1";
  if (!reconcile && (typeof sessionId !== "string" || !sessionId.startsWith("cs_"))) return res.status(400).json({ error: "Session invalide" });
  try {
    let session = sessionId?.startsWith("cs_") ? await stripe.checkout.sessions.retrieve(sessionId) : null;
    if (reconcile && !session) {
      const customers = await stripe.customers.list({ email: user.email, limit: 10 });
      const candidates = [];
      for (const customer of customers.data) {
        const sessions = await stripe.checkout.sessions.list({ customer: customer.id, limit: 20 });
        candidates.push(...sessions.data.filter((item) => item.client_reference_id === user.id));
      }
      session = candidates.sort((a, b) => b.created - a.created).find((item) => ["paid", "no_payment_required"].includes(item.payment_status)) ?? null;
    }
    if (!session) return res.status(200).json({ paid: false, activated: false, plan: null });
    const repaired = await syncPaidSession(session, user);
    const { data: subscription } = await supabaseAdmin.from("subscriptions").select("status, plan, current_period_end").eq("user_id", user.id).maybeSingle();
    const paid = ["paid", "no_payment_required"].includes(session.payment_status);
    const notExpired = !subscription?.current_period_end || new Date(subscription.current_period_end) > new Date();
    const expectedPlan = repaired?.plan ?? session.metadata?.plan;
    const activated = paid && subscription?.plan === expectedPlan && ["active", "trialing"].includes(subscription?.status) && notExpired;
    return res.status(200).json({ paid, activated, plan: expectedPlan });
  } catch (error) {
    console.error("[checkout-status]", error.message);
    if (error.statusCode === 403) return res.status(403).json({ error: "Accès refusé" });
    return res.status(500).json({ error: "Vérification momentanément indisponible" });
  }
}
