// ---------------------------------------------------------------------------
// Chapitre : Réviser les bases (Première technologique) — gratuit, illimité.
//
// Un tour d'horizon des savoir-faire de 2nde indispensables pour aborder le
// programme de Première technologique (voie STMG et proches) : calcul
// littéral de base, équations et inéquations du premier degré, fonctions de
// référence (affine, carré), pourcentages et évolutions, lecture de tableaux
// et de représentations graphiques. Pas de vecteurs ni de géométrie repérée
// (hors programme technologique). Fichier indépendant (par convention,
// chaque chapitre a ses propres helpers, pas de mutualisation entre
// fichiers).
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
    chapter: "Réviser les bases (Première techno) — Calcul littéral",
    prompt: `Développer : \\((${a}x ${signe} ${b})^2\\)`,
    answer: correctRaw,
    options,
    steps: [`\\((A ${signe} B)^2 = A^2 ${signe} 2AB + B^2\\)`, `\\text{Résultat : } ${correctRaw}`],
  };
}

// ---------- 2. Factoriser un facteur commun ----------
function genFactoriserFacteurCommunNumeric() {
  const k = nonZero(2, 8);
  const a = nonZero(-9, 9);
  const b = randInt(-9, 9);
  const x = randInt(-5, 5);
  const answer = k * x * (a * x + b);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première techno) — Calcul littéral",
    prompt: `On sait que \\(${k * a}x^2 ${k * b >= 0 ? "+" : "-"} ${Math.abs(k * b)}x = ${k}x(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)})\\). Calcule la valeur de cette expression pour \\(x = ${x}\\).`,
    answer,
    steps: [`${k} \\times ${x} \\times (${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}) = ${k * x} \\times ${a * x + b} = ${answer}`],
  };
}

// =========================== Équations et inéquations (2nde) ===========================

// ---------- 3. Résoudre une équation du premier degré ----------
function genResoudreEquationSimpleNumeric() {
  const xSol = nonZero(-15, 15);
  const a = nonZero(-9, 9);
  const b = randInt(-20, 20);
  const c = a * xSol + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première techno) — Équations",
    prompt: `Résous l'équation : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}\\)`,
    answer: xSol,
    steps: [`${a}x = ${c} ${b >= 0 ? "-" : "+"} ${Math.abs(b)} = ${c - b}`, `x = ${c - b} \\div ${a} = ${xSol}`],
  };
}

// ---------- 4. Résoudre une équation produit nul ----------
function genEquationProduitNulNumeric() {
  let r1 = randInt(-8, 8);
  let r2 = randInt(-8, 8);
  while (r2 === r1) r2 = randInt(-8, 8);
  const smaller = Math.min(r1, r2);
  const s1 = r1 >= 0 ? "-" : "+";
  const s2 = r2 >= 0 ? "-" : "+";
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première techno) — Équations",
    prompt: `Résous : \\((x ${s1} ${Math.abs(r1)})(x ${s2} ${Math.abs(r2)}) = 0\\). Donne la plus petite des deux solutions.`,
    answer: smaller,
    steps: [
      `\\text{Un produit de facteurs est nul si l'un au moins des facteurs est nul.}`,
      `x = ${r1} \\text{ ou } x = ${r2}`,
      `\\text{La plus petite solution est } ${smaller}.`,
    ],
  };
}

// ---------- 5. Résoudre une inéquation du premier degré ----------
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
    chapter: "Réviser les bases (Première techno) — Équations",
    prompt: `Résous l'inéquation : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} ${op} ${c}\\)`,
    answer: correctRaw,
    options,
    steps: [
      `${a}x ${op} ${c} ${b >= 0 ? "-" : "+"} ${Math.abs(b)} = ${c - b}`,
      flip ? `\\text{On divise par un nombre négatif : le sens de l'inégalité change.}` : `\\text{On divise par un nombre positif : le sens de l'inégalité ne change pas.}`,
      `\\text{Solution : } ${correctRaw}`,
    ],
  };
}

// =========================== Fonctions de référence (2nde) ===========================

// ---------- 6. Image par une fonction affine, avec sa droite ----------
function genImageFonctionAffineNumeric() {
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const x = randInt(-8, 8);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première techno) — Fonctions de référence",
    prompt: `On considère la fonction affine f définie par \\(f(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(f(${x})\\).`,
    answer,
    steps: [`f(${x}) = ${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}`],
    graph: {
      xMin: -8,
      xMax: 8,
      yMin: Math.min(-10, a * -8 + b, answer) - 2,
      yMax: Math.max(10, a * 8 + b, answer) + 2,
      lines: [{ a, b, label: "f" }],
      points: [{ x, y: answer, label: `f(${x})`, project: true }],
    },
  };
}

// ---------- 7. Lire l'équation réduite d'une droite sur un graphique ----------
function genLectureEquationDroiteQCM() {
  const a = pick([-3, -2, -1, -0.5, 0.5, 1, 2, 3]);
  const b = randInt(-4, 4);
  const correctRaw = `y = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`;
  const wrong1 = `y = ${-a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`;
  const wrong2 = `y = ${a}x ${b >= 0 ? "-" : "+"} ${Math.abs(b)}`;
  const options = shuffle([correctRaw, wrong1, wrong2]);
  return {
    type: "qcm",
    chapter: "Réviser les bases (Première techno) — Fonctions de référence",
    prompt: `On donne ci-dessous la droite représentant une fonction affine. Quelle est son équation réduite ?`,
    answer: correctRaw,
    options,
    steps: [`\\text{L'ordonnée à l'origine se lit sur l'axe des ordonnées : } b = ${b}.`, `\\text{Le coefficient directeur se lit avec deux points de la droite : } a = ${fr(a)}.`, correctRaw],
    graph: { xMin: -5, xMax: 5, yMin: Math.min(-6, a * -5 + b - 1), yMax: Math.max(6, a * 5 + b + 1), lines: [{ a, b }] },
  };
}

