import { parseNumericInput } from "./answerMatch.js";

export const LEARNING_ERROR_LABELS = {
  sign_error: "signes",
  place_value_error: "virgule ou valeur de position",
  rounding_error: "arrondis",
  invalid_format: "écriture de la réponse",
  calculation_error: "calcul ou opération",
  choice_confusion: "choix de propriété",
  incomplete_reasoning: "raisonnement incomplet",
  vocabulary_or_reasoning: "vocabulaire ou justification",
  unknown: "méthode à consolider",
};

// Catégories volontairement générales : elles servent à adapter la prochaine
// séance sans enregistrer la réponse brute de l'élève.
export function classifyLearningError(exercise, response) {
  if (!exercise) return "unknown";
  if (exercise.type === "numeric") {
    const actual = parseNumericInput(response);
    const expected = parseNumericInput(exercise.answer);
    if (!Number.isFinite(actual) || !Number.isFinite(expected)) return "invalid_format";
    if (Math.abs(actual + expected) < 0.001) return "sign_error";
    if (expected !== 0) {
      const ratio = Math.abs(actual / expected);
      if ([0.01, 0.1, 10, 100].some((factor) => Math.abs(ratio - factor) < 0.001)) return "place_value_error";
    }
    if (Math.abs(actual - expected) <= 0.1) return "rounding_error";
    return "calculation_error";
  }
  if (exercise.type === "qcm") return "choice_confusion";
  if (exercise.type === "multi") return "incomplete_reasoning";
  if (exercise.type === "text") return "vocabulary_or_reasoning";
  return "unknown";
}
