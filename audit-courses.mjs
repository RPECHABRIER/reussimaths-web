import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import katex from "katex";

const chapterDirectory = new URL("./src/chapters/", import.meta.url);
const files = (await readdir(chapterDirectory)).filter((name) => name.endsWith(".js") && name !== "registry.js").sort();
const levelArgument = process.argv.find((argument) => argument.startsWith("--level="));
const levelFilter = levelArgument?.slice("--level=".length) || null;
const supportChapter = /automatismes|réviser les bases|exercices (?:transversaux|de fin d[’']année|fin d[’']année|rituels)|préparation|dossier/i;
const issues = [];
let chapters = 0;
let courses = 0;
let branches = 0;
let items = 0;
let formulas = 0;

function add(file, detail) {
  issues.push(`${file} : ${detail}`);
}

function checkMath(file, text) {
  if (typeof text !== "string") return;
  for (const match of text.matchAll(/\\\((.*?)\\\)|\\\[(.*?)\\\]/gs)) {
    const expression = match[1] ?? match[2];
    formulas += 1;
    try {
      katex.renderToString(expression, { throwOnError: true, strict: "error" });
    } catch (error) {
      add(file, `expression mathématique invalide « ${expression} » (${error.message})`);
    }
  }
}

for (const file of files) {
  const chapter = (await import(pathToFileURL(new URL(file, chapterDirectory).pathname))).default;
  if (levelFilter && chapter.meta.level !== levelFilter) continue;
  chapters += 1;
  const course = chapter.meta.cours;
  if (!course) {
    if (!supportChapter.test(chapter.meta.title)) add(file, "cours absent pour un chapitre notionnel");
    continue;
  }
  courses += 1;
  const mindMap = course.mindMap;
  if (!mindMap?.title?.trim()) add(file, "titre de carte mentale absent");
  if (!Array.isArray(mindMap?.branches) || mindMap.branches.length < 2) {
    add(file, "carte mentale trop peu structurée");
    continue;
  }
  const titles = new Set();
  for (const branch of mindMap.branches) {
    branches += 1;
    const title = branch?.title?.trim();
    if (!title) add(file, "branche sans titre");
    else if (titles.has(title)) add(file, `branche dupliquée « ${title} »`);
    else titles.add(title);
    if (!Array.isArray(branch?.items) || branch.items.length === 0) add(file, `branche « ${title ?? "?"} » sans explication`);
    for (const item of branch?.items ?? []) {
      items += 1;
      if (typeof item !== "string" || item.trim().length < 18) add(file, `explication trop courte dans « ${title ?? "?"} »`);
      checkMath(file, item);
    }
    if (branch?.formula != null && (typeof branch.formula !== "string" || branch.formula.trim().length < 4)) add(file, `formule vide dans « ${title ?? "?"} »`);
    checkMath(file, branch?.formula);
  }
}

console.log(`${chapters} chapitres contrôlés : ${courses} cours, ${branches} rubriques, ${items} explications et ${formulas} expressions mathématiques.`);
if (issues.length) {
  console.error(issues.slice(0, 80).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Aucune anomalie de structure ou de rendu détectée dans les cours.");
}
