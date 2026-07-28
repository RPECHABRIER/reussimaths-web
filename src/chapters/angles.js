// ---------------------------------------------------------------------------
// Chapitre : Angles (6e) — sous abonnement.
//
// Reprend la tâche intellectuelle des exercices fournis (Mémo 1 "angles,
// angles supplémentaires/adjacents/opposés par le sommet", Mémo 2 "mesures
// des angles", Mémo 3 "bissectrice d'un angle", Mémo 4 "angles d'un
// triangle", et une sélection de problèmes), avec des nombres, prénoms et
// contextes différents à chaque génération.
//
// Contrairement au chapitre précédent (Distances et symétries), celui-ci est
// majoritairement numérique et se prête bien à l'auto-correction. Volontairement
// laissés de côté : les exercices demandant de tracer/construire un angle ou
// sa bissectrice aux instruments (Mémo 2-3, ex. 25-37), de colorier ou coder
// une figure (ex. 6, 7, 9, 11), et le problème de trajectoire de billard/carte
// au trésor à construire graphiquement (ex. 55, 57, 58). "Estimer"/"mesurer un
// angle" sont simulés via une figure géométrique (deux demi-droites tracées à
// l'angle exact), l'élève lit ou estime la mesure directement sur le dessin.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const roundTo = (n, d) => Math.round(n * 10 ** d) / 10 ** d;

function shuffleStatements(items) {
  const order = shuffle(items.map((_, i) => i));
  const options = order.map((i) => items[i].text);
  const answer = order.map((i, newIndex) => (items[i].correct ? newIndex : null)).filter((v) => v !== null);
  return { options, answer };
}

function buildAngleFigure(angleDeg, startAngleDeg) {
  const rayLen = 60;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const S = { id: "S", x: 0, y: 0, dx: -14, dy: 12 };
  const A = { id: "A", x: rayLen * Math.cos(toRad(startAngleDeg)), y: rayLen * Math.sin(toRad(startAngleDeg)), dy: -8 };
  const B = { id: "B", x: rayLen * Math.cos(toRad(startAngleDeg + angleDeg)), y: rayLen * Math.sin(toRad(startAngleDeg + angleDeg)), dy: -8 };
  return { points: [S, A, B], segments: [{ from: "S", to: "A" }, { from: "S", to: "B" }] };
}

// =========================== Mémo 2 : mesures des angles ===========================

// ---------- 1. Estimer un angle (QCM au plus proche) ----------
function genEstimerAngleQCM() {
  const angle = pick([20, 30, 45, 60, 75, 90, 105, 120, 135, 150, 160]);
  const startAngle = randInt(0, 360);
  const decoys = shuffle([angle - 30, angle + 30, angle - 60, angle + 60].filter((d) => d > 0 && d < 180 && d !== angle)).slice(0, 2);
  const options = shuffle([`${angle}°`, ...decoys.map((d) => `${d}°`)]);
  return {
    type: "qcm",
    chapter: "Angles — Estimer un angle",
    prompt: `Estime la mesure de cet angle et choisis la réponse la plus proche.`,
    figure: buildAngleFigure(angle, startAngle),
    answer: `${angle}°`,
    options,
    steps: [`L'angle mesure exactement ${angle}°.`],
  };
}

// ---------- 2. Mesurer un angle (lecture directe) ----------
function genMesurerAngleFigure() {
  const angle = randInt(15, 165);
  const startAngle = randInt(0, 360);
  return {
    type: "numeric",
    chapter: "Angles — Mesurer un angle",
    prompt: `Quelle est la mesure de l'angle ASB, en degrés ?`,
    figure: buildAngleFigure(angle, startAngle),
    answer: angle,
    tolerance: 3,
    steps: [`L'angle ASB mesure ${angle}°.`],
  };
}

// =========================== Mémo 1 : angles, relations ===========================

