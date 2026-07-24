import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Vote "je veux ce niveau en priorité" pour les niveaux sans contenu (voir
// src/pages/ComingSoon.jsx). Le vote fonctionne sans obliger à se connecter :
// si l'utilisateur est connecté on utilise son user_id, sinon un identifiant
// aléatoire généré une fois et gardé dans ce navigateur (localStorage).
function getVoterKey(userId) {
  if (userId) return userId;
  const K = "reussimaths_voter_key";
  let key = localStorage.getItem(K);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(K, key);
  }
  return key;
}

export function useLevelVotes(levelId, userId) {
  const [count, setCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const voterKey = getVoterKey(userId);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("level_votes").select("voter_key").eq("level_id", levelId);
    if (error) console.error("[useLevelVotes] load error:", error.message);
    setCount(data?.length ?? 0);
    setHasVoted(!!data?.some((r) => r.voter_key === voterKey));
    setLoading(false);
  }, [levelId, voterKey]);

  useEffect(() => {
    load();
  }, [load]);

  const vote = useCallback(async () => {
    if (hasVoted) return;
    const { error } = await supabase.from("level_votes").insert({ level_id: levelId, voter_key: voterKey });
    if (error) {
      console.error("[useLevelVotes] vote error:", error.message);
      return;
    }
    setHasVoted(true);
    setCount((c) => c + 1);
  }, [levelId, voterKey, hasVoted]);

  return { count, hasVoted, vote, loading };
}
