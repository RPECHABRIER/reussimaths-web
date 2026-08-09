import { CM2_REMEDIATION } from "./prerequisites";

const STORAGE_PREFIX = "reussimaths_diagnostic_profile_";

export function setDiagnosticProfile(levelId, results) {
  if (!levelId) return;
  const cleanResults = (results ?? []).map((result) => ({
    chapterId: result.chapterId,
    remediationChapterId: CM2_REMEDIATION[result.chapterId] ?? result.chapterId,
    correct: !!result.correct,
  }));
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
