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
    supabaseAdmin.from("class_access_redemptions").select("code"),
  ]);
  if (codesError || redemptionsError) throw codesError || redemptionsError;
  const counts = (redemptions ?? []).reduce((map, row) => map.set(row.code, (map.get(row.code) ?? 0) + 1), new Map());
  res.status(200).json({ codes: (codes ?? []).map((code) => ({ ...code, redemption_count: counts.get(code.code) ?? 0 })) });
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
