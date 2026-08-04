// ---------------------------------------------------------------------------
// Chapitre : Notion de vecteur (2nde) — sous abonnement.
//
// Correspond au chapitre 6 du manuel de 2nde : coordonnées d'un vecteur à
// partir de deux points, norme d'un vecteur, égalité de deux vecteurs,
// translation (image d'un point, antécédent, vecteur de translation),
// relation de Chasles, propriété du parallélogramme (AB = DC), vecteur
// opposé, somme de deux vecteurs, multiplication d'un vecteur par un
// scalaire, résolution d'une équation vectorielle simple.
// La correction du livre du professeur (exercices 15-30 : coordonnées,
// égalité de vecteurs, translations, Chasles, parallélogramme) a servi à
// identifier la méthode ; les nombres et noms de points sont générés
// aléatoirement à chaque tirage.
// Voir automatismes-seconde.js (thème "vecteurs-seconde") pour les
// mini-exercices "Calcul mental" associés.
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

const TRIPLETS_PYTHAGORICIENS = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [9, 12, 15],
  [7, 24, 25],
];

const nomsPoints = ["A", "B", "C", "D", "M", "N", "P"];
function points4() {
  return shuffle(nomsPoints).slice(0, 4);
}

const texVecteur = (nom) => `\\overrightarrow{${nom}}`;

// ---------- 1. Coordonnées d'un vecteur depuis deux points ----------
function genCoordonneesVecteurNumeric() {
  const [nomA, nomB] = points4();
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const xB = randInt(-10, 10);
  const yB = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Vecteurs — Coordonnées d'un vecteur",
    prompt: `On considère les points ${nomA}(${xA} ; ${yA}) et ${nomB}(${xB} ; ${yB}). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} du vecteur ${texVecteur(nomA + nomB)} ?`,
    answer: demanderAbscisse ? xB - xA : yB - yA,
    steps: [demanderAbscisse ? `x_{${texVecteur(nomA + nomB)}} = ${xB} - ${xA} = ${xB - xA}` : `y_{${texVecteur(nomA + nomB)}} = ${yB} - ${yA} = ${yB - yA}`],
  };
}

// ---------- 2. Norme d'un vecteur ----------
function genNormeVecteurNumeric() {
  const [nomA, nomB] = points4();
  const [dx, dy, norme] = pick(TRIPLETS_PYTHAGORICIENS);
  const signeX = pick([1, -1]);
  const signeY = pick([1, -1]);
  return {
    type: "numeric",
    chapter: "Vecteurs — Norme d'un vecteur",
    prompt: `Le repère est orthonormé. On considère le vecteur ${texVecteur(nomA + nomB)} de coordonnées \\((${signeX * dx} ; ${signeY * dy})\\). Calcule sa norme \\(\\|${texVecteur(nomA + nomB)}\\|\\).`,
    answer: norme,
    steps: [`\\|${texVecteur(nomA + nomB)}\\| = \\sqrt{${signeX * dx}^2 + ${signeY * dy}^2} = \\sqrt{${dx * dx} + ${dy * dy}} = ${norme}`],
  };
}

// ---------- 3. Deux vecteurs sont-ils égaux ? ----------
function genVecteursEgauxQCM() {
  const [nomA, nomB, nomC, nomD] = points4();
  const xA = randInt(-9, 9);
  const yA = randInt(-9, 9);
  const xB = randInt(-9, 9);
  const yB = randInt(-9, 9);
  const dx = xB - xA;
  const dy = yB - yA;
  const egaux = Math.random() < 0.5;
  const xC = randInt(-9, 9);
  const yC = randInt(-9, 9);
  const xD = egaux ? xC + dx : xC + dx + nonZero(1, 4);
  const yD = egaux ? yC + dy : yC + dy;
  return {
    type: "qcm",
    chapter: "Vecteurs — Égalité de vecteurs",
    prompt: `On considère ${nomA}(${xA} ; ${yA}), ${nomB}(${xB} ; ${yB}), ${nomC}(${xC} ; ${yC}) et ${nomD}(${xD} ; ${yD}). Les vecteurs ${texVecteur(nomA + nomB)} et ${texVecteur(nomC + nomD)} sont-ils égaux ?`,
    answer: egaux ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`${texVecteur(nomA + nomB)}(${dx} ; ${dy})`, `${texVecteur(nomC + nomD)}(${xD - xC} ; ${yD - yC})`, egaux ? "Mêmes coordonnées : les vecteurs sont égaux." : "Coordonnées différentes : les vecteurs ne sont pas égaux."],
  };
}

