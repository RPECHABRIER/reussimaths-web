// ---------------------------------------------------------------------------
// Chapitre : Séries statistiques à deux variables quantitatives (Première
// technologique)
// Programme 2026 : nuage de points, point moyen, ajustement AFFINE (pas
// encore le changement de variable non-affine, réservé à la Terminale).
// Capacités : représenter un nuage, calculer le point moyen, déterminer et
// utiliser un ajustement affine, interpoler/extrapoler.
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

// ---------- 1. Calculer les coordonnées du point moyen ----------
function genPointMoyenNumeric() {
  const xs = Array.from({ length: 5 }, () => randInt(1, 20));
  const ys = Array.from({ length: 5 }, () => randInt(1, 40));
  const xMoy = roundTo(xs.reduce((a, b) => a + b, 0) / xs.length, 2);
  return {
    type: "numeric",
    chapter: "Statistiques à deux variables (Première techno) — Point moyen",
    prompt: `Une série statistique à deux variables a pour valeurs de \\(x\\) : ${xs.join(", ")}. Calcule la moyenne \\(\\bar{x}\\) (abscisse du point moyen), arrondie au centième.`,
    answer: xMoy,
    tolerance: 0.02,
    steps: [
      { type: "calcul", text: `\\bar{x} = \\dfrac{${xs.join(" + ")}}{${xs.length}}` },
      { type: "resultat", text: `\\bar{x} = ${fr(xMoy)}` },
    ],
  };
}

// ---------- 2. Lire des coordonnées sur un nuage de points ----------
function genLectureNuagePointsNumeric() {
  const n = 6;
  const points = [];
  const a = pick([1.5, 2, 2.5, 3]);
  const b = randInt(-5, 10);
  for (let i = 0; i < n; i++) {
    const x = randInt(1, 15);
    const y = roundTo(a * x + b + randInt(-3, 3), 1);
    points.push({ x, y });
  }
  const chosen = pick(points);
  return {
    type: "numeric",
    chapter: "Statistiques à deux variables (Première techno) — Nuage de points",
    prompt: `On donne ci-dessous un nuage de points représentant une série statistique à deux variables. Donne l'ordonnée du point d'abscisse ${chosen.x} (lecture graphique).`,
    answer: chosen.y,
    tolerance: 0.15,
    steps: [{ type: "resultat", text: `\\text{Lecture graphique : le point d'abscisse ${chosen.x} a pour ordonnée ${fr(chosen.y)}.}` }],
    graph: { xMin: 0, xMax: 16, yMin: Math.min(0, ...points.map((p) => p.y)) - 2, yMax: Math.max(...points.map((p) => p.y)) + 2, points: points.map((p) => (p === chosen ? { ...p, label: "?" } : p)) },
  };
}

// ---------- 3. Utiliser un ajustement affine pour interpoler ----------
function genAjustementAffineInterpolerNumeric() {
  const a = pick([2, 3, 4, 1.5, -1, -2]);
  const b = randInt(-10, 20);
  const x = randInt(5, 30);
  const answer = roundTo(a * x + b, 2);
  return {
    type: "numeric",
    chapter: "Statistiques à deux variables (Première techno) — Ajustement affine",
    prompt: `Un ajustement affine d'un nuage de points est donné par \\(y = ${fr(a)}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Utilise cet ajustement pour estimer la valeur de \\(y\\) lorsque \\(x = ${x}\\).`,
    answer,
    tolerance: 0.05,
    steps: [
      { type: "regle", text: "Interpoler consiste à remplacer x par la valeur donnée dans l'équation de l'ajustement affine." },
      { type: "calcul", text: `y = ${fr(a)} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}` },
      { type: "resultat", text: `y = ${fr(answer)}` },
    ],
  };
}

// ---------- 4. Extrapoler (au-delà des valeurs observées) ----------
function genAjustementAffineExtrapolerNumeric() {
  const a = pick([50, 100, 150, 200, -50, -80]);
  const b = randInt(500, 3000);
  const annee = randInt(2028, 2035);
  const anneeRef = 2026;
  const x = annee - anneeRef;
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Statistiques à deux variables (Première techno) — Ajustement affine",
    prompt: `On modélise l'évolution d'une grandeur par l'ajustement affine \\(y = ${a}x + ${b}\\), où \\(x\\) est le nombre d'années après 2026. En extrapolant ce modèle, estime la valeur de \\(y\\) en ${annee}.`,
    answer,
    steps: [
      { type: "regle", text: "Extrapoler consiste à utiliser le modèle en dehors des valeurs observées : le résultat est une estimation, pas une certitude." },
      { type: "calcul", text: `x = ${annee} - ${anneeRef} = ${x}` },
      { type: "resultat", text: `y = ${a} \\times ${x} + ${b} = ${answer}` },
    ],
  };
}

