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
// Quasiment tous les exercices sur des configurations d'angles (angles
// supplémentaires, opposés par le sommet, adjacents, bissectrice, angles d'un
// triangle...) affichent désormais une vraie figure — voir
// buildRaysFromVertexFigure() (plusieurs demi-droites depuis un même point) et
// buildTriangleFigure() (triangle construit par loi des sinus à partir de ses
// 3 angles, avec étiquettes/coche des côtés égaux/angle droit selon le cas).
// Seuls restent volontairement sans figure : "existence d'un triangle" (les 3
// angles donnés peuvent être incohérents — un dessin y serait trompeur, soit
// faux soit révélateur de la réponse) et le classement de 4 angles différents
// en un seul QCM vrai/faux (aucune figure unique ne les représente tous).
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
  return { points: [S, A, B], segments: [{ from: "S", to: "A" }, { from: "S", to: "B" }], angleArcs: [{ at: "S", from: "A", to: "B" }] };
}

// Plusieurs demi-droites tracées depuis un même point S — utilisé pour toutes
// les configurations d'angles autour d'un sommet (supplémentaires, opposés
// par le sommet, adjacents, bissectrice...). `rays` : [{ id, angleDeg,
// dashed? }] — angleDeg est absolu (mesuré depuis l'axe horizontal).
function buildRaysFromVertexFigure(rays, highlightedPairs) {
  const rayLen = 72;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const points = [{ id: "S", x: 0, y: 0, dx: -14, dy: 14 }];
  const segments = [];
  rays.forEach((r) => {
    const angle = toRad(r.angleDeg);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    points.push({
      id: r.id,
      x: rayLen * cos,
      y: rayLen * sin,
      dx: cos * 10,
      dy: sin * 10 + 4,
      anchor: cos > 0.25 ? "start" : cos < -0.25 ? "end" : "middle",
    });
    segments.push({ from: "S", to: r.id, dashed: !!r.dashed });
  });
  const ordered = [...rays].sort((a, b) => a.angleDeg - b.angleDeg);
  const pairs = highlightedPairs ?? ordered.slice(0, -1).map((ray, index) => [ray.id, ordered[index + 1].id]);
  const angleArcs = pairs.map(([from, to], index) => ({ at: "S", from, to, radius: 15 + (index % 2) * 3 }));
  return { points, segments, angleArcs };
}

// Triangle construit à partir de ses 3 angles (en degrés, somme = 180) via la
// loi des sinus — permet d'afficher un vrai triangle (proportions correctes)
// pour n'importe quel triplet d'angles valide. `labels` : { A?, B?, C? }
// texte à afficher à l'intérieur, près du sommet correspondant (laisser vide
// l'angle inconnu que l'exercice demande de trouver). `rightAngleAt` :
// "A"|"B"|"C" pour dessiner le petit carré d'angle droit à ce sommet plutôt
// que sa valeur en texte. `equalSides` : liste de segments ("AB","AC","BC") à
// marquer d'un trait (côtés égaux, triangle isocèle/équilatéral).
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
    const at = rightAngleAt;
    const others = ["A", "B", "C"].filter((k) => k !== at);
    rightAngles.push({ at, from: others[0], to: others[1] });
  }
  return { points, segments, freeLabels, rightAngles };
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
    steps: [{ type: "resultat", text: `L'angle mesure exactement ${angle}°.` }],
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
    steps: [{ type: "resultat", text: `L'angle ASB mesure ${angle}°.` }],
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
    figure: buildAngleFigure(Math.max(angle, 2), randInt(0, 360)),
    answer: nature,
    options: ["nul", "aigu", "droit", "obtus", "plat"],
    steps: [{ type: "resultat", text: `Angle ${nature} : ${angle}°.` }],
  };
}

