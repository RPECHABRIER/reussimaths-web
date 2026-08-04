// ---------------------------------------------------------------------------
// Chapitre : Variations globales (Première, enseignement mathématique non
// spé) — sous abonnement.
//
// Correspond au chapitre 6 du programme d'enseignement mathématique de
// première (non spécialité) : fonction dérivée de fonctions affines et de
// fonctions polynomiales du second/troisième degré simples (règles de
// dérivation par linéarité, dérivée de x², de x³), recherche des tangentes
// horizontales en résolvant f'(x) = 0, lien entre le signe de f' et le sens
// de variation de f (tableau de signes / tableau de variations), recherche
// d'extremums, lecture de tableaux de signes de f' déjà donnés.
// La correction du livre du professeur (source .tex, exercices 4-30 :
// Automatismes méthodes 1-4 sur la fonction dérivée et l'étude des
// variations) a servi à identifier la méthode ; les nombres et contextes
// sont générés aléatoirement à chaque tirage.
// Voir automatismes-premiere-non-spe.js (thème
// "variations-globales-premiere-non-spe") pour les mini-exercices
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

// Écrit "ax + b" avec gestion des signes et des cas particuliers a=±1, b=0.
function texAffine(a, b) {
  const termeA = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  if (b === 0) return termeA;
  return `${termeA} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`;
}

// Écrit "ax² + bx + c" avec gestion des signes et des coefficients nuls.
function texTrinome(a, b, c) {
  const parts = [];
  if (a !== 0) parts.push(a === 1 ? "x^2" : a === -1 ? "-x^2" : `${a}x^2`);
  if (b !== 0) parts.push(`${b >= 0 && parts.length > 0 ? "+ " : b >= 0 ? "" : "- "}${b === 1 && parts.length === 0 ? "x" : b === -1 && parts.length === 0 ? "-x" : `${Math.abs(b) === 1 ? "" : Math.abs(b)}x`}`);
  if (c !== 0 || parts.length === 0) parts.push(`${c >= 0 && parts.length > 0 ? "+ " : c >= 0 ? "" : "- "}${Math.abs(c)}`);
  return parts.join(" ");
}

// ---------- 1. Dérivée d'une fonction affine ----------
function genDeriveeFonctionAffineNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = nonZero(-9, 9);
  const b = randInt(-15, 15);
  return {
    type: "numeric",
    chapter: "Variations globales — Fonction dérivée",
    prompt: `On considère la fonction ${nomFonction} définie par \\(${nomFonction}(x) = ${texAffine(a, b)}\\). Donne le coefficient de x dans l'expression de \\(${nomFonction}'(x)\\).`,
    answer: a,
    steps: [`\\text{La dérivée d'une fonction affine } x \\mapsto ax+b \\text{ est la fonction constante } x \\mapsto a.`, `${nomFonction}'(x) = ${a}`],
  };
}

// ---------- 2. Dérivée d'un trinôme ax² + bx + c ----------
function genDeriveeTrinomeQCM() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = nonZero(-6, 6);
  const b = nonZero(-9, 9);
  const c = randInt(-10, 10);
  const bonneReponse = texAffine(2 * a, b);
  const candidats = [texAffine(a, b), texAffine(2 * a, b + c), texAffine(2 * a, 0)];
  const optionsSet = new Set([bonneReponse]);
  for (const cand of candidats) {
    if (optionsSet.size >= 3) break;
    optionsSet.add(cand);
  }
  return {
    type: "qcm",
    chapter: "Variations globales — Fonction dérivée",
    prompt: `On considère la fonction ${nomFonction} définie par \\(${nomFonction}(x) = ${texTrinome(a, b, c)}\\). Quelle est l'expression de \\(${nomFonction}'(x)\\) ?`,
    answer: bonneReponse,
    options: shuffle([...optionsSet]),
    steps: [`${nomFonction}'(x) = ${2 * a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${bonneReponse}`],
  };
}

// ---------- 3. Calculer f'(x) pour une valeur particulière de x ----------
function genCalculerValeurDeriveeNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = nonZero(-6, 6);
  const b = nonZero(-9, 9);
  const x = randInt(-6, 6);
  const answer = 2 * a * x + b;
  return {
    type: "numeric",
    chapter: "Variations globales — Fonction dérivée",
    prompt: `La fonction dérivée de ${nomFonction} est \\(${nomFonction}'(x) = ${texAffine(2 * a, b)}\\). Calcule \\(${nomFonction}'(${x})\\).`,
    answer,
    steps: [`${nomFonction}'(${x}) = ${2 * a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}`],
  };
}

