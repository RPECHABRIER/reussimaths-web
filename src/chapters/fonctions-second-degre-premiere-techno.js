// ---------------------------------------------------------------------------
// Chapitre : Fonctions polynômes de degré 2 (Première technologique)
// Programme 2026 : modes de représentation d'une fonction, notations
// y=f(x) / x↦f(x), taux de variation, fonctions monotones ; fonctions
// polynômes de degré 2 — allure de la parabole, axe de symétrie, sommet,
// racines et signe SOUS FORME FACTORISÉE (PAS de discriminant au programme
// technologique). Capacités : associer une parabole à x↦ax², x↦ax²+c,
// x↦a(x-x1)(x-x2) ; résoudre graphiquement f(x)=k ou f(x)<k ; déterminer les
// éléments caractéristiques sans formule (lecture graphique) ; factoriser
// connaissant une racine.
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
const signedL = (n, withVar = "") => (n >= 0 ? `+ ${n}${withVar}` : `- ${Math.abs(n)}${withVar}`);

// ---------- 1. Image d'une fonction du second degré (forme factorisée) ----------
function genImageFormeFactoriseeNumeric() {
  const a = pick([1, -1, 2, -2, 3, -3]);
  const r1 = randInt(-6, 6);
  const r2 = randInt(-6, 6);
  const x = randInt(-8, 8);
  const answer = a * (x - r1) * (x - r2);
  return {
    type: "numeric",
    chapter: "Fonctions second degré (Première techno) — Image",
    prompt: `On considère \\(f(x) = ${a === 1 ? "" : a}(x ${signedL(-r1)})(x ${signedL(-r2)})\\). Calcule \\(f(${x})\\).`,
    answer,
    steps: [`f(${x}) = ${a} \\times (${x} ${signedL(-r1)}) \\times (${x} ${signedL(-r2)}) = ${a} \\times ${x - r1} \\times ${x - r2} = ${answer}`],
  };
}

// ---------- 2. Racines depuis la forme factorisée ----------
function genRacinesFormeFactoriseeQCM() {
  const a = pick([1, -1, 2, -2, 3]);
  let r1 = randInt(-7, 7);
  let r2 = randInt(-7, 7);
  while (r2 === r1) r2 = randInt(-7, 7);
  const correctRaw = `${r1} \\text{ et } ${r2}`;
  const options = shuffle([correctRaw, `${-r1} \\text{ et } ${-r2}`, `${r1} \\text{ et } ${-r2}`]);
  return {
    type: "qcm",
    chapter: "Fonctions second degré (Première techno) — Racines",
    prompt: `On considère \\(f(x) = ${a === 1 ? "" : a}(x ${signedL(-r1)})(x ${signedL(-r2)})\\). Quelles sont les racines de \\(f\\) ?`,
    answer: correctRaw,
    options,
    steps: [`\\text{Une racine annule un facteur : } x ${signedL(-r1)} = 0 \\Rightarrow x = ${r1}\\text{, et } x ${signedL(-r2)} = 0 \\Rightarrow x = ${r2}.`],
  };
}

// ---------- 3. Factoriser en connaissant une racine et le produit/somme ----------
function genFactoriserConnaissantRacineNumeric() {
  const a = pick([1, -1, 2, -2]);
  const r1 = randInt(-8, 8);
  let r2 = randInt(-8, 8);
  while (r2 === r1) r2 = randInt(-8, 8);
  return {
    type: "numeric",
    chapter: "Fonctions second degré (Première techno) — Factorisation",
    prompt: `On sait que \\(f(x) = ${a === 1 ? "" : a}(x ${signedL(-r1)})(x - k)\\) et que \\(${r1}\\) et \\(${r2}\\) sont les deux racines de \\(f\\). Détermine la valeur de \\(k\\).`,
    answer: r2,
    steps: [`\\text{L'autre racine est } k = ${r2}.`],
  };
}