// ---------- 4. Image d'un point par une translation ----------
function genImageTranslationNumeric() {
  const [nomA, nomAprime] = points4();
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const dx = randInt(-10, 10);
  const dy = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  const xAprime = xA + dx;
  const yAprime = yA + dy;
  return {
    type: "numeric",
    chapter: "Vecteurs — Translations",
    prompt: `${nomAprime} est l'image du point ${nomA}(${xA} ; ${yA}) par la translation de vecteur \\(\\vec{u}(${dx} ; ${dy})\\). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de ${nomAprime} ?`,
    answer: demanderAbscisse ? xAprime : yAprime,
    steps: [demanderAbscisse ? `x_{${nomAprime}} = ${xA} + ${dx} = ${xAprime}` : `y_{${nomAprime}} = ${yA} + ${dy} = ${yAprime}`],
  };
}

// ---------- 5. Antécédent par une translation ----------
function genAntecedentTranslationNumeric() {
  const [nomA, nomAprime] = points4();
  const xAprime = randInt(-10, 10);
  const yAprime = randInt(-10, 10);
  const dx = randInt(-10, 10);
  const dy = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  const xA = xAprime - dx;
  const yA = yAprime - dy;
  return {
    type: "numeric",
    chapter: "Vecteurs — Translations",
    prompt: `${nomAprime}(${xAprime} ; ${yAprime}) est l'image du point ${nomA} par la translation de vecteur \\(\\vec{u}(${dx} ; ${dy})\\). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de ${nomA} ?`,
    answer: demanderAbscisse ? xA : yA,
    steps: [demanderAbscisse ? `x_{${nomA}} = ${xAprime} - ${dx} = ${xA}` : `y_{${nomA}} = ${yAprime} - ${dy} = ${yA}`],
  };
}

// ---------- 6. Vecteur de translation depuis un point et son image ----------
function genVecteurTranslationDepuisImageNumeric() {
  const [nomA, nomAprime] = points4();
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const xAprime = randInt(-10, 10);
  const yAprime = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Vecteurs — Translations",
    prompt: `${nomAprime}(${xAprime} ; ${yAprime}) est l'image du point ${nomA}(${xA} ; ${yA}) par la translation de vecteur \\(\\vec{u}\\). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de \\(\\vec{u}\\) ?`,
    answer: demanderAbscisse ? xAprime - xA : yAprime - yA,
    steps: [demanderAbscisse ? `x_{\\vec{u}} = ${xAprime} - ${xA} = ${xAprime - xA}` : `y_{\\vec{u}} = ${yAprime} - ${yA} = ${yAprime - yA}`],
  };
}

// ---------- 7. Relation de Chasles ----------
function genRelationChaslesNumeric() {
  const [nomA, nomB, nomC] = points4();
  const xAB = randInt(-10, 10);
  const yAB = randInt(-10, 10);
  const xBC = randInt(-10, 10);
  const yBC = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Vecteurs — Relation de Chasles",
    prompt: `Le vecteur ${texVecteur(nomA + nomB)} a pour coordonnées \\((${xAB} ; ${yAB})\\) et le vecteur ${texVecteur(nomB + nomC)} a pour coordonnées \\((${xBC} ; ${yBC})\\). D'après la relation de Chasles, ${texVecteur(nomA + nomB)} + ${texVecteur(nomB + nomC)} = ${texVecteur(nomA + nomC)}. Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de ${texVecteur(nomA + nomC)} ?`,
    answer: demanderAbscisse ? xAB + xBC : yAB + yBC,
    steps: [demanderAbscisse ? `x_{${texVecteur(nomA + nomC)}} = ${xAB} + ${xBC} = ${xAB + xBC}` : `y_{${texVecteur(nomA + nomC)}} = ${yAB} + ${yBC} = ${yAB + yBC}`],
  };
}

// ---------- 8. Trouver le 4e sommet d'un parallélogramme via AB = DC ----------
function genSommetParallelogrammeVecteurNumeric() {
  const [nomA, nomB, nomC, nomD] = points4();
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const xB = randInt(-10, 10);
  const yB = randInt(-10, 10);
  const xC = randInt(-10, 10);
  const yC = randInt(-10, 10);
  // ABCD parallélogramme ⟺ vecteur AB = vecteur DC ⟺ D = C - (B - A) = C - B + A.
  const xD = xC - xB + xA;
  const yD = yC - yB + yA;
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Vecteurs — Propriété du parallélogramme",
    prompt: `${nomA}${nomB}${nomC}${nomD} est un parallélogramme, avec ${nomA}(${xA} ; ${yA}), ${nomB}(${xB} ; ${yB}) et ${nomC}(${xC} ; ${yC}). On utilise la propriété ${texVecteur(nomA + nomB)} = ${texVecteur(nomD + nomC)}. Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de ${nomD} ?`,
    answer: demanderAbscisse ? xD : yD,
    steps: [
      `${texVecteur(nomA + nomB)}(${xB - xA} ; ${yB - yA})`,
      `${texVecteur(nomD + nomC)} = ${texVecteur(nomA + nomB)} \\text{, donc } (x_${nomC} - x_${nomD} ; y_${nomC} - y_${nomD}) = (${xB - xA} ; ${yB - yA})`,
      demanderAbscisse ? `x_${nomD} = ${xC} - (${xB - xA}) = ${xD}` : `y_${nomD} = ${yC} - (${yB - yA}) = ${yD}`,
    ],
  };
}

