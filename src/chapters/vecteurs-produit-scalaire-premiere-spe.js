// ---------------------------------------------------------------------------
// Chapitre : Calcul vectoriel et produit scalaire (Première Spé)
// Ce fichier ne contient QUE du contenu (générateurs d'exercices + métadonnées).
// L'affichage (mode Classique/Jeu, pavé numérique, QCM, aide progressive) est
// géré par le composant générique <ChapterRunner /> pour tous les chapitres.
//
// Convention LaTeX : tout passage mathématique est entouré de \( ... \)
// (rendu ensuite en jolie notation par le composant <MathText />, voir
// src/components/MathText.jsx). Le reste du texte reste du français normal.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr() pour utiliser la virgule française — voir fr() ci-dessous.
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

// =========================== Générateurs paramétrés ===========================

// ---------- 1. Produit scalaire à partir des coordonnées ----------
function genProduitScalaireCoordonneesNumeric() {
  const x1 = randInt(-9, 9);
  const y1 = randInt(-9, 9);
  const x2 = randInt(-9, 9);
  const y2 = randInt(-9, 9);
  const answer = x1 * x2 + y1 * y2;
  return {
    type: "numeric",
    chapter: "Produit scalaire — Calcul avec les coordonnées",
    prompt: `On donne \\(\\vec{u}(${x1} ; ${y1})\\) et \\(\\vec{v}(${x2} ; ${y2})\\). Calcule le produit scalaire \\(\\vec{u} \\cdot \\vec{v}\\) (formule \\(\\vec{u} \\cdot \\vec{v} = xx' + yy'\\)).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Formule de référence : } \\vec{u} \\cdot \\vec{v} = xx' + yy'.` },
      { type: "resultat", text: `\\vec{u} \\cdot \\vec{v} = ${x1} \\times ${x2} + ${y1} \\times ${y2} = ${x1 * x2} + ${y1 * y2} = ${answer}` },
    ],
  };
}

// ---------- 2. Norme d'un vecteur à partir des coordonnées ----------
function genNormeVecteurNumeric() {
  const triplets = [
    [3, 4, 5],
    [6, 8, 10],
    [5, 12, 13],
    [8, 15, 17],
    [9, 12, 15],
    [7, 24, 25],
  ];
  const [x, y, answer] = pick(triplets);
  const signeX = pick([1, -1]);
  const signeY = pick([1, -1]);
  return {
    type: "numeric",
    chapter: "Produit scalaire — Norme d'un vecteur",
    prompt: `On donne \\(\\vec{u}(${signeX * x} ; ${signeY * y})\\). Calcule la norme \\(\\|\\vec{u}\\|\\) (formule \\(\\|\\vec{u}\\| = \\sqrt{x^2 + y^2}\\)).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Formule de référence : } \\|\\vec{u}\\| = \\sqrt{x^2 + y^2}.` },
      { type: "resultat", text: `\\|\\vec{u}\\| = \\sqrt{(${signeX * x})^2 + (${signeY * y})^2} = \\sqrt{${x * x} + ${y * y}} = \\sqrt{${x * x + y * y}} = ${answer}` },
    ],
  };
}

// ---------- 3. Critère d'orthogonalité (à partir des coordonnées) ----------
function genOrthogonaliteCoordonneesQCM() {
  const orthogonal = Math.random() < 0.5;
  const x1 = nonZero(-8, 8);
  const y1 = nonZero(-8, 8);
  let x2, y2;
  if (orthogonal) {
    // Construire un vecteur orthogonal exact à (x1 ; y1) : (y1 ; -x1), éventuellement mis à l'échelle
    const k = nonZero(1, 3);
    x2 = y1 * k;
    y2 = -x1 * k;
  } else {
    x2 = nonZero(-8, 8);
    y2 = nonZero(-8, 8);
  }
  const produit = x1 * x2 + y1 * y2;
  const reponse = produit === 0 ? "orthogonaux" : "non orthogonaux";
  return {
    type: "qcm",
    chapter: "Produit scalaire — Orthogonalité",
    prompt: `On donne \\(\\vec{u}(${x1} ; ${y1})\\) et \\(\\vec{v}(${x2} ; ${y2})\\). Ces deux vecteurs sont-ils orthogonaux ?`,
    answer: reponse,
    options: ["orthogonaux", "non orthogonaux"],
    steps: [
      { type: "calcul", text: `\\vec{u} \\cdot \\vec{v} = ${x1} \\times ${x2} + ${y1} \\times ${y2} = ${produit}` },
      { type: "regle", text: produit === 0 ? `\\text{Le produit scalaire est nul : les vecteurs sont orthogonaux.}` : `\\text{Le produit scalaire n'est pas nul : les vecteurs ne sont pas orthogonaux.}` },
    ],
  };
}

