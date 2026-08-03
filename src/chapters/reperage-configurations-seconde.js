// ---------------------------------------------------------------------------
// Chapitre : Repérage et configurations dans le plan (2nde) — sous abonnement.
//
// Correspond au chapitre 5 du manuel de 2nde : coordonnées d'un point dans un
// repère (orthogonal, orthonormé, quelconque), coordonnées du milieu d'un
// segment, distance entre deux points dans un repère orthonormé, alignement
// de trois points, reconnaissance d'un parallélogramme via le milieu commun
// des diagonales, réciproque du théorème de Pythagore en repère, centre de
// gravité (isobarycentre) d'un triangle.
// La correction du livre du professeur (exercices 16-33 : milieux, distances,
// alignement, parallélogrammes, type de repère) a servi à identifier la
// méthode ; les coordonnées sont générées aléatoirement à chaque tirage, en
// s'appuyant sur des triplets pythagoriciens pour garder des distances
// entières lorsque c'est pertinent.
// Voir automatismes-seconde.js (thème "reperage-configurations-seconde")
// pour les mini-exercices "Calcul mental" associés.
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
  [20, 21, 29],
];

function pythagoreanTriple() {
  const [a, b, c] = pick(TRIPLETS_PYTHAGORICIENS);
  return Math.random() < 0.5 ? [a, b, c] : [b, a, c];
}

const nomsPoints = ["A", "B", "C", "D", "M", "N", "P"];
function points4() {
  return shuffle(nomsPoints).slice(0, 4);
}

// ---------- 1. Coordonnées du milieu d'un segment ----------
function genCoordonneesMilieuNumeric() {
  const [nomA, nomB, nomM] = points4();
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const xB = randInt(-10, 10);
  const yB = randInt(-10, 10);
  const demanderAbscisse = Math.random() < 0.5;
  const xM = (xA + xB) / 2;
  const yM = (yA + yB) / 2;
  return {
    type: "numeric",
    chapter: "Repérage — Coordonnées du milieu",
    prompt: `On considère les points ${nomA}(${xA} ; ${yA}) et ${nomB}(${xB} ; ${yB}). ${nomM} est le milieu du segment [${nomA}${nomB}]. Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de ${nomM} ?`,
    answer: demanderAbscisse ? xM : yM,
    steps: [demanderAbscisse ? `x_${nomM} = \\dfrac{${xA} + ${xB}}{2} = ${xM}` : `y_${nomM} = \\dfrac{${yA} + ${yB}}{2} = ${yM}`],
  };
}

// ---------- 2. Distance entre deux points dans un repère orthonormé ----------
function genCalculDistanceNumeric() {
  const [nomA, nomB] = points4();
  const [dx, dy, dist] = pythagoreanTriple();
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const signeX = pick([1, -1]);
  const signeY = pick([1, -1]);
  const xB = xA + signeX * dx;
  const yB = yA + signeY * dy;
  return {
    type: "numeric",
    chapter: "Repérage — Distance entre deux points",
    prompt: `Le repère est orthonormé. On considère les points ${nomA}(${xA} ; ${yA}) et ${nomB}(${xB} ; ${yB}). Calcule la distance ${nomA}${nomB}.`,
    answer: dist,
    steps: [`${nomA}${nomB} = \\sqrt{(${xB} - ${xA})^2 + (${yB} - ${yA})^2} = \\sqrt{${signeX * dx}^2 + ${signeY * dy}^2} = \\sqrt{${dx * dx} + ${dy * dy}} = ${dist}`],
  };
}