// ---------- 4. Classer plusieurs angles (vrai/faux) ----------
function genClassifierAngleMulti() {
  // Pas de figure ici (uniquement des affirmations textuelles), donc pas
  // d'ambiguïté visuelle à intégrer l'angle plein (360°) — contrairement à
  // genNatureAngleQCM où un angle plein serait visuellement identique à un
  // angle nul avec le tracé actuel (deux demi-droites confondues).
  const NATURES = ["aigu", "droit", "obtus", "plat", "plein"];
  const angles = shuffle([randInt(1, 89), 90, randInt(91, 179), 180, 360]).slice(0, 4);
  // On garantit qu'au moins une affirmation est vraie (sinon "coche les
  // affirmations vraies" n'aurait aucune réponse possible) : on choisit
  // d'abord, pour chaque énoncé, s'il sera vrai ou faux, avec au moins un vrai
  // parmi les 4 (countTrue entre 1 et 4), plutôt que de tirer chaque
  // affirmation au hasard indépendamment.
  const trueIndices = new Set(shuffle([0, 1, 2, 3]).slice(0, randInt(1, 4)));
  const items = angles.map((a, i) => {
    let nature;
    if (a < 90) nature = "aigu";
    else if (a === 90) nature = "droit";
    else if (a < 180) nature = "obtus";
    else if (a === 180) nature = "plat";
    else nature = "plein";
    let claimedNature;
    if (trueIndices.has(i)) {
      claimedNature = nature;
    } else {
      const wrongOptions = NATURES.filter((n) => n !== nature);
      claimedNature = pick(wrongOptions);
    }
    return { text: `Un angle de ${a}° est ${claimedNature}.`, correct: claimedNature === nature };
  });
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Angles — Nature d'un angle",
    prompt: `Coche les affirmations vraies.`,
    options,
    answer,
    steps: [{ type: "regle", text: `aigu : moins de 90° ; droit : 90° ; obtus : entre 90° et 180° ; plat : 180° ; plein : 360°.` }],
  };
}

// ---------- 5. Angles supplémentaires ----------
function genAnglesSupplementaires() {
  const a = randInt(10, 170);
  const b = 180 - a;
  const askB = Math.random() < 0.5;
  const theta = randInt(0, 360);
  const figure = buildRaysFromVertexFigure([
    { id: "A", angleDeg: theta },
    { id: "C", angleDeg: theta + a },
    { id: "B", angleDeg: theta + 180 },
  ]);
  return {
    type: "numeric",
    chapter: "Angles — Angles supplémentaires",
    prompt: askB
      ? `A, S et B sont alignés. L'angle ASC mesure ${a}°. Quelle est la mesure de l'angle CSB (supplémentaire) ?`
      : `A, S et B sont alignés. L'angle CSB mesure ${b}°. Quelle est la mesure de l'angle ASC (supplémentaire) ?`,
    figure,
    answer: askB ? b : a,
    steps: [
      { type: "regle", text: `Deux angles supplémentaires (formés de part et d'autre d'une droite) ont une somme de 180°.` },
      { type: "calcul", text: `${a} + ${b} = 180` },
    ],
  };
}

// ---------- 6. Angles opposés par le sommet ----------
function genAnglesOpposesParSommet() {
  const a = randInt(10, 170);
  const theta = randInt(0, 180);
  const figure = buildRaysFromVertexFigure([
    { id: "A", angleDeg: theta },
    { id: "B", angleDeg: theta + 180 },
    { id: "C", angleDeg: theta + a },
    { id: "D", angleDeg: theta + a + 180 },
  ], [["A", "C"], ["B", "D"]]);
  return {
    type: "numeric",
    chapter: "Angles — Angles opposés par le sommet",
    prompt: `Les droites (AB) et (CD) se coupent en S. L'angle ASC mesure ${a}°. Quelle est la mesure de l'angle BSD, opposé par le sommet ?`,
    figure,
    answer: a,
    steps: [{ type: "regle", text: `Deux angles opposés par le sommet ont toujours la même mesure.` }],
  };
}

