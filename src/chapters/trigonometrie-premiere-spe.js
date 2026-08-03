// ---------------------------------------------------------------------------
// Chapitre : Trigonométrie (Première Spé)
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
// Programme : cercle trigonométrique, radian, enroulement de la droite,
// cosinus/sinus d'un nombre réel, valeurs remarquables, lien avec le triangle
// rectangle. (Les dérivées de fonctions trigonométriques relèvent du
// programme de Terminale.)
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

// Table des angles remarquables : { degres, radLabel, cos, sin } (cos/sin en LaTeX exact)
const ANGLES_REMARQUABLES = [
  { degres: 0, radLabel: "0", cos: "1", sin: "0" },
  { degres: 30, radLabel: "\\dfrac{\\pi}{6}", cos: "\\dfrac{\\sqrt{3}}{2}", sin: "\\dfrac{1}{2}" },
  { degres: 45, radLabel: "\\dfrac{\\pi}{4}", cos: "\\dfrac{\\sqrt{2}}{2}", sin: "\\dfrac{\\sqrt{2}}{2}" },
  { degres: 60, radLabel: "\\dfrac{\\pi}{3}", cos: "\\dfrac{1}{2}", sin: "\\dfrac{\\sqrt{3}}{2}" },
  { degres: 90, radLabel: "\\dfrac{\\pi}{2}", cos: "0", sin: "1" },
  { degres: 180, radLabel: "\\pi", cos: "-1", sin: "0" },
];

// =========================== Générateurs paramétrés ===========================

// ---------- 1. Conversion degrés vers radians (angle remarquable) ----------
function genConversionDegresRadiansQCM() {
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres !== 0));
  const options = shuffle([
    cas.radLabel,
    ...shuffle(ANGLES_REMARQUABLES.filter((c) => c.radLabel !== cas.radLabel)).slice(0, 3).map((c) => c.radLabel),
  ]);
  return {
    type: "qcm",
    chapter: "Trigonométrie — Radian",
    prompt: `Convertis \\(${cas.degres}°\\) en radians.`,
    answer: cas.radLabel,
    options,
    steps: [`\\text{On utilise la proportionnalité } 180° \\leftrightarrow \\pi \\text{ radians.}`, `${cas.degres}° = ${cas.radLabel} \\text{ rad}`],
  };
}

// ---------- 2. Conversion radians vers degrés (angle remarquable) ----------
function genConversionRadiansDegresNumeric() {
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres !== 0));
  return {
    type: "numeric",
    chapter: "Trigonométrie — Radian",
    prompt: `Convertis \\(${cas.radLabel}\\) radians en degrés.`,
    answer: cas.degres,
    steps: [`\\text{On utilise la proportionnalité } \\pi \\text{ rad} \\leftrightarrow 180°.`, `${cas.radLabel} \\text{ rad} = ${cas.degres}°`],
  };
}

// ---------- 3. Longueur d'un arc de cercle ----------
function genLongueurArcNumeric() {
  const r = randInt(2, 15);
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres !== 0 && c.degres !== 180 && c.degres !== 45));
  // longueur = r * theta (theta en radians), on choisit des angles où r * (pi/n) donne une valeur simple à approx.
  const theta = (cas.degres * Math.PI) / 180;
  const answer = roundTo(r * theta, 2);
  return {
    type: "numeric",
    chapter: "Trigonométrie — Longueur d'arc",
    prompt: `Un cercle a pour rayon \\(r = ${r}\\). Calcule la longueur de l'arc correspondant à un angle de \\(${cas.radLabel}\\) radian (formule \\(\\ell = r \\times \\theta\\)), valeur arrondie au centième.`,
    answer,
    tolerance: 0.01,
    steps: [`\\ell = r \\times \\theta = ${r} \\times ${cas.radLabel} \\approx ${fr(answer)}`],
  };
}

