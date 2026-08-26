import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("les trois parcours SEO prioritaires conservent leur cible canonique", async () => {
  const source = await read("../src/seo/publicPages.js");
  assert.match(source, /levelId: "cinquieme"[\s\S]*slug: "proportionnalite"[\s\S]*chapter: proportionnaliteChapter/);
  assert.match(source, /levelId: "quatrieme"[\s\S]*slug: "theoreme-thales"[\s\S]*chapter: thalesChapter/);
  assert.match(source, /levelId: "troisieme"[\s\S]*slug: "fonctions-affines"[\s\S]*chapter: fonctionsAffinesChapter/);
});

test("le CTA SEO ouvre directement l'essai ciblé et gratuit", async () => {
  const source = await read("../src/pages/PublicCoursePage.jsx");
  assert.match(source, /\/parcours\/essai-\$\{page\.levelId\}\/etape\/0\?chapter=/);
  assert.match(source, /trial_source=seo_course/);
  assert.match(source, /Teste-toi gratuitement sur cette notion/);
  assert.doesNotMatch(source, /to=\{`\/chapitre\/\$\{page\.chapterId\}`\}/);
});

test("le choix du niveau propose l'essai direct et garde le diagnostic optionnel", async () => {
  const source = await read("../src/pages/LevelSelect.jsx");
  assert.match(source, /Commencer ma série gratuite/);
  assert.match(source, /RECOMMENDED_STARTING_CHAPTERS/);
  assert.match(source, /chapter=\$\{encodeURIComponent\(recommendedChapterId\)\}/);
  assert.match(source, /trial_source=homepage_direct/);
  assert.match(source, /Personnaliser mon entraînement avec un diagnostic/);
  assert.match(source, /\/programme\?objectif=essai/);
});

test("la cible trial est validée par niveau et la source est bornée", async () => {
  const source = await read("../src/pages/ParcoursStep.jsx");
  assert.match(source, /requestedChapter\?\.meta\.level === parcours\.levelId/);
  assert.match(source, /\["homepage_direct", "diagnostic", "seo_course"\]\.includes/);
  assert.match(source, /trialSource=\{trialSource\}/);
  assert.match(source, /parcours\.free/);
});

test("les événements trial portent la source sans réponse ni identité", async () => {
  const runner = await read("../src/components/ChapterRunner.jsx");
  assert.match(runner, /trackProductEvent\("trial_started"[\s\S]*trialSource/);
  assert.match(runner, /isPersonalizedTrial \? \{ trialSource:/);
  assert.doesNotMatch(runner, /trial_started"[^\n]*(email|userId|response|answer)/);
});

test("le bilan propose de continuer puis de sauvegarder les progrès", async () => {
  const source = await read("../src/components/SessionCelebration.jsx");
  assert.match(source, /Continuer mon entraînement/);
  assert.match(source, /sauvegarder tes progrès/);
});
