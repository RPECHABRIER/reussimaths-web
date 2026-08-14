import test from "node:test";
import assert from "node:assert/strict";
import { selectAdaptiveNextExercise } from "../src/lib/adaptiveNextExercise.js";

test("une erreur de méthode déclenche une reprise plus accessible", () => {
  const decision = selectAdaptiveNextExercise({
    currentDifficulty: "standard",
    lastAttempt: { correct: false, errorCode: "choice_confusion", skill: "Thalès" },
  });
  assert.equal(decision.reason, "repair_method");
  assert.equal(decision.skill, "Thalès");
  assert.equal(decision.difficulty, "facile");
});

test("une erreur de calcul déclenche une question très proche", () => {
  const decision = selectAdaptiveNextExercise({
    currentDifficulty: "standard",
    lastAttempt: { correct: false, errorCode: "calculation_error", skill: "Fractions" },
  });
  assert.equal(decision.reason, "verify_similar");
  assert.equal(decision.skill, "Fractions");
  assert.equal(decision.difficulty, "standard");
});

test("une compétence fragile en attente passe avant la consolidation", () => {
  const decision = selectAdaptiveNextExercise({
    currentDifficulty: "standard",
    lastAttempt: { correct: true, skill: "Calcul littéral" },
    consecutiveCorrect: 3,
    dueSkill: "Nombres relatifs",
  });
  assert.equal(decision.reason, "repair_previous_error");
  assert.equal(decision.skill, "Nombres relatifs");
});

test("deux réussites autonomes provoquent une consolidation", () => {
  const decision = selectAdaptiveNextExercise({
    currentDifficulty: "standard",
    lastAttempt: { correct: true, skill: "Pourcentages" },
    consecutiveCorrect: 2,
  });
  assert.equal(decision.reason, "consolidate");
  assert.equal(decision.difficulty, "expert");
});

test("une compétence de révision espacée reste prioritaire", () => {
  const decision = selectAdaptiveNextExercise({ currentDifficulty: "facile", focusSkill: "Équations" });
  assert.equal(decision.reason, "spaced_review");
  assert.equal(decision.skill, "Équations");
});

test("sans fragilité le moteur poursuit le chapitre", () => {
  const decision = selectAdaptiveNextExercise({ currentDifficulty: "standard" });
  assert.equal(decision.reason, "advance");
  assert.equal(decision.exerciseStrategy, "chapter_progression");
});
