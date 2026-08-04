// ---------------------------------------------------------------------------
// Chapitre : Réviser les bases (Première Spé) — gratuit, illimité.
//
// Équivalent, pour l'entrée en Première (enseignement de spécialité
// mathématiques, voie générale), du chapitre "Réviser les bases" des autres
// niveaux : un tour d'horizon des savoir-faire de 2nde indispensables pour
// aborder les nouveaux chapitres de spécialité (identités remarquables,
// résolution d'équations et d'inéquations, fonctions affines et fonctions de
// référence, vecteurs, proportionnalité, puissances). Fichier indépendant
// (par convention, chaque chapitre a ses propres helpers, pas de
// mutualisation entre fichiers).
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

// =========================== Calcul littéral (2nde/3e) ===========================

// ---------- 1. Identité remarquable (a+b)^2 ou (a-b)^2 ----------
function genIdentiteRemarquableCarreQCM() {
  const a = nonZero(-6, 6);
  const b = nonZero(-9, 9);
  const signe = pick(["+", "-"]);
  const correctRaw =
    signe === "+"
      ? `${a * a}x^2 + ${2 * a * b}x + ${b * b}`
      : `${a * a}x^2 - ${2 * a * b}x + ${b * b}`;
  const wrong1 = `${a * a}x^2 + ${b * b}`;
  const wrong2 = signe === "+" ? `${a * a}x^2 - ${2 * a * b}x + ${b * b}` : `${a * a}x^2 + ${2 * a * b}x + ${b * b}`;
  const options = shuffle([correctRaw, wrong1, wrong2]);
  return {
    type: "qcm",
    chapter: "Réviser les bases (Première Spé) — Calcul littéral",
    prompt: `Développer : \\((${a}x ${signe} ${b})^2\\)`,
    answer: correctRaw,
    options,
    steps: [
      { type: "regle", text: `\\((A ${signe} B)^2 = A^2 ${signe} 2AB + B^2\\)` },
      { type: "resultat", text: correctRaw },
    ],
  };
}

// ---------- 2. Factorisation par identité remarquable a²-b² ----------
function genFactorisationDifferenceCarresNumeric() {
  const k = nonZero(2, 9);
  const m = randInt(1, 9);
  const x = randInt(-5, 5);
  const answer = (k * x - m) * (k * x + m);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première Spé) — Calcul littéral",
    prompt: `On sait que \\(${k * k}x^2 - ${m * m} = (${k}x - ${m})(${k}x + ${m})\\). Calcule la valeur de cette expression pour \\(x = ${x}\\).`,
    answer,
    steps: [{ type: "resultat", text: `(${k} \\times ${x} - ${m})(${k} \\times ${x} + ${m}) = (${k * x - m}) \\times (${k * x + m}) = ${answer}` }],
  };
}

// =========================== Équations et inéquations (2nde) ===========================

// ---------- 3. Résoudre une équation simple ----------
function genResoudreEquationSimpleNumeric() {
  const xSol = nonZero(-15, 15);
  const a = nonZero(-9, 9);
  const b = randInt(-20, 20);
  const c = a * xSol + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première Spé) — Équations",
    prompt: `Résous l'équation : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}\\)`,
    answer: xSol,
    steps: [
      { type: "calcul", text: `${a}x = ${c} ${b >= 0 ? "-" : "+"} ${Math.abs(b)} = ${c - b}` },
      { type: "resultat", text: `x = ${c - b} \\div ${a} = ${xSol}` },
    ],
  };
}

