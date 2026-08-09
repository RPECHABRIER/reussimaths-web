import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("les pages restent chargées à la demande", async () => {
  const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.match(app, /lazy\(\(\) => import\("\.\/pages\/CycleSelect"\)\)/);
  assert.match(app, /<Suspense\s+fallback=/);
  assert.doesNotMatch(app, /^import\s+CycleSelect\s+from/m);
});

test("le gestionnaire de son ne recharge pas le catalogue de chapitres", async () => {
  const sound = await readFile(new URL("../src/lib/sound.js", import.meta.url), "utf8");
  assert.doesNotMatch(sound, /chapters\/registry/);
  assert.doesNotMatch(sound, /from\s+["']\.\.\/parcours["']/);
});
