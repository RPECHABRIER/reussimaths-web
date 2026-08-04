// ---------------------------------------------------------------------------
// Chapitre : Réviser les bases (2nde) — gratuit, illimité.
//
// Équivalent, pour l'entrée en 2nde, du chapitre "Réviser les bases" des
// niveaux précédents : un tour d'horizon des savoir-faire de 3e
// indispensables pour aborder les nouveaux chapitres de 2nde (calcul
// littéral et identités remarquables, résolution d'équations, fonctions
// affines, proportionnalité et pourcentages, théorème de Pythagore et
// trigonométrie, statistiques, probabilités). Fichier indépendant (par
// convention, chaque chapitre a ses propres helpers, pas de mutualisation
// entre fichiers).
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
const frTex = (n) => String(n).replace(".", "{,}");
const signedTex = (n) => `${n >= 0 ? "+" : ""}${frTex(n)}`;

// =========================== Calcul littéral (3e) ===========================

// ---------- 1. Développer avec une identité remarquable (a+b)² ----------
function genDevelopperIdentiteRemarquableNumeric() {
  const a = randInt(2, 12);
  const b = randInt(2, 12);
  const answer = (a + b) * (a + b);
  return {
    type: "numeric",
    chapter: "Réviser les bases (2nde) — Calcul littéral",
    prompt: `On rappelle que \\((a+b)^2 = a^2 + 2ab + b^2\\). Utilise cette identité pour calculer \\(${a}^2 + 2 \\times ${a} \\times ${b} + ${b}^2\\).`,
    answer,
    steps: [`(${a} + ${b})^2 = ${a + b}^2 = ${answer}`],
  };
}

// ---------- 2. Factoriser une expression simple ----------
function genFactoriserQCM() {
  const k = nonZero(-9, 9);
  const a = nonZero(-8, 8);
  const developpe = `${k}x ${k * a >= 0 ? "+" : "-"} ${Math.abs(k * a)}`;
  const bonneFactorisation = `${k}(x ${a >= 0 ? "+" : "-"} ${Math.abs(a)})`;
  const mauvaiseFactorisation = `${k}(x ${a >= 0 ? "+" : "-"} ${Math.abs(a) + 1})`;
  return {
    type: "qcm",
    chapter: "Réviser les bases (2nde) — Calcul littéral",
    prompt: `Quelle est la forme factorisée de \\(${developpe}\\) ?`,
    answer: bonneFactorisation,
    options: shuffle([bonneFactorisation, mauvaiseFactorisation]),
    steps: [`${developpe} = ${bonneFactorisation}`],
  };
}

// =========================== Équations (3e) ===========================

// ---------- 3. Résoudre une équation simple ax + b = c ----------
function genResoudreEquationSimpleNumeric() {
  const xSol = nonZero(-15, 15);
  const a = nonZero(-9, 9);
  const b = randInt(-20, 20);
  const c = a * xSol + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (2nde) — Équations",
    prompt: `Résous l'équation : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}\\)`,
    answer: xSol,
    steps: [`${a}x = ${c} ${b >= 0 ? "-" : "+"} ${Math.abs(b)} = ${c - b}`, `x = ${c - b} \\div ${a} = ${xSol}`],
  };
}

// ---------- 4. Résoudre une équation avec parenthèses ----------
function genResoudreEquationParenthesesNumeric() {
  const a = nonZero(-8, 8);
  const b = randInt(-10, 10);
  const xSol = randInt(-12, 12);
  const c = a * (xSol + b);
  return {
    type: "numeric",
    chapter: "Réviser les bases (2nde) — Équations",
    prompt: `Résous l'équation : \\(${a}(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}) = ${c}\\)`,
    answer: xSol,
    steps: [`x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c / a}`, `x = ${xSol}`],
  };
}

// =========================== Fonctions affines (3e) ===========================

// ---------- 5. Image par une fonction affine ----------
function genImageFonctionAffineNumeric() {
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const x = randInt(-8, 8);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (2nde) — Fonctions affines",
    prompt: `On considère la fonction affine f définie par \\(f(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(f(${x})\\).`,
    answer,
    steps: [`f(${x}) = ${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}`],
  };
}

// =========================== Proportionnalité et pourcentages (3e) ===========================

// ---------- 6. Pourcentage d'une quantité ----------
function genPourcentageDuneQuantiteNumeric() {
  const p = pick([10, 15, 20, 25, 40, 50, 75]);
  const total = randInt(20, 400);
  const answer = roundTo((p / 100) * total, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (2nde) — Proportionnalité",
    prompt: `Calcule ${p} % de ${total}.`,
    answer,
    tolerance: 0.02,
    steps: [`${total} \\times \\dfrac{${p}}{100} = ${fr(answer)}`],
  };
}

// ---------- 7. Coefficient multiplicateur d'une évolution ----------
function genCoefficientMultiplicateurNumeric() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 90);
  const answer = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (2nde) — Proportionnalité",
    prompt: `Une grandeur ${direction} de ${p} %. Quel est le coefficient multiplicateur associé ?`,
    answer,
    tolerance: 0.001,
    steps: [`${fr(answer)}`],
  };
}

// =========================== Pythagore et trigonométrie (3e) ===========================

