import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { withAutoMathFormatting } from "../src/lib/mathFormatting.js";

test("les fractions numériques simples sont converties en fractions LaTeX empilées", () => {
  assert.equal(withAutoMathFormatting("3/4"), "\\(\\dfrac{3}{4}\\)");
  assert.equal(
    withAutoMathFormatting("Compare 2/3 et 1/4."),
    "Compare \\(\\dfrac{2}{3}\\) et \\(\\dfrac{1}{4}\\).",
  );
  assert.equal(withAutoMathFormatting("−1/2"), "\\(\\dfrac{-1}{2}\\)");
  assert.equal(withAutoMathFormatting("1,5/3"), "\\(\\dfrac{1{,}5}{3}\\)");
});

test("les fractions intégrées à du LaTeX sont empilées sans imbriquer les délimiteurs", () => {
  assert.equal(withAutoMathFormatting("\\(A=5/3\\)"), "\\(A=\\dfrac{5}{3}\\)");
  assert.equal(withAutoMathFormatting("\\(\\dfrac{2}{3}\\)"), "\\(\\dfrac{2}{3}\\)");
  assert.equal(withAutoMathFormatting("x^{2} + 1/2"), "\\(x^{2} + \\dfrac{1}{2}\\)");
});

test("les dates et les URL ne sont pas prises pour des fractions", () => {
  assert.equal(withAutoMathFormatting("12/09/2026"), "12/09/2026");
  assert.equal(withAutoMathFormatting("https://reussimaths-web.vercel.app/college"), "https://reussimaths-web.vercel.app/college");
});

test("les surfaces publiques et enseignantes affichent leurs choix fractionnaires avec MathText", async () => {
  const [homeDemo, feedbackVisual, teacher] = await Promise.all([
    readFile(new URL("../src/components/HomeLearningDemo.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/FeedbackVisual.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/pages/Enseignant.jsx", import.meta.url), "utf8"),
  ]);
  assert.match(homeDemo, /<MathText text=\{option\}\/>/);
  assert.match(feedbackVisual, /<MathText text="3\/5"\/>/);
  assert.match(feedbackVisual, /<MathText text="3\/2 = 1,5"\/>/);
  assert.match(teacher, /<MathText text=\{String\(option\)\}\/>/);
});

test("les jeux font passer leurs contenus mathématiques par MathText", async () => {
  const [memory, miniDuel, automatismes] = await Promise.all([
    readFile(new URL("../src/pages/MemoryMaths.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/MiniDuel.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/AutomatismesRunner.jsx", import.meta.url), "utf8"),
  ]);
  assert.match(memory, /tex: `\\\\dfrac\{/);
  assert.match(memory, /return <MathText text=\{`\\\\\(\$\{content\.tex\}\\\\\)`\}/);
  assert.match(miniDuel, /<MathText text=\{opt\} \/>/);
  assert.match(automatismes, /<MathText text=\{opt\} \/>/);
});
