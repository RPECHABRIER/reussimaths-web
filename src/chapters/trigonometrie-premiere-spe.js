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
// rectangle, formules d'addition et de duplication, résolution d'équations
// trigonométriques cos(x)=a / sin(x)=a sur un intervalle. (Les dérivées de
// fonctions trigonométriques relèvent du programme de Terminale.)
//
// NOTE (audit programme 2026) : ajout des formules d'addition/duplication
// (genFormuleAdditionCosQCM, genFormuleAdditionSinQCM,
// genFormuleDuplicationCosNumeric, genFormuleDuplicationSinNumeric) et de la
// résolution d'équations trigonométriques (genResoudreEquationCosQCM,
// genResoudreEquationSinQCM), deux écarts identifiés par l'audit officiel.
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
    steps: [
      { type: "regle", text: `\\text{On utilise la proportionnalité } 180° \\leftrightarrow \\pi \\text{ radians.}` },
      { type: "resultat", text: `${cas.degres}° = ${cas.radLabel} \\text{ rad}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{On utilise la proportionnalité } \\pi \\text{ rad} \\leftrightarrow 180°.` },
      { type: "resultat", text: `${cas.radLabel} \\text{ rad} = ${cas.degres}°` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Formule de référence à connaître : } \\ell = r \\times \\theta, \\text{ avec } \\theta \\text{ en radians.}` },
      { type: "resultat", text: `\\ell = ${r} \\times ${cas.radLabel} \\approx ${fr(answer)}` },
    ],
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
    steps: [{ type: "regle", text: `\\text{Valeur remarquable à connaître par cœur : } \\cos\\left(${cas.radLabel}\\right) = ${cas.cos}.` }],
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
    steps: [{ type: "regle", text: `\\text{Valeur remarquable à connaître par cœur : } \\sin\\left(${cas.radLabel}\\right) = ${cas.sin}.` }],
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
    steps: [{ type: "regle", text: `\\text{On cherche l'angle remarquable dont la valeur est connue par cœur : } ${fonction}\\left(${cas.radLabel}\\right) = ${valeurCible}.` }],
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
    steps: [
      { type: "regle", text: `\\text{Formule de référence à connaître : } \\cos^2(x) + \\sin^2(x) = 1 \\Rightarrow \\cos^2(x) = 1 - \\sin^2(x).` },
      { type: "resultat", text: `\\cos^2(x) = 1 - (${fr(sinX)})^2 = 1 - ${fr(roundTo(sinX * sinX, 2))} = ${fr(answer)}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{La fonction cosinus est paire : } \\cos(-x) = \\cos(x).` },
      { type: "resultat", text: `\\cos\\left(-${cas.radLabel}\\right) = ${cas.cos}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{La fonction sinus est impaire : } \\sin(-x) = -\\sin(x).` },
      { type: "resultat", text: `\\sin\\left(-${cas.radLabel}\\right) = ${negRaw}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Formule des angles associés à connaître : } \\cos(\\pi - x) = -\\cos(x).` },
      { type: "resultat", text: `\\cos\\left(\\pi - ${cas.radLabel}\\right) = ${negRaw}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Formule des angles associés à connaître : } \\sin(\\pi - x) = \\sin(x).` },
      { type: "resultat", text: `\\sin\\left(\\pi - ${cas.radLabel}\\right) = ${cas.sin}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Formule des angles associés à connaître : } \\cos(\\pi + x) = -\\cos(x).` },
      { type: "resultat", text: `\\cos\\left(\\pi + ${cas.radLabel}\\right) = ${negRaw}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Formule des angles associés à connaître : } \\sin(\\pi + x) = -\\sin(x).` },
      { type: "resultat", text: `\\sin\\left(\\pi + ${cas.radLabel}\\right) = ${negRaw}` },
    ],
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
    steps: [{ type: "regle", text: `\\text{Dans le ${quadrant}${quadrant === 1 ? "er" : "e"} quadrant du cercle trigonométrique, } ${fonction}(x) \\text{ est ${answer}.}` }],
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
    steps: [{ type: "regle", text: `\\text{Dans le triangle rectangle, } \\cos(${cas.radLabel}) = \\dfrac{\\text{adjacent}}{\\text{hypoténuse}} = ${cas.cos}.` }],
  };
}

