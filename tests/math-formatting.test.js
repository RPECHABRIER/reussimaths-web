import test from "node:test";
import katex from "katex";
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


test("la pizzeria CE1 empile la fraction et distingue les compteurs", async () => {
  const source = await readFile(new URL("../src/pages/JeuxCe1.jsx", import.meta.url), "utf8");
  assert.match(source, /import MathText from "\.\.\/components\/MathText"/);
  assert.ok(source.includes('Montre <MathText text={`\\\\dfrac{${question.numerator}}{${question.denominator}}`}/>'));
  assert.ok(!source.includes("Montre {question.numerator}/{question.denominator}"));
  assert.ok(source.includes("Commande {round} sur {total}"));
  assert.ok(source.includes("{score} sur {total}"));
});

test("les bandes, quotients et sommes de FeedbackVisual utilisent MathText", async () => {
  const source = await readFile(new URL("../src/components/FeedbackVisual.jsx", import.meta.url), "utf8");
  assert.ok(!source.includes("{numerator}/{denominator}"));
  assert.ok(!source.includes("${leftEquivalent}/${commonDenominator}"));
  assert.ok(!source.includes("${rightEquivalent}/${commonDenominator}"));
  assert.ok(!source.includes("{total}/{commonDenominator}"));
  assert.ok(source.includes('<MathText text={fraction}/>'));
  assert.ok(source.includes('<MathText text={`\\\\dfrac{${numerator}}{${denominator}}`}/>'));
  assert.ok(source.includes('<MathText text={label}/>'));
  assert.ok(source.includes('`\\\\dfrac{${leftEquivalent}}{${commonDenominator}}`'));
  assert.ok(source.includes('`\\\\dfrac{${rightEquivalent}}{${commonDenominator}}`'));
  assert.ok(source.includes('<MathText text={`\\\\dfrac{${leftEquivalent}}{${commonDenominator}} + \\\\dfrac{${rightEquivalent}}{${commonDenominator}} = {\\\\color{${colors.green}}\\\\dfrac{${total}}{${commonDenominator}}}`}/>'));
});

test("les URL numériques et dates espacées restent intactes à côté des fractions", () => {
  for (const value of ["https://example.com?q=1/4", "https://example.com/chapter1/4", "www.example.com?q=1/4", "12 / 09 / 2026", "2026/09/02"]) {
    assert.equal(withAutoMathFormatting(`${value} et 1/4`), `${value} et \\(\\dfrac{1}{4}\\)`);
  }
});

test("KaTeX rend les fractions CE1, génériques et les sommes sans erreur", () => {
  for (const expression of [
    "\\dfrac{1}{4}",
    "\\dfrac{\\text{numérateur}}{\\text{dénominateur}}",
    "\\dfrac{3}{6} + \\dfrac{2}{6} = {\\color{#3fa66b}\\dfrac{5}{6}}",
    "\\(1/2 + 1/3 = 5/6\\)",
  ]) {
    const formatted = withAutoMathFormatting(expression);
    const html = katex.renderToString(formatted.slice(2, -2), { throwOnError: true });
    assert.match(html, /class="mfrac"/);
    assert.doesNotMatch(html, /katex-error/);
  }
});