// ---------- 4. Allure de la parabole (sens de la concavité) ----------
function genAllureParaboleQCM() {
  const a = nonZero(-5, 5);
  const answer = a > 0 ? "vers le haut (∪), sommet en son point le plus bas" : "vers le bas (∩), sommet en son point le plus haut";
  return {
    type: "qcm",
    chapter: "Fonctions second degré (Première techno) — Allure",
    prompt: `On considère une fonction polynôme du second degré de coefficient dominant \\(a = ${a}\\). Quelle est l'allure de sa parabole ?`,
    answer,
    options: ["vers le haut (∪), sommet en son point le plus bas", "vers le bas (∩), sommet en son point le plus haut"],
    steps: [a > 0 ? `\\text{Comme } a > 0, \\text{ la parabole est tournée vers le haut.}` : `\\text{Comme } a < 0, \\text{ la parabole est tournée vers le bas.}`],
  };
}

// ---------- 5. Associer une parabole à x↦ax² ----------
function genAssocierAxCarreQCM() {
  const a = pick([1, 2, 3, 0.5, -1, -2, -0.5]);
  const xTest = pick([-2, 2]);
  const yTest = a * xTest * xTest;
  const options = shuffle([fr(a), fr(-a), fr(roundTo(a * 2, 2))]);
  return {
    type: "qcm",
    chapter: "Fonctions second degré (Première techno) — Fonctions de référence",
    prompt: `La parabole représentant \\(x \\mapsto ax^2\\) passe par le point \\((${xTest} ; ${fr(yTest)})\\). Quelle est la valeur de \\(a\\) ?`,
    answer: fr(a),
    options,
    steps: [`a = \\dfrac{${fr(yTest)}}{${xTest}^2} = \\dfrac{${fr(yTest)}}{${xTest * xTest}} = ${fr(a)}`],
    graph: { xMin: -6, xMax: 6, yMin: Math.min(-4, ...[-6, -3, 0, 3, 6].map((x) => a * x * x)) - 1, yMax: Math.max(4, ...[-6, -3, 0, 3, 6].map((x) => a * x * x)) + 1, curves: [{ fn: (x) => a * x * x, label: "f" }], points: [{ x: xTest, y: yTest, label: `(${xTest} ; ${fr(yTest)})` }] },
  };
}

// ---------- 6. Résoudre graphiquement f(x) = k ----------
function genResoudreGraphiquementEgaliteQCM() {
  const a = pick([1, -1, 2, -2]);
  const r1 = randInt(-4, 4);
  const r2 = r1 + nonZero(2, 5);
  const k = randInt(-3, 3);
  // f(x) = a(x-r1)(x-r2), solve f(x) = a*k_offset ... simpler: build f with known roots, solve f(x)=0 first as baseline; pick a horizontal level h and find that at x=r1 f=0, but to make f(x)=k solvable nicely we instead ask to solve f(x) = f(sommet's y at some nice level)
  const fn = (x) => a * (x - r1) * (x - r2);
  const level = k;
  // We won't guarantee "nice" solutions for arbitrary k, so instead ask to read where the curve crosses y = level using the two known symmetric points around vertex when level = 0 (the roots) most of the time
  const useRoots = Math.random() < 0.6;
  const yLevel = useRoots ? 0 : fn((r1 + r2) / 2 + pick([-1, 1]));
  const xVals = [];
  // Solve a(x-r1)(x-r2) = yLevel numerically is messy; restrict to yLevel = 0 case for a clean answer, else use two symmetric x found by construction
  let correctRaw;
  if (useRoots) {
    correctRaw = `${r1} \\text{ et } ${r2}`;
  } else {
    const xOffset = pick([-1, 1]);
    const xKnown = (r1 + r2) / 2 + xOffset;
    const xMirror = (r1 + r2) - xKnown;
    correctRaw = `${roundTo(xKnown, 2)} \\text{ et } ${roundTo(xMirror, 2)}`;
  }
  const wrongRaw = `${r1 - 1} \\text{ et } ${r2 + 1}`;
  const options = shuffle([correctRaw, wrongRaw]);
  return {
    type: "qcm",
    chapter: "Fonctions second degré (Première techno) — Résolution graphique",
    prompt: `On donne ci-dessous la représentation graphique d'une fonction polynôme du second degré \\(f\\). Résous graphiquement l'équation \\(f(x) = ${useRoots ? 0 : fr(roundTo(yLevel, 2))}\\).`,
    answer: correctRaw,
    options,
    steps: [`\\text{On lit les abscisses des points de la courbe dont l'ordonnée vaut } ${useRoots ? 0 : fr(roundTo(yLevel, 2))}.`, correctRaw],
    graph: {
      xMin: Math.min(r1, r2) - 3,
      xMax: Math.max(r1, r2) + 3,
      yMin: Math.min(-1, fn((r1 + r2) / 2)) - 2,
      yMax: Math.max(1, fn(r1 - 2), fn(r2 + 2)) + 2,
      curves: [{ fn, label: "f" }],
      lines: useRoots ? [] : [{ a: 0, b: yLevel, color: "#6E7787", dashed: true, label: `y=${fr(roundTo(yLevel, 2))}` }],
    },
  };
}

