// ---------------------------------------------------------------------------
// Chapitre : Limites de fonctions (Terminale, spécialité mathématiques) —
// sous abonnement.
//
// Correspond au chapitre 5 du programme de spécialité mathématiques de
// terminale : limite d'une fonction rationnelle en \\(\\pm\\infty\\)
// (factorisation par le terme de plus haut degré, asymptote horizontale),
// limite en un point (asymptote verticale), théorème de croissance comparée
// (comparaison de \\(e^x\\) et des puissances de x), opérations sur les
// limites de fonctions (somme, produit, quotient), formes indéterminées,
// théorème des gendarmes pour les fonctions (encadrement par des fonctions
// bornées), lien entre limite et équation d'asymptote.
// La correction du livre du professeur (source .tex, exercices 8-16 de la
// section Auto-évaluation) a servi à identifier la méthode ; les nombres et
// contextes sont générés aléatoirement à chaque tirage.
// Voir automatismes-terminale-spe.js (thème
// "limites-fonctions-terminale-spe") pour les mini-exercices "Calcul
// mental" associés.
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

// ---------- 1. Limite en ±∞ d'une fonction rationnelle (asymptote horizontale) ----------
function genLimiteFonctionRationnelleNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const answer = roundTo(a / b, 4);
  return {
    type: "numeric",
    chapter: "Limites de fonctions — Fonctions rationnelles",
    prompt: `On considère la fonction f définie par \\(f(x) = \\dfrac{${a}x^2 + 3x}{${b}x^2 - 5}\\). Quelle est la limite de f(x) quand x tend vers \\(+\\infty\\) (valeur décimale, arrondie au millième si nécessaire) ?`,
    answer,
    tolerance: 0.001,
    steps: [`f(x) = \\dfrac{x^2(${a} + \\frac{3}{x})}{x^2(${b} - \\frac{5}{x^2})} \\to \\dfrac{${a}}{${b}} = ${fr(answer)}`],
  };
}

// ---------- 2. Limite en +∞ d'une fonction polynomiale ----------
function genLimiteFonctionPolynomialeQCM() {
  const a = nonZero(-9, 9);
  const degre = pick([2, 3, 4]);
  const versMoinsInfini = Math.random() < 0.5;
  const x0 = versMoinsInfini ? "-\\infty" : "+\\infty";
  let reponse;
  if (!versMoinsInfini) {
    reponse = a > 0 ? "+\\infty" : "-\\infty";
  } else {
    const pair = degre % 2 === 0;
    reponse = pair ? (a > 0 ? "+\\infty" : "-\\infty") : (a > 0 ? "-\\infty" : "+\\infty");
  }
  return {
    type: "qcm",
    chapter: "Limites de fonctions — Fonctions polynomiales",
    prompt: `On considère \\(f(x) = ${a}x^{${degre}} - 2x + 1\\). Quelle est la limite de f(x) quand x tend vers \\(${x0}\\) ?`,
    answer: reponse,
    options: ["+\\infty", "-\\infty"],
    steps: [`\\text{En } ${x0}, \\text{ f(x) a même limite que son terme de plus haut degré } ${a}x^{${degre}}.`, `\\text{Limite : } ${reponse}`],
  };
}

// ---------- 3. Croissance comparée (e^x vs puissance de x) ----------
function genCroissanceCompareeQCM() {
  const n = randInt(2, 5);
  const numerateurExp = Math.random() < 0.5;
  const reponse = numerateurExp ? "+\\infty" : "0";
  const expr = numerateurExp ? `\\dfrac{e^x}{x^{${n}}}` : `\\dfrac{x^{${n}}}{e^x}`;
  return {
    type: "qcm",
    chapter: "Limites de fonctions — Croissance comparée",
    prompt: `D'après le théorème de croissance comparée, quelle est la limite de \\(${expr}\\) quand x tend vers \\(+\\infty\\) ?`,
    answer: reponse,
    options: ["+\\infty", "0"],
    steps: [numerateurExp ? "L'exponentielle l'emporte toujours sur les puissances de x : la limite est +\\infty." : "L'exponentielle l'emporte toujours sur les puissances de x au dénominateur : la limite est 0."],
  };
}

