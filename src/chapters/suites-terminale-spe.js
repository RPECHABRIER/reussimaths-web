// ---------------------------------------------------------------------------
// Chapitre : Suites (Terminale, spécialité mathématiques) — sous
// abonnement.
//
// Correspond au chapitre 4 du programme de spécialité mathématiques de
// terminale : limite d'une suite géométrique selon la valeur de sa raison,
// limites de suites polynomiales et de quotients (factorisation par le
// terme de plus haut degré), opérations sur les limites (somme, produit,
// quotient), identification des formes indéterminées, théorèmes de
// comparaison et des gendarmes, suites majorées/minorées/bornées, étude des
// suites arithmético-géométriques (point fixe, changement de suite
// auxiliaire géométrique), principe du raisonnement par récurrence.
// La correction du livre du professeur (source .tex, exercices 8-16 de la
// section Auto-évaluation, et exercices 17-20 de "Travailler les
// automatismes") a servi à identifier la méthode ; les nombres et contextes
// sont générés aléatoirement à chaque tirage.
// Voir automatismes-terminale-spe.js (thème "suites-terminale-spe") pour
// les mini-exercices "Calcul mental" associés.
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

// ---------- 1. Limite d'une suite géométrique q^n selon la raison ----------
function genLimiteSuiteGeometriqueQCM() {
  const cas = pick([
    { q: 2, texte: "2", reponse: "+\\infty" },
    { q: 1.5, texte: "1{,}5", reponse: "+\\infty" },
    { q: 3, texte: "3", reponse: "+\\infty" },
    { q: 0.5, texte: "0{,}5", reponse: "0" },
    { q: 0.2, texte: "0{,}2", reponse: "0" },
    { q: 0.9, texte: "0{,}9", reponse: "0" },
    { q: 1, texte: "1", reponse: "1" },
    { q: -0.5, texte: "-0{,}5", reponse: "0" },
  ]);
  return {
    type: "qcm",
    chapter: "Suites — Limites",
    prompt: `On considère la suite géométrique \\(u_n = ${cas.texte}^n\\). Quelle est la limite de \\(u_n\\) quand n tend vers \\(+\\infty\\) ?`,
    answer: cas.reponse,
    options: ["+\\infty", "0", "1"],
    steps: [`q = ${cas.texte}`, cas.q > 1 ? "q > 1 : la suite diverge vers +\\infty." : cas.q === 1 ? "q = 1 : la suite est constante égale à 1." : "-1 < q < 1 : la suite converge vers 0."],
  };
}

// ---------- 2. Limite d'une suite polynomiale (terme de plus haut degré) ----------
function genLimiteSuitePolynomialeQCM() {
  const a = nonZero(-9, 9);
  const degre = pick([2, 3]);
  const reponse = a > 0 ? "+\\infty" : "-\\infty";
  return {
    type: "qcm",
    chapter: "Suites — Limites",
    prompt: `On considère la suite définie par \\(u_n = ${a}n^{${degre}} + 5n - 3\\). En factorisant par le terme de plus haut degré, quelle est la limite de \\(u_n\\) quand n tend vers \\(+\\infty\\) ?`,
    answer: reponse,
    options: ["+\\infty", "-\\infty"],
    steps: [`u_n = n^{${degre}}\\left(${a} + \\dfrac{5}{n^{${degre - 1}}} - \\dfrac{3}{n^{${degre}}}\\right)`, `\\text{Le terme entre parenthèses tend vers } ${a}, \\text{ et } n^{${degre}} \\to +\\infty`, `\\text{Par produit, la limite est } ${reponse}`],
  };
}

// ---------- 3. Limite d'un quotient de polynômes de même degré ----------
function genLimiteQuotientMemeDegreNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const answer = roundTo(a / b, 4);
  return {
    type: "numeric",
    chapter: "Suites — Limites",
    prompt: `On considère la suite définie par \\(u_n = \\dfrac{${a}n + 7}{${b}n - 2}\\). Quelle est la limite de \\(u_n\\) quand n tend vers \\(+\\infty\\) (valeur décimale, arrondie au millième si nécessaire) ?`,
    answer,
    tolerance: 0.001,
    steps: [`u_n = \\dfrac{n(${a} + \\frac{7}{n})}{n(${b} - \\frac{2}{n})} = \\dfrac{${a} + \\frac{7}{n}}{${b} - \\frac{2}{n}} \\to \\dfrac{${a}}{${b}} = ${fr(answer)}`],
  };
}

