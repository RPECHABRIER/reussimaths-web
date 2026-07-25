import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Défis asynchrones entre amis : celui qui défie joue 5 questions sur un
// chapitre et enregistre son score, l'ami joue les 5 mêmes à son tour (des
// questions différentes générées à la volée, pas les mêmes énoncés) puis les
// deux scores sont comparés. Voir supabase/schema.sql, table `challenges`.
export const QUESTIONS_PER_CHALLENGE = 5;

export function useChallenges(userId) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .or(`from_user.eq.${userId},to_user.eq.${userId}`)
      .order("created_at", { ascending: false });
    if (error) console.error("[useChallenges] load error:", error.message);
    setRows(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const createChallenge = useCallback(
    async (toUserId, chapterId, score, durationMs) => {
      const { error } = await supabase.from("challenges").insert({
        from_user: userId,
        to_user: toUserId,
        chapter_id: chapterId,
        from_score: score,
        from_duration_ms: durationMs ?? null,
        from_played_at: new Date().toISOString(),
      });
      if (!error) await load();
      return { error };
    },
    [userId, load]
  );

  const submitResponse = useCallback(
    async (challengeId, score, durationMs) => {
      const { error } = await supabase
        .from("challenges")
        .update({ to_score: score, to_duration_ms: durationMs ?? null, to_played_at: new Date().toISOString() })
        .eq("id", challengeId);
      if (!error) await load();
      return { error };
    },
    [load]
  );

  return { challenges: rows, loading, createChallenge, submitResponse, reload: load };
}
