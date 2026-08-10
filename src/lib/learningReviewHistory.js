const STORAGE_KEY = "reussimaths_learning_reviews_v1";
const MAX_REVIEWS = 30;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function getLearningReviews() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    const since = Date.now() - WEEK_MS;
    return parsed.filter((item) => Number(item?.createdAt) >= since).slice(0, MAX_REVIEWS);
  } catch {
    return [];
  }
}

export function rememberLearningReview({ exercise, response, feedback }) {
  if (!exercise || !feedback || typeof localStorage === "undefined") return;
  const review = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    chapter: String(exercise.chapter ?? "Notion travaillée").slice(0, 180),
    prompt: String(exercise.prompt ?? "").slice(0, 500),
    response: Array.isArray(response) ? response.join(" ; ") : String(response ?? ""),
    family: feedback.family,
    intro: feedback.intro,
    meaning: feedback.meaning,
    rule: feedback.rule,
    conclusion: feedback.conclusion,
    steps: feedback.steps,
  };
  const previous = getLearningReviews();
  const duplicate = previous.find((item) => item.prompt === review.prompt && item.response === review.response && Date.now() - item.createdAt < 60_000);
  if (duplicate) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([review, ...previous].slice(0, MAX_REVIEWS)));
  window.dispatchEvent(new Event("reussimaths:learning-reviews"));
}
