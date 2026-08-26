import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  RECOMMENDED_STARTING_CHAPTERS,
  getRecommendedStartingChapter,
} from "../src/lib/recommendedStartingChapters.js";

const EXPECTED_RECOMMENDATIONS = {
  sixieme: "nombres-decimaux",
  cinquieme: "operations-sur-les-nombres",
  quatrieme: "addition-soustraction-rationnels",
  troisieme: "calcul-litteral-troisieme",
  seconde: "nombres-calculs-seconde",
  "premiere-spe": "second-degre",
  "premiere-non-spe": "analyse-information-chiffree-premiere-non-spe",
  "premiere-techno": "reviser-les-bases-premiere-techno",
  "terminale-spe": "suites-terminale-spe",
  "terminale-techno": "reviser-les-bases-terminale-techno",
};

test("chaque niveau a exactement la vitrine de rentrée attendue", () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(RECOMMENDED_STARTING_CHAPTERS).map(([levelId, value]) => [levelId, value.chapterId])),
    EXPECTED_RECOMMENDATIONS,
  );

  for (const [levelId, chapterId] of Object.entries(EXPECTED_RECOMMENDATIONS)) {
    const chapters = [{ meta: { id: chapterId, level: levelId } }];
    const recommendation = getRecommendedStartingChapter(levelId, chapters);
    assert.equal(recommendation?.chapterId, chapterId);
    assert.equal(recommendation?.chapter.meta.level, levelId);
  }
});

test("le hero exprime la promesse et conserve le même point d'entrée", async () => {
  const source = await readFile(new URL("../src/pages/CycleSelect.jsx", import.meta.url), "utf8");
  assert.match(source, /Maths de la 6e à la Terminale/);
  assert.match(source, /Entraîne-toi sur ce que tu fais en classe/);
  assert.match(source, /Choisir mon niveau et commencer/);
  assert.match(source, /Première série gratuite/);
  assert.match(source, /Sans carte bancaire/);
  assert.match(source, /Corrections expliquées/);
  assert.match(source, /to: "\/niveaux\?objectif=essai"/);
});

test("le choix du niveau mène à la valeur immédiatement tout en gardant la personnalisation", async () => {
  const source = await readFile(new URL("../src/pages/LevelSelect.jsx", import.meta.url), "utf8");
  assert.match(source, /Commencer ma série gratuite/);
  assert.match(source, /trialSource: "homepage_direct"/);
  assert.match(source, /Personnaliser mon entraînement avec un diagnostic/);
  assert.match(source, /trialSource: "diagnostic"/);
});
