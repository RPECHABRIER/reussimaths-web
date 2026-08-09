const LEVEL_KEY = "reussimaths_preferred_level";

export function getPreferredLevel() {
  return localStorage.getItem(LEVEL_KEY);
}

export function setPreferredLevel(levelId) {
  if (levelId) localStorage.setItem(LEVEL_KEY, levelId);
}
