// ---------------------------------------------------------------------------
// Chapitre : Géométrie repérée (Première Spé)
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
//
// Programme : plan rapporté à un repère orthonormé — vecteur normal à une
// droite, projection orthogonale d'un point sur une droite, équation de cercle.
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
const signedL = (n, withVar = "") => (n >= 0 ? `+ ${n}${withVar}` : `- ${Math.abs(n)}${withVar}`);

// =========================== Générateurs paramétrés ===========================

// ---------- 1. Lire un vecteur normal depuis l'équation d'une droite ----------
function genLireVecteurNormalNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = randInt(-10, 10);
  return {
    type: "numeric",
    chapter: "Géométrie repérée — Vecteur normal",
    prompt: `On considère la droite \\(d\\) d'équation \\(${a}x ${signedL(b, "y")} ${signedL(c)} = 0\\). Le vecteur \\(\\vec{n}(${a} ; b)\\) est normal à \\(d\\). Donne la valeur de \\(b\\).`,
    answer: b,
    steps: [`\\text{Pour une droite d'équation } ax + by + c = 0, \\text{ le vecteur } (a ; b) \\text{ est normal à la droite.}`, `\\text{Ici : } b = ${b}`],
  };
}

// ---------- 2. Équation cartésienne connaissant un point et un vecteur normal ----------
function genEquationDroitePointVecteurNormalNumeric() {
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const x0 = randInt(-9, 9);
  const y0 = randInt(-9, 9);
  const c = -(a * x0 + b * y0);
  return {
    type: "numeric",
    chapter: "Géométrie repérée — Équation d'une droite",
    prompt: `La droite \\(d\\) passe par \\(A(${x0} ; ${y0})\\) et admet \\(\\vec{n}(${a} ; ${b})\\) comme vecteur normal. Son équation est de la forme \\(${a}x ${signedL(b, "y")} + c = 0\\). Détermine la valeur de \\(c\\).`,
    answer: c,
    steps: [
      `\\text{Le point A vérifie l'équation : } ${a} \\times ${x0} + ${b} \\times ${y0} + c = 0`,
      `c = -(${a} \\times ${x0} + ${b} \\times ${y0}) = -(${a * x0} + ${b * y0}) = ${c}`,
    ],
  };
}

// ---------- 3. Vérifier si un vecteur est normal à une droite ----------
function genVerifierVecteurNormalQCM() {
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const c = randInt(-10, 10);
  const estNormal = Math.random() < 0.5;
  let xn, yn;
  if (estNormal) {
    const k = nonZero(1, 3);
    xn = a * k;
    yn = b * k;
  } else {
    xn = nonZero(-8, 8);
    yn = nonZero(-8, 8);
  }
  // Le vecteur (xn, yn) est colinéaire à (a, b), donc normal à d, ssi xn*b - yn*a = 0
  const colineaire = xn * b - yn * a === 0;
  const answer = colineaire ? "normal" : "non normal";
  return {
    type: "qcm",
    chapter: "Géométrie repérée — Vecteur normal",
    prompt: `On considère la droite \\(d\\) d'équation \\(${a}x ${signedL(b, "y")} ${signedL(c)} = 0\\) et le vecteur \\(\\vec{w}(${xn} ; ${yn})\\). \\(\\vec{w}\\) est-il normal à \\(d\\) ?`,
    answer,
    options: ["normal", "non normal"],
    steps: [
      `\\text{Le vecteur } (${a} ; ${b}) \\text{ est normal à } d. \\text{ On vérifie si } (${xn} ; ${yn}) \\text{ lui est colinéaire.}`,
      `${xn} \\times ${b} - ${yn} \\times ${a} = ${xn * b - yn * a}`,
      answer === "normal" ? `\\text{Ce produit est nul : } \\vec{w} \\text{ est normal à } d.` : `\\text{Ce produit n'est pas nul : } \\vec{w} \\text{ n'est pas normal à } d.`,
    ],
  };
}

