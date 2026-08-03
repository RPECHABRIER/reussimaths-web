// ---------------------------------------------------------------------------
// Chapitre : Fonctions trigonométriques (Terminale Spé) — abonnement.
// Valeurs remarquables, signe, dérivée des fonctions sinus/cosinus (et de
// leurs composées), parité, périodicité, formules de réduction et
// d'addition, identité cos²+sin²=1.
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

const texAffine = (a, b) => `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`;

// ---------- 1. Valeurs remarquables de cos et sin (QCM) ----------
function genValeurRemarquableQCM() {
  const table = [
    { tex: "0", cos: "1", sin: "0" },
    { tex: "\\dfrac{\\pi}{6}", cos: "\\dfrac{\\sqrt{3}}{2}", sin: "\\dfrac{1}{2}" },
    { tex: "\\dfrac{\\pi}{4}", cos: "\\dfrac{\\sqrt{2}}{2}", sin: "\\dfrac{\\sqrt{2}}{2}" },
    { tex: "\\dfrac{\\pi}{3}", cos: "\\dfrac{1}{2}", sin: "\\dfrac{\\sqrt{3}}{2}" },
    { tex: "\\dfrac{\\pi}{2}", cos: "0", sin: "1" },
    { tex: "\\pi", cos: "-1", sin: "0" },
  ];
  const allValues = ["0", "\\dfrac{1}{2}", "\\dfrac{\\sqrt{2}}{2}", "\\dfrac{\\sqrt{3}}{2}", "1", "-1"];
  const angle = pick(table);
  const fonction = pick(["cos", "sin"]);
  const correct = fonction === "cos" ? angle.cos : angle.sin;
  const distracteurs = shuffle(allValues.filter((v) => v !== correct)).slice(0, 3);
  const options = shuffle([correct, ...distracteurs]);
  return {
    type: "qcm",
    chapter: "Fonctions trigonométriques — Valeurs remarquables",
    prompt: `Quelle est la valeur de \\(\\${fonction}\\left(${angle.tex}\\right)\\) ?`,
    answer: correct,
    options,
    steps: [`\\${fonction}\\left(${angle.tex}\\right) = ${correct}`],
  };
}

// ---------- 2. Signe de cos ou sin selon le quadrant (QCM) ----------
function genSigneCosSinQCM() {
  const quadrants = [
    { angle: "\\dfrac{\\pi}{4}", cosSign: "Positif", sinSign: "Positif" },
    { angle: "\\dfrac{2\\pi}{3}", cosSign: "Négatif", sinSign: "Positif" },
    { angle: "-\\dfrac{2\\pi}{3}", cosSign: "Négatif", sinSign: "Négatif" },
    { angle: "-\\dfrac{\\pi}{3}", cosSign: "Positif", sinSign: "Négatif" },
  ];
  const q = pick(quadrants);
  const fonction = pick(["cos", "sin"]);
  const answer = fonction === "cos" ? q.cosSign : q.sinSign;
  return {
    type: "qcm",
    chapter: "Fonctions trigonométriques — Signe",
    prompt: `Quel est le signe de \\(\\${fonction}\\left(${q.angle}\\right)\\) ?`,
    answer,
    options: ["Positif", "Négatif"],
    steps: [`Sur le cercle trigonométrique, \\(\\${fonction}\\left(${q.angle}\\right)\\) est ${answer.toLowerCase()}.`],
  };
}

// ---------- 3. Dérivée de sin(ax+b) (QCM) ----------
function genDeriveeSinAffineFormuleQCM() {
  const a = nonZero(-6, 6);
  const b = randInt(-6, 6);
  const expo = texAffine(a, b);
  const correct = `${a}\\cos(${expo})`;
  const options = shuffle([correct, `\\cos(${expo})`, `${-a}\\cos(${expo})`, `${a}\\sin(${expo})`]);
  return {
    type: "qcm",
    chapter: "Fonctions trigonométriques — Dérivée",
    prompt: `On considère \\(f(x) = \\sin(${expo})\\). Quelle est l'expression de \\(f'(x)\\) ?`,
    answer: correct,
    options,
    steps: [`f'(x) = ${a} \\times \\cos(${expo}) = ${correct}`],
  };
}