// ---------- 3. Nature d'un angle ----------
function genNatureAngleQCM() {
  const angle = pick([0, randInt(1, 89), 90, randInt(91, 179), 180]);
  let nature;
  if (angle === 0) nature = "nul";
  else if (angle < 90) nature = "aigu";
  else if (angle === 90) nature = "droit";
  else if (angle < 180) nature = "obtus";
  else nature = "plat";
  return {
    type: "qcm",
    chapter: "Angles — Nature d'un angle",
    prompt: `Un angle mesure ${angle}°. Quelle est sa nature ?`,
    answer: nature,
    options: ["nul", "aigu", "droit", "obtus", "plat"],
    steps: [`Angle ${nature} : ${angle}°.`],
  };
}

// ---------- 4. Classer plusieurs angles (vrai/faux) ----------
function genClassifierAngleMulti() {
  const angles = shuffle([randInt(1, 89), 90, randInt(91, 179), 180]);
  const items = angles.map((a) => {
    let nature;
    if (a < 90) nature = "aigu";
    else if (a === 90) nature = "droit";
    else if (a < 180) nature = "obtus";
    else nature = "plat";
    const claimedNature = pick(["aigu", "droit", "obtus", "plat"]);
    return { text: `Un angle de ${a}° est ${claimedNature}.`, correct: claimedNature === nature };
  });
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Angles — Nature d'un angle",
    prompt: `Coche les affirmations vraies.`,
    options,
    answer,
    steps: [`aigu : moins de 90° ; droit : 90° ; obtus : entre 90° et 180° ; plat : 180°.`],
  };
}

// ---------- 5. Angles supplémentaires ----------
function genAnglesSupplementaires() {
  const a = randInt(10, 170);
  const b = 180 - a;
  const askB = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Angles — Angles supplémentaires",
    prompt: askB
      ? `Deux angles sont supplémentaires. Le premier mesure ${a}°. Quelle est la mesure du second ?`
      : `Deux angles supplémentaires mesurent ${b}° et x°. Quelle est la valeur de x ?`,
    answer: askB ? b : a,
    steps: [`${a} + ${b} = 180`],
  };
}

// ---------- 6. Angles opposés par le sommet ----------
function genAnglesOpposesParSommet() {
  const a = randInt(10, 170);
  return {
    type: "numeric",
    chapter: "Angles — Angles opposés par le sommet",
    prompt: `Deux angles sont opposés par le sommet. Le premier mesure ${a}°. Quelle est la mesure du second ?`,
    answer: a,
    steps: [`Deux angles opposés par le sommet ont toujours la même mesure.`],
  };
}

// ---------- 7. Angles adjacents (somme) ----------
function genSommeAnglesAdjacents() {
  const total = randInt(30, 175);
  const part1 = randInt(5, total - 5);
  const part2 = total - part1;
  const askPart2 = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Angles — Angles adjacents",
    prompt: askPart2
      ? `L'angle ASB mesure ${total}°. La demi-droite [SC] le partage en deux angles adjacents ASC et CSB. ASC mesure ${part1}°. Quelle est la mesure de CSB ?`
      : `L'angle ASB mesure ${total}°. La demi-droite [SC] le partage en deux angles adjacents ASC et CSB. CSB mesure ${part2}°. Quelle est la mesure de ASC ?`,
    answer: askPart2 ? part2 : part1,
    steps: [`${total} - ${askPart2 ? part1 : part2} = ${askPart2 ? part2 : part1}`],
  };
}

// =========================== Mémo 3 : bissectrice ===========================

// ---------- 8. Bissectrice d'un angle (les deux sens) ----------
function genBissectrice() {
  const half = randInt(5, 89);
  const total = half * 2;
  const askTotal = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Angles — Bissectrice",
    prompt: askTotal
      ? `(d) est la bissectrice de l'angle ASB. Chaque angle formé par (d) mesure ${half}°. Quelle est la mesure de l'angle ASB ?`
      : `(d) est la bissectrice de l'angle ASB, qui mesure ${total}°. Quelle est la mesure de chacun des deux angles formés par (d) ?`,
    answer: askTotal ? total : half,
    steps: [askTotal ? `${half} \\times 2 = ${total}` : `${total} \\div 2 = ${half}`],
  };
}

