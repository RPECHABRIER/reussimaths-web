import { useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Suivi du temps de pratique, par petites tranches ("heartbeat", voir
// usePracticeHeartbeat ci-dessous) — nécessaire au bilan hebdomadaire
// destiné aux parents (voir src/pages/Bilan.jsx et supabase/schema.sql,
// table practice_time). Même convention lecture-puis-écriture que
// useSkillTracking / useDailyStreak (pas de RPC dédiée, RLS restreint déjà
// chacun à sa propre ligne). N'écrit rien si l'utilisateur n'est pas
// connecté, comme les autres hooks de suivi.
// ---------------------------------------------------------------------------
export function usePracticeTime(userId) {
  const addSeconds = useCallback(
    async (seconds) => {
      const rounded = Math.round(seconds);
      if (!userId || !rounded || rounded <= 0) return;
      const today = todayISO();
      const { data: existing, error: readError } = await supabase
        .from("practice_time")
        .select("seconds")
        .eq("user_id", userId)
        .eq("practice_date", today)
        .maybeSingle();
      if (readError) {
        console.error("[usePracticeTime] read error:", readError.message);
        return;
      }
      const { error } = await supabase.from("practice_time").upsert(
        {
          user_id: userId,
          practice_date: today,
          seconds: (existing?.seconds ?? 0) + rounded,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,practice_date" }
      );
      if (error) console.error("[usePracticeTime] save error:", error.message);
    },
    [userId]
  );

  return { addSeconds };
}
