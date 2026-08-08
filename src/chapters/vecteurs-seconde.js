// ---------------------------------------------------------------------------
// Chapitre : Notion de vecteur (2nde) — sous abonnement.
//
// NOTE (audit programme 2026, 3.6 / 3.7) : ajout de la caractérisation
// vectorielle du milieu d'un segment (\(\overrightarrow{AM} = \overrightarrow{MB}\),
// genCaracterisationMilieuVectorielNumeric) et de la représentation d'un
// vecteur comme combinaison linéaire de deux vecteurs non colinéaires
// (genCombinaisonLineaireVecteursNumeric), deux ajouts du programme 2026.
//
// NOTE (audit programme 2026, 5.1) : le programme 2026 déplace une partie du
// travail sur les vecteurs et la translation vers le cycle 4 (5e/4e). Les
// générateurs genImageTranslationNumeric, genAntecedentTranslationNumeric,
// genVecteurTranslationDepuisImageNumeric et genRelationChaslesNumeric sont
// conservés ici car les élèves qui entrent en 2nde à la rentrée 2026 n'auront
// pas bénéficié du nouveau programme de cycle 4 sur les vecteurs (celui-ci
// n'entre en vigueur qu'à partir de la 5e 2026, donc ces élèves l'atteindront
// au mieux en 4e/3e sur 2027-2028) : ce n'est qu'à l'horizon 2028-2029, quand
// une cohorte complète aura suivi le nouveau cycle 4, que ce rappel en 2nde
// deviendra redondant et pourra être retiré.
//
// Correspond au chapitre 6 du manuel de 2nde : coordonnées d'un vecteur à
// partir de deux points, norme d'un vecteur, égalité de deux vecteurs,
// translation (image d'un point, antécédent, vecteur de translation),
// relation de Chasles, propriété du parallélogramme (AB = DC), vecteur
// opposé, somme de deux vecteurs, multiplication d'un vecteur par un
// scalaire, résolution d'une équation vectorielle simple, caractérisation
// vectorielle du milieu, combinaison linéaire de deux vecteurs non colinéaires.
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
    steps: [
      { type: "regle", text: `\\text{Les coordonnées du vecteur } \\overrightarrow{AB} \\text{ sont } (x_B - x_A ; y_B - y_A).` },
      { type: "resultat", text: demanderAbscisse ? `x_{${texVecteur(nomA + nomB)}} = ${xB} - ${xA} = ${xB - xA}` : `y_{${texVecteur(nomA + nomB)}} = ${yB} - ${yA} = ${yB - yA}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Dans un repère orthonormé, la norme d'un vecteur } (x ; y) \\text{ vaut } \\sqrt{x^2 + y^2} \\text{ (théorème de Pythagore).}` },
      { type: "resultat", text: `\\|${texVecteur(nomA + nomB)}\\| = \\sqrt{${signeX * dx}^2 + ${signeY * dy}^2} = \\sqrt{${dx * dx} + ${dy * dy}} = ${norme}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Deux vecteurs sont égaux si et seulement si ils ont les mêmes coordonnées.}` },
      { type: "calcul", text: `${texVecteur(nomA + nomB)}(${dx} ; ${dy})` },
      { type: "calcul", text: `${texVecteur(nomC + nomD)}(${xD - xC} ; ${yD - yC})` },
      { type: "resultat", text: egaux ? `\\text{Mêmes coordonnées : les vecteurs sont égaux.}` : `\\text{Coordonnées différentes : les vecteurs ne sont pas égaux.}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{L'image d'un point } (x ; y) \\text{ par la translation de vecteur } (dx ; dy) \\text{ a pour coordonnées } (x + dx ; y + dy).` },
      { type: "resultat", text: demanderAbscisse ? `x_{${nomAprime}} = ${xA} + ${dx} = ${xAprime}` : `y_{${nomAprime}} = ${yA} + ${dy} = ${yAprime}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Si } (x' ; y') \\text{ est l'image de } (x ; y) \\text{ par la translation de vecteur } (dx ; dy), \\text{ alors } (x ; y) = (x' - dx ; y' - dy) \\text{ (on inverse la translation).}` },
      { type: "resultat", text: demanderAbscisse ? `x_{${nomA}} = ${xAprime} - ${dx} = ${xA}` : `y_{${nomA}} = ${yAprime} - ${dy} = ${yA}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Le vecteur de translation qui envoie A sur A' est } \\overrightarrow{AA'}(x_{A'} - x_A ; y_{A'} - y_A).` },
      { type: "resultat", text: demanderAbscisse ? `x_{\\vec{u}} = ${xAprime} - ${xA} = ${xAprime - xA}` : `y_{\\vec{u}} = ${yAprime} - ${yA} = ${yAprime - yA}` },
    ],
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
    steps: [{ type: "calcul", text: demanderAbscisse ? `x_{${texVecteur(nomA + nomC)}} = ${xAB} + ${xBC} = ${xAB + xBC}` : `y_{${texVecteur(nomA + nomC)}} = ${yAB} + ${yBC} = ${yAB + yBC}` }],
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
      { type: "calcul", text: `${texVecteur(nomA + nomB)}(${xB - xA} ; ${yB - yA})` },
      { type: "calcul", text: `${texVecteur(nomD + nomC)} = ${texVecteur(nomA + nomB)} \\text{, donc } (x_${nomC} - x_${nomD} ; y_${nomC} - y_${nomD}) = (${xB - xA} ; ${yB - yA})` },
      { type: "resultat", text: demanderAbscisse ? `x_${nomD} = ${xC} - (${xB - xA}) = ${xD}` : `y_${nomD} = ${yC} - (${yB - yA}) = ${yD}` },
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
    steps: [
      { type: "regle", text: `\\text{Le vecteur opposé de } (x ; y) \\text{ est } (-x ; -y).` },
      { type: "resultat", text: demanderAbscisse ? `x_{${texVecteur(nomB + nomA)}} = -(${x}) = ${-x}` : `y_{${texVecteur(nomB + nomA)}} = -(${y}) = ${-y}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Pour additionner deux vecteurs, on additionne leurs coordonnées une à une.}` },
      { type: "resultat", text: demanderAbscisse ? `x_{\\vec{u}+\\vec{v}} = ${xU} + ${xV} = ${xU + xV}` : `y_{\\vec{u}+\\vec{v}} = ${yU} + ${yV} = ${yU + yV}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Comme la fonction carré est croissante sur } [0 ; +\\infty[, \\text{ comparer deux normes (positives) revient à comparer leurs carrés, ce qui évite de calculer des racines carrées.}` },
      { type: "calcul", text: `\\|\\vec{u}\\|^2 = ${xU}^2 + ${yU}^2 = ${n2U}` },
      { type: "calcul", text: `\\|\\vec{v}\\|^2 = ${xV}^2 + ${yV}^2 = ${n2V}` },
      { type: "resultat", text: `\\text{Le plus grand carré de norme donne la plus grande norme : } ${plusGrand}.` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{L'égalité } \\overrightarrow{AB} = \\vec{u} \\text{ signifie que les coordonnées de } \\overrightarrow{AB} \\text{ sont celles de } \\vec{u} : x_B - x_A = x_{\\vec{u}}, \\ y_B - y_A = y_{\\vec{u}}.` },
      { type: "resultat", text: demanderAbscisse ? `x_${nomB} - x_${nomA} = ${xVecteurCible} \\text{, donc } x_${nomB} = ${xA} + ${xVecteurCible} = ${xB}` : `y_${nomB} - y_${nomA} = ${yVecteurCible} \\text{, donc } y_${nomB} = ${yA} + ${yVecteurCible} = ${yB}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Multiplier un vecteur } (x ; y) \\text{ par un nombre } k \\text{ multiplie chacune de ses coordonnées par } k : (kx ; ky).` },
      { type: "resultat", text: demanderAbscisse ? `${k} \\times ${x} = ${k * x}` : `${k} \\times ${y} = ${k * y}` },
    ],
  };
}