// =========================== Mémo 4 : angles d'un triangle ===========================

// ---------- 9. Troisième angle d'un triangle ----------
function genTroisiemeAngleTriangle() {
  const a = randInt(20, 120);
  const b = randInt(20, 160 - a);
  const c = 180 - a - b;
  return {
    type: "numeric",
    chapter: "Angles — Angles d'un triangle",
    prompt: `Dans un triangle, deux angles mesurent ${a}° et ${b}°. Quelle est la mesure du troisième angle ?`,
    answer: c,
    steps: [`180 - (${a} + ${b}) = ${c}`],
  };
}

// ---------- 10. Troisième angle d'un triangle rectangle ----------
function genTroisiemeAngleTriangleRectangle() {
  const a = randInt(5, 85);
  const b = 90 - a;
  return {
    type: "numeric",
    chapter: "Angles — Triangle rectangle",
    prompt: `Dans un triangle rectangle, un angle aigu mesure ${a}°. Quelle est la mesure de l'autre angle aigu ?`,
    answer: b,
    steps: [`90 - ${a} = ${b}`],
  };
}

// ---------- 11. Un triangle existe-t-il ? ----------
function genTriangleExisteQCM() {
  const valid = Math.random() < 0.5;
  const a = randInt(20, 120);
  const b = randInt(20, 160 - a);
  const c = valid ? 180 - a - b : Math.max(1, 180 - a - b + pick([-20, -10, 10, 20]));
  const sum = a + b + c;
  return {
    type: "qcm",
    chapter: "Angles — Existence d'un triangle",
    prompt: `Un triangle peut-il avoir des angles de ${a}°, ${b}° et ${c}° ?`,
    answer: sum === 180 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`${a} + ${b} + ${c} = ${sum}${sum === 180 ? " = 180°, le triangle existe." : ", ce n'est pas 180° donc ce triangle n'existe pas."}`],
  };
}

// ---------- 12. Angles adjacents formant un angle plat ----------
function genAnglesAlignesChaine() {
  const a = randInt(10, 60);
  const b = randInt(10, 60);
  const c = 180 - a - b;
  return {
    type: "numeric",
    chapter: "Angles — Angles et points alignés",
    prompt: `Les points A, B et C sont alignés. Trois demi-droites issues d'un même point de (AC) forment avec elle trois angles adjacents de ${a}°, ${b}° et x°, dont la somme vaut 180° (angle plat). Quelle est la valeur de x ?`,
    answer: c,
    steps: [`180 - (${a} + ${b}) = ${c}`],
  };
}

// ---------- 13. Angle extérieur d'un triangle ----------
function genAngleExterieurTriangle() {
  const int1 = randInt(20, 80);
  const int2 = randInt(20, 80);
  const ext = int1 + int2;
  const askExt = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Angles — Angle extérieur d'un triangle",
    prompt: askExt
      ? `Dans un triangle, les deux angles intérieurs non adjacents à un angle extérieur mesurent ${int1}° et ${int2}°. Quelle est la mesure de cet angle extérieur ?`
      : `L'angle extérieur d'un triangle mesure ${ext}°. L'un des deux angles intérieurs non adjacents mesure ${int1}°. Quelle est la mesure de l'autre ?`,
    answer: askExt ? ext : int2,
    steps: [`Un angle extérieur d'un triangle est égal à la somme des deux angles intérieurs non adjacents : ${int1} + ${int2} = ${ext}`],
  };
}

// =========================== Problèmes ===========================