// ---------- 4. Identifier une forme indéterminée ----------
function genIdentifierFormeIndetermineeQCM() {
  const cas = pick([
    { description: "\\lim u_n = +\\infty \\text{ et } \\lim v_n = -\\infty, \\text{ on cherche } \\lim (u_n + v_n)", reponse: "Forme indéterminée" },
    { description: "\\lim u_n = +\\infty \\text{ et } \\lim v_n = 3, \\text{ on cherche } \\lim (u_n + v_n)", reponse: "Pas de forme indéterminée" },
    { description: "\\lim u_n = 0 \\text{ et } \\lim v_n = +\\infty, \\text{ on cherche } \\lim (u_n \\times v_n)", reponse: "Forme indéterminée" },
    { description: "\\lim u_n = +\\infty \\text{ et } \\lim v_n = +\\infty, \\text{ on cherche } \\lim \\dfrac{u_n}{v_n}", reponse: "Forme indéterminée" },
    { description: "\\lim u_n = 2 \\text{ et } \\lim v_n = 5, \\text{ on cherche } \\lim \\dfrac{u_n}{v_n}", reponse: "Pas de forme indéterminée" },
    { description: "\\lim u_n = +\\infty \\text{ et } \\lim v_n = +\\infty, \\text{ on cherche } \\lim (u_n \\times v_n)", reponse: "Pas de forme indéterminée" },
  ]);
  return {
    type: "qcm",
    chapter: "Suites — Limites",
    prompt: `On sait que \\(${cas.description}\\). S'agit-il d'une forme indéterminée ?`,
    answer: cas.reponse,
    options: ["Forme indéterminée", "Pas de forme indéterminée"],
    steps: [cas.reponse === "Forme indéterminée" ? "Les théorèmes usuels sur les limites ne permettent pas de conclure directement." : "Les théorèmes usuels sur les limites permettent de conclure directement."],
  };
}

// ---------- 5. Théorème de comparaison (divergence) ----------
function genTheoremeComparaisonQCM() {
  const minoree = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Suites — Théorèmes de convergence",
    prompt: minoree
      ? "Pour tout entier naturel n, on a \\(u_n \\geqslant v_n\\), et \\(\\lim v_n = +\\infty\\). Que peut-on dire de la limite de \\(u_n\\) ?"
      : "Pour tout entier naturel n, on a \\(u_n \\leqslant v_n\\), et \\(\\lim v_n = -\\infty\\). Que peut-on dire de la limite de \\(u_n\\) ?",
    answer: minoree ? "\\lim u_n = +\\infty" : "\\lim u_n = -\\infty",
    options: ["\\lim u_n = +\\infty", "\\lim u_n = -\\infty"],
    steps: [minoree ? "D'après le théorème de comparaison, u_n est minorée par une suite qui tend vers +∞, donc u_n tend vers +∞." : "D'après le théorème de comparaison, u_n est majorée par une suite qui tend vers -∞, donc u_n tend vers -∞."],
  };
}

// ---------- 6. Théorème des gendarmes ----------
function genTheoremeGendarmesNumeric() {
  const L = randInt(-8, 8);
  return {
    type: "numeric",
    chapter: "Suites — Théorèmes de convergence",
    prompt: `Pour tout entier naturel n non nul, on a \\(${L} - \\dfrac{1}{n} \\leqslant u_n \\leqslant ${L} + \\dfrac{1}{n}\\). D'après le théorème des gendarmes, vers quelle valeur converge la suite \\((u_n)\\) ?`,
    answer: L,
    steps: [`\\lim\\left(${L} - \\dfrac{1}{n}\\right) = \\lim\\left(${L} + \\dfrac{1}{n}\\right) = ${L}`, `\\text{Donc } \\lim u_n = ${L}`],
  };
}

