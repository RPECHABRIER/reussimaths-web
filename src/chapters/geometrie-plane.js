// ---------------------------------------------------------------------------
// Chapitre : Géométrie plane (4e) — sous abonnement.
//
// Correspond au chapitre 13 du sommaire officiel : démontrer l'égalité de
// deux triangles (critères côté-côté-côté, côté-angle-côté, angle-côté-angle),
// calculer un angle inconnu dans un triangle, et reconnaître/utiliser les
// propriétés des translations (conservation des longueurs, angles, aires,
// parallélisme). Reprend la tâche intellectuelle des exercices fournis, avec
// des nombres, prénoms et contextes différents à chaque génération. Voir
// automatismes-quatrieme.js pour le thème "Calcul mental" associé.
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

// Figures utilisées uniquement par la carte mentale du Cours (meta.cours.mindMap ci-dessous).
function buildAngleTriangleFigure(angA, angB, angC, labels = {}) {
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
  const segments = [
    { from: "A", to: "B" },
    { from: "B", to: "C" },
    { from: "C", to: "A" },
  ];
  const freeLabels = [];
  const vertexByKey = { A, B, C };
  Object.entries(labels).forEach(([key, text]) => {
    if (!text) return;
    const pos = inset(vertexByKey[key]);
    freeLabels.push({ x: pos.x, y: pos.y, text });
  });
  return { points, segments, freeLabels };
}

function buildEgaliteTrianglesFigure() {
  return {
    points: [
      { id: "A", x: 20, y: 130, dx: -12 },
      { id: "B", x: 110, y: 130, dx: 8, dy: 18 },
      { id: "C", x: 55, y: 40, dy: -8 },
      { id: "D", x: 190, y: 130, dx: -12 },
      { id: "E", x: 280, y: 130, dx: 8, dy: 18 },
      { id: "F", x: 225, y: 40, dy: -8 },
    ],
    segments: [
      { from: "A", to: "B", ticks: 1 },
      { from: "B", to: "C", ticks: 2 },
      { from: "C", to: "A", ticks: 3 },
      { from: "D", to: "E", ticks: 1 },
      { from: "E", to: "F", ticks: 2 },
      { from: "F", to: "D", ticks: 3 },
    ],
  };
}

function buildTranslationFigure() {
  return {
    points: [
      { id: "A", x: 20, y: 150, dy: 16 },
      { id: "B", x: 80, y: 150, dy: 16 },
      { id: "C", x: 50, y: 100, dy: -8 },
      { id: "D", x: 140, y: 80, dy: 16 },
      { id: "E", x: 200, y: 80, dy: 16 },
      { id: "F", x: 170, y: 30, dy: -8 },
    ],
    segments: [
      { from: "A", to: "B" },
      { from: "B", to: "C" },
      { from: "C", to: "A" },
      { from: "D", to: "E", dashed: true },
      { from: "E", to: "F", dashed: true },
      { from: "F", to: "D", dashed: true },
    ],
    lines: [{ from: "A", to: "D", extend: 0, arrowEnd: true }],
  };
}

// =========================== Égalité de triangles ===========================

// ---------- 1. Calculer un angle inconnu dans un triangle ----------
function genAngleInconnuTriangleNumeric() {
  const a1 = randInt(20, 90);
  const a2 = randInt(20, 150 - a1);
  const a3 = 180 - a1 - a2;
  const noms = ["A", "B", "C"];
  return {
    type: "numeric",
    chapter: "Géométrie plane — Égalité de triangles",
    prompt: `Dans un triangle ${noms.join("")}, on a \\(\\widehat{${noms[0]}} = ${a1}°\\) et \\(\\widehat{${noms[1]}} = ${a2}°\\). Calcule la mesure de l'angle \\(\\widehat{${noms[2]}}\\), en degrés.`,
    answer: a3,
    steps: [
      { type: "regle", text: `\\text{La somme des angles d'un triangle vaut } 180°.` },
      { type: "resultat", text: `\\widehat{${noms[2]}} = 180 - ${a1} - ${a2} = ${a3}°` },
    ],
  };
}

