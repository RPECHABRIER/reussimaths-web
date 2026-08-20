import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const pilotFiles = [
  "generalites-fonctions-seconde.js", "fonctions-affines-seconde.js", "equations-droites-seconde.js",
  "probabilites-echantillonnage-seconde.js", "colinearite-vecteurs-seconde.js",
];

test("les cinq domaines du pilote Seconde contiennent une aide graduée", async () => {
  for (const name of pilotFiles) {
    const source = await readFile(new URL(`../src/chapters/${name}`, import.meta.url), "utf8");
    assert.match(source, /hints:\s*\[/, name);
  }
});

test("le moteur conserve le fallback et suit la réussite après réparation", async () => {
  const runner = await readFile(new URL("../src/components/ChapterRunner.jsx", import.meta.url), "utf8");
  const feedback = await readFile(new URL("../src/lib/pedagogicalFeedback.js", import.meta.url), "utf8");
  assert.match(runner, /Array\.isArray\(exercise\.hints\)/);
  assert.match(runner, /recovery_success/);
  assert.match(runner, /<LearningFeedback exercise=\{exercise\}/);
  assert.match(feedback, /exercise\?\.feedback\?\.errorCases/);
  assert.match(feedback, /exercise\?\.feedback\?\.default/);
});

test("chaque chapitre pilote génère au moins 20 exercices valides", async () => {
  for (const name of pilotFiles) {
    const chapter = (await import(`../src/chapters/${name}`)).default;
    for (let i = 0; i < 20; i += 1) {
      const exercise = chapter.generate();
      assert.ok(exercise.prompt, `${name}: énoncé ${i}`);
      assert.notEqual(exercise.answer, undefined, `${name}: réponse ${i}`);
      assert.ok(Array.isArray(exercise.steps), `${name}: correction ${i}`);
      if (exercise.hints) assert.ok(exercise.hints.every((hint) => typeof hint === "string" && hint.length > 20), `${name}: indices ${i}`);
    }
  }
});
