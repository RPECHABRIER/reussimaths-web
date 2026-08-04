import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// ---------------------------------------------------------------------------
// Nombre de jours écoulés depuis la dernière pratique réelle (dernière ligne
// de `daily_activity`, alimentée à chaque tentative d'exercice — voir
// useSkillTracking.recordAttempt). Volontairement PAS basé sur
// `user_login_stats.last_login_at` : cette date ne se met à jour qu'à une
// vraie reconnexion Supabase ("SIGNED_IN"), pas à chaque ouverture de l'app
// avec une session déjà persistée — donc peu fiable pour détecter une
// inactivité réelle. Utilisé par <Mascot /> pour afficher la version
// "triste" du logo après une semaine sans pratique.
// ---------------------------------------------------------------------------
export function useLastActivity(userId) {
  const [daysSinceLastActivity, setDaysSinceLastActivity] = useState(null); // null = pas chargé, ou jamais pratiqué
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setDaysSinceLastActivity(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    supabase
      .from("daily_activity")
      .select("activity_date")
      .eq("user_id", userId)
      .order("activity_date", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error("[useLastActivity] error:", error.message);
        if (data?.activity_date) {
          const last = new Date(data.activity_date + "T00:00:00");
          const diffDays = Math.floor((Date.now() - last.getTime()) / 86400000);
          setDaysSinceLastActivity(diffDays);
        } else {
          setDaysSinceLastActivity(null);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { daysSinceLastActivity, loading };
}