// ---------- 4. Produit scalaire à l'aide des normes et de l'angle ----------
function genProduitScalaireNormesAngleNumeric() {
  const normeU = randInt(2, 12);
  const normeV = randInt(2, 12);
  const cas = pick([
    { angle: "60°", cos: 0.5 },
    { angle: "90°", cos: 0 },
    { angle: "120°", cos: -0.5 },
    { angle: "0°", cos: 1 },
    { angle: "180°", cos: -1 },
  ]);
  const answer = roundTo(normeU * normeV * cas.cos, 2);
  return {
    type: "numeric",
    chapter: "Produit scalaire — Formule avec le cosinus",
    prompt: `On donne \\(\\|\\vec{u}\\| = ${normeU}\\), \\(\\|\\vec{v}\\| = ${normeV}\\), et un angle de \\(${cas.angle}\\) entre \\(\\vec{u}\\) et \\(\\vec{v}\\). Calcule \\(\\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\times \\|\\vec{v}\\| \\times \\cos(${cas.angle})\\).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Formule de référence : } \\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\times \\|\\vec{v}\\| \\times \\cos(\\widehat{(\\vec{u},\\vec{v})}).` },
      { type: "resultat", text: `\\vec{u} \\cdot \\vec{v} = ${normeU} \\times ${normeV} \\times ${fr(cas.cos)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 5. Développement de ||u + v||² ----------
function genDeveloppementSommeNumeric() {
  const normeU = randInt(2, 10);
  const normeV = randInt(2, 10);
  const produitScalaire = randInt(-20, 20);
  const answer = normeU * normeU + 2 * produitScalaire + normeV * normeV;
  return {
    type: "numeric",
    chapter: "Produit scalaire — Développement de normes",
    prompt: `On donne \\(\\|\\vec{u}\\| = ${normeU}\\), \\(\\|\\vec{v}\\| = ${normeV}\\), et \\(\\vec{u} \\cdot \\vec{v} = ${produitScalaire}\\). Calcule \\(\\|\\vec{u} + \\vec{v}\\|^2\\) (formule \\(\\|\\vec{u} + \\vec{v}\\|^2 = \\|\\vec{u}\\|^2 + 2\\vec{u} \\cdot \\vec{v} + \\|\\vec{v}\\|^2\\)).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Formule de référence à connaître : } \\|\\vec{u} + \\vec{v}\\|^2 = \\|\\vec{u}\\|^2 + 2\\vec{u} \\cdot \\vec{v} + \\|\\vec{v}\\|^2.` },
      { type: "resultat", text: `\\|\\vec{u} + \\vec{v}\\|^2 = ${normeU}^2 + 2 \\times ${produitScalaire} + ${normeV}^2 = ${normeU * normeU} + ${2 * produitScalaire} + ${normeV * normeV} = ${answer}` },
    ],
  };
}

// ---------- 6. Développement de ||u - v||² ----------
function genDeveloppementDifferenceNumeric() {
  const normeU = randInt(2, 10);
  const normeV = randInt(2, 10);
  const produitScalaire = randInt(-20, 20);
  const answer = normeU * normeU - 2 * produitScalaire + normeV * normeV;
  return {
    type: "numeric",
    chapter: "Produit scalaire — Développement de normes",
    prompt: `On donne \\(\\|\\vec{u}\\| = ${normeU}\\), \\(\\|\\vec{v}\\| = ${normeV}\\), et \\(\\vec{u} \\cdot \\vec{v} = ${produitScalaire}\\). Calcule \\(\\|\\vec{u} - \\vec{v}\\|^2\\) (formule \\(\\|\\vec{u} - \\vec{v}\\|^2 = \\|\\vec{u}\\|^2 - 2\\vec{u} \\cdot \\vec{v} + \\|\\vec{v}\\|^2\\)).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Formule de référence à connaître : } \\|\\vec{u} - \\vec{v}\\|^2 = \\|\\vec{u}\\|^2 - 2\\vec{u} \\cdot \\vec{v} + \\|\\vec{v}\\|^2.` },
      { type: "resultat", text: `\\|\\vec{u} - \\vec{v}\\|^2 = ${normeU}^2 - 2 \\times ${produitScalaire} + ${normeV}^2 = ${normeU * normeU} - ${2 * produitScalaire} + ${normeV * normeV} = ${answer}` },
    ],
  };
}

// ---------- 7. Formule d'Al-Kashi ----------
function genAlKashiNumeric() {
  const a = randInt(3, 12);
  const b = randInt(3, 12);
  const cas = pick([
    { angle: "60°", cos: 0.5 },
    { angle: "90°", cos: 0 },
    { angle: "120°", cos: -0.5 },
  ]);
  const c2 = a * a + b * b - 2 * a * b * cas.cos;
  const answer = roundTo(Math.sqrt(c2), 2);
  return {
    type: "numeric",
    chapter: "Produit scalaire — Formule d'Al-Kashi",
    prompt: `Dans un triangle \\(ABC\\), on donne \\(AB = ${a}\\), \\(AC = ${b}\\), et l'angle \\(\\widehat{BAC} = ${cas.angle}\\). Calcule \\(BC\\) (formule d'Al-Kashi : \\(BC^2 = AB^2 + AC^2 - 2 \\times AB \\times AC \\times \\cos(\\widehat{BAC})\\)), valeur arrondie au centième.`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Formule d'Al-Kashi à connaître : } BC^2 = AB^2 + AC^2 - 2 \\times AB \\times AC \\times \\cos(\\widehat{BAC}).` },
      { type: "calcul", text: `BC^2 = ${a}^2 + ${b}^2 - 2 \\times ${a} \\times ${b} \\times ${fr(cas.cos)} = ${a * a} + ${b * b} - ${2 * a * b * cas.cos} = ${fr(roundTo(c2, 2))}` },
      { type: "resultat", text: `BC = \\sqrt{${fr(roundTo(c2, 2))}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 8. Bilinéarité du produit scalaire ----------
function genBilinaeariteNumeric() {
  const uw = randInt(-15, 15);
  const vw = randInt(-15, 15);
  const answer = uw + vw;
  return {
    type: "numeric",
    chapter: "Produit scalaire — Bilinéarité",
    prompt: `On donne \\(\\vec{u} \\cdot \\vec{w} = ${uw}\\) et \\(\\vec{v} \\cdot \\vec{w} = ${vw}\\). En utilisant la bilinéarité du produit scalaire, calcule \\((\\vec{u} + \\vec{v}) \\cdot \\vec{w}\\).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Propriété de bilinéarité : } (\\vec{u} + \\vec{v}) \\cdot \\vec{w} = \\vec{u} \\cdot \\vec{w} + \\vec{v} \\cdot \\vec{w}.` },
      { type: "resultat", text: `(\\vec{u} + \\vec{v}) \\cdot \\vec{w} = ${uw} + ${vw} = ${answer}` },
    ],
  };
}

// ---------- 9. Symétrie du produit scalaire ----------
function genSymetrieQCM() {
  const uv = randInt(-15, 15);
  return {
    type: "numeric",
    chapter: "Produit scalaire — Symétrie",
    prompt: `On donne \\(\\vec{v} \\cdot \\vec{u} = ${uv}\\). Que vaut \\(\\vec{u} \\cdot \\vec{v}\\) (le produit scalaire est symétrique) ?`,
    answer: uv,
    steps: [{ type: "regle", text: `\\text{Le produit scalaire est symétrique : } \\vec{u} \\cdot \\vec{v} = \\vec{v} \\cdot \\vec{u} = ${uv}.` }],
  };
}

// ---------- 10. Trouver un paramètre rendant deux vecteurs orthogonaux ----------
function genParametreOrthogonaliteNumeric() {
  // On construit u(1 ; y1) et v(x2 ; m) tels que x2 = -y1 × m, ce qui garantit
  // que la valeur cherchée m est un entier exact.
  const y1 = nonZero(-8, 8);
  const answer = nonZero(-8, 8);
  const x2 = -y1 * answer;
  const produitAutres = 1 * x2;
  return {
    type: "numeric",
    chapter: "Produit scalaire — Orthogonalité",
    prompt: `On donne \\(\\vec{u}(1 ; ${y1})\\) et \\(\\vec{v}(${x2} ; m)\\). Détermine la valeur de \\(m\\) pour que \\(\\vec{u}\\) et \\(\\vec{v}\\) soient orthogonaux.`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Deux vecteurs sont orthogonaux si et seulement si leur produit scalaire est nul : } \\vec{u} \\cdot \\vec{v} = 0 \\Leftrightarrow 1 \\times ${x2} + ${y1} \\times m = 0.` },
      { type: "resultat", text: `m = \\dfrac{-${produitAutres}}{${y1}} = ${answer}` },
    ],
  };
}

