// ---------------------------------------------------------------------------
// Chapitre : Modélisation quadratique (Première, enseignement mathématique
// non spé) — sous abonnement.
//
// NOTE (audit programme 2026, M1) : ce chapitre est un ajout — le trinôme du
// second degré n'apparaissait auparavant dans les fichiers de ce niveau que
// comme support de dérivation (dans variations-globales-premiere-non-spe.js),
// jamais comme objet d'étude autonome via le discriminant. Le nouveau
// programme 2026 introduit explicitement la modélisation par une fonction du
// second degré : forme canonique et forme développée, discriminant Δ,
// résolution d'équations et d'inéquations du second degré via Δ (et non via
// la dérivée), sommet et axe de symétrie de la parabole.
//
// La correction ne s'appuie pas sur un livre du professeur dédié à ce
// niveau ; la méthode et les formules reprennent le traitement standard du
// second degré (cohérent avec second-degre.js, Première Spécialité), mais
// calibré pour le niveau non spé (contextes plus guidés, pas de
// factorisation générale d'un trinôme quelconque).
// Voir automatismes-premiere-non-spe.js (thème
// "modelisation-quadratique-premiere-non-spe") pour les mini-exercices
// "Calcul mental" associés.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
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

// Retourne un fragment LaTeX signé, ex: signedL(-3, "x") -> "- 3x"
const signedL = (n, withVar = "") => (n >= 0 ? `+ ${n}${withVar}` : `- ${Math.abs(n)}${withVar}`);

// Trinôme du second degré en LaTeX (sans les délimiteurs), ex: quadL(-3,-2,5) -> "-3x^2 - 2x + 5"
const quadL = (a2, a1, a0) => {
  const lead = (a2 === 1 ? "" : a2 === -1 ? "-" : String(a2)) + "x^2";
  const parts = [lead];
  if (a1 !== 0) parts.push(signedL(a1, "x"));
  if (a0 !== 0) parts.push(signedL(a0));
  return parts.join(" ");
};

// ---------- 1. Forme canonique vers forme développée ----------
function genFormeCanoniqueVersDeveloppee() {
  const alpha = randInt(-8, 8);
  const a = pick([1, -1, 2, -2, 3, -3]);
  const beta = randInt(-10, 10);
  const b = -2 * a * alpha;
  const c = a * alpha * alpha + beta;
  const demanderB = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Modélisation quadratique — Forme canonique et forme développée",
    prompt: `La fonction \\(f(x) = ${a}(x ${signedL(-alpha)})^2 ${signedL(beta)}\\) est écrite sous forme canonique. Sa forme développée est \\(f(x) = ${a}x^2 + bx + c\\). Détermine ${demanderB ? "b" : "c"}.`,
    answer: demanderB ? b : c,
    steps: [
      { type: "regle", text: `\\text{On développe } ${a}(x ${signedL(-alpha)})^2 ${signedL(beta)} \\text{ en utilisant l'identité remarquable } (x-\\alpha)^2 = x^2 - 2\\alpha x + \\alpha^2.` },
      { type: "calcul", text: `${a}(x^2 ${signedL(-2 * alpha, "x")} + ${alpha * alpha}) ${signedL(beta)} = ${a}x^2 ${signedL(b, "x")} ${signedL(c)}` },
      { type: "resultat", text: demanderB ? `b = ${b}` : `c = ${c}` },
    ],
  };
}

// ---------- 2. Calculer le discriminant ----------
function genCalculDiscriminant() {
  const a = nonZero(1, 5);
  const b = randInt(-9, 9);
  const c = randInt(-9, 9);
  const delta = b * b - 4 * a * c;
  return {
    type: "numeric",
    chapter: "Modélisation quadratique — Discriminant",
    prompt: `Calcule le discriminant \\(\\Delta\\) du trinôme \\(${quadL(a, b, c)}\\).`,
    answer: delta,
    steps: [
      { type: "regle", text: `\\text{Pour un trinôme } ax^2+bx+c, \\text{ le discriminant vaut } \\Delta = b^2 - 4ac.` },
      { type: "calcul", text: `\\Delta = (${b})^2 - 4 \\times ${a} \\times (${c})` },
      { type: "resultat", text: `\\Delta = ${b * b} - ${4 * a * c} = ${delta}` },
    ],
  };
}

// ---------- 3. Résoudre une équation du second degré via Δ ----------
function genResoudreEquationSecondDegre() {
  const a = pick([1, 1, 1, 2, -1]);
  let r1 = randInt(-8, 8);
  let r2 = randInt(-8, 8);
  while (r2 === r1) r2 = randInt(-8, 8);
  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const delta = b * b - 4 * a * c;
  const plusPetite = Math.min(r1, r2);
  return {
    type: "numeric",
    chapter: "Modélisation quadratique — Résolution d'une équation",
    prompt: `Résous l'équation \\(${quadL(a, b, c)} = 0\\) et donne la plus petite des deux solutions.`,
    answer: plusPetite,
    steps: [
      { type: "calcul", text: `\\Delta = b^2 - 4ac = (${b})^2 - 4 \\times ${a} \\times (${c}) = ${delta}` },
      { type: "regle", text: `\\Delta > 0 : \\text{ l'équation admet deux solutions } x = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a}.` },
      { type: "resultat", text: `\\text{Les deux solutions sont } ${r1} \\text{ et } ${r2}. \\text{ La plus petite est } ${plusPetite}.` },
    ],
  };
}