// ---------- 5. Déterminer l'équation d'un ajustement affine passant par deux points ----------
function genDeterminerAjustementNumeric() {
  const x1 = randInt(1, 10);
  const x2 = x1 + nonZero(2, 10);
  const a = pick([1, 2, 3, -1, -2, 0.5]);
  const y1 = randInt(-10, 10);
  const y2 = y1 + a * (x2 - x1);
  return {
    type: "numeric",
    chapter: "Statistiques à deux variables (Première techno) — Ajustement affine",
    prompt: `Un ajustement affine passe par les points \\((${x1} ; ${y1})\\) et \\((${x2} ; ${y2})\\). Détermine le coefficient directeur \\(a\\) de cet ajustement.`,
    answer: a,
    steps: [
      { type: "calcul", text: `a = \\dfrac{${y2} - ${y1}}{${x2} - ${x1}} = \\dfrac{${y2 - y1}}{${x2 - x1}}` },
      { type: "resultat", text: `a = ${a}` },
    ],
    graph: {
      xMin: Math.min(x1, x2) - 2,
      xMax: Math.max(x1, x2) + 2,
      yMin: Math.min(y1, y2) - 2,
      yMax: Math.max(y1, y2) + 2,
      lines: [{ a, b: y1 - a * x1, label: "ajustement" }],
      points: [{ x: x1, y: y1, label: "A" }, { x: x2, y: y2, label: "B" }],
    },
  };
}

// ---------- 6. Reconnaître un nuage bien ajusté par une droite ----------
function genReconnaitreAjustementPertinentQCM() {
  const cas = pick([
    { description: "Les points du nuage semblent alignés autour d'une droite.", reponse: "Un ajustement affine est pertinent", explication: "Un ajustement affine est pertinent : quand les points suivent une tendance linéaire, une droite les représente bien." },
    { description: "Les points du nuage forment une courbe qui s'incurve nettement (ni une droite, ni un alignement).", reponse: "Un ajustement affine n'est pas pertinent", explication: "Un ajustement affine n'est pas pertinent : une droite ne peut pas bien représenter une tendance qui s'incurve nettement." },
  ]);
  return {
    type: "qcm",
    chapter: "Statistiques à deux variables (Première techno) — Ajustement affine",
    prompt: `« ${cas.description} » Que peut-on dire de la pertinence d'un ajustement affine ?`,
    answer: cas.reponse,
    options: ["Un ajustement affine est pertinent", "Un ajustement affine n'est pas pertinent"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 7. Le point moyen appartient à la droite d'ajustement ----------
function genPointMoyenSurDroiteNumeric() {
  const a = pick([1, 2, 3, -1, -2]);
  const xMoy = randInt(-5, 10);
  const yMoy = randInt(-8, 15);
  const b = roundTo(yMoy - a * xMoy, 2);
  return {
    type: "numeric",
    chapter: "Statistiques à deux variables (Première techno) — Point moyen",
    prompt: `Le point moyen d'un nuage est \\(G(${xMoy} ; ${yMoy})\\). La droite d'ajustement affine, qui passe par \\(G\\), a pour coefficient directeur \\(a = ${a}\\). Détermine son ordonnée à l'origine \\(b\\).`,
    answer: b,
    steps: [
      { type: "regle", text: `\\text{Le point moyen appartient toujours à la droite d'ajustement : } y = ax + b \\text{ avec } G \\text{ sur la droite : } ${yMoy} = ${a} \\times ${xMoy} + b` },
      { type: "resultat", text: `b = ${yMoy} - ${a * xMoy} = ${fr(b)}` },
    ],
  };
}

const GENERATORS = [
  genPointMoyenNumeric,
  genLectureNuagePointsNumeric,
  genAjustementAffineInterpolerNumeric,
  genAjustementAffineExtrapolerNumeric,
  genDeterminerAjustementNumeric,
  genReconnaitreAjustementPertinentQCM,
  genPointMoyenSurDroiteNumeric,
];

const DIFFICULTY = {
  genPointMoyenNumeric: "facile",
  genAjustementAffineInterpolerNumeric: "facile",
  genReconnaitreAjustementPertinentQCM: "facile",
  genLectureNuagePointsNumeric: "standard",
  genAjustementAffineExtrapolerNumeric: "standard",
  genPointMoyenSurDroiteNumeric: "standard",
  genDeterminerAjustementNumeric: "expert",
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
    id: "statistiques-deux-variables-premiere-techno",
    title: "Statistiques à deux variables",
    description: "Nuage de points, point moyen, ajustement affine, interpolation et extrapolation.",
    pourquoi: "Ajuster un nuage de points par une droite, c'est ce qui permet de faire des prévisions à partir de données observées : ventes, météo, croissance.",
    level: "premiere-techno",
    order: 5,
  },
  generate,
};