// ---------- 4. Équation de cercle : rayon au carré depuis centre et rayon ----------
function genEquationCercleR2Numeric() {
  const a = randInt(-9, 9);
  const b = randInt(-9, 9);
  const r = randInt(2, 12);
  return {
    type: "numeric",
    chapter: "Géométrie repérée — Équation de cercle",
    prompt: `Le cercle \\(\\mathcal{C}\\) a pour centre \\(\\Omega(${a} ; ${b})\\) et pour rayon \\(r = ${r}\\). Son équation est \\((x - ${a})^2 + (y - ${b})^2 = k\\). Donne la valeur de \\(k\\).`,
    answer: r * r,
    steps: [`k = r^2 = ${r}^2 = ${r * r}`],
  };
}

// ---------- 5. Reconnaître centre et rayon (forme canonique) ----------
function genCentreRayonCanoniqueNumeric() {
  const a = randInt(-9, 9);
  const b = randInt(-9, 9);
  const r = randInt(2, 12);
  return {
    type: "numeric",
    chapter: "Géométrie repérée — Équation de cercle",
    prompt: `Le cercle \\(\\mathcal{C}\\) a pour équation \\((x - ${a})^2 + (y ${signedL(-b)})^2 = ${r * r}\\). Donne le rayon de ce cercle.`,
    answer: r,
    steps: [`\\text{L'équation est de la forme } (x-a)^2+(y-b)^2=r^2, \\text{ donc } r^2 = ${r * r} \\Rightarrow r = ${r}`],
  };
}

// ---------- 6. Centre depuis l'équation développée (complétion du carré) ----------
function genCentreEquationDeveloppeeNumeric() {
  const a = randInt(-8, 8);
  const b = randInt(-8, 8);
  const r = randInt(2, 10);
  // (x-a)^2 + (y-b)^2 = r^2  =>  x^2 - 2ax + a^2 + y^2 - 2by + b^2 - r^2 = 0
  const D = -2 * a;
  const E = -2 * b;
  const F = a * a + b * b - r * r;
  return {
    type: "numeric",
    chapter: "Géométrie repérée — Équation de cercle développée",
    prompt: `Le cercle \\(\\mathcal{C}\\) a pour équation \\(x^2 + y^2 ${signedL(D, "x")} ${signedL(E, "y")} ${signedL(F)} = 0\\). Donne l'abscisse du centre de \\(\\mathcal{C}\\) (formule : abscisse \\(= -\\dfrac{D}{2}\\), où \\(D\\) est le coefficient de \\(x\\)).`,
    answer: a,
    steps: [`\\text{abscisse du centre} = -\\dfrac{${D}}{2} = ${a}`],
  };
}

// ---------- 7. Rayon depuis l'équation développée ----------
function genRayonEquationDeveloppeeNumeric() {
  const a = randInt(-8, 8);
  const b = randInt(-8, 8);
  const r = randInt(2, 10);
  const D = -2 * a;
  const E = -2 * b;
  const F = a * a + b * b - r * r;
  return {
    type: "numeric",
    chapter: "Géométrie repérée — Équation de cercle développée",
    prompt: `Le cercle \\(\\mathcal{C}\\) a pour équation \\(x^2 + y^2 ${signedL(D, "x")} ${signedL(E, "y")} ${signedL(F)} = 0\\), de centre \\(\\Omega(${a} ; ${b})\\). Calcule son rayon \\(r\\) (formule \\(r^2 = a^2 + b^2 - F\\), où \\(F\\) est le terme constant).`,
    answer: r,
    steps: [`r^2 = ${a}^2 + ${b}^2 - (${F}) = ${a * a} + ${b * b} - (${F}) = ${r * r}`, `r = \\sqrt{${r * r}} = ${r}`],
  };
}