// ---------- 4. Dérivée de cos(ax+b) (QCM) ----------
function genDeriveeCosAffineFormuleQCM() {
  const a = nonZero(-6, 6);
  const b = randInt(-6, 6);
  const expo = texAffine(a, b);
  const correct = `${-a}\\sin(${expo})`;
  const options = shuffle([correct, `${a}\\sin(${expo})`, `${-a}\\cos(${expo})`, `\\sin(${expo})`]);
  return {
    type: "qcm",
    chapter: "Fonctions trigonométriques — Dérivée",
    prompt: `On considère \\(f(x) = \\cos(${expo})\\). Quelle est l'expression de \\(f'(x)\\) ?`,
    answer: correct,
    options,
    steps: [`f'(x) = -${a} \\times \\sin(${expo}) = ${correct}`],
  };
}

// ---------- 5. Parité d'une fonction trigonométrique (QCM) ----------
function genPariteQCM() {
  const cas = pick([
    { description: "f(x) = \\cos(x)", reponse: "Paire" },
    { description: "f(x) = \\sin(x)", reponse: "Impaire" },
    { description: "f(x) = x^2\\cos(x)", reponse: "Paire" },
    { description: "f(x) = x\\sin(x)", reponse: "Paire" },
    { description: "f(x) = x\\cos(x)", reponse: "Impaire" },
    { description: "f(x) = \\sin(x)\\cos(x)", reponse: "Impaire" },
    { description: "f(x) = \\cos(x) + 1", reponse: "Paire" },
    { description: "f(x) = \\cos(x) + x", reponse: "Ni paire ni impaire" },
  ]);
  return {
    type: "qcm",
    chapter: "Fonctions trigonométriques — Parité et périodicité",
    prompt: `La fonction \\(${cas.description}\\) est-elle paire, impaire, ou ni paire ni impaire ?`,
    answer: cas.reponse,
    options: ["Paire", "Impaire", "Ni paire ni impaire"],
    steps: [cas.reponse],
  };
}

// ---------- 6. Période d'une fonction cos(kx) (QCM) ----------
function genPeriodeFormuleQCM() {
  const k = pick([2, 3, 4, 6]);
  const fonction = pick(["cos", "sin"]);
  const correct = `\\dfrac{2\\pi}{${k}}`;
  const options = shuffle([correct, `${k} \\times 2\\pi`, `\\dfrac{\\pi}{${k}}`, `2\\pi + ${k}`]);
  return {
    type: "qcm",
    chapter: "Fonctions trigonométriques — Parité et périodicité",
    prompt: `Quelle est la période de la fonction \\(f(x) = \\${fonction}(${k}x)\\) ?`,
    answer: correct,
    options,
    steps: [`\\text{La période de } \\${fonction}(${k}x) \\text{ est } ${correct}`],
  };
}