// ---------- 3. Reconnaître si trois points sont alignés ----------
function genReconnaitreAlignementQCM() {
  const [nomA, nomB, nomC] = points4();
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const dx = nonZero(-4, 4);
  const dy = nonZero(-4, 4);
  const alignes = Math.random() < 0.5;
  let k1 = nonZero(-3, 3);
  let k2 = nonZero(-3, 3);
  while (k2 === k1) k2 = nonZero(-3, 3);
  const xB = xA + k1 * dx;
  const yB = yA + k1 * dy;
  let xC, yC;
  if (alignes) {
    xC = xA + k2 * dx;
    yC = yA + k2 * dy;
  } else {
    xC = xA + k2 * dx + nonZero(1, 3);
    yC = yA + k2 * dy;
  }
  // Vérification par produit en croix (ce sont des coordonnées entières simples, pas de souci d'arrondi).
  const produitCroise = (xB - xA) * (yC - yA) - (yB - yA) * (xC - xA);
  const reponse = produitCroise === 0 ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "Repérage — Alignement de points",
    prompt: `On considère les points ${nomA}(${xA} ; ${yA}), ${nomB}(${xB} ; ${yB}) et ${nomC}(${xC} ; ${yC}). Ces trois points sont-ils alignés ?`,
    answer: reponse,
    options: ["Oui", "Non"],
    steps: [reponse === "Oui" ? `Le vecteur ${nomA}${nomC} est colinéaire au vecteur ${nomA}${nomB} : les points sont alignés.` : `Le vecteur ${nomA}${nomC} n'est pas colinéaire au vecteur ${nomA}${nomB} : les points ne sont pas alignés.`],
  };
}

// ---------- 4. Reconnaître un parallélogramme via le milieu commun des diagonales ----------
function genReconnaitreParallelogrammeQCM() {
  const [nomA, nomB, nomC, nomD] = points4();
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const xB = randInt(-8, 8);
  const yB = randInt(-8, 8);
  const xC = randInt(-8, 8);
  const yC = randInt(-8, 8);
  const estParallelogramme = Math.random() < 0.5;
  // Pour ABCD parallélogramme, il faut que les diagonales [AC] et [BD] aient le même milieu, donc D = A + C - B.
  const xD_correct = xA + xC - xB;
  const yD_correct = yA + yC - yB;
  const xD = estParallelogramme ? xD_correct : xD_correct + nonZero(1, 4);
  const yD = estParallelogramme ? yD_correct : yD_correct;
  return {
    type: "qcm",
    chapter: "Repérage — Reconnaître un parallélogramme",
    prompt: `On considère les points ${nomA}(${xA} ; ${yA}), ${nomB}(${xB} ; ${yB}), ${nomC}(${xC} ; ${yC}) et ${nomD}(${xD} ; ${yD}). Le quadrilatère ${nomA}${nomB}${nomC}${nomD} est-il un parallélogramme ?`,
    answer: estParallelogramme ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      `\\text{Milieu de } [${nomA}${nomC}] = \\left(\\dfrac{${xA}+${xC}}{2} ; \\dfrac{${yA}+${yC}}{2}\\right)`,
      `\\text{Milieu de } [${nomB}${nomD}] = \\left(\\dfrac{${xB}+${xD}}{2} ; \\dfrac{${yB}+${yD}}{2}\\right)`,
      estParallelogramme ? `Les deux diagonales ont le même milieu : ${nomA}${nomB}${nomC}${nomD} est un parallélogramme.` : `Les deux diagonales n'ont pas le même milieu : ${nomA}${nomB}${nomC}${nomD} n'est pas un parallélogramme.`,
    ],
  };
}

