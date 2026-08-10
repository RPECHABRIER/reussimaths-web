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
let figuresChecked = 0;
let graphsChecked = 0;
let negativeNumericAnswersChecked = 0;

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

function inspectFigure(figure, file, difficulty) {
  if (!figure || typeof figure !== "object") return report(file, difficulty, "figure invalide");
  const points = Array.isArray(figure.points) ? figure.points : [];
  if (points.some((point) => !Number.isFinite(point?.x) || !Number.isFinite(point?.y))) report(file, difficulty, "coordonnées de point invalides");
  const ids = new Set(points.map((point) => point?.id).filter(Boolean));
  if (!points.length) report(file, difficulty, "figure sans point");
  if (ids.size !== points.length) report(file, difficulty, "identifiants de points absents ou dupliqués");
  const requirePoint = (id, context) => {
    if (!ids.has(id)) report(file, difficulty, `${context}: point introuvable ${id}`);
  };
  const ensureDistinct = (from, to, context) => {
    if (from === to) report(file, difficulty, `${context}: deux extrémités identiques`);
  };
  for (const segment of figure.segments ?? []) {
    requirePoint(segment.from, "segment"); requirePoint(segment.to, "segment"); ensureDistinct(segment.from, segment.to, "segment");
    if (segment.ticks != null && (!Number.isInteger(segment.ticks) || segment.ticks < 0 || segment.ticks > 3)) report(file, difficulty, "codage de longueur invalide");
  }
  for (const line of figure.lines ?? []) { requirePoint(line.from, "droite"); requirePoint(line.to, "droite"); ensureDistinct(line.from, line.to, "droite"); }
  for (const circle of figure.circles ?? []) {
    requirePoint(circle.center, "cercle");
    if (circle.through) { requirePoint(circle.through, "cercle"); ensureDistinct(circle.center, circle.through, "cercle"); }
    if (circle.radius != null && (!Number.isFinite(circle.radius) || circle.radius <= 0)) report(file, difficulty, "rayon de cercle invalide");
  }
  for (const angle of figure.rightAngles ?? []) {
    requirePoint(angle.at, "angle droit"); requirePoint(angle.from, "angle droit"); requirePoint(angle.to, "angle droit");
    ensureDistinct(angle.at, angle.from, "angle droit"); ensureDistinct(angle.at, angle.to, "angle droit");
    const at = points.find((point) => point.id === angle.at);
    const from = points.find((point) => point.id === angle.from);
    const to = points.find((point) => point.id === angle.to);
    if (at && from && to) {
      const ux = from.x - at.x, uy = from.y - at.y, vx = to.x - at.x, vy = to.y - at.y;
      const scale = Math.hypot(ux, uy) * Math.hypot(vx, vy);
      if (scale > 0 && Math.abs(ux * vx + uy * vy) / scale > 1e-6) report(file, difficulty, "codage d'angle droit sur un angle non perpendiculaire");
    }
  }
  for (const angle of figure.angleArcs ?? []) {
    requirePoint(angle.at, "arc d'angle"); requirePoint(angle.from, "arc d'angle"); requirePoint(angle.to, "arc d'angle");
    ensureDistinct(angle.at, angle.from, "arc d'angle"); ensureDistinct(angle.at, angle.to, "arc d'angle");
    if (angle.radius != null && (!Number.isFinite(angle.radius) || angle.radius <= 0)) report(file, difficulty, "rayon d'arc d'angle invalide");
  }
  if (figure.numberLine) {
    requirePoint(figure.numberLine.from, "droite graduée");
    requirePoint(figure.numberLine.to, "droite graduée");
    if (!Number.isInteger(figure.numberLine.tickCount) || figure.numberLine.tickCount < 2) report(file, difficulty, "droite graduée sans graduations valides");
    if (figure.numberLine.arrowEnd === false && !figure.numberLine.arrowStart) report(file, difficulty, "droite graduée sans sens");
  }
  if (figure.coordinatePlane) {
    const plane = figure.coordinatePlane;
    [plane.xFrom, plane.xTo, plane.yFrom, plane.yTo].forEach((id) => requirePoint(id, "repère"));
    if (![plane.xTickCount, plane.yTickCount].every((count) => Number.isInteger(count) && count >= 2)) report(file, difficulty, "repère sans graduations valides");
    if (![plane.xMin, plane.xMax, plane.yMin, plane.yMax].every(Number.isFinite)) report(file, difficulty, "repère sans bornes numériques");
  }
  figuresChecked += 1;
}

