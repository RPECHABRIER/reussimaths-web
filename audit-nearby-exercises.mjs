import { readdir } from "node:fs/promises";
import { normalizeExercise } from "./src/lib/exercise.js";

const chapterDirectory = new URL("./src/chapters/", import.meta.url);
const files = (await readdir(chapterDirectory))
  .filter((name) => name.endsWith(".js") && name !== "registry.js")
  .sort();
const difficulties = [undefined, "facile", "standard", "expert"];
const samplesPerDifficulty = 8;
const attemptsPerSample = 250;

function promptTemplate(prompt = "") {
  return String(prompt)
    .normalize("NFKC")
    .replace(/\\[([]|\\[)\]]/g, " ")
    .replace(/[−–—+]?\s*\d+(?:[.,]\d+)?/g, " # ")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, "#")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("fr");
}

function methodTemplate(exercise) {
  const steps = Array.isArray(exercise?.steps) ? exercise.steps : [];
  const rule = steps.find((step) => step?.type === "regle") ?? steps[1] ?? steps[0];
  const text = typeof rule === "string" ? rule : rule?.text ?? "";
  return promptTemplate(text);
}

let samples = 0;
let covered = 0;
let nonNumeric = 0;
const uncovered = [];

for (const file of files) {
  const chapter = (await import(new URL(file, chapterDirectory).href)).default;
  if (!chapter?.meta?.id || typeof chapter.generate !== "function") continue;

  for (const difficulty of difficulties) {
    for (let sample = 0; sample < samplesPerDifficulty; sample += 1) {
      const current = normalizeExercise(chapter.generate(difficulty));
      if (!/\d/.test(current.prompt)) {
        nonNumeric += 1;
        continue;
      }
      const template = promptTemplate(current.prompt);
      const method = methodTemplate(current);
      let found = false;

      for (let attempt = 0; attempt < attemptsPerSample; attempt += 1) {
        const candidate = normalizeExercise(chapter.generate(difficulty));
        if (
          candidate.chapter === current.chapter
          && candidate.prompt !== current.prompt
          && candidate.type === current.type
          && (promptTemplate(candidate.prompt) === template || (method && methodTemplate(candidate) === method))
        ) {
          found = true;
          break;
        }
      }

      samples += 1;
      if (found) covered += 1;
      else if (uncovered.length < 30) uncovered.push(`${chapter.meta.id} [${difficulty ?? "défaut"}] — ${current.prompt}`);
    }
  }
}

const coverage = samples ? (covered / samples) * 100 : 0;
console.log(`${covered}/${samples} exercices numériques disposent d'une variante de même modèle en ${attemptsPerSample} tirages (${coverage.toFixed(2)} %).`);
console.log(`${nonNumeric} questions notionnelles sans nombres ont été écartées : le bouton ne doit pas leur être proposé.`);
if (uncovered.length) {
  console.log("\nPremiers modèles sans variante détectée :");
  for (const entry of uncovered) console.log(`- ${entry}`);
}
if (coverage < 99) process.exitCode = 1;
