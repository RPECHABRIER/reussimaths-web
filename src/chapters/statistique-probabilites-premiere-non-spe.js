// ---------------------------------------------------------------------------
// Chapitre : De la statistique aux probabilités (Première, enseignement
// mathématique non spé) — sous abonnement.
//
// NOTE (audit programme 2026, M2) : ajout du volet quantitatif des
// statistiques à deux variables, absent jusqu'ici (seule la corrélation
// qualitative/narrative était traitée, dans
// analyse-information-chiffree-premiere-non-spe.js) : point moyen
// G(x̄ ; ȳ) d'un nuage de points, droite d'ajustement (méthode des points
// extrêmes) et prédiction par extrapolation à partir de cette droite.
//
// Correspond au chapitre 2 du programme d'enseignement mathématique de
// première (non spécialité) : fréquences marginales et conditionnelles
// depuis un tableau croisé d'effectifs, probabilité conditionnelle P_A(B),
// indépendance de deux événements (comparaison P(B) / P_A(B)), calcul de
// P(A∩B) par produit, arbres pondérés (calcul d'une probabilité manquante
// sur une branche, calcul de la probabilité d'un chemin, formule des
// probabilités totales), répétition d'expériences identiques et
// indépendantes (tirages avec remise), probabilité de "au moins un" par
// passage au contraire, point moyen et droite d'ajustement d'un nuage de
// points, prédiction par extrapolation.
// La correction du livre du professeur (source .tex, exercices 7-23 :
// Automatismes méthodes 1-4 sur les fréquences/probabilités conditionnelles,
// l'indépendance et les arbres pondérés) a servi à identifier la méthode ;
// les nombres et contextes sont générés aléatoirement à chaque tirage.
// Voir automatismes-premiere-non-spe.js (thème
// "statistique-probabilites-premiere-non-spe") pour les mini-exercices
// "Calcul mental" associés.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// ---------------------------------------------------------------------------

import { texTable } from "../utils/texTable.js";

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

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

// Construit un tableau croisé 2x2 cohérent : lignes L1/L2, colonnes C1/C2.
function tableauCroise2x2() {
  const a = randInt(5, 40);
  const b = randInt(5, 40);
  const c = randInt(5, 40);
  const d = randInt(5, 40);
  return {
    a, b, c, d,
    totalL1: a + b,
    totalL2: c + d,
    totalC1: a + c,
    totalC2: b + d,
    total: a + b + c + d,
  };
}

// Construit un tableau croisé 2x2 en LaTeX propre via texTable() — évite tout
// débordement du cadre de l'exercice (même précédent que dans
// analyse-information-chiffree-premiere-non-spe.js et informations-chiffrees-seconde.js).
function buildTableauCroiseTex(t, rowNames, colNames, { hidden = null, includeTotals = false } = {}) {
  const cell = (key, val) => (hidden === key ? "?" : String(val));
  const header = ["", `\\text{${colNames[0]}}`, `\\text{${colNames[1]}}`, ...(includeTotals ? ["\\text{Total}"] : [])];
  const row1 = [rowNames[0], cell("a", t.a), cell("b", t.b), ...(includeTotals ? [String(t.totalL1)] : [])];
  const row2 = [rowNames[1], cell("c", t.c), cell("d", t.d), ...(includeTotals ? [String(t.totalL2)] : [])];
  const rows = [header, row1, row2];
  if (includeTotals) rows.push(["Total", String(t.totalC1), String(t.totalC2), String(t.total)]);
  return texTable(rows);
}

const CONTEXTES_TABLEAU = [
  { ligne: "Fille", ligne2: "Garçon", colonne: "Espagnol", colonne2: "Allemand", sujet: "les élèves d'une classe" },
  { ligne: "Femme", ligne2: "Homme", colonne: "Souhaite participer", colonne2: "Ne souhaite pas participer", sujet: "les membres d'un club" },
  { ligne: "Externe", ligne2: "Demi-pensionnaire", colonne: "Garçon", colonne2: "Fille", sujet: "les élèves d'un collège" },
  { ligne: "Bureaux", ligne2: "Logement", colonne: "Climatisé", colonne2: "Non climatisé", sujet: "les bâtiments d'une résidence" },
];