// ---------- 4. Valeur remarquable du cosinus ----------
function genValeurCosinusQCM() {
  const cas = pick(ANGLES_REMARQUABLES);
  const autresValeurs = shuffle([...new Set(ANGLES_REMARQUABLES.map((c) => c.cos))].filter((v) => v !== cas.cos)).slice(0, 3);
  const options = shuffle([cas.cos, ...autresValeurs]);
  return {
    type: "qcm",
    chapter: "Trigonométrie — Valeurs remarquables",
    prompt: `Quelle est la valeur de \\(\\cos\\left(${cas.radLabel}\\right)\\) ?`,
    answer: cas.cos,
    options,
    steps: [`\\cos\\left(${cas.radLabel}\\right) = ${cas.cos}`],
  };
}

// ---------- 5. Valeur remarquable du sinus ----------
function genValeurSinusQCM() {
  const cas = pick(ANGLES_REMARQUABLES);
  const autresValeurs = shuffle([...new Set(ANGLES_REMARQUABLES.map((c) => c.sin))].filter((v) => v !== cas.sin)).slice(0, 3);
  const options = shuffle([cas.sin, ...autresValeurs]);
  return {
    type: "qcm",
    chapter: "Trigonométrie — Valeurs remarquables",
    prompt: `Quelle est la valeur de \\(\\sin\\left(${cas.radLabel}\\right)\\) ?`,
    answer: cas.sin,
    options,
    steps: [`\\sin\\left(${cas.radLabel}\\right) = ${cas.sin}`],
  };
}

// ---------- 6. Identifier l'angle à partir d'une valeur remarquable ----------
function genIdentifierAngleQCM() {
  const fonction = pick(["cos", "sin"]);
  const candidats = ANGLES_REMARQUABLES.filter((c) => c.degres !== 180 || fonction === "cos");
  const cas = pick(candidats);
  const valeurCible = fonction === "cos" ? cas.cos : cas.sin;
  // on cherche les autres angles ayant une valeur différente pour la même fonction
  const autresAngles = shuffle(
    ANGLES_REMARQUABLES.filter((c) => (fonction === "cos" ? c.cos !== valeurCible : c.sin !== valeurCible))
  ).slice(0, 3);
  const options = shuffle([cas.radLabel, ...autresAngles.map((c) => c.radLabel)]);
  return {
    type: "qcm",
    chapter: "Trigonométrie — Valeurs remarquables",
    prompt: `Pour quelle valeur remarquable de \\(x\\) (parmi les propositions) a-t-on \\(${fonction}(x) = ${valeurCible}\\) ?`,
    answer: cas.radLabel,
    options,
    steps: [`${fonction}\\left(${cas.radLabel}\\right) = ${valeurCible}`],
  };
}

// ---------- 7. Relation fondamentale cos²x + sin²x = 1 ----------
function genRelationFondamentaleNumeric() {
  const sinValues = [0.6, 0.8, -0.6, -0.8];
  const sinX = pick(sinValues);
  const answer = roundTo(1 - sinX * sinX, 2);
  return {
    type: "numeric",
    chapter: "Trigonométrie — Relation fondamentale",
    prompt: `On sait que \\(\\sin(x) = ${fr(sinX)}\\). En utilisant la relation \\(\\cos^2(x) + \\sin^2(x) = 1\\), calcule \\(\\cos^2(x)\\).`,
    answer,
    tolerance: 0.01,
    steps: [`\\cos^2(x) = 1 - \\sin^2(x) = 1 - (${fr(sinX)})^2 = 1 - ${fr(roundTo(sinX * sinX, 2))} = ${fr(answer)}`],
  };
}

// ---------- 8. Parité du cosinus : cos(-x) = cos(x) ----------
function genPariteCosinusQCM() {
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres !== 0 && c.degres !== 45));
  return {
    type: "qcm",
    chapter: "Trigonométrie — Angles associés",
    prompt: `Sachant que \\(\\cos\\left(${cas.radLabel}\\right) = ${cas.cos}\\), quelle est la valeur de \\(\\cos\\left(-${cas.radLabel}\\right)\\) ?`,
    answer: cas.cos,
    options: [cas.cos, `-${cas.cos}`, cas.sin],
    steps: [`\\text{La fonction cosinus est paire : } \\cos(-x) = \\cos(x)`, `\\cos\\left(-${cas.radLabel}\\right) = ${cas.cos}`],
  };
}