// ---------- 11. Calcul d'un angle via le produit scalaire (cas remarquable) ----------
function genAngleViaProduitScalaireQCM() {
  const normeU = randInt(2, 10);
  const normeV = randInt(2, 10);
  const cas = pick([
    { produit: normeU * normeV, angle: "0°" },
    { produit: 0, angle: "90°" },
    { produit: -normeU * normeV, angle: "180°" },
    { produit: roundTo(normeU * normeV * 0.5, 2), angle: "60°" },
  ]);
  return {
    type: "qcm",
    chapter: "Produit scalaire — Calcul d'un angle",
    prompt: `On donne \\(\\|\\vec{u}\\| = ${normeU}\\), \\(\\|\\vec{v}\\| = ${normeV}\\), et \\(\\vec{u} \\cdot \\vec{v} = ${fr(cas.produit)}\\). Quelle est la mesure de l'angle entre \\(\\vec{u}\\) et \\(\\vec{v}\\) ?`,
    answer: cas.angle,
    options: ["0°", "60°", "90°", "180°"],
    steps: [
      { type: "regle", text: `\\text{On isole le cosinus dans la formule : } \\cos(\\widehat{(\\vec{u},\\vec{v})}) = \\dfrac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\times \\|\\vec{v}\\|}.` },
      { type: "resultat", text: `\\text{L'angle correspondant est } ${cas.angle}.` },
    ],
  };
}