// ---------- 1. Fréquence marginale (ligne ou colonne) depuis un tableau croisé ----------
function genFrequenceMarginaleNumeric() {
  const ctx = pick(CONTEXTES_TABLEAU);
  const t = tableauCroise2x2();
  const surLigne = Math.random() < 0.5;
  const nom = surLigne ? ctx.ligne : ctx.colonne;
  const effectif = surLigne ? t.totalL1 : t.totalC1;
  const answer = roundTo(effectif / t.total, 3);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Fréquences",
    prompt: `Un tableau croisé d'effectifs sur ${ctx.sujet} : ${buildTableauCroiseTex(t, [ctx.ligne, ctx.ligne2], [ctx.colonne, ctx.colonne2])} Calcule la fréquence marginale de « ${nom} » (arrondie au millième).`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `\\text{La fréquence marginale d'une catégorie s'obtient en divisant son effectif (total de ligne ou de colonne) par l'effectif total.}` },
      { type: "resultat", text: `\\dfrac{${effectif}}{${t.total}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 2. Fréquence conditionnelle depuis un tableau croisé ----------
function genFrequenceConditionnelleNumeric() {
  const ctx = pick(CONTEXTES_TABLEAU);
  const t = tableauCroise2x2();
  const answer = roundTo(t.a / t.totalL1, 3);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Fréquences",
    prompt: `Un tableau croisé d'effectifs sur ${ctx.sujet} donne, pour la catégorie « ${ctx.ligne} » : ${t.a} en « ${ctx.colonne} » et ${t.b} en « ${ctx.colonne2} ». Parmi les individus « ${ctx.ligne} », quelle est la fréquence de « ${ctx.colonne} » (arrondie au millième) ?`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `\\text{Une fréquence } \\textbf{conditionnelle} \\text{ se calcule par rapport au total de la sous-catégorie concernée, et non par rapport au total général.}` },
      { type: "calcul", text: `\\text{Total de la catégorie } ${ctx.ligne} = ${t.a} + ${t.b} = ${t.totalL1}` },
      { type: "resultat", text: `\\dfrac{${t.a}}{${t.totalL1}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 3. Probabilité conditionnelle P_A(B) à partir de deux probabilités données ----------
function genProbabiliteConditionnelleNumeric() {
  const pAB = pick([0.04, 0.06, 0.08, 0.09, 0.1, 0.12, 0.15, 0.18, 0.2, 0.24]);
  const facteurs = [1.25, 1.5, 1.6, 2, 2.5, 3, 4, 5];
  const k = pick(facteurs.filter((f) => roundTo(pAB * f, 4) <= 1 && roundTo(pAB * f, 4) > pAB));
  const pA = roundTo(pAB * k, 4);
  const answer = roundTo(pAB / pA, 4);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Probabilités conditionnelles",
    prompt: `On considère deux événements A et B tels que \\(P(A) = ${fr(pA)}\\) et \\(P(A \\cap B) = ${fr(pAB)}\\). Calcule \\(P_A(B)\\) (arrondi au millième).`,
    answer: roundTo(answer, 3),
    tolerance: 0.001,
    steps: [{ type: "resultat", text: `P_A(B) = \\dfrac{P(A \\cap B)}{P(A)} = \\dfrac{${fr(pAB)}}{${fr(pA)}} \\approx ${fr(roundTo(answer, 3))}` }],
  };
}

// ---------- 4. Calculer P(A∩B) à partir de P(A) et P_A(B) ----------
function genProbabiliteIntersectionNumeric() {
  const pA = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8]);
  const pAB_cond = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8]);
  const answer = roundTo(pA * pAB_cond, 4);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Probabilités conditionnelles",
    prompt: `On considère deux événements A et B tels que \\(P(A) = ${fr(pA)}\\) et \\(P_A(B) = ${fr(pAB_cond)}\\). Calcule \\(P(A \\cap B)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [{ type: "resultat", text: `P(A \\cap B) = P(A) \\times P_A(B) = ${fr(pA)} \\times ${fr(pAB_cond)} = ${fr(answer)}` }],
  };
}

// ---------- 5. Vérifier l'indépendance de deux événements depuis un tableau croisé ----------
function genVerifierIndependanceQCM() {
  const ctx = pick(CONTEXTES_TABLEAU);
  const independants = Math.random() < 0.5;
  let t;
  if (independants) {
    // Construit un tableau où P(colonne) = P_ligne(colonne) exactement (produit des marges).
    const totalL1 = pick([10, 12, 15, 20, 24, 30]);
    const totalL2 = pick([10, 12, 15, 20, 24, 30]);
    const total = totalL1 + totalL2;
    const propC1 = pick([1, 2, 3, 4]) / pick([5, 6, 8, 10]);
    let a = Math.round(totalL1 * propC1);
    let c = Math.round(totalL2 * propC1);
    // Ajuste pour garantir l'égalité exacte des fréquences conditionnelles.
    if (a === 0) a = 1;
    if (c === 0) c = 1;
    if (roundTo(a / totalL1, 4) !== roundTo(c / totalL2, 4)) {
      c = Math.round((a / totalL1) * totalL2);
    }
    t = { a, b: totalL1 - a, c, d: totalL2 - c, totalL1, totalL2, total, totalC1: a + c, totalC2: totalL1 - a + totalL2 - c };
  } else {
    t = tableauCroise2x2();
    // Force une inégalité franche entre les deux fréquences conditionnelles.
    while (roundTo(t.a / t.totalL1, 3) === roundTo(t.c / t.totalL2, 3)) {
      t = tableauCroise2x2();
    }
  }
  const pColonneGlobale = roundTo(t.a / t.totalL1, 3);
  const pColonneAutre = roundTo(t.c / t.totalL2, 3);
  const reponse = pColonneGlobale === pColonneAutre ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "De la statistique aux probabilités — Indépendance",
    prompt: `Un tableau croisé d'effectifs sur ${ctx.sujet} donne, pour « ${ctx.ligne} » : ${t.a} en « ${ctx.colonne} » sur un total de ${t.totalL1} ; et pour « ${ctx.ligne2} » : ${t.c} en « ${ctx.colonne} » sur un total de ${t.totalL2}. Les événements « ${ctx.ligne} » et « ${ctx.colonne} » sont-ils indépendants ?`,
    answer: reponse,
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Deux événements sont indépendants si la fréquence de l'un ne change pas selon que l'autre est réalisé ou non : on compare donc les fréquences conditionnelles.}` },
      { type: "calcul", text: `\\text{Fréquence de « ${ctx.colonne} » parmi « ${ctx.ligne} » } = \\dfrac{${t.a}}{${t.totalL1}} \\approx ${fr(pColonneGlobale)}, \\quad \\text{parmi « ${ctx.ligne2} » } = \\dfrac{${t.c}}{${t.totalL2}} \\approx ${fr(pColonneAutre)}` },
      { type: "resultat", text: reponse === "Oui" ? "Les deux fréquences sont égales : les événements sont indépendants." : "Les deux fréquences sont différentes : les événements ne sont pas indépendants." },
    ],
  };
}

// ---------- 6. Probabilité d'un chemin dans un arbre pondéré à deux niveaux ----------
function genProbabiliteCheminArbreNumeric() {
  const pA = pick([0.3, 0.4, 0.5, 0.6, 0.7]);
  const pB_A = pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.8]);
  const answer = roundTo(pA * pB_A, 4);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Arbres pondérés",
    prompt: `Un arbre pondéré modélise une expérience en deux étapes. Sur la première branche, \\(P(A) = ${fr(pA)}\\) ; sur la branche suivante, \\(P_A(B) = ${fr(pB_A)}\\). Calcule la probabilité du chemin correspondant à \\(A \\cap B\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{Dans un arbre pondéré, la probabilité d'un chemin est le produit des probabilités portées par les branches qui le composent (règle du produit).}` },
      { type: "resultat", text: `P(A \\cap B) = P(A) \\times P_A(B) = ${fr(pA)} \\times ${fr(pB_A)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 7. Probabilité manquante sur une branche d'un arbre pondéré ----------
function genProbabiliteManquanteBrancheNumeric() {
  const p = pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8]);
  const answer = roundTo(1 - p, 2);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Arbres pondérés",
    prompt: `Sur un nœud d'un arbre pondéré, deux branches partent vers des événements contraires E et \\(\\overline{E}\\). On lit \\(P(E) = ${fr(p)}\\). Quelle est la probabilité portée par la branche \\(\\overline{E}\\) ?`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `\\text{À un même nœud d'un arbre pondéré, la somme des probabilités portées par toutes les branches vaut } 1.` },
      { type: "resultat", text: `P(\\overline{E}) = 1 - P(E) = 1 - ${fr(p)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 8. Formule des probabilités totales (2 branches) ----------
function genProbabiliteTotaleNumeric() {
  const pA = pick([0.3, 0.4, 0.5, 0.6, 0.7]);
  const pAbar = roundTo(1 - pA, 2);
  const pB_A = pick([0.1, 0.2, 0.3, 0.4, 0.5]);
  const pB_Abar = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);
  const answer = roundTo(pA * pB_A + pAbar * pB_Abar, 4);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Arbres pondérés",
    prompt: `Un arbre pondéré donne : \\(P(A) = ${fr(pA)}\\), \\(P_A(B) = ${fr(pB_A)}\\) et \\(P_{\\overline{A}}(B) = ${fr(pB_Abar)}\\). Calcule \\(P(B)\\) grâce à la formule des probabilités totales.`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `\\text{Formule des probabilités totales : on additionne les probabilités de tous les chemins qui mènent à } B.` },
      { type: "calcul", text: `P(B) = P(A) \\times P_A(B) + P(\\overline{A}) \\times P_{\\overline{A}}(B)` },
      { type: "resultat", text: `P(B) = ${fr(pA)} \\times ${fr(pB_A)} + ${fr(pAbar)} \\times ${fr(pB_Abar)} = ${fr(roundTo(pA * pB_A, 4))} + ${fr(roundTo(pAbar * pB_Abar, 4))} = ${fr(answer)}` },
    ],
  };
}