// ---------- 7. Point fixe d'une suite arithmético-géométrique ----------
function genPointFixeNumeric() {
  const aClean = pick([0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 0.25, 0.2, 0.4]);
  const L = randInt(2, 200);
  const b = roundTo(L * (1 - aClean), 4);
  return {
    type: "numeric",
    chapter: "Suites — Suites arithmético-géométriques",
    prompt: `Une suite u vérifie, pour tout entier naturel n, \\(u_{n+1} = ${fr(aClean)}u_n + ${fr(b)}\\). Calcule le point fixe L de cette relation, c'est-à-dire la solution de l'équation \\(L = ${fr(aClean)}L + ${fr(b)}\\).`,
    answer: L,
    tolerance: 0.01,
    steps: [`L(1 - ${fr(aClean)}) = ${fr(b)}`, `L = \\dfrac{${fr(b)}}{${fr(roundTo(1 - aClean, 4))}} = ${L}`],
  };
}

// ---------- 8. Raison de la suite auxiliaire géométrique v_n = u_n - L ----------
function genRaisonSuiteAuxiliaireNumeric() {
  const a = pick([0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 0.25, 0.2, 0.4, 1.2, 1.5, 2]);
  const b = randInt(-20, 20);
  return {
    type: "numeric",
    chapter: "Suites — Suites arithmético-géométriques",
    prompt: `Une suite u vérifie, pour tout entier naturel n, \\(u_{n+1} = ${fr(a)}u_n ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). On pose \\(v_n = u_n - L\\) où L est le point fixe de la relation. Quelle est la raison de la suite géométrique \\((v_n)\\) ?`,
    answer: a,
    tolerance: 0.001,
    steps: [`\\text{La suite auxiliaire } (v_n) \\text{ a pour raison le coefficient de } u_n, \\text{ soit } ${fr(a)}`],
  };
}

// ---------- 9. Limite d'une suite arithmético-géométrique convergente ----------
function genLimiteSuiteArithmeticoGeometriqueNumeric() {
  const a = pick([0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 0.25, 0.2, 0.4, -0.5, -0.3]);
  const L = randInt(-15, 15);
  return {
    type: "numeric",
    chapter: "Suites — Suites arithmético-géométriques",
    prompt: `Une suite u est telle que \\(u_n = L + (u_0 - L) \\times ${fr(a)}^n\\) avec \\(L = ${L}\\). Sachant que \\(-1 < ${fr(a)} < 1\\), calcule la limite de \\(u_n\\) quand n tend vers \\(+\\infty\\).`,
    answer: L,
    steps: [`${fr(a)}^n \\to 0 \\text{ car } -1 < ${fr(a)} < 1`, `\\text{Donc } u_n \\to ${L}`],
  };
}

// ---------- 10. Vrai ou faux sur les suites convergentes/monotones/bornées ----------
function genVraiFauxConvergenceQCM() {
  const cas = pick([
    { description: "Une suite convergente est nécessairement bornée.", reponse: "Vrai" },
    { description: "Une suite bornée est nécessairement convergente.", reponse: "Faux" },
    { description: "Une suite croissante et majorée converge.", reponse: "Vrai" },
    { description: "Une suite qui converge vers 1 est nécessairement croissante.", reponse: "Faux" },
    { description: "Une suite décroissante et minorée converge.", reponse: "Vrai" },
    { description: "Si deux suites u et v vérifient u_n ⩽ v_n pour tout n et convergent, alors leurs limites vérifient la même inégalité.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Suites — Théorèmes de convergence",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse === "Vrai" ? "Cette affirmation est correcte." : "Cette affirmation est incorrecte."],
  };
}

// ---------- 11. Limite d'une somme de deux suites (cas non indéterminé) ----------
function genLimiteSommeQCM() {
  const cas = pick([
    { u: "+\\infty", v: "+\\infty", reponse: "+\\infty" },
    { u: "+\\infty", v: "5", reponse: "+\\infty" },
    { u: "-\\infty", v: "-\\infty", reponse: "-\\infty" },
    { u: "-\\infty", v: "-2", reponse: "-\\infty" },
  ]);
  return {
    type: "qcm",
    chapter: "Suites — Limites",
    prompt: `On sait que \\(\\lim u_n = ${cas.u}\\) et \\(\\lim v_n = ${cas.v}\\). Quelle est la limite de \\(u_n + v_n\\) ?`,
    answer: cas.reponse,
    options: ["+\\infty", "-\\infty"],
    steps: [`\\text{Par somme des limites, } \\lim(u_n+v_n) = ${cas.reponse}`],
  };
}

// ---------- 12. Suite majorée / minorée (vérification simple) ----------
function genSuiteMajoreeQCM() {
  const M = randInt(1, 10);
  const majoree = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Suites — Théorèmes de convergence",
    prompt: `Une suite u vérifie, pour tout entier naturel n, \\(u_n = ${M} - \\dfrac{1}{n+1}\\). Cette suite est-elle majorée par ${M} ?`,
    answer: "Oui",
    options: ["Oui", "Non"],
    steps: [`\\text{Pour tout } n, \\ \\dfrac{1}{n+1} > 0 \\text{ donc } u_n < ${M} : \\text{la suite est bien majorée par } ${M}.`],
  };
}

