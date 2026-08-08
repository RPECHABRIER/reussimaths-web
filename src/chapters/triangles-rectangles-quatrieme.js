// ---------------------------------------------------------------------------
// Chapitre : Propriétés des triangles rectangles (4e) — sous abonnement.
//
// Correspond au chapitre 12 du sommaire officiel : théorème de Pythagore
// (calculer l'hypoténuse, calculer un côté de l'angle droit), réciproque du
// théorème de Pythagore (déterminer si un triangle est rectangle), et
// trigonométrie du triangle rectangle avec le cosinus (calculer un angle,
// calculer une longueur). Reprend la tâche intellectuelle des exercices
// fournis, avec des nombres, prénoms et contextes différents à chaque
// génération. Voir automatismes-quatrieme.js pour le thème "Calcul mental"
// associé.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const nonZero = (min, max) => {
  let n = 0;
  while (n === 0) n = randInt(min, max);
  return n;
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const roundTo = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const fr = (n) => String(n).replace(".", ",");

const PRENOMS = ["Léa", "Nathan", "Camille", "Yanis", "Inès", "Malo", "Sofia", "Adam", "Lina", "Théo", "Rania", "Enzo"];

function buildRightTriangleFigure(labels) {
  // Sommet de l'angle droit en bas à gauche.
  const R = { id: labels.right, x: 40, y: 190, dx: -14 };
  const H = { id: labels.horiz, x: 240, y: 190, dx: 14 };
  const V = { id: labels.vert, x: 40, y: 40, dy: -10 };
  return {
    points: [R, H, V],
    segments: [
      { from: labels.right, to: labels.horiz },
      { from: labels.right, to: labels.vert },
      { from: labels.vert, to: labels.horiz },
    ],
    rightAngles: [{ at: labels.right, from: labels.horiz, to: labels.vert }],
  };
}

// =========================== Théorème de Pythagore : calculer l'hypoténuse ===========================

// ---------- 1. Calculer l'hypoténuse (triplet non-pythagoricien, valeur approchée) ----------
function genCalculerHypotenuseNumeric() {
  const a = randInt(3, 20);
  const b = randInt(3, 20);
  const c = roundTo(Math.sqrt(a * a + b * b), 2);
  const noms = ["A", "B", "C"];
  const droit = noms[0];
  const autres = [noms[1], noms[2]];
  return {
    type: "numeric",
    chapter: "Théorème de Pythagore — Calculer l'hypoténuse",
    prompt: `${droit}${autres[0]}${autres[1]} est un triangle rectangle en ${droit}, avec ${droit}${autres[0]} = ${a} cm et ${droit}${autres[1]} = ${b} cm. Calcule la longueur ${autres[0]}${autres[1]}, en cm (arrondie au centième si nécessaire).`,
    figure: buildRightTriangleFigure({ right: droit, horiz: autres[0], vert: autres[1] }),
    answer: c,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `${autres[0]}${autres[1]}^2 = ${droit}${autres[0]}^2 + ${droit}${autres[1]}^2` },
      { type: "calcul", text: `${autres[0]}${autres[1]}^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${a * a + b * b}` },
      { type: "resultat", text: `${autres[0]}${autres[1]} = \\sqrt{${a * a + b * b}} \\approx ${fr(c)}` },
    ],
  };
}

// ---------- 2. Calculer l'hypoténuse (triplet pythagoricien, valeur exacte) ----------
const TRIPLETS = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [12, 16, 20],
];
function genCalculerHypotenuseExacteNumeric() {
  const k = randInt(1, 3);
  const [a0, b0, c0] = pick(TRIPLETS);
  const a = a0 * k;
  const b = b0 * k;
  const c = c0 * k;
  return {
    type: "numeric",
    chapter: "Théorème de Pythagore — Calculer l'hypoténuse",
    prompt: `RST est un triangle rectangle en R, avec RS = ${a} cm et RT = ${b} cm. Calcule la longueur ST, en cm.`,
    figure: buildRightTriangleFigure({ right: "R", horiz: "S", vert: "T" }),
    answer: c,
    steps: [
      { type: "regle", text: `ST^2 = RS^2 + RT^2` },
      { type: "calcul", text: `ST^2 = RS^2 + RT^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}` },
      { type: "resultat", text: `ST = \\sqrt{${c * c}} = ${c}` },
    ],
  };
}