// ---------- 9. Répétition d'expériences identiques et indépendantes (tirages avec remise) ----------
function genRepetitionExperiencesNumeric() {
  const p = pick([[1, 2], [1, 3], [1, 4], [2, 5], [3, 5], [1, 5], [2, 3]]);
  const [num, den] = p;
  const n = pick([2, 3, 4]);
  const answer = roundTo((num / den) ** n, 4);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Répétitions d'expériences",
    prompt: `Une urne contient des boules dont une proportion \\(\\dfrac{${num}}{${den}}\\) sont rouges. On tire une boule, on note sa couleur, on la remet dans l'urne, puis on recommence, au total ${n} fois. Calcule la probabilité que les ${n} boules tirées soient toutes rouges (arrondie au dix-millième).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{Comme les tirages sont indépendants (avec remise), la probabilité de succès à chaque répétition se } \\textbf{multiplie} \\text{ : c'est le produit de la même probabilité } ${n} \\text{ fois, soit une puissance.}` },
      { type: "resultat", text: `\\left(\\dfrac{${num}}{${den}}\\right)^{${n}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 10. Probabilité de "au moins un" par passage au contraire ----------
function genProbabiliteAuMoinsUnNumeric() {
  const p = pick([0.1, 0.15, 0.2, 0.25, 0.3]);
  const n = pick([2, 3, 4, 5]);
  const answer = roundTo(1 - (1 - p) ** n, 3);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Répétitions d'expériences",
    prompt: `Un tireur atteint sa cible avec une probabilité de ${fr(p)} à chaque tir. Il effectue ${n} tirs indépendants. Calcule la probabilité qu'il atteigne la cible au moins une fois (arrondie au millième).`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `\\text{L'événement contraire de « au moins une fois » est « jamais » : on passe donc par le contraire, qui se calcule facilement par produit d'échecs indépendants.}` },
      { type: "resultat", text: `P(\\text{au moins une fois}) = 1 - P(\\text{jamais}) = 1 - (1 - ${fr(p)})^{${n}} = 1 - ${fr(roundTo((1 - p) ** n, 4))} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 11. Compléter une case manquante d'un tableau croisé (contexte probabiliste) ----------
function genCompleterCaseTableauNumeric() {
  const ctx = pick(CONTEXTES_TABLEAU);
  const t = tableauCroise2x2();
  const caseChoisie = pick(["a", "b", "c", "d"]);
  const autresCases = ["a", "b", "c", "d"].filter((k) => k !== caseChoisie);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Fréquences",
    prompt: `On étudie ${ctx.sujet} à l'aide d'un tableau croisé d'effectifs (la case « ? » est à déterminer) : ${buildTableauCroiseTex(t, [ctx.ligne, ctx.ligne2], [ctx.colonne, ctx.colonne2], { hidden: caseChoisie, includeTotals: true })} Détermine la case manquante (« ? »).`,
    answer: t[caseChoisie],
    steps: [
      { type: "regle", text: `\\text{La somme des trois cases connues et de la case manquante doit être égale au total général : la case manquante s'obtient donc par soustraction.}` },
      { type: "calcul", text: `${t.total} - (${autresCases.map((k) => t[k]).join(" + ")}) = ${t.total} - ${autresCases.reduce((s, k) => s + t[k], 0)}` },
      { type: "resultat", text: `\\text{Case manquante} = ${t[caseChoisie]}` },
    ],
  };
}