// ---------- 5. Type de repère depuis sa description ----------
function genTypeRepereDepuisDescriptionQCM() {
  const angleDroit = Math.random() < 0.7;
  const memeUnite = Math.random() < 0.5;
  const uniteX = memeUnite ? randInt(1, 3) : randInt(1, 3);
  const uniteY = memeUnite ? uniteX : uniteX + nonZero(1, 3);
  let reponse;
  if (!angleDroit) reponse = "ni orthogonal ni orthonormé";
  else if (uniteX === uniteY) reponse = "orthonormé";
  else reponse = "orthogonal (mais pas orthonormé)";
  return {
    type: "qcm",
    chapter: "Repérage — Types de repères",
    prompt: `Dans un repère (O, I, J), l'angle \\(\\widehat{IOJ}\\) mesure ${angleDroit ? "90°" : `${pick([60, 70, 100, 120])}°`}, avec OI = ${uniteX} cm et OJ = ${uniteY} cm. Comment qualifier ce repère ?`,
    answer: reponse,
    options: ["orthonormé", "orthogonal (mais pas orthonormé)", "ni orthogonal ni orthonormé"],
    steps: [
      !angleDroit
        ? `Les axes ne sont pas perpendiculaires : le repère n'est ni orthogonal ni orthonormé.`
        : uniteX === uniteY
          ? `Les axes sont perpendiculaires et les unités sont égales (OI = OJ) : le repère est orthonormé.`
          : `Les axes sont perpendiculaires mais les unités sont différentes (OI ≠ OJ) : le repère est orthogonal mais pas orthonormé.`,
    ],
  };
}

// ---------- 6. Vrai ou faux : droite parallèle à un axe ----------
function genVraiFauxParalleleAxeQCM() {
  const [nomA, nomB] = points4();
  const axeAbscisses = Math.random() < 0.5;
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const parallele = Math.random() < 0.5;
  let xB, yB;
  if (axeAbscisses) {
    yB = parallele ? yA : yA + nonZero(1, 4);
    xB = xA + nonZero(1, 6);
  } else {
    xB = parallele ? xA : xA + nonZero(1, 4);
    yB = yA + nonZero(1, 6);
  }
  return {
    type: "qcm",
    chapter: "Repérage — Droites parallèles aux axes",
    prompt: `On considère les points ${nomA}(${xA} ; ${yA}) et ${nomB}(${xB} ; ${yB}). La droite (${nomA}${nomB}) est-elle parallèle à l'axe des ${axeAbscisses ? "abscisses" : "ordonnées"} ?`,
    answer: parallele ? "Vrai" : "Faux",
    options: ["Vrai", "Faux"],
    steps: [
      axeAbscisses
        ? parallele
          ? `${nomA} et ${nomB} ont la même ordonnée (${yA}) : la droite est parallèle à l'axe des abscisses.`
          : `${nomA} et ${nomB} n'ont pas la même ordonnée (${yA} ≠ ${yB}) : la droite n'est pas parallèle à l'axe des abscisses.`
        : parallele
          ? `${nomA} et ${nomB} ont la même abscisse (${xA}) : la droite est parallèle à l'axe des ordonnées.`
          : `${nomA} et ${nomB} n'ont pas la même abscisse (${xA} ≠ ${xB}) : la droite n'est pas parallèle à l'axe des ordonnées.`,
    ],
  };
}

// ---------- 7. Trouver le 4e sommet d'un parallélogramme ----------
function genTroisiemeSommetParallelogrammeNumeric() {
  const [nomA, nomB, nomC, nomD] = points4();
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const xB = randInt(-10, 10);
  const yB = randInt(-10, 10);
  const xC = randInt(-10, 10);
  const yC = randInt(-10, 10);
  const xD = xA + xC - xB;
  const yD = yA + yC - yB;
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Repérage — Reconnaître un parallélogramme",
    prompt: `${nomA}${nomB}${nomC}${nomD} est un parallélogramme, avec ${nomA}(${xA} ; ${yA}), ${nomB}(${xB} ; ${yB}) et ${nomC}(${xC} ; ${yC}). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de ${nomD} ?`,
    answer: demanderAbscisse ? xD : yD,
    steps: [`\\text{Les diagonales } [${nomA}${nomC}] \\text{ et } [${nomB}${nomD}] \\text{ ont le même milieu, donc } ${nomD} = ${nomA} + ${nomC} - ${nomB}.`, demanderAbscisse ? `x_${nomD} = ${xA} + ${xC} - ${xB} = ${xD}` : `y_${nomD} = ${yA} + ${yC} - ${yB} = ${yD}`],
  };
}

