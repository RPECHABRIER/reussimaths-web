// ---------------------------------------------------------------------------
// Chapitre : Automatismes (Terminale Spé) — gratuit, freemium (5 questions
// /jour sans abonnement, illimité avec abonnement). Regroupe les
// mini-exercices de calcul rapide en tête de chaque chapitre du manuel de
// Terminale (spécialité mathématiques), un thème par chapitre du sommaire
// (voir THEMES ci-dessous) ; sera enrichi au fur et à mesure que les autres
// chapitres de Terminale seront écrits — voir automatismes-premiere-non-spe.js
// pour le même principe en Première.
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

function factorielle(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function arrangement(n, k) {
  let r = 1;
  for (let i = 0; i < k; i++) r *= n - i;
  return r;
}

function combinaison(n, k) {
  if (k < 0 || k > n) return 0;
  return Math.round(arrangement(n, k) / factorielle(k));
}

// =========================== Chapitre 1 : Combinatoire et dénombrement ===========================
// (Mini-exercices "Calcul mental" en tête de page : factorielle, coefficient
// binomial, principe multiplicatif, tirages avec/sans remise.)

// ---------- 1. Calcul d'une factorielle (mental) ----------
function genAutoFactorielleMental() {
  const n = randInt(3, 7);
  return {
    type: "numeric",
    chapter: "Automatismes — Combinatoire et dénombrement",
    prompt: `Calcule \\(${n}!\\)`,
    answer: factorielle(n),
    steps: [`${factorielle(n)}`],
  };
}

// ---------- 2. Calcul d'un coefficient binomial (mental) ----------
function genAutoCoefficientBinomialMental() {
  const n = randInt(4, 10);
  const k = randInt(1, n - 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Combinatoire et dénombrement",
    prompt: `Calcule \\(\\dbinom{${n}}{${k}}\\)`,
    answer: combinaison(n, k),
    steps: [`${combinaison(n, k)}`],
  };
}

// ---------- 3. Principe multiplicatif (mental) ----------
function genAutoPrincipeMultiplicatifMental() {
  const a = randInt(3, 8);
  const b = randInt(3, 8);
  return {
    type: "numeric",
    chapter: "Automatismes — Combinatoire et dénombrement",
    prompt: `On dispose de ${a} choix pour un premier objet et ${b} choix pour un second, indépendamment. Combien de combinaisons (premier, second) peut-on former ?`,
    answer: a * b,
    steps: [`${a} \\times ${b} = ${a * b}`],
  };
}

// ---------- 4. Tirage avec remise (mental) ----------
function genAutoTirageAvecRemiseMental() {
  const n = randInt(3, 8);
  const k = pick([2, 3]);
  return {
    type: "numeric",
    chapter: "Automatismes — Combinatoire et dénombrement",
    prompt: `On tire ${k} fois avec remise dans un ensemble de ${n} éléments. Combien de tirages ordonnés possibles ?`,
    answer: n ** k,
    steps: [`${n}^{${k}} = ${n ** k}`],
  };
}

// ---------- 5. Nombre de parties d'un ensemble (mental) ----------
function genAutoNombrePartiesMental() {
  const n = randInt(3, 10);
  return {
    type: "numeric",
    chapter: "Automatismes — Combinatoire et dénombrement",
    prompt: `Combien de parties possède un ensemble à ${n} éléments ?`,
    answer: 2 ** n,
    steps: [`2^{${n}} = ${2 ** n}`],
  };
}

const CH_COMBINATOIRE_DENOMBREMENT_TS = [
  genAutoFactorielleMental,
  genAutoCoefficientBinomialMental,
  genAutoPrincipeMultiplicatifMental,
  genAutoTirageAvecRemiseMental,
  genAutoNombrePartiesMental,
];

// =========================== Chapitre 2 : Vecteurs, droites et plans de l'espace ===========================
// (Mini-exercices "Calcul mental" en tête de page : coordonnées d'un
// vecteur, norme, milieu, combinaison linéaire.)

// ---------- 1. Coordonnées d'un vecteur dans l'espace (mental) ----------
function genAutoCoordonneesVecteurMental() {
  const A = { x: randInt(-8, 8), y: randInt(-8, 8), z: randInt(-8, 8) };
  const B = { x: randInt(-8, 8), y: randInt(-8, 8), z: randInt(-8, 8) };
  const composante = pick(["x", "y", "z"]);
  return {
    type: "numeric",
    chapter: "Automatismes — Vecteurs de l'espace",
    prompt: `\\(A(${A.x} ; ${A.y} ; ${A.z})\\) et \\(B(${B.x} ; ${B.y} ; ${B.z})\\). Donne la coordonnée en ${composante} de \\(\\overrightarrow{AB}\\).`,
    answer: B[composante] - A[composante],
    steps: [`${B[composante]} - (${A[composante]}) = ${B[composante] - A[composante]}`],
  };
}

// ---------- 2. Milieu d'un segment dans l'espace (mental) ----------
function genAutoMilieuSegmentMental() {
  const composante = pick(["x", "y", "z"]);
  const a = randInt(-10, 10);
  let b = randInt(-10, 10);
  if ((a + b) % 2 !== 0) b += 1;
  return {
    type: "numeric",
    chapter: "Automatismes — Vecteurs de l'espace",
    prompt: `Deux points ont pour coordonnée en ${composante} : ${a} et ${b}. Donne la coordonnée en ${composante} de leur milieu.`,
    answer: (a + b) / 2,
    steps: [`\\dfrac{${a} + ${b}}{2} = ${(a + b) / 2}`],
  };
}

// ---------- 3. Norme au carré d'un vecteur (mental) ----------
function genAutoNormeCarreMental() {
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const c = nonZero(-8, 8);
  return {
    type: "numeric",
    chapter: "Automatismes — Vecteurs de l'espace",
    prompt: `On considère \\(\\vec{u}(${a} ; ${b} ; ${c})\\). Calcule \\(\\|\\vec{u}\\|^2\\).`,
    answer: a * a + b * b + c * c,
    steps: [`${a}^2 + ${b}^2 + ${c}^2 = ${a * a + b * b + c * c}`],
  };
}

// ---------- 4. Somme de deux vecteurs (mental) ----------
function genAutoSommeVecteursMental() {
  const u = { x: randInt(-9, 9), y: randInt(-9, 9), z: randInt(-9, 9) };
  const v = { x: randInt(-9, 9), y: randInt(-9, 9), z: randInt(-9, 9) };
  const composante = pick(["x", "y", "z"]);
  return {
    type: "numeric",
    chapter: "Automatismes — Vecteurs de l'espace",
    prompt: `\\(\\vec{u}(${u.x} ; ${u.y} ; ${u.z})\\) et \\(\\vec{v}(${v.x} ; ${v.y} ; ${v.z})\\). Donne la coordonnée en ${composante} de \\(\\vec{u} + \\vec{v}\\).`,
    answer: u[composante] + v[composante],
    steps: [`${u[composante]} + ${v[composante]} = ${u[composante] + v[composante]}`],
  };
}

// ---------- 5. Point d'appartenance à une droite (mental) ----------
function genAutoAppartientDroiteMental() {
  const oui = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Automatismes — Vecteurs de l'espace",
    prompt: `Un vecteur \\(\\overrightarrow{AM}\\) est ${oui ? "colinéaire" : "non colinéaire"} au vecteur directeur d'une droite passant par A. Le point M appartient-il à cette droite ?`,
    answer: oui ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [oui ? "Colinéaire : M appartient à la droite." : "Non colinéaire : M n'appartient pas à la droite."],
  };
}