// ---------- 4. Trouver l'abscisse d'une tangente horizontale (f'(x) = 2ax + b = 0) ----------
function genAbscisseTangenteHorizontaleNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = nonZero(-6, 6);
  const x0 = randInt(-8, 8);
  const b = -2 * a * x0;
  return {
    type: "numeric",
    chapter: "Variations globales — Tangentes horizontales",
    prompt: `La fonction dérivée de ${nomFonction} est \\(${nomFonction}'(x) = ${texAffine(2 * a, b)}\\). En quel point d'abscisse la courbe représentative de ${nomFonction} admet-elle une tangente horizontale ?`,
    answer: x0,
    steps: [`${texAffine(2 * a, b)} = 0`, `x = ${x0}`],
  };
}

// ---------- 5. Résoudre f'(x) = 3ax² - k = 0 (deux tangentes horizontales symétriques) ----------
function genDeuxTangentesHorizontalesNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = pick([1, 2, 3]);
  const r = randInt(2, 8);
  const k = 3 * a * r * r;
  const demandeNegative = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Variations globales — Tangentes horizontales",
    prompt: `La fonction dérivée de ${nomFonction} est \\(${nomFonction}'(x) = ${3 * a}x^2 - ${k}\\). La courbe représentative de ${nomFonction} admet deux tangentes horizontales, aux points d'abscisses opposées. Donne ${demandeNegative ? "la valeur négative" : "la valeur positive"}.`,
    answer: demandeNegative ? -r : r,
    steps: [`${3 * a}x^2 = ${k}`, `x^2 = ${r * r}`, `x = ${r} \\text{ ou } x = ${-r}`],
  };
}

// ---------- 6. Sens de variation depuis le signe de la dérivée (fonction affine) ----------
function genSensVariationDepuisSigneDeriveeQCM() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const positive = a > 0;
  return {
    type: "qcm",
    chapter: "Variations globales — Sens de variation",
    prompt: `La fonction dérivée de ${nomFonction} est \\(${nomFonction}'(x) = ${texAffine(a, b)}\\) sur un intervalle où elle garde un signe ${positive ? "positif" : "négatif"} constant. Quel est le sens de variation de ${nomFonction} sur cet intervalle ?`,
    answer: positive ? "croissante" : "décroissante",
    options: ["croissante", "décroissante"],
    steps: [positive ? `${nomFonction}' > 0 \\text{ donc } ${nomFonction} \\text{ est croissante.}` : `${nomFonction}' < 0 \\text{ donc } ${nomFonction} \\text{ est décroissante.}`],
  };
}

// ---------- 7. Fonction strictement croissante sur R (dérivée toujours strictement positive) ----------
function genStrictementCroissanteSurRQCM() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = pick([1, 2, 3]);
  const k = randInt(1, 15);
  return {
    type: "qcm",
    chapter: "Variations globales — Sens de variation",
    prompt: `La fonction dérivée de ${nomFonction} est \\(${nomFonction}'(x) = ${a}x^2 + ${k}\\). Peut-on affirmer que ${nomFonction} est strictement croissante sur \\(\\mathbb{R}\\) ?`,
    answer: "Oui",
    options: ["Oui", "Non"],
    steps: [`\\text{Pour tout réel } x, \\ x^2 \\geqslant 0 \\text{ donc } ${a}x^2 \\geqslant 0 \\text{ et } ${a}x^2 + ${k} \\geqslant ${k} > 0.`, `${nomFonction}' \\text{ est donc strictement positive sur } \\mathbb{R} : ${nomFonction} \\text{ est strictement croissante sur } \\mathbb{R}.`],
  };
}

// ---------- 8. Lire un tableau de signes de f' et en déduire le sens de variation ----------
function genLireTableauSignesQCM() {
  const nomFonction = pick(["f", "g", "h"]);
  const borne = randInt(-5, 5);
  const positifAvant = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Variations globales — Sens de variation",
    prompt: `Le tableau de signes de \\(${nomFonction}'\\) montre que \\(${nomFonction}'(x)\\) est ${positifAvant ? "positive" : "négative"} sur \\(]-\\infty ; ${borne}]\\) et ${positifAvant ? "négative" : "positive"} sur \\([${borne} ; +\\infty[\\). Que peut-on en déduire sur ${nomFonction} au point d'abscisse ${borne} ?`,
    answer: positifAvant ? `${nomFonction} \\text{ admet un maximum en } ${borne}` : `${nomFonction} \\text{ admet un minimum en } ${borne}`,
    options: [`${nomFonction} \\text{ admet un maximum en } ${borne}`, `${nomFonction} \\text{ admet un minimum en } ${borne}`],
    steps: [positifAvant ? `${nomFonction} \\text{ est croissante puis décroissante : elle admet un maximum en } ${borne}.` : `${nomFonction} \\text{ est décroissante puis croissante : elle admet un minimum en } ${borne}.`],
  };
}

