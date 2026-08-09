const STORAGE_PREFIX = "reussimaths_study_programme_";

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
}

export function getSelectedStudyChapterIds(levelId) {
  return Object.keys(getStudyProgramme(levelId));
}
