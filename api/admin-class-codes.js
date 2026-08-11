import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseUser } from "./_auth.js";

const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");
const ADMIN_EMAIL = "romainpechabrier@gmail.com";
const LEVELS = new Set([
  "sixieme", "cinquieme", "quatrieme", "troisieme", "seconde",
  "premiere-spe", "premiere-non-spe", "premiere-techno", "terminale-spe", "terminale-techno",
]);

async function requireAdmin(req, res) {
  const caller = await requireSupabaseUser(req, res, supabaseAdmin);
  if (!caller) return null;
  if (caller.email?.toLowerCase() !== ADMIN_EMAIL) {
    res.status(403).json({ error: "Non autorisé" });
    return null;
  }
  return caller;
}

async function listCodes(res) {
  const [{ data: codes, error: codesError }, { data: redemptions, error: redemptionsError }] = await Promise.all([
    supabaseAdmin.from("class_access_codes").select("code, level, label, active, expires_at, max_redemptions, created_at").order("created_at", { ascending: false }),
    supabaseAdmin.from("class_access_redemptions").select("code, user_id, redeemed_at"),
  ]);
  if (codesError || redemptionsError) throw codesError || redemptionsError;
  const userIds = [...new Set((redemptions ?? []).map((row) => row.user_id))];
  const [activityResult, subscriptionsResult] = userIds.length ? await Promise.all([
    supabaseAdmin.from("daily_activity").select("user_id, activity_date, attempts, correct").in("user_id", userIds),
    supabaseAdmin.from("subscriptions").select("user_id, plan, status, admin_granted").in("user_id", userIds),
  ]) : [{ data: [], error: null }, { data: [], error: null }];
  if (activityResult.error || subscriptionsResult.error) throw activityResult.error || subscriptionsResult.error;
  const activityByUser = (activityResult.data ?? []).reduce((map, row) => {
    const current = map.get(row.user_id) ?? { days: new Set(), attempts: 0, correct: 0 };
    current.days.add(row.activity_date); current.attempts += row.attempts ?? 0; current.correct += row.correct ?? 0;
    map.set(row.user_id, current); return map;
  }, new Map());
  const paidUsers = new Set((subscriptionsResult.data ?? []).filter((row) => row.plan === "mensuel" && !row.admin_granted && ["active", "trialing"].includes(row.status)).map((row) => row.user_id));
  res.status(200).json({ codes: (codes ?? []).map((code) => {
    const members = (redemptions ?? []).filter((row) => row.code === code.code);
    const activity = members.map((row) => activityByUser.get(row.user_id)).filter(Boolean);
    const attempts = activity.reduce((sum, row) => sum + row.attempts, 0);
    const correct = activity.reduce((sum, row) => sum + row.correct, 0);
    return {
      ...code,
      redemption_count: members.length,
      activated_count: activity.filter((row) => row.attempts > 0).length,
      active_week_count: activity.filter((row) => row.days.size >= 2).length,
      converted_count: members.filter((row) => paidUsers.has(row.user_id)).length,
      attempts,
      success_rate: attempts ? Math.round(correct / attempts * 100) : null,
    };
  }) });
}

export default async function handler(req, res) {
  const caller = await requireAdmin(req, res);
  if (!caller) return;
  try {
    if (req.method === "GET") return await listCodes(res);
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { action, level, label, expiresInDays, maxRedemptions, code } = req.body ?? {};
    if (action === "deactivate") {
      if (!code) return res.status(400).json({ error: "Code requis" });
      const { error } = await supabaseAdmin.from("class_access_codes").update({ active: false }).eq("code", code);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    if (action !== "create" || !LEVELS.has(level)) return res.status(400).json({ error: "Action ou niveau invalide" });
    const days = Number(expiresInDays);
    const maximum = Number(maxRedemptions);
    if (!Number.isInteger(days) || days < 1 || days > 365 || !Number.isInteger(maximum) || maximum < 1 || maximum > 500) {
      return res.status(400).json({ error: "Durée ou nombre d'élèves invalide" });
    }
    const generatedCode = `RM-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
    const expiresAt = new Date(Date.now() + days * 86400000).toISOString();
    const { error } = await supabaseAdmin.from("class_access_codes").insert({
      code: generatedCode, level, label: String(label ?? "").trim().slice(0, 100) || null,
      active: true, expires_at: expiresAt, max_redemptions: maximum, created_by: caller.id,
    });
    if (error) throw error;
    return res.status(201).json({ code: generatedCode });
  } catch (error) {
    console.error("[admin-class-codes]", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