// ---------- 16. Formule d'addition : cos(a+b) ----------
function genFormuleAdditionCosQCM() {
  const correct = "\\cos(a)\\cos(b) - \\sin(a)\\sin(b)";
  const distracteurs = shuffle([
    "\\cos(a)\\cos(b) + \\sin(a)\\sin(b)",
    "\\sin(a)\\cos(b) - \\cos(a)\\sin(b)",
    "\\cos(a) + \\cos(b)",
  ]).slice(0, 3);
  return {
    type: "qcm",
    chapter: "Trigonométrie — Formules d'addition",
    prompt: `Quelle est la formule correcte pour \\(\\cos(a+b)\\) ?`,
    answer: correct,
    options: shuffle([correct, ...distracteurs]),
    steps: [{ type: "regle", text: `\\text{Formule d'addition à connaître : } \\cos(a+b) = \\cos(a)\\cos(b) - \\sin(a)\\sin(b).` }],
  };
}

// ---------- 17. Formule d'addition : sin(a+b) ----------
function genFormuleAdditionSinQCM() {
  const correct = "\\sin(a)\\cos(b) + \\cos(a)\\sin(b)";
  const distracteurs = shuffle([
    "\\sin(a)\\cos(b) - \\cos(a)\\sin(b)",
    "\\cos(a)\\cos(b) - \\sin(a)\\sin(b)",
    "\\sin(a) + \\sin(b)",
  ]).slice(0, 3);
  return {
    type: "qcm",
    chapter: "Trigonométrie — Formules d'addition",
    prompt: `Quelle est la formule correcte pour \\(\\sin(a+b)\\) ?`,
    answer: correct,
    options: shuffle([correct, ...distracteurs]),
    steps: [{ type: "regle", text: `\\text{Formule d'addition à connaître : } \\sin(a+b) = \\sin(a)\\cos(b) + \\cos(a)\\sin(b).` }],
  };
}

