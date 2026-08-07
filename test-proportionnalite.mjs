import katex from "katex";
import chapterMod from "./src/chapters/proportionnalite.js";

const ITER = 6000;
let bad = 0;
const badExamples = [];
const latexSegments = new Set();
const HAS_DELIMITER = /\\\(|\\\[/;
const HAS_RAW_LATEX = /\\[a-zA-Z]+|[\^_]\{/;

function collectLatex(str) {
  if (typeof str !== "string") return;
  if (HAS_DELIMITER.test(str)) {
    const re = /\\\((.*?)\\\)|\\\[(.*?)\\\]/gs;
    let m;
    while ((m = re.exec(str))) {
      latexSegments.add(m[1] ?? m[2]);
    }
  } else if (HAS_RAW_LATEX.test(str)) {
    latexSegments.add(str);
  }
}

function checkExercise(ex, genName) {
  const problems = [];
  if (!ex || typeof ex !== "object") problems.push("exercise not object");
  if (!ex.prompt || typeof ex.prompt !== "string") problems.push("missing prompt");
  if (!ex.chapter) problems.push("missing chapter");
  if (!Array.isArray(ex.steps) || ex.steps.length === 0) problems.push("missing/empty steps");
  if (/\d\.\d/.test(ex.prompt || "")) problems.push("raw un-Frenchified decimal in prompt: " + ex.prompt);

  if (ex.type === "numeric") {
    if (typeof ex.answer !== "number" || !Number.isFinite(ex.answer)) problems.push("numeric answer not finite: " + ex.answer);
  } else if (ex.type === "qcm") {
    if (!Array.isArray(ex.options) || ex.options.length < 2) problems.push("qcm needs >=2 options");
    const set = new Set(ex.options);
    if (set.size !== ex.options.length) problems.push("qcm duplicate options: " + JSON.stringify(ex.options));
    if (!ex.options.includes(ex.answer)) problems.push("qcm answer not in options: " + ex.answer + " / " + JSON.stringify(ex.options));
  } else if (ex.type === "multi") {
    if (!Array.isArray(ex.options)) problems.push("multi needs options array");
    if (!Array.isArray(ex.answer)) problems.push("multi needs answer array");
    else {
      for (const a of ex.answer) {
        if (typeof a !== "number" || a < 0 || a >= ex.options.length) problems.push("multi answer index out of range: " + a);
      }
    }
  } else if (ex.type === "text") {
    if (typeof ex.answer !== "string") problems.push("text answer not string: " + ex.answer);
  } else {
    problems.push("unknown type: " + ex.type);
  }

  collectLatex(ex.prompt);
  if (Array.isArray(ex.options)) ex.options.forEach(collectLatex);
  if (Array.isArray(ex.steps)) {
    ex.steps.forEach((s) => {
      if (typeof s === "string") collectLatex(s);
      else if (s && typeof s.text === "string") collectLatex(s.text);
    });
  }

  if (problems.length) {
    bad++;
    if (badExamples.length < 20) badExamples.push({ gen: genName, problems, ex });
  }
}

const difficulties = [undefined, "facile", "standard", "expert"];
for (const diff of difficulties) {
  const n = diff === undefined ? ITER : Math.floor(ITER / 2);
  for (let i = 0; i < n; i++) {
    let ex;
    try {
      ex = chapterMod.generate(diff);
    } catch (e) {
      bad++;
      if (badExamples.length < 20) badExamples.push({ gen: "generate(" + diff + ")", problems: ["threw: " + e.message], ex: null });
      continue;
    }
    checkExercise(ex, ex && ex.chapter);
  }
}

console.log(`Total generated (approx): ${ITER + 3 * Math.floor(ITER / 2)}`);
console.log(`bad=${bad}`);
if (badExamples.length) {
  console.log("Sample problems:");
  for (const b of badExamples) {
    console.log(JSON.stringify(b, null, 2));
  }
}

console.log(`\nLaTeX segments collected: ${latexSegments.size}`);
let katexErrors = 0;
const katexBadSamples = [];
for (const seg of latexSegments) {
  try {
    katex.renderToString(seg, { throwOnError: true, strict: "error" });
  } catch (e) {
    if (e.message.includes("unicodeTextInMathMode")) continue; // accepted repo-wide: production KaTeX isn't strict
    katexErrors++;
    if (katexBadSamples.length < 20) katexBadSamples.push({ seg, err: e.message });
  }
}
console.log(`katexErrors=${katexErrors}`);
if (katexBadSamples.length) {
  console.log("Sample KaTeX errors:");
  for (const b of katexBadSamples) console.log(JSON.stringify(b));
}

process.exit(bad > 0 || katexErrors > 0 ? 1 : 0);
