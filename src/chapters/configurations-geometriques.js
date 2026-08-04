// ---------------------------------------------------------------------------
// Chapitre : Configurations géométriques (6e) — sous abonnement.
//
// Reprend la tâche intellectuelle des exercices fournis (Mémo 1 "construire
// des triangles" / inégalité triangulaire, Mémo 2 "les triangles
// particuliers", et une sélection de problèmes), avec des nombres et
// contextes différents à chaque génération.
//
// Volontairement laissés de côté (pas automatisables avec le format actuel
// numeric/qcm/text/multi + figures point/segment/droite/cercle) : la quasi-
// totalité des constructions au compas/à la règle/au rapporteur (Mémo 1,
// ex. 1-15), et tout le Mémo 3 "Représenter l'espace" (patrons, vues de face/
// dessus/côté, comptage de cubes sur un dessin en perspective, empreintes de
// solides, ex. 28-45) qui nécessite de dessiner ou de lire un dessin 3D donné
// — remplacé partiellement par un exercice de dénombrement de cubes dans un
// pavé rectangulaire (calcul, pas lecture d'image). Également laissés de
// côté : les problèmes de patron de dé/cube à colorier ou reproduire en vraie
// grandeur (ex. 55-58, 60).
//
// Les exercices sur les triangles particuliers et leurs angles affichent
// désormais une vraie figure (triangle construit par loi des sinus, avec
// coche des côtés égaux et/ou angle droit selon le cas — voir
// buildTriangleFigure()) et les configurations d'angles autour d'un point
// affichent les demi-droites correspondantes (buildRaysFromVertexFigure()).
// Restent volontairement sans figure : l'existence d'un triangle par
// inégalité triangulaire (un dessin serait trompeur si les longueurs données
// ne permettent pas de le construire) et les problèmes de dé/volume de cubes
// (aucun rendu 3D disponible).
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function shuffleStatements(items) {
  const order = shuffle(items.map((_, i) => i));
  const options = order.map((i) => items[i].text);
  const answer = order.map((i, newIndex) => (items[i].correct ? newIndex : null)).filter((v) => v !== null);
  return { options, answer };
}

// Plusieurs demi-droites tracées depuis un même point S — voir la version
// jumelle dans src/chapters/angles.js (même logique, dupliquée ici par
// convention : chaque fichier de chapitre est indépendant).
function buildRaysFromVertexFigure(rays, vertexId = "S") {
  const rayLen = 60;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const points = [{ id: vertexId, x: 0, y: 0, dx: -14, dy: 14 }];
  const segments = [];
  rays.forEach((r) => {
    points.push({
      id: r.id,
      x: rayLen * Math.cos(toRad(r.angleDeg)),
      y: rayLen * Math.sin(toRad(r.angleDeg)),
      dy: -8,
    });
    segments.push({ from: vertexId, to: r.id, dashed: !!r.dashed });
  });
  return { points, segments };
}

// Triangle construit à partir de ses 3 angles (loi des sinus) — voir la
// version jumelle dans src/chapters/angles.js pour le détail des options.
function buildTriangleFigure(angA, angB, angC, { labels = {}, rightAngleAt, equalSides = [] } = {}) {
  const toRad = (d) => (d * Math.PI) / 180;
  const L = 100;
  const t = (L * Math.sin(toRad(angC))) / Math.sin(toRad(angA));
  const A = { x: t * Math.cos(toRad(angB)), y: -t * Math.sin(toRad(angB)) };
  const B = { x: 0, y: 0 };
  const C = { x: L, y: 0 };
  const centroid = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
  const inset = (P, frac = 0.24) => ({ x: P.x + (centroid.x - P.x) * frac, y: P.y + (centroid.y - P.y) * frac });
  const points = [
    { id: "A", x: A.x, y: A.y, dy: -8, hideLabel: true },
    { id: "B", x: B.x, y: B.y, dy: 16, hideLabel: true },
    { id: "C", x: C.x, y: C.y, dy: 16, hideLabel: true },
  ];
  const tickCount = { AB: 0, BC: 0, CA: 0 };
  equalSides.forEach((s) => {
    const key = s === "AB" || s === "BA" ? "AB" : s === "BC" || s === "CB" ? "BC" : "CA";
    tickCount[key] = 1;
  });
  const segments = [
    { from: "A", to: "B", ticks: tickCount.AB },
    { from: "B", to: "C", ticks: tickCount.BC },
    { from: "C", to: "A", ticks: tickCount.CA },
  ];
  const freeLabels = [];
  const vertexByKey = { A, B, C };
  Object.entries(labels).forEach(([key, text]) => {
    if (!text) return;
    const pos = inset(vertexByKey[key]);
    freeLabels.push({ x: pos.x, y: pos.y, text });
  });
  const rightAngles = [];
  if (rightAngleAt) {
    const others = ["A", "B", "C"].filter((k) => k !== rightAngleAt);
    rightAngles.push({ at: rightAngleAt, from: others[0], to: others[1] });
  }
  return { points, segments, freeLabels, rightAngles };
}