// ---------- 2. Angle inconnu dans un triangle isocèle ----------
function genAngleInconnuTriangleIsoceleNumeric() {
  const donneApex = Math.random() < 0.5;
  if (donneApex) {
    const apex = randInt(20, 140);
    const base = roundTo((180 - apex) / 2, 1);
    return {
      type: "numeric",
      chapter: "Géométrie plane — Égalité de triangles",
      prompt: `MNP est un triangle isocèle en M, avec \\(\\widehat{M} = ${apex}°\\). Calcule la mesure de l'angle \\(\\widehat{N}\\), en degrés (arrondie au dixième si nécessaire).`,
      answer: base,
      tolerance: 0.1,
      steps: [
        { type: "regle", text: `\\text{Le triangle étant isocèle en M, on a } \\widehat{N} = \\widehat{P}.` },
        { type: "resultat", text: `\\widehat{N} = \\dfrac{180 - ${apex}}{2} = ${fr(base)}°` },
      ],
    };
  }
  const base = randInt(20, 80);
  const apex = 180 - 2 * base;
  return {
    type: "numeric",
    chapter: "Géométrie plane — Égalité de triangles",
    prompt: `MNP est un triangle isocèle en M, avec \\(\\widehat{N} = ${base}°\\). Calcule la mesure de l'angle \\(\\widehat{M}\\), en degrés.`,
    answer: apex,
    steps: [
      { type: "regle", text: `\\text{Le triangle étant isocèle en M, on a } \\widehat{N} = \\widehat{P} = ${base}°.` },
      { type: "resultat", text: `\\widehat{M} = 180 - 2 \\times ${base} = ${apex}°` },
    ],
  };
}

// ---------- 3. Quel critère d'égalité des triangles utiliser ? ----------
function genCritereEgaliteTrianglesQCM() {
  const cas = pick([
    { desc: "les trois côtés du triangle ABC sont respectivement de même longueur que les trois côtés du triangle DEF", reponse: "Les côtés sont deux à deux de même longueur" },
    { desc: "un angle du triangle ABC, situé entre deux côtés, a la même mesure qu'un angle du triangle DEF situé entre deux côtés respectivement de même longueur", reponse: "Un angle de même mesure est situé entre deux côtés deux à deux de même longueur" },
    { desc: "un côté du triangle ABC, situé entre deux angles, a la même longueur qu'un côté du triangle DEF situé entre deux angles respectivement de même mesure", reponse: "Un côté de même longueur est situé entre deux angles deux à deux de même mesure" },
  ]);
  const options = shuffle([
    "Les côtés sont deux à deux de même longueur",
    "Un angle de même mesure est situé entre deux côtés deux à deux de même longueur",
    "Un côté de même longueur est situé entre deux angles deux à deux de même mesure",
  ]);
  return {
    type: "qcm",
    chapter: "Géométrie plane — Égalité de triangles",
    prompt: `On sait que ${cas.desc}. Quelle propriété permet de conclure que les triangles ABC et DEF sont égaux ?`,
    answer: cas.reponse,
    options,
    steps: [{ type: "regle", text: `Deux triangles sont égaux si leurs côtés sont deux à deux de même longueur, ou si un angle (ou un côté) est situé entre deux éléments respectivement égaux.` }],
  };
}

// ---------- 4. Un triangle égal a-t-il nécessairement... ? ----------
function genTriangleEgalNecessaireQCM() {
  const AB = randInt(3, 12);
  const BC = randInt(3, 12);
  const angle = randInt(20, 80);
  const correct = `un côté égal à ${BC} cm`;
  const wrong1 = `un côté égal à ${BC + nonZero(1, 4)} cm`;
  const wrong2 = `un angle égal à ${angle + nonZero(5, 20)}°`;
  const finalOptions = shuffle([...new Set([correct, wrong1, wrong2])]);
  return {
    type: "qcm",
    chapter: "Géométrie plane — Égalité de triangles",
    prompt: `Un triangle égal au triangle ABC tel que AB = ${AB} cm, BC = ${BC} cm et \\(\\widehat{ABC} = ${angle}°\\) a nécessairement...`,
    answer: correct,
    options: finalOptions.length >= 2 ? finalOptions : [correct, wrong1],
    steps: [{ type: "regle", text: `Deux triangles égaux ont exactement les mêmes longueurs de côtés et les mêmes mesures d'angles (dans le même ordre).` }],
  };
}

