import { createClient } from "@supabase/supabase-js";
import { requireSupabaseUser } from "./_auth.js";

const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");
const ROLES = new Set(["eleve", "parent", "enseignant"]);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const user = await requireSupabaseUser(req, res, supabaseAdmin);
  if (!user) return;
  const { role, usefulness, ease, wouldRecommend, comment } = req.body ?? {};
  if (!ROLES.has(role) || ![1, 2, 3, 4, 5].includes(usefulness) || ![1, 2, 3, 4, 5].includes(ease) || typeof wouldRecommend !== "boolean") {
    return res.status(400).json({ error: "Réponses incomplètes." });
  }
  const cleanComment = typeof comment === "string" ? comment.trim().slice(0, 2000) : "";
  const { error } = await supabaseAdmin.from("pilot_feedback").insert({ user_id: user.id, role, usefulness, ease, would_recommend: wouldRecommend, comment: cleanComment });
  if (error) {
    console.error("[pilot-feedback]", error.message);
    return res.status(500).json({ error: "Impossible d'enregistrer ce retour." });
  }
  return res.status(201).json({ ok: true });
}
