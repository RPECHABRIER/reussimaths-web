const STORAGE_PREFIX = "reussimaths_study_programme_";
const CONFIGURED_PREFIX = "reussimaths_study_programme_configured_";

export const STUDY_STATUSES = {
  CURRENT: "current",
  COMPLETED: "completed",
};

export function getStudyProgramme(levelId) {
  if (!levelId) return {};
  try {
    const value = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${levelId}`) ?? "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

export function setStudyProgramme(levelId, selections) {
  if (!levelId) return;
  const clean = Object.fromEntries(
    Object.entries(selections ?? {}).filter(([, status]) => Object.values(STUDY_STATUSES).includes(status)),
  );
  localStorage.setItem(`${STORAGE_PREFIX}${levelId}`, JSON.stringify(clean));
  localStorage.setItem(`${CONFIGURED_PREFIX}${levelId}`, "1");
}

export function hasConfiguredStudyProgramme(levelId) {
  try { return localStorage.getItem(`${CONFIGURED_PREFIX}${levelId}`) === "1"; }
  catch { return false; }
}

export function getSelectedStudyChapterIds(levelId) {
  return Object.keys(getStudyProgramme(levelId));
}
