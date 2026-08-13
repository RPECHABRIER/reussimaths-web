import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getChapter } from "../chapters/registry";

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function lastNDays(count) {
  const days = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(isoDate(d));
  }
  return days;
}

// ---------------------------------------------------------------------------
// Données du bilan hebdomadaire (voir src/pages/Bilan.jsx) : temps passé,
// notions travaillées, % de réussite, priorités pour la semaine suivante —
// tout ce qui est utile à un parent pour suivre la progression de son
// enfant. Agrège 3 sources :
//   - practice_time (temps, voir usePracticeHeartbeat)
//   - daily_activity (tentatives/réussite du jour, voir useSkillTracking)
//   - skill_mastery (quelles compétences ont été travaillées cette semaine,
//     et lesquelles sont le plus fragiles pour la liste de priorités)
// ---------------------------------------------------------------------------
export function useWeeklySummary(userId, levelId = null) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    if (!userId) {
      setSummary(null);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      const allDays = lastNDays(14);
      const previousDays = allDays.slice(0, 7);
      const days = allDays.slice(7);
      const since = allDays[0];
      const currentSince = days[0];

      const [timeRes, activityRes, skillsRes] = await Promise.all([
        supabase.from("practice_time").select("practice_date, seconds").eq("user_id", userId).gte("practice_date", since),
        supabase.from("daily_activity").select("activity_date, attempts, correct").eq("user_id", userId).gte("activity_date", since),
        supabase
          .from("skill_mastery")
          .select("skill_id, chapter_id, attempts, correct, interval_stage, last_correct, last_practiced_at")
          .eq("user_id", userId)
          .gte("last_practiced_at", new Date(currentSince).toISOString()),
      ]);

      if (cancelled) return;

      if (timeRes.error) console.error("[useWeeklySummary] practice_time error:", timeRes.error.message);
      if (activityRes.error) console.error("[useWeeklySummary] daily_activity error:", activityRes.error.message);
      if (skillsRes.error) console.error("[useWeeklySummary] skill_mastery error:", skillsRes.error.message);
      const loadError = timeRes.error || activityRes.error || skillsRes.error;
      if (loadError) {
        setSummary(null);
        setError(loadError);
        setLoading(false);
        return;
      }

      const secondsByDay = Object.fromEntries((timeRes.data ?? []).map((r) => [r.practice_date, r.seconds]));
      const activityByDay = Object.fromEntries((activityRes.data ?? []).map((r) => [r.activity_date, r]));

      const rowsFor = (dates) => dates.map((date) => ({
        date,
        seconds: secondsByDay[date] ?? 0,
        attempts: activityByDay[date]?.attempts ?? 0,
        correct: activityByDay[date]?.correct ?? 0,
      }));
      const dayRows = rowsFor(days);
      const previousDayRows = rowsFor(previousDays);

      const totalSeconds = dayRows.reduce((s, d) => s + d.seconds, 0);
      const totalAttempts = dayRows.reduce((s, d) => s + d.attempts, 0);
      const totalCorrect = dayRows.reduce((s, d) => s + d.correct, 0);
      const successRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null;
      const activeDays = dayRows.filter((d) => d.attempts > 0 || d.seconds > 0).length;
      const previousSeconds = previousDayRows.reduce((s, d) => s + d.seconds, 0);
      const previousAttempts = previousDayRows.reduce((s, d) => s + d.attempts, 0);
      const previousCorrect = previousDayRows.reduce((s, d) => s + d.correct, 0);
      const previousSuccessRate = previousAttempts > 0 ? Math.round((previousCorrect / previousAttempts) * 100) : null;

      const skillsWorked = (skillsRes.data ?? []).filter(
        (skill) => !levelId || getChapter(skill.chapter_id)?.meta?.level === levelId
      );
      // Priorités pour la semaine suivante : parmi les compétences
      // travaillées cette semaine, celles dont le taux de réussite cumulé
      // est le plus faible (au moins 2 tentatives pour éviter de pointer une
      // simple erreur isolée) — puis, à égalité, la dernière tentative ratée
      // en premier.
      const priorities = [...skillsWorked]
        .filter((s) => s.attempts >= 2)
        .map((s) => ({ ...s, rate: s.correct / s.attempts }))
        .filter((s) => s.rate < 0.75 || !s.last_correct)
        .sort((a, b) => a.rate - b.rate || (a.last_correct === b.last_correct ? 0 : a.last_correct ? 1 : -1))
        .slice(0, 5);

      // Une notion entre dans le palier de consolidation avec plusieurs
      // essais, au moins 75 % de réussite cumulée, une dernière réponse
      // correcte et une prochaine révision repoussée d'au moins 7 jours.
      const consolidatedSkills = [...skillsWorked]
        .filter((s) => s.attempts >= 3 && s.correct / s.attempts >= 0.75 && s.last_correct && s.interval_stage >= 2)
        .sort((a, b) => new Date(b.last_practiced_at) - new Date(a.last_practiced_at));

      setSummary({
        days: dayRows,
        totalSeconds,
        totalAttempts,
        totalCorrect,
        successRate,
        activeDays,
        previousSeconds,
        previousAttempts,
        previousSuccessRate,
        skillsWorked,
        priorities,
        consolidatedSkills,
      });
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, levelId, retryNonce]);

  return { loading, summary, error, reload: () => setRetryNonce((value) => value + 1) };
}
