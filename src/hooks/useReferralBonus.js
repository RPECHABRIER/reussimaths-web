import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Récompense de parrainage (voir AUTOMATION_LOG.md, décision du 2026-08-03) :
// à partir de 5 amis parrainés (voir useReferrals), n'importe quel utilisateur
// peut choisir UN chapitre supplémentaire à débloquer, fixé une seule fois via
// la fonction RPC set_referral_bonus_chapter (voir supabase/schema.sql et
// src/components/ReferralBonusChoice.jsx). Ce hook charge ce choix (ou null
// s'il n'a pas encore été fait) pour l'injecter dans canAccessChapter
// (src/lib/access.js, ctx.referralBonusChapterId).
export function useReferralBonus(userId) {
  const [chapterId, setChapterId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setChapterId(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("referral_bonus_chapter")
      .select("chapter_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) console.error("[useReferralBonus] load error:", error.message);
    setChapterId(data?.chapter_id ?? null);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { chapterId, loading, reload: load };
}