// =========================== Translations ===========================

// ---------- 5. Translation : conservation des longueurs ----------
function genTranslationConserveLongueurNumeric() {
  const longueur = roundTo(2 + Math.random() * 10, 1);
  const noms = shuffle(["A", "B", "C", "D", "E", "F"]);
  const [P, Q, R, S] = noms;
  return {
    type: "numeric",
    chapter: "Géométrie plane — Translations",
    prompt: `Le polygone ${R}${S}... est l'image du polygone ${P}${Q}... par une translation, avec [${R}${S}] l'image de [${P}${Q}]. Sachant que ${P}${Q} = ${fr(longueur)} cm, quelle est la longueur du segment [${R}${S}], en cm ?`,
    answer: longueur,
    steps: [
      { type: "regle", text: `\\text{Une translation conserve les longueurs.}` },
      { type: "resultat", text: `${R}${S} = ${P}${Q} = ${fr(longueur)}\\ \\text{cm}` },
    ],
  };
}

// ---------- 6. Translation : conservation des angles ----------
function genTranslationConserveAngleNumeric() {
  const angle = randInt(15, 165);
  const noms = shuffle(["A", "B", "C", "D", "E", "F"]);
  const [P, Q, R] = noms;
  const [X, Y, Z] = noms.slice(3);
  return {
    type: "numeric",
    chapter: "Géométrie plane — Translations",
    prompt: `Le triangle ${X}${Y}${Z} est l'image du triangle ${P}${Q}${R} par une translation, avec l'angle \\(\\widehat{${X}${Y}${Z}}\\) image de l'angle \\(\\widehat{${P}${Q}${R}}\\). Sachant que \\(\\widehat{${P}${Q}${R}} = ${angle}°\\), quelle est la mesure de l'angle \\(\\widehat{${X}${Y}${Z}}\\), en degrés ?`,
    answer: angle,
    steps: [
      { type: "regle", text: `\\text{Une translation conserve les mesures d'angles.}` },
      { type: "resultat", text: `\\widehat{${X}${Y}${Z}} = \\widehat{${P}${Q}${R}} = ${angle}°` },
    ],
  };
}

// ---------- 7. Translation : conservation de l'aire ----------
function genTranslationConserveAireNumeric() {
  const base = randInt(3, 12);
  const hauteur = randInt(2, 10);
  const aire = roundTo((base * hauteur) / 2, 2);
  return {
    type: "numeric",
    chapter: "Géométrie plane — Translations",
    prompt: `Le triangle DEF est l'image du triangle ABC (rectangle en B, de base BC = ${base} m et de hauteur AB = ${hauteur} m) par une translation. Calcule l'aire du triangle DEF, en m².`,
    answer: aire,
    tolerance: 0.01,
    steps: [
      { type: "calcul", text: `\\text{Aire}(ABC) = \\dfrac{${base} \\times ${hauteur}}{2} = ${fr(aire)}\\ m^2` },
      { type: "resultat", text: `\\text{Une translation conserve les aires, donc Aire}(DEF) = ${fr(aire)}\\ m^2` },
    ],
  };
}

