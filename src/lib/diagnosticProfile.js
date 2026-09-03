const STORAGE_PREFIX = "reussimaths_diagnostic_profile_v2_";

export function setDiagnosticProfile(levelId, results) {
  if (!levelId) return;
  // Les anciens résultats positionnels ne permettent pas une remédiation fiable.
  const cleanResults = (results ?? []).filter((result) => result.questionId && result.skillId && result.remediationChapterId).map((result) => ({ ...result, correct: Boolean(result.correct) }));
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${levelId}`, JSON.stringify({ results: cleanResults, completedAt: new Date().toISOString() }));
  } catch { /* stockage indisponible : le diagnostic reste utilisable */ }
}

export function getDiagnosticRemediationIds(levelId) {
  try {
    const profile = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${levelId}`) ?? "null");
    return (profile?.results ?? []).filter((result) => !result.correct).map((result) => result.remediationChapterId);
  } catch {
    return [];
  }
}