// ---------- 7. Formules de réduction (QCM Vrai/Faux) ----------
function genFormuleReductionQCM() {
  const cas = pick([
    { description: "\\cos(-x) = \\cos(x)", reponse: "Vrai" },
    { description: "\\sin(-x) = \\sin(x)", reponse: "Faux" },
    { description: "\\sin(x) = \\cos\\left(\\dfrac{\\pi}{2} - x\\right)", reponse: "Vrai" },
    { description: "\\cos(\\pi - x) = \\cos(x)", reponse: "Faux" },
    { description: "\\sin(\\pi - x) = \\sin(x)", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Fonctions trigonométriques — Formules de réduction",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 8. Comparer cos(a) et cos(b) grâce à la décroissance sur [0;π] (QCM) ----------
function genComparerCosCroissanceQCM() {
  const angles = ["0", "\\dfrac{\\pi}{6}", "\\dfrac{\\pi}{4}", "\\dfrac{\\pi}{3}", "\\dfrac{\\pi}{2}", "\\dfrac{2\\pi}{3}", "\\dfrac{3\\pi}{4}", "\\dfrac{5\\pi}{6}", "\\pi"];
  const i = randInt(0, angles.length - 2);
  const j = randInt(i + 1, angles.length - 1);
  const a = angles[i];
  const b = angles[j];
  const answer = `\\cos(${a}) > \\cos(${b})`;
  const options = [`\\cos(${a}) > \\cos(${b})`, `\\cos(${a}) < \\cos(${b})`, `\\cos(${a}) = \\cos(${b})`];
  return {
    type: "qcm",
    chapter: "Fonctions trigonométriques — Comparaison",
    prompt: `Compare \\(\\cos(${a})\\) et \\(\\cos(${b})\\) (la fonction cosinus est strictement décroissante sur \\([0;\\pi]\\)).`,
    answer,
    options,
    steps: [`${a} < ${b} \\text{ et cos est décroissante donc } \\cos(${a}) > \\cos(${b})`],
  };
}

// ---------- 9. Vrai ou faux sur les propriétés générales (QCM) ----------
function genVraiFauxTrigGeneralQCM() {
  const cas = pick([
    { description: "Les fonctions sinus et cosinus sont périodiques de période \\(2\\pi\\).", reponse: "Vrai" },
    { description: "La fonction cosinus est strictement croissante sur \\([0;\\pi]\\).", reponse: "Faux" },
    { description: "Pour tout réel x, \\(\\cos^2(x) + \\sin^2(x) = 1\\).", reponse: "Vrai" },
    { description: "La fonction sinus est paire.", reponse: "Faux" },
    { description: "Pour tout réel x, \\(-1 \\leqslant \\cos(x) \\leqslant 1\\).", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Fonctions trigonométriques — Propriétés",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 10. Dérivée d'un produit (ax+b)cos(x) (QCM) ----------
function genDeriveeProduitTrigQCM() {
  const a = nonZero(-6, 6);
  const b = randInt(-6, 6);
  const expo = texAffine(a, b);
  const correct = `${a}\\cos(x) - (${expo})\\sin(x)`;
  const options = shuffle([correct, `${a}\\cos(x) + (${expo})\\sin(x)`, `${a}\\cos(x)`, `-(${expo})\\sin(x)`]);
  return {
    type: "qcm",
    chapter: "Fonctions trigonométriques — Dérivée",
    prompt: `On considère \\(f(x) = (${expo})\\cos(x)\\). Quelle est l'expression de \\(f'(x)\\) ?`,
    answer: correct,
    options,
    steps: [`f'(x) = ${a}\\cos(x) + (${expo}) \\times (-\\sin(x)) = ${correct}`],
  };
}

// ---------- 11. Limites remarquables en 0 (QCM) ----------
function genLimiteRemarquableTrigQCM() {
  const cas = pick([
    { description: "\\lim\\limits_{x \\to 0} \\dfrac{\\sin(x)}{x}", reponse: "1" },
    { description: "\\lim\\limits_{x \\to 0} \\dfrac{\\cos(x)-1}{x}", reponse: "0" },
  ]);
  return {
    type: "qcm",
    chapter: "Fonctions trigonométriques — Limites",
    prompt: `Quelle est la limite \\(${cas.description}\\) ?`,
    answer: cas.reponse,
    options: ["1", "0", "+\\infty"],
    steps: [cas.reponse],
  };
}

// ---------- 12. Nombre dérivé de sinus/cosinus en 0 (numeric) ----------
function genNombreDeriveeEnZeroNumeric() {
  const estSinus = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Fonctions trigonométriques — Nombre dérivé",
    prompt: `Quel est le nombre dérivé de la fonction ${estSinus ? "sinus" : "cosinus"} en 0 ?`,
    answer: estSinus ? 1 : 0,
    steps: [estSinus ? "\\sin'(0) = \\cos(0) = 1" : "\\cos'(0) = -\\sin(0) = 0"],
  };
}

// ---------- 13. Utiliser la périodicité pour évaluer f (numeric) ----------
function genValeurFonctionPeriodiqueNumeric() {
  const v = randInt(-9, 9);
  const p = randInt(2, 9);
  const a = randInt(-9, 9);
  const k = randInt(1, 4);
  return {
    type: "numeric",
    chapter: "Fonctions trigonométriques — Parité et périodicité",
    prompt: `Une fonction f est périodique de période ${p}. On sait que \\(f(${a}) = ${v}\\). Calcule \\(f(${a} + ${k * p})\\) en utilisant la périodicité.`,
    answer: v,
    steps: [`${a} + ${k * p} = ${a} + ${k} \\times ${p}`, `f(${a} + ${k} \\times ${p}) = f(${a}) = ${v}`],
  };
}

// ---------- 14. Formules d'addition (QCM) ----------
function genFormuleAdditionQCM() {
  const [v1, v2] = pick([
    ["a", "b"],
    ["p", "q"],
    ["\\alpha", "\\beta"],
  ]);
  const type = pick(["cos_somme", "cos_difference", "sin_somme", "sin_difference"]);
  const allFour = {
    cos_somme: `\\cos(${v1})\\cos(${v2}) - \\sin(${v1})\\sin(${v2})`,
    cos_difference: `\\cos(${v1})\\cos(${v2}) + \\sin(${v1})\\sin(${v2})`,
    sin_somme: `\\sin(${v1})\\cos(${v2}) + \\cos(${v1})\\sin(${v2})`,
    sin_difference: `\\sin(${v1})\\cos(${v2}) - \\cos(${v1})\\sin(${v2})`,
  };
  const prompts = {
    cos_somme: `\\cos(${v1} + ${v2})`,
    cos_difference: `\\cos(${v1} - ${v2})`,
    sin_somme: `\\sin(${v1} + ${v2})`,
    sin_difference: `\\sin(${v1} - ${v2})`,
  };
  const correct = allFour[type];
  const options = shuffle(Object.values(allFour));
  return {
    type: "qcm",
    chapter: "Fonctions trigonométriques — Formules d'addition",
    prompt: `Quelle est l'expression développée de \\(${prompts[type]}\\) ?`,
    answer: correct,
    options,
    steps: [`${prompts[type]} = ${correct}`],
  };
}

// ---------- 15. Identité cos²(x) + sin²(x) = 1 (numeric) ----------
function genValeurCarreSinCosNumeric() {
  const cas = pick([
    { sTex: "\\dfrac{1}{2}", sinSquare: 0.25, cosSquareTex: "\\dfrac{3}{4}", cosSquare: 0.75 },
    { sTex: "\\dfrac{\\sqrt{2}}{2}", sinSquare: 0.5, cosSquareTex: "\\dfrac{1}{2}", cosSquare: 0.5 },
    { sTex: "\\dfrac{\\sqrt{3}}{2}", sinSquare: 0.75, cosSquareTex: "\\dfrac{1}{4}", cosSquare: 0.25 },
  ]);
  return {
    type: "numeric",
    chapter: "Fonctions trigonométriques — Identité remarquable",
    prompt: `On sait que \\(\\sin(x) = ${cas.sTex}\\). En utilisant \\(\\cos^2(x) + \\sin^2(x) = 1\\), calcule \\(\\cos^2(x)\\).`,
    answer: cas.cosSquare,
    tolerance: 0.001,
    steps: [`\\cos^2(x) = 1 - \\left(${cas.sTex}\\right)^2 = 1 - ${fr(cas.sinSquare)} = ${cas.cosSquareTex} = ${fr(cas.cosSquare)}`],
  };
}

const GENERATORS = [
  genValeurRemarquableQCM,
  genSigneCosSinQCM,
  genDeriveeSinAffineFormuleQCM,
  genDeriveeCosAffineFormuleQCM,
  genPariteQCM,
  genPeriodeFormuleQCM,
  genFormuleReductionQCM,
  genComparerCosCroissanceQCM,
  genVraiFauxTrigGeneralQCM,
  genDeriveeProduitTrigQCM,
  genLimiteRemarquableTrigQCM,
  genNombreDeriveeEnZeroNumeric,
  genValeurFonctionPeriodiqueNumeric,
  genFormuleAdditionQCM,
  genValeurCarreSinCosNumeric,
];

const DIFFICULTY = {
  genValeurRemarquableQCM: "facile",
  genSigneCosSinQCM: "facile",
  genDeriveeSinAffineFormuleQCM: "facile",
  genDeriveeCosAffineFormuleQCM: "facile",
  genValeurCarreSinCosNumeric: "facile",
  genPariteQCM: "standard",
  genPeriodeFormuleQCM: "standard",
  genComparerCosCroissanceQCM: "standard",
  genVraiFauxTrigGeneralQCM: "standard",
  genNombreDeriveeEnZeroNumeric: "standard",
  genValeurFonctionPeriodiqueNumeric: "standard",
  genFormuleReductionQCM: "expert",
  genDeriveeProduitTrigQCM: "expert",
  genLimiteRemarquableTrigQCM: "expert",
  genFormuleAdditionQCM: "expert",
};

function generate(difficulty) {
  if (difficulty) {
    const pool = GENERATORS.filter((fn) => (DIFFICULTY[fn.name] ?? "standard") === difficulty);
    if (pool.length) return pick(pool)();
  }
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "fonctions-trigonometriques-terminale-spe",
    title: "Fonctions trigonométriques",
    description: "Valeurs remarquables, dérivée, parité, périodicité, formules de réduction et d'addition.",
    level: "terminale-spe",
    free: false,
    order: 10,
  },
  generate,
};
