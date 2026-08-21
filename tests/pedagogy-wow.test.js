import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { correctWowMessage, prepareWowExercise, WOW_SHOWCASES } from "../src/lib/pedagogyWow.js";

const CHAPTER_FILES = {
  fractions: "fractions",
  "proportionnalite-cinquieme": "proportionnalite-cinquieme",
  "triangles-rectangles-quatrieme": "triangles-rectangles-quatrieme",
  "calcul-litteral-troisieme": "calcul-litteral-troisieme",
  "fonctions-affines-seconde": "fonctions-affines-seconde",
  "derivation-premiere-spe": "derivation-premiere-spe",
  "analyse-information-chiffree-premiere-non-spe": "analyse-information-chiffree-premiere-non-spe",
  "statistiques-deux-variables-premiere-techno": "statistiques-deux-variables-premiere-techno",
  "calcul-integral-terminale-spe": "calcul-integral-terminale-spe",
  "statistiques-deux-variables-terminale-techno": "statistiques-deux-variables-terminale-techno",
};

test("les dix niveaux possèdent une vitrine et 3 à 6 diagnostics ciblés", () => {
  assert.equal(WOW_SHOWCASES.length, 10);
  assert.equal(new Set(WOW_SHOWCASES.map((showcase) => showcase.levelId)).size, 10);
  for (const showcase of WOW_SHOWCASES) {
    assert.ok(showcase.diagnosticCount >= 3 && showcase.diagnosticCount <= 6, showcase.chapterId);
  }
});

test("vingt générations par vitrine restent compatibles avec l'aide graduée", async () => {
  for (const showcase of WOW_SHOWCASES) {
    const { default: chapter } = await import(`../src/chapters/${CHAPTER_FILES[showcase.chapterId]}.js`);
    let exercisesWithHints = 0;
    for (let index = 0; index < 20; index += 1) {
      const original = chapter.generate();
      const prepared = prepareWowExercise(chapter, original);
      assert.equal(prepared.prompt, original.prompt);
      assert.equal(prepared.answer, original.answer);
      assert.ok(prepared.wowSuccess);
      if (prepared.hints?.length >= 2) {
        exercisesWithHints += 1;
        assert.ok(prepared.hints[0].length < prepared.hints[1].length + 80);
      }
    }
    assert.ok(exercisesWithHints >= 3, `${showcase.chapterId} doit exposer plusieurs aides ciblées`);
  }
});

test("la réussite autonome après réparation reçoit un message distinct", () => {
  assert.match(correctWowMessage({ wowSuccess: "Exact." }, true), /réussi seul/);
  assert.equal(correctWowMessage({ wowSuccess: "Exact." }, false), "Exact.");
});

test("le moteur conserve retry, question analogue, recovery et progression factuelle", async () => {
  const [runner, celebration] = await Promise.all([
    readFile(new URL("../src/components/ChapterRunner.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/SessionCelebration.jsx", import.meta.url), "utf8"),
  ]);
  assert.match(runner, /attemptsOnExercise <= exercise\.hints\.length/);
  assert.match(runner, /practiceSimilar/);
  assert.match(runner, /trackProductEvent\("recovery_success"/);
  assert.match(runner, /correctWowMessage\(exercise, feedback\.recovered\)/);
  assert.match(runner, /quotaApplies && firstResponseForExercise/);
  assert.match(runner, /assistanceUsedRef\.current = true/);
  assert.match(runner, /sessionCorrectExercisesRef/);
  assert.match(celebration, /Bien maîtrisé/);
  assert.match(celebration, /À renforcer/);
  assert.match(celebration, /Prochaine priorité/);
  assert.match(celebration, /autonomousCorrect/);
});