const CH_VECTEURS_DROITES_PLANS_ESPACE_TS = [
  genAutoCoordonneesVecteurMental,
  genAutoMilieuSegmentMental,
  genAutoNormeCarreMental,
  genAutoSommeVecteursMental,
  genAutoAppartientDroiteMental,
];

// =========================== Chapitre 3 : Orthogonalité et distances dans l'espace ===========================
// (Mini-exercices "Calcul mental" en tête de page : produit scalaire,
// vecteur normal, orthogonalité, distance point-plan.)

// ---------- 1. Produit scalaire de deux vecteurs (mental) ----------
function genAutoProduitScalaireMental() {
  const u = { x: nonZero(-8, 8), y: nonZero(-8, 8), z: nonZero(-8, 8) };
  const v = { x: nonZero(-8, 8), y: nonZero(-8, 8), z: nonZero(-8, 8) };
  return {
    type: "numeric",
    chapter: "Automatismes — Orthogonalité et distances",
    prompt: `\\(\\vec{u}(${u.x} ; ${u.y} ; ${u.z})\\) et \\(\\vec{v}(${v.x} ; ${v.y} ; ${v.z})\\). Calcule \\(\\vec{u} \\cdot \\vec{v}\\).`,
    answer: u.x * v.x + u.y * v.y + u.z * v.z,
    steps: [`${u.x} \\times ${v.x} + ${u.y} \\times ${v.y} + ${u.z} \\times ${v.z} = ${u.x * v.x + u.y * v.y + u.z * v.z}`],
  };
}

// ---------- 2. Vecteur normal depuis l'équation d'un plan (mental) ----------
function genAutoVecteurNormalMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const d = randInt(-15, 15);
  const composante = pick(["x", "y", "z"]);
  const answer = composante === "x" ? a : composante === "y" ? b : c;
  return {
    type: "numeric",
    chapter: "Automatismes — Orthogonalité et distances",
    prompt: `Un plan a pour équation \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}y ${c >= 0 ? "+" : "-"} ${Math.abs(c)}z ${d >= 0 ? "+" : "-"} ${Math.abs(d)} = 0\\). Donne la coordonnée en ${composante} d'un vecteur normal.`,
    answer,
    steps: [`(${a} ; ${b} ; ${c})`],
  };
}

// ---------- 3. Norme au carré d'un vecteur (mental) ----------
function genAutoNormeCarreEspaceMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Orthogonalité et distances",
    prompt: `On considère \\(\\vec{n}(${a} ; ${b} ; ${c})\\). Calcule \\(a^2+b^2+c^2\\).`,
    answer: a * a + b * b + c * c,
    steps: [`${a}^2 + ${b}^2 + ${c}^2 = ${a * a + b * b + c * c}`],
  };
}

// ---------- 4. Vérifier l'orthogonalité (mental) ----------
function genAutoVerifierOrthogonaliteMental() {
  const u = { x: 1, y: 1, z: 1 };
  const orthogonal = Math.random() < 0.5;
  const v = orthogonal ? { x: 1, y: 1, z: -2 } : { x: 1, y: 1, z: 1 };
  const produit = u.x * v.x + u.y * v.y + u.z * v.z;
  return {
    type: "qcm",
    chapter: "Automatismes — Orthogonalité et distances",
    prompt: `\\(\\vec{u}(1 ; 1 ; 1)\\) et \\(\\vec{v}(${v.x} ; ${v.y} ; ${v.z})\\) sont-ils orthogonaux ?`,
    answer: produit === 0 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`\\vec{u} \\cdot \\vec{v} = ${produit}`],
  };
}

