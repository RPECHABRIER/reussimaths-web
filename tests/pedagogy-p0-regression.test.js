import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (name) => readFile(new URL(`../src/chapters/${name}`, import.meta.url), "utf8");

test("les P0 de formulation mathématique restent corrigés dans chapitres et automatismes", async () => {
  const [variance, integrals, integralAutos, continuity, limits, convexity, lgn, secondLgn] = await Promise.all([
    read("variables-aleatoires-premiere-spe.js"), read("calcul-integral-terminale-spe.js"),
    read("automatismes-terminale-spe.js"), read("continuite-terminale-spe.js"),
    read("limites-fonctions-terminale-spe.js"), read("complements-derivation-terminale-spe.js"),
    read("loi-grands-nombres-terminale-spe.js"), read("probabilites-echantillonnage-seconde.js"),
  ]);
  assert.doesNotMatch(variance, /Linéarité de la variance/);
  assert.match(integrals, /Positive ou nulle/);
  assert.match(integrals, /Négative ou nulle/);
  assert.match(integralAutos, /Positif ou nul/);
  assert.doesNotMatch(continuity, /produit est positif ou nul : rien n'est garanti/i);
  assert.match(limits, /limite infinie/);
  assert.doesNotMatch(convexity, /convexe en ce point|concave en ce point/);
  assert.match(convexity, /il faut étudier séparément la fonction/);
  assert.match(lgn, /moyenne peut fluctuer/);
  assert.match(secondLgn, /ne décrit pas un rapprochement à chaque tirage/);
});

test("la modélisation technologique repose sur une relation et explicite les deux hypothèses binomiales", async () => {
  const [stats, autos, binomial, logarithm] = await Promise.all([
    read("statistiques-deux-variables-terminale-techno.js"), read("automatismes-terminale-techno.js"),
    read("variables-aleatoires-terminale-techno.js"), read("logarithme-decimal-terminale-techno.js"),
  ]);
  assert.doesNotMatch(stats, /Allure de parabole.*poser/);
  assert.match(stats, /L'allure seule ne suffit pas/);
  assert.match(autos, /relation conjecturée/);
  assert.match(binomial, /même probabilité p/);
  assert.match(binomial, /l'énoncé précise séparément.*indépendantes/);
  assert.match(logarithm, /loin d'un entier/);
});

test("les minorants probabilistes générés restent informatifs sur 100 tirages", async () => {
  const chapter = (await import("../src/chapters/loi-grands-nombres-terminale-spe.js")).default;
  for (let i = 0; i < 100; i += 1) {
    const exercise = chapter.generate();
    if (/Minore/.test(exercise.prompt)) {
      assert.ok(Number(exercise.answer) >= 0, exercise.prompt);
      assert.ok(Number(exercise.answer) <= 1, exercise.prompt);
    }
  }
});
