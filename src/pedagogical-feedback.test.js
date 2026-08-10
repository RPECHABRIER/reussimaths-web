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
  const unitless = buildPedagogicalFeedback(numeric("Nombres relatifs", "Calcule -7+12.", 5), "-19");
  assert.match(unitless.conclusion, /donc 5\./);
  assert.doesNotMatch(unitless.conclusion, /5 L/);
  const medianWithoutLitres = buildPedagogicalFeedback(numeric("Statistiques — Médiane", "Détermine la médiane de la série.", 7), "5");
  assert.doesNotMatch(medianWithoutLitres.conclusion, /7 L/);
});

test("une augmentation en pourcentage conserve l'unité de la valeur initiale", () => {
  const feedback = buildPedagogicalFeedback(numeric("Pourcentages — Évolution", "Augmente 80 € de 20 %.", 96), "100");
  assert.equal(feedback.family, "percentage_change");
  assert.match(feedback.conclusion, /96 €/);
  assert.doesNotMatch(feedback.conclusion, /96 %/);

  const explicit = buildPedagogicalFeedback({ ...numeric("Pourcentages — Évolution", "Augmente 80 € de 20 %.", 96), answerUnit: "euros" }, "100");
  assert.match(explicit.conclusion, /96 euros/);
});

test("fonctions, statistiques et probabilités utilisent le bon geste", () => {
  const image = buildPedagogicalFeedback(numeric("Fonctions — Image et antécédent", "Calcule l’image de 4 par f.", 10), "2");
  const antecedent = buildPedagogicalFeedback(numeric("Fonctions — Image et antécédent", "Détermine un antécédent de 10.", 4), "10");
  const median = buildPedagogicalFeedback(numeric("Statistiques descriptives", "Détermine la médiane de la série.", 8), "7");
  const contrary = buildPedagogicalFeedback(numeric("Probabilités — Événement contraire", "P(A)=0,3. Calcule P(non A).", 0.7), "0,3");
  const conditional = buildPedagogicalFeedback(numeric("Probabilités conditionnelles", "Calcule P_A(B), sachant que A est réalisé.", 0.4), "0,2");
  assert.equal(image.family, "function_image");
  assert.equal(antecedent.family, "function_antecedent");
  assert.equal(median.family, "statistics_median");
  assert.equal(contrary.family, "probability_contrary");
  assert.equal(conditional.family, "probability_conditional");
});

test("la géométrie distingue ses conditions d’application", () => {
  const thales = buildPedagogicalFeedback(numeric("Automatismes — Théorème de Thalès", "Calcule une longueur.", 6), "8");
  const trig = buildPedagogicalFeedback(numeric("Automatismes — Trigonométrie", "Calcule le côté opposé.", 5), "4");
  const circle = buildPedagogicalFeedback(numeric("Grandeurs et mesures — Périmètre d'un cercle", "Calcule le périmètre en cm.", 12.56), "50,24");
  const volume = buildPedagogicalFeedback(numeric("Géométrie dans l'espace — Volumes", "Calcule le volume d'un cône en cm³.", 100), "300");
  const existence = buildPedagogicalFeedback({ type: "qcm", chapter: "Angles — Existence d'un triangle", prompt: "Ce triangle existe-t-il ?", answer: "Non" }, "Oui");
  assert.equal(thales.family, "geometry_thales");
  assert.equal(trig.family, "geometry_trigonometry");
  assert.equal(circle.family, "geometry_circle_measure");
  assert.equal(volume.family, "geometry_volume");
  assert.equal(existence.family, "geometry_triangle_existence");
});

test("l’audit géométrique couvre mesures, repérage, solides et vecteurs", () => {
  const polygon = buildPedagogicalFeedback(numeric("Automatismes — Aire d'un triangle", "Calcule l’aire.", 20), "40");
  const coordinates = buildPedagogicalFeedback({ type: "text", chapter: "Géométrie repérée — Coordonnées", prompt: "Donne les coordonnées.", answer: "(2;-3)" }, "(-3;2)");
  const solid = buildPedagogicalFeedback({ type: "text", chapter: "Géométrie dans l'espace — Vocabulaire", prompt: "Nomme le segment.", answer: "arête" }, "sommet");
  const vector = buildPedagogicalFeedback({ type: "text", chapter: "Vecteurs — Coordonnées", prompt: "Calcule AB.", answer: "(3;4)" }, "(5;8)");
  assert.equal(polygon.family, "geometry_polygon_measure");
  assert.equal(coordinates.family, "geometry_coordinates");
  assert.equal(solid.family, "geometry_solids_vocabulary");
  assert.equal(vector.family, "geometry_vectors");
});