// ---------- 9. Coordonnées du vecteur opposé ----------
function genVecteurOpposeNumeric() {
  const [nomA, nomB] = points4();
  const x = randInt(-12, 12);
  const y = randInt(-12, 12);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Vecteurs — Vecteur opposé",
    prompt: `Le vecteur ${texVecteur(nomA + nomB)} a pour coordonnées \\((${x} ; ${y})\\). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} du vecteur opposé ${texVecteur(nomB + nomA)} ?`,
    answer: demanderAbscisse ? -x : -y,
    steps: [`\\text{Le vecteur opposé de } (x ; y) \\text{ est } (-x ; -y).`, demanderAbscisse ? `x_{${texVecteur(nomB + nomA)}} = -(${x}) = ${-x}` : `y_{${texVecteur(nomB + nomA)}} = -(${y}) = ${-y}`],
  };
}

// ---------- 10. Somme de deux vecteurs ----------
function genSommeDeuxVecteursNumeric() {
  const xU = randInt(-10, 10);
  const yU = randInt(-10, 10);
  const xV = randInt(-10, 10);
  const yV = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Vecteurs — Somme de vecteurs",
    prompt: `\\(\\vec{u}(${xU} ; ${yU})\\) et \\(\\vec{v}(${xV} ; ${yV})\\). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} du vecteur \\(\\vec{u} + \\vec{v}\\) ?`,
    answer: demanderAbscisse ? xU + xV : yU + yV,
    steps: [demanderAbscisse ? `x_{\\vec{u}+\\vec{v}} = ${xU} + ${xV} = ${xU + xV}` : `y_{\\vec{u}+\\vec{v}} = ${yU} + ${yV} = ${yU + yV}`],
  };
}

// ---------- 11. Comparer les normes de deux vecteurs ----------
function genComparerNormesQCM() {
  const xU = randInt(-10, 10);
  const yU = randInt(-10, 10);
  let xV = randInt(-10, 10);
  let yV = randInt(-10, 10);
  let n2U = xU * xU + yU * yU;
  let n2V = xV * xV + yV * yV;
  while (n2V === n2U) {
    xV = randInt(-10, 10);
    yV = randInt(-10, 10);
    n2V = xV * xV + yV * yV;
  }
  const plusGrand = n2U > n2V ? "\\vec{u}" : "\\vec{v}";
  return {
    type: "qcm",
    chapter: "Vecteurs — Norme d'un vecteur",
    prompt: `\\(\\vec{u}(${xU} ; ${yU})\\) et \\(\\vec{v}(${xV} ; ${yV})\\). Quel vecteur a la plus grande norme ?`,
    answer: plusGrand,
    options: ["\\vec{u}", "\\vec{v}"],
    steps: [`\\|\\vec{u}\\|^2 = ${xU}^2 + ${yU}^2 = ${n2U}`, `\\|\\vec{v}\\|^2 = ${xV}^2 + ${yV}^2 = ${n2V}`, `\\text{Le plus grand carré de norme donne la plus grande norme : } ${plusGrand}.`],
  };
}

// ---------- 12. Résoudre une équation vectorielle simple ----------
function genResoudreEquationVectorielleNumeric() {
  const [nomA, nomB] = points4();
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const xVecteurCible = randInt(-10, 10);
  const yVecteurCible = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  const xB = xA + xVecteurCible;
  const yB = yA + yVecteurCible;
  return {
    type: "numeric",
    chapter: "Vecteurs — Résolution d'une équation vectorielle",
    prompt: `On considère le point ${nomA}(${xA} ; ${yA}) et le vecteur \\(\\vec{u}(${xVecteurCible} ; ${yVecteurCible})\\). Détermine ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} du point ${nomB} tel que ${texVecteur(nomA + nomB)} = \\(\\vec{u}\\).`,
    answer: demanderAbscisse ? xB : yB,
    steps: [demanderAbscisse ? `x_${nomB} - x_${nomA} = ${xVecteurCible} \\text{, donc } x_${nomB} = ${xA} + ${xVecteurCible} = ${xB}` : `y_${nomB} - y_${nomA} = ${yVecteurCible} \\text{, donc } y_${nomB} = ${yA} + ${yVecteurCible} = ${yB}`],
  };
}