// ---------- 5. Vrai ou faux sur les plans et vecteurs normaux (mental) ----------
function genAutoVraiFauxPlansMental() {
  const cas = pick([
    { description: "Un vecteur normal à un plan est orthogonal à tout vecteur directeur de ce plan.", reponse: "Vrai" },
    { description: "Deux vecteurs normaux colinéaires définissent des plans parallèles.", reponse: "Vrai" },
    { description: "Un plan n'a qu'un seul vecteur normal possible.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Orthogonalité et distances",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

const CH_ORTHOGONALITE_DISTANCES_ESPACE_TS = [
  genAutoProduitScalaireMental,
  genAutoVecteurNormalMental,
  genAutoNormeCarreEspaceMental,
  genAutoVerifierOrthogonaliteMental,
  genAutoVraiFauxPlansMental,
];

// =========================== Chapitre 4 : Suites ===========================
// (Mini-exercices "Calcul mental" en tête de page : limite d'une suite
// géométrique, formes indéterminées, théorème des gendarmes, point fixe.)

// ---------- 1. Limite d'une suite géométrique (mental) ----------
function genAutoLimiteGeometriqueMental() {
  const cas = pick([
    { texte: "3", reponse: "+\\infty" },
    { texte: "0{,}5", reponse: "0" },
    { texte: "1{,}2", reponse: "+\\infty" },
    { texte: "0{,}1", reponse: "0" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Suites",
    prompt: `Quelle est la limite de \\(u_n = ${cas.texte}^n\\) quand n tend vers \\(+\\infty\\) ?`,
    answer: cas.reponse,
    options: ["+\\infty", "0"],
    steps: [cas.reponse],
  };
}

// ---------- 2. Identifier une forme indéterminée (mental) ----------
function genAutoFormeIndetermineeMental() {
  const cas = pick([
    { description: "\\infty - \\infty", reponse: "Forme indéterminée" },
    { description: "\\infty + 5", reponse: "Pas de forme indéterminée" },
    { description: "0 \\times \\infty", reponse: "Forme indéterminée" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Suites",
    prompt: `La forme \\(${cas.description}\\) est-elle une forme indéterminée ?`,
    answer: cas.reponse,
    options: ["Forme indéterminée", "Pas de forme indéterminée"],
    steps: [cas.reponse],
  };
}

// ---------- 3. Point fixe d'une suite arithmético-géométrique (mental) ----------
function genAutoPointFixeMental() {
  const a = pick([0.5, 0.75, 0.8, 0.25]);
  const L = randInt(2, 50);
  const b = roundTo(L * (1 - a), 4);
  return {
    type: "numeric",
    chapter: "Automatismes — Suites",
    prompt: `Résous \\(L = ${fr(a)}L + ${fr(b)}\\).`,
    answer: L,
    tolerance: 0.01,
    steps: [`L = ${L}`],
  };
}

// ---------- 4. Théorème des gendarmes (mental) ----------
function genAutoGendarmesMental() {
  const L = randInt(-8, 8);
  return {
    type: "numeric",
    chapter: "Automatismes — Suites",
    prompt: `\\(${L} - \\frac{1}{n} \\leqslant u_n \\leqslant ${L} + \\frac{1}{n}\\). Vers quoi converge \\(u_n\\) ?`,
    answer: L,
    steps: [`${L}`],
  };
}

// ---------- 5. Limite d'une somme (mental) ----------
function genAutoLimiteSommeMental() {
  const cas = pick([
    { u: "+\\infty", v: "3", reponse: "+\\infty" },
    { u: "-\\infty", v: "-\\infty", reponse: "-\\infty" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Suites",
    prompt: `\\(\\lim u_n = ${cas.u}\\) et \\(\\lim v_n = ${cas.v}\\). Quelle est \\(\\lim(u_n+v_n)\\) ?`,
    answer: cas.reponse,
    options: ["+\\infty", "-\\infty"],
    steps: [cas.reponse],
  };
}

const CH_SUITES_TS = [
  genAutoLimiteGeometriqueMental,
  genAutoFormeIndetermineeMental,
  genAutoPointFixeMental,
  genAutoGendarmesMental,
  genAutoLimiteSommeMental,
];

// =========================== Chapitre 5 : Limites de fonctions ===========================
// (Mini-exercices "Calcul mental" en tête de page : limite d'une fonction
// rationnelle, croissance comparée, asymptote verticale.)

// ---------- 1. Limite d'une fonction rationnelle (mental) ----------
function genAutoLimiteRationnelleMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Limites de fonctions",
    prompt: `\\(f(x) = \\dfrac{${a}x^2}{${b}x^2}\\) (pour x non nul). Calcule la limite de f(x) quand x tend vers \\(+\\infty\\), arrondie au millième si nécessaire.`,
    answer: roundTo(a / b, 4),
    tolerance: 0.001,
    steps: [`\\dfrac{${a}}{${b}} = ${fr(roundTo(a / b, 4))}`],
  };
}

// ---------- 2. Croissance comparée (mental) ----------
function genAutoCroissanceCompareeMental() {
  const n = randInt(2, 5);
  return {
    type: "qcm",
    chapter: "Automatismes — Limites de fonctions",
    prompt: `Quelle est la limite de \\(\\dfrac{e^x}{x^{${n}}}\\) quand x tend vers \\(+\\infty\\) ?`,
    answer: "+\\infty",
    options: ["+\\infty", "0"],
    steps: ["L'exponentielle l'emporte toujours sur les puissances de x."],
  };
}

// ---------- 3. Asymptote verticale (mental) ----------
function genAutoAsymptoteVerticaleMental() {
  const a = nonZero(-8, 8);
  return {
    type: "numeric",
    chapter: "Automatismes — Limites de fonctions",
    prompt: `f est non définie en x = ${a}. Donne l'équation (valeur de x) de l'asymptote verticale.`,
    answer: a,
    steps: [`x = ${a}`],
  };
}

// ---------- 4. Limite d'une somme (mental) ----------
function genAutoLimiteSommeFonctionMental() {
  const cas = pick([
    { f: "+\\infty", g: "3", reponse: "+\\infty" },
    { f: "-\\infty", g: "-\\infty", reponse: "-\\infty" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Limites de fonctions",
    prompt: `\\(\\lim f(x) = ${cas.f}\\) et \\(\\lim g(x) = ${cas.g}\\). Quelle est \\(\\lim(f+g)\\) ?`,
    answer: cas.reponse,
    options: ["+\\infty", "-\\infty"],
    steps: [cas.reponse],
  };
}

// ---------- 5. Forme indéterminée (mental) ----------
function genAutoFormeIndetermineeFonctionMental() {
  const cas = pick([
    { description: "\\infty - \\infty", reponse: "Forme indéterminée" },
    { description: "\\infty \\times 2", reponse: "Pas de forme indéterminée" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Limites de fonctions",
    prompt: `La forme \\(${cas.description}\\) est-elle indéterminée ?`,
    answer: cas.reponse,
    options: ["Forme indéterminée", "Pas de forme indéterminée"],
    steps: [cas.reponse],
  };
}

const CH_LIMITES_FONCTIONS_TS = [
  genAutoLimiteRationnelleMental,
  genAutoCroissanceCompareeMental,
  genAutoAsymptoteVerticaleMental,
  genAutoLimiteSommeFonctionMental,
  genAutoFormeIndetermineeFonctionMental,
];

// =========================== Chapitre 6 : Continuité ===========================
// (Mini-exercices "Calcul mental" en tête de page : théorème des valeurs
// intermédiaires, signe d'un produit, dichotomie.)

// ---------- 1. Théorème des valeurs intermédiaires (mental) ----------
function genAutoTVIMental() {
  const f1 = randInt(-8, -1);
  const f2 = randInt(1, 8);
  return {
    type: "qcm",
    chapter: "Automatismes — Continuité",
    prompt: `f est continue sur \\([1;2]\\), \\(f(1) = ${f1}\\) et \\(f(2) = ${f2}\\). L'équation f(x) = 0 admet-elle une solution sur \\([1;2]\\) ?`,
    answer: "Oui",
    options: ["Oui", "Non"],
    steps: [`f(1) \\times f(2) = ${f1 * f2} < 0 : une solution est garantie.`],
  };
}

// ---------- 2. Signe d'un produit (mental) ----------
function genAutoSigneProduitMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const produit = a * b;
  return {
    type: "qcm",
    chapter: "Automatismes — Continuité",
    prompt: `Quel est le signe de \\(${a} \\times ${b}\\) ?`,
    answer: produit > 0 ? "Positif" : "Négatif",
    options: ["Positif", "Négatif"],
    steps: [`${a} \\times ${b} = ${produit}`],
  };
}

// ---------- 3. Fonctions usuelles continues (mental) ----------
function genAutoFonctionsUsuellesContinuesMental() {
  const cas = pick([
    { description: "Une fonction polynôme est continue sur \\(\\mathbb{R}\\).", reponse: "Vrai" },
    { description: "La fonction racine carrée est continue sur \\([0;+\\infty[\\).", reponse: "Vrai" },
    { description: "Toute fonction dérivable est continue.", reponse: "Vrai" },
    { description: "Toute fonction continue est dérivable.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Continuité",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 4. Étape de dichotomie (mental) ----------
function genAutoEtapeDichotomieMental() {
  const a = randInt(0, 5);
  const b = a + randInt(1, 4) * 2;
  return {
    type: "numeric",
    chapter: "Automatismes — Continuité",
    prompt: `On encadre une solution par \\([${a};${b}]\\). Quel est le milieu de cet intervalle utilisé par la dichotomie ?`,
    answer: (a + b) / 2,
    steps: [`\\dfrac{${a} + ${b}}{2} = ${(a + b) / 2}`],
  };
}

// ---------- 5. Nombre de solutions sur un tableau de variations (mental) ----------
function genAutoNombreSolutionsMental() {
  const cas = pick([
    { description: "f strictement croissante sur un intervalle, change de signe une fois", reponse: 1 },
    { description: "f constante égale à 5 sur un intervalle", reponse: 0 },
  ]);
  return {
    type: "numeric",
    chapter: "Automatismes — Continuité",
    prompt: `f est ${cas.description}. Combien de solutions a l'équation f(x) = 0 sur cet intervalle ?`,
    answer: cas.reponse,
    steps: [`${cas.reponse}`],
  };
}

const CH_CONTINUITE_TS = [
  genAutoTVIMental,
  genAutoSigneProduitMental,
  genAutoFonctionsUsuellesContinuesMental,
  genAutoEtapeDichotomieMental,
  genAutoNombreSolutionsMental,
];

// =========================== Chapitre 7 : Compléments sur la dérivation ===========================
// (Mini-exercices "Calcul mental" en tête de page : dérivée d'une composée
// simple, signe de la dérivée seconde, convexité/concavité.)

// ---------- 1. Dérivée d'une composée u^2 (mental) ----------
function genAutoDeriveeCarreMental() {
  const a = nonZero(-6, 6);
  const b = randInt(-6, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Compléments sur la dérivation",
    prompt: `On considère \\(f(x) = (${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)})^2\\). Donne le coefficient devant \\((${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)})\\) dans l'expression de \\(f'(x)\\).`,
    answer: 2 * a,
    steps: [`f'(x) = 2 \\times ${a} \\times (${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}) : \\text{coefficient } = ${2 * a}`],
  };
}

// ---------- 2. Dérivée de e^u avec u affine (mental) ----------
function genAutoDeriveeExpMental() {
  const a = nonZero(-6, 6);
  const b = randInt(-6, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Compléments sur la dérivation",
    prompt: `On considère \\(f(x) = \\mathrm{e}^{${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}}\\). Donne le coefficient devant \\(\\mathrm{e}^{${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}}\\) dans l'expression de \\(f'(x)\\).`,
    answer: a,
    steps: [`f'(x) = ${a}\\mathrm{e}^{${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}}`],
  };
}

// ---------- 3. Signe de la dérivée seconde et convexité (mental) ----------
function genAutoSigneSecondeMental() {
  const positive = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Automatismes — Compléments sur la dérivation",
    prompt: `Sur un intervalle I, \\(f''(x) ${positive ? ">" : "<"} 0\\). f est-elle convexe ou concave sur I ?`,
    answer: positive ? "Convexe" : "Concave",
    options: ["Convexe", "Concave"],
    steps: [positive ? "f'' > 0 : f est convexe." : "f'' < 0 : f est concave."],
  };
}

// ---------- 4. Point d'inflexion (mental) ----------
function genAutoPointInflexionMental() {
  const x0 = randInt(-6, 6);
  const a = nonZero(-5, 5);
  const b = -a * x0;
  return {
    type: "numeric",
    chapter: "Automatismes — Compléments sur la dérivation",
    prompt: `\\(f''(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Donne l'abscisse du point d'inflexion.`,
    answer: x0,
    steps: [`${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = 0 \\Rightarrow x = ${x0}`],
  };
}

// ---------- 5. Position de la courbe par rapport à la tangente (mental) ----------
function genAutoPositionTangenteMental() {
  const convexe = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Automatismes — Compléments sur la dérivation",
    prompt: `f est ${convexe ? "convexe" : "concave"} sur I. Sur I, la courbe de f est-elle au-dessus ou en-dessous de ses tangentes ?`,
    answer: convexe ? "Au-dessus" : "En-dessous",
    options: ["Au-dessus", "En-dessous"],
    steps: [convexe ? "Convexe : au-dessus des tangentes." : "Concave : en-dessous des tangentes."],
  };
}

const CH_COMPLEMENTS_DERIVATION_TS = [
  genAutoDeriveeCarreMental,
  genAutoDeriveeExpMental,
  genAutoSigneSecondeMental,
  genAutoPointInflexionMental,
  genAutoPositionTangenteMental,
];

// =========================== Chapitre 8 : Logarithme népérien ===========================
// (Mini-exercices "Calcul mental" en tête de page : propriétés algébriques
// du logarithme, valeurs remarquables, signe.)

// ---------- 1. Propriété ln(m×n) (mental) ----------
function genAutoLnProduitMental() {
  const m = randInt(2, 9);
  let n = randInt(2, 9);
  if (n === m) n += 1;
  return {
    type: "qcm",
    chapter: "Automatismes — Logarithme népérien",
    prompt: `\\(\\ln(${m} \\times ${n})\\) est égal à ?`,
    answer: `\\ln(${m}) + \\ln(${n})`,
    options: [`\\ln(${m}) + \\ln(${n})`, `\\ln(${m}) \\times \\ln(${n})`],
    steps: [`\\ln(${m} \\times ${n}) = \\ln(${m}) + \\ln(${n})`],
  };
}

// ---------- 2. Valeurs remarquables (mental) ----------
function genAutoLnValeurMental() {
  const cas = pick([
    { texte: "\\ln(1)", reponse: 0 },
    { texte: "\\ln(\\mathrm{e})", reponse: 1 },
  ]);
  return {
    type: "numeric",
    chapter: "Automatismes — Logarithme népérien",
    prompt: `Calcule \\(${cas.texte}\\).`,
    answer: cas.reponse,
    steps: [`${cas.reponse}`],
  };
}

// ---------- 3. Signe de ln(x) (mental) ----------
function genAutoSigneLnMental() {
  const superieur = Math.random() < 0.5;
  const x = superieur ? randInt(2, 9) : pick(["\\dfrac{1}{2}", "\\dfrac{1}{3}", "\\dfrac{1}{4}"]);
  return {
    type: "qcm",
    chapter: "Automatismes — Logarithme népérien",
    prompt: `Quel est le signe de \\(\\ln(${x})\\) ?`,
    answer: superieur ? "Positif" : "Négatif",
    options: ["Positif", "Négatif"],
    steps: [superieur ? "L'argument est supérieur à 1." : "L'argument est compris entre 0 et 1."],
  };
}

// ---------- 4. Simplifier ln(e^k) (mental) ----------
function genAutoLnExpMental() {
  const k = randInt(-8, 8);
  return {
    type: "numeric",
    chapter: "Automatismes — Logarithme népérien",
    prompt: `Simplifie \\(\\ln(\\mathrm{e}^{${k}})\\).`,
    answer: k,
    steps: [`${k}`],
  };
}

// ---------- 5. Coefficient dans ln(b^n) (mental) ----------
function genAutoLnPuissanceMental() {
  const b = pick([2, 3, 5]);
  const n = randInt(2, 5);
  return {
    type: "numeric",
    chapter: "Automatismes — Logarithme népérien",
    prompt: `On écrit \\(\\ln(${b}^{${n}})\\) sous la forme \\(k \\times \\ln(${b})\\). Donne k.`,
    answer: n,
    steps: [`${n}`],
  };
}

const CH_LOGARITHME_NEPERIEN_TS = [
  genAutoLnProduitMental,
  genAutoLnValeurMental,
  genAutoSigneLnMental,
  genAutoLnExpMental,
  genAutoLnPuissanceMental,
];

// =========================== Chapitre 9 : Fonctions trigonométriques ===========================
// (Mini-exercices "Calcul mental" en tête de page : valeurs remarquables,
// signe, parité.)

// ---------- 1. Valeur remarquable (mental) ----------
function genAutoValeurTrigMental() {
  const cas = pick([
    { texte: "\\cos(0)", reponse: "1" },
    { texte: "\\sin(0)", reponse: "0" },
    { texte: "\\cos\\left(\\dfrac{\\pi}{2}\\right)", reponse: "0" },
    { texte: "\\sin\\left(\\dfrac{\\pi}{2}\\right)", reponse: "1" },
    { texte: "\\cos(\\pi)", reponse: "-1" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions trigonométriques",
    prompt: `Calcule \\(${cas.texte}\\).`,
    answer: cas.reponse,
    options: ["1", "0", "-1"],
    steps: [cas.reponse],
  };
}

// ---------- 2. Parité (mental) ----------
function genAutoPariteTrigMental() {
  const cas = pick([
    { texte: "\\cos", reponse: "Paire" },
    { texte: "\\sin", reponse: "Impaire" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions trigonométriques",
    prompt: `La fonction ${cas.texte} est-elle paire ou impaire ?`,
    answer: cas.reponse,
    options: ["Paire", "Impaire"],
    steps: [cas.reponse],
  };
}

// ---------- 3. Dérivée en 0 (mental) ----------
function genAutoDeriveeZeroTrigMental() {
  const estSinus = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Fonctions trigonométriques",
    prompt: `Quel est le nombre dérivé de la fonction ${estSinus ? "sinus" : "cosinus"} en 0 ?`,
    answer: estSinus ? 1 : 0,
    steps: [estSinus ? "1" : "0"],
  };
}

// ---------- 4. Signe (mental) ----------
function genAutoSigneTrigMental() {
  const positif = Math.random() < 0.5;
  const angle = positif ? "\\dfrac{\\pi}{4}" : "\\dfrac{2\\pi}{3}";
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions trigonométriques",
    prompt: `Quel est le signe de \\(\\cos\\left(${angle}\\right)\\) ?`,
    answer: positif ? "Positif" : "Négatif",
    options: ["Positif", "Négatif"],
    steps: [positif ? "Positif" : "Négatif"],
  };
}

// ---------- 5. Périodicité (mental) ----------
function genAutoPeriodeTrigMental() {
  const k = pick([2, 3, 4]);
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions trigonométriques",
    prompt: `Quelle est la période de \\(f(x) = \\cos(${k}x)\\) ?`,
    answer: `\\dfrac{2\\pi}{${k}}`,
    options: [`\\dfrac{2\\pi}{${k}}`, `${k}\\pi`],
    steps: [`\\dfrac{2\\pi}{${k}}`],
  };
}

const CH_FONCTIONS_TRIGONOMETRIQUES_TS = [
  genAutoValeurTrigMental,
  genAutoPariteTrigMental,
  genAutoDeriveeZeroTrigMental,
  genAutoSigneTrigMental,
  genAutoPeriodeTrigMental,
];

// =========================== Chapitre 10 : Primitives, équations différentielles ===========================
// (Mini-exercices "Calcul mental" en tête de page : primitives usuelles,
// solutions de y'=ay.)

// ---------- 1. Primitive de x^n (mental) ----------
function genAutoPrimitivePuissanceMental() {
  const n = randInt(1, 5);
  return {
    type: "numeric",
    chapter: "Automatismes — Primitives, équations différentielles",
    prompt: `On considère \\(f(x) = x^{${n}}\\). Une primitive de f est \\(F(x) = \\dfrac{1}{k}x^{${n + 1}}\\). Donne k.`,
    answer: n + 1,
    steps: [`${n + 1}`],
  };
}

// ---------- 2. Solutions de y'=ay (mental) ----------
function genAutoEquationDiffMental() {
  const a = nonZero(-6, 6);
  return {
    type: "qcm",
    chapter: "Automatismes — Primitives, équations différentielles",
    prompt: `Les solutions de \\(y' = ${a}y\\) sont de la forme \\(x \\mapsto C\\mathrm{e}^{kx}\\). Donne k.`,
    answer: `${a}`,
    options: [`${a}`, `${-a}`],
    steps: [`${a}`],
  };
}

// ---------- 3. Primitive de e^(ax) (mental) ----------
function genAutoPrimitiveExpMental() {
  const a = nonZero(-6, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Primitives, équations différentielles",
    prompt: `On considère \\(f(x) = \\mathrm{e}^{${a}x}\\). Une primitive de f est \\(F(x) = k\\mathrm{e}^{${a}x}\\). Donne k (arrondi au millième si besoin).`,
    answer: roundTo(1 / a, 4),
    tolerance: 0.001,
    steps: [`k = \\dfrac{1}{${a}}`],
  };
}

// ---------- 4. Nombre de primitives (mental) ----------
function genAutoNombrePrimitivesMental() {
  return {
    type: "qcm",
    chapter: "Automatismes — Primitives, équations différentielles",
    prompt: `Combien de primitives possède une fonction continue sur un intervalle ?`,
    answer: "Une infinité",
    options: ["Une seule", "Une infinité"],
    steps: ["Une infinité (elles diffèrent d'une constante)."],
  };
}

// ---------- 5. Déterminer C avec une condition initiale (mental) ----------
function genAutoDeterminerCMental() {
  const a = nonZero(-6, 6);
  const v0 = randInt(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Primitives, équations différentielles",
    prompt: `\\(F(x) = C\\mathrm{e}^{${a}x}\\) et \\(F(0) = ${v0}\\). Donne C.`,
    answer: v0,
    steps: [`${v0}`],
  };
}

const CH_PRIMITIVES_EQUATIONS_DIFFERENTIELLES_TS = [
  genAutoPrimitivePuissanceMental,
  genAutoEquationDiffMental,
  genAutoPrimitiveExpMental,
  genAutoNombrePrimitivesMental,
  genAutoDeterminerCMental,
];

// =========================== Chapitre 11 : Calcul intégral ===========================
// (Mini-exercices "Calcul mental" en tête de page : intégrale d'une
// fonction affine, relation de Chasles, signe.)

// ---------- 1. Intégrale d'une fonction constante (mental) ----------
function genAutoIntegraleConstanteMental() {
  const a = randInt(-6, 6);
  const b = a + randInt(1, 6);
  const k = randInt(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul intégral",
    prompt: `Calcule \\(\\displaystyle\\int_{${a}}^{${b}} ${k}\\,\\mathrm{d}x\\).`,
    answer: k * (b - a),
    steps: [`${k} \\times (${b} - ${a}) = ${k * (b - a)}`],
  };
}

// ---------- 2. Relation de Chasles (mental) ----------
function genAutoChaslesMental() {
  const V1 = randInt(-9, 9);
  const V2 = randInt(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul intégral",
    prompt: `\\(\\int_a^b f = ${V1}\\) et \\(\\int_b^c f = ${V2}\\). Calcule \\(\\int_a^c f\\).`,
    answer: V1 + V2,
    steps: [`${V1} + ${V2} = ${V1 + V2}`],
  };
}

// ---------- 3. Signe d'une intégrale (mental) ----------
function genAutoSigneIntegraleMental() {
  const positive = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Automatismes — Calcul intégral",
    prompt: `Sur \\([a;b]\\) (a<b), \\(f ${positive ? "\\geqslant" : "\\leqslant"} 0\\). Signe de \\(\\int_a^b f\\) ?`,
    answer: positive ? "Positif" : "Négatif",
    options: ["Positif", "Négatif"],
    steps: [positive ? "Positif" : "Négatif"],
  };
}

// ---------- 4. Inverser les bornes (mental) ----------
function genAutoInverserBornesMental() {
  const V = randInt(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul intégral",
    prompt: `\\(\\int_a^b f = ${V}\\). Calcule \\(\\int_b^a f\\).`,
    answer: -V,
    steps: [`${-V}`],
  };
}

// ---------- 5. Intégrale et parité (mental) ----------
function genAutoIntegraleImpaireMental() {
  return {
    type: "qcm",
    chapter: "Automatismes — Calcul intégral",
    prompt: `f est impaire. Que vaut \\(\\int_{-a}^{a} f(x)\\,\\mathrm{d}x\\) ?`,
    answer: "0",
    options: ["0", "2a"],
    steps: ["0"],
  };
}

const CH_CALCUL_INTEGRAL_TS = [
  genAutoIntegraleConstanteMental,
  genAutoChaslesMental,
  genAutoSigneIntegraleMental,
  genAutoInverserBornesMental,
  genAutoIntegraleImpaireMental,
];

// =========================== Chapitre 12 : Loi binomiale ===========================
// (Mini-exercices "Calcul mental" en tête de page : espérance, variance,
// coefficient binomial.)

// ---------- 1. Espérance (mental) ----------
function genAutoEsperanceBinomialeMental() {
  const n = randInt(5, 40);
  const p = pick([0.1, 0.2, 0.25, 0.4, 0.5]);
  return {
    type: "numeric",
    chapter: "Automatismes — Loi binomiale",
    prompt: `\\(X \\sim \\mathcal{B}(${n};${fr(p)})\\). Calcule \\(E(X)\\).`,
    answer: roundTo(n * p, 4),
    tolerance: 0.01,
    steps: [`${n} \\times ${fr(p)} = ${fr(roundTo(n * p, 4))}`],
  };
}

// ---------- 2. Variance (mental) ----------
function genAutoVarianceBinomialeMental() {
  const n = randInt(5, 40);
  const p = pick([0.1, 0.2, 0.25, 0.4, 0.5]);
  const answer = roundTo(n * p * (1 - p), 4);
  return {
    type: "numeric",
    chapter: "Automatismes — Loi binomiale",
    prompt: `\\(X \\sim \\mathcal{B}(${n};${fr(p)})\\). Calcule \\(V(X)\\).`,
    answer,
    tolerance: 0.01,
    steps: [`${n} \\times ${fr(p)} \\times ${fr(roundTo(1 - p, 4))} = ${fr(answer)}`],
  };
}

// ---------- 3. Symétrie du coefficient binomial (mental) ----------
function genAutoSymetrieBinomialeMental() {
  const n = randInt(5, 12);
  const k = randInt(1, n - 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Loi binomiale",
    prompt: `\\(\\dbinom{${n}}{${k}} = ${combinaison(n, k)}\\). Donne \\(\\dbinom{${n}}{${n - k}}\\).`,
    answer: combinaison(n, k),
    steps: [`${combinaison(n, k)}`],
  };
}

// ---------- 4. Formule de la variance (mental) ----------
function genAutoFormuleVarianceMental() {
  return {
    type: "qcm",
    chapter: "Automatismes — Loi binomiale",
    prompt: `\\(X \\sim \\mathcal{B}(n;p)\\). Quelle est l'expression de \\(V(X)\\) ?`,
    answer: "np(1-p)",
    options: ["np(1-p)", "np"],
    steps: ["np(1-p)"],
  };
}

// ---------- 5. Identifier un schéma de Bernoulli (mental) ----------
function genAutoBernoulliMental() {
  const valide = Math.random() < 0.5;
  const description = valide
    ? "On répète 8 fois, de manière indépendante, une épreuve à deux issues de probabilité p constante."
    : "On tire 3 boules sans remise dans une urne.";
  return {
    type: "qcm",
    chapter: "Automatismes — Loi binomiale",
    prompt: `« ${description} » Ce schéma suit-il une loi binomiale ?`,
    answer: valide ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [valide ? "Oui" : "Non"],
  };
}

const CH_LOI_BINOMIALE_TS = [
  genAutoEsperanceBinomialeMental,
  genAutoVarianceBinomialeMental,
  genAutoSymetrieBinomialeMental,
  genAutoFormuleVarianceMental,
  genAutoBernoulliMental,
];

// =========================== Chapitre 13 : Sommes de variables aléatoires ===========================
// (Mini-exercices "Calcul mental" en tête de page : linéarité de
// l'espérance, variance d'une somme indépendante.)

// ---------- 1. Espérance linéaire (mental) ----------
function genAutoEsperanceLineaireMental() {
  const EX = randInt(-9, 9);
  const p = nonZero(-6, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Sommes de variables aléatoires",
    prompt: `\\(E(X) = ${EX}\\). Calcule \\(E(${p}X)\\).`,
    answer: p * EX,
    steps: [`${p} \\times ${EX} = ${p * EX}`],
  };
}

// ---------- 2. Variance d'une somme indépendante (mental) ----------
function genAutoVarianceSommeMental() {
  const VX = randInt(1, 15);
  const VY = randInt(1, 15);
  return {
    type: "numeric",
    chapter: "Automatismes — Sommes de variables aléatoires",
    prompt: `X, Y indépendantes, \\(V(X) = ${VX}\\), \\(V(Y) = ${VY}\\). Calcule \\(V(X+Y)\\).`,
    answer: VX + VY,
    steps: [`${VX} + ${VY} = ${VX + VY}`],
  };
}

// ---------- 3. Espérance d'une somme de n variables i.i.d. (mental) ----------
function genAutoEsperanceSommeNMental() {
  const EX1 = randInt(-9, 9);
  const n = randInt(3, 20);
  return {
    type: "numeric",
    chapter: "Automatismes — Sommes de variables aléatoires",
    prompt: `\\(X_1,\\ldots,X_${n}\\) suivent la même loi, \\(E(X_1) = ${EX1}\\). Calcule \\(E(X_1+\\cdots+X_${n})\\).`,
    answer: n * EX1,
    steps: [`${n} \\times ${EX1} = ${n * EX1}`],
  };
}

// ---------- 4. Variance et transformation affine (mental) ----------
function genAutoVarianceAffineMental() {
  const VX = randInt(1, 15);
  const a = nonZero(-6, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Sommes de variables aléatoires",
    prompt: `\\(V(X) = ${VX}\\). Calcule \\(V(${a}X)\\).`,
    answer: a * a * VX,
    steps: [`${a}^2 \\times ${VX} = ${a * a * VX}`],
  };
}

// ---------- 5. Vrai/faux variance et indépendance (mental) ----------
function genAutoVarianceIndependanceMental() {
  return {
    type: "qcm",
    chapter: "Automatismes — Sommes de variables aléatoires",
    prompt: `X, Y indépendantes. « \\(V(X-Y) = V(X) - V(Y)\\) » Vrai ou faux ?`,
    answer: "Faux",
    options: ["Vrai", "Faux"],
    steps: ["Faux : V(X-Y) = V(X) + V(Y) pour des variables indépendantes."],
  };
}

const CH_SOMMES_VARIABLES_ALEATOIRES_TS = [
  genAutoEsperanceLineaireMental,
  genAutoVarianceSommeMental,
  genAutoEsperanceSommeNMental,
  genAutoVarianceAffineMental,
  genAutoVarianceIndependanceMental,
];

// =========================== Chapitre 14 : Loi des grands nombres ===========================
// (Mini-exercices "Calcul mental" en tête de page : inégalités de Markov,
// Bienaymé-Tchebychev, concentration.)

// ---------- 1. Inégalité de Markov (mental) ----------
function genAutoMarkovMental() {
  const EX = randInt(1, 15);
  const a = randInt(EX + 1, EX + 15);
  return {
    type: "numeric",
    chapter: "Automatismes — Loi des grands nombres",
    prompt: `X positive, \\(E(X) = ${EX}\\). Majore \\(P(X \\geqslant ${a})\\) (fraction décimale, au millième).`,
    answer: roundTo(EX / a, 4),
    tolerance: 0.001,
    steps: [`\\dfrac{${EX}}{${a}} \\approx ${fr(roundTo(EX / a, 4))}`],
  };
}

// ---------- 2. Inégalité de Bienaymé-Tchebychev (mental) ----------
function genAutoBienaymeTchebychevMental() {
  const VX = randInt(1, 20);
  const a = randInt(1, 8);
  return {
    type: "numeric",
    chapter: "Automatismes — Loi des grands nombres",
    prompt: `\\(V(X) = ${VX}\\). Majore \\(P(|X-E(X)| \\geqslant ${a})\\) (au millième).`,
    answer: roundTo(VX / (a * a), 4),
    tolerance: 0.001,
    steps: [`\\dfrac{${VX}}{${a}^2} \\approx ${fr(roundTo(VX / (a * a), 4))}`],
  };
}

// ---------- 3. Variance de la moyenne empirique (mental) ----------
function genAutoVarianceMoyenneMental() {
  const VX = randInt(1, 60);
  const n = randInt(2, 20);
  return {
    type: "numeric",
    chapter: "Automatismes — Loi des grands nombres",
    prompt: `\\(V(X) = ${VX}\\), n = ${n}. Calcule \\(V(M_${n})\\) (au centième).`,
    answer: roundTo(VX / n, 4),
    tolerance: 0.01,
    steps: [`\\dfrac{${VX}}{${n}} \\approx ${fr(roundTo(VX / n, 4))}`],
  };
}

// ---------- 4. Condition d'application de Markov (mental) ----------
function genAutoConditionMarkovMental() {
  return {
    type: "qcm",
    chapter: "Automatismes — Loi des grands nombres",
    prompt: `L'inégalité de Markov nécessite-t-elle que X soit positive ?`,
    answer: "Oui",
    options: ["Oui", "Non"],
    steps: ["Oui"],
  };
}

// ---------- 5. Espérance de la moyenne empirique (mental) ----------
function genAutoEsperanceMoyenneMental() {
  return {
    type: "qcm",
    chapter: "Automatismes — Loi des grands nombres",
    prompt: `Comment s'exprime \\(E(M_n)\\) en fonction de \\(E(X)\\) ?`,
    answer: "E(M_n) = E(X)",
    options: ["E(M_n) = E(X)", "E(M_n) = nE(X)"],
    steps: ["E(M_n) = E(X)"],
  };
}

const CH_LOI_GRANDS_NOMBRES_TS = [
  genAutoMarkovMental,
  genAutoBienaymeTchebychevMental,
  genAutoVarianceMoyenneMental,
  genAutoConditionMarkovMental,
  genAutoEsperanceMoyenneMental,
];

const THEMES = [
  { id: "combinatoire-denombrement-terminale-spe", title: "Combinatoire et dénombrement", generators: CH_COMBINATOIRE_DENOMBREMENT_TS },
  { id: "vecteurs-droites-plans-espace-terminale-spe", title: "Vecteurs, droites et plans de l'espace", generators: CH_VECTEURS_DROITES_PLANS_ESPACE_TS },
  { id: "orthogonalite-distances-espace-terminale-spe", title: "Orthogonalité et distances dans l'espace", generators: CH_ORTHOGONALITE_DISTANCES_ESPACE_TS },
  { id: "suites-terminale-spe", title: "Suites", generators: CH_SUITES_TS },
  { id: "limites-fonctions-terminale-spe", title: "Limites de fonctions", generators: CH_LIMITES_FONCTIONS_TS },
  { id: "continuite-terminale-spe", title: "Continuité", generators: CH_CONTINUITE_TS },
  { id: "complements-derivation-terminale-spe", title: "Compléments sur la dérivation", generators: CH_COMPLEMENTS_DERIVATION_TS },
  { id: "logarithme-neperien-terminale-spe", title: "Logarithme népérien", generators: CH_LOGARITHME_NEPERIEN_TS },
  { id: "fonctions-trigonometriques-terminale-spe", title: "Fonctions trigonométriques", generators: CH_FONCTIONS_TRIGONOMETRIQUES_TS },
  { id: "primitives-equations-differentielles-terminale-spe", title: "Primitives, équations différentielles", generators: CH_PRIMITIVES_EQUATIONS_DIFFERENTIELLES_TS },
  { id: "calcul-integral-terminale-spe", title: "Calcul intégral", generators: CH_CALCUL_INTEGRAL_TS },
  { id: "loi-binomiale-terminale-spe", title: "Loi binomiale", generators: CH_LOI_BINOMIALE_TS },
  { id: "sommes-variables-aleatoires-terminale-spe", title: "Sommes de variables aléatoires", generators: CH_SOMMES_VARIABLES_ALEATOIRES_TS },
  { id: "loi-grands-nombres-terminale-spe", title: "Loi des grands nombres", generators: CH_LOI_GRANDS_NOMBRES_TS },
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
    id: "automatismes-terminale-spe",
    title: "Automatismes",
    description: "Calcul rapide et automatismes du programme de Terminale (spécialité mathématiques), chapitre après chapitre.",
    level: "terminale-spe",
    freemiumDaily: 5,
    order: 1,
    isAutomatismes: true,
  },
  themes: THEMES.map(({ id, title }) => ({ id, title })),
  generate,
};