// =========================== Mémo 1 : construire des triangles ===========================

// ---------- 1. Un triangle existe-t-il ? (inégalité triangulaire) ----------
function genTriangleExisteInegalite() {
  const a = randInt(3, 20);
  const b = randInt(3, 20);
  const wantValid = Math.random() < 0.5;
  let c;
  if (wantValid) {
    const lo = Math.abs(a - b) + 1;
    const hi = a + b - 1;
    c = lo <= hi ? randInt(lo, hi) : Math.max(a, b);
  } else {
    c = a + b + randInt(0, 10);
  }
  const sorted = [a, b, c].sort((x, y) => x - y);
  const valid = sorted[0] + sorted[1] > sorted[2];
  return {
    type: "qcm",
    chapter: "Configurations géométriques — Existence d'un triangle",
    prompt: `Peut-on construire un triangle ABC tel que AB = ${a} cm, AC = ${b} cm et BC = ${c} cm ?`,
    answer: valid ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`${sorted[0]} + ${sorted[1]} ${valid ? ">" : "≤"} ${sorted[2]}`],
  };
}

// ---------- 2. Encadrement du troisième côté ----------
function genTroisiemeCoteQCM() {
  const a = randInt(4, 15);
  const b = randInt(4, 15);
  const validC = a + b - 1 >= Math.abs(a - b) + 1 ? randInt(Math.abs(a - b) + 1, a + b - 1) : a;
  const invalidC = a + b + randInt(1, 5);
  const options = shuffle([`${validC} cm`, `${invalidC} cm`]);
  return {
    type: "qcm",
    chapter: "Configurations géométriques — Existence d'un triangle",
    prompt: `AB = ${a} cm et AC = ${b} cm. Laquelle de ces longueurs peut être BC pour que le triangle ABC existe ?`,
    answer: `${validC} cm`,
    options,
    steps: [`Il faut que BC soit strictement compris entre ${Math.abs(a - b)} et ${a + b} cm.`],
  };
}

// =========================== Mémo 2 : triangles particuliers ===========================

// ---------- 3. Identifier la nature d'un triangle décrit ----------
function genTriangleParticulierNatureQCM() {
  const type = pick(["isocele", "equilateral", "rectangle", "rectangleIsocele", "quelconque"]);
  let desc, nature, figure;
  if (type === "isocele") {
    desc = `Le triangle DEF est tel que DE = DF.`;
    nature = "isocèle";
    figure = buildTriangleFigure(50, 65, 65, { equalSides: ["AB", "CA"] });
  } else if (type === "equilateral") {
    desc = `Le triangle IJK est tel que IJ = JK = KI.`;
    nature = "équilatéral";
    figure = buildTriangleFigure(60, 60, 60, { equalSides: ["AB", "BC", "CA"] });
  } else if (type === "rectangle") {
    desc = `Le triangle MNP a un angle droit en M.`;
    nature = "rectangle";
    figure = buildTriangleFigure(90, 35, 55, { rightAngleAt: "A" });
  } else if (type === "rectangleIsocele") {
    desc = `Le triangle RST a un angle droit en R, avec RS = RT.`;
    nature = "rectangle isocèle";
    figure = buildTriangleFigure(90, 45, 45, { rightAngleAt: "A", equalSides: ["AB", "CA"] });
  } else {
    desc = `Le triangle UVW n'a ni côtés ni angles particuliers connus.`;
    nature = "quelconque";
    figure = buildTriangleFigure(50, 60, 70);
  }
  return {
    type: "qcm",
    chapter: "Configurations géométriques — Triangles particuliers",
    prompt: `${desc} Quelle est la nature de ce triangle ?`,
    figure,
    answer: nature,
    options: ["isocèle", "équilatéral", "rectangle", "rectangle isocèle", "quelconque"],
    steps: [desc],
  };
}

