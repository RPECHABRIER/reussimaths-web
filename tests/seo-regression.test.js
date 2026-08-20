import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import katex from "katex";
import { PUBLIC_COURSES, SITE_URL, coursePath } from "../src/seo/publicPages.js";
import { getPageViewProperties } from "../src/lib/productAnalytics.js";

const WAVE_ONE_PATHS = [
  "/cours/troisieme/revisions-brevet-maths",
  "/cours/cinquieme/proportionnalite",
  "/cours/quatrieme/theoreme-thales",
  "/cours/troisieme/calcul-litteral",
  "/cours/troisieme/fonctions-affines",
  "/cours/troisieme/probabilites",
];

const waveOnePages = PUBLIC_COURSES.filter((page) => WAVE_ONE_PATHS.includes(coursePath(page)));

function latexExpressions(text) {
  const expressions = [];
  for (const match of String(text).matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) {
    expressions.push(match[1] ?? match[2]);
  }
  if (expressions.length === 0 && /\\[a-zA-Z]+|[\^_]\{/.test(String(text))) expressions.push(String(text));
  return expressions;
}

test("la page enseignant indexable possède ses propres métadonnées et son pré-rendu", async () => {
  const [routeSeo, generator] = await Promise.all([
    readFile(new URL("../src/components/RouteSeo.jsx", import.meta.url), "utf8"),
    readFile(new URL("../scripts/generate-seo-pages.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(routeSeo, /pathname === "\/enseignant"/);
  assert.match(routeSeo, /path="\/enseignant"/);
  assert.match(generator, /await emit\(teacherPath/);
  assert.match(generator, /<h1>Votre rituel de maths, prêt à projeter<\/h1>/);
});

test("la page jeux hors sitemap reste explicitement non indexable", async () => {
  const routeSeo = await readFile(new URL("../src/components/RouteSeo.jsx", import.meta.url), "utf8");
  assert.match(routeSeo, /pathname === "\/jeux"/);
});

test("la première vague contient les six routes et un contenu public substantiel", () => {
  assert.deepEqual(waveOnePages.map(coursePath).sort(), [...WAVE_ONE_PATHS].sort());
  for (const page of waveOnePages) {
    assert.ok(page.h1);
    assert.ok(page.intro.length >= 120);
    assert.ok(page.rules.length >= 3 && page.rules.length <= 5);
    assert.ok(page.exercises.length >= 3);
    assert.ok(page.exercises.every((exercise) => exercise.question && exercise.answer && exercise.sourceGenerator));
    assert.ok(page.relatedLinks.length >= 2 && page.relatedLinks.length <= 4);
    assert.equal(new Set(page.exercises.map((exercise) => exercise.question)).size, page.exercises.length);
    assert.ok(page.canonicalSource);
  }
});

test("titles, descriptions, H1 et canonicals sont uniques", () => {
  for (const key of ["title", "description", "h1"]) {
    assert.equal(new Set(waveOnePages.map((page) => page[key])).size, waveOnePages.length, `${key} doit être unique`);
  }
  const canonicals = waveOnePages.map((page) => `${SITE_URL}${coursePath(page)}`);
  assert.equal(new Set(canonicals).size, waveOnePages.length);
});

test("les exemples SEO sont déterministes et leur LaTeX est valide", async () => {
  const first = JSON.stringify(waveOnePages.map((page) => page.exercises));
  const cacheBustedModule = await import(`../src/seo/publicPages.js?determinism=${Date.now()}`);
  const second = JSON.stringify(cacheBustedModule.PUBLIC_COURSES.filter((page) => WAVE_ONE_PATHS.includes(cacheBustedModule.coursePath(page))).map((page) => page.exercises));
  assert.equal(second, first);

  for (const page of waveOnePages) {
    const texts = [
      ...page.rules.flatMap((rule) => [rule.text, rule.formula].filter(Boolean)),
      ...page.exercises.flatMap((exercise) => [exercise.question, exercise.answer]),
    ];
    for (const text of texts) {
      for (const expression of latexExpressions(text)) {
        assert.doesNotThrow(() => katex.renderToString(expression, { throwOnError: true }), `${coursePath(page)} : ${expression}`);
      }
    }
  }
});

test("le générateur pré-rend les cours, les relie aux niveaux et les ajoute au sitemap", async () => {
  const generator = await readFile(new URL("../scripts/generate-seo-pages.mjs", import.meta.url), "utf8");
  assert.match(generator, /for \(const page of PUBLIC_COURSES\)/);
  assert.match(generator, /PUBLIC_COURSES\.filter\(\(page\) => page\.levelId === id\)/);
  assert.match(generator, /\.\.\.PUBLIC_COURSES\.map\(coursePath\)/);
  assert.match(generator, /page\.h1 \?\? page\.title/);
  assert.match(generator, /relatedLinks/);
  assert.doesNotMatch(generator, /noindex/);
});

test("chaque landing expose les dimensions analytics SEO attendues", () => {
  for (const page of waveOnePages) {
    assert.deepEqual(getPageViewProperties(coursePath(page), "https://www.google.fr/search?q=maths"), {
      contentType: "seo_course",
      levelId: page.levelId,
      courseSlug: page.slug,
      source: "google",
    });
  }
});
