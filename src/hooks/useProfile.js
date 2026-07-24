import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Profil public (pseudo, avatar) — distinct de l'identité de connexion
// (Google/Apple). Si un utilisateur connecté n'a pas encore de profil, on le
// redirige vers /pseudo (voir src/pages/Onboarding.jsx et src/pages/Account.jsx).
export function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
    if (error) console.error("[useProfile] load error:", error.message);
    setProfile(data ?? null);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { profile, loading, reload: load };
}
