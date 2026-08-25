import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  BACK_TO_SCHOOL_SHOWCASES,
  correctWowMessage,
  PEDAGOGY_GENERALIZATION_LOT_1,
  PEDAGOGY_GENERALIZATION_LOT_2,
  PEDAGOGY_GENERALIZATION_LOT_3,
  PEDAGOGY_GENERALIZATION_LOT_4A,
  PEDAGOGY_GENERALIZATION_LOT_4B,
  PEDAGOGY_GENERALIZATION_LOT_5A,
  PEDAGOGY_GENERALIZATION_LOT_5B,
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
  proportionnalite: "proportionnalite",
  triangles: "triangles",
  "proportionnalite-troisieme": "proportionnalite-troisieme",
  "statistiques-troisieme": "statistiques-troisieme",
  "vecteurs-seconde": "vecteurs-seconde",
  "colinearite-vecteurs-seconde": "colinearite-vecteurs-seconde",
  "vecteurs-produit-scalaire-premiere-spe": "vecteurs-produit-scalaire-premiere-spe",
  "croissance-exponentielle-premiere-non-spe": "croissance-exponentielle-premiere-non-spe",
  "modelisation-quadratique-premiere-non-spe": "modelisation-quadratique-premiere-non-spe",
  "probabilites-quatrieme": "probabilites-quatrieme",
  "trigonometrie-premiere-spe": "trigonometrie-premiere-spe",
  "variations-instantanees-premiere-non-spe": "variations-instantanees-premiere-non-spe",
  "probabilites-conditionnelles-premiere-techno": "probabilites-conditionnelles-premiere-techno",
  "epreuves-independantes-premiere-techno": "epreuves-independantes-premiere-techno",
  "orthogonalite-distances-espace-terminale-spe": "orthogonalite-distances-espace-terminale-spe",
  "limites-fonctions-terminale-spe": "limites-fonctions-terminale-spe",
  "continuite-terminale-spe": "continuite-terminale-spe",
  "automatismes-terminale-techno": "automatismes-terminale-techno",
  "probabilites-conditionnelles-terminale-techno": "probabilites-conditionnelles-terminale-techno",
  "variables-aleatoires-terminale-techno": "variables-aleatoires-terminale-techno",
  "notion-fonctions": "notion-fonctions",
  "proportionnalite-quatrieme": "proportionnalite-quatrieme",
  "theoreme-thales": "theoreme-thales",
  "probabilites-troisieme": "probabilites-troisieme",
  "thales-triangles-semblables-troisieme": "thales-triangles-semblables-troisieme",
  "trigonometrie-triangle-rectangle-troisieme": "trigonometrie-triangle-rectangle-troisieme",
  "mesures-grandeurs-troisieme": "mesures-grandeurs-troisieme",
  "equations-droites-seconde": "equations-droites-seconde",
  "informations-chiffrees-seconde": "informations-chiffrees-seconde",
  "statistiques-descriptives-seconde": "statistiques-descriptives-seconde",
  "transformations-plan-troisieme": "transformations-plan-troisieme",
  "geometrie-espace-troisieme": "geometrie-espace-troisieme",
  "geometrie-reperee-premiere-spe": "geometrie-reperee-premiere-spe",
  "probabilites-conditionnelles-premiere-spe": "probabilites-conditionnelles-premiere-spe",
  "complements-derivation-terminale-spe": "complements-derivation-terminale-spe",
  "logarithme-neperien-terminale-spe": "logarithme-neperien-terminale-spe",
  "fonctions-trigonometriques-terminale-spe": "fonctions-trigonometriques-terminale-spe",
  "primitives-equations-differentielles-terminale-spe": "primitives-equations-differentielles-terminale-spe",
  "loi-binomiale-terminale-spe": "loi-binomiale-terminale-spe",
  "sommes-variables-aleatoires-terminale-spe": "sommes-variables-aleatoires-terminale-spe",
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

