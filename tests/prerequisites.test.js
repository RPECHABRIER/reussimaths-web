import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { CM2_DIAGNOSTIC_CHAPTERS } from "../src/diagnostics/cm2.js";
import { CM2_REMEDIATION, LEVEL_FOUNDATIONS, PREVIOUS_LEVEL } from "../src/lib/prerequisites.js";

const EXPECTED_LEVELS = ["cinquieme", "quatrieme", "troisieme", "seconde", "premiere-spe", "premiere-non-spe", "premiere-techno", "terminale-spe", "terminale-techno"];

async function registeredChapterIds() {
  const registry = await readFile(new URL("../test-all-chapters.mjs", import.meta.url), "utf8");
  const files = [...registry.matchAll(/src\/chapters/g)];
  assert.ok(files.length > 0, "le contrôle global des chapitres doit rester actif");
  const { readdir } = await import("node:fs/promises");
  const directory = new URL("../src/chapters/", import.meta.url);
  const names = await readdir(directory);
  const sources = await Promise.all(names.filter((name) => name.endsWith(".js") && name !== "registry.js").map((name) => readFile(new URL(name, directory), "utf8")));
  return new Set(sources.flatMap((source) => [...source.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1])));
}

test("chaque niveau après la 6e possède un niveau précédent et un socle valide", async () => {
  const ids = await registeredChapterIds();
  for (const levelId of EXPECTED_LEVELS) {
    assert.ok(PREVIOUS_LEVEL[levelId], `niveau précédent manquant pour ${levelId}`);
    assert.equal(LEVEL_FOUNDATIONS[levelId]?.length, 6, `socle incomplet pour ${levelId}`);
    for (const chapterId of LEVEL_FOUNDATIONS[levelId]) assert.ok(ids.has(chapterId), `${levelId}: chapitre introuvable ${chapterId}`);
  }
});

test("le diagnostic CM2 couvre six domaines et mène à une remédiation de 6e", async () => {
  const ids = await registeredChapterIds();
  assert.equal(CM2_DIAGNOSTIC_CHAPTERS.length, 6);
  for (const chapter of CM2_DIAGNOSTIC_CHAPTERS) {
    const exercise = chapter.generate();
    assert.ok(exercise.prompt && exercise.answer !== undefined, chapter.meta.id);
    assert.ok(ids.has(CM2_REMEDIATION[chapter.meta.id]), `remédiation absente pour ${chapter.meta.id}`);
  }
});
