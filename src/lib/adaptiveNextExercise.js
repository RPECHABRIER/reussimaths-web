const TIERS = ["facile", "standard", "expert"];

const METHOD_ERRORS = new Set([
  "choice_confusion",
  "incomplete_reasoning",
  "vocabulary_or_reasoning",
  "unknown",
]);

function moveDifficulty(current, delta) {
  const index = Math.max(0, TIERS.indexOf(current));
  return TIERS[Math.max(0, Math.min(TIERS.length - 1, index + delta))];
}

export const ADAPTIVE_REASON_LABELS = {
  repair_method: "Reprendre immédiatement une erreur de méthode",
  verify_similar: "Vérifier la compréhension avec une question très proche",
  repair_previous_error: "Revoir une compétence fragile de la séance",
  consolidate: "Consolider la réussite avec une nouvelle variante",
  spaced_review: "Réviser une compétence arrivée à échéance",
  advance: "Avancer dans le chapitre étudié",
};

// Moteur volontairement déterministe, local et gratuit. Il ne génère aucun
// contenu : il choisit seulement parmi les exercices conçus et audités dans
// RéussiMaths. La décision ne dépend d'aucune donnée nominative.
export function selectAdaptiveNextExercise({
  currentDifficulty = "standard",
  lastAttempt = null,
  consecutiveCorrect = 0,
  dueSkill = null,
  focusSkill = null,
} = {}) {
  if (lastAttempt && !lastAttempt.correct) {
    const methodError = METHOD_ERRORS.has(lastAttempt.errorCode);
    return {
      reason: methodError ? "repair_method" : "verify_similar",
      reasonLabel: ADAPTIVE_REASON_LABELS[methodError ? "repair_method" : "verify_similar"],
      skill: lastAttempt.skill,
      difficulty: methodError ? moveDifficulty(currentDifficulty, -1) : currentDifficulty,
      exerciseStrategy: "same_skill",
    };
  }

  if (dueSkill) {
    return {
      reason: "repair_previous_error",
      reasonLabel: ADAPTIVE_REASON_LABELS.repair_previous_error,
      skill: dueSkill,
      difficulty: currentDifficulty,
      exerciseStrategy: "same_skill",
    };
  }

  if (consecutiveCorrect >= 2 && lastAttempt?.skill) {
    return {
      reason: "consolidate",
      reasonLabel: ADAPTIVE_REASON_LABELS.consolidate,
      skill: lastAttempt.skill,
      difficulty: moveDifficulty(currentDifficulty, 1),
      exerciseStrategy: "same_skill_variant",
    };
  }

  if (focusSkill) {
    return {
      reason: "spaced_review",
      reasonLabel: ADAPTIVE_REASON_LABELS.spaced_review,
      skill: focusSkill,
      difficulty: currentDifficulty,
      exerciseStrategy: "same_skill_variant",
    };
  }

  return {
    reason: "advance",
    reasonLabel: ADAPTIVE_REASON_LABELS.advance,
    skill: null,
    difficulty: currentDifficulty,
    exerciseStrategy: "chapter_progression",
  };
}

export function summarizeAdaptiveDecision(decision) {
  if (!decision) return null;
  return {
    reason: decision.reason,
    reasonLabel: decision.reasonLabel,
    skill: decision.skill,
    difficulty: decision.difficulty,
  };
}
