import assert from "node:assert/strict";
import test from "node:test";
import { getAllDiscoveryShowcases, getDiagnosticShowcaseExercises, getDiscoveryShowcase } from "./discoveryShowcases.js";
import { buildPedagogicalFeedback } from "./lib/pedagogicalFeedback.js";

const LEVEL_IDS = ["sixieme", "cinquieme", "quatrieme", "troisieme", "seconde", "premiere-spe", "premiere-non-spe", "premiere-techno", "terminale-spe", "terminale-techno"];

test("chaque niveau possède exactement cinq questions vitrines", () => {
  const showcases = getAllDiscoveryShowcases();
  assert.deepEqual(showcases.map((chapter) => chapter.meta.level), LEVEL_IDS);
  for (const showcase of showcases) {
    assert.equal(showcase.showcaseExercises.length, 5, showcase.meta.level);
  }
});

test("les cinquante questions sont complètes, uniques et corrigées spécifiquement", () => {
  const prompts = new Set();
  for (const showcase of getAllDiscoveryShowcases()) {
    for (const exercise of showcase.showcaseExercises) {
      assert.ok(["numeric", "text", "qcm", "multi"].includes(exercise.type), `${showcase.meta.level}: type`);
      assert.ok(exercise.prompt?.length >= 12, `${showcase.meta.level}: énoncé`);
      assert.ok(exercise.answer !== null && exercise.answer !== undefined && exercise.answer !== "", `${showcase.meta.level}: réponse`);
      assert.ok(Array.isArray(exercise.steps) && exercise.steps.length >= 3, `${showcase.meta.level}: étapes`);
      assert.ok(exercise.steps.every((step) => String(typeof step === "string" ? step : step?.text ?? "").trim().endsWith(".")), `${showcase.meta.level}: ponctuation`);
      assert.ok(!prompts.has(exercise.prompt), `doublon: ${exercise.prompt}`);
      prompts.add(exercise.prompt);
      const wrongResponse = exercise.type === "numeric" ? "999999" : exercise.type === "qcm" ? exercise.options.find((option) => option !== exercise.answer) : "réponse erronée";
      const feedback = buildPedagogicalFeedback(exercise, wrongResponse);
      assert.notEqual(feedback.family, "general", `${showcase.meta.level}: ${exercise.chapter}`);
      assert.ok(feedback.meaning.length >= 80, `${showcase.meta.level}: explication trop courte`);
      assert.ok(feedback.rule.length >= 35, `${showcase.meta.level}: méthode trop courte`);
      assert.ok(feedback.conclusion.includes(String(exercise.answerDisplay ?? exercise.answer).replace(".", ",")), `${showcase.meta.level}: conclusion`);
    }
  }
  assert.equal(prompts.size, 50);
});

test("le parcours découverte utilise la séquence auditée et explique aussi les réussites", async () => {
  const { readFile } = await import("node:fs/promises");
  const runner = await readFile(new URL("./components/ChapterRunner.jsx", import.meta.url), "utf8");
  const feedback = await readFile(new URL("./components/LearningFeedback.jsx", import.meta.url), "utf8");
  assert.match(runner, /showcaseExercises/);
  assert.match(runner, /feedback\.correct && isDiscoverySession/);
  assert.match(runner, /answeredCount \+ \(feedback \? 0 : 1\)/);
  assert.match(feedback, /cette réponse est correcte/);
});

test("les diagnostics des dix niveaux utilisent cinq questions auditées", () => {
  for (const levelId of LEVEL_IDS) {
    for (const currentCount of [0, 2]) {
      const exercises = getDiagnosticShowcaseExercises(levelId, currentCount);
      assert.equal(exercises.length, 5, `${levelId}: ${currentCount} chapitre actuel`);
      exercises.forEach((exercise, index) => {
        const feedback = buildPedagogicalFeedback(exercise, exercise.type === "numeric" ? "999999" : "réponse erronée");
        assert.notEqual(feedback.family, "general", `${levelId}, question ${index + 1}`);
        assert.ok(exercise.steps.length >= 3, `${levelId}, question ${index + 1}: étapes`);
        assert.ok(feedback.meaning.length >= 75, `${levelId}, question ${index + 1}: explication`);
      });
    }
  }
});

test("le diagnostic et la série découverte d’un même niveau ne répètent aucune question", () => {
  for (const levelId of LEVEL_IDS) {
    const diagnosticPrompts = new Set(getDiagnosticShowcaseExercises(levelId).map((exercise) => exercise.prompt));
    const discoveryPrompts = getDiscoveryShowcase(levelId).showcaseExercises.map((exercise) => exercise.prompt);
    assert.equal(discoveryPrompts.some((prompt) => diagnosticPrompts.has(prompt)), false, levelId);
  }
});

