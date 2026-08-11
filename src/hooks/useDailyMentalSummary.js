import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function isoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function recentDates(count) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    return isoDate(date);
  });
}

function periodStats(rows, dates) {
  const dateSet = new Set(dates);
  const periodRows = rows.filter((row) => dateSet.has(row.session_date));
  const days = new Set(periodRows.map((row) => row.session_date)).size;
  const average = periodRows.length ? Math.round((periodRows.reduce((sum, row) => sum + row.score, 0) / periodRows.length) * 10) / 10 : null;
  const best = periodRows.length ? Math.max(...periodRows.map((row) => row.score)) : null;
  return { days, sessions: periodRows.length, average, best };
}

export function buildDailyMentalSummary(rows = []) {
  const dates14 = recentDates(14);
  const previousDates = dates14.slice(0, 7);
  const currentDates = dates14.slice(7);
  const bestByDate = new Map();
  rows.forEach((row) => bestByDate.set(row.session_date, Math.max(bestByDate.get(row.session_date) ?? 0, row.score)));
  const current = periodStats(rows, currentDates);
  const previous = periodStats(rows, previousDates);
  const trend = current.average === null || previous.average === null ? null : Math.round((current.average - previous.average) * 10) / 10;
  return { current, previous, trend, days: currentDates.map((date) => ({ date, score: bestByDate.get(date) ?? null })) };
}

export function useDailyMentalSummary(userId) {
  const [state, setState] = useState({ loading: Boolean(userId), summary: null, error: null });
  useEffect(() => {
    if (!userId) { setState({ loading: false, summary: null, error: null }); return undefined; }
    let cancelled = false;
    setState((current) => ({ ...current, loading: true, error: null }));
    supabase.from("daily_mental_sessions").select("session_date, level_id, score, total, attempts").eq("user_id", userId).gte("session_date", recentDates(14)[0]).order("session_date", { ascending: false }).then(({ data, error }) => {
      if (cancelled) return;
      if (error) { console.error("[useDailyMentalSummary] daily_mental_sessions error:", error.message); setState({ loading: false, summary: null, error }); return; }
      setState({ loading: false, summary: buildDailyMentalSummary(data ?? []), error: null });
    });
    return () => { cancelled = true; };
  }, [userId]);
  return state;
}
