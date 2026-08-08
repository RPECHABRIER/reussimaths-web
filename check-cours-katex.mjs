import katex from "katex";

const file = process.argv[2];
if (!file) {
  console.error("usage: node check-cours-katex.mjs <chapter-file>");
  process.exit(1);
}
const mod = await import(file);
const mindMap = mod.default?.meta?.cours?.mindMap;
if (!mindMap) {
  console.error("no meta.cours.mindMap found");
  process.exit(1);
}

const HAS_DELIMITER = /\\\(|\\\[/;
const segments = new Set();
function collect(str) {
  if (typeof str !== "string") return;
  if (HAS_DELIMITER.test(str)) {
    const re = /\\\((.*?)\\\)|\\\[(.*?)\\\]/gs;
    let m;
    while ((m = re.exec(str))) segments.add(m[1] ?? m[2]);
  }
}

collect(mindMap.title);
for (const b of mindMap.branches) {
  collect(b.title);
  (b.items || []).forEach(collect);
  collect(b.formula);
}

console.log(`branches=${mindMap.branches.length}`);
console.log(`latex segments: ${segments.size}`);
let errors = 0;
for (const seg of segments) {
  try {
    katex.renderToString(seg, { throwOnError: true, strict: "error" });
  } catch (e) {
    if (e.message.includes("unicodeTextInMathMode")) continue;
    errors++;
    console.log("BAD:", JSON.stringify(seg), "->", e.message);
  }
}
console.log(`katexErrors=${errors}`);

// Figure sanity: every point referenced by segments/lines/circles/rightAngles must exist.
let figErrors = 0;
for (const b of mindMap.branches) {
  if (!b.figure) continue;
  const ids = new Set((b.figure.points || []).map((p) => p.id));
  const checkRef = (id, ctx) => {
    if (!ids.has(id)) {
      figErrors++;
      console.log(`BAD FIGURE REF in branch "${b.title}" (${ctx}): ${id}`);
    }
  };
  (b.figure.segments || []).forEach((s) => { checkRef(s.from, "segment"); checkRef(s.to, "segment"); });
  (b.figure.lines || []).forEach((l) => { checkRef(l.from, "line"); checkRef(l.to, "line"); });
  (b.figure.circles || []).forEach((c) => { checkRef(c.center, "circle.center"); if (c.through) checkRef(c.through, "circle.through"); });
  (b.figure.rightAngles || []).forEach((r) => { checkRef(r.at, "rightAngle.at"); checkRef(r.from, "rightAngle.from"); checkRef(r.to, "rightAngle.to"); });
}
console.log(`figErrors=${figErrors}`);

process.exit(errors > 0 || figErrors > 0 ? 1 : 0);