// ---------- 8. Sens de variation de la fonction carré ----------
function genSensVariationCarreQCM() {
  const cas = pick([
    { intervalle: "sur \\(]-\\infty ; 0]\\)", reponse: "décroissante" },
    { intervalle: "sur \\([0 ; +\\infty[\\)", reponse: "croissante" },
  ]);
  return {
    type: "qcm",
    chapter: "Réviser les bases (Première techno) — Fonctions de référence",
    prompt: `Quel est le sens de variation de la fonction carré ${cas.intervalle} ?`,
    answer: cas.reponse,
    options: ["croissante", "décroissante"],
    steps: [`\\text{La fonction carré est ${cas.reponse} ${cas.intervalle}.}`],
  };
}

// =========================== Proportionnalité et pourcentages (2nde/3e) ===========================

// ---------- 9. Pourcentage d'une quantité ----------
function genPourcentageDuneQuantiteNumeric() {
  const p = pick([10, 15, 20, 25, 40, 50, 75]);
  const total = randInt(20, 400);
  const answer = roundTo((p / 100) * total, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première techno) — Proportionnalité",
    prompt: `Calcule ${p} % de ${total}.`,
    answer,
    tolerance: 0.02,
    steps: [`${total} \\times \\dfrac{${p}}{100} = ${fr(answer)}`],
  };
}

// ---------- 10. Coefficient multiplicateur d'une évolution ----------
function genCoefficientMultiplicateurNumeric() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 90);
  const answer = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première techno) — Proportionnalité",
    prompt: `Une grandeur ${direction} de ${p} %. Quel est le coefficient multiplicateur associé ?`,
    answer,
    tolerance: 0.001,
    steps: [`${fr(answer)}`],
  };
}

// ---------- 11. Évolution en valeur (montant après évolution) ----------
function genEvolutionValeurNumeric() {
  const v0 = randInt(50, 2000);
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(2, 60);
  const coeff = direction === "augmente" ? 1 + p / 100 : 1 - p / 100;
  const answer = roundTo(v0 * coeff, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première techno) — Proportionnalité",
    prompt: `Une quantité initiale de ${v0} ${direction} de ${p} %. Calcule la valeur finale (arrondie au centième).`,
    answer,
    tolerance: 0.02,
    steps: [`${v0} \\times ${fr(roundTo(coeff, 4))} = ${fr(answer)}`],
  };
}

// =========================== Lecture de tableaux et diagrammes ===========================

// ---------- 12. Moyenne pondérée simple ----------
function genMoyennePondereeNumeric() {
  const n1 = pick([15, 18, 20, 25]);
  const note1 = randInt(4, 18);
  const n2 = pick([5, 8, 10, 12]);
  const note2 = randInt(4, 18);
  const answer = roundTo((n1 * note1 + n2 * note2) / (n1 + n2), 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première techno) — Lecture de données",
    prompt: `Un groupe de ${n1} élèves a une moyenne de ${note1}/20 et un autre groupe de ${n2} élèves a une moyenne de ${note2}/20. Calcule la moyenne générale des deux groupes réunis (arrondie au centième).`,
    answer,
    tolerance: 0.02,
    steps: [`\\dfrac{${n1} \\times ${note1} + ${n2} \\times ${note2}}{${n1} + ${n2}} = \\dfrac{${n1 * note1 + n2 * note2}}{${n1 + n2}} = ${fr(answer)}`],
  };
}

// ---------- 13. Lecture d'un tableau croisé (effectif) ----------
function genLectureTableauCroiseNumeric() {
  const a = randInt(30, 120);
  const b = randInt(30, 120);
  const c = randInt(30, 120);
  const d = randInt(30, 120);
  const totalLigne1 = a + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première techno) — Lecture de données",
    prompt: `Un tableau croisé donne, pour une catégorie, deux sous-effectifs de ${a} et ${b}. Calcule le total de cette catégorie.`,
    answer: totalLigne1,
    steps: [`${a} + ${b} = ${totalLigne1}`],
  };
}

const GENERATORS = [
  genIdentiteRemarquableCarreQCM,
  genFactoriserFacteurCommunNumeric,
  genResoudreEquationSimpleNumeric,
  genEquationProduitNulNumeric,
  genResoudreInequationSimpleQCM,
  genImageFonctionAffineNumeric,
  genLectureEquationDroiteQCM,
  genSensVariationCarreQCM,
  genPourcentageDuneQuantiteNumeric,
  genCoefficientMultiplicateurNumeric,
  genEvolutionValeurNumeric,
  genMoyennePondereeNumeric,
  genLectureTableauCroiseNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "reviser-les-bases-premiere-techno",
    title: "Réviser les bases",
    description: "Un tour d'horizon des savoir-faire de 2nde indispensables pour aborder le programme de Première technologique.",
    level: "premiere-techno",
    free: true,
    order: 0,
  },
  generate,
};
