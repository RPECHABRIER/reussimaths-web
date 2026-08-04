// ---------------------------------------------------------------------------
// Chapitre : Réviser les bases (Terminale technologique / STMG) — gratuit,
// illimité.
//
// Un tour d'horizon des savoir-faire de Première technologique
// indispensables pour aborder le programme de Terminale STMG : suites
// arithmétiques/géométriques, pourcentages et évolutions (coefficient
// multiplicateur), puissances, fonctions affines et second degré, lecture
// graphique. Fichier indépendant (par convention, chaque chapitre a ses
// propres helpers, pas de mutualisation entre fichiers).
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

// ---------- 1. Coefficient multiplicateur d'une évolution ----------
function genCoefficientMultiplicateurNumeric() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 90);
  const answer = direction === "augmente" ? roundTo(1 + p / 100, 3) : roundTo(1 - p / 100, 3);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale techno) — Évolutions",
    prompt: `Une grandeur ${direction} de ${p} %. Quel est le coefficient multiplicateur associé ?`,
    answer,
    tolerance: 0.001,
    steps: [`${fr(answer)}`],
  };
}

// ---------- 2. Terme d'une suite arithmétique ----------
function genTermeArithmetiqueNumeric() {
  const u0 = randInt(-20, 20);
  const r = nonZero(-8, 8);
  const n = randInt(2, 15);
  const answer = u0 + n * r;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale techno) — Suites",
    prompt: `\\((u_n)\\) est une suite arithmétique de premier terme \\(u_0 = ${u0}\\) et de raison \\(r = ${r}\\). Calcule \\(u_{${n}}\\).`,
    answer,
    steps: [`u_{${n}} = ${u0} + ${n} \\times (${r}) = ${answer}`],
  };
}

// ---------- 3. Terme d'une suite géométrique ----------
function genTermeGeometriqueNumeric() {
  const u0 = pick([1, 2, 3, 4, 5]);
  const q = pick([2, 3, 1.5]);
  const n = randInt(2, 5);
  const answer = roundTo(u0 * q ** n, 3);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale techno) — Suites",
    prompt: `\\((u_n)\\) est une suite géométrique à termes positifs, de premier terme \\(u_0 = ${u0}\\) et de raison \\(q = ${fr(q)}\\). Calcule \\(u_{${n}}\\).`,
    answer,
    tolerance: 0.005,
    steps: [`u_{${n}} = ${u0} \\times ${fr(q)}^{${n}} = ${fr(answer)}`],
  };
}

// ---------- 4. Puissances ----------
function genPuissanceNumeric() {
  const base = pick([1.1, 1.05, 0.9, 1.2, 0.95]);
  const exp = randInt(2, 5);
  const answer = roundTo(base ** exp, 4);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale techno) — Puissances",
    prompt: `Calcule \\(${fr(base)}^{${exp}}\\) (arrondi à 0,0001 près).`,
    answer,
    tolerance: 0.0005,
    steps: [`${fr(base)}^{${exp}} \\approx ${fr(answer)}`],
  };
}

// ---------- 5. Image par une fonction affine ----------
function genImageFonctionAffineNumeric() {
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const x = randInt(-8, 8);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale techno) — Fonctions",
    prompt: `On considère la fonction affine f définie par \\(f(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(f(${x})\\).`,
    answer,
    steps: [`f(${x}) = ${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}`],
  };
}

// ---------- 6. Racines et signe d'un second degré factorisé ----------
function genSigneSecondDegreQCM() {
  const a = pick([1, -1, 2, -2]);
  let r1 = randInt(-6, 6);
  let r2 = randInt(-6, 6);
  while (r2 === r1) r2 = randInt(-6, 6);
  const lo = Math.min(r1, r2);
  const hi = Math.max(r1, r2);
  const positifEntre = a < 0;
  const correctRaw = positifEntre ? `]${lo} ; ${hi}[` : `]-\\infty ; ${lo}[ \\cup ]${hi} ; +\\infty[`;
  const wrongRaw = positifEntre ? `]-\\infty ; ${lo}[ \\cup ]${hi} ; +\\infty[` : `]${lo} ; ${hi}[`;
  return {
    type: "qcm",
    chapter: "Réviser les bases (Terminale techno) — Fonctions",
    prompt: `On donne \\(f(x) = ${a === 1 ? "" : a}(x - ${lo})(x - ${hi})\\). Sur quel ensemble \\(f(x) > 0\\) ?`,
    answer: correctRaw,
    options: shuffle([correctRaw, wrongRaw]),
    steps: [`\\text{Un polynôme du second degré est du signe de son coefficient dominant à l'extérieur des racines, et de signe opposé entre elles.}`],
  };
}

// ---------- 7. Lecture d'un tableau croisé (proportion) ----------
function genLectureTableauCroiseNumeric() {
  const total = pick([200, 250, 300, 400]);
  const partA = randInt(60, 150);
  const answer = roundTo(partA / total, 4);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale techno) — Lecture de données",
    prompt: `Un tableau croisé de ${total} personnes donne ${partA} personnes dans une catégorie. Calcule la proportion (fréquence) que cela représente.`,
    answer,
    tolerance: 0.0005,
    steps: [`\\dfrac{${partA}}{${total}} = ${fr(answer)}`],
  };
}

// ---------- 8. Espérance d'une variable aléatoire simple ----------
function genEsperanceSimpleNumeric() {
  const valeurs = [randInt(-5, 0), randInt(1, 5)];
  const p1 = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);
  const p2 = roundTo(1 - p1, 4);
  const answer = roundTo(valeurs[0] * p1 + valeurs[1] * p2, 4);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale techno) — Probabilités",
    prompt: `Une variable aléatoire X suit : \\(P(X=${valeurs[0]}) = ${fr(p1)}\\), \\(P(X=${valeurs[1]}) = ${fr(p2)}\\). Calcule \\(E(X)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [`E(X) = ${valeurs[0]} \\times ${fr(p1)} + ${valeurs[1]} \\times ${fr(p2)} = ${fr(answer)}`],
  };
}

const GENERATORS = [
  genCoefficientMultiplicateurNumeric,
  genTermeArithmetiqueNumeric,
  genTermeGeometriqueNumeric,
  genPuissanceNumeric,
  genImageFonctionAffineNumeric,
  genSigneSecondDegreQCM,
  genLectureTableauCroiseNumeric,
  genEsperanceSimpleNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "reviser-les-bases-terminale-techno",
    title: "Réviser les bases",
    description: "Un tour d'horizon des savoir-faire de Première technologique indispensables pour aborder le programme de Terminale STMG.",
    pourquoi: "Ce chapitre gratuit consolide les bases indispensables du niveau précédent, pour démarrer l'année sur des fondations solides plutôt que de découvrir des lacunes en cours de route.",
    level: "terminale-techno",
    free: true,
    order: 0,
  },
  generate,
};