// ---------- 18. Formule de duplication : cos(2a) = cos²(a) - sin²(a) ----------
function genFormuleDuplicationCosNumeric() {
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres === 30 || c.degres === 45 || c.degres === 60));
  const angleRad = (cas.degres * Math.PI) / 180;
  const answer = roundTo(Math.cos(2 * angleRad), 3);
  return {
    type: "numeric",
    chapter: "Trigonométrie — Formules de duplication",
    prompt: `On sait que \\(\\cos\\left(${cas.radLabel}\\right) = ${cas.cos}\\) et \\(\\sin\\left(${cas.radLabel}\\right) = ${cas.sin}\\). En utilisant la formule \\(\\cos(2a) = \\cos^2(a) - \\sin^2(a)\\), calcule \\(\\cos\\left(2 \\times ${cas.radLabel}\\right)\\) (valeur arrondie au millième).`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `\\text{Formule de duplication à connaître : } \\cos(2a) = \\cos^2(a) - \\sin^2(a).` },
      { type: "resultat", text: `\\cos\\left(2 \\times ${cas.radLabel}\\right) \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 19. Formule de duplication : sin(2a) = 2 sin(a) cos(a) ----------
function genFormuleDuplicationSinNumeric() {
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres === 30 || c.degres === 45 || c.degres === 60));
  const angleRad = (cas.degres * Math.PI) / 180;
  const answer = roundTo(Math.sin(2 * angleRad), 3);
  return {
    type: "numeric",
    chapter: "Trigonométrie — Formules de duplication",
    prompt: `On sait que \\(\\cos\\left(${cas.radLabel}\\right) = ${cas.cos}\\) et \\(\\sin\\left(${cas.radLabel}\\right) = ${cas.sin}\\). En utilisant la formule \\(\\sin(2a) = 2\\sin(a)\\cos(a)\\), calcule \\(\\sin\\left(2 \\times ${cas.radLabel}\\right)\\) (valeur arrondie au millième).`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `\\text{Formule de duplication à connaître : } \\sin(2a) = 2\\sin(a)\\cos(a).` },
      { type: "resultat", text: `\\sin\\left(2 \\times ${cas.radLabel}\\right) \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 20. Résolution d'équation cos(x) = a sur un intervalle ----------
function genResoudreEquationCosQCM() {
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres !== 0 && c.degres !== 180));
  const correct = `\\{${cas.radLabel} ; -${cas.radLabel}\\}`;
  const distracteurs = shuffle([
    `\\{${cas.radLabel}\\}`,
    `\\{${cas.radLabel} ; \\pi - ${cas.radLabel}\\}`,
    `\\{-${cas.radLabel} ; \\pi + ${cas.radLabel}\\}`,
  ]).slice(0, 3);
  return {
    type: "qcm",
    chapter: "Trigonométrie — Équations trigonométriques",
    prompt: `Résous l'équation \\(\\cos(x) = ${cas.cos}\\) sur l'intervalle \\(]-\\pi ; \\pi]\\). Donne l'ensemble des solutions.`,
    answer: correct,
    options: shuffle([correct, ...distracteurs]),
    steps: [
      { type: "regle", text: `\\text{Règle à connaître : } \\cos(x) = \\cos(\\alpha) \\iff x = \\alpha + 2k\\pi \\text{ ou } x = -\\alpha + 2k\\pi, \\ k \\in \\mathbb{Z}.` },
      { type: "resultat", text: `\\text{Sur } ]-\\pi ; \\pi], \\text{ les solutions sont } ${correct}.` },
    ],
  };
}