// ---------- 14. Coche les questions auxquelles on peut répondre ----------
function genProblemeCocheQuestionsAngles() {
  const a = randInt(20, 80);
  const b = randInt(20, 80);
  const items = [
    { text: `Quelle est la mesure du troisième angle du triangle ?`, correct: true },
    { text: `Ce triangle est-il rectangle ?`, correct: true },
    { text: `Quelle est la longueur des côtés du triangle ?`, correct: false },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Angles — Problèmes",
    prompt: `Un triangle a deux angles de ${a}° et ${b}°. Coche les questions auxquelles tu pourrais répondre avec cette seule information.`,
    options,
    answer,
    steps: [`Connaître deux angles permet de déduire le troisième et de savoir si un angle est droit, mais pas les longueurs des côtés.`],
  };
}

// ---------- 15. Vrai/faux avec une bissectrice ----------
function genProblemeVraiFauxAngles() {
  const total = randInt(30, 85) * 2;
  const half = total / 2;
  const wrongHalf = half + pick([-10, 10]);
  const items = [
    { text: `Chaque angle formé par la bissectrice mesure ${half}°.`, correct: true },
    { text: `Chaque angle formé par la bissectrice mesure ${wrongHalf}°.`, correct: false },
    { text: `La bissectrice partage l'angle ASB en deux angles adjacents de même mesure.`, correct: true },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Angles — Problèmes",
    prompt: `(d) est la bissectrice de l'angle ASB qui mesure ${total}°. Coche les affirmations vraies.`,
    options,
    answer,
    steps: [`${total} \\div 2 = ${half}`],
  };
}

// ---------- 16. Angle entre deux bissectrices ----------
function genProblemeBissectriceAngleEntre() {
  const yOx = randInt(10, 60);
  let zOy = randInt(10, 80);
  if ((yOx + zOy) % 2 !== 0) zOy += 1;
  const uOv = (yOx + zOy) / 2;
  return {
    type: "numeric",
    chapter: "Angles — Problèmes",
    prompt: `On considère deux angles adjacents zOy et yOx. yOx mesure ${yOx}°. On trace les bissectrices de ces deux angles : l'angle qu'elles forment entre elles mesure ${uOv}°. Combien mesure zOy ?`,
    answer: zOy,
    steps: [`L'angle entre les deux bissectrices vaut la moitié de (zOy + yOx).`, `zOy = ${uOv} \\times 2 - ${yOx} = ${zOy}`],
  };
}

// ---------- 17. Triangle isocèle : angles ----------
function genProblemeTriangleIsoceleAngles() {
  const baseAngle = randInt(20, 79);
  const sommetAngle = 180 - 2 * baseAngle;
  const askSommet = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Angles — Triangle isocèle",
    prompt: askSommet
      ? `Un triangle isocèle a deux angles à la base égaux à ${baseAngle}° chacun. Quelle est la mesure de l'angle au sommet ?`
      : `Un triangle isocèle a un angle au sommet de ${sommetAngle}°. Quelle est la mesure de chacun des deux angles à la base (égaux) ?`,
    answer: askSommet ? sommetAngle : baseAngle,
    steps: [`180 - 2 \\times ${baseAngle} = ${sommetAngle}`],
  };
}

const GENERATORS = [
  genEstimerAngleQCM,
  genMesurerAngleFigure,
  genNatureAngleQCM,
  genClassifierAngleMulti,
  genAnglesSupplementaires,
  genAnglesOpposesParSommet,
  genSommeAnglesAdjacents,
  genBissectrice,
  genTroisiemeAngleTriangle,
  genTroisiemeAngleTriangleRectangle,
  genTriangleExisteQCM,
  genAnglesAlignesChaine,
  genAngleExterieurTriangle,
  genProblemeCocheQuestionsAngles,
  genProblemeVraiFauxAngles,
  genProblemeBissectriceAngleEntre,
  genProblemeTriangleIsoceleAngles,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "angles",
    title: "Angles",
    description: "Nature des angles, angles supplémentaires, bissectrice, angles d'un triangle.",
    level: "sixieme",
    free: false,
    order: 7,
  },
  generate,
};
