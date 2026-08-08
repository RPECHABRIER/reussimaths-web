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
    steps: [
      { type: "regle", text: `\\text{Limite de } q^n \\text{ : si } q>1, \\text{ elle tend vers } +\\infty ; \\text{ si } q=1, \\text{ elle est constante égale à 1 ; si } -1<q<1, \\text{ elle tend vers 0.}` },
      { type: "donnee", text: `q = ${cas.texte}` },
      { type: "resultat", text: cas.q > 1 ? "q > 1 : la suite diverge vers +\\infty." : cas.q === 1 ? "q = 1 : la suite est constante égale à 1." : "-1 < q < 1 : la suite converge vers 0." },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Pour une limite de suite polynomiale en } +\\infty, \\text{ on factorise par le terme de plus haut degré.}` },
      { type: "calcul", text: `u_n = n^{${degre}}\\left(${a} + \\dfrac{5}{n^{${degre - 1}}} - \\dfrac{3}{n^{${degre}}}\\right)` },
      { type: "donnee", text: `\\text{Le terme entre parenthèses tend vers } ${a}, \\text{ et } n^{${degre}} \\to +\\infty` },
      { type: "resultat", text: `\\text{Par produit, la limite est } ${reponse}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Pour un quotient de polynômes de même degré, on factorise numérateur et dénominateur par } n \\text{ (le terme de plus haut degré), puis on simplifie.}` },
      { type: "resultat", text: `u_n = \\dfrac{n(${a} + \\frac{7}{n})}{n(${b} - \\frac{2}{n})} = \\dfrac{${a} + \\frac{7}{n}}{${b} - \\frac{2}{n}} \\to \\dfrac{${a}}{${b}} = ${fr(answer)}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Les quatre formes indéterminées à connaître : } "\\infty - \\infty", \\ "0 \\times \\infty", \\ \\dfrac{\\infty}{\\infty}, \\ \\dfrac{0}{0}.` },
      { type: "resultat", text: cas.reponse === "Forme indéterminée" ? "Les théorèmes usuels sur les limites ne permettent pas de conclure directement." : "Les théorèmes usuels sur les limites permettent de conclure directement." },
    ],
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
    steps: [{ type: "regle", text: minoree ? "D'après le théorème de comparaison, u_n est minorée par une suite qui tend vers +∞, donc u_n tend vers +∞." : "D'après le théorème de comparaison, u_n est majorée par une suite qui tend vers -∞, donc u_n tend vers -∞." }],
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
    steps: [
      { type: "regle", text: `\\text{Théorème des gendarmes : si } u_n \\text{ est encadrée par deux suites qui convergent vers la même limite, alors } u_n \\text{ converge vers cette même limite.}` },
      { type: "donnee", text: `\\lim\\left(${L} - \\dfrac{1}{n}\\right) = \\lim\\left(${L} + \\dfrac{1}{n}\\right) = ${L}` },
      { type: "resultat", text: `\\text{Donc } \\lim u_n = ${L}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Le point fixe L vérifie } L = ${fr(aClean)}L + ${fr(b)} \\text{ : on regroupe les termes en L d'un côté.}` },
      { type: "calcul", text: `L(1 - ${fr(aClean)}) = ${fr(b)}` },
      { type: "resultat", text: `L = \\dfrac{${fr(b)}}{${fr(roundTo(1 - aClean, 4))}} = ${L}` },
    ],
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
    steps: [{ type: "regle", text: `\\text{La suite auxiliaire } (v_n) \\text{ a pour raison le coefficient de } u_n, \\text{ soit } ${fr(a)}` }],
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
    steps: [
      { type: "donnee", text: `${fr(a)}^n \\to 0 \\text{ car } -1 < ${fr(a)} < 1` },
      { type: "resultat", text: `\\text{Donc } u_n \\to ${L}` },
    ],
  };
}