// ---------- 13. Étapes du raisonnement par récurrence ----------
function genEtapesRecurrenceQCM() {
  const etape = pick(["initialisation", "hérédité", "conclusion"]);
  const descriptions = {
    initialisation: "On vérifie que la propriété est vraie pour le premier rang (par exemple n = 0).",
    hérédité: "On suppose la propriété vraie à un rang n quelconque et on démontre qu'elle est encore vraie au rang n+1.",
    conclusion: "On déduit, grâce au principe de récurrence, que la propriété est vraie pour tout entier n à partir du rang initial.",
  };
  return {
    type: "qcm",
    chapter: "Suites — Raisonnement par récurrence",
    prompt: `Dans un raisonnement par récurrence : « ${descriptions[etape]} ». À quelle étape du raisonnement cela correspond-il ?`,
    answer: etape,
    options: ["initialisation", "hérédité", "conclusion"],
    steps: [`\\text{Il s'agit de l'étape : ${etape}}`],
  };
}

// ---------- 14. Calcul d'un terme via une relation de récurrence (rappel) ----------
function genCalculerTermeRecurrenceNumeric() {
  const a = pick([2, 3, 0.5]);
  const b = randInt(-10, 10);
  const un = randInt(-10, 10);
  const answer = roundTo(a * un + b, 4);
  return {
    type: "numeric",
    chapter: "Suites — Raisonnement par récurrence",
    prompt: `Une suite u vérifie, pour tout entier naturel n, \\(u_{n+1} = ${fr(a)}u_n ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Sachant que \\(u_n = ${un}\\), calcule \\(u_{n+1}\\).`,
    answer,
    tolerance: 0.001,
    steps: [`${fr(a)} \\times ${un} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${fr(answer)}`],
  };
}

// ---------- 15. Limite d'un produit avec une suite tendant vers 0 ----------
function genLimiteProduitVersZeroQCM() {
  const borne = pick(["majorée", "bornée"]);
  return {
    type: "qcm",
    chapter: "Suites — Limites",
    prompt: `On sait que \\(\\lim u_n = 0\\) et que la suite v est ${borne} (ses valeurs restent comprises entre deux réels fixes). Quelle est la limite de \\(u_n \\times v_n\\) ?`,
    answer: "0",
    options: ["0", "On ne peut pas conclure"],
    steps: ["Le produit d'une suite qui tend vers 0 par une suite bornée tend vers 0 (théorème des gendarmes appliqué à |u_n × v_n|)."],
  };
}

const GENERATORS = [
  genLimiteSuiteGeometriqueQCM,
  genLimiteSuitePolynomialeQCM,
  genLimiteQuotientMemeDegreNumeric,
  genIdentifierFormeIndetermineeQCM,
  genTheoremeComparaisonQCM,
  genTheoremeGendarmesNumeric,
  genPointFixeNumeric,
  genRaisonSuiteAuxiliaireNumeric,
  genLimiteSuiteArithmeticoGeometriqueNumeric,
  genVraiFauxConvergenceQCM,
  genLimiteSommeQCM,
  genSuiteMajoreeQCM,
  genEtapesRecurrenceQCM,
  genCalculerTermeRecurrenceNumeric,
  genLimiteProduitVersZeroQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "suites-terminale-spe",
    title: "Suites",
    description: "Limites de suites (géométriques, polynomiales, quotients), formes indéterminées, théorèmes de comparaison et des gendarmes, suites arithmético-géométriques, raisonnement par récurrence.",
    level: "terminale-spe",
    free: false,
    order: 5,
  },
  generate,
};