// ---------- 7. Angles adjacents (somme) ----------
function genSommeAnglesAdjacents() {
  const total = randInt(30, 175);
  const part1 = randInt(5, total - 5);
  const part2 = total - part1;
  const askPart2 = Math.random() < 0.5;
  const theta = randInt(0, 360);
  const figure = buildRaysFromVertexFigure([
    { id: "A", angleDeg: theta },
    { id: "C", angleDeg: theta + part1 },
    { id: "B", angleDeg: theta + total },
  ]);
  return {
    type: "numeric",
    chapter: "Angles — Angles adjacents",
    prompt: askPart2
      ? `L'angle ASB mesure ${total}°. La demi-droite [SC] le partage en deux angles adjacents ASC et CSB. ASC mesure ${part1}°. Quelle est la mesure de CSB ?`
      : `L'angle ASB mesure ${total}°. La demi-droite [SC] le partage en deux angles adjacents ASC et CSB. CSB mesure ${part2}°. Quelle est la mesure de ASC ?`,
    figure,
    answer: askPart2 ? part2 : part1,
    steps: [
      { type: "regle", text: `Les angles adjacents ASC et CSB se partagent l'angle ASB : leur somme est égale à ASB.` },
      { type: "calcul", text: `${total} - ${askPart2 ? part1 : part2} = ${askPart2 ? part2 : part1}` },
    ],
  };
}

// =========================== Mémo 3 : bissectrice ===========================

// ---------- 8. Bissectrice d'un angle (les deux sens) ----------
function genBissectrice() {
  const half = randInt(5, 89);
  const total = half * 2;
  const askTotal = Math.random() < 0.5;
  const theta = randInt(0, 360);
  const figure = buildRaysFromVertexFigure([
    { id: "A", angleDeg: theta },
    { id: "d", angleDeg: theta + half, dashed: true },
    { id: "B", angleDeg: theta + total },
  ]);
  return {
    type: "numeric",
    chapter: "Angles — Bissectrice",
    prompt: askTotal
      ? `(d) est la bissectrice de l'angle ASB. Chaque angle formé par (d) mesure ${half}°. Quelle est la mesure de l'angle ASB ?`
      : `(d) est la bissectrice de l'angle ASB, qui mesure ${total}°. Quelle est la mesure de chacun des deux angles formés par (d) ?`,
    figure,
    answer: askTotal ? total : half,
    steps: [
      { type: "regle", text: `Une bissectrice partage un angle en deux angles adjacents de même mesure.` },
      { type: "calcul", text: askTotal ? `${half} \\times 2 = ${total}` : `${total} \\div 2 = ${half}` },
    ],
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
    figure: buildTriangleFigure(a, b, c, { labels: { A: `${a}°`, B: `${b}°` } }),
    answer: c,
    steps: [
      { type: "regle", text: `La somme des angles d'un triangle vaut toujours 180°.` },
      { type: "calcul", text: `180 - (${a} + ${b}) = ${c}` },
    ],
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
    figure: buildTriangleFigure(a, b, 90, { labels: { A: `${a}°` }, rightAngleAt: "C" }),
    answer: b,
    steps: [
      { type: "regle", text: `Dans un triangle rectangle, les deux angles aigus sont complémentaires (leur somme vaut 90°).` },
      { type: "calcul", text: `90 - ${a} = ${b}` },
    ],
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
    steps: [
      {
        type: "calcul",
        text: `${a} + ${b} + ${c} = ${sum}${sum === 180 ? " = 180°, le triangle existe." : ", ce n'est pas 180° donc ce triangle n'existe pas."}`,
      },
    ],
  };
}

// ---------- 12. Angles adjacents formant un angle plat ----------
function genAnglesAlignesChaine() {
  const a = randInt(10, 60);
  const b = randInt(10, 60);
  const c = 180 - a - b;
  const figure = buildRaysFromVertexFigure([
    { id: "C", angleDeg: 0 },
    { id: "P", angleDeg: a },
    { id: "Q", angleDeg: a + b },
    { id: "A", angleDeg: 180 },
  ]);
  return {
    type: "numeric",
    chapter: "Angles — Angles et points alignés",
    prompt: `Les points A, B et C sont alignés. Trois demi-droites issues d'un même point de (AC) forment avec elle trois angles adjacents de ${a}°, ${b}° et x°, dont la somme vaut 180° (angle plat). Quelle est la valeur de x ?`,
    figure,
    answer: c,
    steps: [{ type: "calcul", text: `180 - (${a} + ${b}) = ${c}` }],
  };
}

