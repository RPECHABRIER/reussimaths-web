// ---------------------------------------------------------------------------
// Comparaison de réponses pour les types d'exercices "text" et "multi" (voir
// ChapterRunner.jsx / MiniDuel.jsx). Centralisé ici pour que les deux
// composants utilisent exactement la même logique de correction.
// ---------------------------------------------------------------------------

// Normalise une chaîne pour la comparaison : espaces, casse, accents ignorés.
// Ex: normalizeText("  Losange ") === normalizeText("losange") === "losange"
export function normalizeText(s) {
  return s
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ");
}

// exercise.answer peut être une chaîne unique ou un tableau de réponses
// acceptées (synonymes/variantes), ex: answer: ["parallélogramme", "losange"].
export function matchesText(input, answer) {
  if (input == null || input.toString().trim() === "") return false;
  const accepted = Array.isArray(answer) ? answer : [answer];
  const norm = normalizeText(input);
  return accepted.some((a) => normalizeText(a) === norm);
}

// Pour le type "multi" : answer est un tableau d'index (dans exercise.options)
// des réponses correctes. Comparaison en ensemble, insensible à l'ordre.
export function matchesMulti(selectedIndexes, answerIndexes) {
  const a = [...selectedIndexes].sort((x, y) => x - y);
  const b = [...answerIndexes].sort((x, y) => x - y);
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