// ---------- 8. Appartenance d'un point à un cercle ----------
function genAppartenanceCercleQCM() {
  const a = randInt(-8, 8);
  const b = randInt(-8, 8);
  const r = randInt(2, 10);
  const surLeCercle = Math.random() < 0.5;
  let x, y;
  if (surLeCercle) {
    const triplets = [
      [3, 4, 5],
      [6, 8, 10],
      [5, 12, 13],
      [8, 15, 17],
    ];
    const t = pick(triplets);
    const rScaled = t[2];
    const angleChoice = pick([
      [t[0], t[1]],
      [-t[0], t[1]],
      [t[0], -t[1]],
      [-t[0], -t[1]],
      [t[1], t[0]],
    ]);
    x = a + angleChoice[0];
    y = b + angleChoice[1];
    const rFinal = rScaled;
    const distCarre = angleChoice[0] ** 2 + angleChoice[1] ** 2;
    const reponse = distCarre === rFinal * rFinal ? "appartient au cercle" : "n'appartient pas au cercle";
    const distanceCarre = (x - a) ** 2 + (y - b) ** 2;
    const answer = distanceCarre === rFinal * rFinal ? "appartient au cercle" : "n'appartient pas au cercle";
    return {
      type: "qcm",
      chapter: "Géométrie repérée — Appartenance à un cercle",
      prompt: `Le cercle \\(\\mathcal{C}\\) a pour centre \\(\\Omega(${a} ; ${b})\\) et pour rayon \\(r = ${rFinal}\\). Le point \\(M(${x} ; ${y})\\) appartient-il à \\(\\mathcal{C}\\) ?`,
      answer,
      options: ["appartient au cercle", "n'appartient pas au cercle"],
      steps: [
        `\\Omega M^2 = (${x} - ${a})^2 + (${y} - ${b})^2 = ${(x - a) ** 2} + ${(y - b) ** 2} = ${distanceCarre}`,
        `r^2 = ${rFinal}^2 = ${rFinal * rFinal}`,
        answer === "appartient au cercle" ? `\\text{Comme } \\Omega M^2 = r^2, M \\text{ appartient au cercle.}` : `\\text{Comme } \\Omega M^2 \\neq r^2, M \\text{ n'appartient pas au cercle.}`,
      ],
    };
  } else {
    x = a + nonZero(-9, 9);
    y = b + nonZero(-9, 9);
    const distanceCarre = (x - a) ** 2 + (y - b) ** 2;
    const answer = distanceCarre === r * r ? "appartient au cercle" : "n'appartient pas au cercle";
    return {
      type: "qcm",
      chapter: "Géométrie repérée — Appartenance à un cercle",
      prompt: `Le cercle \\(\\mathcal{C}\\) a pour centre \\(\\Omega(${a} ; ${b})\\) et pour rayon \\(r = ${r}\\). Le point \\(M(${x} ; ${y})\\) appartient-il à \\(\\mathcal{C}\\) ?`,
      answer,
      options: ["appartient au cercle", "n'appartient pas au cercle"],
      steps: [
        `\\Omega M^2 = (${x} - ${a})^2 + (${y} - ${b})^2 = ${(x - a) ** 2} + ${(y - b) ** 2} = ${distanceCarre}`,
        `r^2 = ${r}^2 = ${r * r}`,
        answer === "appartient au cercle" ? `\\text{Comme } \\Omega M^2 = r^2, M \\text{ appartient au cercle.}` : `\\text{Comme } \\Omega M^2 \\neq r^2, M \\text{ n'appartient pas au cercle.}`,
      ],
    };
  }
}