// ---------- 21. Résolution d'équation sin(x) = a sur un intervalle ----------
function genResoudreEquationSinQCM() {
  const cas = pick(ANGLES_REMARQUABLES.filter((c) => c.degres !== 0 && c.degres !== 90 && c.degres !== 180));
  const correct = `\\{${cas.radLabel} ; \\pi - ${cas.radLabel}\\}`;
  const distracteurs = shuffle([
    `\\{${cas.radLabel}\\}`,
    `\\{${cas.radLabel} ; -${cas.radLabel}\\}`,
    `\\{-${cas.radLabel} ; \\pi + ${cas.radLabel}\\}`,
  ]).slice(0, 3);
  return {
    type: "qcm",
    chapter: "Trigonométrie — Équations trigonométriques",
    prompt: `Résous l'équation \\(\\sin(x) = ${cas.sin}\\) sur l'intervalle \\(]-\\pi ; \\pi]\\). Donne l'ensemble des solutions.`,
    answer: correct,
    options: shuffle([correct, ...distracteurs]),
    steps: [
      { type: "regle", text: `\\text{Règle à connaître : } \\sin(x) = \\sin(\\alpha) \\iff x = \\alpha + 2k\\pi \\text{ ou } x = \\pi - \\alpha + 2k\\pi, \\ k \\in \\mathbb{Z}.` },
      { type: "resultat", text: `\\text{Sur } ]-\\pi ; \\pi], \\text{ les solutions sont } ${correct}.` },
    ],
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
  genFormuleAdditionCosQCM,
  genFormuleAdditionSinQCM,
  genFormuleDuplicationCosNumeric,
  genFormuleDuplicationSinNumeric,
  genResoudreEquationCosQCM,
  genResoudreEquationSinQCM,
];

const DIFFICULTY = {
  genConversionDegresRadiansQCM: "facile",
  genConversionRadiansDegresNumeric: "facile",
  genValeurCosinusQCM: "facile",
  genValeurSinusQCM: "facile",
  genIdentifierAngleQCM: "facile",
  genLongueurArcNumeric: "standard",
  genRelationFondamentaleNumeric: "standard",
  genPariteCosinusQCM: "standard",
  genImparitéSinusQCM: "standard",
  genSigneQuadrantQCM: "standard",
  genLienTriangleRectangleQCM: "standard",
  genAngleAssocieCosPiMoinsXQCM: "expert",
  genAngleAssocieSinPiMoinsXQCM: "expert",
  genAngleAssocieCosPiPlusXQCM: "expert",
  genAngleAssocieSinPiPlusXQCM: "expert",
  genFormuleAdditionCosQCM: "standard",
  genFormuleAdditionSinQCM: "standard",
  genFormuleDuplicationCosNumeric: "expert",
  genFormuleDuplicationSinNumeric: "expert",
  genResoudreEquationCosQCM: "expert",
  genResoudreEquationSinQCM: "expert",
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
// purement numériques/QCM). Cercle trigonométrique et triangle rectangle
// dessinés directement en coordonnées pixel (pas de repère gradué nécessaire).
const R = 55;
const TRIG_M = { x: R * 0.5, y: -R * 0.866 }; // point à 60°

function buildCoursCercleFigure({ withProjections = false } = {}) {
  const points = [
    { id: "O", x: 0, y: 0, hideLabel: true, dx: -4, dy: 14 },
    { id: "X", x: R + 15, y: 0, hideDot: true, hideLabel: true },
    { id: "M", x: TRIG_M.x, y: TRIG_M.y, label: "M", dx: 8, dy: -6 },
  ];
  const segments = [{ from: "O", to: "M" }];
  const lines = [{ from: "O", to: "X", extend: 0, arrowEnd: true }];
  const freeLabels = [{ x: 16, y: -10, text: "θ" }];
  if (withProjections) {
    points.push({ id: "H", x: TRIG_M.x, y: 0, hideDot: true, hideLabel: true }, { id: "K", x: 0, y: TRIG_M.y, hideDot: true, hideLabel: true });
    segments.push({ from: "M", to: "H", dashed: true }, { from: "M", to: "K", dashed: true });
    freeLabels.push({ x: TRIG_M.x, y: 14, text: "cos θ" }, { x: -22, y: TRIG_M.y, text: "sin θ" });
  }
  return { points, segments, lines, circles: [{ center: "O", radius: R }], freeLabels };
}

function buildCoursTriangleTrigFigure() {
  return {
    points: [
      { id: "A", x: 0, y: 0, dx: -10, dy: 14 },
      { id: "B", x: 60, y: 0, dy: 14 },
      { id: "C", x: 60, y: -45, dx: 8, dy: -6 },
    ],
    segments: [{ from: "A", to: "B" }, { from: "A", to: "C" }, { from: "B", to: "C" }],
    rightAngles: [{ at: "B", from: "A", to: "C" }],
    freeLabels: [{ x: 42, y: -10, text: "θ" }],
  };
}

export default {
  meta: {
    id: "trigonometrie-premiere-spe",
    title: "Trigonométrie",
    description: "Cercle trigonométrique, radian, valeurs remarquables, angles associés, lien avec le triangle rectangle, formules d'addition et de duplication, résolution d'équations trigonométriques.",
    pourquoi: "Le cercle trigonométrique et les angles remarquables sont à la base de toute modélisation des phénomènes périodiques.",
    level: "premiere-spe",
    order: 7,
    cours: {
      mindMap: {
        title: "Trigonométrie",
        branches: [
          {
            title: "Cercle trigonométrique et radian",
            items: [
              "Le radian mesure un angle via la longueur de l'arc parcouru sur le cercle de rayon 1.",
              "Un tour complet = \\(2\\pi\\) rad = 360°.",
              "La longueur d'un arc de cercle de rayon r correspondant à un angle θ (en radians) se calcule directement, sans passer par les degrés.",
            ],
            formula: "\\(\\text{angle (rad)} = \\text{angle (°)} \\times \\dfrac{\\pi}{180}\\), \\(\\ell = r \\times \\theta\\)",
            figure: buildCoursCercleFigure(),
          },
          {
            title: "Cosinus et sinus",
            items: [
              "Pour M sur le cercle trigonométrique associé à l'angle θ, \\(\\cos\\theta\\) et \\(\\sin\\theta\\) sont les coordonnées de M.",
              "Piège classique : \\(\\cos^2\\theta + \\sin^2\\theta = 1\\) toujours, mais \\(\\cos\\theta + \\sin\\theta \\neq 1\\) en général.",
              "Valeurs remarquables à connaître par cœur (tableau à mémoriser, symétrique entre cos et sin) :",
            ],
            formula: "\\[\\begin{array}{|l|c|c|c|c|c|} \\hline \\theta & 0 & \\frac{\\pi}{6} & \\frac{\\pi}{4} & \\frac{\\pi}{3} & \\frac{\\pi}{2} \\\\ \\hline \\cos\\theta & 1 & \\frac{\\sqrt{3}}{2} & \\frac{\\sqrt{2}}{2} & \\frac{1}{2} & 0 \\\\ \\hline \\sin\\theta & 0 & \\frac{1}{2} & \\frac{\\sqrt{2}}{2} & \\frac{\\sqrt{3}}{2} & 1 \\\\ \\hline \\end{array}\\]",
            figure: buildCoursCercleFigure({ withProjections: true }),
          },
          {
            title: "Angles associés et signe selon le quadrant",
            items: [
              "cos est une fonction paire : \\(\\cos(-x)=\\cos(x)\\). sin est une fonction impaire : \\(\\sin(-x)=-\\sin(x)\\).",
              "\\(\\pi - x\\) (symétrique par rapport à l'axe des sinus) : le cosinus change de signe, le sinus reste identique.",
              "\\(\\pi + x\\) (symétrique par rapport à l'origine) : le cosinus ET le sinus changent de signe.",
              "Signe selon le quadrant du cercle trigonométrique : cos positif à droite (quadrants 1 et 4), sin positif en haut (quadrants 1 et 2).",
            ],
            formula: "\\(\\cos(-x)=\\cos(x),\\ \\sin(-x)=-\\sin(x)\\), \\(\\cos(\\pi-x)=-\\cos(x),\\ \\sin(\\pi-x)=\\sin(x)\\), \\(\\cos(\\pi+x)=-\\cos(x),\\ \\sin(\\pi+x)=-\\sin(x)\\)",
          },
          {
            title: "Lien avec le triangle rectangle",
            items: [
              "Dans un triangle rectangle, \\(\\cos\\theta = \\frac{\\text{adjacent}}{\\text{hypoténuse}}\\), \\(\\sin\\theta = \\frac{\\text{opposé}}{\\text{hypoténuse}}\\) — cohérent avec la définition sur le cercle.",
            ],
            figure: buildCoursTriangleTrigFigure(),
          },
          {
            title: "Formules d'addition et de duplication",
            items: [
              "Piège classique très fréquent : \\(\\cos(a+b) \\neq \\cos a + \\cos b\\).",
            ],
            formula: "\\(\\cos(a+b)=\\cos a\\cos b-\\sin a\\sin b\\), \\(\\sin(2a)=2\\sin a\\cos a\\)",
          },
          {
            title: "Résoudre \\(\\cos(x)=a\\) ou \\(\\sin(x)=a\\)",
            items: [
              "Sur un intervalle, ces équations ont en général deux solutions symétriques (par rapport à l'axe des cosinus ou des sinus).",
              "Penser à ajouter/soustraire des multiples de \\(2\\pi\\) si l'intervalle dépasse un tour complet.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
