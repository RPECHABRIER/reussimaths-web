import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  BACK_TO_SCHOOL_SHOWCASES,
  correctWowMessage,
  PEDAGOGY_GENERALIZATION_LOT_1,
  PEDAGOGY_GENERALIZATION_LOT_2,
  PEDAGOGY_GENERALIZATION_LOT_3,
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
  "reviser-les-bases": "reviser-les-bases",
  "automatismes-sixieme": "automatismes-sixieme",
  "operations-decimaux": "operations-decimaux",
  "reviser-les-bases-cinquieme": "reviser-les-bases-cinquieme",
  "automatismes-cinquieme": "automatismes-cinquieme",
  "divisibilite-fractions": "divisibilite-fractions",
  "reviser-les-bases-quatrieme": "reviser-les-bases-quatrieme",
  "automatismes-quatrieme": "automatismes-quatrieme",
  "nombres-relatifs-quatrieme": "nombres-relatifs-quatrieme",
  "reviser-les-bases-troisieme": "reviser-les-bases-troisieme",
  "nombres-entiers-troisieme": "nombres-entiers-troisieme",
  "reviser-les-bases-seconde": "reviser-les-bases-seconde",
  "generalites-fonctions-seconde": "generalites-fonctions-seconde",
  "reviser-les-bases-premiere-spe": "reviser-les-bases-premiere-spe",
  "reviser-les-bases-premiere-non-spe": "reviser-les-bases-premiere-non-spe",
  "automatismes-premiere-techno": "automatismes-premiere-techno",
  "reviser-les-bases-terminale-spe": "reviser-les-bases-terminale-spe",
  "suites-terminale-techno": "suites-terminale-techno",
  "grandeurs-mesures": "grandeurs-mesures",
  "distances-symetries": "distances-symetries",
  angles: "angles",
  puissances: "puissances",
  "calcul-litteral": "calcul-litteral",
  "nombres-relatifs": "nombres-relatifs",
  "multiplication-division-rationnels": "multiplication-division-rationnels",
  "puissances-quatrieme": "puissances-quatrieme",
  "calcul-litteral-quatrieme": "calcul-litteral-quatrieme",
  "automatismes-troisieme": "automatismes-troisieme",
  "calcul-numerique-troisieme": "calcul-numerique-troisieme",
  "equations-troisieme": "equations-troisieme",
  "automatismes-seconde": "automatismes-seconde",
  "variations-fonctions-seconde": "variations-fonctions-seconde",
  "automatismes-premiere-spe": "automatismes-premiere-spe",
  "suites-numeriques-premiere-spe": "suites-numeriques-premiere-spe",
  "automatismes-premiere-non-spe": "automatismes-premiere-non-spe",
  "suites-numeriques-premiere-techno": "suites-numeriques-premiere-techno",
  "automatismes-terminale-spe": "automatismes-terminale-spe",
  "fonctions-exponentielles-terminale-techno": "fonctions-exponentielles-terminale-techno",
  "configurations-geometriques": "configurations-geometriques",
  "organisation-gestion-donnees": "organisation-gestion-donnees",
  "geometrie-espace": "geometrie-espace",
  "symetrie-centrale-parallelogrammes": "symetrie-centrale-parallelogrammes",
  "resolution-equations": "resolution-equations",
  "statistiques-quatrieme": "statistiques-quatrieme",
  "notion-fonction-troisieme": "notion-fonction-troisieme",
  "fonctions-affines-troisieme": "fonctions-affines-troisieme",
  "fonctions-reference-seconde": "fonctions-reference-seconde",
  "reperage-configurations-seconde": "reperage-configurations-seconde",
  "variations-courbes-premiere-spe": "variations-courbes-premiere-spe",
  "fonction-exponentielle-premiere-spe": "fonction-exponentielle-premiere-spe",
  "statistique-probabilites-premiere-non-spe": "statistique-probabilites-premiere-non-spe",
  "croissance-lineaire-premiere-non-spe": "croissance-lineaire-premiere-non-spe",
  "fonctions-second-degre-premiere-techno": "fonctions-second-degre-premiere-techno",
  "derivation-premiere-techno": "derivation-premiere-techno",
  "combinatoire-denombrement-terminale-spe": "combinatoire-denombrement-terminale-spe",
  "vecteurs-droites-plans-espace-terminale-spe": "vecteurs-droites-plans-espace-terminale-spe",
  "logarithme-decimal-terminale-techno": "logarithme-decimal-terminale-techno",
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