// NOTE (audit programme 2026, cycle 3, BO du 17-4-2025) : un générateur
// "genAngleExterieurTriangle" a été retiré d'ici. Même constat que celui déjà
// fait pour le cycle 4 dans triangles.js (5e) : l'expression "angle
// extérieur" n'apparaît nulle part dans le programme officiel — ni en cycle 3
// (6e) ni en cycle 4 (5e/4e/3e). Ce n'est donc pas seulement un contenu
// "trop tôt" pour la 6e, mais une notion absente des textes réglementaires
// sous ce nom à tout niveau du collège.

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
  const c = 180 - a - b;
  return {
    type: "multi",
    chapter: "Angles — Problèmes",
    prompt: `Un triangle a deux angles de ${a}° et ${b}°. Coche les questions auxquelles tu pourrais répondre avec cette seule information.`,
    figure: buildTriangleFigure(a, b, c, { labels: { A: `${a}°`, B: `${b}°` } }),
    options,
    answer,
    steps: [
      { type: "regle", text: `Connaître deux angles permet de déduire le troisième et de savoir si un angle est droit, mais pas les longueurs des côtés.` },
    ],
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
  const theta = randInt(0, 360);
  const figure = buildRaysFromVertexFigure([
    { id: "A", angleDeg: theta },
    { id: "d", angleDeg: theta + half, dashed: true },
    { id: "B", angleDeg: theta + total },
  ]);
  return {
    type: "multi",
    chapter: "Angles — Problèmes",
    prompt: `(d) est la bissectrice de l'angle ASB qui mesure ${total}°. Coche les affirmations vraies.`,
    figure,
    options,
    answer,
    steps: [{ type: "calcul", text: `${total} \\div 2 = ${half}` }],
  };
}

// ---------- 16. Angle entre deux bissectrices ----------
function genProblemeBissectriceAngleEntre() {
  const yOx = randInt(10, 60);
  let zOy = randInt(10, 80);
  if ((yOx + zOy) % 2 !== 0) zOy += 1;
  const uOv = (yOx + zOy) / 2;
  const figure = buildRaysFromVertexFigure([
    { id: "x", angleDeg: 0 },
    { id: "u", angleDeg: yOx / 2, dashed: true },
    { id: "y", angleDeg: yOx },
    { id: "v", angleDeg: yOx + zOy / 2, dashed: true },
    { id: "z", angleDeg: yOx + zOy },
  ]);
  return {
    type: "numeric",
    chapter: "Angles — Problèmes",
    prompt: `On considère deux angles adjacents zOy et yOx. yOx mesure ${yOx}°. On trace les bissectrices de ces deux angles : l'angle qu'elles forment entre elles mesure ${uOv}°. Combien mesure zOy ?`,
    figure,
    answer: zOy,
    steps: [
      { type: "regle", text: `L'angle entre les deux bissectrices vaut la moitié de (zOy + yOx).` },
      { type: "resultat", text: `zOy = ${uOv} \\times 2 - ${yOx} = ${zOy}` },
    ],
  };
}