// =========================== Théorème de Pythagore : calculer un côté de l'angle droit ===========================

// ---------- 3. Calculer un côté de l'angle droit ----------
function genCalculerCoteAngleDroitNumeric() {
  const k = randInt(1, 3);
  const [a0, b0, c0] = pick(TRIPLETS);
  const a = a0 * k;
  const b = b0 * k;
  const c = c0 * k;
  // On connaît l'hypoténuse c et un côté a, on cherche b.
  return {
    type: "numeric",
    chapter: "Théorème de Pythagore — Calculer un côté de l'angle droit",
    prompt: `DEF est un triangle rectangle en D, avec EF = ${c} cm (hypoténuse) et DE = ${a} cm. Calcule la longueur DF, en cm.`,
    figure: buildRightTriangleFigure({ right: "D", horiz: "E", vert: "F" }),
    answer: b,
    steps: [
      { type: "regle", text: `EF^2 = DE^2 + DF^2` },
      { type: "calcul", text: `DF^2 = EF^2 - DE^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b}` },
      { type: "resultat", text: `DF = \\sqrt{${b * b}} = ${b}` },
    ],
  };
}

// ---------- 4. Calculer un côté de l'angle droit (valeur approchée) ----------
function genCalculerCoteAngleDroitApprocheNumeric() {
  const c = randInt(15, 40);
  const a = randInt(5, c - 3);
  const bSq = c * c - a * a;
  const b = roundTo(Math.sqrt(bSq), 2);
  return {
    type: "numeric",
    chapter: "Théorème de Pythagore — Calculer un côté de l'angle droit",
    prompt: `GHI est un triangle rectangle en G, avec HI = ${c} cm (hypoténuse) et GH = ${a} cm. Calcule la longueur GI, en cm (arrondie au centième si nécessaire).`,
    figure: buildRightTriangleFigure({ right: "G", horiz: "H", vert: "I" }),
    answer: b,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `HI^2 = GH^2 + GI^2\\ \\text{, donc } GI^2 = HI^2 - GH^2` },
      { type: "calcul", text: `GI^2 = HI^2 - GH^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${bSq}` },
      { type: "resultat", text: `GI = \\sqrt{${bSq}} \\approx ${fr(b)}` },
    ],
  };
}

// ---------- 5. Problème contextualisé (Pythagore) ----------
function genProblemeContextualisePythagoreNumeric() {
  const prenom = pick(PRENOMS);
  const base = randInt(6, 20);
  const hauteur = randInt(4, 15);
  const distance = roundTo(Math.sqrt(base * base + hauteur * hauteur), 2);
  return {
    type: "numeric",
    chapter: "Théorème de Pythagore — Problèmes",
    prompt: `${prenom} attache le sommet d'un mât vertical de ${hauteur} m de haut à un piquet planté au sol, à ${base} m du pied du mât, à l'aide d'un câble tendu en ligne droite. Quelle est la longueur de ce câble, en m (arrondie au centième si nécessaire) ?`,
    answer: distance,
    tolerance: 0.02,
    steps: [
      { type: "donnee", text: `\\text{Le mât, le sol et le câble forment un triangle rectangle.}` },
      { type: "calcul", text: `\\text{câble}^2 = ${hauteur}^2 + ${base}^2 = ${hauteur * hauteur} + ${base * base} = ${hauteur * hauteur + base * base}` },
      { type: "resultat", text: `\\text{câble} = \\sqrt{${hauteur * hauteur + base * base}} \\approx ${fr(distance)}\\ \\text{m}` },
    ],
  };
}

// =========================== Réciproque du théorème de Pythagore ===========================