// ---------- 12. Produit scalaire de deux vecteurs définis par des points ----------
function genProduitScalairePointsNumeric() {
  const xA = randInt(-6, 6);
  const yA = randInt(-6, 6);
  const xB = randInt(-6, 6);
  const yB = randInt(-6, 6);
  const xC = randInt(-6, 6);
  const yC = randInt(-6, 6);
  const abX = xB - xA;
  const abY = yB - yA;
  const acX = xC - xA;
  const acY = yC - yA;
  const answer = abX * acX + abY * acY;
  return {
    type: "numeric",
    chapter: "Produit scalaire — Vecteurs définis par des points",
    prompt: `On donne \\(A(${xA} ; ${yA})\\), \\(B(${xB} ; ${yB})\\), \\(C(${xC} ; ${yC})\\). Calcule le produit scalaire \\(\\overrightarrow{AB} \\cdot \\overrightarrow{AC}\\).`,
    answer,
    steps: [
      { type: "donnee", text: `\\overrightarrow{AB}(${abX} ; ${abY}), \\quad \\overrightarrow{AC}(${acX} ; ${acY})` },
      { type: "resultat", text: `\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = ${abX} \\times ${acX} + ${abY} \\times ${acY} = ${answer}` },
    ],
  };
}

// ---------- 13. Vrai ou faux sur les propriétés du produit scalaire ----------
function genVraiFauxProduitScalaireQCM() {
  const cas = pick([
    {
      description: "Le produit scalaire de deux vecteurs orthogonaux est nul.",
      reponse: "Vrai",
      explication: `\\text{C'est le critère d'orthogonalité lui-même : deux vecteurs sont orthogonaux si et seulement si } \\vec{u} \\cdot \\vec{v} = 0.`,
    },
    {
      description: "Le produit scalaire \\(\\vec{u} \\cdot \\vec{u}\\) est égal à \\(\\|\\vec{u}\\|^2\\).",
      reponse: "Vrai",
      explication: `\\text{L'angle entre } \\vec{u} \\text{ et lui-même est } 0°, \\text{ donc } \\vec{u} \\cdot \\vec{u} = \\|\\vec{u}\\| \\times \\|\\vec{u}\\| \\times \\cos(0°) = \\|\\vec{u}\\|^2.`,
    },
    {
      description: "Le produit scalaire de deux vecteurs est toujours positif.",
      reponse: "Faux",
      explication: `\\text{Contre-exemple : si l'angle entre } \\vec{u} \\text{ et } \\vec{v} \\text{ est obtus (entre 90° et 180°), } \\cos(\\widehat{(\\vec{u},\\vec{v})}) < 0, \\text{ donc } \\vec{u} \\cdot \\vec{v} < 0.`,
    },
    {
      description: "\\(\\vec{u} \\cdot \\vec{v} = \\vec{v} \\cdot \\vec{u}\\) (symétrie).",
      reponse: "Vrai",
      explication: `\\text{Avec les coordonnées : } xx' + yy' = x'x + y'y. \\text{ Le produit scalaire est bien symétrique.}`,
    },
  ]);
  return {
    type: "qcm",
    chapter: "Produit scalaire — Vrai ou faux",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 14. Produit scalaire d'un vecteur avec lui-même ----------
function genProduitScalaireAvecLuiMemeNumeric() {
  const norme = randInt(2, 15);
  return {
    type: "numeric",
    chapter: "Produit scalaire — Cas particulier u·u",
    prompt: `On donne \\(\\|\\vec{u}\\| = ${norme}\\). Calcule \\(\\vec{u} \\cdot \\vec{u}\\).`,
    answer: norme * norme,
    steps: [
      { type: "regle", text: `\\text{Cas particulier à connaître : } \\vec{u} \\cdot \\vec{u} = \\|\\vec{u}\\|^2 \\text{ (angle nul avec lui-même, } \\cos(0°) = 1\\text{).}` },
      { type: "resultat", text: `\\vec{u} \\cdot \\vec{u} = \\|\\vec{u}\\|^2 = ${norme}^2 = ${norme * norme}` },
    ],
  };
}

// ---------- 15. Reconnaître un triangle rectangle par le produit scalaire ----------
function genTriangleRectangleProduitScalaireQCM() {
  const xA = randInt(-6, 6);
  const yA = randInt(-6, 6);
  let xB = randInt(-6, 6);
  let yB = randInt(-6, 6);
  while (xB === xA && yB === yA) {
    xB = randInt(-6, 6);
    yB = randInt(-6, 6);
  }
  const abX = xB - xA;
  const abY = yB - yA;
  const rectangleEnA = Math.random() < 0.5;
  let xC, yC;
  if (rectangleEnA) {
    const k = nonZero(1, 3);
    xC = xA + abY * k;
    yC = yA - abX * k;
  } else {
    xC = randInt(-6, 6);
    yC = randInt(-6, 6);
  }
  const acX = xC - xA;
  const acY = yC - yA;
  const produit = abX * acX + abY * acY;
  const reponse = produit === 0 ? "Oui, il est rectangle en A" : "Non, il n'est pas rectangle en A";
  return {
    type: "qcm",
    chapter: "Produit scalaire — Reconnaître un triangle rectangle",
    prompt: `On donne \\(A(${xA} ; ${yA})\\), \\(B(${xB} ; ${yB})\\), \\(C(${xC} ; ${yC})\\). Le triangle \\(ABC\\) est-il rectangle en \\(A\\) ?`,
    answer: reponse,
    options: ["Oui, il est rectangle en A", "Non, il n'est pas rectangle en A"],
    steps: [
      { type: "regle", text: `\\text{Un triangle est rectangle en A si et seulement si } \\overrightarrow{AB} \\cdot \\overrightarrow{AC} = 0.` },
      { type: "donnee", text: `\\overrightarrow{AB}(${abX} ; ${abY}), \\quad \\overrightarrow{AC}(${acX} ; ${acY})` },
      { type: "calcul", text: `\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = ${abX} \\times ${acX} + ${abY} \\times ${acY} = ${produit}` },
      { type: "resultat", text: produit === 0 ? `\\text{Le produit scalaire est nul : le triangle est rectangle en A.}` : `\\text{Le produit scalaire n'est pas nul : le triangle n'est pas rectangle en A.}` },
    ],
  };
}

const GENERATORS = [
  genProduitScalaireCoordonneesNumeric,
  genNormeVecteurNumeric,
  genOrthogonaliteCoordonneesQCM,
  genProduitScalaireNormesAngleNumeric,
  genDeveloppementSommeNumeric,
  genDeveloppementDifferenceNumeric,
  genAlKashiNumeric,
  genBilinaeariteNumeric,
  genSymetrieQCM,
  genParametreOrthogonaliteNumeric,
  genAngleViaProduitScalaireQCM,
  genProduitScalairePointsNumeric,
  genVraiFauxProduitScalaireQCM,
  genProduitScalaireAvecLuiMemeNumeric,
  genTriangleRectangleProduitScalaireQCM,
];

const DIFFICULTY = {
  genProduitScalaireCoordonneesNumeric: "facile",
  genNormeVecteurNumeric: "facile",
  genOrthogonaliteCoordonneesQCM: "facile",
  genSymetrieQCM: "facile",
  genProduitScalaireAvecLuiMemeNumeric: "facile",
  genProduitScalaireNormesAngleNumeric: "standard",
  genDeveloppementSommeNumeric: "standard",
  genDeveloppementDifferenceNumeric: "standard",
  genParametreOrthogonaliteNumeric: "standard",
  genProduitScalairePointsNumeric: "standard",
  genVraiFauxProduitScalaireQCM: "standard",
  genAlKashiNumeric: "expert",
  genBilinaeariteNumeric: "expert",
  genAngleViaProduitScalaireQCM: "expert",
  genTriangleRectangleProduitScalaireQCM: "expert",
};

function generate(difficulty) {
  if (difficulty) {
    const pool = GENERATORS.filter((fn) => (DIFFICULTY[fn.name] ?? "standard") === difficulty);
    if (pool.length) return pick(pool)();
  }
  return pick(GENERATORS)();
}

// ===================== Figures pour le Cours (carte mentale) =====================
// Pas de helper de figure existant dans ce fichier avant.
function buildCoursScalaireAngleFigure() {
  return {
    points: [
      { id: "O", x: 0, y: 0, hideLabel: true, dx: -4, dy: 14 },
      { id: "U", x: 60, y: 0, label: "u", dy: 14 },
      { id: "V", x: 42, y: -35, label: "v", dx: 6, dy: -6 },
    ],
    lines: [{ from: "O", to: "U", extend: 0, arrowEnd: true }, { from: "O", to: "V", extend: 0, arrowEnd: true }],
    freeLabels: [{ x: 22, y: -10, text: "θ" }],
  };
}

function buildCoursOrthogonaliteFigure() {
  return {
    points: [
      { id: "O", x: 0, y: 0, hideLabel: true, dx: -4, dy: 14 },
      { id: "A", x: 60, y: 0, label: "u", dy: 14 },
      { id: "B", x: 0, y: -60, label: "v", dx: 8, dy: -4 },
    ],
    lines: [{ from: "O", to: "A", extend: 0, arrowEnd: true }, { from: "O", to: "B", extend: 0, arrowEnd: true }],
    rightAngles: [{ at: "O", from: "A", to: "B" }],
  };
}

function buildCoursAlKashiFigure() {
  return {
    points: [
      { id: "A", x: 0, y: 0, dx: -10, dy: 10 },
      { id: "B", x: 70, y: 0, dy: 14 },
      { id: "C", x: 50, y: -55, dx: 6, dy: -6 },
    ],
    segments: [{ from: "A", to: "B" }, { from: "A", to: "C" }, { from: "B", to: "C" }],
    freeLabels: [
      { x: 60, y: -22, text: "a" },
      { x: 20, y: -27, text: "b" },
      { x: 35, y: 14, text: "c" },
    ],
  };
}

export default {
  meta: {
    id: "vecteurs-produit-scalaire-premiere-spe",
    title: "Calcul vectoriel et produit scalaire",
    description: "Produit scalaire (coordonnées, normes et angle), orthogonalité, formule d'Al-Kashi, bilinéarité.",
    pourquoi: "Le produit scalaire permet de calculer un angle ou de démontrer une perpendicularité sans rapporteur — utilisé en physique pour calculer un travail ou une force.",
    level: "premiere-spe",
    order: 8,
    cours: {
      mindMap: {
        title: "Calcul vectoriel et produit scalaire",
        branches: [
          {
            title: "Produit scalaire : deux expressions",
            items: [
              "Par les coordonnées : produit des abscisses plus produit des ordonnées.",
              "Par les normes et l'angle : utile dès qu'on connaît un angle mais pas les coordonnées.",
            ],
            formula: "\\(\\overrightarrow{u}\\cdot\\overrightarrow{v} = xx'+yy' = \\|\\overrightarrow{u}\\|\\|\\overrightarrow{v}\\|\\cos\\theta\\)",
            figure: buildCoursScalaireAngleFigure(),
          },
          {
            title: "Orthogonalité",
            items: [
              "\\(\\overrightarrow{u}\\) et \\(\\overrightarrow{v}\\) sont orthogonaux si et seulement si leur produit scalaire est nul.",
              "C'est l'outil pour démontrer une perpendicularité sans rapporteur ni équerre.",
            ],
            figure: buildCoursOrthogonaliteFigure(),
          },
          {
            title: "Développer, bilinéarité",
            items: [
              "Le produit scalaire se développe comme un produit algébrique classique (distributivité).",
              "Piège classique : \\(\\overrightarrow{u}\\cdot\\overrightarrow{u} = \\|\\overrightarrow{u}\\|^2\\) (un nombre, pas un vecteur).",
            ],
            formula: "\\((\\overrightarrow{u}+\\overrightarrow{v})\\cdot(\\overrightarrow{u}+\\overrightarrow{v}) = \\|\\overrightarrow{u}\\|^2+2\\overrightarrow{u}\\cdot\\overrightarrow{v}+\\|\\overrightarrow{v}\\|^2\\)",
          },
          {
            title: "Formule d'Al-Kashi",
            items: [
              "Généralise Pythagore à un triangle quelconque : utile quand le triangle n'est pas rectangle.",
            ],
            formula: "\\(a^2 = b^2+c^2-2bc\\cos A\\)",
            figure: buildCoursAlKashiFigure(),
          },
        ],
      },
    },
  },
  generate,
};
