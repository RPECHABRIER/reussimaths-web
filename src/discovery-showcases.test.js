import assert from "node:assert/strict";
import test from "node:test";
import { getAllDiscoveryShowcases, getDiagnosticShowcaseExercises } from "./discoveryShowcases.js";
import { buildPedagogicalFeedback } from "./lib/pedagogicalFeedback.js";

const LEVEL_IDS = ["sixieme", "cinquieme", "quatrieme", "troisieme", "seconde", "premiere-spe", "premiere-non-spe", "premiere-techno", "terminale-spe", "terminale-techno"];

test("chaque niveau possède exactement cinq questions vitrines", () => {
  const showcases = getAllDiscoveryShowcases();
  assert.deepEqual(showcases.map((chapter) => chapter.meta.level), LEVEL_IDS);
  for (const showcase of showcases) {
    assert.equal(showcase.showcaseExercises.length, 5, showcase.meta.level);
  }
});

test("les cinquante questions sont complètes, uniques et corrigées spécifiquement", () => {
  const prompts = new Set();
  for (const showcase of getAllDiscoveryShowcases()) {
    for (const exercise of showcase.showcaseExercises) {
      assert.ok(["numeric", "text", "qcm", "multi"].includes(exercise.type), `${showcase.meta.level}: type`);
      assert.ok(exercise.prompt?.length >= 12, `${showcase.meta.level}: énoncé`);
      assert.ok(exercise.answer !== null && exercise.answer !== undefined && exercise.answer !== "", `${showcase.meta.level}: réponse`);
      assert.ok(Array.isArray(exercise.steps) && exercise.steps.length >= 3, `${showcase.meta.level}: étapes`);
      assert.ok(exercise.steps.every((step) => String(step).trim().endsWith(".")), `${showcase.meta.level}: ponctuation`);
      assert.ok(!prompts.has(exercise.prompt), `doublon: ${exercise.prompt}`);
      prompts.add(exercise.prompt);
      const wrongResponse = exercise.type === "numeric" ? "999999" : exercise.type === "qcm" ? exercise.options.find((option) => option !== exercise.answer) : "réponse erronée";
      const feedback = buildPedagogicalFeedback(exercise, wrongResponse);
      assert.notEqual(feedback.family, "general", `${showcase.meta.level}: ${exercise.chapter}`);
      assert.ok(feedback.meaning.length >= 80, `${showcase.meta.level}: explication trop courte`);
      assert.ok(feedback.rule.length >= 35, `${showcase.meta.level}: méthode trop courte`);
      assert.ok(feedback.conclusion.includes(String(exercise.answerDisplay ?? exercise.answer).replace(".", ",")), `${showcase.meta.level}: conclusion`);
    }
  }
  assert.equal(prompts.size, 50);
});

test("le parcours découverte utilise la séquence auditée et explique aussi les réussites", async () => {
  const { readFile } = await import("node:fs/promises");
  const runner = await readFile(new URL("./components/ChapterRunner.jsx", import.meta.url), "utf8");
  const feedback = await readFile(new URL("./components/LearningFeedback.jsx", import.meta.url), "utf8");
  assert.match(runner, /showcaseExercises/);
  assert.match(runner, /feedback\.correct && isDiscoverySession/);
  assert.match(runner, /answeredCount \+ \(feedback \? 0 : 1\)/);
  assert.match(feedback, /cette réponse est correcte/);
});

test("les diagnostics des dix niveaux utilisent cinq questions auditées", () => {
  for (const levelId of LEVEL_IDS) {
    for (const currentCount of [0, 2]) {
      const exercises = getDiagnosticShowcaseExercises(levelId, currentCount);
      assert.equal(exercises.length, 5, `${levelId}: ${currentCount} chapitre actuel`);
      exercises.forEach((exercise, index) => {
        const feedback = buildPedagogicalFeedback(exercise, exercise.type === "numeric" ? "999999" : "réponse erronée");
        assert.notEqual(feedback.family, "general", `${levelId}, question ${index + 1}`);
        assert.ok(exercise.steps.length >= 3, `${levelId}, question ${index + 1}: étapes`);
        assert.ok(feedback.meaning.length >= 75, `${levelId}, question ${index + 1}: explication`);
      });
    }
  }
});
