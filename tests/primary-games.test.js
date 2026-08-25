import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { generateAdditionQuestion, MEMORY_PAIR_LEVELS } from "../src/lib/primaryGameUtils.js";

test("la course CP ne produit jamais une somme supérieure à 20", () => {
  for (let index = 0; index < 2_000; index += 1) {
    const question = generateAdditionQuestion(null, { maxSum: 20 });
    assert.ok(question.a >= 1);
    assert.ok(question.b >= 1);
    assert.ok(question.sum <= 20);
  }
});

test("la course CE1 conserve des additions pouvant dépasser 20", () => {
  const questions = Array.from({ length: 2_000 }, () => generateAdditionQuestion(null));
  assert.ok(questions.some((question) => question.sum > 20));
  assert.ok(questions.every((question) => question.a <= 20 && question.b <= 20));
});

test("le Memory propose une progression simple jusqu'à 15 paires", () => {
  assert.deepEqual(MEMORY_PAIR_LEVELS, [6, 10, 15]);
});

test("les portes et retours gardent l'enfant dans son espace CP ou CE1", () => {
  const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
  const games = readFileSync(new URL("../src/pages/Jeux.jsx", import.meta.url), "utf8");
  const memory = readFileSync(new URL("../src/pages/MemoryCpCe1.jsx", import.meta.url), "utf8");
  const additions = readFileSync(new URL("../src/pages/CourseAdditionsCpCe1.jsx", import.meta.url), "utf8");

  assert.match(games, /to="\/jeux\/cp"/);
  assert.match(games, /to="\/jeux\/ce1"/);
  assert.match(app, /path="\/jeux\/course-additions-ce1" element={<CourseAdditionsCpCe1 level="ce1" \/>}/);
  assert.doesNotMatch(memory, /to="\/jeux"/);
  assert.match(additions, /const gamesPath = isCp \? "\/jeux\/cp" : "\/jeux\/ce1"/);
});