// ---------- 8. La transformation est-elle une translation ? (QCM) ----------
function genTransformationTypeQCM() {
  const cas = pick([
    { desc: "la figure 2 est identique à la figure 1, simplement glissée sans être retournée ni déformée", reponse: "Translation" },
    { desc: "la figure 2 est le symétrique (miroir) de la figure 1 : elle est retournée", reponse: "Retournement" },
    { desc: "la figure 2 a des proportions différentes de la figure 1 : elle est agrandie dans un sens mais pas dans l'autre", reponse: "Déformation" },
  ]);
  return {
    type: "qcm",
    chapter: "Géométrie plane — Translations",
    prompt: `On observe que ${cas.desc}. De quelle transformation s'agit-il ?`,
    answer: cas.reponse,
    options: ["Translation", "Retournement", "Déformation"],
    steps: [{ type: "regle", text: `Une translation fait glisser une figure sans la retourner ni la déformer : les longueurs, les angles et le parallélisme sont conservés.` }],
  };
}

// ---------- 9. Nature du quadrilatère obtenu par translation ----------
function genQuadrilatereTranslationQCM() {
  const avecAngleDroit = Math.random() < 0.5;
  const cotesEgaux = Math.random() < 0.5;
  let reponse = "Parallélogramme";
  if (avecAngleDroit && cotesEgaux) reponse = "Carré";
  else if (avecAngleDroit) reponse = "Rectangle";
  else if (cotesEgaux) reponse = "Losange";
  const desc = [];
  desc.push("ABCD est un quadrilatère tel que D est l'image de C par la translation qui transforme B en A");
  if (avecAngleDroit) desc.push("le quadrilatère possède un angle droit en A");
  if (cotesEgaux) desc.push("de plus AB = BC");
  return {
    type: "qcm",
    chapter: "Géométrie plane — Translations",
    prompt: `${desc.join(", et ")}. Quelle est la nature du quadrilatère ABCD ?`,
    answer: reponse,
    options: ["Parallélogramme", "Rectangle", "Losange", "Carré"],
    steps: [
      { type: "regle", text: `\\text{Une translation donne (CD)} // \\text{(BA) et CD = BA : ABCD est un parallélogramme.}` },
      avecAngleDroit ? { type: "regle", text: "Un parallélogramme avec un angle droit est un rectangle." } : null,
      cotesEgaux ? { type: "regle", text: "Un parallélogramme avec deux côtés consécutifs égaux est un losange." } : null,
      avecAngleDroit && cotesEgaux ? { type: "resultat", text: "Un rectangle qui est aussi un losange est un carré." } : null,
    ].filter(Boolean),
  };
}

// ---------- 10. Problème contextualisé : frise obtenue par translations répétées ----------
function genProblemeFriseTranslationNumeric() {
  const prenom = pick(PRENOMS);
  const distance = randInt(3, 15);
  const repetitions = randInt(3, 8);
  const distanceTotale = distance * repetitions;
  return {
    type: "numeric",
    chapter: "Géométrie plane — Translations",
    prompt: `${prenom} réalise une frise en appliquant ${repetitions} fois de suite à un motif la translation qui transforme le point E en F, avec EF = ${distance} cm. Quelle est la distance totale, en cm, parcourue par un point du motif initial jusqu'à sa dernière image ?`,
    answer: distanceTotale,
    steps: [
      { type: "regle", text: `\\text{Chaque translation déplace le motif de } ${distance}\\ \\text{cm}.` },
      { type: "resultat", text: `${repetitions} \\times ${distance} = ${distanceTotale}\\ \\text{cm}` },
    ],
  };
}

// ---------- 11. Image d'un hexagone régulier par translation (périmètre) ----------
function genImageHexagoneReguliereNumeric() {
  const cote = randInt(2, 12);
  const perimetre = 6 * cote;
  return {
    type: "numeric",
    chapter: "Géométrie plane — Translations",
    prompt: `Un hexagone régulier a un côté de ${cote} cm. Quel est le périmètre de son image par une translation, en cm ?`,
    answer: perimetre,
    steps: [
      { type: "regle", text: `\\text{Une translation conserve les longueurs, donc l'image est aussi un hexagone régulier de côté } ${cote}\\ \\text{cm}.` },
      { type: "resultat", text: `\\text{Périmètre} = 6 \\times ${cote} = ${perimetre}\\ \\text{cm}` },
    ],
  };
}