// ---------- 17. Triangle isocèle : angles ----------
function genProblemeTriangleIsoceleAngles() {
  const baseAngle = randInt(20, 79);
  const sommetAngle = 180 - 2 * baseAngle;
  const askSommet = Math.random() < 0.5;
  const labels = askSommet ? { B: `${baseAngle}°`, C: `${baseAngle}°` } : { A: `${sommetAngle}°` };
  return {
    type: "numeric",
    chapter: "Angles — Triangle isocèle",
    prompt: askSommet
      ? `Un triangle isocèle a deux angles à la base égaux à ${baseAngle}° chacun. Quelle est la mesure de l'angle au sommet ?`
      : `Un triangle isocèle a un angle au sommet de ${sommetAngle}°. Quelle est la mesure de chacun des deux angles à la base (égaux) ?`,
    figure: buildTriangleFigure(sommetAngle, baseAngle, baseAngle, { labels, equalSides: ["AB", "CA"] }),
    answer: askSommet ? sommetAngle : baseAngle,
    steps: [
      { type: "regle", text: `Dans un triangle isocèle, les deux angles à la base sont égaux, et la somme des trois angles vaut 180°.` },
      { type: "calcul", text: `180 - 2 \\times ${baseAngle} = ${sommetAngle}` },
    ],
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
  genProblemeCocheQuestionsAngles,
  genProblemeVraiFauxAngles,
  genProblemeBissectriceAngleEntre,
  genProblemeTriangleIsoceleAngles,
];

const DIFFICULTY = {
  genEstimerAngleQCM: "facile",
  genMesurerAngleFigure: "facile",
  genNatureAngleQCM: "facile",
  genTroisiemeAngleTriangle: "facile",
  genTroisiemeAngleTriangleRectangle: "facile",
  genClassifierAngleMulti: "standard",
  genAnglesSupplementaires: "standard",
  genAnglesOpposesParSommet: "standard",
  genSommeAnglesAdjacents: "standard",
  genBissectrice: "standard",
  genTriangleExisteQCM: "standard",
  genAnglesAlignesChaine: "standard",
  genProblemeCocheQuestionsAngles: "expert",
  genProblemeVraiFauxAngles: "expert",
  genProblemeBissectriceAngleEntre: "expert",
  genProblemeTriangleIsoceleAngles: "expert",
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
    id: "angles",
    title: "Angles",
    description: "Nature des angles, angles supplémentaires, bissectrice, angles d'un triangle.",
    pourquoi: "Reconnaître et mesurer des angles, c'est ce qui permet de lire un plan, régler une pente ou comprendre l'architecture qui nous entoure.",
    level: "sixieme",
    free: false,
    order: 7,
    cours: {
      mindMap: {
        title: "Angles",
        branches: [
          {
            title: "Nature d'un angle",
            items: [
              "Aigu : entre 0° et 90° (par exemple 60°, comme sur la figure).",
              "Droit : exactement 90°, marqué par un petit carré sur les figures.",
              "Obtus : entre 90° et 180°.",
              "Piège classique : un angle plat (180°) ressemble à une droite (ses deux demi-droites sont alignées) ; un angle nul (0°) ou plein (360°, un tour complet) n'est ni aigu, ni droit, ni obtus, ni plat.",
            ],
            figure: buildAngleFigure(60, 20),
          },
          {
            title: "Deux droites qui se croisent",
            items: [
              "Deux angles côte à côte, situés de part et d'autre d'une même droite, forment ensemble un angle plat : on dit qu'ils sont supplémentaires, et leur somme fait toujours 180°.",
              "Quand deux droites se croisent (sécantes) en un point, elles forment 4 angles ; les deux angles opposés (pas côte à côte) sont appelés opposés par le sommet et sont toujours égaux.",
            ],
            formula: "\\(a + b = 180°\\)",
            figure: buildRaysFromVertexFigure([
              { id: "A", angleDeg: 0 },
              { id: "C", angleDeg: 70 },
              { id: "B", angleDeg: 180 },
              { id: "D", angleDeg: 250 },
            ], [["A", "C"], ["B", "D"]]),
          },
          {
            title: "Bissectrice",
            items: [
              "Une demi-droite intérieure à un angle le partage en deux angles adjacents dont la somme est égale à l'angle total.",
              "La bissectrice est le cas particulier où ces deux angles adjacents ont la même mesure.",
            ],
            formula: "\\(\\text{ASB} = 2 \\times \\text{ASd}\\)",
            figure: buildRaysFromVertexFigure([
              { id: "A", angleDeg: 20 },
              { id: "d", angleDeg: 55, dashed: true },
              { id: "B", angleDeg: 90 },
            ]),
          },
          {
            title: "Angles d'un triangle",
            items: [
              "La somme des trois angles d'un triangle est toujours égale à 180°.",
              "Un triangle rectangle a un angle droit ; un triangle isocèle a deux angles égaux.",
            ],
            formula: "\\(\\widehat{A} + \\widehat{B} + \\widehat{C} = 180°\\)",
            figure: buildTriangleFigure(70, 60, 50, { labels: { A: "70°", B: "60°", C: "50°" } }),
          },
        ],
      },
    },
  },
  generate,
};