test("la vitrine 6e propose des applications réellement explicatives", () => {
  const showcase = getDiscoveryShowcase("sixieme");
  for (const exercise of showcase.showcaseExercises) {
    const texts = exercise.steps.map((step) => typeof step === "string" ? step : step.text);
    assert.equal(exercise.steps.length, 4, exercise.chapter);
    assert.ok(texts.join(" ").length >= 210, `${exercise.chapter}: correction trop brève`);
    assert.deepEqual(exercise.steps.map((step) => step.type), ["donnee", "regle", "calcul", "resultat"], exercise.chapter);
  }
});

test("les cinquante vitrines suivent le même parcours donnée, règle, calcul, résultat", () => {
  for (const showcase of getAllDiscoveryShowcases()) {
    for (const exercise of showcase.showcaseExercises) {
      assert.equal(exercise.steps.length, 4, `${showcase.meta.level}: ${exercise.chapter}`);
      assert.deepEqual(exercise.steps.map((step) => step.type), ["donnee", "regle", "calcul", "resultat"], `${showcase.meta.level}: ${exercise.chapter}`);
      assert.ok(exercise.steps.map((step) => step.text).join(" ").length >= 180, `${showcase.meta.level}: correction trop brève`);
    }
  }
});

test("la vitrine 4e conserve les vérifications mathématiques indispensables", () => {
  const exercises = getDiscoveryShowcase("quatrieme").showcaseExercises;
  const corrections = exercises.map((exercise) => exercise.steps.map((step) => step.text).join(" ")).join(" ");
  assert.match(corrections, /balance à l’équilibre/);
  assert.match(corrections, /Vérification : 4 × 5 − 7/);
  assert.match(corrections, /strictement inférieure à 6 \+ 8/);
  assert.match(corrections, /comprise entre la plus petite valeur 8 et la plus grande valeur 15/);
});

test("équations, Pythagore, statistiques et vitesses ont un visuel contextualisé", async () => {
  const { readFile } = await import("node:fs/promises");
  const visual = await readFile(new URL("./components/FeedbackVisual.jsx", import.meta.url), "utf8");
  assert.match(visual, /On conserve l’équilibre jusqu’à isoler x/);
  assert.match(visual, /Les aires 36 et 64 construisent l’aire 100/);
  assert.match(visual, /Pour une moyenne, il doit rester entre la plus petite et la plus grande valeur/);
  assert.match(visual, /Pour trouver la vitesse, on partage la distance par la durée/);
  assert.match(visual, /Déterminer le signe avant de calculer/);
});

test("la vitrine 3e distingue méthode, résultat et contrôle", () => {
  const exercises = getDiscoveryShowcase("troisieme").showcaseExercises;
  const corrections = exercises.map((exercise) => exercise.steps.map((step) => step.text).join(" ")).join(" ");
  assert.match(corrections, /même proportion/);
  assert.match(corrections, /deux solutions, −3 et 2/);
  assert.match(corrections, /Chercher un antécédent conduirait au contraire à résoudre une équation/);
  assert.match(corrections, /80 × 1,20 = 96/);
  assert.match(corrections, /0,3 \+ 0,7 = 1/);
  assert.match(corrections, /Au brevet/);
  assert.match(corrections, /conditions, l’égalité des rapports et le calcul/);
});

test("les vitrines collège annoncent clairement leurs aides pédagogiques", () => {
  for (const levelId of ["sixieme", "cinquieme", "quatrieme", "troisieme"]) {
    const showcase = getDiscoveryShowcase(levelId);
    assert.match(showcase.meta.description, /méthode/);
    assert.match(showcase.meta.description, /correction animée/);
    assert.match(showcase.meta.description, /contrôle du résultat/);
  }
  assert.match(getDiscoveryShowcase("troisieme").meta.title, /brevet/i);
});

test("Thalès, fonctions, probabilités et distributivité ont un visuel contextualisé", async () => {
  const { readFile } = await import("node:fs/promises");
  const visual = await readFile(new URL("./components/FeedbackVisual.jsx", import.meta.url), "utf8");
  assert.match(visual, /Triangles semblables, donc longueurs proportionnelles/);
  assert.match(visual, /Le nombre de départ est connu/);
  assert.match(visual, /P\(non A\) =/);
  assert.match(visual, /Aucun terme placé dans la parenthèse ne doit être oublié/);
});