// ---------- 4. Asymptote verticale (limite en un point où le dénominateur s'annule) ----------
function genAsymptoteVerticaleNumeric() {
  const a = nonZero(-8, 8);
  return {
    type: "numeric",
    chapter: "Limites de fonctions — Asymptotes",
    prompt: `On considère la fonction f définie par \\(f(x) = \\dfrac{2x+1}{x - ${a}}\\), non définie en x = ${a}. Quelle est l'équation de l'asymptote verticale à la courbe de f (donne la valeur de x) ?`,
    answer: a,
    steps: [`\\text{L'asymptote verticale a pour équation } x = ${a} \\text{ (valeur interdite du dénominateur).}`],
  };
}

// ---------- 5. Théorème des gendarmes pour une fonction ----------
function genTheoremeGendarmesFonctionNumeric() {
  const L = randInt(-8, 8);
  return {
    type: "numeric",
    chapter: "Limites de fonctions — Théorème des gendarmes",
    prompt: `Pour tout réel x strictement positif, on a \\(${L} - \\dfrac{1}{x} \\leqslant f(x) \\leqslant ${L} + \\dfrac{1}{x}\\). D'après le théorème des gendarmes, vers quelle valeur converge f(x) quand x tend vers \\(+\\infty\\) ?`,
    answer: L,
    steps: [`\\lim\\left(${L} - \\dfrac{1}{x}\\right) = \\lim\\left(${L} + \\dfrac{1}{x}\\right) = ${L}`, `\\text{Donc } \\lim_{x \\to +\\infty} f(x) = ${L}`],
  };
}

// ---------- 6. Identifier une forme indéterminée pour des fonctions ----------
function genFormeIndetermineeFonctionQCM() {
  const cas = pick([
    { description: "\\lim_{x \\to +\\infty} f(x) = +\\infty \\text{ et } \\lim_{x \\to +\\infty} g(x) = -\\infty, \\text{ on cherche } \\lim (f+g)", reponse: "Forme indéterminée" },
    { description: "\\lim_{x \\to +\\infty} f(x) = 0 \\text{ et } \\lim_{x \\to +\\infty} g(x) = +\\infty, \\text{ on cherche } \\lim (f \\times g)", reponse: "Forme indéterminée" },
    { description: "\\lim_{x \\to +\\infty} f(x) = +\\infty \\text{ et } \\lim_{x \\to +\\infty} g(x) = 2, \\text{ on cherche } \\lim (f \\times g)", reponse: "Pas de forme indéterminée" },
    { description: "\\lim_{x \\to +\\infty} f(x) = +\\infty \\text{ et } \\lim_{x \\to +\\infty} g(x) = +\\infty, \\text{ on cherche } \\lim \\dfrac{f}{g}", reponse: "Forme indéterminée" },
  ]);
  return {
    type: "qcm",
    chapter: "Limites de fonctions — Opérations sur les limites",
    prompt: `On sait que \\(${cas.description}\\). S'agit-il d'une forme indéterminée ?`,
    answer: cas.reponse,
    options: ["Forme indéterminée", "Pas de forme indéterminée"],
    steps: [cas.reponse],
  };
}

// ---------- 7. Limite d'une somme de fonctions (cas non indéterminé) ----------
function genLimiteSommeFonctionsQCM() {
  const cas = pick([
    { f: "+\\infty", g: "+\\infty", reponse: "+\\infty" },
    { f: "+\\infty", g: "5", reponse: "+\\infty" },
    { f: "-\\infty", g: "-\\infty", reponse: "-\\infty" },
    { f: "-\\infty", g: "-2", reponse: "-\\infty" },
  ]);
  return {
    type: "qcm",
    chapter: "Limites de fonctions — Opérations sur les limites",
    prompt: `On sait que \\(\\lim_{x \\to +\\infty} f(x) = ${cas.f}\\) et \\(\\lim_{x \\to +\\infty} g(x) = ${cas.g}\\). Quelle est la limite de \\(f(x)+g(x)\\) ?`,
    answer: cas.reponse,
    options: ["+\\infty", "-\\infty"],
    steps: [`\\text{Par somme des limites : } ${cas.reponse}`],
  };
}