// ---------- 7. Signe d'une fonction sous forme factorisée ----------
function genSigneFormeFactoriseeQCM() {
  const a = pick([1, -1, 2, -2]);
  let r1 = randInt(-6, 6);
  let r2 = randInt(-6, 6);
  while (r2 === r1) r2 = randInt(-6, 6);
  const lo = Math.min(r1, r2);
  const hi = Math.max(r1, r2);
  const positifEntre = a < 0;
  const correctRaw = positifEntre ? `]${lo} ; ${hi}[` : `]-\\infty ; ${lo}[ \\cup ]${hi} ; +\\infty[`;
  const wrongRaw = positifEntre ? `]-\\infty ; ${lo}[ \\cup ]${hi} ; +\\infty[` : `]${lo} ; ${hi}[`;
  const options = shuffle([correctRaw, wrongRaw]);
  return {
    type: "qcm",
    chapter: "Fonctions second degré (Première techno) — Signe",
    prompt: `On donne \\(f(x) = ${a === 1 ? "" : a}(x - ${lo})(x - ${hi})\\). Sur quel ensemble \\(f(x) > 0\\) ?`,
    answer: correctRaw,
    options,
    steps: [`\\text{Un polynôme du second degré est du signe de son coefficient dominant } (${a}) \\text{ à l'extérieur des racines, et de signe opposé entre elles.}`, `\\text{Solution : } ${correctRaw}`],
  };
}

// ---------- 8. Lire l'abscisse du sommet / axe de symétrie sur un graphique ----------
function genLireSommetGraphiqueNumeric() {
  const a = pick([1, -1, 2, -2, 0.5, -0.5]);
  const alpha = randInt(-5, 5);
  const beta = randInt(-6, 6);
  const fn = (x) => a * (x - alpha) * (x - alpha) + beta;
  return {
    type: "numeric",
    chapter: "Fonctions second degré (Première techno) — Sommet et axe de symétrie",
    prompt: `On donne ci-dessous la représentation graphique d'une fonction polynôme du second degré \\(f\\). Donne l'abscisse du sommet de la parabole (lecture graphique).`,
    answer: alpha,
    steps: [`\\text{Le sommet est le point le plus ${a > 0 ? "bas" : "haut"} de la courbe : son abscisse est } ${alpha}.`],
    graph: { xMin: alpha - 5, xMax: alpha + 5, yMin: Math.min(beta, fn(alpha - 5), fn(alpha + 5)) - 1, yMax: Math.max(beta, fn(alpha - 5), fn(alpha + 5)) + 1, curves: [{ fn, label: "f" }], points: [{ x: alpha, y: beta, label: "S" }] },
  };
}