// ---------- 6. Le triangle est-il rectangle ? (réciproque, QCM) ----------
function genReciproquePythagoreQCM() {
  const isRight = Math.random() < 0.5;
  const k = randInt(1, 3);
  const [a0, b0, c0] = pick(TRIPLETS);
  let a = a0 * k;
  let b = b0 * k;
  let c = c0 * k;
  if (!isRight) {
    c = c + nonZero(1, 4);
  }
  const noms = ["A", "B", "C"];
  const sq = (x) => Math.round(x * x * 100) / 100;
  return {
    type: "qcm",
    chapter: "Théorème de Pythagore — Réciproque",
    prompt: `Un triangle ${noms.join("")} a pour longueurs de côtés ${noms[0]}${noms[1]} = ${a} cm, ${noms[1]}${noms[2]} = ${b} cm et ${noms[0]}${noms[2]} = ${c} cm. Ce triangle est-il rectangle ?`,
    answer: isRight ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `\\text{Plus grand côté : } ${noms[0]}${noms[2]}^2 = ${c}^2 = ${sq(c)}` },
      { type: "calcul", text: `${noms[0]}${noms[1]}^2 + ${noms[1]}${noms[2]}^2 = ${a}^2 + ${b}^2 = ${sq(a)} + ${sq(b)} = ${sq(a) + sq(b)}` },
      {
        type: "resultat",
        text: isRight
          ? "Les deux résultats sont égaux : d'après la réciproque du théorème de Pythagore, le triangle est rectangle."
          : "Les deux résultats sont différents : le triangle n'est pas rectangle.",
      },
    ],
  };
}

// ---------- 7. En quel sommet le triangle est-il rectangle ? ----------
function genReciproqueSommetQCM() {
  const k = randInt(1, 3);
  const [a0, b0, c0] = pick(TRIPLETS);
  const a = a0 * k; // côté 1
  const b = b0 * k; // côté 2
  const c = c0 * k; // hypoténuse (côté le plus long), donc rectangle au sommet OPPOSÉ à ce côté
  // triangle KLM, avec KL = a, LM = b, KM = c (hypoténuse) → rectangle en L
  return {
    type: "qcm",
    chapter: "Théorème de Pythagore — Réciproque",
    prompt: `Un triangle KLM a pour longueurs de côtés KL = ${a} cm, LM = ${b} cm et KM = ${c} cm. En quel sommet ce triangle est-il rectangle ?`,
    answer: "L",
    options: ["K", "L", "M"],
    steps: [
      { type: "regle", text: `\\text{Le plus grand côté est [KM], donc le sommet opposé à [KM] est le sommet de l'angle droit.}` },
      { type: "calcul", text: `KM^2 = KL^2 + LM^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}` },
      { type: "resultat", text: `\\text{Le triangle KLM est donc rectangle en L.}` },
    ],
  };
}

// =========================== Trigonométrie : le cosinus dans le triangle rectangle ===========================

// ---------- 8. Calculer un angle avec le cosinus ----------
function genCalculerAngleCosinusNumeric() {
  const adjacent = randInt(3, 15);
  const hypotenuse = randInt(adjacent + 2, adjacent + 20);
  const angle = roundTo((Math.acos(adjacent / hypotenuse) * 180) / Math.PI, 1);
  return {
    type: "numeric",
    chapter: "Théorème de Pythagore — Trigonométrie (cosinus)",
    prompt: `NPQ est un triangle rectangle en P, avec NP = ${adjacent} cm et NQ = ${hypotenuse} cm (hypoténuse). Calcule la mesure de l'angle \\(\\widehat{PNQ}\\), en degrés (arrondie au dixième).`,
    figure: buildRightTriangleFigure({ right: "P", horiz: "N", vert: "Q" }),
    answer: angle,
    tolerance: 0.2,
    steps: [
      { type: "calcul", text: `\\cos(\\widehat{PNQ}) = \\dfrac{NP}{NQ} = \\dfrac{${adjacent}}{${hypotenuse}} \\approx ${fr(roundTo(adjacent / hypotenuse, 4))}` },
      { type: "resultat", text: `\\widehat{PNQ} \\approx ${fr(angle)}°` },
    ],
  };
}

// ---------- 9. Calculer une longueur (côté adjacent) avec le cosinus ----------
function genCalculerLongueurCosinusAdjacentNumeric() {
  const angle = randInt(20, 70);
  const hypotenuse = randInt(8, 30);
  const adjacent = roundTo(hypotenuse * Math.cos((angle * Math.PI) / 180), 2);
  return {
    type: "numeric",
    chapter: "Théorème de Pythagore — Trigonométrie (cosinus)",
    prompt: `UVW est un triangle rectangle en V, avec \\(\\widehat{WUV} = ${angle}°\\) et UW = ${hypotenuse} cm (hypoténuse). Calcule la longueur UV, en cm (arrondie au centième).`,
    figure: buildRightTriangleFigure({ right: "V", horiz: "U", vert: "W" }),
    answer: adjacent,
    tolerance: 0.05,
    steps: [
      { type: "regle", text: `\\cos(\\widehat{WUV}) = \\dfrac{UV}{UW}` },
      { type: "resultat", text: `UV = \\cos(${angle}°) \\times ${hypotenuse} \\approx ${fr(adjacent)}` },
    ],
  };
}

