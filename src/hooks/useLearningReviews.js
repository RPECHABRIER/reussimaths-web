import { useEffect, useState } from "react";
import { getLearningReviews } from "../lib/learningReviewHistory";

export function useLearningReviews() {
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
  return reviews;
}
