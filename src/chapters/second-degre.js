// ---------------------------------------------------------------------------
// Chapitre : Second degré (Première Spécialité) — gratuit
// Ce fichier ne contient QUE du contenu (générateurs d'exercices + métadonnées).
// L'affichage (mode Classique/Jeu, pavé numérique, QCM, aide progressive) est
// géré par le composant générique <ChapterRunner /> pour tous les chapitres.
//
// Convention LaTeX : tout passage mathématique est entouré de \( ... \)
// (rendu ensuite en jolie notation par le composant <MathText />, voir
// src/components/MathText.jsx). Le reste du texte reste du français normal.
// ---------------------------------------------------------------------------

// ---------- Helpers ----------
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const nonZero = (min, max) => {
  let n = 0;
  while (n === 0) n = randInt(min, max);
  return n;
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Retourne un fragment LaTeX signé, ex: signedL(-3, "x") -> "- 3x"
const signedL = (n, withVar = "") => (n >= 0 ? `+ ${n}${withVar}` : `- ${Math.abs(n)}${withVar}`);

// Retourne un trinôme du second degré en LaTeX (sans les délimiteurs \( \)),
// ex: quadL(-3, -2, 5) -> "-3x^2 - 2x + 5"
const quadL = (a2, a1, a0) => {
  const lead = (a2 === 1 ? "" : a2 === -1 ? "-" : String(a2)) + "x^2";
  const parts = [lead];
  if (a1 !== 0) parts.push(signedL(a1, "x"));
  if (a0 !== 0) parts.push(signedL(a0));
  return parts.join(" ");
};

// ---------- Générateurs paramétrés ----------

function genDiscriminant() {
  const a = nonZero(1, 5);
  const b = randInt(-9, 9);
  const c = randInt(-9, 9);
  const delta = b * b - 4 * a * c;
  return {
    type: "numeric",
    chapter: "Second degré — Discriminant",
    prompt: `Calculer le discriminant de l'équation \\(${quadL(a, b, c)} = 0\\).`,
    answer: delta,
    steps: [
      `\\(\\Delta = b^2 - 4ac\\)`,
      `\\(\\Delta = (${b})^2 - 4 \\times ${a} \\times (${c})\\)`,
      `\\(\\Delta = ${b * b} - ${4 * a * c} = ${delta}\\)`,
    ],
  };
}

function genFactoredEquation() {
  let r1 = randInt(-8, 8);
  let r2 = randInt(-8, 8);
  while (r2 === r1) r2 = randInt(-8, 8);
  const smaller = Math.min(r1, r2);
  return {
    type: "numeric",
    chapter: "Second degré — Équation produit nul",
    prompt: `Résoudre : \\((x ${signedL(-r1)})(x ${signedL(-r2)}) = 0\\). Donner la plus petite des deux solutions.`,
    answer: smaller,
    steps: [
      `Un produit de facteurs est nul si l'un au moins des facteurs est nul.`,
      `\\(x ${signedL(-r1)} = 0 \\Rightarrow x = ${r1}\\), ou \\(x ${signedL(-r2)} = 0 \\Rightarrow x = ${r2}\\)`,
      `Les deux solutions sont ${r1} et ${r2}. La plus petite est ${smaller}.`,
    ],
  };
}

function genExpandQCM() {
  const a = pick([-4, -3, -2, 2, 3, 4]);
  const b = nonZero(-9, 9);
  const correctRaw = quadL(a * a, 2 * a * b, b * b);
  const variants = [
    correctRaw,
    quadL(a * a, 0, b * b),
    quadL(a * a, -2 * a * b, b * b),
    quadL(a, 2 * a * b, b * b),
  ];
  const options = shuffle(variants.map((v) => `\\(${v}\\)`));
  const correct = `\\(${correctRaw}\\)`;
  return {
    type: "qcm",
    chapter: "Second degré — Développement",
    prompt: `Développer : \\((${a}x ${signedL(b)})^2\\)`,
    answer: correct,
    options,
    steps: [
      `\\((A + B)^2 = A^2 + 2AB + B^2\\), avec \\(A = ${a}x\\) et \\(B = ${b}\\)`,
      `\\((${a}x)^2 = ${a * a}x^2\\), puis \\(2 \\times ${a}x \\times (${b}) = ${
        2 * a * b >= 0 ? "+" : "-"
      } ${Math.abs(2 * a * b)}x\\), et \\((${b})^2 = ${b * b}\\)`,
      `Résultat : ${correct}`,
    ],
  };
}

function genFactorQCM() {
  const k = nonZero(2, 6);
  const m = randInt(1, 9);
  const correctRaw = `(${k}x - ${m})(${k}x + ${m})`;
  const variants = [correctRaw, `(${k}x - ${m})^2`, `(${k}x + ${m})^2`, `(x - ${m})(${k}x + ${m})`];
  const options = shuffle(variants.map((v) => `\\(${v}\\)`));
  const correct = `\\(${correctRaw}\\)`;
  return {
    type: "qcm",
    chapter: "Second degré — Factorisation",
    prompt: `Factoriser : \\(${k * k}x^2 - ${m * m}\\)`,
    answer: correct,
    options,
    steps: [
      `On reconnaît une identité remarquable \\(a^2 - b^2\\), avec \\(a = ${k}x\\) et \\(b = ${m}\\)`,
      `\\(a^2 - b^2 = (a - b)(a + b)\\)`,
      `Résultat : ${correct}`,
    ],
  };
}

function genNombreSolutions() {
  const a = nonZero(-5, 5);
  const b = randInt(-9, 9);
  const c = randInt(-9, 9);
  const delta = b * b - 4 * a * c;
  const correct = delta > 0 ? "Deux solutions" : delta === 0 ? "Une solution" : "Aucune solution";
  const options = shuffle(["Aucune solution", "Une solution", "Deux solutions"]);
  return {
    type: "qcm",
    chapter: "Second degré — Nombre de solutions",
    prompt: `Sans les calculer, déterminer le nombre de solutions réelles de l'équation \\(${quadL(a, b, c)} = 0\\).`,
    answer: correct,
    options,
    steps: [
      `\\(\\Delta = b^2 - 4ac = (${b})^2 - 4 \\times ${a} \\times (${c}) = ${delta}\\)`,
      delta > 0
        ? `\\(\\Delta > 0\\) donc l'équation admet deux solutions distinctes.`
        : delta === 0
        ? `\\(\\Delta = 0\\) donc l'équation admet une unique solution.`
        : `\\(\\Delta < 0\\) donc l'équation n'admet aucune solution réelle.`,
    ],
  };
}

function genSommetCanonique() {
  const a = pick([-3, -2, -1, 1, 2, 3]);
  const k = randInt(-6, 6);
  const b = -2 * a * k;
  const c = randInt(-9, 9);
  const beta = a * k * k + b * k + c;
  return {
    type: "numeric",
    chapter: "Second degré — Forme canonique",
    prompt: `On considère \\(f(x) = ${quadL(a, b, c)}\\). Déterminer l'abscisse du sommet de la parabole représentant \\(f\\).`,
    answer: k,
    steps: [
      `La forme canonique de \\(f\\) s'écrit \\(a(x - \\alpha)^2 + \\beta\\), avec \\(\\alpha = \\dfrac{-b}{2a}\\).`,
      `\\(\\alpha = \\dfrac{-(${b})}{2 \\times ${a}} = ${k}\\)`,
      `Le sommet a donc pour abscisse ${k} (et pour ordonnée \\(\\beta = f(${k}) = ${beta}\\)).`,
    ],
  };
}

function genResoudreDiscriminant() {
  const a = pick([1, -1, 2, -2, 3, -3]);
  let r1 = randInt(-6, 6);
  let r2 = randInt(-6, 6);
  while (r2 === r1) r2 = randInt(-6, 6);
  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const delta = b * b - 4 * a * c;
  const smaller = Math.min(r1, r2);
  return {
    type: "numeric",
    chapter: "Second degré — Résolution (discriminant)",
    prompt: `Résoudre dans \\(\\mathbb{R}\\) : \\(${quadL(a, b, c)} = 0\\). Donner la plus petite des deux solutions.`,
    answer: smaller,
    steps: [
      `\\(\\Delta = b^2 - 4ac = (${b})^2 - 4 \\times ${a} \\times (${c}) = ${delta}\\)`,
      `\\(\\Delta > 0\\) donc l'équation admet deux solutions : \\(x = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a}\\)`,
      `On trouve \\(x_1 = ${r1}\\) et \\(x_2 = ${r2}\\). La plus petite est ${smaller}.`,
    ],
  };
}

function genFactorisationGenerale() {
  const factorable = Math.random() < 0.7;
  const nonFactor = "Non factorisable sur \\(\\mathbb{R}\\)";

  if (factorable) {
    const a = pick([1, -1, 2, -2, 3, -3]);
    let r1 = nonZero(-6, 6);
    let r2 = nonZero(-6, 6);
    while (r2 === r1) r2 = nonZero(-6, 6);
    const b = -a * (r1 + r2);
    const c = a * r1 * r2;
    const lead = a === 1 ? "" : a === -1 ? "-" : `${a}`;
    const wrongLead = a >= 0 ? a + 1 : a - 1;
    const correctRaw = `${lead}(x ${signedL(-r1)})(x ${signedL(-r2)})`;
    const fakeSignRaw = `${lead}(x ${signedL(r1)})(x ${signedL(-r2)})`;
    const fakeARaw = `${wrongLead}(x ${signedL(-r1)})(x ${signedL(-r2)})`;
    const options = shuffle([`\\(${correctRaw}\\)`, `\\(${fakeSignRaw}\\)`, `\\(${fakeARaw}\\)`, nonFactor]);
    const correct = `\\(${correctRaw}\\)`;
    return {
      type: "qcm",
      chapter: "Second degré — Factorisation",
      prompt: `Factoriser sur \\(\\mathbb{R}\\), si possible : \\(${quadL(a, b, c)}\\)`,
      answer: correct,
      options,
      steps: [
        `\\(\\Delta = b^2 - 4ac = (${b})^2 - 4 \\times ${a} \\times (${c}) = ${b * b - 4 * a * c}\\)`,
        `\\(\\Delta > 0\\), le polynôme admet deux racines : ${r1} et ${r2}.`,
        `Forme factorisée : \\(a(x - x_1)(x - x_2) = ${correctRaw}\\)`,
      ],
    };
  }

  let a, b, c, delta;
  do {
    a = nonZero(1, 4) * pick([1, -1]);
    b = randInt(-6, 6);
    c = randInt(-6, 6);
    delta = b * b - 4 * a * c;
  } while (delta >= 0);
  const options = shuffle([
    nonFactor,
    `\\((x - ${randInt(1, 5)})(x + ${randInt(1, 5)})\\)`,
    `\\(${a}(x - ${randInt(1, 5)})^2\\)`,
    `\\((${a}x - ${randInt(1, 5)})(x + ${randInt(1, 5)})\\)`,
  ]);
  return {
    type: "qcm",
    chapter: "Second degré — Factorisation",
    prompt: `Factoriser sur \\(\\mathbb{R}\\), si possible : \\(${quadL(a, b, c)}\\)`,
    answer: nonFactor,
    options,
    steps: [
      `\\(\\Delta = b^2 - 4ac = (${b})^2 - 4 \\times ${a} \\times (${c}) = ${delta}\\)`,
      `\\(\\Delta < 0\\), donc le polynôme n'admet aucune racine réelle.`,
      `On en déduit qu'il n'est pas factorisable sur \\(\\mathbb{R}\\).`,
    ],
  };
}

function genInequation() {
  const a = pick([1, -1, 2, -2, 3, -3]);
  let r1 = randInt(-6, 6);
  let r2 = randInt(-6, 6);
  while (r2 === r1) r2 = randInt(-6, 6);
  const lo = Math.min(r1, r2);
  const hi = Math.max(r1, r2);
  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const op = pick(["<", ">", "\\leq", "\\geq"]);
  const closed = op === "\\leq" || op === "\\geq";
  const wantPositive = op === ">" || op === "\\geq";
  const solutionIsOutside = wantPositive ? a > 0 : a < 0;
  const outside = `]-\\infty ; ${lo}${closed ? "]" : "["} \\cup ${closed ? "[" : "]"}${hi} ; +\\infty[`;
  const inside = `${closed ? "[" : "]"}${lo} ; ${hi}${closed ? "]" : "["}`;
  const correctRaw = solutionIsOutside ? outside : inside;
  const wrong1Raw = solutionIsOutside ? inside : outside;
  const correct = `\\(${correctRaw}\\)`;
  const options = shuffle([correct, `\\(${wrong1Raw}\\)`, "\\(\\mathbb{R}\\)", "\\(\\varnothing\\)"]);
  return {
    type: "qcm",
    chapter: "Second degré — Inéquations",
    prompt: `Résoudre dans \\(\\mathbb{R}\\) : \\(${quadL(a, b, c)} ${op} 0\\)`,
    answer: correct,
    options,
    steps: [
      `Les racines du polynôme sont ${lo} et ${hi}.`,
      `Un polynôme du second degré est du signe de \\(a\\) (ici ${a}) à l'extérieur des racines, et du signe opposé entre les racines.`,
      `Solution : ${correct}`,
    ],
  };
}

function genConstructionRacines() {
  let r1 = randInt(-6, 6);
  let r2 = randInt(-6, 6);
  while (r2 === r1) r2 = randInt(-6, 6);
  let x0 = randInt(-6, 6);
  while (x0 === r1 || x0 === r2) x0 = randInt(-6, 6);
  const aTrue = nonZero(-4, 4);
  const y0 = aTrue * (x0 - r1) * (x0 - r2);
  return {
    type: "numeric",
    chapter: "Second degré — Détermination de f",
    prompt: `\\(f\\) est une fonction polynomiale du second degré qui s'annule en \\(x = ${r1}\\) et \\(x = ${r2}\\). Sa parabole passe par le point \\((${x0} ; ${y0})\\). Sachant que \\(f(x) = a(x - ${r1})(x - ${r2})\\), déterminer \\(a\\).`,
    answer: aTrue,
    steps: [
      `\\(f(x) = a(x - ${r1})(x - ${r2})\\) car ${r1} et ${r2} sont racines de \\(f\\).`,
      `\\(f(${x0}) = ${y0}\\) donc \\(a \\times (${x0} - ${r1}) \\times (${x0} - ${r2}) = ${y0}\\)`,
      `\\(a = \\dfrac{${y0}}{${(x0 - r1) * (x0 - r2)}} = ${aTrue}\\)`,
    ],
  };
}

// ---------- Banque fixe : exercices issus de sujets de bac ----------
const FIXED_BANK = [
  {
    type: "numeric",
    chapter: "Second degré — Bac • formes multiples",
    prompt: `On donne \\(f(x) = -3(x + 5)^2 + 3\\). Résoudre \\(f(x) = 3\\).`,
    answer: -5,
    steps: [
      `\\(-3(x + 5)^2 + 3 = 3 \\Leftrightarrow -3(x + 5)^2 = 0 \\Leftrightarrow (x + 5)^2 = 0\\)`,
      `\\(x + 5 = 0\\)`,
      `\\(x = -5\\) (solution unique)`,
    ],
  },
  {
    type: "numeric",
    chapter: "Second degré — Bac • formes multiples",
    prompt: `On donne \\(f(x) = -3x^2 - 30x - 72\\). Résoudre \\(f(x) = -72\\) et donner la plus grande solution.`,
    answer: 0,
    steps: [
      `\\(-3x^2 - 30x - 72 = -72 \\Leftrightarrow -3x^2 - 30x = 0 \\Leftrightarrow x(-3x - 30) = 0\\)`,
      `\\(x = 0\\) ou \\(x = -10\\)`,
      `La plus grande solution est 0.`,
    ],
  },
  {
    type: "numeric",
    chapter: "Second degré — Bac • formes multiples",
    prompt: `On donne \\(f(x) = 3(x - 9)^2 - 48 = 3(x - 5)(x - 13)\\). Résoudre \\(f(x) = 195\\) et donner la plus grande solution.`,
    answer: 18,
    steps: [
      `\\(3x^2 - 54x + 195 = 195 \\Leftrightarrow 3x^2 - 54x = 0 \\Leftrightarrow x(3x - 54) = 0\\)`,
      `\\(x = 0\\) ou \\(x = 18\\)`,
      `La plus grande solution est 18.`,
    ],
  },
  {
    type: "numeric",
    chapter: "Second degré — Bac • formes multiples",
    prompt: `Toujours pour \\(f(x) = 3(x - 5)(x - 13)\\), résoudre \\(f(x) = 0\\) et donner la plus petite solution.`,
    answer: 5,
    steps: [
      `\\(f(x) = 0 \\Leftrightarrow x - 5 = 0\\) ou \\(x - 13 = 0\\)`,
      `\\(x = 5\\) ou \\(x = 13\\)`,
      `La plus petite solution est 5.`,
    ],
  },
  {
    type: "qcm",
    chapter: "Second degré — Bac • signe et variations",
    prompt: `On considère \\(f(x) = -4x^2 - 24x - 20\\) (racines : \\(-5\\) et \\(-1\\)). Résoudre l'inéquation \\(f(x) \\geq 0\\).`,
    answer: "\\([-5 ; -1]\\)",
    options: shuffle([
      "\\([-5 ; -1]\\)",
      "\\(]-\\infty ; -5] \\cup [-1 ; +\\infty[\\)",
      "\\(\\mathbb{R}\\)",
      "\\(\\varnothing\\)",
    ]),
    steps: [
      `Comme \\(a = -4 < 0\\), \\(f(x)\\) est du signe de \\(a\\) à l'extérieur des racines et positif entre les racines.`,
      `\\(f(x) \\geq 0\\) sur l'intervalle formé par les racines.`,
      `\\(S = [-5 ; -1]\\)`,
    ],
  },
  {
    type: "qcm",
    chapter: "Second degré — Bac • signe et variations",
    prompt: `Pour \\(f(x) = -4x^2 - 24x - 20\\), dont l'axe de symétrie est \\(x = -3\\), comparer \\(f(-6)\\) et \\(f(0)\\).`,
    answer: "\\(f(-6) = f(0)\\)",
    options: shuffle(["\\(f(-6) = f(0)\\)", "\\(f(-6) > f(0)\\)", "\\(f(-6) < f(0)\\)", "On ne peut pas comparer"]),
    steps: [
      `L'axe de symétrie de la parabole est \\(x = -3\\).`,
      `\\(-6\\) et \\(0\\) sont symétriques par rapport à \\(-3\\) (\\(-6 = -3 - 3\\) et \\(0 = -3 + 3\\)).`,
      `Donc \\(f(-6) = f(0)\\).`,
    ],
  },
  {
    type: "qcm",
    chapter: "Second degré — Bac • domaine de définition",
    prompt: `On pose \\(g(x) = \\dfrac{9x - 2}{-4x^2 - 24x - 20}\\), où \\(-4x^2 - 24x - 20\\) s'annule en \\(-5\\) et \\(-1\\). Quel est l'ensemble de définition de \\(g\\) ?`,
    answer: "\\(\\mathbb{R} \\setminus \\{-5 ; -1\\}\\)",
    options: shuffle([
      "\\(\\mathbb{R} \\setminus \\{-5 ; -1\\}\\)",
      "\\(\\mathbb{R}\\)",
      "\\(\\mathbb{R} \\setminus \\{0\\}\\)",
      "\\([-5 ; -1]\\)",
    ]),
    steps: [
      `\\(g(x)\\) est définie lorsque le dénominateur est non nul, c'est-à-dire lorsque \\(x \\neq -5\\) et \\(x \\neq -1\\).`,
      `Ensemble de définition : \\(\\mathbb{R} \\setminus \\{-5 ; -1\\}\\)`,
    ],
  },
  {
    type: "numeric",
    chapter: "Second degré — Bac • détermination de f",
    prompt: `La fonction \\(i(x) = ax^2 + bx - 5\\) passe par les points \\((-4 ; 11)\\) et \\((4 ; 43)\\). Déterminer \\(a\\).`,
    answer: 2,
    steps: [
      `\\(i(4) = 16a + 4b - 5 = 43\\) et \\(i(-4) = 16a - 4b - 5 = 11\\)`,
      `En additionnant les deux équations : \\(32a - 10 = 54\\), donc \\(32a = 64\\)`,
      `\\(a = 2\\)`,
    ],
  },
];

const GENERATORS = [
  genDiscriminant,
  genFactoredEquation,
  genExpandQCM,
  genFactorQCM,
  genNombreSolutions,
  genSommetCanonique,
  genResoudreDiscriminant,
  genFactorisationGenerale,
  genInequation,
  genConstructionRacines,
];

function generate() {
  if (FIXED_BANK.length && Math.random() < 0.25) return { ...pick(FIXED_BANK) };
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "second-degre",
    title: "Second degré",
    description: "Discriminant, formes canonique/factorisée, résolution, inéquations, lecture de courbe.",
    level: "premiere-spe",
    free: true,
    order: 2,
  },
  generate,
};