// ---------- 4. Angles d'un triangle isocèle ----------
function genAngleTriangleIsocele() {
  const baseAngle = randInt(20, 79);
  const sommetAngle = 180 - 2 * baseAngle;
  const askSommet = Math.random() < 0.5;
  const sommetLettre = pick(["D", "F", "H", "K"]);
  const labels = askSommet ? { B: `${baseAngle}°`, C: `${baseAngle}°` } : { A: `${sommetAngle}°` };
  return {
    type: "numeric",
    chapter: "Configurations géométriques — Triangles particuliers",
    prompt: askSommet
      ? `Un triangle isocèle en ${sommetLettre} a deux angles à la base de ${baseAngle}° chacun. Quelle est la mesure de l'angle en ${sommetLettre} ?`
      : `Un triangle isocèle en ${sommetLettre} a un angle de ${sommetAngle}° en ${sommetLettre}. Quelle est la mesure de chacun des deux angles à la base ?`,
    figure: buildTriangleFigure(sommetAngle, baseAngle, baseAngle, { labels, equalSides: ["AB", "CA"] }),
    answer: askSommet ? sommetAngle : baseAngle,
    steps: [`180 - 2 \\times ${baseAngle} = ${sommetAngle}`],
  };
}

// ---------- 5. Angles d'un triangle équilatéral ----------
function genAngleTriangleEquilateral() {
  return {
    type: "numeric",
    chapter: "Configurations géométriques — Triangles particuliers",
    prompt: `ABC est un triangle équilatéral. Quelle est la mesure de chacun de ses angles ?`,
    figure: buildTriangleFigure(60, 60, 60, { equalSides: ["AB", "BC", "CA"] }),
    answer: 60,
    steps: [`180 \\div 3 = 60`],
  };
}

// ---------- 6. Angles d'un triangle rectangle isocèle ----------
function genAngleTriangleRectangleIsocele() {
  const askAigu = Math.random() < 0.7;
  return {
    type: "numeric",
    chapter: "Configurations géométriques — Triangles particuliers",
    prompt: askAigu
      ? `Un triangle rectangle isocèle a un angle droit. Quelle est la mesure de chacun des deux autres angles (égaux) ?`
      : `Un triangle a un angle droit et deux angles de 45°. Quelle est la mesure de l'angle droit ?`,
    figure: buildTriangleFigure(90, 45, 45, { rightAngleAt: "A", equalSides: ["AB", "CA"], labels: askAigu ? {} : { B: "45°", C: "45°" } }),
    answer: askAigu ? 45 : 90,
    steps: [askAigu ? `(180 - 90) \\div 2 = 45` : `180 - 45 - 45 = 90`],
  };
}

// ---------- 7. Triangle rectangle isocèle : identification / calcul combiné ----------
function genProblemeIsoceleRectangleCombine() {
  const askAngle = Math.random() < 0.5;
  if (askAngle) {
    return {
      type: "numeric",
      chapter: "Configurations géométriques — Triangles particuliers",
      prompt: `Le triangle FIJ est rectangle isocèle en I. Quelle est la mesure de l'angle F ?`,
      figure: buildTriangleFigure(45, 90, 45, { rightAngleAt: "B", equalSides: ["AB", "BC"] }),
      answer: 45,
      steps: [`(180 - 90) \\div 2 = 45`],
    };
  }
  return {
    type: "qcm",
    chapter: "Configurations géométriques — Triangles particuliers",
    prompt: `Un triangle a un angle droit et ses deux autres angles mesurent chacun 45°. Quelle est sa nature ?`,
    figure: buildTriangleFigure(90, 45, 45, { rightAngleAt: "A", equalSides: ["AB", "CA"] }),
    answer: "Rectangle isocèle",
    options: ["Rectangle", "Isocèle", "Rectangle isocèle", "Équilatéral"],
    steps: [`Angle droit + deux angles égaux de 45° : le triangle est à la fois rectangle et isocèle.`],
  };
}

