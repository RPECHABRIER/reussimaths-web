import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getChapter } from "../chapters/registry";

// ---------------------------------------------------------------------------
// Nombre de compétences dues en répétition espacée (voir useSkillTracking /
// src/pages/Reviser.jsx pour le détail des intervalles). Utilisé uniquement
// pour le badge de la carte "Réviser" mise en avant sur les pages d'accueil,
// de sélection de niveau et de compte (voir ReviserCard.jsx) — une requête
// "count" légère (head: true, aucune ligne rapatriée) plutôt que de recharger
// tout ce que getDueSkills() renvoie déjà côté page /reviser.
// ---------------------------------------------------------------------------
export function useDueSkillsCount(userId, levelId = null) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setCount(0);
      return;
    }
    let cancelled = false;
    supabase
      .from("skill_mastery")
      .select("chapter_id")
      .eq("user_id", userId)
      .lte("next_review_at", new Date().toISOString())
      .then(({ data, error }) => {
        if (error) {
          console.error("[useDueSkillsCount] error:", error.message);
          return;
        }
        const rows = data ?? [];
        const filtered = levelId ? rows.filter((row) => getChapter(row.chapter_id)?.meta?.level === levelId) : rows;
        if (!cancelled) setCount(filtered.length);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, levelId]);

  return count;
}
