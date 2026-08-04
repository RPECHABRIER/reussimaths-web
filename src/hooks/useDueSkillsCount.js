import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// ---------------------------------------------------------------------------
// Nombre de compétences dues en répétition espacée (voir useSkillTracking /
// src/pages/Reviser.jsx pour le détail des intervalles). Utilisé uniquement
// pour le badge de la carte "Réviser" mise en avant sur les pages d'accueil,
// de sélection de niveau et de compte (voir ReviserCard.jsx) — une requête
// "count" légère (head: true, aucune ligne rapatriée) plutôt que de recharger
// tout ce que getDueSkills() renvoie déjà côté page /reviser.
// ---------------------------------------------------------------------------
export function useDueSkillsCount(userId) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setCount(0);
      return;
    }
    let cancelled = false;
    supabase
      .from("skill_mastery")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .lte("next_review_at", new Date().toISOString())
      .then(({ count: c, error }) => {
        if (error) {
          console.error("[useDueSkillsCount] error:", error.message);
          return;
        }
        if (!cancelled) setCount(c ?? 0);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return count;
}