function inspectGraph(graph, file, difficulty) {
  if (![graph?.xMin, graph?.xMax, graph?.yMin, graph?.yMax].every(Number.isFinite)) return report(file, difficulty, "graphique sans bornes valides");
  if (!(graph.xMin < graph.xMax && graph.yMin < graph.yMax)) report(file, difficulty, "bornes de graphique incohérentes");
  const automaticStep = (min, max) => {
    const raw = Math.abs(max - min) / 10;
    if (!Number.isFinite(raw) || raw <= 1) return 1;
    const magnitude = 10 ** Math.floor(Math.log10(raw));
    const normalized = raw / magnitude;
    return (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude;
  };
  const xStep = graph.xStep ?? automaticStep(graph.xMin, graph.xMax);
  const yStep = graph.yStep ?? automaticStep(graph.yMin, graph.yMax);
  if (xStep <= 0 || yStep <= 0) report(file, difficulty, "graduation de graphique non positive");
  const xTickCount = (graph.xMax - graph.xMin) / xStep;
  const yTickCount = (graph.yMax - graph.yMin) / yStep;
  if (xTickCount > 100 || yTickCount > 100) report(file, difficulty, "graphique avec trop de graduations");
  for (const point of graph.points ?? []) if (![point.x, point.y].every(Number.isFinite)) report(file, difficulty, "point de graphique invalide");
  for (const line of graph.lines ?? []) if (![line.a, line.b].every(Number.isFinite)) report(file, difficulty, "droite affine invalide");
  for (const shade of graph.shade ?? []) if (![shade.from, shade.to].every(Number.isFinite) || shade.from > shade.to) report(file, difficulty, "intervalle surligné invalide");
  for (const curve of graph.curves ?? []) if (typeof curve.fn !== "function") report(file, difficulty, "courbe sans fonction");
  graphsChecked += 1;
}

function inspectCourseVisuals(value, file) {
  if (!value || typeof value !== "object") return;
  if (value.figure) inspectFigure(value.figure, file, "cours");
  if (value.graph) inspectGraph(value.graph, file, "cours");
  for (const nested of Object.values(value)) inspectCourseVisuals(nested, file);
}

function inspect(exercise, file, difficulty) {
  if (!exercise || typeof exercise !== "object") return report(file, difficulty, "exercice absent");
  if (typeof exercise.prompt !== "string" || !exercise.prompt.trim()) report(file, difficulty, "énoncé absent");
  if (typeof exercise.chapter !== "string" || !exercise.chapter.trim()) report(file, difficulty, "libellé de chapitre absent");
  if (!Array.isArray(exercise.steps) || exercise.steps.length === 0) report(file, difficulty, "correction absente");
  if (!["numeric", "qcm", "multi", "text"].includes(exercise.type)) report(file, difficulty, `type inconnu ${exercise.type}`);

  if (exercise.type === "numeric") {
    if (typeof exercise.answer !== "number" || !Number.isFinite(exercise.answer)) report(file, difficulty, `réponse numérique invalide ${exercise.answer}`);
    else if (exercise.answer < 0) negativeNumericAnswersChecked += 1;
  }
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
  if (/gradu[ée]e?[^.]{0,80}ci-dessous|ci-dessous[^.]{0,80}gradu[ée]e?/i.test(exercise.prompt) && !exercise.figure?.numberLine) {
    report(file, difficulty, "énoncé de droite graduée sans primitive numberLine");
  }
  if (exercise.figure) inspectFigure(exercise.figure, file, difficulty);
  if (exercise.graph) inspectGraph(exercise.graph, file, difficulty);
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
  inspectCourseVisuals(chapter.meta?.cours, file);

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

console.log(`${files.length} chapitres, ${generated} exercices, ${figuresChecked} figures, ${graphsChecked} graphiques, ${negativeNumericAnswersChecked} réponses négatives et ${latexSegments.size} expressions mathématiques contrôlés.`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Aucune anomalie détectée.");
}
