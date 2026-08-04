// ---------------------------------------------------------------------------
// Chapitre : Automatismes (Terminale technologique / STMG)
// Découpé par thème (THEMES), un par bloc du programme : Suites, Fonctions
// exponentielles, Logarithme décimal, Statistiques à deux variables,
// Probabilités conditionnelles, Variables aléatoires / loi binomiale.
// Inspiré des "questions flash" de 5 automatismes en tout début de séance
// dans les fiches de Romain (Terminale STMG, 2026-2027).
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
const combinaison = (n, k) => {
  if (k < 0 || k > n) return 0;
  let res = 1;
  for (let i = 0; i < k; i++) res = (res * (n - i)) / (i + 1);
  return Math.round(res);
};

// =========================== Suites ===========================

function genRaisonArithmetiqueQCM() {
  const uA = randInt(-20, 20);
  const r = nonZero(-9, 9);
  const uB = uA + r;
  return {
    type: "numeric",
    chapter: "Automatismes (Terminale techno) — Suites",
    prompt: `\\((u_n)\\) est une suite arithmétique avec \\(u_4 = ${uA}\\) et \\(u_5 = ${uB}\\). Sa raison est :`,
    answer: r,
    steps: [`r = ${uB} - (${uA}) = ${r}`],
  };
}

function genTauxEvolutionIndiceQCM() {
  const v0 = pick([100, 150, 200]);
  const v1 = roundTo(v0 * pick([1.1, 1.2, 0.9, 0.85]), 2);
  const taux = roundTo((v1 - v0) / v0 * 100, 2);
  return {
    type: "numeric",
    chapter: "Automatismes (Terminale techno) — Suites",
    prompt: `Un indice passe de ${v0} à ${fr(v1)}. Calcule le taux d'évolution associé (en %, arrondi au centième).`,
    answer: taux,
    tolerance: 0.05,
    steps: [`\\dfrac{${fr(v1)} - ${v0}}{${v0}} \\times 100 = ${fr(taux)} \\%`],
  };
}