test("la vitrine 2nde explicite les distinctions essentielles", () => {
  const exercises = getDiscoveryShowcase("seconde").showcaseExercises;
  const corrections = exercises.map((exercise) => exercise.steps.map((step) => step.text).join(" ")).join(" ");
  assert.match(corrections, /Chercher un antécédent de 9 signifie résoudre/);
  assert.match(corrections, /variation verticale lorsque l’abscisse augmente d’une unité/);
  assert.ok(corrections.includes("\\dfrac{y_B-y_A}{x_B-x_A}"));
  assert.ok(corrections.includes("\\dfrac{9-3}{4-1}=\\dfrac{6}{3}=2"));
  assert.match(corrections, /deux groupes de même effectif/);
  assert.ok(corrections.includes("coordonnées de l’arrivée \\(B\\) moins coordonnées du départ \\(A\\)"));
  assert.match(corrections, /0,42 \+ 0,58 = 1/);
});

test("coefficient directeur, médiane et vecteurs ont un visuel spécialisé", async () => {
  const { readFile } = await import("node:fs/promises");
  const visual = await readFile(new URL("./components/FeedbackVisual.jsx", import.meta.url), "utf8");
  assert.match(visual, /Comparer la montée et l’avancée/);
  assert.match(visual, /\\dfrac\{y_B-y_A\}\{x_B-x_A\}/);
  assert.match(visual, /Ranger puis viser le centre/);
  assert.match(visual, /Arrivée moins départ/);
});

test("Thalès relie explicitement parallélisme, triangles semblables et proportionnalité", async () => {
  const thales = buildPedagogicalFeedback(getDiscoveryShowcase("troisieme").showcaseExercises[0], "1");
  assert.match(thales.meaning, /deux triangles semblables/);
  assert.match(thales.meaning, /longueurs correspondantes sont donc proportionnelles/);
  assert.match(thales.rule, /associe les sommets et les côtés correspondants/);
  const { readFile } = await import("node:fs/promises");
  const visual = await readFile(new URL("./components/FeedbackVisual.jsx", import.meta.url), "utf8");
  assert.match(visual, /Triangles semblables, donc longueurs proportionnelles/);
});

test("les quinze vitrines de Première ont été relues manuellement", () => {
  for (const levelId of ["premiere-spe", "premiere-non-spe", "premiere-techno"]) {
    const showcase = getDiscoveryShowcase(levelId);
    for (const exercise of showcase.showcaseExercises) {
      assert.equal(exercise.steps.length, 4, `${levelId}: ${exercise.chapter}`);
      assert.ok(exercise.steps.every((step) => step && typeof step === "object" && step.type && step.text), `${levelId}: étapes typées`);
      assert.ok(exercise.steps.map((step) => step.text).join(" ").length >= 200, `${levelId}: correction trop brève`);
    }
  }
});

test("les notions vitrines de Première disposent de visuels spécialisés", async () => {
  const { readFile } = await import("node:fs/promises");
  const visual = await readFile(new URL("./components/FeedbackVisual.jsx", import.meta.url), "utf8");
  assert.match(visual, /Deux directions perpendiculaires, un produit scalaire nul/);
  assert.match(visual, /Mesurer l’écart entre les deux extrêmes/);
  assert.match(visual, /Passer d’un terme au suivant/);
  assert.match(visual, /Suivre une branche à la fois/);
});

test("les dix vitrines de Terminale ont été relues manuellement", () => {
  for (const levelId of ["terminale-spe", "terminale-techno"]) {
    const showcase = getDiscoveryShowcase(levelId);
    for (const exercise of showcase.showcaseExercises) {
      assert.deepEqual(exercise.steps.map((step) => step.type), ["donnee", "regle", "calcul", "resultat"], `${levelId}: ${exercise.chapter}`);
      assert.ok(exercise.steps.map((step) => step.text).join(" ").length >= 250, `${levelId}: correction trop brève`);
      const feedback = buildPedagogicalFeedback(exercise, exercise.type === "numeric" ? "999999" : "réponse erronée");
      assert.notEqual(feedback.family, "general", `${levelId}: ${exercise.chapter}`);
    }
  }
});

test("les notions vitrines de Terminale disposent de visuels spécialisés", async () => {
  const { readFile } = await import("node:fs/promises");
  const visual = await readFile(new URL("./components/FeedbackVisual.jsx", import.meta.url), "utf8");
  assert.match(visual, /Deux opérations réciproques/);
  assert.match(visual, /La dérivée donne la pente/);
  assert.match(visual, /Passer d’un terme au suivant/);
  assert.match(visual, /Suivre une branche à la fois/);
  assert.match(visual, /Trois coordonnées dans l’espace/);
});