// ---------- 4. Résoudre une inéquation simple ----------
function genResoudreInequationSimpleQCM() {
  const a = nonZero(-8, 8);
  const b = randInt(-15, 15);
  const c = randInt(-15, 15);
  const bound = (c - b) / a;
  const boundStr = Number.isInteger(bound) ? String(bound) : fr(roundTo(bound, 2));
  const op = pick(["<", ">"]);
  const flip = a < 0;
  const finalOp = flip ? (op === "<" ? ">" : "<") : op;
  const oppositeOp = finalOp === "<" ? ">" : "<";
  const correctRaw = `x ${finalOp} ${boundStr}`;
  const wrongSameBound = `x ${oppositeOp} ${boundStr}`;
  let wrongBound = Number.isInteger(bound) ? bound + nonZero(1, 4) : roundTo(bound + nonZero(1, 3), 2);
  const wrongOtherBound = `x ${finalOp} ${fr(wrongBound)}`;
  const options = shuffle([correctRaw, wrongSameBound, wrongOtherBound]);
  return {
    type: "qcm",
    chapter: "Réviser les bases (Première Spé) — Équations",
    prompt: `Résous l'inéquation : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} ${op} ${c}\\)`,
    answer: correctRaw,
    options,
    steps: [
      { type: "calcul", text: `${a}x ${op} ${c} ${b >= 0 ? "-" : "+"} ${Math.abs(b)} = ${c - b}` },
      { type: "regle", text: flip ? `\\text{On divise par un nombre négatif : le sens de l'inégalité change.}` : `\\text{On divise par un nombre positif : le sens de l'inégalité ne change pas.}` },
      { type: "resultat", text: `\\text{Solution : } ${correctRaw}` },
    ],
  };
}

// =========================== Fonctions de référence (2nde) ===========================

// ---------- 5. Image par une fonction affine ----------
function genImageFonctionAffineNumeric() {
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const x = randInt(-8, 8);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première Spé) — Fonctions de référence",
    prompt: `On considère la fonction affine f définie par \\(f(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(f(${x})\\).`,
    answer,
    steps: [{ type: "resultat", text: `f(${x}) = ${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}` }],
  };
}

// ---------- 6. Sens de variation de la fonction carré ----------
function genSensVariationCarreQCM() {
  const cas = pick([
    { intervalle: "sur \\(]-\\infty ; 0]\\)", reponse: "décroissante" },
    { intervalle: "sur \\([0 ; +\\infty[\\)", reponse: "croissante" },
  ]);
  return {
    type: "qcm",
    chapter: "Réviser les bases (Première Spé) — Fonctions de référence",
    prompt: `Quel est le sens de variation de la fonction carré ${cas.intervalle} ?`,
    answer: cas.reponse,
    options: ["croissante", "décroissante"],
    steps: [{ type: "regle", text: `\\text{La fonction carré est ${cas.reponse} ${cas.intervalle}.}` }],
  };
}

// ---------- 7. Image par la fonction inverse ----------
function genImageFonctionInverseNumeric() {
  const x = pick([-8, -4, -2, -1, 1, 2, 4, 8]);
  const answer = roundTo(1 / x, 3);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première Spé) — Fonctions de référence",
    prompt: `On considère la fonction inverse définie par \\(f(x) = \\dfrac{1}{x}\\). Calcule \\(f(${x})\\).`,
    answer,
    tolerance: 0.001,
    steps: [{ type: "resultat", text: `f(${x}) = \\dfrac{1}{${x}} = ${fr(answer)}` }],
  };
}

// =========================== Vecteurs (2nde) ===========================

// ---------- 8. Coordonnées d'un vecteur ----------
function genCoordonneesVecteurNumeric() {
  const xA = randInt(-8, 8);
  const yA = randInt(-8, 8);
  const xB = randInt(-8, 8);
  const yB = randInt(-8, 8);
  const answer = xB - xA;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première Spé) — Vecteurs",
    prompt: `On donne \\(A(${xA} ; ${yA})\\) et \\(B(${xB} ; ${yB})\\). Le vecteur \\(\\overrightarrow{AB}\\) a pour coordonnées \\((x_B - x_A ; y_B - y_A)\\). Donne sa première coordonnée.`,
    answer,
    steps: [{ type: "resultat", text: `x_B - x_A = ${xB} - (${xA}) = ${answer}` }],
  };
}

