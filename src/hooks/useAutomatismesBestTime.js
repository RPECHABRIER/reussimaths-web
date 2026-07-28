import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Meilleur temps d'un abonné sur une série de 5 questions d'Automatismes,
// par thème (un thème par chapitre + "mix" pour le mélange de tous les
// chapitres) — voir src/components/AutomatismesRunner.jsx et
// supabase/schema.sql (table automatismes_best_times). Non-abonnés : le
// temps n'est jamais sauvegardé (cohérent avec le quota freemium, voir
// useDailyQuota).
export function useAutomatismesBestTime(userId, themeId) {
  const [best, setBest] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId || !themeId) {
      setBest(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("automatismes_best_times")
      .select("*")
      .eq("user_id", userId)
      .eq("theme_id", themeId)
      .maybeSingle();
    if (error) console.error("[useAutomatismesBestTime] load error:", error.message);
    setBest(data ?? null);
    setLoading(false);
  }, [userId, themeId]);

  useEffect(() => {
    load();
  }, [load]);

  // N'enregistre que si c'est une amélioration : meilleur score, ou même
  // score en moins de temps. Renvoie { saved } pour que l'écran de résultat
  // puisse afficher "Nouveau record !" seulement quand c'est vrai.
  const saveIfBetter = useCallback(
    async (score, timeMs) => {
      if (!userId || !themeId) return { saved: false };
      const isBetter = !best || score > best.best_score || (score === best.best_score && timeMs < best.best_time_ms);
      if (!isBetter) return { saved: false };
      const { error } = await supabase.from("automatismes_best_times").upsert(
        {
          user_id: userId,
          theme_id: themeId,
          best_time_ms: Math.round(timeMs),
          best_score: score,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,theme_id" }
      );
      if (error) {
        console.error("[useAutomatismesBestTime] save error:", error.message);
        return { saved: false };
      }
      setBest({ user_id: userId, theme_id: themeId, best_time_ms: Math.round(timeMs), best_score: score });
      return { saved: true };
    },
    [userId, themeId, best]
  );

  return { best, loading, saveIfBetter, reload: load };
}