// ---------- 13. Multiplier un vecteur par un nombre ----------
function genMultiplierVecteurParScalaireNumeric() {
  const x = randInt(-8, 8);
  const y = randInt(-8, 8);
  const k = nonZero(-4, 4);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Vecteurs — Multiplication par un nombre",
    prompt: `\\(\\vec{u}(${x} ; ${y})\\). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} du vecteur \\(${k}\\vec{u}\\) ?`,
    answer: demanderAbscisse ? k * x : k * y,
    steps: [demanderAbscisse ? `${k} \\times ${x} = ${k * x}` : `${k} \\times ${y} = ${k * y}`],
  };
}

// ---------- 14. Vrai ou faux sur les propriétés des vecteurs ----------
function genIdentifierProprieteVecteurQCM() {
  const cas = pick([
    { affirmation: "Deux vecteurs égaux sont nécessairement représentés par le même segment (les mêmes points).", reponse: "Faux" },
    { affirmation: "Deux vecteurs égaux ont la même norme.", reponse: "Vrai" },
    { affirmation: "Deux vecteurs opposés ont la même norme.", reponse: "Vrai" },
    { affirmation: "Deux vecteurs opposés ont le même sens.", reponse: "Faux" },
    { affirmation: "Si M est le milieu de [AB], alors les vecteurs AM et MB sont égaux.", reponse: "Vrai" },
    { affirmation: "Le vecteur nul a une norme égale à 1.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Vecteurs — Propriétés",
    prompt: `Affirmation : « ${cas.affirmation} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse === "Vrai" ? "Cette affirmation est correcte." : "Cette affirmation est incorrecte."],
  };
}

// ---------- 15. Sens de deux vecteurs colinéaires ----------
function genSensVecteursColineairesQCM() {
  const x = nonZero(-6, 6);
  const y = nonZero(-6, 6);
  const k = nonZero(-4, 4);
  const memeSens = k > 0;
  return {
    type: "qcm",
    chapter: "Vecteurs — Direction et sens",
    prompt: `\\(\\vec{u}(${x} ; ${y})\\) et \\(\\vec{v}(${k * x} ; ${k * y})\\). On a \\(\\vec{v} = ${k}\\vec{u}\\). Les vecteurs \\(\\vec{u}\\) et \\(\\vec{v}\\) ont-ils le même sens ?`,
    answer: memeSens ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [memeSens ? `${k} > 0 : les vecteurs ont la même direction et le même sens.` : `${k} < 0 : les vecteurs ont la même direction mais un sens opposé.`],
  };
}

const GENERATORS = [
  genCoordonneesVecteurNumeric,
  genNormeVecteurNumeric,
  genVecteursEgauxQCM,
  genImageTranslationNumeric,
  genAntecedentTranslationNumeric,
  genVecteurTranslationDepuisImageNumeric,
  genRelationChaslesNumeric,
  genSommetParallelogrammeVecteurNumeric,
  genVecteurOpposeNumeric,
  genSommeDeuxVecteursNumeric,
  genComparerNormesQCM,
  genResoudreEquationVectorielleNumeric,
  genMultiplierVecteurParScalaireNumeric,
  genIdentifierProprieteVecteurQCM,
  genSensVecteursColineairesQCM,
];

const DIFFICULTY = {
  genCoordonneesVecteurNumeric: "facile",
  genNormeVecteurNumeric: "facile",
  genVecteursEgauxQCM: "facile",
  genImageTranslationNumeric: "facile",
  genVecteurOpposeNumeric: "facile",
  genSommeDeuxVecteursNumeric: "facile",
  genMultiplierVecteurParScalaireNumeric: "facile",
  genAntecedentTranslationNumeric: "standard",
  genVecteurTranslationDepuisImageNumeric: "standard",
  genRelationChaslesNumeric: "standard",
  genSommetParallelogrammeVecteurNumeric: "standard",
  genComparerNormesQCM: "standard",
  genIdentifierProprieteVecteurQCM: "standard",
  genResoudreEquationVectorielleNumeric: "expert",
  genSensVecteursColineairesQCM: "expert",
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
    id: "vecteurs-seconde",
    title: "Notion de vecteur",
    description: "Coordonnées et norme d'un vecteur, égalité de vecteurs, translations, relation de Chasles, propriété du parallélogramme, vecteur opposé, somme et produit par un nombre.",
    pourquoi: "Les vecteurs décrivent un déplacement (direction, sens, longueur) — le langage de base de la physique (forces, vitesses) et de l'informatique graphique.",
    level: "seconde",
    free: false,
    order: 8,
  },
  generate,
};
