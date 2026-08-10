import { useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Suivi de maîtrise PAR COMPÉTENCE plutôt que par chapitre entier.
// skillId = exercise.chapter (le libellé déjà présent sur chaque exercice
// dans tous les générateurs, ex: "Second degré — Discriminant") : réutiliser
// ce champ évite de retoucher ~150 fichiers de chapitres pour leur donner un
// id de compétence explicite. chapterId = chapter.meta.id (regroupement).
//
// N'écrit rien si l'utilisateur n'est pas connecté (comme useProgress) : pas
// de sauvegarde, juste l'expérience de session en cours, sans erreur.
export function useSkillTracking(userId) {
  const recordAttempt = useCallback(
    async ({ skillId, chapterId, correct, errorCode = null, responseTimeMs = null, assisted = false }) => {
      if (!userId || !skillId || !chapterId) return;
      const { error } = await supabase.rpc("record_learning_attempt", {
        p_skill_id: skillId,
        p_chapter_id: chapterId,
        p_correct: !!correct,
        p_activity_date: todayISO(),
        p_error_code: errorCode,
        p_response_time_ms: responseTimeMs,
        p_assisted: !!assisted,
      });
      if (error) console.error("[useSkillTracking] save error:", error.message);
    },
    [userId]
  );

  // Compétences dues aujourd'hui ou avant (répétition espacée), toutes
  // matières confondues — utilisé par la page /reviser (voir src/pages/Reviser.jsx).
  // Triées par date d'échéance : les plus en retard en premier.
  const getDueSkills = useCallback(
    async (limit = 100) => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("skill_mastery")
        .select("*")
        .eq("user_id", userId)
        .lte("next_review_at", new Date().toISOString())
        .order("next_review_at", { ascending: true })
        .limit(limit);
      if (error) {
        console.error("[useSkillTracking] getDueSkills error:", error.message);
        throw error;
      }
      return data ?? [];
    },
    [userId]
  );

  const getRecurringErrors = useCallback(async (days = 30) => {
    if (!userId) return [];
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("learning_attempts")
      .select("skill_id,chapter_id,error_code,attempted_at")
      .eq("user_id", userId)
      .not("error_code", "is", null)
      .gte("attempted_at", since)
      .order("attempted_at", { ascending: false })
      .limit(500);
    if (error) {
      console.error("[useSkillTracking] getRecurringErrors error:", error.message);
      throw error;
    }
    const counts = new Map();
    for (const attempt of data ?? []) {
      const key = `${attempt.chapter_id}\u0000${attempt.skill_id}\u0000${attempt.error_code}`;
      const current = counts.get(key) ?? { ...attempt, count: 0 };
      current.count += 1;
      counts.set(key, current);
    }
    return [...counts.values()].filter((item) => item.count >= 2).sort((a, b) => b.count - a.count);
  }, [userId]);

  return { recordAttempt, getDueSkills, getRecurringErrors };
}