// ---------- 9. Norme d'un vecteur (cas simple) ----------
function genNormeVecteurNumeric() {
  const triplets = [
    [3, 4, 5],
    [6, 8, 10],
    [5, 12, 13],
    [8, 15, 17],
    [9, 12, 15],
  ];
  const [x, y, answer] = pick(triplets);
  const signeX = pick([1, -1]);
  const signeY = pick([1, -1]);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première Spé) — Vecteurs",
    prompt: `Un vecteur \\(\\vec{u}\\) a pour coordonnées \\((${signeX * x} ; ${signeY * y})\\). Calcule sa norme \\(\\|\\vec{u}\\|\\).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{La norme d'un vecteur de coordonnées } (x ; y) \\text{ se calcule par } \\|\\vec{u}\\| = \\sqrt{x^2 + y^2}.` },
      { type: "resultat", text: `\\|\\vec{u}\\| = \\sqrt{(${signeX * x})^2 + (${signeY * y})^2} = \\sqrt{${x * x} + ${y * y}} = \\sqrt{${x * x + y * y}} = ${answer}` },
    ],
  };
}

// =========================== Proportionnalité et pourcentages (2nde/3e) ===========================

// ---------- 10. Pourcentage d'une quantité ----------
function genPourcentageDuneQuantiteNumeric() {
  const p = pick([10, 15, 20, 25, 40, 50, 75]);
  const total = randInt(20, 400);
  const answer = roundTo((p / 100) * total, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première Spé) — Proportionnalité",
    prompt: `Calcule ${p} % de ${total}.`,
    answer,
    tolerance: 0.02,
    steps: [{ type: "resultat", text: `${total} \\times \\dfrac{${p}}{100} = ${fr(answer)}` }],
  };
}

// ---------- 11. Coefficient multiplicateur d'une évolution ----------
function genCoefficientMultiplicateurNumeric() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 90);
  const answer = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première Spé) — Proportionnalité",
    prompt: `Une grandeur ${direction} de ${p} %. Quel est le coefficient multiplicateur associé ?`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: direction === "augmente" ? `\\text{Une augmentation de } t \\% \\text{ correspond à un coefficient multiplicateur } 1 + \\dfrac{t}{100}.` : `\\text{Une diminution de } t \\% \\text{ correspond à un coefficient multiplicateur } 1 - \\dfrac{t}{100}.` },
      { type: "resultat", text: direction === "augmente" ? `1 + \\dfrac{${p}}{100} = ${fr(answer)}` : `1 - \\dfrac{${p}}{100} = ${fr(answer)}` },
    ],
  };
}

// =========================== Puissances et calcul numérique (3e) ===========================

// ---------- 12. Puissances d'un nombre relatif ----------
function genPuissanceRelatifNumeric() {
  const n = nonZero(-8, 8);
  const exp = pick([2, 3]);
  const answer = n ** exp;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première Spé) — Calcul numérique",
    prompt: `Calcule : \\((${n})^{${exp}}\\)`,
    answer,
    steps: [{ type: "resultat", text: `${Array.from({ length: exp }, () => `(${n})`).join(" \\times ")} = ${answer}` }],
  };
}

// ---------- 13. Racine carrée d'un carré parfait ----------
function genRacineCarreeNumeric() {
  const n = randInt(2, 20);
  const answer = n;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première Spé) — Calcul numérique",
    prompt: `Calcule : \\(\\sqrt{${n * n}}\\)`,
    answer,
    steps: [{ type: "resultat", text: `\\sqrt{${n * n}} = ${n} \\text{ car } ${n}^2 = ${n * n}` }],
  };
}

const GENERATORS = [
  genIdentiteRemarquableCarreQCM,
  genFactorisationDifferenceCarresNumeric,
  genResoudreEquationSimpleNumeric,
  genResoudreInequationSimpleQCM,
  genImageFonctionAffineNumeric,
  genSensVariationCarreQCM,
  genImageFonctionInverseNumeric,
  genCoordonneesVecteurNumeric,
  genNormeVecteurNumeric,
  genPourcentageDuneQuantiteNumeric,
  genCoefficientMultiplicateurNumeric,
  genPuissanceRelatifNumeric,
  genRacineCarreeNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "reviser-les-bases-premiere-spe",
    title: "Réviser les bases",
    description: "Un tour d'horizon des savoir-faire de 2nde indispensables pour aborder les nouveaux chapitres de spécialité.",
    pourquoi: "Ce chapitre gratuit consolide les bases indispensables du niveau précédent, pour démarrer l'année sur des fondations solides plutôt que de découvrir des lacunes en cours de route.",
    level: "premiere-spe",
    free: true,
    order: 0,
  },
  generate,
};
