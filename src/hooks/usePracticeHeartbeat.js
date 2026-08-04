import { useEffect, useRef } from "react";
import { usePracticeTime } from "./usePracticeTime";

const HEARTBEAT_SECONDS = 20;

// ---------------------------------------------------------------------------
// À appeler dans un lecteur d'exercices (ChapterRunner, AutomatismesRunner,
// MiniDuel) : logue le temps de pratique par tranches de 20 s pendant que le
// composant reste monté, et flush le reste au démontage (changement de
// chapitre, retour à l'accueil...). Le temps onglet masqué (Page Visibility
// API) n'est pas comptabilisé — seule la tranche où l'élève regarde
// vraiment l'écran compte, pour un bilan honnête. Ne fait rien si
// l'utilisateur n'est pas connecté (voir usePracticeTime).
// ---------------------------------------------------------------------------
export function usePracticeHeartbeat(userId) {
  const { addSeconds } = usePracticeTime(userId);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    if (!userId) return undefined;
    lastTickRef.current = Date.now();

    const flush = () => {
      const now = Date.now();
      const elapsed = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      if (document.visibilityState === "visible" && elapsed > 0) {
        addSeconds(elapsed);
      }
    };

    const interval = setInterval(flush, HEARTBEAT_SECONDS * 1000);
    document.addEventListener("visibilitychange", flush);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", flush);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
}