// ---------- 14. Vrai ou faux sur les propriétés des vecteurs ----------
function genIdentifierProprieteVecteurQCM() {
  const cas = pick([
    {
      affirmation: "Deux vecteurs égaux sont nécessairement représentés par le même segment (les mêmes points).",
      reponse: "Faux",
      explication: `\\text{Deux vecteurs sont égaux dès qu'ils ont la même direction, le même sens et la même longueur : ils peuvent être portés par des points différents (translation d'un même vecteur).}`,
    },
    {
      affirmation: "Deux vecteurs égaux ont la même norme.",
      reponse: "Vrai",
      explication: `\\text{Deux vecteurs égaux ont les mêmes coordonnées, donc la même longueur (norme) : c'est vrai.}`,
    },
    {
      affirmation: "Deux vecteurs opposés ont la même norme.",
      reponse: "Vrai",
      explication: `\\text{Le vecteur opposé de } (x ; y) \\text{ est } (-x ; -y) : \\text{ sa norme } \\sqrt{(-x)^2+(-y)^2} = \\sqrt{x^2+y^2} \\text{ est identique.}`,
    },
    {
      affirmation: "Deux vecteurs opposés ont le même sens.",
      reponse: "Faux",
      explication: `\\text{Deux vecteurs opposés ont la même direction et la même norme, mais des sens opposés (l'un pointe dans un sens, l'autre dans le sens contraire).}`,
    },
    {
      affirmation: "Si M est le milieu de [AB], alors les vecteurs AM et MB sont égaux.",
      reponse: "Vrai",
      explication: `\\text{M étant le milieu, } AM = MB \\text{ (même longueur), et } \\overrightarrow{AM} \\text{ et } \\overrightarrow{MB} \\text{ pointent dans la même direction et le même sens (de A vers B) : ils sont égaux.}`,
    },
    {
      affirmation: "Le vecteur nul a une norme égale à 1.",
      reponse: "Faux",
      explication: `\\text{Le vecteur nul a pour coordonnées } (0 ; 0), \\text{ donc sa norme vaut } \\sqrt{0^2+0^2} = 0, \\text{ pas 1.}`,
    },
  ]);
  return {
    type: "qcm",
    chapter: "Vecteurs — Propriétés",
    prompt: `Affirmation : « ${cas.affirmation} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "resultat", text: cas.explication }],
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
    steps: [
      { type: "regle", text: `\\text{Si } \\vec{v} = k\\vec{u} \\text{ avec } k \\neq 0, \\text{ les vecteurs ont toujours la même direction. Ils ont le même sens si } k > 0, \\text{ et un sens opposé si } k < 0.` },
      { type: "resultat", text: memeSens ? `${k} > 0 : \\text{ les vecteurs ont le même sens.}` : `${k} < 0 : \\text{ les vecteurs ont un sens opposé.}` },
    ],
  };
}

// ---------- 16. Caractérisation vectorielle du milieu d'un segment ----------
function genCaracterisationMilieuVectorielNumeric() {
  const [nomA, nomB, nomM] = points4();
  const xM = randInt(-10, 10);
  const yM = randInt(-10, 10);
  const dx = nonZero(-8, 8);
  const dy = nonZero(-8, 8);
  const xA = xM - dx;
  const yA = yM - dy;
  const xB = xM + dx;
  const yB = yM + dy;
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Vecteurs — Caractérisation du milieu",
    prompt: `${nomM} est le point du plan tel que \\(\\overrightarrow{${nomA}${nomM}} = \\overrightarrow{${nomM}${nomB}}\\), avec ${nomA}(${xA} ; ${yA}) et ${nomB}(${xB} ; ${yB}). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de ${nomM} ?`,
    answer: demanderAbscisse ? xM : yM,
    steps: [
      { type: "regle", text: `\\text{L'égalité } \\overrightarrow{AM} = \\overrightarrow{MB} \\text{ caractérise le fait que M est le } \\textbf{milieu} \\text{ du segment } [AB] : \\text{ elle équivaut, coordonnée par coordonnée, à } x_M - x_A = x_B - x_M, \\text{ soit } x_M = \\dfrac{x_A + x_B}{2}.` },
      { type: "resultat", text: demanderAbscisse ? `x_${nomM} = \\dfrac{${xA} + ${xB}}{2} = ${xM}` : `y_${nomM} = \\dfrac{${yA} + ${yB}}{2} = ${yM}` },
    ],
  };
}

