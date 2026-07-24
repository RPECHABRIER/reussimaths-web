import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Nombre d'amis parrainés (ayant créé un compte via le lien /?ref=<code> de
// cet utilisateur) — voir src/pages/Onboarding.jsx pour l'enregistrement, et
// meta.unlockReferrals dans les chapitres (ex: probabilites.js) pour le
// déblocage par parrainage plutôt que par abonnement.
export function useReferrals(userId) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from("referrals").select("referred_id").eq("referrer_id", userId);
    if (error) console.error("[useReferrals] load error:", error.message);
    setCount(data?.length ?? 0);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { count, loading, reload: load };
}