// ---------- 9. Propriété de linéarité de la dérivation (λf)' = λf' ----------
function genLineariteDerivationNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const lambda = nonZero(-6, 6);
  const fprimeX = nonZero(-8, 8);
  const x = randInt(-5, 5);
  const answer = lambda * fprimeX;
  return {
    type: "numeric",
    chapter: "Variations globales — Fonction dérivée",
    prompt: `On sait que \\(${nomFonction}'(${x}) = ${fprimeX}\\). On considère la fonction \\(k(x) = ${lambda} \\times ${nomFonction}(x)\\). Calcule \\(k'(${x})\\), sachant que \\(k' = ${lambda} \\times ${nomFonction}'\\).`,
    answer,
    steps: [`k'(${x}) = ${lambda} \\times ${nomFonction}'(${x}) = ${lambda} \\times ${fprimeX} = ${answer}`],
  };
}

// ---------- 10. Nombre de tangentes horizontales selon le signe du discriminant réduit ----------
function genNombreTangentesHorizontalesQCM() {
  const cas = pick([
    { description: "f'(x) = 2x² + 5, qui ne s'annule jamais (toujours strictement positive).", nombre: "aucune" },
    { description: "f'(x) = 3x, qui s'annule une seule fois, en x = 0.", nombre: "une seule" },
    { description: "f'(x) = x² - 16, qui s'annule pour x = -4 et x = 4.", nombre: "deux" },
  ]);
  return {
    type: "qcm",
    chapter: "Variations globales — Tangentes horizontales",
    prompt: `On donne : \\(${cas.description}\\) Combien la courbe représentative de f admet-elle de tangentes horizontales ?`,
    answer: cas.nombre,
    options: ["aucune", "une seule", "deux"],
    steps: [`\\text{Le nombre de tangentes horizontales est égal au nombre de solutions de } f'(x) = 0.`],
  };
}

// ---------- 11. Vrai ou faux sur la fonction dérivée et les variations ----------
function genVraiFauxVariationsQCM() {
  const cas = pick([
    { description: "Si f'(x) > 0 sur un intervalle, alors f est strictement croissante sur cet intervalle.", reponse: "Vrai" },
    { description: "Si f'(a) = 0, alors f admet nécessairement un extremum en a.", reponse: "Faux" },
    { description: "Deux fonctions qui diffèrent d'une constante ont la même fonction dérivée.", reponse: "Vrai" },
    { description: "La dérivée d'une fonction constante est toujours égale à cette même constante.", reponse: "Faux" },
    { description: "Si f' change de signe en changeant de croissante à décroissante, cela correspond à un minimum de f.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Variations globales — Sens de variation",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse === "Vrai" ? "Cette affirmation est correcte." : "Cette affirmation est incorrecte."],
  };
}

// ---------- 12. Dérivée de la fonction cube (x³)' = 3x² ----------
function genDeriveeFonctionCubeNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const lambda = nonZero(-5, 5);
  const x = randInt(-4, 4);
  const answer = lambda * 3 * x * x;
  return {
    type: "numeric",
    chapter: "Variations globales — Fonction dérivée",
    prompt: `On considère la fonction ${nomFonction} définie par \\(${nomFonction}(x) = ${lambda === 1 ? "" : lambda === -1 ? "-" : lambda}x^3\\). Sachant que la dérivée de \\(x \\mapsto x^3\\) est \\(x \\mapsto 3x^2\\), calcule \\(${nomFonction}'(${x})\\).`,
    answer,
    steps: [`${nomFonction}'(x) = ${lambda} \\times 3x^2 = ${lambda * 3}x^2`, `${nomFonction}'(${x}) = ${lambda * 3} \\times ${x}^2 = ${answer}`],
  };
}