// ---------- 17. Combinaison linéaire de deux vecteurs non colinéaires ----------
function genCombinaisonLineaireVecteursNumeric() {
  let xu, yu, xv, yv;
  do {
    xu = nonZero(-4, 4);
    yu = nonZero(-4, 4);
    xv = nonZero(-4, 4);
    yv = nonZero(-4, 4);
  } while (xu * yv - xv * yu === 0);
  const a = nonZero(-3, 3);
  const b = nonZero(-3, 3);
  const xw = a * xu + b * xv;
  const yw = a * yu + b * yv;
  const demanderA = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Vecteurs — Combinaison linéaire",
    prompt: `\\(\\vec{u}(${xu} ; ${yu})\\) et \\(\\vec{v}(${xv} ; ${yv})\\) sont deux vecteurs non colinéaires. Le vecteur \\(\\vec{w}(${xw} ; ${yw})\\) s'écrit de façon unique \\(\\vec{w} = a\\vec{u} + b\\vec{v}\\). Quelle est la valeur de ${demanderA ? "a" : "b"} ?`,
    answer: demanderA ? a : b,
    steps: [
      { type: "regle", text: `\\text{Comme } \\vec{u} \\text{ et } \\vec{v} \\text{ ne sont pas colinéaires, tout vecteur du plan s'écrit de façon unique comme combinaison linéaire } a\\vec{u} + b\\vec{v}. \\text{ On identifie les coordonnées pour former un système.}` },
      { type: "calcul", text: `\\begin{cases} ${xu}a + ${xv}b = ${xw} \\\\ ${yu}a + ${yv}b = ${yw} \\end{cases}` },
      { type: "resultat", text: demanderA ? `a = ${a}` : `b = ${b}` },
    ],
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
  genCaracterisationMilieuVectorielNumeric,
  genCombinaisonLineaireVecteursNumeric,
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
  genCaracterisationMilieuVectorielNumeric: "standard",
  genResoudreEquationVectorielleNumeric: "expert",
  genSensVecteursColineairesQCM: "expert",
  genCombinaisonLineaireVecteursNumeric: "expert",
};