test("le lot 1 reste limité à dix-huit chapitres de début d'année avec 3 à 6 familles fiables", () => {
  assert.equal(PEDAGOGY_GENERALIZATION_LOT_1.length, 18);
  for (const chapter of PEDAGOGY_GENERALIZATION_LOT_1) {
    assert.ok(chapter.diagnosticCount >= 3 && chapter.diagnosticCount <= 6, chapter.chapterId);
  }
});

test("vingt générations par chapitre du lot 1 conservent la réponse et reçoivent une aide graduée", async () => {
  for (const chapterRow of PEDAGOGY_GENERALIZATION_LOT_1) {
    const { default: chapter } = await import(`../src/chapters/${CHAPTER_FILES[chapterRow.chapterId]}.js`);
    let targeted = 0;
    for (let index = 0; index < 20; index += 1) {
      const original = chapter.generate();
      const prepared = prepareWowExercise(chapter, original);
      assert.equal(prepared.prompt, original.prompt);
      assert.equal(prepared.answer, original.answer);
      assert.ok(Array.isArray(prepared.steps), chapterRow.chapterId);
      assert.ok(prepared.wowSuccess, chapterRow.chapterId);
      if (prepared.hints?.length >= 2) {
        targeted += 1;
        assert.notEqual(prepared.hints[0], prepared.hints[1]);
        assert.ok(prepared.feedback?.default);
      }
    }
    assert.equal(targeted, 20, `${chapterRow.chapterId}: seulement ${targeted}/20 générations ciblées`);
  }
});

test("le lot 2 contient exactement les vingt chapitres validés avec 3 à 6 familles fiables", () => {
  assert.equal(PEDAGOGY_GENERALIZATION_LOT_2.length, 20);
  for (const chapter of PEDAGOGY_GENERALIZATION_LOT_2) {
    assert.ok(chapter.diagnosticCount >= 3 && chapter.diagnosticCount <= 6, chapter.chapterId);
  }
});

test("vingt générations par chapitre du lot 2 préservent le contenu et exposent deux aides", async () => {
  for (const chapterRow of PEDAGOGY_GENERALIZATION_LOT_2) {
    const { default: chapter } = await import(`../src/chapters/${CHAPTER_FILES[chapterRow.chapterId]}.js`);
    for (let index = 0; index < 20; index += 1) {
      const original = chapter.generate();
      const prepared = prepareWowExercise(chapter, original);
      assert.equal(prepared.prompt, original.prompt);
      assert.equal(prepared.answer, original.answer);
      assert.ok(Array.isArray(prepared.steps) && prepared.steps.length > 0, chapterRow.chapterId);
      assert.equal(prepared.hints?.length >= 2, true, `${chapterRow.chapterId}: aide absente pour ${original.chapter}`);
      assert.notEqual(prepared.hints[0], prepared.hints[1]);
      assert.ok(prepared.feedback?.default);
      assert.ok(prepared.wowSuccess);
    }
  }
});