// ---------- 10. Calculer l'hypoténuse avec le cosinus ----------
function genCalculerHypotenuseCosinusNumeric() {
  const angle = randInt(20, 70);
  const adjacent = randInt(5, 25);
  const hypotenuse = roundTo(adjacent / Math.cos((angle * Math.PI) / 180), 2);
  return {
    type: "numeric",
    chapter: "Théorème de Pythagore — Trigonométrie (cosinus)",
    prompt: `XYZ est un triangle rectangle en Y, avec \\(\\widehat{ZXY} = ${angle}°\\) et XY = ${adjacent} cm. Calcule la longueur XZ (hypoténuse), en cm (arrondie au centième).`,
    figure: buildRightTriangleFigure({ right: "Y", horiz: "X", vert: "Z" }),
    answer: hypotenuse,
    tolerance: 0.05,
    steps: [
      { type: "regle", text: `\\cos(\\widehat{ZXY}) = \\dfrac{XY}{XZ}` },
      { type: "resultat", text: `XZ = \\dfrac{${adjacent}}{\\cos(${angle}°)} \\approx ${fr(hypotenuse)}` },
    ],
  };
}

// ---------- 11. Un cosinus valide ou non ? (QCM conceptuel) ----------
function genCosinusValideQCM() {
  const valid = Math.random() < 0.5;
  const value = valid ? roundTo(Math.random() * 2 - 1, 2) : roundTo(1 + Math.random() * 1.5, 2);
  return {
    type: "qcm",
    chapter: "Théorème de Pythagore — Trigonométrie (cosinus)",
    prompt: `Peut-on avoir \\(\\cos(\\widehat{x}) = ${fr(value)}\\) pour un angle aigu \\(\\widehat{x}\\) ?`,
    answer: valid ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: `Le cosinus d'un angle est toujours compris entre -1 et 1 (et entre 0 et 1 pour un angle aigu).` }],
  };
}

// ---------- 12. Somme des angles d'un triangle rectangle ----------
function genSommeAnglesTriangleRectangleNumeric() {
  const angleConnu = randInt(15, 80);
  const angleInconnu = 90 - angleConnu;
  return {
    type: "numeric",
    chapter: "Théorème de Pythagore — Trigonométrie (cosinus)",
    prompt: `Dans un triangle ABC rectangle en A, on a \\(\\widehat{ABC} = ${angleConnu}°\\). Calcule la mesure de l'angle \\(\\widehat{ACB}\\), en degrés.`,
    answer: angleInconnu,
    steps: [
      { type: "regle", text: `\\text{La somme des angles d'un triangle vaut } 180°.` },
      { type: "resultat", text: `\\widehat{ACB} = 180 - 90 - ${angleConnu} = ${angleInconnu}°` },
    ],
  };
}

// ---------- 13. Problème contextualisé (cosinus, pente/inclinaison) ----------
function genProblemeContextualiseCosinusNumeric() {
  const prenom = pick(PRENOMS);
  const distanceParcourue = randInt(50, 250);
  const pente = randInt(8, 25);
  const denivele = roundTo(distanceParcourue * Math.sin((pente * Math.PI) / 180), 1);
  return {
    type: "numeric",
    chapter: "Théorème de Pythagore — Problèmes",
    prompt: `${prenom} monte une côte rectiligne de ${distanceParcourue} m de long, avec une pente de ${pente}° par rapport à l'horizontale. Quel est le dénivelé (la hauteur gravie), en m (arrondi au mètre près) ?`,
    answer: denivele,
    tolerance: 1,
    steps: [
      { type: "calcul", text: `\\text{L'angle entre la pente et l'horizontale au sommet vaut } 90 - ${pente} = ${90 - pente}°.` },
      { type: "regle", text: `\\cos(${90 - pente}°) = \\dfrac{\\text{dénivelé}}{${distanceParcourue}}` },
      { type: "resultat", text: `\\text{dénivelé} \\approx ${fr(denivele)}\\ \\text{m}` },
    ],
  };
}