function genReconnaitreArithGeomQCM() {
  const cas = pick([
    { description: "Une entreprise verse la même prime en euros chaque année.", reponse: "Arithmétique" },
    { description: "Un capital augmente du même pourcentage chaque année.", reponse: "Géométrique" },
    { description: "Un loyer augmente du même montant en euros chaque année.", reponse: "Arithmétique" },
    { description: "Une population croît au même taux chaque année.", reponse: "Géométrique" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes (Terminale techno) — Suites",
    prompt: `« ${cas.description} » Quel type de suite modélise cette situation ?`,
    answer: cas.reponse,
    options: ["Arithmétique", "Géométrique"],
    steps: [cas.reponse],
  };
}

// =========================== Fonctions exponentielles ===========================

function genPuissanceExponentielleQCM() {
  const a = pick([2, 3, 1.5, 0.5]);
  const n = randInt(2, 4);
  const answer = roundTo(a ** n, 3);
  return {
    type: "numeric",
    chapter: "Automatismes (Terminale techno) — Exponentielles",
    prompt: `Calcule \\(${fr(a)}^{${n}}\\).`,
    answer,
    tolerance: 0.01,
    steps: [`${fr(a)}^{${n}} = ${fr(answer)}`],
  };
}

function genSensVariationExponentielleQCM() {
  const a = pick([2, 3, 1.5, 0.5, 0.2, 0.8]);
  const answer = a > 1 ? "croissante" : "décroissante";
  return {
    type: "qcm",
    chapter: "Automatismes (Terminale techno) — Exponentielles",
    prompt: `La fonction \\(x \\mapsto ${fr(a)}^x\\) est-elle croissante ou décroissante sur ℝ ?`,
    answer,
    options: ["croissante", "décroissante"],
    steps: [a > 1 ? `\\text{Comme } a=${fr(a)} > 1\\text{, la fonction est croissante.}` : `\\text{Comme } 0 < a=${fr(a)} < 1\\text{, la fonction est décroissante.}`],
  };
}

function genProprieteAlgebriqueExponentielleQCM() {
  const cas = pick([
    { description: `\\(a^{x+y}\\)`, reponse: `\\(a^x \\times a^y\\)` },
    { description: `\\(a^{x-y}\\)`, reponse: `\\(\\dfrac{a^x}{a^y}\\)` },
    { description: `\\((a^x)^n\\)`, reponse: `\\(a^{xn}\\)` },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes (Terminale techno) — Exponentielles",
    prompt: `À quoi est égal ${cas.description} ?`,
    answer: cas.reponse,
    options: shuffle([cas.reponse, `\\(a^x + a^y\\)`, `\\(a^{x/y}\\)`]),
    steps: [cas.reponse],
  };
}

// =========================== Logarithme décimal ===========================

function genValeurLogImmediateQCM() {
  const cas = pick([
    { b: 1, log: 0 },
    { b: 10, log: 1 },
    { b: 100, log: 2 },
    { b: 1000, log: 3 },
    { b: 0.1, log: -1 },
  ]);
  return {
    type: "numeric",
    chapter: "Automatismes (Terminale techno) — Logarithme",
    prompt: `Calcule \\(\\log(${fr(cas.b)})\\) (valeur exacte, sans calculatrice).`,
    answer: cas.log,
    steps: [`\\log(${fr(cas.b)}) = ${cas.log}`],
  };
}

function genResoudre10PuissanceXQCM() {
  const exp = randInt(1, 4);
  const b = 10 ** exp;
  return {
    type: "numeric",
    chapter: "Automatismes (Terminale techno) — Logarithme",
    prompt: `Résous \\(10^x = ${b}\\).`,
    answer: exp,
    steps: [`x = \\log(${b}) = ${exp}`],
  };
}

function genProprieteAlgebriqueLogQCM() {
  const cas = pick([
    { description: `\\(\\log(a \\times b)\\)`, reponse: `\\(\\log(a) + \\log(b)\\)` },
    { description: `\\(\\log\\left(\\dfrac{a}{b}\\right)\\)`, reponse: `\\(\\log(a) - \\log(b)\\)` },
    { description: `\\(\\log(a^n)\\)`, reponse: `\\(n \\times \\log(a)\\)` },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes (Terminale techno) — Logarithme",
    prompt: `À quoi est égal ${cas.description} ?`,
    answer: cas.reponse,
    options: shuffle([cas.reponse, `\\(\\log(a) \\times \\log(b)\\)`, `\\(\\log(a+b)\\)`]),
    steps: [cas.reponse],
  };
}

// =========================== Statistiques à deux variables ===========================

function genPointMoyenQCM() {
  const xs = [randInt(1, 10), randInt(1, 10), randInt(1, 10)];
  const xMoy = roundTo(xs.reduce((a, b) => a + b, 0) / 3, 2);
  return {
    type: "numeric",
    chapter: "Automatismes (Terminale techno) — Statistiques",
    prompt: `Un nuage de points a pour abscisses ${xs.join(", ")}. Calcule \\(\\bar{x}\\) (arrondi au centième).`,
    answer: xMoy,
    tolerance: 0.02,
    steps: [`\\bar{x} = \\dfrac{${xs.join(" + ")}}{3} = ${fr(xMoy)}`],
  };
}

function genChangementVariableQCM() {
  const cas = pick([
    { description: "Le nuage de points (x ; y) a une forme parabolique croissante.", reponse: "Poser Y = √y (ou y = x²) pour tenter un ajustement affine" },
    { description: "Le nuage de points semble suivre une décroissance en 1/x.", reponse: "Poser X = 1/x pour tenter un ajustement affine" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes (Terminale techno) — Statistiques",
    prompt: `« ${cas.description} » Quel changement de variable peut-on essayer pour se ramener à un ajustement affine ?`,
    answer: cas.reponse,
    options: [cas.reponse, "Aucun changement de variable n'est utile ici"],
    steps: [cas.reponse],
  };
}

// =========================== Probabilités conditionnelles ===========================

function genPartitionUniversQCM() {
  const p1 = pick([0.2, 0.3, 0.4]);
  const p2 = pick([0.1, 0.2, 0.3]);
  const answer = roundTo(1 - p1 - p2, 4);
  return {
    type: "numeric",
    chapter: "Automatismes (Terminale techno) — Probabilités",
    prompt: `\\(A_1, A_2, A_3\\) forment une partition de l'univers, avec \\(P(A_1)=${fr(p1)}\\) et \\(P(A_2)=${fr(p2)}\\). Calcule \\(P(A_3)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [`P(A_3) = 1 - ${fr(p1)} - ${fr(p2)} = ${fr(answer)}`],
  };
}

function genArbreBrancheQCM() {
  const p1 = pick([0.3, 0.4, 0.5, 0.6]);
  const p2 = pick([0.2, 0.3, 0.4]);
  const answer = roundTo(p1 * p2, 4);
  return {
    type: "numeric",
    chapter: "Automatismes (Terminale techno) — Probabilités",
    prompt: `Dans un arbre pondéré, deux branches successives ont pour probabilités ${fr(p1)} et ${fr(p2)}. Calcule la probabilité du chemin.`,
    answer,
    tolerance: 0.0005,
    steps: [`${fr(p1)} \\times ${fr(p2)} = ${fr(answer)}`],
  };
}

// =========================== Variables aléatoires / loi binomiale ===========================

function genCoefficientBinomialQCM() {
  const n = randInt(3, 8);
  const k = randInt(0, n);
  const answer = combinaison(n, k);
  return {
    type: "numeric",
    chapter: "Automatismes (Terminale techno) — Variables aléatoires",
    prompt: `Calcule le coefficient binomial \\(\\dbinom{${n}}{${k}}\\) (triangle de Pascal).`,
    answer,
    steps: [`\\dbinom{${n}}{${k}} = ${answer}`],
  };
}

function genReconnaitreBinomialeQCM() {
  const cas = pick([
    { description: "On répète 10 fois, de façon indépendante, un tirage avec remise dans une urne à deux couleurs.", reponse: "Loi binomiale" },
    { description: "On tire successivement, sans remise, 3 cartes parmi 32.", reponse: "Pas une loi binomiale" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes (Terminale techno) — Variables aléatoires",
    prompt: `« ${cas.description} » S'agit-il d'une situation de loi binomiale ?`,
    answer: cas.reponse,
    options: ["Loi binomiale", "Pas une loi binomiale"],
    steps: [cas.reponse],
  };
}

function genProduitPuissancesBernoulliQCM() {
  const p = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);
  const n = randInt(3, 6);
  const k = randInt(0, n);
  const answer = roundTo(p ** k * (1 - p) ** (n - k), 5);
  return {
    type: "numeric",
    chapter: "Automatismes (Terminale techno) — Variables aléatoires",
    prompt: `Calcule \\(${fr(p)}^{${k}} \\times ${fr(roundTo(1 - p, 4))}^{${n - k}}\\) (arrondi à 0,00001 près).`,
    answer,
    tolerance: 0.00005,
    steps: [`${fr(p)}^{${k}} \\times ${fr(roundTo(1 - p, 4))}^{${n - k}} \\approx ${fr(answer)}`],
  };
}

// =========================== THEMES ===========================

const CH_SUITES = [genRaisonArithmetiqueQCM, genTauxEvolutionIndiceQCM, genReconnaitreArithGeomQCM];
const CH_EXPONENTIELLES = [genPuissanceExponentielleQCM, genSensVariationExponentielleQCM, genProprieteAlgebriqueExponentielleQCM];
const CH_LOGARITHME = [genValeurLogImmediateQCM, genResoudre10PuissanceXQCM, genProprieteAlgebriqueLogQCM];
const CH_STATISTIQUES = [genPointMoyenQCM, genChangementVariableQCM];
const CH_PROBABILITES = [genPartitionUniversQCM, genArbreBrancheQCM];
const CH_VARIABLES_ALEATOIRES = [genCoefficientBinomialQCM, genReconnaitreBinomialeQCM, genProduitPuissancesBernoulliQCM];

const THEMES = [
  { id: "suites", title: "Suites", generators: CH_SUITES },
  { id: "exponentielles", title: "Fonctions exponentielles", generators: CH_EXPONENTIELLES },
  { id: "logarithme", title: "Logarithme décimal", generators: CH_LOGARITHME },
  { id: "statistiques", title: "Statistiques à deux variables", generators: CH_STATISTIQUES },
  { id: "probabilites", title: "Probabilités conditionnelles", generators: CH_PROBABILITES },
  { id: "variables-aleatoires", title: "Variables aléatoires et loi binomiale", generators: CH_VARIABLES_ALEATOIRES },
];

const GENERATORS = THEMES.flatMap((t) => t.generators);

function generate(themeId) {
  if (themeId && themeId !== "mix") {
    const theme = THEMES.find((t) => t.id === themeId);
    if (theme) return pick(theme.generators)();
  }
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "automatismes-terminale-techno",
    title: "Automatismes",
    description: "Calcul rapide et automatismes du programme de Terminale STMG, thème par thème.",
    pourquoi: "Les automatismes, c'est le calcul mental qui libère de la place dans ta tête pour réfléchir au problème plutôt qu'à l'arithmétique : quelques minutes régulières valent mieux qu'une révision unique la veille du contrôle.",
    level: "terminale-techno",
    freemiumDaily: 5,
    order: 1,
    isAutomatismes: true,
  },
  themes: THEMES.map(({ id, title }) => ({ id, title })),
  generate,
};
