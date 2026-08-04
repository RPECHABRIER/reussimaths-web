// ---------------------------------------------------------------------------
// Chapitre : Réviser les bases (3e) — gratuit, illimité.
//
// Équivalent, pour l'entrée en 3e, du chapitre "Réviser les bases" (4e) : un
// tour d'horizon des savoir-faire de 4e indispensables pour aborder les
// nouveaux chapitres de 3e (nombres relatifs, calcul littéral de base,
// résolution d'équations simples, puissances, proportionnalité, théorème de
// Pythagore, fonctions affines, fractions). Fichier indépendant (par
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
const randDecimal = (min, max, decimals) => roundTo(min + Math.random() * (max - min), decimals);
const fr = (n) => String(n).replace(".", ",");
const frTex = (n) => String(n).replace(".", "{,}");
const signedTex = (n) => `${n >= 0 ? "+" : ""}${frTex(n)}`;

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

// =========================== Nombres relatifs (4e) ===========================

// ---------- 1. Multiplier deux relatifs ----------
function genMultiplierRelatifs() {
  const a = nonZero(-15, 15);
  const b = nonZero(-15, 15);
  return {
    type: "numeric",
    chapter: "Réviser les bases (3e) — Nombres relatifs",
    prompt: `Calcule : \\(${a} \\times (${signedTex(b)})\\)`,
    answer: a * b,
    steps: [{ type: "calcul", text: `${a} \\times ${b} = ${a * b}` }],
  };
}

// ---------- 2. Diviser deux relatifs ----------
function genDiviserRelatifs() {
  const diviseur = nonZero(-12, 12);
  const quotient = nonZero(-12, 12);
  const dividende = diviseur * quotient;
  return {
    type: "numeric",
    chapter: "Réviser les bases (3e) — Nombres relatifs",
    prompt: `Calcule : \\(${dividende} \\div (${signedTex(diviseur)})\\)`,
    answer: quotient,
    steps: [{ type: "calcul", text: `${dividende} \\div ${diviseur} = ${quotient}` }],
  };
}

// ---------- 3. Priorités avec des relatifs ----------
function genPrioriteCalculRelatifs() {
  const a = nonZero(-20, 20);
  const b = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const op1 = pick(["+", "-"]);
  const produit = b * c;
  const answer = op1 === "+" ? a + produit : a - produit;
  return {
    type: "numeric",
    chapter: "Réviser les bases (3e) — Priorités",
    prompt: `Calcule en respectant les priorités : \\(${a} ${op1} ${b} \\times (${signedTex(c)})\\)`,
    answer,
    steps: [
      { type: "calcul", text: `${b} \\times ${c} = ${produit}` },
      { type: "resultat", text: `${a} ${op1} ${produit} = ${answer}` },
    ],
  };
}

// =========================== Calcul littéral et équations (4e) ===========================

// ---------- 4. Développer un produit simple k(a + x) ----------
function genDevelopperProduitSimple() {
  const k = nonZero(-9, 9);
  const a = nonZero(-12, 12);
  const x = randInt(2, 9);
  const coeffX = k;
  const constante = k * a;
  return {
    type: "numeric",
    chapter: "Réviser les bases (3e) — Calcul littéral",
    prompt: `On développe l'expression \\(${k}(x ${a >= 0 ? "+" : "-"} ${Math.abs(a)})\\). On obtient une expression de la forme \\(bx + c\\). Calcule sa valeur pour \\(x = ${x}\\).`,
    answer: coeffX * x + constante,
    steps: [
      { type: "calcul", text: `${k}(x ${a >= 0 ? "+" : "-"} ${Math.abs(a)}) = ${k}x ${constante >= 0 ? "+" : "-"} ${Math.abs(constante)}` },
      { type: "resultat", text: `${coeffX} \\times ${x} ${constante >= 0 ? "+" : "-"} ${Math.abs(constante)} = ${coeffX * x + constante}` },
    ],
  };
}

// ---------- 5. Résoudre une équation simple ax + b = c ----------
function genResoudreEquationSimple() {
  const xSol = nonZero(-15, 15);
  const a = nonZero(-9, 9);
  const b = nonZero(-20, 20);
  const c = a * xSol + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (3e) — Équations",
    prompt: `Résous l'équation : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}\\)`,
    answer: xSol,
    steps: [
      { type: "regle", text: `On isole d'abord le terme en x en ${b >= 0 ? "soustrayant" : "ajoutant"} ${Math.abs(b)} des deux côtés, puis on divise par ${a}.` },
      { type: "calcul", text: `${a}x = ${c} ${b >= 0 ? "-" : "+"} ${Math.abs(b)} = ${c - b}` },
      { type: "resultat", text: `x = ${c - b} \\div ${a} = ${xSol}` },
    ],
  };
}