function generate(difficulty) {
  if (difficulty) {
    const pool = GENERATORS.filter((fn) => (DIFFICULTY[fn.name] ?? "standard") === difficulty);
    if (pool.length) return pick(pool)();
  }
  return pick(GENERATORS)();
}

// ===================== Figures pour le Cours (carte mentale) =====================
// Pas de helper de figure existant dans ce fichier avant (les exercices restent
// purement numériques). Vecteurs dessinés comme des segments finis fléchés
// (extend: 0 pour ne pas prolonger au-delà des deux points, arrowEnd: true).
function buildCoursVecteurFigure(pts, vectors = [], segments = []) {
  const scale = 20;
  const toX = (v) => v * scale;
  const toY = (v) => -v * scale;
  const points = pts.map((p) => ({
    id: p.id,
    x: toX(p.x),
    y: toY(p.y),
    label: p.label ?? p.id,
    dx: p.dx ?? 8,
    dy: p.dy ?? -8,
    hideDot: p.hideDot,
    hideLabel: p.hideLabel,
  }));
  const lines = vectors.map((v) => ({ from: v.from, to: v.to, extend: 0, arrowEnd: true }));
  return { points, lines, segments };
}

export default {
  meta: {
    id: "vecteurs-seconde",
    title: "Notion de vecteur",
    description: "Coordonnées et norme d'un vecteur, égalité de vecteurs, translations, relation de Chasles, propriété du parallélogramme, vecteur opposé, somme et produit par un nombre, caractérisation vectorielle du milieu, combinaison linéaire de deux vecteurs.",
    pourquoi: "Les vecteurs décrivent un déplacement (direction, sens, longueur) — le langage de base de la physique (forces, vitesses) et de l'informatique graphique.",
    level: "seconde",
    free: false,
    order: 8,
    cours: {
      mindMap: {
        title: "Notion de vecteur",
        branches: [
          {
            title: "Un vecteur : direction, sens, longueur",
            items: [
              "\\(\\overrightarrow{AB}\\) est caractérisé par trois éléments : sa direction (droite (AB)), son sens (de A vers B) et sa longueur (\\(\\|\\overrightarrow{AB}\\|=AB\\)).",
              "Piège classique : \\(\\overrightarrow{AB}\\) et \\(\\overrightarrow{BA}\\) ont la même longueur mais un sens opposé — ce ne sont pas le même vecteur.",
            ],
            figure: buildCoursVecteurFigure([{ id: "A", x: 0, y: 1, dx: -10, dy: 8 }, { id: "B", x: 4, y: 3 }], [{ from: "A", to: "B" }]),
          },
          {
            title: "Coordonnées et norme d'un vecteur",
            items: [
              "Les coordonnées de \\(\\overrightarrow{AB}\\) s'obtiennent en soustrayant les coordonnées de A à celles de B (arrivée moins départ).",
              "La norme se calcule avec Pythagore, comme une distance.",
              "Pour comparer deux normes sans calculer de racine carrée, il suffit de comparer leurs carrés.",
            ],
            formula: "\\(\\overrightarrow{AB}\\begin{pmatrix}x_B-x_A\\\\y_B-y_A\\end{pmatrix}\\), \\(\\|\\overrightarrow{AB}\\| = \\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}\\)",
            figure: buildCoursVecteurFigure(
              [{ id: "A", x: 0, y: 0, dx: -10, dy: 10 }, { id: "B", x: 5, y: 3 }, { id: "H", x: 5, y: 0, hideDot: true, hideLabel: true }],
              [{ from: "A", to: "B" }],
              [{ from: "A", to: "H", dashed: true }, { from: "H", to: "B", dashed: true }]
            ),
          },
          {
            title: "Translation d'un point",
            items: [
              "L'image A' d'un point A(x ; y) par la translation de vecteur \\(\\vec{u}(dx ; dy)\\) a pour coordonnées \\((x+dx ; y+dy)\\).",
              "Pour retrouver l'antécédent A connaissant l'image A', on inverse : \\(x = x' - dx,\\ y = y' - dy\\).",
              "Le vecteur de translation qui envoie A sur A' est \\(\\overrightarrow{AA'}\\).",
            ],
            formula: "\\(A'(x+dx ; y+dy)\\)",
            figure: buildCoursVecteurFigure([{ id: "A", x: 0, y: 0, dx: -10, dy: 10 }, { id: "Aprime", x: 4, y: 2, label: "A'" }], [{ from: "A", to: "Aprime" }]),
          },
          {
            title: "Égalité de vecteurs, relation de Chasles",
            items: [
              "Deux vecteurs sont égaux s'ils ont même direction, même sens et même longueur (peu importe leur position).",
              "La relation de Chasles permet de décomposer un trajet en étapes.",
            ],
            formula: "\\(\\overrightarrow{AB}+\\overrightarrow{BC}=\\overrightarrow{AC}\\)",
            figure: buildCoursVecteurFigure(
              [{ id: "A", x: 0, y: 0, dx: -10, dy: 10 }, { id: "B", x: 3, y: 1, dy: 10 }, { id: "C", x: 5, y: 3 }],
              [{ from: "A", to: "B" }, { from: "B", to: "C" }, { from: "A", to: "C" }]
            ),
          },
          {
            title: "Propriété du parallélogramme",
            items: [
              "ABCD est un parallélogramme si et seulement si \\(\\overrightarrow{AB}=\\overrightarrow{DC}\\).",
              "Piège classique : bien respecter l'ordre des lettres — c'est \\(\\overrightarrow{DC}\\), pas \\(\\overrightarrow{CD}\\).",
            ],
            figure: buildCoursVecteurFigure(
              [{ id: "A", x: 0, y: 0, dx: -10, dy: 10 }, { id: "B", x: 4, y: 0, dy: 12 }, { id: "C", x: 5, y: 3 }, { id: "D", x: 1, y: 3, dx: -12, dy: -8 }],
              [{ from: "A", to: "B" }, { from: "D", to: "C" }],
              [{ from: "B", to: "C" }, { from: "A", to: "D" }]
            ),
          },
          {
            title: "Caractérisation vectorielle du milieu",
            items: [
              "M est le milieu de \\([AB]\\) si et seulement si \\(\\overrightarrow{AM} = \\overrightarrow{MB}\\) (même vecteur, donc même direction, même sens et même longueur).",
            ],
            formula: "\\(\\overrightarrow{AM}=\\overrightarrow{MB} \\iff x_M = \\dfrac{x_A+x_B}{2}\\), \\(y_M = \\dfrac{y_A+y_B}{2}\\)",
            figure: buildCoursVecteurFigure(
              [{ id: "A", x: 0, y: 0, dx: -10, dy: 10 }, { id: "M", x: 2, y: 1, dy: 10 }, { id: "B", x: 4, y: 2 }],
              [{ from: "A", to: "M" }, { from: "M", to: "B" }]
            ),
          },
          {
            title: "Opérations sur les vecteurs : opposé, somme, multiplication",
            items: [
              "\\(-\\overrightarrow{u}\\) a la même longueur mais le sens opposé ; \\(k\\overrightarrow{u}\\) a la même direction, une longueur multipliée par \\(|k|\\), et le sens opposé si k < 0.",
              "Pour additionner deux vecteurs, on additionne leurs coordonnées une à une : \\((x_1;y_1)+(x_2;y_2)=(x_1+x_2 ; y_1+y_2)\\).",
            ],
            figure: buildCoursVecteurFigure(
              [
                { id: "O", x: 0, y: 0, hideLabel: true, dx: -4, dy: 10 },
                { id: "A", x: 2, y: 1, label: "u", dy: 10 },
                { id: "B", x: 4, y: 2, label: "2u" },
                { id: "C", x: -2, y: -1, label: "-u", dx: -16, dy: 6 },
              ],
              [{ from: "O", to: "A" }, { from: "O", to: "B" }, { from: "O", to: "C" }]
            ),
          },
          {
            title: "Combinaison linéaire de deux vecteurs",
            items: [
              "Si \\(\\vec{u}\\) et \\(\\vec{v}\\) ne sont pas colinéaires, tout vecteur \\(\\vec{w}\\) du plan s'écrit de façon unique \\(\\vec{w} = a\\vec{u}+b\\vec{v}\\).",
              "Pour trouver a et b, on identifie les coordonnées : cela donne un système de deux équations à résoudre.",
            ],
            formula: "\\(\\vec{w} = a\\vec{u}+b\\vec{v}\\)",
            figure: buildCoursVecteurFigure(
              [
                { id: "O", x: 0, y: 0, hideLabel: true, dx: -4, dy: 10 },
                { id: "U", x: 3, y: 1, label: "u", dy: 10 },
                { id: "V", x: 1, y: 3, label: "v", dx: -14, dy: -6 },
                { id: "W", x: 4, y: 4, label: "w" },
              ],
              [{ from: "O", to: "U" }, { from: "O", to: "V" }, { from: "O", to: "W" }]
            ),
          },
        ],
      },
    },
  },
  generate,
};
