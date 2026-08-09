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
// table practice_time). L'incrément est atomique côté Supabase pour éviter
// que deux heartbeats simultanés écrasent une partie du temps enregistré.
// ---------------------------------------------------------------------------
export function usePracticeTime(userId) {
  const addSeconds = useCallback(
    async (seconds) => {
      const rounded = Math.round(seconds);
      if (!userId || !rounded || rounded <= 0) return;
      const { error } = await supabase.rpc("add_practice_seconds", {
        p_seconds: Math.min(rounded, 300),
        p_practice_date: todayISO(),
      });
      if (error) console.error("[usePracticeTime] save error:", error.message);
    },
    [userId]
  );

  return { addSeconds };
}
