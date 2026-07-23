import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

// Compte individualisé : chaque utilisateur se connecte via Google ou Apple
// (Supabase Auth gère le flux OAuth), mais son identité publique dans l'app
// (pseudo, avatar) est un profil séparé stocké dans la table `profiles` —
// jamais le nom réel ni l'email de connexion. Voir supabase/schema.sql.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(() => {
    return supabase.auth.signInWithOAuth({ provider: "google" });
  }, []);

  const signInWithApple = useCallback(() => {
    return supabase.auth.signInWithOAuth({ provider: "apple" });
  }, []);

  const signOut = useCallback(() => supabase.auth.signOut(), []);

  return { user, loading, signInWithGoogle, signInWithApple, signOut };
}
