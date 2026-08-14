import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { normalizeExercise } from "./src/lib/exercise.js";
import { parseNumericInput } from "./src/lib/answerMatch.js";
import { canTypeNumericAnswer, canonicalNumericInput, NUMERIC_KEYPAD_KEYS } from "./src/lib/numericKeypad.js";

const directory = new URL("./src/chapters/", import.meta.url);
const files = (await readdir(directory)).filter((file) => file.endsWith(".js") && file !== "registry.js").sort();
const errors = [];
const difficulties = ["facile", "standard", "expert"];
let generated = 0;
let numeric = 0;
let text = 0;
let choices = 0;

for (const required of ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "±", ",", "/", "+∞", "−∞", "⌫"]) {
  if (!NUMERIC_KEYPAD_KEYS.includes(required)) errors.push(`Touche obligatoire absente : ${required}`);
}

for (const file of files) {
  const chapter = (await import(pathToFileURL(new URL(file, directory).pathname))).default;
  for (const difficulty of difficulties) {
    for (let index = 0; index < 120; index += 1) {
      const exercise = normalizeExercise(chapter.generate(difficulty));
      generated += 1;
      if (exercise.type === "numeric") {
        numeric += 1;
        const input = canonicalNumericInput(exercise.answer);
        const parsed = parseNumericInput(input);
        const tolerance = exercise.tolerance ?? 0.001;
        if (!canTypeNumericAnswer(exercise.answer)) errors.push(`${file} [${difficulty}] réponse impossible à composer : ${exercise.answer}`);
        else if (!Number.isFinite(parsed) || Math.abs(parsed - exercise.answer) > tolerance) errors.push(`${file} [${difficulty}] réponse composée refusée : ${input} pour ${exercise.answer}`);
      } else if (exercise.type === "text") {
        text += 1;
        const answers = Array.isArray(exercise.answer) ? exercise.answer : [exercise.answer];
        if (!answers.some((answer) => typeof answer === "string" && answer.trim())) errors.push(`${file} [${difficulty}] réponse textuelle absente`);
      } else if (exercise.type === "qcm" || exercise.type === "multi") {
        choices += 1;
      } else {
        errors.push(`${file} [${difficulty}] mode de réponse inconnu : ${exercise.type}`);
      }
    }
  }
}

console.log(`${generated} exercices contrôlés : ${numeric} réponses au pavé, ${text} au clavier libre et ${choices} par sélection.`);
if (errors.length) {
  console.error(errors.slice(0, 100).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Chaque réponse attendue peut être saisie avec le clavier ou le mode de sélection proposé.");
}