// ---------- 8. Triangle rectangle via la réciproque du théorème de Pythagore ----------
function genTriangleRectangleReciproquePythagoreQCM() {
  const [nomA, nomB, nomC] = points4();
  const estRectangle = Math.random() < 0.5;
  const [a, b, c] = pick(TRIPLETS_PYTHAGORICIENS);
  let AB2, AC2, BC2;
  if (estRectangle) {
    AB2 = a * a;
    AC2 = b * b;
    BC2 = c * c;
  } else {
    AB2 = a * a;
    AC2 = b * b;
    BC2 = c * c + nonZero(1, 10);
  }
  return {
    type: "qcm",
    chapter: "Repérage — Réciproque de Pythagore",
    prompt: `Dans le triangle ${nomA}${nomB}${nomC}, on a calculé \\(${nomA}${nomB}^2 = ${AB2}\\), \\(${nomA}${nomC}^2 = ${AC2}\\) et \\(${nomB}${nomC}^2 = ${BC2}\\). Ce triangle est-il rectangle en ${nomA} ?`,
    answer: estRectangle ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      `${nomA}${nomB}^2 + ${nomA}${nomC}^2 = ${AB2} + ${AC2} = ${AB2 + AC2}`,
      estRectangle
        ? `${nomB}${nomC}^2 = ${BC2} = ${nomA}${nomB}^2 + ${nomA}${nomC}^2 : d'après la réciproque du théorème de Pythagore, le triangle est rectangle en ${nomA}.`
        : `${nomB}${nomC}^2 = ${BC2} \\neq ${AB2 + AC2} : le triangle n'est pas rectangle en ${nomA}.`,
    ],
  };
}

// ---------- 9. Périmètre d'un triangle rectangle depuis ses coordonnées ----------
function genPerimetreTriangleNumeric() {
  const [nomA, nomB, nomC] = points4();
  const [a, b, c] = pick(TRIPLETS_PYTHAGORICIENS);
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const xB = xA + a;
  const yB = yA;
  const xC = xA;
  const yC = yA + b;
  const perimetre = a + b + c;
  return {
    type: "numeric",
    chapter: "Repérage — Distance entre deux points",
    prompt: `Le repère est orthonormé. On considère les points ${nomA}(${xA} ; ${yA}), ${nomB}(${xB} ; ${yB}) et ${nomC}(${xC} ; ${yC}). Calcule le périmètre du triangle ${nomA}${nomB}${nomC}.`,
    answer: perimetre,
    steps: [`${nomA}${nomB} = ${a}`, `${nomA}${nomC} = ${b}`, `${nomB}${nomC} = \\sqrt{${a}^2 + ${b}^2} = ${c}`, `\\text{Périmètre} = ${a} + ${b} + ${c} = ${perimetre}`],
  };
}

// ---------- 10. Trouver un point à partir de son milieu ----------
function genPointMilieuVersACoordinateNumeric() {
  const [nomA, nomB, nomM] = points4();
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  const xM = randInt(-10, 10);
  const yM = randInt(-10, 10);
  const xB = 2 * xM - xA;
  const yB = 2 * yM - yA;
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Repérage — Coordonnées du milieu",
    prompt: `${nomM}(${xM} ; ${yM}) est le milieu du segment [${nomA}${nomB}], avec ${nomA}(${xA} ; ${yA}). Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de ${nomB} ?`,
    answer: demanderAbscisse ? xB : yB,
    steps: [demanderAbscisse ? `x_${nomB} = 2 \\times ${xM} - ${xA} = ${xB}` : `y_${nomB} = 2 \\times ${yM} - ${yA} = ${yB}`],
  };
}

