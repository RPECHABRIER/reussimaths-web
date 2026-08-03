import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const STORAGE_KEY = "reussimaths_device_session_id";

function getOrCreateDeviceId() {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

// ---------------------------------------------------------------------------
// Anti-partage : un compte abonné "mensuel" (abonnement complet) ne doit
// avoir qu'UNE session active à la fois — voir supabase/schema.sql (table
// active_sessions, clé primaire = user_id, temps réel activé). Chaque
// appareil "prend la main" en écrasant device_session_id ; les autres
// appareils, abonnés au temps réel sur leur propre ligne, se déconnectent dès
// qu'ils voient un device_session_id différent du leur.
//
// Limite connue (documentée, pas cachée) : ceci ne révoque pas le jeton
// Supabase de l'appareil évincé (il faudrait la clé service_role, donc une
// Edge Function, pour ça) — l'appareil perdant se déconnecte "poliment" dès
// qu'il reçoit la notification temps réel, mais un jeton copié pourrait
// continuer à fonctionner quelques instants avant. Suffisant pour dissuader
// un partage familial normal du même compte, pas un mécanisme de sécurité
// absolu.
// ---------------------------------------------------------------------------
export function useSingleSession(userId, enabled, onEvicted) {
  const [evicted, setEvicted] = useState(false);
  const deviceIdRef = useRef(null);
  const onEvictedRef = useRef(onEvicted);
  onEvictedRef.current = onEvicted;

  const claim = useCallback(async (uid) => {
    const { error } = await supabase
      .from("active_sessions")
      .upsert(
        { user_id: uid, device_session_id: deviceIdRef.current, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    if (error) console.error("[useSingleSession] claim error:", error.message);
  }, []);

  useEffect(() => {
    if (!userId || !enabled) {
      setEvicted(false);
      return;
    }
    deviceIdRef.current = getOrCreateDeviceId();
    let cancelled = false;

    claim(userId);

    const channel = supabase
      .channel(`active_sessions_${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "active_sessions", filter: `user_id=eq.${userId}` },
        (payload) => {
          if (cancelled) return;
          const newDeviceId = payload.new?.device_session_id;
          if (newDeviceId && newDeviceId !== deviceIdRef.current) {
            setEvicted(true);
            onEvictedRef.current?.();
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId, enabled, claim]);

  return { evicted };
}