test("la somme des n premiers entiers reçoit une aide dédiée sans faux vocabulaire de suite", async () => {
  const { default: chapter } = await import("../src/chapters/suites-numeriques-premiere-spe.js");
  let checked = 0;
  for (let draw = 0; draw < 5000 && checked < 20; draw += 1) {
    const original = chapter.generate();
    if (!/Somme des n premiers entiers/i.test(original.chapter)) continue;
    const prepared = prepareWowExercise(chapter, original);
    const guidance = `${prepared.hints.join(" ")} ${prepared.feedback.default}`;
    assert.match(guidance, /n\(n\+1\)\/2/);
    assert.doesNotMatch(guidance, /raison|terme général|récurrence|rang initial/i);
    checked += 1;
  }
  assert.equal(checked, 20);
});

test("le lot 3 contient exactement les dix-neuf chapitres validés avec 3 à 6 familles fiables", () => {
  assert.equal(PEDAGOGY_GENERALIZATION_LOT_3.length, 19);
  for (const chapter of PEDAGOGY_GENERALIZATION_LOT_3) {
    assert.ok(chapter.diagnosticCount >= 3 && chapter.diagnosticCount <= 6, chapter.chapterId);
  }
});

test("vingt générations par chapitre du lot 3 préservent le contenu et exposent deux aides", async () => {
  for (const chapterRow of PEDAGOGY_GENERALIZATION_LOT_3) {
    const { default: chapter } = await import(`../src/chapters/${CHAPTER_FILES[chapterRow.chapterId]}.js`);
    for (let index = 0; index < 20; index += 1) {
      const original = chapter.generate();
      const prepared = prepareWowExercise(chapter, original);
      assert.equal(prepared.prompt, original.prompt);
      assert.equal(prepared.answer, original.answer);
      assert.ok(Array.isArray(prepared.steps) && prepared.steps.length > 0, chapterRow.chapterId);
      assert.equal(prepared.hints?.length >= 2, true, `${chapterRow.chapterId}: aide absente pour ${original.chapter}`);
      assert.notEqual(prepared.hints[0], prepared.hints[1]);
      assert.ok(prepared.feedback?.default);
      assert.ok(prepared.wowSuccess);
    }
  }
});

test("les profils à risque restent conceptuels sans prétendre connaître le raisonnement de l'élève", async () => {
  for (const file of ["statistique-probabilites-premiere-non-spe", "combinatoire-denombrement-terminale-spe"]) {
    const { default: chapter } = await import(`../src/chapters/${file}.js`);
    for (let index = 0; index < 100; index += 1) {
      const prepared = prepareWowExercise(chapter, chapter.generate());
      const guidance = `${prepared.hints?.join(" ")} ${prepared.feedback?.default}`;
      assert.doesNotMatch(guidance, /tu as confondu|ton erreur est|tu as oublié/i);
      assert.match(guidance, /référence|condition|événement|ordre|ordonn|répétition|choix|possibilit|factorielle|coefficient|sous-ensemble|parties/i);
    }
  }
});

test("les profils de dérivation ne déduisent pas un extremum de la seule annulation de la dérivée", async () => {
  for (const file of ["variations-courbes-premiere-spe", "derivation-premiere-techno"]) {
    const { default: chapter } = await import(`../src/chapters/${file}.js`);
    let checked = 0;
    for (let draw = 0; draw < 2000 && checked < 20; draw += 1) {
      const original = chapter.generate();
      if (!/extremum|optimisation|sens de variation/i.test(original.chapter)) continue;
      const prepared = prepareWowExercise(chapter, original);
      const guidance = `${prepared.hints.join(" ")} ${prepared.feedback.default}`;
      assert.match(guidance, /signe|variation/i);
      assert.doesNotMatch(guidance, /f'\(a\)=0 (?:donne|implique|prouve) un extremum/i);
      checked += 1;
    }
    assert.equal(checked, 20, file);
  }
});

test("un ancien chapitre hors profils conserve exactement son exercice", async () => {
  const { default: chapter } = await import("../src/chapters/algorithmique-cinquieme.js");
  const original = chapter.generate();
  assert.equal(prepareWowExercise(chapter, original), original);
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
