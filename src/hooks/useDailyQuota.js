import { useCallback, useState } from "react";

const DEFAULT_LIMIT = 5;

function todayKey(chapterId) {
  const d = new Date();
  const day = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  return `reussimaths_quota_${chapterId}_${day}`;
}

// Quota quotidien de questions gratuites pour les chapitres "freemium"
// (ex: Automatismes, meta.freemiumDaily). Stocké en local (par navigateur) —
// aucun compte requis pour essayer l'app. Simple et suffisant pour une v1 ;
// un utilisateur averti peut le contourner en vidant son navigateur, mais un
// abonnement actif rend de toute façon le quota illimité (voir ChapterRunner).
export function useDailyQuota(chapterId, limit = DEFAULT_LIMIT) {
  const key = todayKey(chapterId);
  const [count, setCount] = useState(() => Number(localStorage.getItem(key) ?? 0));

  const consume = useCallback(() => {
    setCount((c) => {
      const next = c + 1;
      localStorage.setItem(key, String(next));
      return next;
    });
  }, [key]);

  const remaining = Math.max(0, limit - count);
  return { remaining, used: count, limit, consume, exhausted: remaining <= 0 };
}