// ---------- 8. Équation de l'asymptote horizontale ----------
function genEquationAsymptoteHorizontaleNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const answer = roundTo(a / b, 4);
  return {
    type: "numeric",
    chapter: "Limites de fonctions — Asymptotes",
    prompt: `La courbe représentative d'une fonction f admet une asymptote horizontale en \\(+\\infty\\), sachant que \\(\\lim_{x \\to +\\infty} f(x) = \\dfrac{${a}}{${b}}\\). Donne l'ordonnée k de cette asymptote (droite d'équation y = k), arrondie au millième si nécessaire.`,
    answer,
    tolerance: 0.001,
    steps: [`k = \\dfrac{${a}}{${b}} = ${fr(answer)}`],
  };
}

// ---------- 9. Vrai ou faux sur les limites et asymptotes ----------
function genVraiFauxLimitesQCM() {
  const cas = pick([
    { description: "Si f(x) tend vers +∞ en +∞ et g(x) tend vers 0 en +∞, alors f(x)×g(x) tend nécessairement vers 0.", reponse: "Faux" },
    { description: "Une fonction rationnelle a, en +∞ et -∞, la même limite que le quotient des termes de plus haut degré du numérateur et du dénominateur.", reponse: "Vrai" },
    { description: "e^x l'emporte toujours sur x^n quand x tend vers +∞, quel que soit l'entier n.", reponse: "Vrai" },
    { description: "Si une courbe admet une asymptote horizontale, elle ne peut jamais la croiser.", reponse: "Faux" },
    { description: "Une asymptote verticale correspond à une limite infinie de la fonction en un point.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Limites de fonctions — Asymptotes",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse === "Vrai" ? "Cette affirmation est correcte." : "Cette affirmation est incorrecte."],
  };
}

// ---------- 10. Limite de sin(x)/x ou cos(x)/x en ±∞ (gendarmes avec fonction bornée) ----------
function genLimiteFonctionBorneeSurXQCM() {
  const fonction = pick(["\\sin", "\\cos"]);
  return {
    type: "qcm",
    chapter: "Limites de fonctions — Théorème des gendarmes",
    prompt: `Quelle est la limite de \\(\\dfrac{${fonction}(x)}{x}\\) quand x tend vers \\(+\\infty\\) ?`,
    answer: "0",
    options: ["0", "N'existe pas"],
    steps: [`\\text{Pour tout } x > 0, \\ -\\dfrac{1}{x} \\leqslant \\dfrac{${fonction}(x)}{x} \\leqslant \\dfrac{1}{x}`, `\\text{Les deux bornes tendent vers 0 : d'après le théorème des gendarmes, la limite est 0.}`],
  };
}

// ---------- 11. Comparer les vitesses de croissance ----------
function genComparerVitessesCroissanceQCM() {
  const n = randInt(2, 6);
  return {
    type: "qcm",
    chapter: "Limites de fonctions — Croissance comparée",
    prompt: `Parmi \\(e^x\\) et \\(x^{${n}}\\), laquelle de ces deux expressions "l'emporte" quand x tend vers \\(+\\infty\\) (c'est-à-dire que le rapport de l'une sur l'autre tend vers \\(+\\infty\\)) ?`,
    answer: "e^x",
    options: ["e^x", `x^{${n}}`],
    steps: [`\\text{D'après le théorème de croissance comparée, l'exponentielle l'emporte toujours sur les puissances de x.}`],
  };
}

// ---------- 12. Limite d'un produit de fonctions (cas non indéterminé) ----------
function genLimiteProduitFonctionsQCM() {
  const cas = pick([
    { f: "+\\infty", g: "+\\infty", reponse: "+\\infty" },
    { f: "+\\infty", g: "-\\infty", reponse: "-\\infty" },
    { f: "-\\infty", g: "-\\infty", reponse: "+\\infty" },
    { f: "+\\infty", g: "3", reponse: "+\\infty" },
  ]);
  return {
    type: "qcm",
    chapter: "Limites de fonctions — Opérations sur les limites",
    prompt: `On sait que \\(\\lim_{x \\to +\\infty} f(x) = ${cas.f}\\) et \\(\\lim_{x \\to +\\infty} g(x) = ${cas.g}\\). Quelle est la limite de \\(f(x) \\times g(x)\\) ?`,
    answer: cas.reponse,
    options: ["+\\infty", "-\\infty"],
    steps: [`\\text{Par produit des limites (règle des signes) : } ${cas.reponse}`],
  };
}

// ---------- 13. Limite d'un quotient de fonctions (cas non indéterminé) ----------
function genLimiteQuotientFonctionsQCM() {
  const cas = pick([
    { f: "+\\infty", g: "2", reponse: "+\\infty" },
    { f: "5", g: "+\\infty", reponse: "0" },
    { f: "-\\infty", g: "3", reponse: "-\\infty" },
    { f: "4", g: "-\\infty", reponse: "0" },
  ]);
  return {
    type: "qcm",
    chapter: "Limites de fonctions — Opérations sur les limites",
    prompt: `On sait que \\(\\lim_{x \\to +\\infty} f(x) = ${cas.f}\\) et \\(\\lim_{x \\to +\\infty} g(x) = ${cas.g}\\). Quelle est la limite de \\(\\dfrac{f(x)}{g(x)}\\) ?`,
    answer: cas.reponse,
    options: ["+\\infty", "0", "-\\infty"],
    steps: [`\\text{Par quotient des limites : } ${cas.reponse}`],
  };
}

// ---------- 14. Limites à gauche et à droite différentes en une asymptote verticale ----------
function genLimitesGaucheDroiteQCM() {
  const positif = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Limites de fonctions — Asymptotes",
    prompt: `Une fonction f a pour asymptote verticale la droite d'équation x = 2. On sait que le dénominateur de f s'annule et change de signe en x = 2, et que le numérateur est ${positif ? "positif" : "négatif"} au voisinage de 2. Quelle est la limite de f(x) quand x tend vers \\(2^+\\) (par valeurs supérieures, où le dénominateur est positif) ?`,
    answer: positif ? "+\\infty" : "-\\infty",
    options: ["+\\infty", "-\\infty"],
    steps: [positif ? "Numérateur positif, dénominateur positif : le quotient tend vers +\\infty." : "Numérateur négatif, dénominateur positif : le quotient tend vers -\\infty."],
  };
}