// ---------- 12. Vrai ou faux sur les probabilités conditionnelles ----------
function genVraiFauxProbabilitesQCM() {
  const cas = pick([
    {
      description: "Pour deux événements A et B, on a toujours \\(P_A(B) + P_A(\\overline{B}) = 1\\).",
      reponse: "Vrai",
      explication: `\\text{Sachant A réalisé, B et son contraire } \\overline{B} \\text{ recouvrent à eux deux tout l'univers restreint à A : leurs probabilités conditionnelles s'additionnent donc à } 1.`,
    },
    {
      description: "Pour deux événements A et B, on a toujours \\(P_A(B) = P_B(A)\\).",
      reponse: "Faux",
      explication: `P_A(B) = \\dfrac{P(A \\cap B)}{P(A)} \\text{ et } P_B(A) = \\dfrac{P(A \\cap B)}{P(B)} : \\text{ ces deux quantités ne sont égales que si } P(A) = P(B), \\text{ ce qui n'est pas toujours le cas.}`,
    },
    {
      description: "Si A et B sont indépendants, alors \\(P(A \\cap B) = P(A) \\times P(B)\\).",
      reponse: "Vrai",
      explication: `\\text{C'est la définition même de l'indépendance de deux événements.}`,
    },
    {
      description: "Si \\(P_A(B) = P(B)\\), alors les événements A et B sont indépendants.",
      reponse: "Vrai",
      explication: `\\text{Si connaître A ne change pas la probabilité de B, cela signifie précisément que A et B sont indépendants.}`,
    },
    {
      description: "La probabilité conditionnelle \\(P_A(B)\\) peut se calculer même si \\(P(A) = 0\\).",
      reponse: "Faux",
      explication: `P_A(B) = \\dfrac{P(A \\cap B)}{P(A)} \\text{ n'est pas définie si } P(A) = 0 \\text{ (division par zéro).}`,
    },
    {
      description: "Dans un arbre pondéré, la somme des probabilités portées par les branches issues d'un même nœud vaut toujours 1.",
      reponse: "Vrai",
      explication: `\\text{Les branches issues d'un même nœud représentent toutes les possibilités à cette étape : leurs probabilités doivent donc totaliser } 1.`,
    },
  ]);
  return {
    type: "qcm",
    chapter: "De la statistique aux probabilités — Probabilités conditionnelles",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 13. Probabilité d'un événement contraire simple ----------
function genProbabiliteContraireNumeric() {
  const num = randInt(1, 19);
  const den = randInt(num + 1, 20);
  const answer = roundTo((den - num) / den, 3);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Fréquences",
    prompt: `On sait que \\(P(E) = \\dfrac{${num}}{${den}}\\). Calcule \\(P(\\overline{E})\\) (arrondie au millième si nécessaire).`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `\\text{L'événement contraire } \\overline{E} \\text{ regroupe toutes les issues qui ne réalisent pas } E, \\text{ donc } P(\\overline{E}) = 1 - P(E).` },
      { type: "resultat", text: `P(\\overline{E}) = 1 - \\dfrac{${num}}{${den}} = \\dfrac{${den - num}}{${den}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 14. Comparer une fréquence conditionnelle à une fréquence marginale (indépendance QCM) ----------
function genComparerFrequenceMarginaleConditionnelleQCM() {
  const t = tableauCroise2x2();
  const freqMarginale = roundTo(t.totalC1 / t.total, 3);
  const freqConditionnelle = roundTo(t.a / t.totalL1, 3);
  let comparaison;
  if (freqConditionnelle > freqMarginale) comparaison = "supérieure";
  else if (freqConditionnelle < freqMarginale) comparaison = "inférieure";
  else comparaison = "égale";
  return {
    type: "qcm",
    chapter: "De la statistique aux probabilités — Indépendance",
    prompt: `Dans un tableau croisé d'effectifs, la fréquence marginale d'un événement B est de ${fr(freqMarginale)} (soit \\(\\dfrac{${t.totalC1}}{${t.total}}\\)) et sa fréquence conditionnelle sachant A est de ${fr(freqConditionnelle)} (soit \\(\\dfrac{${t.a}}{${t.totalL1}}\\)). La fréquence conditionnelle est-elle supérieure, inférieure ou égale à la fréquence marginale ?`,
    answer: comparaison,
    options: ["supérieure", "inférieure", "égale"],
    steps: [
      { type: "regle", text: `\\text{Si la fréquence conditionnelle sachant A diffère de la fréquence marginale de B, cela signifie que A a une influence sur B : les deux événements ne sont pas indépendants.}` },
      { type: "resultat", text: `${fr(freqConditionnelle)} \\text{ est ${comparaison === "égale" ? "égale à" : comparaison + " à"} } ${fr(freqMarginale)}` },
    ],
  };
}

// ---------- 15. Calculer un effectif à partir d'une probabilité conditionnelle ----------
function genEffectifDepuisProbabiliteConditionnelleNumeric() {
  const totalCategorie = pick([20, 24, 30, 40, 50, 60]);
  const proportion = pick([1, 2, 3, 4]) / pick([5, 6, 8, 10]);
  const effectif = Math.round(totalCategorie * proportion);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Fréquences",
    prompt: `Dans un groupe de ${totalCategorie} personnes appartenant à une même catégorie, la fréquence conditionnelle d'un événement E est de ${fr(roundTo(proportion, 4))}. Combien de personnes de ce groupe réalisent l'événement E ?`,
    answer: effectif,
    steps: [
      { type: "regle", text: `\\text{L'effectif correspondant à une fréquence conditionnelle s'obtient en multipliant l'effectif du groupe par cette fréquence.}` },
      { type: "resultat", text: `${totalCategorie} \\times ${fr(roundTo(proportion, 4))} = ${effectif}` },
    ],
  };
}

const CONTEXTES_BIVARIE = [
  { contexte: "le chiffre d'affaires mensuel (en milliers d'euros) d'une entreprise" },
  { contexte: "la population (en centaines d'habitants) d'une commune au fil des années" },
  { contexte: "le nombre d'abonnés (en dizaines) d'une chaîne au fil des mois" },
  { contexte: "la température moyenne (en °C) relevée chaque jour" },
];

// ---------- 16. Point moyen d'un nuage de points ----------
function genCalculerPointMoyenNumeric() {
  const ctx = pick(CONTEXTES_BIVARIE);
  const n = pick([4, 5, 6]);
  const xs = Array.from({ length: n }, (_, i) => i + 1);
  const ys = xs.map(() => randInt(5, 40));
  const xbar = roundTo(xs.reduce((a, b) => a + b, 0) / n, 2);
  const ybar = roundTo(ys.reduce((a, b) => a + b, 0) / n, 2);
  const demanderX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Statistiques à deux variables",
    prompt: `On a relevé les couples \\((x_i ; y_i)\\) suivants pour ${ctx.contexte} : ${xs.map((x, i) => `(${x} ; ${ys[i]})`).join(", ")}. Calcule ${demanderX ? "l'abscisse" : "l'ordonnée"} du point moyen G du nuage de points (arrondie au centième).`,
    answer: demanderX ? xbar : ybar,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Le point moyen } G(\\bar{x} ; \\bar{y}) \\text{ a pour coordonnées les moyennes des abscisses et des ordonnées de tous les points du nuage.}` },
      { type: "resultat", text: demanderX ? `\\bar{x} = \\dfrac{${xs.join(" + ")}}{${n}} = ${fr(xbar)}` : `\\bar{y} = \\dfrac{${ys.join(" + ")}}{${n}} = ${fr(ybar)}` },
    ],
  };
}

// ---------- 17. Équation de la droite d'ajustement (méthode des points extrêmes) ----------
function genEquationDroiteAjustementNumeric() {
  const ctx = pick(CONTEXTES_BIVARIE);
  const x1 = randInt(0, 4);
  const xn = x1 + randInt(3, 8);
  const y1 = randInt(5, 30);
  const yn = randInt(5, 40);
  const a = roundTo((yn - y1) / (xn - x1), 2);
  const b = roundTo(y1 - a * x1, 2);
  const demanderA = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Statistiques à deux variables",
    prompt: `Pour ${ctx.contexte}, le premier point du nuage est \\((${x1} ; ${y1})\\) et le dernier est \\((${xn} ; ${yn})\\). On ajuste le nuage par la droite passant par ces deux points extrêmes, d'équation \\(y = ax + b\\). Détermine ${demanderA ? "a" : "b"} (arrondi au centième).`,
    answer: demanderA ? a : b,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Méthode des points extrêmes : la droite d'ajustement passe par le premier et le dernier point du nuage. Son coefficient directeur est } a = \\dfrac{y_n - y_1}{x_n - x_1}, \\text{ puis } b = y_1 - a x_1.` },
      { type: "calcul", text: `a = \\dfrac{${yn} - ${y1}}{${xn} - ${x1}} = ${fr(a)}` },
      { type: "resultat", text: demanderA ? `a \\approx ${fr(a)}` : `b = ${y1} - ${fr(a)} \\times ${x1} \\approx ${fr(b)}` },
    ],
  };
}

