import assert from "node:assert/strict";
import test from "node:test";
import { buildPedagogicalFeedback, PEDAGOGICAL_FEEDBACK_FAMILIES } from "./lib/pedagogicalFeedback.js";

const numeric = (chapter, prompt, answer = 1) => ({ type: "numeric", chapter, prompt, answer, steps: ["étape adaptée"] });

test("les familles pédagogiques prioritaires restent disponibles", () => {
  for (const family of ["relative_numbers", "fractions", "equations", "percentages", "probabilities", "functions", "distributivity", "powers", "proportionality", "pythagoras", "area_conversion", "volume_conversion"]) {
    assert.ok(PEDAGOGICAL_FEEDBACK_FAMILIES.includes(family), family);
  }
});

test("une conversion d’aire reçoit une correction et un vocabulaire spécifiques", () => {
  const feedback = buildPedagogicalFeedback(numeric("Grandeurs et mesures — Unités d'aire", "Convertis 2,4 m² en cm².", 24000), "240");
  assert.equal(feedback.family, "area_conversion");
  assert.match(feedback.intro, /surface|aire/i);
  assert.match(feedback.rule, /100/);
});

test("une conversion de volume est distinguée d’une conversion d’aire", () => {
  const feedback = buildPedagogicalFeedback(numeric("Géométrie dans l'espace — Conversions", "Convertis 2400 cm³ en dm³.", 2.4), "24");
  assert.equal(feedback.family, "volume_conversion");
  assert.match(feedback.rule, /1 000/);
});

test("la correction reprend les étapes propres à la question", () => {
  const exercise = numeric("Équations", "Résous 4x - 7 = 13.", 5);
  const feedback = buildPedagogicalFeedback(exercise, "1,5");
  assert.equal(feedback.family, "equations");
  assert.deepEqual(feedback.steps, ["étape adaptée"]);
  assert.match(feedback.meaning, /balance/i);
});

test("les sous-types évitent une méthode inadaptée", () => {
  const product = buildPedagogicalFeedback(numeric("Nombres relatifs — Produit", "Calcule (-4) × (-3).", 12), "-12");
  const simplified = buildPedagogicalFeedback({ type: "text", chapter: "Fractions — Simplifier", prompt: "Donne 8/12 sous forme irréductible.", answer: "2/3" }, "4/6");
  assert.equal(product.family, "relative_product");
  assert.match(product.meaning, /même signe/i);
  assert.equal(simplified.family, "fraction_simplification");
  assert.match(simplified.rule, /diviseur commun/i);
});
