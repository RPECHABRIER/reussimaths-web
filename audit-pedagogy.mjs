import { readdir } from "node:fs/promises";
import { normalizeExercise } from "./src/lib/exercise.js";
import { buildPedagogicalFeedback } from "./src/lib/pedagogicalFeedback.js";

const chapterDirectory = new URL("./src/chapters/", import.meta.url);
const files = (await readdir(chapterDirectory)).filter((name) => name.endsWith(".js") && name !== "registry.js").sort();
const difficulties = ["facile", "standard", "expert"];
const samplesPerDifficulty = 80;
const levelArgument = process.argv.find((argument) => argument.startsWith("--level="));
const levelFilter = levelArgument?.slice("--level=".length) || null;
const familyCounts = new Map();
const genericLabelCounts = new Map();
const anomalies = [];
const summaries = [];
const COLLEGE_LEVELS = new Set(["sixieme", "cinquieme", "quatrieme", "troisieme"]);
const ADVANCED_FAMILIES = new Set(["sequence_convergence", "integral_calculus", "space_vectors", "random_variables", "combinatorics", "calculus_derivative", "exponential_logarithm"]);
const EXPECTED_LEVEL_FAMILIES = {
  quatrieme: new Set(["relative_numbers", "fractions", "powers", "distributivity", "equations", "proportionality", "statistics_mean", "probability_basic", "pythagoras", "geometry_thales"]),
  troisieme: new Set(["number_theory", "distributivity", "equations", "function_image", "function_antecedent", "function_affine_coefficients", "proportionality", "statistics_mean", "probability_basic", "geometry_thales", "geometry_trigonometry"]),
  seconde: new Set(["real_number_sets", "powers", "equations", "geometry_vectors", "geometry_coordinates", "function_domain", "function_image", "function_antecedent", "function_affine_coefficients", "function_variations", "percentage_change", "statistics_mean", "statistics_median", "statistics_quartiles", "probability_basic"]),
  "premiere-spe": new Set(["algebra_second_degree", "calculus_derivative", "sequence_convergence", "exponential_logarithm", "geometry_trigonometry", "geometry_dot_product", "random_variables", "probability_conditional", "algorithm_assignments"]),
  "premiere-non-spe": new Set(["algebra_second_degree", "calculus_derivative", "sequence_convergence", "function_variations", "percentage_change", "statistics_median", "probability_basic", "probability_tree"]),
  "premiere-techno": new Set(["algebra_second_degree", "calculus_derivative", "sequence_convergence", "function_variations", "statistics", "random_variables", "probability_conditional", "algorithm_assignments"]),
  "terminale-spe": new Set(["calculus_derivative", "continuity_reasoning", "sequence_convergence", "exponential_logarithm", "integral_calculus", "space_vectors", "combinatorics", "random_variables"]),
  "terminale-techno": new Set(["function_variations", "sequence_convergence", "exponential_logarithm", "statistics", "random_variables", "probability_conditional", "probability_tree"]),
};

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
  const chapter = (await import(new URL(file, chapterDirectory).href)).default;
  if (levelFilter && chapter.meta.level !== levelFilter) continue;
  const prompts = new Set();
  const families = new Set();
  let generated = 0;
  let shortCorrections = 0;
  let shortRenderedCorrections = 0;
  let genericFeedback = 0;
  let answerLeaks = 0;
  let levelMismatches = 0;

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
      if (COLLEGE_LEVELS.has(chapter.meta.level) && ADVANCED_FAMILIES.has(feedback.family)) {
        levelMismatches += 1;
        if (levelMismatches <= 2) add(file, "famille_hors_niveau", feedback.family, exercise);
      }
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
    levelMismatches,
  });
}

const priority = summaries
  .filter((summary) => summary.shortRenderedCorrections || summary.genericFeedback || summary.answerLeaks || summary.levelMismatches)
  .sort((a, b) => (b.genericFeedback - a.genericFeedback) || (b.shortRenderedCorrections - a.shortRenderedCorrections) || (b.answerLeaks - a.answerLeaks));

const report = {
  level: levelFilter ?? "tous",
  chapters: summaries.length,
  generated: summaries.reduce((sum, item) => sum + item.generated, 0),
  familyCounts: Object.fromEntries([...familyCounts].sort((a, b) => b[1] - a[1])),
  genericLabels: Object.fromEntries([...genericLabelCounts].sort((a, b) => b[1] - a[1]).slice(0, 120)),
  priority,
  anomalySamples: anomalies.slice(0, 160),
};
const expectedFamilies = EXPECTED_LEVEL_FAMILIES[levelFilter];
report.missingCoreFamilies = expectedFamilies ? [...expectedFamilies].filter((family) => !familyCounts.has(family)) : [];

if (process.argv.includes("--check")) {
  const genericCount = familyCounts.get("general") ?? 0;
  const shortRenderedCount = summaries.reduce((sum, item) => sum + item.shortRenderedCorrections, 0);
  const levelMismatchCount = summaries.reduce((sum, item) => sum + item.levelMismatches, 0);
  console.log(`${report.chapters} chapitres et ${report.generated} exercices audités : ${genericCount} retour(s) générique(s), ${shortRenderedCount} correction(s) affichée(s) trop courte(s), ${levelMismatchCount} famille(s) hors niveau, ${report.missingCoreFamilies.length} notion(s) essentielle(s) absente(s).`);
  if (genericCount > 0 || shortRenderedCount > 0 || levelMismatchCount > 0 || report.missingCoreFamilies.length > 0) process.exitCode = 1;
} else {
  console.log(JSON.stringify(report, null, 2));
}