// ---------- 9. Associer une parabole à x↦ax²+c ----------
function genAssocierAxCarrePlusCQCM() {
  const a = pick([1, -1, 2, -2, 0.5]);
  const c = randInt(-5, 5);
  const xTest = pick([-2, -1, 1, 2]);
  const yTest = a * xTest * xTest + c;
  const correctRaw = `x \\mapsto ${a === 1 ? "" : a === -1 ? "-" : a}x^2 ${c >= 0 ? "+" : "-"} ${Math.abs(c)}`;
  const wrong1 = `x \\mapsto ${a === 1 ? "" : a === -1 ? "-" : a}x^2 ${c >= 0 ? "-" : "+"} ${Math.abs(c)}`;
  const wrong2 = `x \\mapsto ${a === 1 ? "" : -a === 1 ? "" : -a}x^2 ${c >= 0 ? "+" : "-"} ${Math.abs(c)}`;
  const options = shuffle([correctRaw, wrong1, wrong2]);
  return {
    type: "qcm",
    chapter: "Fonctions second degré (Première techno) — Fonctions de référence",
    prompt: `Une parabole d'équation \\(y = ax^2 + c\\) a pour sommet \\((0 ; ${c})\\) et passe par \\((${xTest} ; ${fr(yTest)})\\). Quelle est l'expression de cette fonction ?`,
    answer: correctRaw,
    options,
    steps: [`\\text{Le sommet } (0 ; c) \\text{ donne } c = ${c}.`, `a = \\dfrac{${fr(yTest)} - ${c}}{${xTest}^2} = ${fr(a)}`, correctRaw],
  };
}

// ---------- 10. Déterminer f(x) connaissant les racines et un point ----------
function genDeterminerAConnaissantPointNumeric() {
  let r1 = randInt(-6, 6);
  let r2 = randInt(-6, 6);
  while (r2 === r1) r2 = randInt(-6, 6);
  let x0 = randInt(-6, 6);
  while (x0 === r1 || x0 === r2) x0 = randInt(-6, 6);
  const aTrue = nonZero(-4, 4);
  const y0 = aTrue * (x0 - r1) * (x0 - r2);
  return {
    type: "numeric",
    chapter: "Fonctions second degré (Première techno) — Détermination de f",
    prompt: `\\(f\\) est une fonction polynôme du second degré qui s'annule en \\(x = ${r1}\\) et \\(x = ${r2}\\). Sa parabole passe par le point \\((${x0} ; ${y0})\\). Sachant que \\(f(x) = a(x - ${r1})(x - ${r2})\\), détermine \\(a\\).`,
    answer: aTrue,
    steps: [`f(${x0}) = a \\times (${x0} - ${r1}) \\times (${x0} - ${r2}) = ${y0}`, `a = \\dfrac{${y0}}{${(x0 - r1) * (x0 - r2)}} = ${aTrue}`],
  };
}

const GENERATORS = [
  genImageFormeFactoriseeNumeric,
  genRacinesFormeFactoriseeQCM,
  genFactoriserConnaissantRacineNumeric,
  genAllureParaboleQCM,
  genAssocierAxCarreQCM,
  genResoudreGraphiquementEgaliteQCM,
  genSigneFormeFactoriseeQCM,
  genLireSommetGraphiqueNumeric,
  genAssocierAxCarrePlusCQCM,
  genDeterminerAConnaissantPointNumeric,
];

const DIFFICULTY = {
  genImageFormeFactoriseeNumeric: "facile",
  genRacinesFormeFactoriseeQCM: "facile",
  genAllureParaboleQCM: "facile",
  genFactoriserConnaissantRacineNumeric: "standard",
  genAssocierAxCarreQCM: "standard",
  genSigneFormeFactoriseeQCM: "standard",
  genLireSommetGraphiqueNumeric: "standard",
  genAssocierAxCarrePlusCQCM: "expert",
  genResoudreGraphiquementEgaliteQCM: "expert",
  genDeterminerAConnaissantPointNumeric: "expert",
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
    id: "fonctions-second-degre-premiere-techno",
    title: "Fonctions polynômes de degré 2",
    description: "Allure de la parabole, racines et signe sous forme factorisée (sans discriminant), sommet, résolution graphique.",
    pourquoi: "Étudier une parabole, c'est ce qui permet de trouver un maximum de profit, un minimum de coût, ou la trajectoire d'un objet lancé.",
    level: "premiere-techno",
    order: 3,
  },
  generate,
};