// ---------- 13. Signe de l'équation réduite de la tangente horizontale (image du point) ----------
function genOrdonneeTangenteHorizontaleNumeric() {
  const nomFonction = pick(["f", "g", "h"]);
  const x0 = randInt(-6, 6);
  const y0 = randInt(-20, 20);
  return {
    type: "numeric",
    chapter: "Variations globales — Tangentes horizontales",
    prompt: `La courbe représentative de ${nomFonction} admet une tangente horizontale au point d'abscisse ${x0}, et on sait que \\(${nomFonction}(${x0}) = ${y0}\\). Donne l'équation réduite de cette tangente sous la forme \\(y = k\\) : quelle est la valeur de k ?`,
    answer: y0,
    steps: [`\\text{Une tangente horizontale a pour équation } y = ${nomFonction}(${x0}) = ${y0}`],
  };
}

// ---------- 14. Comparer les fonctions dérivées de deux fonctions qui diffèrent d'une constante ----------
function genComparerDeriveesConstanteQCM() {
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  let c = randInt(-10, 10);
  while (c === b) c = randInt(-10, 10);
  return {
    type: "qcm",
    chapter: "Variations globales — Fonction dérivée",
    prompt: `On considère \\(f(x) = ${texAffine(a, b)}\\) et \\(g(x) = ${texAffine(a, c)}\\) (elles ne diffèrent que par leur terme constant). Que peut-on dire de leurs fonctions dérivées \\(f'\\) et \\(g'\\) ?`,
    answer: "f' = g'",
    options: ["f' = g'", "f' \\neq g'"],
    steps: [`\\text{La dérivée d'une constante étant nulle, ajouter une constante ne change pas la dérivée : } f'(x) = g'(x) = ${a}.`],
  };
}

// ---------- 15. Calcul du signe de f'(x) pour une valeur donnée (fonction affine) ----------
function genSigneDeriveeValeurQCM() {
  const nomFonction = pick(["f", "g", "h"]);
  const a = nonZero(-6, 6);
  const x0 = randInt(-8, 8);
  const b = -a * x0 + nonZero(-3, 3);
  const valeur = a * x0 + b;
  return {
    type: "qcm",
    chapter: "Variations globales — Sens de variation",
    prompt: `La fonction dérivée de ${nomFonction} est \\(${nomFonction}'(x) = ${texAffine(a, b)}\\). Quel est le signe de \\(${nomFonction}'(${x0})\\) ?`,
    answer: valeur > 0 ? "positif" : valeur < 0 ? "négatif" : "nul",
    options: ["positif", "négatif", "nul"],
    steps: [`${nomFonction}'(${x0}) = ${a} \\times ${x0} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${valeur}`],
  };
}

const GENERATORS = [
  genDeriveeFonctionAffineNumeric,
  genDeriveeTrinomeQCM,
  genCalculerValeurDeriveeNumeric,
  genAbscisseTangenteHorizontaleNumeric,
  genDeuxTangentesHorizontalesNumeric,
  genSensVariationDepuisSigneDeriveeQCM,
  genStrictementCroissanteSurRQCM,
  genLireTableauSignesQCM,
  genLineariteDerivationNumeric,
  genNombreTangentesHorizontalesQCM,
  genVraiFauxVariationsQCM,
  genDeriveeFonctionCubeNumeric,
  genOrdonneeTangenteHorizontaleNumeric,
  genComparerDeriveesConstanteQCM,
  genSigneDeriveeValeurQCM,
];

const DIFFICULTY = {
  genDeriveeFonctionAffineNumeric: "facile",
  genCalculerValeurDeriveeNumeric: "facile",
  genSensVariationDepuisSigneDeriveeQCM: "facile",
  genStrictementCroissanteSurRQCM: "facile",
  genLireTableauSignesQCM: "facile",
  genSigneDeriveeValeurQCM: "facile",
  genDeriveeTrinomeQCM: "standard",
  genAbscisseTangenteHorizontaleNumeric: "standard",
  genLineariteDerivationNumeric: "standard",
  genNombreTangentesHorizontalesQCM: "standard",
  genVraiFauxVariationsQCM: "standard",
  genDeriveeFonctionCubeNumeric: "standard",
  genDeuxTangentesHorizontalesNumeric: "expert",
  genOrdonneeTangenteHorizontaleNumeric: "expert",
  genComparerDeriveesConstanteQCM: "expert",
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
    id: "variations-globales-premiere-non-spe",
    title: "Variations globales",
    description: "Fonction dérivée (fonctions affines, trinômes, fonction cube), recherche des tangentes horizontales, lien entre le signe de la dérivée et le sens de variation, extremums, linéarité de la dérivation.",
    pourquoi: "Le nombre dérivé et la fonction dérivée permettent de savoir à quel rythme une quantité évolue à un instant donné : vitesse, croissance, rentabilité.",
    level: "premiere-non-spe",
    free: false,
    order: 7,
  },
  generate,
};