// ---------- 4. Signe d'un trinôme sur un intervalle ----------
function genSigneTrinomeQCM() {
  const a = pick([1, 1, -1, 2, -2]);
  let r1 = randInt(-8, 8);
  let r2 = randInt(-8, 8);
  while (r2 === r1) r2 = randInt(-8, 8);
  const [rmin, rmax] = r1 < r2 ? [r1, r2] : [r2, r1];
  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const xTest = randInt(rmin + 1, rmax - 1);
  const valeur = a * xTest * xTest + b * xTest + c;
  const reponse = valeur > 0 ? "positif" : valeur < 0 ? "négatif" : "nul";
  return {
    type: "qcm",
    chapter: "Modélisation quadratique — Signe d'un trinôme",
    prompt: `Le trinôme \\(${quadL(a, b, c)}\\) a pour racines ${rmin} et ${rmax}. Quel est son signe entre ses deux racines (par exemple en \\(x = ${xTest}\\)) ?`,
    answer: reponse,
    options: ["positif", "négatif", "nul"],
    steps: [
      { type: "regle", text: `\\text{Un trinôme du second degré est du signe de son coefficient } a \\text{ à l'extérieur de ses racines, et du signe opposé à } a \\text{ entre ses racines.}` },
      { type: "resultat", text: `a = ${a} \\text{, donc entre les racines, le trinôme est } \\textbf{${reponse}}.` },
    ],
  };
}

// ---------- 5. Sommet de la parabole (à partir de la forme développée) ----------
function genSommetParaboleNumeric() {
  const a = pick([1, -1, 2, -2]);
  const alpha = randInt(-8, 8);
  const b = -2 * a * alpha;
  const beta = randInt(-10, 10);
  const c = a * alpha * alpha + beta;
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Modélisation quadratique — Sommet de la parabole",
    prompt: `La parabole représentant \\(f(x) = ${quadL(a, b, c)}\\) a pour sommet le point S. Détermine ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de S.`,
    answer: demanderAbscisse ? alpha : beta,
    steps: [
      { type: "regle", text: `\\text{L'abscisse du sommet est } \\alpha = -\\dfrac{b}{2a}, \\text{ et son ordonnée est } \\beta = f(\\alpha).` },
      { type: "calcul", text: `\\alpha = -\\dfrac{${b}}{2 \\times ${a}} = ${alpha}` },
      { type: "resultat", text: demanderAbscisse ? `\\text{Abscisse du sommet : } ${alpha}` : `\\beta = f(${alpha}) = ${beta}` },
    ],
  };
}

// ---------- 6. Résoudre une inéquation du second degré via Δ ----------
function genResoudreInequationSecondDegre() {
  const a = pick([1, 1, -1, 2]);
  let r1 = randInt(-8, 8);
  let r2 = randInt(-8, 8);
  while (r2 === r1) r2 = randInt(-8, 8);
  const [rmin, rmax] = r1 < r2 ? [r1, r2] : [r2, r1];
  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const sens = pick([">", "<"]);
  // Signe du trinôme : entre les racines, signe opposé à a ; à l'extérieur, signe de a.
  const positifEntre = a < 0;
  let bonneReponse;
  if (sens === ">") {
    bonneReponse = positifEntre ? `]${rmin} ; ${rmax}[` : `]-\\infty ; ${rmin}[ \\cup ]${rmax} ; +\\infty[`;
  } else {
    bonneReponse = positifEntre ? `]-\\infty ; ${rmin}[ \\cup ]${rmax} ; +\\infty[` : `]${rmin} ; ${rmax}[`;
  }
  const mauvaise1 = `]${rmin} ; ${rmax}[`;
  const mauvaise2 = `]-\\infty ; ${rmin}[ \\cup ]${rmax} ; +\\infty[`;
  const optionsSet = [...new Set([bonneReponse, mauvaise1, mauvaise2])];
  if (optionsSet.length < 3) optionsSet.push(`\\emptyset`);
  return {
    type: "qcm",
    chapter: "Modélisation quadratique — Résolution d'une inéquation",
    prompt: `Résous l'inéquation \\(${quadL(a, b, c)} ${sens} 0\\), sachant que le trinôme a pour racines ${rmin} et ${rmax}.`,
    answer: bonneReponse,
    options: shuffle(optionsSet),
    steps: [
      { type: "regle", text: `\\text{Le trinôme est du signe de } a \\text{ à l'extérieur des racines, et du signe opposé à } a \\text{ entre les racines.}` },
      { type: "resultat", text: `a = ${a}${a > 0 ? " > 0" : " < 0"} \\text{, donc l'ensemble des solutions est } ${bonneReponse}.` },
    ],
  };
}

const GENERATORS = [
  genFormeCanoniqueVersDeveloppee,
  genCalculDiscriminant,
  genResoudreEquationSecondDegre,
  genSigneTrinomeQCM,
  genSommetParaboleNumeric,
  genResoudreInequationSecondDegre,
];

const DIFFICULTY = {
  genCalculDiscriminant: "facile",
  genFormeCanoniqueVersDeveloppee: "standard",
  genResoudreEquationSecondDegre: "standard",
  genSommetParaboleNumeric: "standard",
  genSigneTrinomeQCM: "expert",
  genResoudreInequationSecondDegre: "expert",
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
    id: "modelisation-quadratique-premiere-non-spe",
    title: "Modélisation quadratique",
    description: "Forme canonique et forme développée d'un trinôme, discriminant, résolution d'équations et d'inéquations du second degré, sommet et signe de la parabole.",
    pourquoi: "Beaucoup de phénomènes (trajectoire d'un objet, aire à optimiser, bénéfice d'une entreprise) se modélisent par une fonction du second degré — savoir la résoudre, c'est savoir répondre à des questions concrètes.",
    level: "premiere-non-spe",
    free: false,
    order: 6,
  },
  generate,
};
