import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(b) - new Date(a)) / msPerDay);
}

// Streak quotidien de PRATIQUE (jours consécutifs où l'élève a fait au moins
// un exercice), distinct du streak de bonnes réponses en session (mode
// Jeu/Défi de ChapterRunner, purement local à la session en cours et remis à
// zéro à la première erreur). Grounded dans la littérature sur la
// motivation/auto-efficacité (dossier Neurosciences) : encourager une
// régularité quotidienne plutôt qu'un bachotage ponctuel.
export function useDailyStreak(userId) {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setStreak(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from("daily_streak").select("*").eq("user_id", userId).maybeSingle();
    if (error) console.error("[useDailyStreak] load error:", error.message);
    setStreak(data ?? { current_streak: 0, best_streak: 0, last_practice_date: null });
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  // À appeler une fois par visite, au premier exercice résolu (voir les 3
  // lecteurs d'exercices). Sans effet si déjà comptabilisé aujourd'hui.
  const markPracticed = useCallback(async () => {
    if (!userId) return;
    const today = todayISO();
    const { data: existing, error: readError } = await supabase
      .from("daily_streak")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (readError) {
      console.error("[useDailyStreak] read error:", readError.message);
      return;
    }
    if (existing?.last_practice_date === today) return; // déjà compté aujourd'hui

    const gap = existing?.last_practice_date ? daysBetween(existing.last_practice_date, today) : null;
    // gap === 1 : jour suivant consécutif -> +1. gap null (jamais pratiqué)
    // ou > 1 (au moins un jour sauté) -> le streak repart de 1.
    const newCurrent = gap === 1 ? (existing.current_streak ?? 0) + 1 : 1;
    const newBest = Math.max(existing?.best_streak ?? 0, newCurrent);

    const { error } = await supabase.from("daily_streak").upsert(
      {
        user_id: userId,
        current_streak: newCurrent,
        best_streak: newBest,
        last_practice_date: today,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (error) console.error("[useDailyStreak] save error:", error.message);
    else setStreak({ current_streak: newCurrent, best_streak: newBest, last_practice_date: today });
  }, [userId]);

  return { streak, loading, markPracticed, reload: load };
}
