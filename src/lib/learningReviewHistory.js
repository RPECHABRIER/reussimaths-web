const STORAGE_KEY = "reussimaths_learning_reviews_v1";
const MAX_REVIEWS = 30;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function reviewKey(review) {
  const source = `${review.family}|${review.chapter}|${review.prompt}`;
  let hash = 5381;
  for (let index = 0; index < source.length; index += 1) hash = ((hash << 5) + hash) ^ source.charCodeAt(index);
  return `review-${(hash >>> 0).toString(36)}`;
}

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

export function rememberLearningReview({ exercise, response, feedback, levelId = null, correct = null, assisted = null, autonomous = null, hadError = null, recovered = null, methodStatus = "available" }) {
  if (!exercise || !feedback || typeof localStorage === "undefined") return;
  const review = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    levelId,
    correct, assisted, autonomous, hadError, recovered, methodStatus,
    expectedAnswer: exercise.answer,
    exerciseType: exercise.type,
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
  const duplicate = previous.find((item) => item.prompt === review.prompt && item.chapter === review.chapter && Date.now() - item.createdAt < 60_000);
  // Une carte affichée plus tard ne doit ni effacer une erreur observée,
  // ni inventer l'autonomie des historiques antérieurs au contrat P0-B.
  const storedReview = duplicate ? {
    ...review, id: duplicate.id, createdAt: duplicate.createdAt,
    correct: correct ?? duplicate.correct ?? null,
    assisted: assisted ?? duplicate.assisted ?? null,
    autonomous: autonomous ?? duplicate.autonomous ?? null,
    hadError: Boolean(hadError || duplicate.hadError || correct === false),
    recovered: recovered ?? duplicate.recovered ?? null,
    methodStatus: methodStatus === "consulted" || duplicate.methodStatus === "consulted" ? "consulted" : "available",
  } : { ...review, hadError: hadError ?? (correct === false ? true : null) };
  const next = duplicate ? [storedReview, ...previous.filter((item) => item.id !== duplicate.id)] : [storedReview, ...previous];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, MAX_REVIEWS)));
    window.dispatchEvent(new Event("reussimaths:learning-reviews"));
  } catch { /* stockage indisponible : la séance reste utilisable */ }
  return storedReview;
}

export function toRemoteLearningReview(review) {
  if (!review) return null;
  // La réponse brute de l'élève reste volontairement sur son appareil.
  const { response: _response, id: _id, ...safePayload } = review;
  return { reviewKey: reviewKey(review), payload: safePayload };
}

export function mergeLearningReviews(localReviews, remoteRows) {
  const merged = [...localReviews];
  for (const row of remoteRows ?? []) {
    const item = { ...row.payload, id: `remote-${row.id}`, createdAt: new Date(row.reviewed_at).getTime() };
    if (!merged.some((review) => review.prompt === item.prompt && review.family === item.family && Math.abs(review.createdAt - item.createdAt) < 60_000)) merged.push(item);
  }
  return merged.sort((a, b) => b.createdAt - a.createdAt).slice(0, MAX_REVIEWS);
}