// ---------- 8. Troisième angle d'un triangle quelconque ----------
function genTroisiemeAngleTriangleGeneral() {
  const a = randInt(20, 120);
  const b = randInt(20, 160 - a);
  const c = 180 - a - b;
  return {
    type: "numeric",
    chapter: "Configurations géométriques — Angles d'un triangle",
    prompt: `Dans un triangle, deux angles mesurent ${a}° et ${b}°. Quelle est la mesure du troisième ?`,
    figure: buildTriangleFigure(a, b, c, { labels: { A: `${a}°`, B: `${b}°` } }),
    answer: c,
    steps: [`180 - (${a} + ${b}) = ${c}`],
  };
}

// ---------- 9. Alignement via une somme d'angles ----------
function genAlignementViaAnglesQCM() {
  const a = randInt(20, 80);
  const b = randInt(20, 80);
  const cAligned = 180 - a - b;
  const alignedTrue = Math.random() < 0.5;
  const displayedC = alignedTrue ? cAligned : cAligned + pick([-15, 15]);
  const sum = a + b + displayedC;
  const figure = buildRaysFromVertexFigure(
    [
      { id: "E", angleDeg: 0 },
      { id: "G", angleDeg: a },
      { id: "H", angleDeg: a + b },
      { id: "I", angleDeg: a + b + displayedC },
    ],
    "F"
  );
  return {
    type: "qcm",
    chapter: "Configurations géométriques — Alignement",
    prompt: `Les angles EFG, GFH et HFI (trois angles adjacents) mesurent respectivement ${a}°, ${b}° et ${displayedC}°. Les points E, F et I sont-ils alignés ?`,
    figure,
    answer: sum === 180 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`${a} + ${b} + ${displayedC} = ${sum}${sum === 180 ? " = 180°, donc alignés." : ", ce n'est pas 180° donc pas alignés."}`],
  };
}

// =========================== Problèmes ===========================

// ---------- 10. Coche les questions auxquelles on peut répondre ----------
function genProblemeCocheQuestionsTriangle() {
  const a = randInt(6, 15);
  const b = a + randInt(1, Math.floor(a / 2));
  const c = a + randInt(1, Math.floor(a / 2));
  const items = [
    { text: `Ce triangle peut-il exister avec ces longueurs ?`, correct: true },
    { text: `Quelle est la mesure de chacun de ses angles ?`, correct: false },
    { text: `Quel est son périmètre ?`, correct: true },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Configurations géométriques — Problèmes",
    prompt: `Un triangle a pour côtés ${a} cm, ${b} cm et ${c} cm. Coche les questions auxquelles tu pourrais répondre avec ces seules informations.`,
    options,
    answer,
    steps: [`Connaître les 3 côtés permet de vérifier l'existence et de calculer le périmètre, mais pas les angles (sauf cas particulier, comme un triangle équilatéral).`],
  };
}

// ---------- 11. Vrai/faux : un triangle est-il constructible ----------
function genProblemeVraiFauxTriangleConstructible() {
  const AB = randInt(3, 10);
  const AC = randInt(3, 10);
  const validBC = Math.abs(AB - AC) + 1 <= AB + AC - 1 ? randInt(Math.abs(AB - AC) + 1, AB + AC - 1) : AB;
  const invalidBC = AB + AC + randInt(1, 5);
  const items = [
    { text: `Le triangle ABC existe si BC = ${validBC} cm.`, correct: true },
    { text: `Le triangle ABC existe si BC = ${invalidBC} cm.`, correct: false },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Configurations géométriques — Problèmes",
    prompt: `On veut construire un triangle ABC avec AB = ${AB} cm et AC = ${AC} cm. Coche les affirmations vraies.`,
    options,
    answer,
    steps: [`BC doit être strictement compris entre ${Math.abs(AB - AC)} et ${AB + AC} cm.`],
  };
}