// ---------- 9. Projection orthogonale sur une droite horizontale ----------
function genProjectionDroiteHorizontaleNumeric() {
  const k = randInt(-9, 9);
  const x0 = randInt(-9, 9);
  const y0 = randInt(-9, 9);
  return {
    type: "numeric",
    chapter: "Géométrie repérée — Projection orthogonale",
    prompt: `On considère la droite \\(d\\) d'équation \\(y = ${k}\\) et le point \\(M(${x0} ; ${y0})\\). Le projeté orthogonal de \\(M\\) sur \\(d\\) est le point \\(H(x_H ; y_H)\\). Donne la valeur de \\(y_H\\).`,
    answer: k,
    steps: [`\\text{La droite } d \\text{ est horizontale, donc le projeté orthogonal de M a la même abscisse et pour ordonnée celle de } d.`, `y_H = ${k}`],
  };
}

// ---------- 10. Projection orthogonale sur une droite verticale ----------
function genProjectionDroiteVerticaleNumeric() {
  const k = randInt(-9, 9);
  const x0 = randInt(-9, 9);
  const y0 = randInt(-9, 9);
  return {
    type: "numeric",
    chapter: "Géométrie repérée — Projection orthogonale",
    prompt: `On considère la droite \\(d\\) d'équation \\(x = ${k}\\) et le point \\(M(${x0} ; ${y0})\\). Le projeté orthogonal de \\(M\\) sur \\(d\\) est le point \\(H(x_H ; y_H)\\). Donne la valeur de \\(x_H\\).`,
    answer: k,
    steps: [`\\text{La droite } d \\text{ est verticale, donc le projeté orthogonal de M a la même ordonnée et pour abscisse celle de } d.`, `x_H = ${k}`],
  };
}

// ---------- 11. Vecteur normal à partir d'un vecteur directeur ----------
function genVecteurNormalDepuisDirecteurNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Géométrie repérée — Vecteur normal",
    prompt: `Une droite \\(d\\) admet \\(\\vec{u}(${a} ; ${b})\\) comme vecteur directeur. Un vecteur normal à \\(d\\) est \\(\\vec{n}(-${b} ; k)\\). Donne la valeur de \\(k\\).`,
    answer: a,
    steps: [`\\text{Si } \\vec{u}(a ; b) \\text{ dirige } d, \\text{ alors } \\vec{n}(-b ; a) \\text{ est normal à } d.`, `k = ${a}`],
  };
}

// ---------- 12. Rayon d'un cercle passant par un point connu, centre donné ----------
function genRayonCerclePassantParPointNumeric() {
  const a = randInt(-8, 8);
  const b = randInt(-8, 8);
  const triplets = [
    [3, 4, 5],
    [6, 8, 10],
    [5, 12, 13],
    [8, 15, 17],
    [9, 12, 15],
  ];
  const [dx, dy, r] = pick(triplets);
  const signeX = pick([1, -1]);
  const signeY = pick([1, -1]);
  const x0 = a + signeX * dx;
  const y0 = b + signeY * dy;
  return {
    type: "numeric",
    chapter: "Géométrie repérée — Équation de cercle",
    prompt: `Le cercle \\(\\mathcal{C}\\) a pour centre \\(\\Omega(${a} ; ${b})\\) et passe par le point \\(A(${x0} ; ${y0})\\). Calcule son rayon \\(r = \\Omega A\\).`,
    answer: r,
    steps: [`r = \\sqrt{(${x0} - ${a})^2 + (${y0} - ${b})^2} = \\sqrt{${(x0 - a) ** 2} + ${(y0 - b) ** 2}} = \\sqrt{${(x0 - a) ** 2 + (y0 - b) ** 2}} = ${r}`],
  };
}