// ---------- 9. Imparité du sinus : sin(-x) = -sin(x) ----------
function genImparitéSinusQCM() {
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres !== 0 && c.degres !== 180 && c.degres !== 45));
  const negRaw = `-${cas.sin}`;
  return {
    type: "qcm",
    chapter: "Trigonométrie — Angles associés",
    prompt: `Sachant que \\(\\sin\\left(${cas.radLabel}\\right) = ${cas.sin}\\), quelle est la valeur de \\(\\sin\\left(-${cas.radLabel}\\right)\\) ?`,
    answer: negRaw,
    options: [negRaw, cas.sin, cas.cos],
    steps: [`\\text{La fonction sinus est impaire : } \\sin(-x) = -\\sin(x)`, `\\sin\\left(-${cas.radLabel}\\right) = ${negRaw}`],
  };
}

// ---------- 10. Angle associé : cos(π - x) = -cos(x) ----------
function genAngleAssocieCosPiMoinsXQCM() {
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres !== 0 && c.degres !== 180 && c.degres !== 45));
  const negRaw = `-${cas.cos}`;
  return {
    type: "qcm",
    chapter: "Trigonométrie — Angles associés",
    prompt: `Sachant que \\(\\cos\\left(${cas.radLabel}\\right) = ${cas.cos}\\), quelle est la valeur de \\(\\cos\\left(\\pi - ${cas.radLabel}\\right)\\) ?`,
    answer: negRaw,
    options: [negRaw, cas.cos, cas.sin],
    steps: [`\\cos(\\pi - x) = -\\cos(x)`, `\\cos\\left(\\pi - ${cas.radLabel}\\right) = ${negRaw}`],
  };
}

// ---------- 11. Angle associé : sin(π - x) = sin(x) ----------
function genAngleAssocieSinPiMoinsXQCM() {
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres !== 0 && c.degres !== 180 && c.degres !== 45));
  return {
    type: "qcm",
    chapter: "Trigonométrie — Angles associés",
    prompt: `Sachant que \\(\\sin\\left(${cas.radLabel}\\right) = ${cas.sin}\\), quelle est la valeur de \\(\\sin\\left(\\pi - ${cas.radLabel}\\right)\\) ?`,
    answer: cas.sin,
    options: [cas.sin, `-${cas.sin}`, cas.cos],
    steps: [`\\sin(\\pi - x) = \\sin(x)`, `\\sin\\left(\\pi - ${cas.radLabel}\\right) = ${cas.sin}`],
  };
}

// ---------- 12. Angle associé : cos(π + x) = -cos(x) ----------
function genAngleAssocieCosPiPlusXQCM() {
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres !== 0 && c.degres !== 180 && c.degres !== 45));
  const negRaw = `-${cas.cos}`;
  return {
    type: "qcm",
    chapter: "Trigonométrie — Angles associés",
    prompt: `Sachant que \\(\\cos\\left(${cas.radLabel}\\right) = ${cas.cos}\\), quelle est la valeur de \\(\\cos\\left(\\pi + ${cas.radLabel}\\right)\\) ?`,
    answer: negRaw,
    options: [negRaw, cas.cos, cas.sin],
    steps: [`\\cos(\\pi + x) = -\\cos(x)`, `\\cos\\left(\\pi + ${cas.radLabel}\\right) = ${negRaw}`],
  };
}

