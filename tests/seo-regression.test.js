import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

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
