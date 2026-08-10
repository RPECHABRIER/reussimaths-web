import { useEffect, useState } from "react";
import { getLearningReviews, mergeLearningReviews } from "../lib/learningReviewHistory";
import { supabase } from "../lib/supabaseClient";

export function useLearningReviews(userId) {
  const [reviews, setReviews] = useState(() => getLearningReviews());
  useEffect(() => {
    const refresh = () => setReviews(getLearningReviews());
    window.addEventListener("storage", refresh);
    window.addEventListener("reussimaths:learning-reviews", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("reussimaths:learning-reviews", refresh);
    };
  }, []);
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    supabase.from("learning_review_cards").select("id,payload,reviewed_at").eq("user_id", userId).gte("reviewed_at", since).order("reviewed_at", { ascending: false }).limit(30).then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        if (error.code !== "42P01") console.error("[useLearningReviews] chargement :", error.message);
        return;
      }
      setReviews((local) => mergeLearningReviews(local, data));
    });
    return () => { cancelled = true; };
  }, [userId]);
  return reviews;
}
