import { useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

// Intervalles de répétition espacée (en jours), indexés par interval_stage.
// Stage 0 = à revoir immédiatement (dernière tentative ratée). Stage max
// (4) = +4 semaines, palier atteint une fois la compétence bien ancrée.
// Voir supabase/schema.sql (table skill_mastery) pour le raisonnement complet
// (base neuroscientifique : répétition espacée à intervalles croissants).
const INTERVAL_DAYS = [0, 2, 7, 14, 28];
const MAX_STAGE = INTERVAL_DAYS.length - 1;

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
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
    async ({ skillId, chapterId, correct }) => {
      if (!userId || !skillId || !chapterId) return;
      const { data: existing, error: readError } = await supabase
        .from("skill_mastery")
        .select("attempts, correct, interval_stage")
        .eq("user_id", userId)
        .eq("skill_id", skillId)
        .maybeSingle();
      if (readError) {
        console.error("[useSkillTracking] read error:", readError.message);
        return;
      }
      const prevStage = existing?.interval_stage ?? 0;
      const nextStage = correct ? Math.min(prevStage + 1, MAX_STAGE) : 0;
      const now = new Date();
      // Une bonne réponse repousse la prochaine révision selon le palier
      // atteint ; une erreur remet la compétence "à réviser" dès maintenant
      // (elle réapparaîtra dans l'onglet Réviser).
      const nextReviewAt = correct ? addDays(now, INTERVAL_DAYS[nextStage]) : now;

      const { error } = await supabase.from("skill_mastery").upsert(
        {
          user_id: userId,
          skill_id: skillId,
          chapter_id: chapterId,
          attempts: (existing?.attempts ?? 0) + 1,
          correct: (existing?.correct ?? 0) + (correct ? 1 : 0),
          interval_stage: nextStage,
          last_correct: correct,
          last_practiced_at: now.toISOString(),
          next_review_at: nextReviewAt.toISOString(),
          updated_at: now.toISOString(),
        },
        { onConflict: "user_id,skill_id" }
      );
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
        return [];
      }
      return data ?? [];
    },
    [userId]
  );

  return { recordAttempt, getDueSkills };
}