// ---------- 12. Angles complémentaires (droit - angle connu) ----------
function genProblemeAnglesComplementairesBissectrice() {
  const abc = pick([60, randInt(30, 80)]);
  const answer = 90 - abc;
  const figure = buildRaysFromVertexFigure(
    [
      { id: "A", angleDeg: 0 },
      { id: "C", angleDeg: abc },
      { id: "D", angleDeg: 90 },
    ],
    "B"
  );
  return {
    type: "numeric",
    chapter: "Configurations géométriques — Problèmes",
    prompt: `Dans une figure, l'angle ABC mesure ${abc}° et l'angle ABD est droit, avec D situé de sorte que ABD = ABC + CBD. Quelle est la mesure de l'angle CBD ?`,
    figure,
    answer,
    steps: [`90 - ${abc} = ${answer}`],
  };
}

// ---------- 13. Faces opposées d'un dé ----------
function genProblemeDeNombrePoints() {
  const face = randInt(1, 6);
  return {
    type: "numeric",
    chapter: "Configurations géométriques — Problèmes",
    prompt: `Sur un dé, la somme des points de deux faces opposées est toujours égale à 7. Une face affiche ${face} points. Combien de points affiche la face opposée ?`,
    answer: 7 - face,
    steps: [`7 - ${face} = ${7 - face}`],
  };
}

// ---------- 14. Volume d'un empilement rectangulaire de cubes ----------
function genProblemeVolumeCubesSimple() {
  const L = randInt(2, 6);
  const l = randInt(2, 6);
  const h = randInt(2, 6);
  const answer = L * l * h;
  return {
    type: "numeric",
    chapter: "Configurations géométriques — Représenter l'espace",
    prompt: `Un empilement rectangulaire de petits cubes identiques mesure ${L} cubes de long, ${l} cubes de large et ${h} cubes de haut. Combien de petits cubes contient cet empilement ?`,
    answer,
    steps: [`${L} \\times ${l} \\times ${h} = ${answer}`],
  };
}

const GENERATORS = [
  genTriangleExisteInegalite,
  genTroisiemeCoteQCM,
  genTriangleParticulierNatureQCM,
  genAngleTriangleIsocele,
  genAngleTriangleEquilateral,
  genAngleTriangleRectangleIsocele,
  genProblemeIsoceleRectangleCombine,
  genTroisiemeAngleTriangleGeneral,
  genAlignementViaAnglesQCM,
  genProblemeCocheQuestionsTriangle,
  genProblemeVraiFauxTriangleConstructible,
  genProblemeAnglesComplementairesBissectrice,
  genProblemeDeNombrePoints,
  genProblemeVolumeCubesSimple,
];

const DIFFICULTY = {
  genTroisiemeCoteQCM: "facile",
  genTriangleParticulierNatureQCM: "facile",
  genAngleTriangleIsocele: "facile",
  genAngleTriangleEquilateral: "facile",
  genTriangleExisteInegalite: "standard",
  genAngleTriangleRectangleIsocele: "standard",
  genTroisiemeAngleTriangleGeneral: "standard",
  genAlignementViaAnglesQCM: "standard",
  genProblemeIsoceleRectangleCombine: "expert",
  genProblemeCocheQuestionsTriangle: "expert",
  genProblemeVraiFauxTriangleConstructible: "expert",
  genProblemeAnglesComplementairesBissectrice: "expert",
  genProblemeDeNombrePoints: "expert",
  genProblemeVolumeCubesSimple: "expert",
};

function generate(difficulty) {
  if (difficulty) {
    const pool = GENERATORS.filter((fn) => (DIFFICULTY[fn.name] ?? "standard") === difficulty);
    if (pool.length) return pick(pool)();
  }
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "configurations-geometriques",
    title: "Configurations géométriques",
    description: "Existence d'un triangle, triangles particuliers, angles, représenter l'espace.",
    pourquoi: "Savoir si un triangle existe et reconnaître des figures particulières, c'est la base de toute construction géométrique fiable.",
    level: "sixieme",
    free: false,
    order: 8,
  },
  generate,
};
