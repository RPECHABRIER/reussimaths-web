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

test("fractions, équations et pourcentages distinguent leurs méthodes", () => {
  const fractionProduct = buildPedagogicalFeedback({ type: "numeric", chapter: "Fractions — Multiplier", prompt: "Calcule 2/3 × 5/7.", answer: "10/21" }, "7/10");
  const fractionPart = buildPedagogicalFeedback(numeric("Fractions — Fraction d'un nombre", "Calcule les 3/4 de 20.", 15), "17");
  const productZero = buildPedagogicalFeedback({ type: "multi", chapter: "Équations — Produit nul", prompt: "Résous (x-2)(x+3)=0.", answer: [2, -3] }, [2]);
  const percentageCounts = buildPedagogicalFeedback(numeric("Proportionnalité — Pourcentage depuis des effectifs", "18 élèves sur 30.", 60), "40");
  const percentageChange = buildPedagogicalFeedback(numeric("Proportionnalité — Évolutions en pourcentage", "Augmente 80 de 20 %.", 96), "100");
  assert.equal(fractionProduct.family, "fraction_multiplication");
  assert.equal(fractionPart.family, "fraction_of_number");
  assert.equal(productZero.family, "equation_product_zero");
  assert.equal(percentageCounts.family, "percentage_from_counts");
  assert.equal(percentageChange.family, "percentage_change");
});

test("la conclusion affiche les réponses multiples lisibles et conserve l’unité", () => {
  const multi = buildPedagogicalFeedback({ type: "multi", chapter: "Raisonnement", prompt: "Choisis.", answer: [0, 2], options: ["A", "B", "C"] }, [0]);
  const length = buildPedagogicalFeedback(numeric("Géométrie — Pythagore", "Calcule BC en cm.", 10), "14");
  assert.match(multi.conclusion, /A ; C/);
  assert.doesNotMatch(multi.conclusion, /0 ; 2/);
  assert.match(length.conclusion, /10 cm/);
});