// ---------- 18. Prédiction par extrapolation à partir de la droite d'ajustement ----------
function genPredictionParAjustementNumeric() {
  const ctx = pick(CONTEXTES_BIVARIE);
  const a = pick([-3, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3, 4]);
  const b = randInt(-10, 30);
  const xPredict = randInt(8, 25);
  const answer = roundTo(a * xPredict + b, 2);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Statistiques à deux variables",
    prompt: `Pour ${ctx.contexte}, la droite d'ajustement obtenue a pour équation \\(y = ${fr(a)}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). En utilisant ce modèle, quelle valeur peut-on prévoir pour \\(x = ${xPredict}\\) (arrondie au centième) ?`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Prévoir une valeur par extrapolation consiste à substituer la valeur de x dans l'équation de la droite d'ajustement, même en dehors des valeurs observées.}` },
      { type: "resultat", text: `y = ${fr(a)} \\times ${xPredict} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} \\approx ${fr(answer)}` },
    ],
  };
}

const GENERATORS = [
  genFrequenceMarginaleNumeric,
  genFrequenceConditionnelleNumeric,
  genProbabiliteConditionnelleNumeric,
  genProbabiliteIntersectionNumeric,
  genVerifierIndependanceQCM,
  genProbabiliteCheminArbreNumeric,
  genProbabiliteManquanteBrancheNumeric,
  genProbabiliteTotaleNumeric,
  genRepetitionExperiencesNumeric,
  genProbabiliteAuMoinsUnNumeric,
  genCompleterCaseTableauNumeric,
  genVraiFauxProbabilitesQCM,
  genProbabiliteContraireNumeric,
  genComparerFrequenceMarginaleConditionnelleQCM,
  genEffectifDepuisProbabiliteConditionnelleNumeric,
  genCalculerPointMoyenNumeric,
  genEquationDroiteAjustementNumeric,
  genPredictionParAjustementNumeric,
];

const DIFFICULTY = {
  genFrequenceMarginaleNumeric: "facile",
  genCompleterCaseTableauNumeric: "facile",
  genProbabiliteContraireNumeric: "facile",
  genFrequenceConditionnelleNumeric: "standard",
  genProbabiliteConditionnelleNumeric: "standard",
  genProbabiliteIntersectionNumeric: "standard",
  genProbabiliteCheminArbreNumeric: "standard",
  genProbabiliteManquanteBrancheNumeric: "standard",
  genVraiFauxProbabilitesQCM: "standard",
  genEffectifDepuisProbabiliteConditionnelleNumeric: "standard",
  genVerifierIndependanceQCM: "expert",
  genProbabiliteTotaleNumeric: "expert",
  genRepetitionExperiencesNumeric: "expert",
  genProbabiliteAuMoinsUnNumeric: "expert",
  genComparerFrequenceMarginaleConditionnelleQCM: "expert",
  genCalculerPointMoyenNumeric: "facile",
  genEquationDroiteAjustementNumeric: "standard",
  genPredictionParAjustementNumeric: "standard",
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
    id: "statistique-probabilites-premiere-non-spe",
    title: "De la statistique aux probabilités",
    description: "Fréquences marginales et conditionnelles, probabilité conditionnelle P_A(B), indépendance de deux événements, arbres pondérés, formule des probabilités totales, répétition d'expériences identiques et indépendantes, point moyen et droite d'ajustement d'un nuage de points.",
    pourquoi: "Passer des fréquences observées à la probabilité, c'est le raisonnement utilisé dans toute étude statistique ou sondage d'opinion.",
    level: "premiere-non-spe",
    free: false,
    order: 3,
    cours: {
      mindMap: {
        title: "De la statistique aux probabilités",
        branches: [
          {
            title: "Fréquences depuis un tableau croisé",
            items: [
              "Fréquence marginale : effectif d'une ligne ou colonne divisé par l'effectif total. Fréquence conditionnelle : effectif d'une case divisé par le total de sa ligne ou colonne (pas le total général).",
              "Une case manquante d'un tableau croisé se retrouve par différence à partir des totaux (ligne, colonne ou total général).",
              "Événement contraire : \\(P(\\bar{E}) = 1 - P(E)\\).",
            ],
            formula: "\\(\\text{fréquence conditionnelle} = \\dfrac{\\text{effectif de la case}}{\\text{effectif de la sous-catégorie}}\\)",
          },
          {
            title: "Probabilité conditionnelle",
            items: [
              "\\(P_A(B)\\) : probabilité de B sachant que A est déjà réalisé.",
              "\\(P(A \\cap B) = P_A(B) \\times P(A)\\).",
              "\\(P_A(B)\\) n'est définie que si \\(P(A) \\neq 0\\) ; et \\(P_A(B) + P_A(\\bar{B}) = 1\\) (sachant A, B et son contraire se partagent toute la probabilité).",
            ],
            formula: "\\(P_A(B) = \\dfrac{P(A \\cap B)}{P(A)}\\)",
          },
          {
            title: "Indépendance de deux événements",
            items: [
              "A et B sont indépendants si \\(P_A(B) = P(B)\\) : savoir que A s'est réalisé ne change rien à la probabilité de B.",
              "Dans un tableau croisé, on teste aussi l'indépendance en comparant les fréquences conditionnelles entre elles (ou à la fréquence marginale) : si elles sont égales, les événements sont indépendants.",
              "Piège classique : indépendant ≠ incompatible (deux événements incompatibles ne peuvent pas être indépendants, sauf cas particulier).",
            ],
          },
          {
            title: "Arbre pondéré",
            items: [
              "Sur chaque nœud, la somme des probabilités des branches vaut 1.",
              "La probabilité d'un chemin = produit des probabilités le long des branches.",
              "Formule des probabilités totales : additionner les probabilités de tous les chemins qui mènent à B.",
            ],
          },
          {
            title: "Répétitions et \"au moins un\"",
            items: [
              "Pour des tirages avec remise (expériences identiques et indépendantes), on multiplie les probabilités.",
              "\\(P(\\text{au moins un succès}) = 1 - P(\\text{aucun succès})\\) : passer au contraire simplifie souvent le calcul.",
            ],
          },
          {
            title: "Point moyen et droite d'ajustement",
            items: [
              "Le point moyen \\(G(\\bar{x} ; \\bar{y})\\) a pour coordonnées les moyennes des deux séries, et appartient toujours à la droite d'ajustement.",
              "Méthode des points extrêmes : la droite passe par le premier et le dernier point du nuage.",
              "Une prédiction par extrapolation reste fragile : elle suppose que la tendance se poursuit au-delà des données observées.",
            ],
            formula: "\\(a = \\dfrac{y_n-y_1}{x_n-x_1}\\, ; \\quad b = y_1 - a x_1\\)",
          },
        ],
      },
    },
  },
  generate,
};
