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
    steps: [
      { type: "regle", text: `\\text{Les coordonnées du milieu M de } [AB] \\text{ sont la moyenne des coordonnées de A et de B : } x_M = \\dfrac{x_A + x_B}{2}, \\ y_M = \\dfrac{y_A + y_B}{2}.` },
      { type: "resultat", text: demanderAbscisse ? `x_${nomM} = \\dfrac{${xA} + ${xB}}{2} = ${xM}` : `y_${nomM} = \\dfrac{${yA} + ${yB}}{2} = ${yM}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Dans un repère orthonormé, la distance } AB \\text{ se calcule (grâce au théorème de Pythagore) par } AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}.` },
      { type: "resultat", text: `${nomA}${nomB} = \\sqrt{(${xB} - ${xA})^2 + (${yB} - ${yA})^2} = \\sqrt{${signeX * dx}^2 + ${signeY * dy}^2} = \\sqrt{${dx * dx} + ${dy * dy}} = ${dist}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Trois points A, B, C sont alignés si et seulement si les vecteurs } \\overrightarrow{AB} \\text{ et } \\overrightarrow{AC} \\text{ sont colinéaires, c'est-à-dire si leur « produit en croix » } (x_B - x_A)(y_C - y_A) - (y_B - y_A)(x_C - x_A) \\text{ est nul.}` },
      { type: "calcul", text: `(${xB} - ${xA})(${yC} - ${yA}) - (${yB} - ${yA})(${xC} - ${xA}) = ${produitCroise}` },
      { type: "resultat", text: reponse === "Oui" ? `\\text{Le produit est nul : } \\overrightarrow{${nomA}${nomC}} \\text{ est colinéaire à } \\overrightarrow{${nomA}${nomB}}, \\text{ les points sont alignés.}` : `\\text{Le produit n'est pas nul : } \\overrightarrow{${nomA}${nomC}} \\text{ n'est pas colinéaire à } \\overrightarrow{${nomA}${nomB}}, \\text{ les points ne sont pas alignés.}` },
    ],
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
      { type: "regle", text: `\\text{ABCD est un parallélogramme si et seulement si les diagonales } [AC] \\text{ et } [BD] \\text{ ont le même milieu.}` },
      { type: "calcul", text: `\\text{Milieu de } [${nomA}${nomC}] = \\left(\\dfrac{${xA}+${xC}}{2} ; \\dfrac{${yA}+${yC}}{2}\\right)` },
      { type: "calcul", text: `\\text{Milieu de } [${nomB}${nomD}] = \\left(\\dfrac{${xB}+${xD}}{2} ; \\dfrac{${yB}+${yD}}{2}\\right)` },
      { type: "resultat", text: estParallelogramme ? `\\text{Les deux diagonales ont le même milieu : } ${nomA}${nomB}${nomC}${nomD} \\text{ est un parallélogramme.}` : `\\text{Les deux diagonales n'ont pas le même milieu : } ${nomA}${nomB}${nomC}${nomD} \\text{ n'est pas un parallélogramme.}` },
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
      { type: "regle", text: `\\text{Un repère est orthogonal si ses axes sont perpendiculaires. Il est orthonormé s'il est orthogonal ET si les unités sur les deux axes sont égales (OI = OJ).}` },
      {
        type: "resultat",
        text: !angleDroit
          ? `\\text{Les axes ne sont pas perpendiculaires : le repère n'est ni orthogonal ni orthonormé.}`
          : uniteX === uniteY
            ? `\\text{Les axes sont perpendiculaires et OI = OJ = ${uniteX} : le repère est orthonormé.}`
            : `\\text{Les axes sont perpendiculaires mais OI = ${uniteX} \\neq OJ = ${uniteY} : le repère est orthogonal mais pas orthonormé.}`,
      },
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
      { type: "regle", text: `\\text{Une droite est parallèle à l'axe des abscisses si ses deux points ont la même ordonnée ; elle est parallèle à l'axe des ordonnées si ses deux points ont la même abscisse.}` },
      {
        type: "resultat",
        text: axeAbscisses
          ? parallele
            ? `${nomA} \\text{ et } ${nomB} \\text{ ont la même ordonnée (} ${yA} \\text{) : la droite est parallèle à l'axe des abscisses.}`
            : `${nomA} \\text{ et } ${nomB} \\text{ n'ont pas la même ordonnée (} ${yA} \\neq ${yB} \\text{) : la droite n'est pas parallèle à l'axe des abscisses.}`
          : parallele
            ? `${nomA} \\text{ et } ${nomB} \\text{ ont la même abscisse (} ${xA} \\text{) : la droite est parallèle à l'axe des ordonnées.}`
            : `${nomA} \\text{ et } ${nomB} \\text{ n'ont pas la même abscisse (} ${xA} \\neq ${xB} \\text{) : la droite n'est pas parallèle à l'axe des ordonnées.}`,
      },
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
    steps: [
      { type: "regle", text: `\\text{Les diagonales } [${nomA}${nomC}] \\text{ et } [${nomB}${nomD}] \\text{ d'un parallélogramme ont le même milieu, donc } ${nomD} = ${nomA} + ${nomC} - ${nomB} \\text{ (coordonnée par coordonnée).}` },
      { type: "resultat", text: demanderAbscisse ? `x_${nomD} = ${xA} + ${xC} - ${xB} = ${xD}` : `y_${nomD} = ${yA} + ${yC} - ${yB} = ${yD}` },
    ],
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
      { type: "regle", text: `\\text{Réciproque du théorème de Pythagore : si dans un triangle le carré du plus grand côté est égal à la somme des carrés des deux autres, alors le triangle est rectangle (et l'angle droit est opposé au plus grand côté).}` },
      { type: "calcul", text: `${nomA}${nomB}^2 + ${nomA}${nomC}^2 = ${AB2} + ${AC2} = ${AB2 + AC2}` },
      {
        type: "resultat",
        text: estRectangle
          ? `${nomB}${nomC}^2 = ${BC2} = ${nomA}${nomB}^2 + ${nomA}${nomC}^2 : \\text{ le triangle est rectangle en } ${nomA}.`
          : `${nomB}${nomC}^2 = ${BC2} \\neq ${AB2 + AC2} : \\text{ le triangle n'est pas rectangle en } ${nomA}.`,
      },
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
    steps: [
      { type: "regle", text: `\\text{${nomA} et ${nomB} ont la même ordonnée : } ${nomA}${nomB} \\text{ se lit directement sur l'axe des abscisses. De même } ${nomA}${nomC} \\text{ se lit sur l'axe des ordonnées. Pour } ${nomB}${nomC}, \\text{ on utilise le théorème de Pythagore dans le triangle rectangle en } ${nomA}.` },
      { type: "calcul", text: `${nomA}${nomB} = ${a}` },
      { type: "calcul", text: `${nomA}${nomC} = ${b}` },
      { type: "calcul", text: `${nomB}${nomC} = \\sqrt{${a}^2 + ${b}^2} = ${c}` },
      { type: "resultat", text: `\\text{Périmètre} = ${a} + ${b} + ${c} = ${perimetre}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Puisque } M \\text{ est le milieu de } [${nomA}${nomB}], \\text{ on a } x_M = \\dfrac{x_${nomA} + x_${nomB}}{2}. \\text{ En isolant } x_${nomB}, \\text{ on obtient } x_${nomB} = 2x_M - x_${nomA} \\text{ (et de même pour l'ordonnée).}` },
      { type: "resultat", text: demanderAbscisse ? `x_${nomB} = 2 \\times ${xM} - ${xA} = ${xB}` : `y_${nomB} = 2 \\times ${yM} - ${yA} = ${yB}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{La distance d'un point } (x ; y) \\text{ à l'origine O est } OA = \\sqrt{x^2 + y^2} \\text{ (théorème de Pythagore appliqué au triangle formé avec les axes).}` },
      { type: "resultat", text: `O${nomA} = \\sqrt{${x}^2 + ${y}^2} = \\sqrt{${dx * dx} + ${dy * dy}} = ${dist}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Comme la fonction carré est croissante sur } [0 ; +\\infty[, \\text{ comparer deux distances (positives) revient à comparer leurs carrés — cela évite de calculer des racines carrées.}` },
      { type: "calcul", text: `${nomP}${nomQ1}^2 = ${d1carre}` },
      { type: "calcul", text: `${nomP}${nomQ2}^2 = ${d2carre}` },
      { type: "resultat", text: `\\text{Le plus proche est celui dont la distance au carré est la plus petite : } ${plusProche}.` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Les coordonnées du centre de gravité (isobarycentre) d'un triangle sont la moyenne des coordonnées de ses trois sommets : } x_G = \\dfrac{x_A + x_B + x_C}{3}, \\ y_G = \\dfrac{y_A + y_B + y_C}{3}.` },
      { type: "resultat", text: demanderAbscisse ? `x_${nomG} = \\dfrac{${xA} + ${xB} + ${xC}}{3} = ${xG}` : `y_${nomG} = \\dfrac{${yA} + ${yB} + ${yC}}{3} = ${yG}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Le symétrique de } (x ; y) \\text{ par rapport à l'origine O est } (-x ; -y).` },
      { type: "resultat", text: demanderAbscisse ? `x_{${nomAprime}} = -${x} = ${-x}` : `y_{${nomAprime}} = -${y} = ${-y}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Si deux points ont la même abscisse, la distance entre eux est la valeur absolue de la différence de leurs ordonnées. Si elles ont la même ordonnée, c'est la valeur absolue de la différence de leurs abscisses.}` },
      { type: "resultat", text: vertical ? `\\text{${nomA} et ${nomB} ont la même abscisse : } ${nomA}${nomB} = |${yB} - ${yA}| = ${answer}` : `\\text{${nomA} et ${nomB} ont la même ordonnée : } ${nomA}${nomB} = |${xB} - ${xA}| = ${answer}` },
    ],
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

// ===================== Figures pour le Cours (carte mentale) =====================
// Pas de helper de figure existant dans ce fichier avant (les exercices restent
// purement numériques/QCM) : repère orthonormé minimal avec axes fléchés.
function buildCoursRepereFigure(pts, segs = [], range = 6) {
  const scale = 20;
  const toX = (v) => v * scale;
  const toY = (v) => -v * scale;
  const axes = [
    { id: "OX1", x: toX(-1), y: toY(0), hideDot: true, hideLabel: true },
    { id: "OX2", x: toX(range), y: toY(0), hideDot: true, hideLabel: true },
    { id: "OY1", x: toX(0), y: toY(-1), hideDot: true, hideLabel: true },
    { id: "OY2", x: toX(0), y: toY(range), hideDot: true, hideLabel: true },
  ];
  const points = pts.map((p) => ({
    id: p.id,
    x: toX(p.x),
    y: toY(p.y),
    label: p.label ?? p.id,
    dx: p.dx ?? 8,
    dy: p.dy ?? -8,
    hideDot: p.hideDot,
  }));
  return {
    points: [...axes, ...points],
    coordinatePlane: { xFrom: "OX1", xTo: "OX2", yFrom: "OY1", yTo: "OY2", xTickCount: range + 2, yTickCount: range + 2, xMin: -1, xMax: range, yMin: -1, yMax: range },
    segments: segs,
    freeLabels: [
      { x: toX(range) + 10, y: toY(0) + 4, text: "x" },
      { x: toX(0) - 6, y: toY(range) - 8, text: "y" },
    ],
  };
}

export default {
  meta: {
    id: "reperage-configurations-seconde",
    title: "Repérage et configurations dans le plan",
    description: "Coordonnées du milieu, distance entre deux points, alignement, parallélogrammes via milieu commun des diagonales, réciproque de Pythagore, centre de gravité, types de repères.",
    pourquoi: "Repérer un point par ses coordonnées, c'est le même principe qu'un GPS ou qu'une carte quadrillée.",
    level: "seconde",
    free: false,
    order: 7,
    cours: {
      mindMap: {
        title: "Repérage et configurations dans le plan",
        branches: [
          {
            title: "Coordonnées d'un point",
            items: [
              "Dans un repère \\((O ; I, J)\\), un point A a des coordonnées \\((x_A ; y_A)\\) uniques.",
              "Orthogonal : axes perpendiculaires (unités pas forcément égales). Orthonormé : orthogonal ET mêmes unités sur les deux axes — indispensable pour utiliser la formule de distance.",
              "Le symétrique d'un point \\((x ; y)\\) par rapport à l'origine O est \\((-x ; -y)\\).",
            ],
            figure: buildCoursRepereFigure([{ id: "A", x: 3, y: 2 }]),
          },
          {
            title: "Milieu d'un segment",
            items: [
              "Les coordonnées du milieu sont la moyenne des coordonnées des extrémités, pas leur somme.",
              "Pour retrouver B connaissant A et le milieu M : \\(x_B = 2x_M - x_A\\) (et de même pour y).",
            ],
            formula: "\\(I\\left(\\dfrac{x_A+x_B}{2} ; \\dfrac{y_A+y_B}{2}\\right)\\)",
            figure: buildCoursRepereFigure(
              [
                { id: "A", x: 1, y: 1, dy: 10 },
                { id: "B", x: 5, y: 3 },
                { id: "I", x: 3, y: 2, dx: -14, dy: 10 },
              ],
              [{ from: "A", to: "B" }]
            ),
          },
          {
            title: "Distance entre deux points",
            items: [
              "C'est Pythagore appliqué au triangle rectangle formé par les écarts en x et en y.",
              "Piège classique : ne pas oublier la racine carrée à la fin du calcul.",
              "Cas particulier : si deux points ont la même abscisse (ou la même ordonnée), la droite qui les joint est parallèle à un axe et la distance se lit directement, sans Pythagore.",
            ],
            formula: "\\(AB = \\sqrt{(x_B-x_A)^2 + (y_B-y_A)^2}\\)",
            figure: buildCoursRepereFigure(
              [
                { id: "A", x: 1, y: 1, dy: 10 },
                { id: "B", x: 5, y: 4 },
                { id: "H", x: 5, y: 1, dy: 12 },
              ],
              [{ from: "A", to: "B" }, { from: "A", to: "H", dashed: true }, { from: "H", to: "B", dashed: true }]
            ),
          },
          {
            title: "Alignement de trois points",
            items: [
              "A, B, C alignés ⟺ les vecteurs \\(\\overrightarrow{AB}\\) et \\(\\overrightarrow{AC}\\) sont colinéaires (mêmes coordonnées proportionnelles).",
            ],
            figure: buildCoursRepereFigure(
              [
                { id: "A", x: 0, y: 0, dx: -10, dy: 10 },
                { id: "B", x: 2, y: 1, dy: 10 },
                { id: "C", x: 4, y: 2 },
              ],
              [{ from: "A", to: "C" }]
            ),
          },
          {
            title: "Parallélogramme : milieu commun",
            items: [
              "ABCD est un parallélogramme ⟺ [AC] et [BD] ont le même milieu (les diagonales se coupent en leur milieu).",
            ],
            figure: buildCoursRepereFigure(
              [
                { id: "A", x: 0, y: 0, dx: -10, dy: 10 },
                { id: "B", x: 4, y: 0, dy: 12 },
                { id: "C", x: 5, y: 3 },
                { id: "D", x: 1, y: 3, dx: -12, dy: -8 },
              ],
              [{ from: "A", to: "B" }, { from: "B", to: "C" }, { from: "C", to: "D" }, { from: "D", to: "A" }, { from: "A", to: "C", dashed: true }, { from: "B", to: "D", dashed: true }]
            ),
          },
          {
            title: "Centre de gravité d'un triangle",
            items: [
              "Le centre de gravité (isobarycentre) d'un triangle a pour coordonnées la moyenne des coordonnées des trois sommets.",
            ],
            formula: "\\(G\\left(\\dfrac{x_A+x_B+x_C}{3} ; \\dfrac{y_A+y_B+y_C}{3}\\right)\\)",
            figure: buildCoursRepereFigure(
              [
                { id: "A", x: 0, y: 0, dx: -10, dy: 10 },
                { id: "B", x: 6, y: 0, dy: 12 },
                { id: "C", x: 3, y: 6, dy: -10 },
                { id: "G", x: 3, y: 2, dx: 8, dy: -4 },
              ],
              [{ from: "A", to: "B" }, { from: "B", to: "C" }, { from: "C", to: "A" }]
            ),
          },
          {
            title: "Réciproque du théorème de Pythagore",
            items: [
              "Si, dans un triangle, le carré du plus grand côté est égal à la somme des carrés des deux autres, alors le triangle est rectangle (angle droit opposé au plus grand côté).",
              "Cette réciproque fonctionne pour n'importe quel triangle, pas seulement ceux dont les côtés sont parallèles aux axes.",
            ],
            formula: "\\(BC^2 = AB^2 + AC^2 \\Rightarrow \\text{triangle rectangle en } A\\)",
            figure: buildCoursRepereFigure(
              [
                { id: "A", x: 1, y: 1, dx: -14, dy: 10 },
                { id: "B", x: 5, y: 2, dx: 8, dy: 6 },
                { id: "C", x: 0, y: 5, dx: -6, dy: -10 },
              ],
              [{ from: "A", to: "B" }, { from: "B", to: "C" }, { from: "C", to: "A" }]
            ),
          },
        ],
      },
    },
  },
  generate,
};
