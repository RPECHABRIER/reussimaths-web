// ---------------------------------------------------------------------------
// Chapitre : Réviser les bases (Terminale Spé) — gratuit, illimité.
//
// Équivalent, pour l'entrée en Terminale (spécialité mathématiques), du
// chapitre "Réviser les bases" des niveaux précédents : un tour d'horizon
// des savoir-faire de Première indispensables pour aborder les nouveaux
// chapitres de Terminale (suites arithmétiques et géométriques, nombre
// dérivé et fonction dérivée, résolution d'équations du second degré,
// probabilités conditionnelles, vecteurs du plan, fonctions exponentielles).
// Fichier indépendant (par convention, chaque chapitre a ses propres
// helpers, pas de mutualisation entre fichiers).
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

// ---------- 1. Terme d'une suite arithmétique ----------
function genTermeSuiteArithmetiqueNumeric() {
  const r = nonZero(-9, 9);
  const u0 = randInt(-15, 15);
  const n = randInt(2, 12);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale) — Suites",
    prompt: `Une suite arithmétique u a pour premier terme \\(u(0) = ${u0}\\) et pour raison \\(r = ${r}\\). Calcule \\(u(${n})\\).`,
    answer: r * n + u0,
    steps: [`${r} \\times ${n} + ${u0} = ${r * n + u0}`],
  };
}

// ---------- 2. Terme d'une suite géométrique ----------
function genTermeSuiteGeometriqueNumeric() {
  const q = pick([2, 3, 4, 5, 0.5]);
  const u0 = pick([1, 2, 3, 4, 5]);
  const n = randInt(2, 4);
  const answer = roundTo(u0 * q ** n, 6);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale) — Suites",
    prompt: `Une suite géométrique u a pour premier terme \\(u(0) = ${u0}\\) et pour raison \\(q = ${fr(q)}\\). Calcule \\(u(${n})\\).`,
    answer,
    tolerance: 0.001,
    steps: [`${u0} \\times ${fr(q)}^{${n}} = ${fr(answer)}`],
  };
}

// ---------- 3. Nombre dérivé depuis deux points de la tangente ----------
function genNombreDeriveNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = randInt(-6, 6);
  const xA = randInt(-8, 8);
  let xB = randInt(-8, 8);
  while (xB === xA) xB = randInt(-8, 8);
  const m = nonZero(-6, 6);
  const p = randInt(-10, 10);
  const yA = m * xA + p;
  const yB = m * xB + p;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale) — Dérivation",
    prompt: `La tangente à la courbe de ${nomFonction} au point d'abscisse ${a} passe par \\(A(${xA} ; ${yA})\\) et \\(B(${xB} ; ${yB})\\). Calcule \\(${nomFonction}'(${a})\\).`,
    answer: m,
    steps: [`\\dfrac{${yB} - (${yA})}{${xB} - (${xA})} = ${m}`],
  };
}

// ---------- 4. Dérivée d'un trinôme ----------
function genDeriveeTrinomeNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = nonZero(-6, 6);
  const b = randInt(-9, 9);
  const x = randInt(-5, 5);
  const answer = 2 * a * x + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale) — Dérivation",
    prompt: `On considère \\(${nomFonction}(x) = ${a}x^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x\\). Calcule \\(${nomFonction}'(${x})\\).`,
    answer,
    steps: [`${nomFonction}'(x) = ${2 * a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`, `${nomFonction}'(${x}) = ${answer}`],
  };
}

// ---------- 5. Résoudre une équation du type x² = k ----------
function genResoudreCarreEgalKNumeric() {
  const r = randInt(2, 15);
  const k = r * r;
  const demandeNegative = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale) — Équations",
    prompt: `Résous l'équation \\(x^2 = ${k}\\) et donne ${demandeNegative ? "la solution négative" : "la solution positive"}.`,
    answer: demandeNegative ? -r : r,
    steps: [`x = ${r} \\text{ ou } x = ${-r}`],
  };
}

// ---------- 6. Probabilité conditionnelle P_A(B) ----------
function genProbabiliteConditionnelleNumeric() {
  const pA = pick([0.4, 0.5, 0.6, 0.8]);
  const pB_A = pick([0.2, 0.25, 0.5, 0.75]);
  const pAB = roundTo(pA * pB_A, 4);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale) — Probabilités",
    prompt: `On sait que \\(P(A) = ${fr(pA)}\\) et \\(P_A(B) = ${fr(pB_A)}\\). Calcule \\(P(A \\cap B)\\).`,
    answer: pAB,
    tolerance: 0.001,
    steps: [`${fr(pA)} \\times ${fr(pB_A)} = ${fr(pAB)}`],
  };
}

