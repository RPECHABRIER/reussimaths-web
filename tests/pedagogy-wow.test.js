import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  BACK_TO_SCHOOL_SHOWCASES,
  correctWowMessage,
  prepareWowExercise,
  WOW_SHOWCASES,
} from "../src/lib/pedagogyWow.js";

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
  "nombres-decimaux": "nombres-decimaux",
  "operations-sur-les-nombres": "calcul-numerique",
  "addition-soustraction-rationnels": "addition-soustraction-rationnels",
  "nombres-calculs-seconde": "nombres-calculs-seconde",
  "second-degre": "second-degre",
  "reviser-les-bases-premiere-techno": "reviser-les-bases-premiere-techno",
  "suites-terminale-spe": "suites-terminale-spe",
  "reviser-les-bases-terminale-techno": "reviser-les-bases-terminale-techno",
};

test("les dix niveaux possèdent une vitrine et 3 à 6 diagnostics ciblés", () => {
  assert.equal(WOW_SHOWCASES.length, 10);
  assert.equal(new Set(WOW_SHOWCASES.map((showcase) => showcase.levelId)).size, 10);
  for (const showcase of WOW_SHOWCASES) {
    assert.ok(showcase.diagnosticCount >= 3 && showcase.diagnosticCount <= 6, showcase.chapterId);
  }
});

test("les dix vitrines de rentrée couvrent dix niveaux sans remplacer les vitrines annuelles", () => {
  assert.equal(BACK_TO_SCHOOL_SHOWCASES.length, 10);
  assert.equal(new Set(BACK_TO_SCHOOL_SHOWCASES.map((showcase) => showcase.levelId)).size, 10);
  for (const showcase of BACK_TO_SCHOOL_SHOWCASES) {
    assert.ok(showcase.diagnosticCount >= 3 && showcase.diagnosticCount <= 6, showcase.chapterId);
  }
  assert.equal(WOW_SHOWCASES.length, 10);
});

test("vingt générations par vitrine de rentrée conservent les réponses et exposent l’aide graduée", async () => {
  for (const showcase of BACK_TO_SCHOOL_SHOWCASES) {
    const { default: chapter } = await import(`../src/chapters/${CHAPTER_FILES[showcase.chapterId]}.js`);
    let targeted = 0;
    for (let index = 0; index < 20; index += 1) {
      const original = chapter.generate();
      const prepared = prepareWowExercise(chapter, original);
      assert.equal(prepared.prompt, original.prompt);
      assert.equal(prepared.answer, original.answer);
      assert.ok(prepared.wowSuccess, showcase.chapterId);
      if (prepared.hints?.length >= 2) {
        targeted += 1;
        assert.notEqual(prepared.hints[0], prepared.hints[1]);
        assert.ok(prepared.feedback?.default);
      }
    }
    assert.ok(targeted >= 2, `${showcase.chapterId} doit générer plusieurs cas avec deux niveaux d’aide`);
  }
});

test("les nouveaux générateurs techno calculent vingt évolutions successives et vingt taux réciproques chacun", async () => {
  for (const file of ["reviser-les-bases-premiere-techno", "reviser-les-bases-terminale-techno"]) {
    const { default: chapter } = await import(`../src/chapters/${file}.js`);
    const counts = { successive: 0, reciprocal: 0 };
    for (let draw = 0; draw < 5000 && (counts.successive < 20 || counts.reciprocal < 20); draw += 1) {
      const exercise = chapter.generate();
      const rates = [...exercise.prompt.matchAll(/(\d+(?:[,.]\d+)?)\s*%/g)].map((match) => Number(match[1].replace(",", ".")));
      if (/puis (?:diminue|baissé)/i.test(exercise.prompt) && counts.successive < 20) {
        const expected = Math.round((((1 + rates[0] / 100) * (1 - rates[1] / 100) - 1) * 100) * 100) / 100;
        assert.ok(Math.abs(exercise.answer - expected) <= 0.02, exercise.prompt);
        counts.successive += 1;
      } else if (/revenir exactement/i.test(exercise.prompt) && counts.reciprocal < 20) {
        const expected = /Après une hausse/i.test(exercise.prompt)
          ? (1 - 1 / (1 + rates[0] / 100)) * 100
          : (1 / (1 - rates[0] / 100) - 1) * 100;
        assert.ok(Math.abs(exercise.answer - expected) <= 0.02, exercise.prompt);
        counts.reciprocal += 1;
      }
    }
    assert.deepEqual(counts, { successive: 20, reciprocal: 20 }, file);
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
  assert.match(runner, /trackProductEvent\("recovery_opportunity"/);
  assert.match(runner, /recoveryOpportunityTrackedRef\.current\.has\(similarExercise\)/);
  assert.match(runner, /recoveryOpportunityTrackedRef\.current\.add\(similarExercise\)/);
  const opportunityPayload = runner.match(/trackProductEvent\("recovery_opportunity", \{([\s\S]*?)\n\s*\}\);/)?.[1] ?? "";
  assert.match(opportunityPayload, /levelId/);
  assert.match(opportunityPayload, /chapterId/);
  assert.match(opportunityPayload, /skill/);
  assert.match(opportunityPayload, /mode/);
  assert.doesNotMatch(opportunityPayload, /response|input|email|user|url/i);
  assert.match(runner, /correctWowMessage\(exercise, feedback\.recovered\)/);
  assert.match(runner, /quotaApplies && firstResponseForExercise/);
  assert.match(runner, /assistanceUsedRef\.current = true/);
  assert.match(runner, /sessionCorrectExercisesRef/);
  assert.match(celebration, /Bien maîtrisé/);
  assert.match(celebration, /À renforcer/);
  assert.match(celebration, /Prochaine priorité/);
  assert.match(celebration, /autonomousCorrect/);
});