// ---------- 6. Tester si un nombre est solution d'une équation ----------
function genTesterSolutionEquationQCM() {
  const a = nonZero(-9, 9);
  const xSol = nonZero(-12, 12);
  const b = nonZero(-9, 9);
  const c = a * xSol + b;
  const testIsSolution = Math.random() < 0.5;
  const xTest = testIsSolution ? xSol : xSol + nonZero(1, 4);
  const leftValue = a * xTest + b;
  const isSolution = leftValue === c;
  return {
    type: "qcm",
    chapter: "Réviser les bases (3e) — Équations",
    prompt: `Le nombre ${xTest} est-il solution de l'équation \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}\\) ?`,
    answer: isSolution ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `${a} \\times ${xTest} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${leftValue}` },
      { type: "resultat", text: isSolution ? `${leftValue} = ${c}, donc c'est bien solution.` : `${leftValue} \\neq ${c}, donc ce n'est pas solution.` },
    ],
  };
}

// =========================== Puissances (4e) ===========================

// ---------- 7. Puissance d'un nombre relatif simple ----------
function genPuissanceRelatif() {
  const n = nonZero(-8, 8);
  const exp = pick([2, 3]);
  const answer = n ** exp;
  return {
    type: "numeric",
    chapter: "Réviser les bases (3e) — Puissances",
    prompt: `Calcule : \\((${n})^{${exp}}\\)`,
    answer,
    steps: [{ type: "calcul", text: `${Array.from({ length: exp }, () => `(${n})`).join(" \\times ")} = ${answer}` }],
  };
}

// =========================== Proportionnalité (4e) ===========================

// ---------- 8. Pourcentage d'une quantité ----------
function genPourcentageDuneQuantite() {
  const p = pick([10, 15, 20, 25, 40, 50, 75]);
  const total = randInt(20, 400);
  const answer = roundTo((p / 100) * total, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (3e) — Proportionnalité",
    prompt: `Calcule ${p} % de ${total}.`,
    answer,
    tolerance: 0.02,
    steps: [
      { type: "regle", text: `Calculer ${p} % d'un nombre, c'est le multiplier par \\(\\dfrac{${p}}{100}\\).` },
      { type: "calcul", text: `${total} \\times \\dfrac{${p}}{100} = ${fr(answer)}` },
    ],
  };
}

// ---------- 9. Coefficient de proportionnalité ----------
function genCoefficientProportionnalite() {
  const k = randDecimal(0.5, 6, 2);
  const a = randInt(2, 15);
  const b = roundTo(a * k, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (3e) — Proportionnalité",
    prompt: `Dans un tableau de proportionnalité, la valeur ${a} correspond à ${fr(b)}. Quel est le coefficient de proportionnalité ?`,
    answer: k,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `Coefficient = ${fr(b)} \\div ${a} = ${fr(k)}` }],
  };
}

// =========================== Théorème de Pythagore (4e) ===========================

const TRIPLETS_PYTHAGORICIENS = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
];

// ---------- 10. Calculer l'hypoténuse (triplet pythagoricien) ----------
function genPythagoreHypotenuseNumeric() {
  const [a0, b0, c0] = pick(TRIPLETS_PYTHAGORICIENS);
  const k = randInt(1, 5);
  const a = a0 * k;
  const b = b0 * k;
  const c = c0 * k;
  return {
    type: "numeric",
    chapter: "Réviser les bases (3e) — Théorème de Pythagore",
    prompt: `ABC est un triangle rectangle en A, avec AB = ${a} cm et AC = ${b} cm. Calcule la longueur BC, en cm.`,
    answer: c,
    steps: [
      { type: "regle", text: `BC^2 = AB^2 + AC^2` },
      { type: "calcul", text: `BC^2 = AB^2 + AC^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${a * a + b * b}` },
      { type: "resultat", text: `BC = \\sqrt{${a * a + b * b}} = ${c}` },
    ],
  };
}