// ---------- 12. Pavage : aire totale d'un ensemble d'hexagones translatés ----------
function genPavageAireTotaleNumeric() {
  const aireUnite = roundTo(1 + Math.random() * 4, 2);
  const nombre = randInt(6, 20);
  const aireTotale = roundTo(aireUnite * nombre, 2);
  return {
    type: "numeric",
    chapter: "Géométrie plane — Translations",
    prompt: `Un pavage est constitué de ${nombre} hexagones, tous images les uns des autres par des translations, chacun d'aire ${fr(aireUnite)} cm². Quelle est l'aire totale du pavage, en cm² ?`,
    answer: aireTotale,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Une translation conserve les aires : chaque hexagone a la même aire.}` },
      { type: "resultat", text: `${nombre} \\times ${fr(aireUnite)} = ${fr(aireTotale)}\\ cm^2` },
    ],
  };
}

const GENERATORS = [
  genAngleInconnuTriangleNumeric,
  genAngleInconnuTriangleIsoceleNumeric,
  genCritereEgaliteTrianglesQCM,
  genTriangleEgalNecessaireQCM,
  genTranslationConserveLongueurNumeric,
  genTranslationConserveAngleNumeric,
  genTranslationConserveAireNumeric,
  genTransformationTypeQCM,
  genQuadrilatereTranslationQCM,
  genProblemeFriseTranslationNumeric,
  genImageHexagoneReguliereNumeric,
  genPavageAireTotaleNumeric,
];

const DIFFICULTY = {
  genAngleInconnuTriangleNumeric: "facile",
  genTranslationConserveLongueurNumeric: "facile",
  genTranslationConserveAngleNumeric: "facile",
  genTranslationConserveAireNumeric: "facile",
  genTransformationTypeQCM: "facile",
  genAngleInconnuTriangleIsoceleNumeric: "standard",
  genCritereEgaliteTrianglesQCM: "standard",
  genTriangleEgalNecessaireQCM: "standard",
  genQuadrilatereTranslationQCM: "standard",
  genImageHexagoneReguliereNumeric: "standard",
  genProblemeFriseTranslationNumeric: "expert",
  genPavageAireTotaleNumeric: "expert",
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
    id: "geometrie-plane",
    title: "Géométrie plane",
    description: "Égalité de triangles et propriétés des translations (longueurs, angles, aires, parallélisme).",
    pourquoi: "Comprendre les translations et l'égalité de figures, c'est la base du raisonnement géométrique utilisé en dessin technique et en architecture.",
    level: "quatrieme",
    free: false,
    order: 14,
    cours: {
      mindMap: {
        title: "Géométrie plane",
        branches: [
          {
            title: "Angles dans un triangle",
            items: [
              "La somme des trois angles d'un triangle vaut toujours 180°.",
              "Dans un triangle isocèle, les deux angles à la base (opposés aux côtés égaux) sont égaux.",
            ],
            formula: "\\(\\widehat{A} + \\widehat{B} + \\widehat{C} = 180°\\)",
            figure: buildAngleTriangleFigure(70, 60, 50, { A: "70°", B: "60°", C: "50°" }),
          },
          {
            title: "Égalité de deux triangles",
            items: [
              "Deux triangles sont égaux si leurs côtés sont deux à deux de même longueur (côté-côté-côté).",
              "Ils sont aussi égaux si un angle égal est situé entre deux côtés égaux, ou un côté égal entre deux angles égaux.",
              "Piège classique : bien faire correspondre les sommets dans le même ordre pour comparer les bons côtés et angles.",
            ],
            figure: buildEgaliteTrianglesFigure(),
          },
          {
            title: "Translations : propriétés conservées",
            items: [
              "Une translation fait glisser une figure sans la retourner ni la déformer.",
              "Elle conserve les longueurs, les angles, les aires et le parallélisme.",
              "L'image d'un parallélogramme par translation reste un parallélogramme (et garde ses propriétés particulières).",
            ],
            figure: buildTranslationFigure(),
          },
        ],
      },
    },
  },
  generate,
};