// ---------- 10. Vrai ou faux sur les suites convergentes/monotones/bornées ----------
function genVraiFauxConvergenceQCM() {
  const cas = pick([
    { description: "Une suite convergente est nécessairement bornée.", reponse: "Vrai", explication: "C'est vrai : si (u_n) converge vers L, alors à partir d'un certain rang tous les termes restent proches de L (dans un intervalle fixé), et il n'y a qu'un nombre fini de termes avant ce rang. La suite est donc bornée." },
    { description: "Une suite bornée est nécessairement convergente.", reponse: "Faux", explication: "C'est faux : par exemple u_n = (-1)^n est bornée (toujours entre -1 et 1) mais elle oscille sans jamais se stabiliser autour d'une valeur, elle ne converge pas." },
    { description: "Une suite croissante et majorée converge.", reponse: "Vrai", explication: "C'est vrai : c'est le théorème de convergence monotone du cours — une suite croissante et majorée converge nécessairement (vers sa borne supérieure)." },
    { description: "Une suite qui converge vers 1 est nécessairement croissante.", reponse: "Faux", explication: "C'est faux : par exemple la suite u_n = 1 + (-1)^n/n converge vers 1 mais n'est pas croissante (elle oscille de part et d'autre de 1 en se rapprochant)." },
    { description: "Une suite décroissante et minorée converge.", reponse: "Vrai", explication: "C'est vrai : c'est le théorème de convergence monotone appliqué au cas décroissant — une suite décroissante et minorée converge (vers sa borne inférieure)." },
    { description: "Si deux suites u et v vérifient u_n ⩽ v_n pour tout n et convergent, alors leurs limites vérifient la même inégalité.", reponse: "Vrai", explication: "C'est vrai : le passage à la limite conserve les inégalités larges. Attention cependant : une inégalité stricte entre u_n et v_n peut devenir une égalité entre les limites." },
  ]);
  return {
    type: "qcm",
    chapter: "Suites — Théorèmes de convergence",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
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
    steps: [{ type: "resultat", text: `\\text{Par somme des limites, } \\lim(u_n+v_n) = ${cas.reponse}` }],
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
    steps: [{ type: "resultat", text: `\\text{Pour tout } n, \\ \\dfrac{1}{n+1} > 0 \\text{ donc } u_n < ${M} : \\text{la suite est bien majorée par } ${M}.` }],
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
    steps: [
      { type: "regle", text: `\\text{Un raisonnement par récurrence comporte 3 étapes : l'initialisation (vérifier le premier rang), l'hérédité (montrer que le rang n implique le rang n+1), et la conclusion (invoquer le principe de récurrence).}` },
      { type: "resultat", text: `\\text{Il s'agit de l'étape : ${etape}}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{On calcule } u_{n+1} \\text{ en remplaçant } u_n \\text{ par sa valeur dans la relation de récurrence.}` },
      { type: "resultat", text: `${fr(a)} \\times ${un} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${fr(answer)}` },
    ],
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
    steps: [{ type: "regle", text: "Le produit d'une suite qui tend vers 0 par une suite bornée tend vers 0 (théorème des gendarmes appliqué à |u_n × v_n|)." }],
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

const DIFFICULTY = {
  genLimiteSuiteGeometriqueQCM: "facile",
  genLimiteSuitePolynomialeQCM: "facile",
  genLimiteSommeQCM: "facile",
  genSuiteMajoreeQCM: "facile",
  genCalculerTermeRecurrenceNumeric: "facile",
  genLimiteProduitVersZeroQCM: "facile",
  genLimiteQuotientMemeDegreNumeric: "standard",
  genTheoremeComparaisonQCM: "standard",
  genPointFixeNumeric: "standard",
  genVraiFauxConvergenceQCM: "standard",
  genEtapesRecurrenceQCM: "standard",
  genIdentifierFormeIndetermineeQCM: "expert",
  genTheoremeGendarmesNumeric: "expert",
  genRaisonSuiteAuxiliaireNumeric: "expert",
  genLimiteSuiteArithmeticoGeometriqueNumeric: "expert",
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
    id: "suites-terminale-spe",
    title: "Suites",
    description: "Limites de suites (géométriques, polynomiales, quotients), formes indéterminées, théorèmes de comparaison et des gendarmes, suites arithmético-géométriques, raisonnement par récurrence.",
    pourquoi: "Étudier la limite d'une suite, c'est prévoir ce qui se passe à très long terme — un capital, une population, un algorithme qui converge.",
    level: "terminale-spe",
    free: false,
    order: 5,
    cours: {
      mindMap: {
        title: "Suites",
        branches: [
          {
            title: "Limite d'une suite géométrique",
            items: [
              "-1 < q < 1 : \\(q^n\\) tend vers 0. q > 1 : \\(q^n\\) tend vers \\(+\\infty\\). \\(q \\leqslant -1\\) : pas de limite.",
            ],
          },
          {
            title: "Formes indéterminées",
            items: [
              "\\(\\infty-\\infty\\), \\(\\frac{\\infty}{\\infty}\\), \\(0\\times\\infty\\), \\(\\frac{0}{0}\\) : il faut transformer l'écriture avant de conclure.",
              "Piège classique : pour un quotient de polynômes, factoriser par le terme de plus haut degré au numérateur et au dénominateur.",
            ],
          },
          {
            title: "Comparaison et théorème des gendarmes",
            items: [
              "Si \\(u_n \\leqslant v_n\\) et \\(u_n \\to +\\infty\\), alors \\(v_n \\to +\\infty\\) (comparaison).",
              "Si \\(u_n \\leqslant v_n \\leqslant w_n\\) et \\(u_n, w_n \\to \\ell\\), alors \\(v_n \\to \\ell\\) (gendarmes).",
            ],
          },
          {
            title: "Suites arithmético-géométriques",
            items: [
              "\\(u_{n+1}=au_n+b\\) : chercher le point fixe \\(\\ell=a\\ell+b\\), puis poser \\(v_n=u_n-\\ell\\) pour obtenir une suite géométrique.",
            ],
          },
          {
            title: "Raisonnement par récurrence",
            items: [
              "Trois étapes : initialisation (vérifier au premier rang), hérédité (si vrai au rang n, vrai au rang n+1), conclusion.",
              "Piège classique : oublier l'initialisation, ou ne pas utiliser l'hypothèse de récurrence dans l'étape d'hérédité.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
