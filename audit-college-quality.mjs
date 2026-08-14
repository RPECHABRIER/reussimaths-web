import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { normalizeExercise } from "./src/lib/exercise.js";
import { buildPedagogicalFeedback } from "./src/lib/pedagogicalFeedback.js";

const COLLEGE_LEVELS = new Set(["sixieme", "cinquieme", "quatrieme", "troisieme"]);
const DIFFICULTIES = ["facile", "standard", "expert"];
const SAMPLES = 120;
const directory = new URL("./src/chapters/", import.meta.url);
const files = (await readdir(directory)).filter((file) => file.endsWith(".js") && file !== "registry.js").sort();
const errors = [];
const summaries = [];

const textOf = (value) => typeof value === "string" ? value : value?.text ?? "";
const allText = (exercise) => [exercise.prompt, exercise.chapter, ...(exercise.steps ?? []).map(textOf)].join(" ");
const wrongAnswer = (exercise) => exercise.type === "numeric"
  ? String(Number(exercise.answer) + 137.25)
  : exercise.type === "qcm"
    ? exercise.options?.find((option) => !Object.is(option, exercise.answer)) ?? "réponse incorrecte"
    : "réponse incorrecte";

function flag(file, difficulty, reason, exercise) {
  if (errors.length < 100) errors.push(`${file} [${difficulty}] ${reason} — ${exercise?.prompt ?? "énoncé absent"}`);
}

for (const file of files) {
  const chapter = (await import(pathToFileURL(new URL(file, directory).pathname))).default;
  if (!COLLEGE_LEVELS.has(chapter?.meta?.level)) continue;
  const prompts = new Set();
  const families = new Set();
  let generated = 0;

  for (const difficulty of DIFFICULTIES) {
    for (let index = 0; index < SAMPLES; index += 1) {
      const exercise = normalizeExercise(chapter.generate(difficulty));
      const feedback = buildPedagogicalFeedback(exercise, wrongAnswer(exercise));
      const text = allText(exercise);
      generated += 1;
      prompts.add(exercise.prompt);
      families.add(feedback.family);

      if (feedback.family === "general") flag(file, difficulty, "correction générique", exercise);
      if ((exercise.steps ?? []).length === 0) flag(file, difficulty, "correction sans étape d’application", exercise);
      if (/\b(?:undefined|NaN|Infinity)\b/.test(text)) flag(file, difficulty, "valeur technique affichée", exercise);
      if (/multilpl|mutilpl|doit être multiplier|sont obliger|axe verticale/i.test(text)) flag(file, difficulty, "faute de langue connue", exercise);
      if (exercise.type === "numeric" && exercise.answer < 0 && exercise.allowNegative === false) flag(file, difficulty, "réponse négative impossible à saisir", exercise);
      if (exercise.type === "numeric" && !Number.isFinite(exercise.answer)) flag(file, difficulty, "réponse numérique non finie", exercise);
      if (/droite graduée/i.test(exercise.prompt) && exercise.figure && !exercise.figure.numberLine) flag(file, difficulty, "droite graduée sans primitive dédiée", exercise);
      if (feedback.meaning.length < 75 || feedback.rule.length < 35) flag(file, difficulty, "explication pédagogique trop brève", exercise);
    }
  }
  summaries.push({ file, level: chapter.meta.level, generated, uniquePrompts: prompts.size, families: [...families] });
}

const byLevel = Object.groupBy
  ? Object.groupBy(summaries, ({ level }) => level)
  : summaries.reduce((result, item) => ((result[item.level] ??= []).push(item), result), {});
const total = summaries.reduce((sum, item) => sum + item.generated, 0);
console.log(`${summaries.length} chapitres du collège et ${total} exercices audités en profondeur.`);
for (const level of ["sixieme", "cinquieme", "quatrieme", "troisieme"]) {
  const rows = byLevel[level] ?? [];
  console.log(`${level}: ${rows.length} chapitres, ${rows.reduce((sum, row) => sum + row.generated, 0)} exercices.`);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Aucune anomalie de correction, de saisie ou de cohérence détectée au collège.");
}