test("le lot 4A couvre les dix chapitres autorisés, dont un profil déjà validé au lot 3", () => {
  assert.equal(PEDAGOGY_GENERALIZATION_LOT_4A.length, 10);
  for (const chapter of PEDAGOGY_GENERALIZATION_LOT_4A) {
    assert.ok(chapter.diagnosticCount >= 3 && chapter.diagnosticCount <= 6, chapter.chapterId);
  }
  assert.ok(PEDAGOGY_GENERALIZATION_LOT_3.some(({ chapterId }) => chapterId === "fonctions-second-degre-premiere-techno"));
});

test("vingt générations par chapitre du lot 4A conservent le contenu et exposent deux aides", async () => {
  for (const chapterRow of PEDAGOGY_GENERALIZATION_LOT_4A) {
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

test("la proportionnalité 6e et 3e privilégie le sens et les coefficients au produit en croix", async () => {
  for (const file of ["proportionnalite", "proportionnalite-troisieme"]) {
    const { default: chapter } = await import(`../src/chapters/${file}.js`);
    for (let index = 0; index < 200; index += 1) {
      const prepared = prepareWowExercise(chapter, chapter.generate());
      const guidance = `${prepared.hints?.join(" ")} ${prepared.feedback?.default}`;
      assert.doesNotMatch(guidance, /produit en croix/i);
      assert.match(guidance, /unité|relation|multiplicat|coefficient|rapport|proportion|taux|total|référence|tout|100/i);
    }
  }
});

test("statistiques et produit scalaire gardent un feedback fiable lorsque le raisonnement est ambigu", async () => {
  for (const file of ["statistiques-troisieme", "vecteurs-produit-scalaire-premiere-spe"]) {
    const { default: chapter } = await import(`../src/chapters/${file}.js`);
    for (let index = 0; index < 100; index += 1) {
      const prepared = prepareWowExercise(chapter, chapter.generate());
      const guidance = `${prepared.hints?.join(" ")} ${prepared.feedback?.default}`;
      assert.doesNotMatch(guidance, /tu as (?:oublié|confondu)|ton erreur/i);
    }
  }
});

test("le lot 4B contient exactement les onze chapitres sensibles autorisés", () => {
  assert.equal(PEDAGOGY_GENERALIZATION_LOT_4B.length, 11);
  for (const chapter of PEDAGOGY_GENERALIZATION_LOT_4B) {
    assert.ok(chapter.diagnosticCount >= 3 && chapter.diagnosticCount <= 6, chapter.chapterId);
  }
});

test("vingt générations par chapitre du lot 4B conservent le contenu et exposent deux aides", async () => {
  for (const chapterRow of PEDAGOGY_GENERALIZATION_LOT_4B) {
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

test("probabilités et binomiale vérifient leur univers et leurs hypothèses sans faux diagnostic", async () => {
  const files = [
    "probabilites-quatrieme",
    "probabilites-conditionnelles-premiere-techno",
    "epreuves-independantes-premiere-techno",
    "probabilites-conditionnelles-terminale-techno",
    "variables-aleatoires-terminale-techno",
  ];
  for (const file of files) {
    const { default: chapter } = await import(`../src/chapters/${file}.js`);
    for (let index = 0; index < 200; index += 1) {
      const prepared = prepareWowExercise(chapter, chapter.generate());
      const guidance = `${prepared.hints?.join(" ")} ${prepared.feedback?.default}`;
      assert.doesNotMatch(guidance, /tu as (?:oublié|confondu)|ton erreur/i);
      assert.match(guidance, /univers|événement|issue|référence|condition|branche|chemin|indépend|succès|épreuve|probabilit|valeurs de X|coefficient|espérance|binomial|répétition/i);
    }
  }
});

test("limites et continuité conservent les garde-fous conceptuels", async () => {
  const { default: limits } = await import("../src/chapters/limites-fonctions-terminale-spe.js");
  const { default: continuity } = await import("../src/chapters/continuite-terminale-spe.js");
  const limitGuidance = [];
  const continuityGuidance = [];
  for (let index = 0; index < 1000; index += 1) {
    const limit = prepareWowExercise(limits, limits.generate());
    const continuous = prepareWowExercise(continuity, continuity.generate());
    limitGuidance.push(`${limit.hints?.join(" ")} ${limit.feedback?.default}`);
    continuityGuidance.push(`${continuous.hints?.join(" ")} ${continuous.feedback?.default}`);
  }
  assert.ok(limitGuidance.some((text) => /forme indéterminée/i.test(text)));
  assert.ok(limitGuidance.some((text) => /valeur interdite seule ne prouve pas une asymptote/i.test(text)));
  assert.ok(continuityGuidance.some((text) => /existence, pas toujours l’unicité/i.test(text)));
  assert.ok(continuityGuidance.some((text) => /stricte monotonie/i.test(text)));
});

test("variations instantanées ne déduit jamais un extremum de f'(a)=0 seul", async () => {
  const { default: chapter } = await import("../src/chapters/variations-instantanees-premiere-non-spe.js");
  const prepared = prepareWowExercise(chapter, {
    type: "numeric",
    chapter: "Variations instantanées — Extremum",
    prompt: "Étudier un extremum à partir de la dérivée.",
    answer: 0,
    steps: [{ type: "methode", text: "Étudier le signe de la dérivée." }],
  });
  const guidance = `${prepared.hints.join(" ")} ${prepared.feedback.default}`;
  assert.match(guidance, /signe|variation/i);
  assert.match(guidance, /ne suffit pas/i);
});

test("le lot 5A contient exactement les dix chapitres autorisés", () => {
  assert.equal(PEDAGOGY_GENERALIZATION_LOT_5A.length, 10);
  assert.equal(new Set(PEDAGOGY_GENERALIZATION_LOT_5A.map(({ chapterId }) => chapterId)).size, 10);
  for (const chapter of PEDAGOGY_GENERALIZATION_LOT_5A) {
    assert.ok(chapter.diagnosticCount >= 3 && chapter.diagnosticCount <= 6, chapter.chapterId);
  }
});

test("vingt générations par chapitre du lot 5A préservent le contenu et exposent deux aides", async () => {
  for (const chapterRow of PEDAGOGY_GENERALIZATION_LOT_5A) {
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

test("les profils sensibles du lot 5A restent conceptuels lorsque la réponse est ambiguë", async () => {
  const files = [
    "notion-fonctions",
    "probabilites-troisieme",
    "statistiques-descriptives-seconde",
    "mesures-grandeurs-troisieme",
  ];
  for (const file of files) {
    const { default: chapter } = await import(`../src/chapters/${file}.js`);
    for (let index = 0; index < 200; index += 1) {
      const prepared = prepareWowExercise(chapter, chapter.generate());
      const guidance = `${prepared.hints?.join(" ")} ${prepared.feedback?.default}`;
      assert.doesNotMatch(guidance, /tu as (?:oublié|confondu)|ton erreur|tu as utilisé/i);
    }
  }
});

test("Thalès et trigonométrie vérifient la configuration avant la formule", async () => {
  const files = ["theoreme-thales", "thales-triangles-semblables-troisieme", "trigonometrie-triangle-rectangle-troisieme"];
  for (const file of files) {
    const { default: chapter } = await import(`../src/chapters/${file}.js`);
    for (let index = 0; index < 200; index += 1) {
      const prepared = prepareWowExercise(chapter, chapter.generate());
      const guidance = `${prepared.hints?.join(" ")} ${prepared.feedback?.default}`;
      assert.match(guidance, /triangle|alignement|parallél|configuration|angle|côté|hypoténuse/i);
    }
  }
});

test("la proportionnalité 4e n'impose pas le produit en croix", async () => {
  const { default: chapter } = await import("../src/chapters/proportionnalite-quatrieme.js");
  for (let index = 0; index < 300; index += 1) {
    const prepared = prepareWowExercise(chapter, chapter.generate());
    const guidance = `${prepared.hints?.join(" ")} ${prepared.feedback?.default}`;
    assert.doesNotMatch(guidance, /produit en croix/i);
    assert.match(guidance, /unité|coefficient|relation|grandeur|rapport|origine|longueur|aire|volume|référence|tableau/i);
  }
});

test("le lot 5B contient exactement les dix chapitres sensibles autorisés", () => {
  assert.equal(PEDAGOGY_GENERALIZATION_LOT_5B.length, 10);
  assert.equal(new Set(PEDAGOGY_GENERALIZATION_LOT_5B.map(({ chapterId }) => chapterId)).size, 10);
  for (const chapter of PEDAGOGY_GENERALIZATION_LOT_5B) {
    assert.ok(chapter.diagnosticCount >= 3 && chapter.diagnosticCount <= 6, chapter.chapterId);
  }
});

test("vingt générations par chapitre du lot 5B préservent le contenu et exposent deux aides", async () => {
  for (const chapterRow of PEDAGOGY_GENERALIZATION_LOT_5B) {
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

test("les probabilités du lot 5B n'inventent pas le raisonnement et vérifient les hypothèses", async () => {
  for (const file of ["probabilites-conditionnelles-premiere-spe", "loi-binomiale-terminale-spe", "sommes-variables-aleatoires-terminale-spe"]) {
    const { default: chapter } = await import(`../src/chapters/${file}.js`);
    for (let index = 0; index < 300; index += 1) {
      const prepared = prepareWowExercise(chapter, chapter.generate());
      const guidance = `${prepared.hints?.join(" ")} ${prepared.feedback?.default}`;
      assert.doesNotMatch(guidance, /tu as (?:oublié|confondu)|ton erreur|tu as utilisé/i);
      assert.match(guidance, /condition|référence|partition|indépend|Bernoulli|binomial|succès|événement|espérance|variance|covariance|hypothèse/i);
    }
  }
});

test("dérivation, logarithme et équations différentielles conservent leurs garde-fous", async () => {
  const files = ["complements-derivation-terminale-spe", "logarithme-neperien-terminale-spe", "primitives-equations-differentielles-terminale-spe"];
  const texts = new Map(files.map((file) => [file, []]));
  for (const file of files) {
    const { default: chapter } = await import(`../src/chapters/${file}.js`);
    for (let index = 0; index < 2000; index += 1) {
      const prepared = prepareWowExercise(chapter, chapter.generate());
      texts.get(file).push(`${prepared.hints?.join(" ")} ${prepared.feedback?.default}`);
    }
  }
  const { default: derivationChapter } = await import("../src/chapters/complements-derivation-terminale-spe.js");
  const extremum = prepareWowExercise(derivationChapter, {
    type: "numeric",
    chapter: "Compléments sur la dérivation — Extremum",
    prompt: "Étudier un extremum à partir de la dérivée.",
    answer: 0,
    steps: [{ type: "methode", text: "Étudier le signe de la dérivée." }],
  });
  const derivation = `${extremum.hints.join(" ")} ${extremum.feedback.default}`;
  assert.match(derivation, /dérivée nulle ne suffit pas|changement de variation/i);
  assert.doesNotMatch(derivation, /f'\(a\)=0 (?:implique|prouve|donne) un extremum/i);
  const logarithm = texts.get("logarithme-neperien-terminale-spe").join(" ");
  assert.match(logarithm, /strictement positif|a,b>0/i);
  assert.match(logarithm, /aucune formule analogue n’existe pour ln\(a\+b\)/i);
  const differential = texts.get("primitives-equations-differentielles-terminale-spe").join(" ");
  assert.match(differential, /primitive se vérifie en la dérivant/i);
  assert.match(differential, /équation homogène|solution particulière/i);
  assert.match(differential, /dérivation et substitution/i);
});

test("les profils géométriques du lot 5B restent conceptuels sans nouveau moteur", async () => {
  for (const file of ["transformations-plan-troisieme", "geometrie-espace-troisieme", "geometrie-reperee-premiere-spe"]) {
    const { default: chapter } = await import(`../src/chapters/${file}.js`);
    for (let index = 0; index < 300; index += 1) {
      const prepared = prepareWowExercise(chapter, chapter.generate());
      const guidance = `${prepared.hints?.join(" ")} ${prepared.feedback?.default}`;
      assert.doesNotMatch(guidance, /tu as (?:oublié|confondu)|ton erreur/i);
      assert.match(guidance, /transformation|centre|rapport|solide|sphère|section|droite|cercle|distance|équation|vecteur|coordonnée|rayon|volume|angle/i);
    }
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