// ---------- 11. Distance d'un point à l'origine ----------
function genDistanceOrigineNumeric() {
  const [nomA] = points4();
  const [dx, dy, dist] = pythagoreanTriple();
  const x = pick([1, -1]) * dx;
  const y = pick([1, -1]) * dy;
  return {
    type: "numeric",
    chapter: "Repérage — Distance entre deux points",
    prompt: `Le repère est orthonormé d'origine O. On considère le point ${nomA}(${x} ; ${y}). Calcule la distance O${nomA}.`,
    answer: dist,
    steps: [`O${nomA} = \\sqrt{${x}^2 + ${y}^2} = \\sqrt{${dx * dx} + ${dy * dy}} = ${dist}`],
  };
}

// ---------- 12. Comparer deux distances (quel point est le plus proche) ----------
function genComparerDistancesQCM() {
  const [nomP, nomQ1, nomQ2] = points4();
  const xP = randInt(-8, 8);
  const yP = randInt(-8, 8);
  const xQ1 = randInt(-8, 8);
  const yQ1 = randInt(-8, 8);
  let xQ2 = randInt(-8, 8);
  let yQ2 = randInt(-8, 8);
  const d1carre = (xQ1 - xP) ** 2 + (yQ1 - yP) ** 2;
  let d2carre = (xQ2 - xP) ** 2 + (yQ2 - yP) ** 2;
  while (d2carre === d1carre) {
    xQ2 = randInt(-8, 8);
    yQ2 = randInt(-8, 8);
    d2carre = (xQ2 - xP) ** 2 + (yQ2 - yP) ** 2;
  }
  const plusProche = d1carre < d2carre ? nomQ1 : nomQ2;
  return {
    type: "qcm",
    chapter: "Repérage — Distance entre deux points",
    prompt: `Le repère est orthonormé. On considère les points ${nomP}(${xP} ; ${yP}), ${nomQ1}(${xQ1} ; ${yQ1}) et ${nomQ2}(${xQ2} ; ${yQ2}). Quel point est le plus proche de ${nomP} ?`,
    answer: plusProche,
    options: [nomQ1, nomQ2],
    steps: [`${nomP}${nomQ1}^2 = ${d1carre}`, `${nomP}${nomQ2}^2 = ${d2carre}`, `\\text{Le plus proche est celui dont la distance au carré est la plus petite : } ${plusProche}.`],
  };
}

// ---------- 13. Centre de gravité (isobarycentre) d'un triangle ----------
function genCentreGraviteNumeric() {
  const [nomA, nomB, nomC, nomG] = points4();
  // On choisit d'abord le centre de gravité G, puis A et B librement, puis on déduit C = 3G - A - B :
  // cela garantit un résultat toujours entier, sans avoir à ajuster des restes après coup.
  const xG = randInt(-8, 8);
  const yG = randInt(-8, 8);
  const xA = randInt(-9, 9);
  const yA = randInt(-9, 9);
  const xB = randInt(-9, 9);
  const yB = randInt(-9, 9);
  const xC = 3 * xG - xA - xB;
  const yC = 3 * yG - yA - yB;
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Repérage — Centre de gravité",
    prompt: `On considère le triangle ${nomA}${nomB}${nomC} avec ${nomA}(${xA} ; ${yA}), ${nomB}(${xB} ; ${yB}) et ${nomC}(${xC} ; ${yC}). ${nomG} est le centre de gravité de ce triangle. Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de ${nomG} ?`,
    answer: demanderAbscisse ? xG : yG,
    steps: [demanderAbscisse ? `x_${nomG} = \\dfrac{${xA} + ${xB} + ${xC}}{3} = ${xG}` : `y_${nomG} = \\dfrac{${yA} + ${yB} + ${yC}}{3} = ${yG}`],
  };
}