const GENERATORS = [
  genCalculerHypotenuseNumeric,
  genCalculerHypotenuseExacteNumeric,
  genCalculerCoteAngleDroitNumeric,
  genCalculerCoteAngleDroitApprocheNumeric,
  genProblemeContextualisePythagoreNumeric,
  genReciproquePythagoreQCM,
  genReciproqueSommetQCM,
  genCalculerAngleCosinusNumeric,
  genCalculerLongueurCosinusAdjacentNumeric,
  genCalculerHypotenuseCosinusNumeric,
  genCosinusValideQCM,
  genSommeAnglesTriangleRectangleNumeric,
  genProblemeContextualiseCosinusNumeric,
];

const DIFFICULTY = {
  genCalculerHypotenuseNumeric: "facile",
  genCalculerCoteAngleDroitNumeric: "facile",
  genCosinusValideQCM: "facile",
  genSommeAnglesTriangleRectangleNumeric: "facile",
  genCalculerHypotenuseExacteNumeric: "standard",
  genCalculerCoteAngleDroitApprocheNumeric: "standard",
  genReciproquePythagoreQCM: "standard",
  genReciproqueSommetQCM: "standard",
  genCalculerAngleCosinusNumeric: "standard",
  genCalculerLongueurCosinusAdjacentNumeric: "standard",
  genCalculerHypotenuseCosinusNumeric: "standard",
  genProblemeContextualisePythagoreNumeric: "expert",
  genProblemeContextualiseCosinusNumeric: "expert",
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
    id: "triangles-rectangles-quatrieme",
    title: "Propriétés des triangles rectangles",
    description: "Théorème de Pythagore, réciproque, et trigonométrie du triangle rectangle avec le cosinus.",
    pourquoi: "Pythagore et la trigonométrie permettent de calculer une longueur ou une hauteur inaccessible à partir d'un simple angle.",
    level: "quatrieme",
    free: false,
    order: 13,
    cours: {
      mindMap: {
        title: "Propriétés des triangles rectangles",
        branches: [
          {
            title: "Théorème de Pythagore",
            items: [
              "Dans un triangle rectangle, le carré de l'hypoténuse (côté opposé à l'angle droit) est égal à la somme des carrés des deux autres côtés.",
              "On peut aussi isoler un côté de l'angle droit en soustrayant au lieu d'additionner.",
            ],
            formula: "\\(BC^2 = BA^2 + AC^2\\)",
            figure: buildRightTriangleFigure({ right: "A", horiz: "B", vert: "C" }),
          },
          {
            title: "Réciproque : le triangle est-il rectangle ?",
            items: [
              "On compare le carré du plus grand côté à la somme des carrés des deux autres.",
              "Si les deux résultats sont égaux, le triangle est rectangle, et l'angle droit est au sommet opposé au plus grand côté.",
              "Piège classique : identifier le bon sommet — c'est celui qui n'appartient pas au plus grand côté.",
            ],
            figure: buildRightTriangleFigure({ right: "K", horiz: "L", vert: "M" }),
          },
          {
            title: "Cosinus : calculer un angle",
            items: [
              "Dans un triangle rectangle, le cosinus d'un angle aigu = côté adjacent ÷ hypoténuse.",
              "Le cosinus est toujours compris entre 0 et 1 pour un angle aigu.",
            ],
            formula: "\\(\\cos(\\widehat{x}) = \\dfrac{\\text{côté adjacent}}{\\text{hypoténuse}}\\)",
            figure: buildRightTriangleFigure({ right: "P", horiz: "N", vert: "Q" }),
          },
          {
            title: "Cosinus : calculer une longueur",
            items: [
              "Pour trouver le côté adjacent, on multiplie l'hypoténuse par le cosinus de l'angle.",
              "Pour trouver l'hypoténuse, on divise le côté adjacent par le cosinus de l'angle.",
              "Piège classique : bien repérer l'angle utilisé — le côté adjacent change selon le sommet choisi.",
            ],
            figure: buildRightTriangleFigure({ right: "V", horiz: "U", vert: "W" }),
          },
        ],
      },
    },
  },
  generate,
};