// ---------- 13. Vrai ou faux sur la géométrie repérée ----------
function genVraiFauxGeometrieRepereeQCM() {
  const cas = pick([
    { description: "Le vecteur (a ; b) est normal à la droite d'équation ax + by + c = 0.", reponse: "Vrai" },
    { description: "Le projeté orthogonal d'un point sur une droite horizontale a la même abscisse que ce point.", reponse: "Vrai" },
    { description: "Un cercle d'équation (x-a)² + (y-b)² = k n'existe que si k > 0.", reponse: "Vrai" },
    { description: "Le centre d'un cercle d'équation x² + y² + Dx + Ey + F = 0 a pour abscisse D/2.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Géométrie repérée — Vrai ou faux",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 14. Reconnaître si une équation est bien celle d'un cercle ----------
function genReconnaitreEquationCercleQCM() {
  const estCercle = Math.random() < 0.5;
  const a = randInt(-7, 7);
  const b = randInt(-7, 7);
  let F;
  if (estCercle) {
    const r = randInt(2, 9);
    F = a * a + b * b - r * r;
  } else {
    // On choisit F pour que a² + b² - F soit négatif ou nul (pas un cercle)
    F = a * a + b * b + randInt(1, 10);
  }
  const D = -2 * a;
  const E = -2 * b;
  const rCarre = a * a + b * b - F;
  const answer = rCarre > 0 ? "C'est l'équation d'un cercle" : "Ce n'est pas l'équation d'un cercle";
  return {
    type: "qcm",
    chapter: "Géométrie repérée — Équation de cercle",
    prompt: `L'équation \\(x^2 + y^2 ${signedL(D, "x")} ${signedL(E, "y")} ${signedL(F)} = 0\\) est-elle celle d'un cercle ?`,
    answer,
    options: ["C'est l'équation d'un cercle", "Ce n'est pas l'équation d'un cercle"],
    steps: [`r^2 = a^2 + b^2 - F = ${a * a} + ${b * b} - (${F}) = ${rCarre}`, rCarre > 0 ? `\\text{Comme } r^2 > 0, \\text{ c'est bien l'équation d'un cercle.}` : `\\text{Comme } r^2 \\leq 0, \\text{ ce n'est pas l'équation d'un cercle.}`],
  };
}

// ---------- 15. Distance d'un point à une droite horizontale ou verticale ----------
function genDistancePointDroiteAxeNumeric() {
  const horizontale = Math.random() < 0.5;
  const k = randInt(-9, 9);
  const x0 = randInt(-9, 9);
  const y0 = randInt(-9, 9);
  const answer = horizontale ? Math.abs(y0 - k) : Math.abs(x0 - k);
  return {
    type: "numeric",
    chapter: "Géométrie repérée — Projection orthogonale",
    prompt: `Calcule la distance du point \\(M(${x0} ; ${y0})\\) à la droite \\(d\\) d'équation \\(${horizontale ? `y = ${k}` : `x = ${k}`}\\).`,
    answer,
    steps: [
      horizontale
        ? `\\text{La distance à une droite horizontale est } |y_M - ${k}| = |${y0} - ${k}| = ${answer}`
        : `\\text{La distance à une droite verticale est } |x_M - ${k}| = |${x0} - ${k}| = ${answer}`,
    ],
  };
}

const GENERATORS = [
  genLireVecteurNormalNumeric,
  genEquationDroitePointVecteurNormalNumeric,
  genVerifierVecteurNormalQCM,
  genEquationCercleR2Numeric,
  genCentreRayonCanoniqueNumeric,
  genCentreEquationDeveloppeeNumeric,
  genRayonEquationDeveloppeeNumeric,
  genAppartenanceCercleQCM,
  genProjectionDroiteHorizontaleNumeric,
  genProjectionDroiteVerticaleNumeric,
  genVecteurNormalDepuisDirecteurNumeric,
  genRayonCerclePassantParPointNumeric,
  genVraiFauxGeometrieRepereeQCM,
  genReconnaitreEquationCercleQCM,
  genDistancePointDroiteAxeNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "geometrie-reperee-premiere-spe",
    title: "Géométrie repérée",
    description: "Vecteur normal à une droite, équation de cercle, projection orthogonale d'un point sur une droite.",
    level: "premiere-spe",
    order: 9,
  },
  generate,
};