// ---------- 15. Contre-exemple sur une propriété fausse des limites ----------
function genContreExempleQCM() {
  const cas = pick([
    { description: "Si f(x) tend vers +∞ et g(x) tend vers +∞, alors f(x) - g(x) tend vers 0.", reponse: "Faux (forme indéterminée ∞-∞, le résultat dépend des fonctions)" },
    { description: "Si f(x) < g(x) pour tout x et que f et g tendent vers l en +∞, alors on peut avoir des inégalités strictes qui deviennent des égalités à la limite.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Limites de fonctions — Opérations sur les limites",
    prompt: `Affirmation : « ${cas.description} » Cette affirmation est-elle vraie ou fausse ?`,
    answer: cas.reponse.startsWith("Vrai") ? "Vrai" : "Faux",
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

const GENERATORS = [
  genLimiteFonctionRationnelleNumeric,
  genLimiteFonctionPolynomialeQCM,
  genCroissanceCompareeQCM,
  genAsymptoteVerticaleNumeric,
  genTheoremeGendarmesFonctionNumeric,
  genFormeIndetermineeFonctionQCM,
  genLimiteSommeFonctionsQCM,
  genEquationAsymptoteHorizontaleNumeric,
  genVraiFauxLimitesQCM,
  genLimiteFonctionBorneeSurXQCM,
  genComparerVitessesCroissanceQCM,
  genLimiteProduitFonctionsQCM,
  genLimiteQuotientFonctionsQCM,
  genLimitesGaucheDroiteQCM,
  genContreExempleQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "limites-fonctions-terminale-spe",
    title: "Limites de fonctions",
    description: "Limites de fonctions rationnelles et polynomiales en ±∞, croissance comparée, asymptotes horizontales et verticales, opérations sur les limites, formes indéterminées, théorème des gendarmes.",
    level: "terminale-spe",
    free: false,
    order: 6,
  },
  generate,
};
