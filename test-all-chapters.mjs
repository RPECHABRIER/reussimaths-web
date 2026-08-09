import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import katex from "katex";
import { normalizeExercise } from "./src/lib/exercise.js";

const chapterDirectory = new URL("./src/chapters/", import.meta.url);
const files = (await readdir(chapterDirectory))
  .filter((name) => name.endsWith(".js") && name !== "registry.js")
  .sort();
const difficulties = [undefined, "facile", "standard", "expert"];
const iterations = 50;
const errors = [];
const latexSegments = new Set();
const chapterIds = new Map();
let generated = 0;

function report(file, difficulty, problem) {
  if (errors.length < 40) errors.push(`${file} [${difficulty ?? "défaut"}] : ${problem}`);
}

function collectLatex(value) {
  if (typeof value === "string") {
    const delimited = /\\\((.*?)\\\)|\\\[(.*?)\\\]/gs;
    let match;
    while ((match = delimited.exec(value))) latexSegments.add(match[1] ?? match[2]);
  } else if (Array.isArray(value)) {
    value.forEach(collectLatex);
  } else if (value && typeof value === "object") {
    Object.values(value).forEach(collectLatex);
  }
}

function inspect(exercise, file, difficulty) {
  if (!exercise || typeof exercise !== "object") return report(file, difficulty, "exercice absent");
  if (typeof exercise.prompt !== "string" || !exercise.prompt.trim()) report(file, difficulty, "énoncé absent");
  if (typeof exercise.chapter !== "string" || !exercise.chapter.trim()) report(file, difficulty, "libellé de chapitre absent");
  if (!Array.isArray(exercise.steps) || exercise.steps.length === 0) report(file, difficulty, "correction absente");
  if (!["numeric", "qcm", "multi", "text"].includes(exercise.type)) report(file, difficulty, `type inconnu ${exercise.type}`);

  if (exercise.type === "numeric" && (typeof exercise.answer !== "number" || !Number.isFinite(exercise.answer))) report(file, difficulty, `réponse numérique invalide ${exercise.answer}`);
  if (exercise.type === "text") {
    const validString = typeof exercise.answer === "string" && exercise.answer.trim();
    const validAlternatives = Array.isArray(exercise.answer) && exercise.answer.length > 0 && exercise.answer.every((answer) => typeof answer === "string" && answer.trim());
    if (!validString && !validAlternatives) report(file, difficulty, "réponse texte invalide");
  }
  if (exercise.type === "qcm") {
    if (!Array.isArray(exercise.options) || exercise.options.length < 2) report(file, difficulty, "moins de deux choix");
    else {
      if (new Set(exercise.options.map((option) => JSON.stringify(option))).size !== exercise.options.length) report(file, difficulty, "choix en double");
      if (!exercise.options.some((option) => Object.is(option, exercise.answer))) report(file, difficulty, "bonne réponse absente des choix");
    }
  }
  if (exercise.type === "multi") {
    if (!Array.isArray(exercise.options) || exercise.options.length < 2) report(file, difficulty, "QCM multiple sans choix");
    if (!Array.isArray(exercise.answer)) report(file, difficulty, "réponse multiple invalide");
    else if (Array.isArray(exercise.options) && exercise.answer.some((index) => !Number.isInteger(index) || index < 0 || index >= exercise.options.length)) report(file, difficulty, "indice de réponse hors limites");
  }
  collectLatex(exercise);
}

for (const file of files) {
  let chapter;
  try {
    chapter = (await import(pathToFileURL(new URL(file, chapterDirectory).pathname))).default;
  } catch (error) {
    report(file, null, `import impossible : ${error.message}`);
    continue;
  }
  if (!chapter?.meta?.id || typeof chapter.generate !== "function") {
    report(file, null, "export de chapitre invalide");
    continue;
  }
  if (chapterIds.has(chapter.meta.id)) report(file, null, `identifiant déjà utilisé dans ${chapterIds.get(chapter.meta.id)}`);
  chapterIds.set(chapter.meta.id, file);

  for (const difficulty of difficulties) {
    for (let iteration = 0; iteration < iterations; iteration += 1) {
      try {
        inspect(normalizeExercise(chapter.generate(difficulty)), file, difficulty);
        generated += 1;
      } catch (error) {
        report(file, difficulty, `génération interrompue : ${error.message}`);
      }
    }
  }
}

for (const segment of latexSegments) {
  try {
    katex.renderToString(segment, { throwOnError: true, strict: "ignore" });
  } catch (error) {
    report("KaTeX", null, `${error.message} dans ${segment}`);
  }
}

console.log(`${files.length} chapitres, ${generated} exercices et ${latexSegments.size} expressions mathématiques contrôlés.`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Aucune anomalie détectée.");
}
