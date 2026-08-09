import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
    const { error } = await supabase.rpc("mark_daily_practice", { p_practice_date: todayISO() });
    if (error) console.error("[useDailyStreak] save error:", error.message);
    else await load();
  }, [userId, load]);

  return { streak, loading, markPracticed, reload: load };
}
