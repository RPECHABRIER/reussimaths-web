// ---------------------------------------------------------------------------
// Chapitre : De la statistique aux probabilités (Première, enseignement
// mathématique non spé) — sous abonnement.
//
// Correspond au chapitre 2 du programme d'enseignement mathématique de
// première (non spécialité) : fréquences marginales et conditionnelles
// depuis un tableau croisé d'effectifs, probabilité conditionnelle P_A(B),
// indépendance de deux événements (comparaison P(B) / P_A(B)), calcul de
// P(A∩B) par produit, arbres pondérés (calcul d'une probabilité manquante
// sur une branche, calcul de la probabilité d'un chemin, formule des
// probabilités totales), répétition d'expériences identiques et
// indépendantes (tirages avec remise), probabilité de "au moins un" par
// passage au contraire.
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
    prompt: `Un tableau croisé d'effectifs sur ${ctx.sujet} donne les quatre cases : ${t.a} (${ctx.ligne}/${ctx.colonne}), ${t.b} (${ctx.ligne}/${ctx.colonne2}), ${t.c} (${ctx.ligne2}/${ctx.colonne}), ${t.d} (${ctx.ligne2}/${ctx.colonne2}). Calcule la fréquence marginale de « ${nom} » (arrondie au millième).`,
    answer,
    tolerance: 0.001,
    steps: [`\\dfrac{${effectif}}{${t.total}} \\approx ${fr(answer)}`],
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
    steps: [`\\text{Total de la catégorie } ${ctx.ligne} = ${t.a} + ${t.b} = ${t.totalL1}`, `\\dfrac{${t.a}}{${t.totalL1}} \\approx ${fr(answer)}`],
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
    steps: [`P_A(B) = \\dfrac{P(A \\cap B)}{P(A)} = \\dfrac{${fr(pAB)}}{${fr(pA)}} \\approx ${fr(roundTo(answer, 3))}`],
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
    steps: [`P(A \\cap B) = P(A) \\times P_A(B) = ${fr(pA)} \\times ${fr(pAB_cond)} = ${fr(answer)}`],
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
    steps: [`\\text{Fréquence de « ${ctx.colonne} » parmi « ${ctx.ligne} » } = \\dfrac{${t.a}}{${t.totalL1}} \\approx ${fr(pColonneGlobale)}`, `\\text{Fréquence de « ${ctx.colonne} » parmi « ${ctx.ligne2} » } = \\dfrac{${t.c}}{${t.totalL2}} \\approx ${fr(pColonneAutre)}`, reponse === "Oui" ? "Les deux fréquences sont égales : les événements sont indépendants." : "Les deux fréquences sont différentes : les événements ne sont pas indépendants."],
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
    steps: [`P(A \\cap B) = P(A) \\times P_A(B) = ${fr(pA)} \\times ${fr(pB_A)} = ${fr(answer)}`],
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
    steps: [`P(\\overline{E}) = 1 - P(E) = 1 - ${fr(p)} = ${fr(answer)}`],
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
    steps: [`P(B) = P(A) \\times P_A(B) + P(\\overline{A}) \\times P_{\\overline{A}}(B)`, `P(B) = ${fr(pA)} \\times ${fr(pB_A)} + ${fr(pAbar)} \\times ${fr(pB_Abar)} = ${fr(roundTo(pA * pB_A, 4))} + ${fr(roundTo(pAbar * pB_Abar, 4))} = ${fr(answer)}`],
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
    steps: [`\\left(\\dfrac{${num}}{${den}}\\right)^{${n}} \\approx ${fr(answer)}`],
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
    steps: [`P(\\text{au moins une fois}) = 1 - P(\\text{jamais}) = 1 - (1 - ${fr(p)})^{${n}} = 1 - ${fr(roundTo((1 - p) ** n, 4))} \\approx ${fr(answer)}`],
  };
}

// ---------- 11. Compléter une case manquante d'un tableau croisé (contexte probabiliste) ----------
function genCompleterCaseTableauNumeric() {
  const ctx = pick(CONTEXTES_TABLEAU);
  const t = tableauCroise2x2();
  const caseChoisie = pick(["a", "b", "c", "d"]);
  return {
    type: "numeric",
    chapter: "De la statistique aux probabilités — Fréquences",
    prompt: `On étudie ${ctx.sujet} à l'aide d'un tableau croisé. On sait que : ${ctx.ligne} et ${ctx.colonne} : ${caseChoisie === "a" ? "?" : t.a} ; ${ctx.ligne} et ${ctx.colonne2} : ${caseChoisie === "b" ? "?" : t.b} ; ${ctx.ligne2} et ${ctx.colonne} : ${caseChoisie === "c" ? "?" : t.c} ; ${ctx.ligne2} et ${ctx.colonne2} : ${caseChoisie === "d" ? "?" : t.d}. Le total de la ligne « ${ctx.ligne} » est ${t.totalL1} et le total général est ${t.total}. Détermine la case manquante (« ? »).`,
    answer: t[caseChoisie],
    steps: [`\\text{Case manquante} = ${t[caseChoisie]}`],
  };
}

// ---------- 12. Vrai ou faux sur les probabilités conditionnelles ----------
function genVraiFauxProbabilitesQCM() {
  const cas = pick([
    { description: "Pour deux événements A et B, on a toujours \\(P_A(B) + P_A(\\overline{B}) = 1\\).", reponse: "Vrai" },
    { description: "Pour deux événements A et B, on a toujours \\(P_A(B) = P_B(A)\\).", reponse: "Faux" },
    { description: "Si A et B sont indépendants, alors \\(P(A \\cap B) = P(A) \\times P(B)\\).", reponse: "Vrai" },
    { description: "Si \\(P_A(B) = P(B)\\), alors les événements A et B sont indépendants.", reponse: "Vrai" },
    { description: "La probabilité conditionnelle \\(P_A(B)\\) peut se calculer même si \\(P(A) = 0\\).", reponse: "Faux" },
    { description: "Dans un arbre pondéré, la somme des probabilités portées par les branches issues d'un même nœud vaut toujours 1.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "De la statistique aux probabilités — Probabilités conditionnelles",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse === "Vrai" ? "Cette affirmation est correcte." : "Cette affirmation est incorrecte."],
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
    steps: [`P(\\overline{E}) = 1 - \\dfrac{${num}}{${den}} = \\dfrac{${den - num}}{${den}} \\approx ${fr(answer)}`],
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
    steps: [`${fr(freqConditionnelle)} \\text{ est ${comparaison === "égale" ? "égale à" : comparaison + " à"} } ${fr(freqMarginale)}`],
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
    steps: [`${totalCategorie} \\times ${fr(roundTo(proportion, 4))} = ${effectif}`],
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
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "statistique-probabilites-premiere-non-spe",
    title: "De la statistique aux probabilités",
    description: "Fréquences marginales et conditionnelles, probabilité conditionnelle P_A(B), indépendance de deux événements, arbres pondérés, formule des probabilités totales, répétition d'expériences identiques et indépendantes.",
    level: "premiere-non-spe",
    free: false,
    order: 3,
  },
  generate,
};