// ---------- 11. Calculer un côté de l'angle droit (triplet pythagoricien) ----------
function genPythagoreCoteNumeric() {
  const [a0, b0, c0] = pick(TRIPLETS_PYTHAGORICIENS);
  const k = randInt(1, 5);
  const a = a0 * k;
  const b = b0 * k;
  const c = c0 * k;
  return {
    type: "numeric",
    chapter: "Réviser les bases (3e) — Théorème de Pythagore",
    prompt: `DEF est un triangle rectangle en D, avec EF = ${c} cm (hypoténuse) et DE = ${a} cm. Calcule la longueur DF, en cm.`,
    answer: b,
    steps: [
      { type: "regle", text: `EF^2 = DE^2 + DF^2` },
      { type: "calcul", text: `DF^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${c * c - a * a}` },
      { type: "resultat", text: `DF = \\sqrt{${c * c - a * a}} = ${b}` },
    ],
  };
}

// =========================== Fonctions (4e) ===========================

// ---------- 12. Évaluer une fonction affine ----------
function genEvaluerFonctionAffine() {
  const a = nonZero(-8, 8);
  const b = randInt(-9, 9);
  const x = randInt(-8, 8);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (3e) — Fonctions",
    prompt: `On considère \\(f(x) = ${a}x ${b >= 0 ? "+" : ""} ${b}\\). Calcule \\(f(${x})\\).`,
    answer,
    steps: [{ type: "calcul", text: `${a} \\times ${x} ${b >= 0 ? "+" : ""} ${b} = ${answer}` }],
  };
}

// =========================== Fractions (4e/5e) ===========================

// ---------- 13. Simplifier une fraction ----------
function genSimplifierFraction() {
  let a0, b0;
  do {
    a0 = randInt(2, 15);
    b0 = randInt(2, 15);
  } while (gcd(a0, b0) !== 1 || a0 === b0);
  const g = randInt(2, 9);
  const num = a0 * g;
  const den = b0 * g;
  const askNum = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Réviser les bases (3e) — Fractions",
    prompt: `Simplifie la fraction \\(\\dfrac{${num}}{${den}}\\) le plus possible. Donne le ${askNum ? "numérateur" : "dénominateur"} de la fraction simplifiée.`,
    answer: askNum ? a0 : b0,
    steps: [{ type: "calcul", text: `\\(\\dfrac{${num}}{${den}} = \\dfrac{${a0}}{${b0}}\\) (on divise haut et bas par ${g}).` }],
  };
}

// ---------- 14. Statistiques : moyenne simple ----------
function genCalculerMoyenneSimple() {
  const n = randInt(4, 6);
  const valeurs = Array.from({ length: n }, () => randInt(0, 20));
  const total = valeurs.reduce((s, v) => s + v, 0);
  const answer = roundTo(total / n, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (3e) — Statistiques",
    prompt: `Calcule la moyenne de la série statistique suivante (arrondie au centième si besoin) : ${valeurs.join(" ; ")}`,
    answer,
    tolerance: 0.02,
    steps: [
      { type: "regle", text: `Moyenne = (somme des valeurs) ÷ (nombre de valeurs).` },
      { type: "calcul", text: `(${valeurs.join(" + ")}) \\div ${n} \\approx ${fr(answer)}` },
    ],
  };
}

const GENERATORS = [
  genMultiplierRelatifs,
  genDiviserRelatifs,
  genPrioriteCalculRelatifs,
  genDevelopperProduitSimple,
  genResoudreEquationSimple,
  genTesterSolutionEquationQCM,
  genPuissanceRelatif,
  genPourcentageDuneQuantite,
  genCoefficientProportionnalite,
  genPythagoreHypotenuseNumeric,
  genPythagoreCoteNumeric,
  genEvaluerFonctionAffine,
  genSimplifierFraction,
  genCalculerMoyenneSimple,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "reviser-les-bases-troisieme",
    title: "Réviser les bases",
    description: "Nombres relatifs, calcul littéral, équations simples, puissances, proportionnalité, théorème de Pythagore, fonctions et fractions de 4e — pour prendre un bon départ en 3e. Gratuit et illimité.",
    pourquoi: "Ce chapitre gratuit consolide les bases indispensables du niveau précédent, pour démarrer l'année sur des fondations solides plutôt que de découvrir des lacunes en cours de route.",
    level: "troisieme",
    free: true,
    order: 0,
  },
  generate,
};