// ---------- 7. Coordonnées d'un vecteur (plan) ----------
function genCoordonneesVecteurPlanNumeric() {
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const xB = randInt(-8, 8);
  const yB = randInt(-8, 8);
  const demandeX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale) — Vecteurs",
    prompt: `On considère les points \\(A(${xA} ; ${yA})\\) et \\(B(${xB} ; ${yB})\\). Donne ${demandeX ? "la coordonnée en x" : "la coordonnée en y"} du vecteur \\(\\vec{AB}\\).`,
    answer: demandeX ? xB - xA : yB - yA,
    steps: [demandeX ? `x_B - x_A = ${xB} - (${xA}) = ${xB - xA}` : `y_B - y_A = ${yB} - (${yA}) = ${yB - yA}`],
  };
}

// ---------- 8. Sens de variation d'une fonction exponentielle ----------
function genSensVariationExponentielleQCM() {
  const base = pick([1.2, 1.5, 2, 3, 0.3, 0.5, 0.7, 0.9]);
  const reponse = base > 1 ? "croissante" : "décroissante";
  return {
    type: "qcm",
    chapter: "Réviser les bases (Terminale) — Fonctions exponentielles",
    prompt: `La fonction \\(f(x) = ${fr(base)}^x\\) est-elle croissante ou décroissante sur \\(\\mathbb{R}\\) ?`,
    answer: reponse,
    options: ["croissante", "décroissante"],
    steps: [base > 1 ? "base > 1 : croissante" : "0 < base < 1 : décroissante"],
  };
}

// ---------- 9. Coefficient multiplicateur global d'évolutions successives ----------
function genCoefficientMultiplicateurGlobalNumeric() {
  const cm1 = pick([1.1, 1.2, 1.05, 1.4, 0.9, 0.8, 0.95, 1.15]);
  const cm2 = pick([1.1, 1.2, 1.05, 1.4, 0.9, 0.8, 0.95, 1.15]);
  const answer = roundTo(cm1 * cm2, 4);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale) — Évolutions",
    prompt: `Une grandeur subit deux évolutions successives de coefficients multiplicateurs \\(${fr(cm1)}\\) puis \\(${fr(cm2)}\\). Calcule le coefficient multiplicateur global (arrondi au millième).`,
    answer,
    tolerance: 0.001,
    steps: [`${fr(cm1)} \\times ${fr(cm2)} = ${fr(answer)}`],
  };
}

// ---------- 10. Résoudre une équation produit nul ----------
function genEquationProduitNulNumeric() {
  const r1 = nonZero(-8, 8);
  const r2 = nonZero(-8, 8);
  const demandeGrande = Math.random() < 0.5;
  const answer = demandeGrande ? Math.max(r1, r2) : Math.min(r1, r2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Terminale) — Équations",
    prompt: `On considère l'équation \\((x ${r1 >= 0 ? "-" : "+"} ${Math.abs(r1)})(x ${r2 >= 0 ? "-" : "+"} ${Math.abs(r2)}) = 0\\). Donne la solution la plus ${demandeGrande ? "grande" : "petite"}.`,
    answer,
    steps: [`S = \\{${r1} ; ${r2}\\}`],
  };
}

const GENERATORS = [
  genTermeSuiteArithmetiqueNumeric,
  genTermeSuiteGeometriqueNumeric,
  genNombreDeriveNumeric,
  genDeriveeTrinomeNumeric,
  genResoudreCarreEgalKNumeric,
  genProbabiliteConditionnelleNumeric,
  genCoordonneesVecteurPlanNumeric,
  genSensVariationExponentielleQCM,
  genCoefficientMultiplicateurGlobalNumeric,
  genEquationProduitNulNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "reviser-les-bases-terminale-spe",
    title: "Réviser les bases",
    description: "Un tour d'horizon des savoir-faire de Première indispensables pour aborder les nouveaux chapitres de Terminale.",
    level: "terminale-spe",
    free: true,
    order: 0,
  },
  generate,
};