const TRIPLETS_PYTHAGORICIENS = [
  [3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [7, 24, 25], [20, 21, 29],
];

// ---------- 8. Calculer l'hypoténuse (triplet pythagoricien) ----------
function genPythagoreHypotenuseNumeric() {
  const [a0, b0, c0] = pick(TRIPLETS_PYTHAGORICIENS);
  const k = randInt(1, 4);
  const a = a0 * k;
  const b = b0 * k;
  const c = c0 * k;
  return {
    type: "numeric",
    chapter: "Réviser les bases (2nde) — Théorème de Pythagore",
    prompt: `Un triangle rectangle a des côtés de l'angle droit mesurant ${a} cm et ${b} cm. Calcule la longueur de l'hypoténuse (en cm).`,
    answer: c,
    steps: [`${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}`, `\\sqrt{${c * c}} = ${c}`],
  };
}

// ---------- 9. Calculer un angle avec la trigonométrie (cosinus) ----------
function genAngleTrigonometrieNumeric() {
  const angle = randInt(20, 70);
  const hyp = randInt(10, 40);
  const adj = roundTo(hyp * Math.cos((angle * Math.PI) / 180), 2);
  const answer = Math.round((Math.acos(adj / hyp) * 180) / Math.PI);
  return {
    type: "numeric",
    chapter: "Réviser les bases (2nde) — Trigonométrie",
    prompt: `Dans un triangle rectangle, un angle aigu a un côté adjacent de ${fr(adj)} cm et une hypoténuse de ${hyp} cm. Calcule la mesure de cet angle, arrondie au degré près.`,
    answer,
    steps: [`\\cos(\\widehat{x}) = \\dfrac{${fr(adj)}}{${hyp}}`, `\\widehat{x} \\approx ${answer}°`],
  };
}

// =========================== Statistiques et probabilités (3e) ===========================

// ---------- 10. Moyenne pondérée ----------
function genMoyennePondereeNumeric() {
  const k = randInt(3, 5);
  const valeurs = shuffle(Array.from({ length: 8 }, (_, i) => i + 1)).slice(0, k);
  const effectifs = valeurs.map(() => randInt(2, 12));
  const sommeProduits = valeurs.reduce((s, v, i) => s + v * effectifs[i], 0);
  const total = effectifs.reduce((a, b) => a + b, 0);
  const answer = roundTo(sommeProduits / total, 2);
  const detail = valeurs.map((v, i) => `${v} \\times ${effectifs[i]}`).join(" + ");
  return {
    type: "numeric",
    chapter: "Réviser les bases (2nde) — Statistiques",
    prompt: `Calcule la moyenne pondérée de la série suivante : ${valeurs.map((v, i) => `${v} (effectif ${effectifs[i]})`).join(", ")}. Arrondis au centième.`,
    answer,
    tolerance: 0.02,
    steps: [`\\dfrac{${detail}}{${total}} = \\dfrac{${sommeProduits}}{${total}} \\approx ${fr(answer)}`],
  };
}

// ---------- 11. Étendue d'une série ----------
function genEtendueNumeric() {
  const n = pick([6, 7, 8, 9]);
  const values = Array.from({ length: n }, () => randInt(0, 50));
  const max = Math.max(...values);
  const min = Math.min(...values);
  const answer = max - min;
  return {
    type: "numeric",
    chapter: "Réviser les bases (2nde) — Statistiques",
    prompt: `Calcule l'étendue de la série suivante : ${values.join(" ; ")}.`,
    answer,
    steps: [`${max} - ${min} = ${answer}`],
  };
}

// ---------- 12. Probabilité simple ----------
function genProbabiliteSimpleNumeric() {
  const total = randInt(20, 40);
  const favorables = randInt(3, total - 3);
  const answer = roundTo(favorables / total, 3);
  return {
    type: "numeric",
    chapter: "Réviser les bases (2nde) — Probabilités",
    prompt: `Un sac contient ${total} jetons indiscernables au toucher, dont ${favorables} sont rouges. Quelle est la probabilité de tirer un jeton rouge (valeur décimale, arrondie au millième) ?`,
    answer,
    tolerance: 0.002,
    steps: [`P = \\dfrac{${favorables}}{${total}} \\approx ${fr(answer)}`],
  };
}

// ---------- 13. Puissances d'un nombre relatif ----------
function genPuissanceRelatifNumeric() {
  const n = nonZero(-8, 8);
  const exp = pick([2, 3]);
  const answer = n ** exp;
  return {
    type: "numeric",
    chapter: "Réviser les bases (2nde) — Calcul numérique",
    prompt: `Calcule : \\((${n})^{${exp}}\\)`,
    answer,
    steps: [`${Array.from({ length: exp }, () => `(${n})`).join(" \\times ")} = ${answer}`],
  };
}

const GENERATORS = [
  genDevelopperIdentiteRemarquableNumeric,
  genFactoriserQCM,
  genResoudreEquationSimpleNumeric,
  genResoudreEquationParenthesesNumeric,
  genImageFonctionAffineNumeric,
  genPourcentageDuneQuantiteNumeric,
  genCoefficientMultiplicateurNumeric,
  genPythagoreHypotenuseNumeric,
  genAngleTrigonometrieNumeric,
  genMoyennePondereeNumeric,
  genEtendueNumeric,
  genProbabiliteSimpleNumeric,
  genPuissanceRelatifNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "reviser-les-bases-seconde",
    title: "Réviser les bases",
    description: "Un tour d'horizon des savoir-faire de 3e indispensables pour aborder les nouveaux chapitres de 2nde.",
    pourquoi: "Ce chapitre gratuit consolide les bases indispensables du niveau précédent, pour démarrer l'année sur des fondations solides plutôt que de découvrir des lacunes en cours de route.",
    level: "seconde",
    free: true,
    order: 0,
  },
  generate,
};