// ---------- 13. Angle associé : sin(π + x) = -sin(x) ----------
function genAngleAssocieSinPiPlusXQCM() {
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres !== 0 && c.degres !== 180 && c.degres !== 45));
  const negRaw = `-${cas.sin}`;
  return {
    type: "qcm",
    chapter: "Trigonométrie — Angles associés",
    prompt: `Sachant que \\(\\sin\\left(${cas.radLabel}\\right) = ${cas.sin}\\), quelle est la valeur de \\(\\sin\\left(\\pi + ${cas.radLabel}\\right)\\) ?`,
    answer: negRaw,
    options: [negRaw, cas.sin, cas.cos],
    steps: [`\\sin(\\pi + x) = -\\sin(x)`, `\\sin\\left(\\pi + ${cas.radLabel}\\right) = ${negRaw}`],
  };
}

// ---------- 14. Signe de cos et sin selon le quadrant ----------
function genSigneQuadrantQCM() {
  const quadrant = pick([1, 2, 3, 4]);
  const signes = {
    1: { cos: "positif", sin: "positif" },
    2: { cos: "négatif", sin: "positif" },
    3: { cos: "négatif", sin: "négatif" },
    4: { cos: "positif", sin: "négatif" },
  };
  const fonction = pick(["cos", "sin"]);
  const answer = signes[quadrant][fonction];
  const intervalles = {
    1: "\\left[0 ; \\dfrac{\\pi}{2}\\right]",
    2: "\\left[\\dfrac{\\pi}{2} ; \\pi\\right]",
    3: "\\left[\\pi ; \\dfrac{3\\pi}{2}\\right]",
    4: "\\left[\\dfrac{3\\pi}{2} ; 2\\pi\\right]",
  };
  return {
    type: "qcm",
    chapter: "Trigonométrie — Signe selon le quadrant",
    prompt: `Pour \\(x \\in ${intervalles[quadrant]}\\) (${quadrant}${quadrant === 1 ? "er" : "e"} quadrant), quel est le signe de \\(${fonction}(x)\\) ?`,
    answer,
    options: ["positif", "négatif"],
    steps: [`\\text{Dans le ${quadrant}${quadrant === 1 ? "er" : "e"} quadrant du cercle trigonométrique, } ${fonction}(x) \\text{ est ${answer}.}`],
  };
}

// ---------- 15. Lien avec le triangle rectangle ----------
function genLienTriangleRectangleQCM() {
  // On exclut 45° car cos(45°) = sin(45°), ce qui rendrait les options non distinctes.
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres === 30 || c.degres === 60));
  const autreValeur = ANGLES_REMARQUABLES.find((c) => c.degres === 45).cos;
  const options = shuffle([cas.cos, cas.sin, autreValeur]);
  return {
    type: "qcm",
    chapter: "Trigonométrie — Lien avec le triangle rectangle",
    prompt: `Dans un triangle rectangle, un angle aigu mesure \\(${cas.degres}°\\) (soit \\(${cas.radLabel}\\) rad). Quel est le cosinus de cet angle ?`,
    answer: cas.cos,
    options,
    steps: [`\\text{Dans le triangle rectangle, } \\cos(${cas.radLabel}) = \\dfrac{\\text{adjacent}}{\\text{hypoténuse}} = ${cas.cos}`],
  };
}

const GENERATORS = [
  genConversionDegresRadiansQCM,
  genConversionRadiansDegresNumeric,
  genLongueurArcNumeric,
  genValeurCosinusQCM,
  genValeurSinusQCM,
  genIdentifierAngleQCM,
  genRelationFondamentaleNumeric,
  genPariteCosinusQCM,
  genImparitéSinusQCM,
  genAngleAssocieCosPiMoinsXQCM,
  genAngleAssocieSinPiMoinsXQCM,
  genAngleAssocieCosPiPlusXQCM,
  genAngleAssocieSinPiPlusXQCM,
  genSigneQuadrantQCM,
  genLienTriangleRectangleQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "trigonometrie-premiere-spe",
    title: "Trigonométrie",
    description: "Cercle trigonométrique, radian, valeurs remarquables, angles associés, lien avec le triangle rectangle.",
    level: "premiere-spe",
    order: 7,
  },
  generate,
};
