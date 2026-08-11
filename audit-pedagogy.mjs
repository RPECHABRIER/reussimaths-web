import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { normalizeExercise } from "./src/lib/exercise.js";
import { buildPedagogicalFeedback } from "./src/lib/pedagogicalFeedback.js";

const chapterDirectory = new URL("./src/chapters/", import.meta.url);
const files = (await readdir(chapterDirectory)).filter((name) => name.endsWith(".js") && name !== "registry.js").sort();
const difficulties = ["facile", "standard", "expert"];
const samplesPerDifficulty = 80;
const familyCounts = new Map();
const genericLabelCounts = new Map();
const anomalies = [];
const summaries = [];

const stepText = (step) => typeof step === "string" ? step : step?.text ?? "";
const wrongResponse = (exercise) => exercise.type === "numeric"
  ? String(Number(exercise.answer) + 137.25)
  : exercise.type === "qcm"
    ? exercise.options?.find((option) => !Object.is(option, exercise.answer)) ?? "réponse fausse"
    : "réponse fausse";

function add(file, kind, detail, exercise) {
  anomalies.push({ file, kind, detail, prompt: exercise?.prompt });
}

for (const file of files) {
  const chapter = (await import(pathToFileURL(new URL(file, chapterDirectory).pathname))).default;
  const prompts = new Set();
  const families = new Set();
  let generated = 0;
  let shortCorrections = 0;
  let shortRenderedCorrections = 0;
  let genericFeedback = 0;
  let answerLeaks = 0;

  for (const difficulty of difficulties) {
    for (let index = 0; index < samplesPerDifficulty; index += 1) {
      const exercise = normalizeExercise(chapter.generate(difficulty));
      generated += 1;
      prompts.add(exercise.prompt);
      const steps = (exercise.steps ?? []).map(stepText).filter(Boolean);
      const correctionLength = steps.join(" ").length;
      if (steps.length < 2 || correctionLength < 55) {
        shortCorrections += 1;
      }

      const feedback = buildPedagogicalFeedback(exercise, wrongResponse(exercise));
      const renderedCorrectionLength = feedback.intro.length + feedback.meaning.length + feedback.rule.length + feedback.conclusion.length + correctionLength;
      if (renderedCorrectionLength < 300) {
        shortRenderedCorrections += 1;
        if (shortRenderedCorrections <= 2) add(file, "correction_affichee_trop_courte", `${renderedCorrectionLength} caractères`, exercise);
      }
      families.add(feedback.family);
      familyCounts.set(feedback.family, (familyCounts.get(feedback.family) ?? 0) + 1);
      if (feedback.family === "general") {
        genericFeedback += 1;
        genericLabelCounts.set(exercise.chapter, (genericLabelCounts.get(exercise.chapter) ?? 0) + 1);
        if (genericFeedback <= 2) add(file, "retour_generique", exercise.chapter, exercise);
      }
      if (feedback.meaning.length < 75 || feedback.rule.length < 35) add(file, "retour_trop_bref", `${feedback.meaning.length}/${feedback.rule.length}`, exercise);

      if (exercise.type === "numeric" && steps.length > 1) {
        const answer = String(exercise.answer).replace(".", ",");
        if (answer.length >= 2 && steps.slice(0, -1).some((step) => step.includes(answer))) {
          answerLeaks += 1;
          if (answerLeaks <= 2) add(file, "reponse_avant_derniere_etape", answer, exercise);
        }
      }
    }
  }

  summaries.push({
    file,
    chapterId: chapter.meta.id,
    level: chapter.meta.level,
    generated,
    uniquePrompts: prompts.size,
    families: [...families],
    shortCorrections,
    shortRenderedCorrections,
    genericFeedback,
    answerLeaks,
  });
}

const priority = summaries
  .filter((summary) => summary.shortRenderedCorrections || summary.genericFeedback || summary.answerLeaks)
  .sort((a, b) => (b.genericFeedback - a.genericFeedback) || (b.shortRenderedCorrections - a.shortRenderedCorrections) || (b.answerLeaks - a.answerLeaks));

const report = {
  chapters: files.length,
  generated: summaries.reduce((sum, item) => sum + item.generated, 0),
  familyCounts: Object.fromEntries([...familyCounts].sort((a, b) => b[1] - a[1])),
  genericLabels: Object.fromEntries([...genericLabelCounts].sort((a, b) => b[1] - a[1]).slice(0, 120)),
  priority,
  anomalySamples: anomalies.slice(0, 160),
};

if (process.argv.includes("--check")) {
  const genericCount = familyCounts.get("general") ?? 0;
  const shortRenderedCount = summaries.reduce((sum, item) => sum + item.shortRenderedCorrections, 0);
  console.log(`${report.chapters} chapitres et ${report.generated} exercices audités : ${genericCount} retour(s) générique(s), ${shortRenderedCount} correction(s) affichée(s) trop courte(s).`);
  if (genericCount > 0 || shortRenderedCount > 0) process.exitCode = 1;
} else {
  console.log(JSON.stringify(report, null, 2));
}