// ---------- 14. Symétrique d'un point par rapport à l'origine ----------
function genSymetriqueOrigineNumeric() {
  const [nomA, nomAprime] = points4();
  const x = randInt(-12, 12);
  const y = randInt(-12, 12);
  const demanderAbscisse = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Repérage — Symétrie par rapport à l'origine",
    prompt: `${nomAprime} est le symétrique du point ${nomA}(${x} ; ${y}) par rapport à l'origine O du repère. Quelle est ${demanderAbscisse ? "l'abscisse" : "l'ordonnée"} de ${nomAprime} ?`,
    answer: demanderAbscisse ? -x : -y,
    steps: [`\\text{Le symétrique de } (x ; y) \\text{ par rapport à O est } (-x ; -y).`, demanderAbscisse ? `x_{${nomAprime}} = -${x} = ${-x}` : `y_{${nomAprime}} = -${y} = ${-y}`],
  };
}

// ---------- 15. Longueur d'un segment aligné avec un axe ----------
function genDistanceSegmentAxeAligneNumeric() {
  const [nomA, nomB] = points4();
  const vertical = Math.random() < 0.5;
  const xA = randInt(-10, 10);
  const yA = randInt(-10, 10);
  let xB, yB;
  if (vertical) {
    xB = xA;
    yB = yA + nonZero(-15, 15);
  } else {
    yB = yA;
    xB = xA + nonZero(-15, 15);
  }
  const answer = vertical ? Math.abs(yB - yA) : Math.abs(xB - xA);
  return {
    type: "numeric",
    chapter: "Repérage — Distance entre deux points",
    prompt: `Le repère est orthonormé. On considère les points ${nomA}(${xA} ; ${yA}) et ${nomB}(${xB} ; ${yB}). Calcule la distance ${nomA}${nomB}.`,
    answer,
    steps: [vertical ? `\\text{${nomA} et ${nomB} ont la même abscisse : } ${nomA}${nomB} = |${yB} - ${yA}| = ${answer}` : `\\text{${nomA} et ${nomB} ont la même ordonnée : } ${nomA}${nomB} = |${xB} - ${xA}| = ${answer}`],
  };
}

const GENERATORS = [
  genCoordonneesMilieuNumeric,
  genCalculDistanceNumeric,
  genReconnaitreAlignementQCM,
  genReconnaitreParallelogrammeQCM,
  genTypeRepereDepuisDescriptionQCM,
  genVraiFauxParalleleAxeQCM,
  genTroisiemeSommetParallelogrammeNumeric,
  genTriangleRectangleReciproquePythagoreQCM,
  genPerimetreTriangleNumeric,
  genPointMilieuVersACoordinateNumeric,
  genDistanceOrigineNumeric,
  genComparerDistancesQCM,
  genCentreGraviteNumeric,
  genSymetriqueOrigineNumeric,
  genDistanceSegmentAxeAligneNumeric,
];

const DIFFICULTY = {
  genCoordonneesMilieuNumeric: "facile",
  genCalculDistanceNumeric: "facile",
  genTypeRepereDepuisDescriptionQCM: "facile",
  genDistanceOrigineNumeric: "facile",
  genSymetriqueOrigineNumeric: "facile",
  genReconnaitreAlignementQCM: "standard",
  genReconnaitreParallelogrammeQCM: "standard",
  genVraiFauxParalleleAxeQCM: "standard",
  genTriangleRectangleReciproquePythagoreQCM: "standard",
  genPerimetreTriangleNumeric: "standard",
  genComparerDistancesQCM: "standard",
  genCentreGraviteNumeric: "standard",
  genTroisiemeSommetParallelogrammeNumeric: "expert",
  genPointMilieuVersACoordinateNumeric: "expert",
  genDistanceSegmentAxeAligneNumeric: "expert",
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
    id: "reperage-configurations-seconde",
    title: "Repérage et configurations dans le plan",
    description: "Coordonnées du milieu, distance entre deux points, alignement, parallélogrammes via milieu commun des diagonales, réciproque de Pythagore, centre de gravité, types de repères.",
    level: "seconde",
    free: false,
    order: 7,
  },
  generate,
};
