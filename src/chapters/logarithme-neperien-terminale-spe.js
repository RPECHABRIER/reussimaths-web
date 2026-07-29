// ---------------------------------------------------------------------------
// Chapitre : Logarithme népérien (Terminale Spé) — abonnement.
// Propriétés algébriques du logarithme, domaine de définition, dérivée de
// ln(u), équations et inéquations, signe et comparaison, limites usuelles.
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

// ---------- 1. Propriété ln(m×n) = ln(m) + ln(n) (QCM) ----------
function genLnProduitQCM() {
  const m = randInt(2, 9);
  let n = randInt(2, 9);
  if (n === m) n += 1;
  const correct = `\\ln(${m}) + \\ln(${n})`;
  const options = shuffle([correct, `\\ln(${m}) \\times \\ln(${n})`, `\\ln(${m}) - \\ln(${n})`, `\\ln(${m + n})`]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `Quelle est l'expression de \\(\\ln(${m} \\times ${n})\\) en fonction de \\(\\ln(${m})\\) et \\(\\ln(${n})\\) ?`,
    answer: correct,
    options,
    steps: [`\\ln(${m} \\times ${n}) = ${correct}`],
  };
}

// ---------- 2. Propriété ln(m/n) = ln(m) - ln(n) (QCM) ----------
function genLnQuotientQCM() {
  const m = randInt(2, 9);
  let n = randInt(2, 9);
  if (n === m) n += 1;
  const correct = `\\ln(${m}) - \\ln(${n})`;
  const options = shuffle([correct, `\\ln(${n}) - \\ln(${m})`, `\\ln(${m}) + \\ln(${n})`, `\\dfrac{\\ln(${m})}{\\ln(${n})}`]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `Quelle est l'expression de \\(\\ln\\left(\\dfrac{${m}}{${n}}\\right)\\) en fonction de \\(\\ln(${m})\\) et \\(\\ln(${n})\\) ?`,
    answer: correct,
    options,
    steps: [`\\ln\\left(\\dfrac{${m}}{${n}}\\right) = ${correct}`],
  };
}

// ---------- 3. Coefficient dans ln(b^n) = n ln(b) (numeric) ----------
function genLnPuissanceCoefficientNumeric() {
  const b = pick([2, 3, 5, 7]);
  const n = randInt(2, 6);
  return {
    type: "numeric",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `On écrit \\(\\ln(${b}^{${n}})\\) sous la forme \\(k \\times \\ln(${b})\\). Donne la valeur de k.`,
    answer: n,
    steps: [`\\ln(${b}^{${n}}) = ${n}\\ln(${b})`],
  };
}

// ---------- 4. Racine k-ième et logarithme (QCM) ----------
function genLnRacineFormuleQCM() {
  const v = pick(["x", "t", "a"]);
  const k = pick([2, 3, 4]);
  const correct = `\\dfrac{1}{${k}}\\ln(${v})`;
  const options = shuffle([correct, `${k}\\ln(${v})`, `\\ln(${v})^{\\frac{1}{${k}}}`, `\\ln\\left(\\dfrac{${v}}{${k}}\\right)`]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `On considère \\(${v} > 0\\). Quelle est l'expression de \\(\\ln\\left(\\sqrt[${k}]{${v}}\\right)\\) en fonction de \\(\\ln(${v})\\) ?`,
    answer: correct,
    options,
    steps: [`\\sqrt[${k}]{${v}} = ${v}^{\\frac{1}{${k}}} \\Rightarrow \\ln\\left(\\sqrt[${k}]{${v}}\\right) = ${correct}`],
  };
}

// ---------- 5. Valeurs remarquables du logarithme (QCM Vrai/Faux) ----------
function genLnValeurRemarquableQCM() {
  const cas = pick([
    { description: "\\ln(1) = 0", reponse: "Vrai" },
    { description: "\\ln(\\mathrm{e}) = 1", reponse: "Vrai" },
    { description: "\\ln(0) \\text{ est défini et vaut } 0", reponse: "Faux" },
    { description: "\\text{Pour tout } a>0, \\mathrm{e}^{\\ln(a)} = a", reponse: "Vrai" },
    { description: "\\text{Pour tout réel } k, \\ln(\\mathrm{e}^k) = k", reponse: "Vrai" },
    { description: "\\ln(\\mathrm{e}^2) = 4", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 6. Borne du domaine de définition de ln(ax+b) (numeric) ----------
function genDomaineDefinitionLnNumeric() {
  const x0 = randInt(-6, 6);
  const a = nonZero(-5, 5);
  const b = -a * x0;
  return {
    type: "numeric",
    chapter: "Logarithme népérien — Domaine de définition",
    prompt: `On considère \\(f(x) = \\ln(${texAffine(a, b)})\\). f est définie là où \\(${texAffine(a, b)} > 0\\). Détermine la valeur de x pour laquelle \\(${texAffine(a, b)} = 0\\) (borne du domaine de définition).`,
    answer: x0,
    steps: [`${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = 0`, `x = ${x0}`],
  };
}

// ---------- 7. Dérivée de ln(ax+b) en un point (numeric) ----------
function genDeriveeLnAffineNumeric() {
  const a = nonZero(-6, 6);
  const x0 = randInt(-5, 5);
  const k = randInt(1, 9); // valeur de ax+b en x0, choisie strictement positive
  const b = k - a * x0;
  const answer = roundTo(a / k, 4);
  return {
    type: "numeric",
    chapter: "Logarithme népérien — Dérivée",
    prompt: `On considère \\(f(x) = \\ln(${texAffine(a, b)})\\). Calcule \\(f'(${x0})\\), arrondi au millième si nécessaire.`,
    answer,
    tolerance: 0.001,
    steps: [`f'(x) = \\dfrac{${a}}{${texAffine(a, b)}}`, `f'(${x0}) = \\dfrac{${a}}{${k}} = ${fr(answer)}`],
  };
}

// ---------- 8. Reconnaître la dérivée de ln(ax+b) (QCM) ----------
function genDeriveeLnFormuleQCM() {
  let a = nonZero(-6, 6);
  if (a === 1) a = 2; // évite que le distracteur "sans a" coïncide avec la réponse correcte
  const b = randInt(-6, 6);
  const expo = texAffine(a, b);
  const correct = `\\dfrac{${a}}{${expo}}`;
  const options = shuffle([correct, `\\dfrac{1}{${expo}}`, `\\dfrac{${a}}{${a}x}`, `${a} \\times \\ln(${expo})`]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Dérivée",
    prompt: `On considère \\(f(x) = \\ln(${expo})\\). Quelle est l'expression de \\(f'(x)\\) ?`,
    answer: correct,
    options,
    steps: [`f'(x) = \\dfrac{u'(x)}{u(x)} = ${correct}`],
  };
}

// ---------- 9. Résoudre ln(x) = k (numeric) ----------
function genResoudreEquationLnNumeric() {
  const k = randInt(-3, 3);
  const answer = roundTo(Math.exp(k), 4);
  return {
    type: "numeric",
    chapter: "Logarithme népérien — Équations",
    prompt: `Résous l'équation \\(\\ln(x) = ${k}\\) (avec x > 0). Donne la valeur de x arrondie au centième.`,
    answer,
    tolerance: 0.01,
    steps: [`x = \\mathrm{e}^{${k}}`, `x \\approx ${fr(answer)}`],
  };
}

// ---------- 10. Résoudre ln(a1x+b1) = ln(a2x+b2) (numeric) ----------
function genResoudreEquationLnEgaliteNumeric() {
  const x0 = randInt(-6, 6);
  const a1 = nonZero(-5, 5);
  let a2 = nonZero(-5, 5);
  if (a2 === a1) a2 += 1;
  const V = randInt(1, 12); // valeur commune des deux membres en x0, strictement positive
  const b1 = V - a1 * x0;
  const b2 = V - a2 * x0;
  return {
    type: "numeric",
    chapter: "Logarithme népérien — Équations",
    prompt: `Résous l'équation \\(\\ln(${texAffine(a1, b1)}) = \\ln(${texAffine(a2, b2)})\\).`,
    answer: x0,
    steps: [
      `${texAffine(a1, b1)} = ${texAffine(a2, b2)}`,
      `${a1 - a2}x = ${b2 - b1}`,
      `x = ${x0}`,
    ],
  };
}

// ---------- 11. Signe de ln(x) (QCM) ----------
function genSigneLnQCM() {
  const cas = pick(["superieur", "inferieur", "unite"]);
  let texte, answer;
  if (cas === "superieur") {
    const x = randInt(2, 9);
    texte = `${x}`;
    answer = "Positif";
  } else if (cas === "inferieur") {
    const n = randInt(2, 9);
    texte = `\\dfrac{1}{${n}}`;
    answer = "Négatif";
  } else {
    texte = "1";
    answer = "Nul";
  }
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Signe et comparaison",
    prompt: `Quel est le signe de \\(\\ln(${texte})\\) ?`,
    answer,
    options: ["Positif", "Négatif", "Nul"],
    steps: [answer === "Positif" ? "L'argument est strictement supérieur à 1." : answer === "Négatif" ? "L'argument est strictement compris entre 0 et 1." : "L'argument vaut 1."],
  };
}

// ---------- 12. Comparer ln(a) et ln(b) (QCM) ----------
function genComparerLnQCM() {
  const a = randInt(2, 20);
  let b = randInt(2, 20);
  if (b === a) b += 1;
  const answer = a < b ? `\\ln(${a}) < \\ln(${b})` : `\\ln(${a}) > \\ln(${b})`;
  const options = [`\\ln(${a}) < \\ln(${b})`, `\\ln(${a}) > \\ln(${b})`, `\\ln(${a}) = \\ln(${b})`];
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Signe et comparaison",
    prompt: `Compare \\(\\ln(${a})\\) et \\(\\ln(${b})\\) (la fonction ln est strictement croissante sur \\(]0;+\\infty[\\)).`,
    answer,
    options,
    steps: [a < b ? `${a} < ${b} \\text{ donc } \\ln(${a}) < \\ln(${b})` : `${a} > ${b} \\text{ donc } \\ln(${a}) > \\ln(${b})`],
  };
}

// ---------- 13. Limites usuelles du logarithme (QCM) ----------
function genLimiteLnQCM() {
  const cas = pick([
    { description: "\\lim\\limits_{x \\to 0^+} \\ln(x)", reponse: "-\\infty" },
    { description: "\\lim\\limits_{x \\to +\\infty} \\ln(x)", reponse: "+\\infty" },
    { description: "\\lim\\limits_{x \\to +\\infty} \\dfrac{\\ln(x)}{x}", reponse: "0" },
    { description: "\\lim\\limits_{x \\to 0^+} x\\ln(x)", reponse: "0" },
  ]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Limites",
    prompt: `Quelle est la limite \\(${cas.description}\\) ?`,
    answer: cas.reponse,
    options: ["-\\infty", "+\\infty", "0"],
    steps: [cas.reponse],
  };
}

// ---------- 14. Vrai ou faux sur les propriétés du logarithme (QCM) ----------
function genVraiFauxProprietesLnQCM() {
  const cas = pick([
    { description: "\\ln(a+b) = \\ln(a) + \\ln(b)", reponse: "Faux" },
    { description: "\\text{Pour } a,b>0, \\ln(a \\times b) = \\ln(a) + \\ln(b)", reponse: "Vrai" },
    { description: "\\text{Pour tout réel } a, \\ln(a^2) = 2\\ln(a)", reponse: "Faux" },
    { description: "La fonction \\ln \\text{ est strictement croissante sur } \\left]0;+\\infty\\right[", reponse: "Vrai" },
    { description: "\\ln(x) \\text{ est défini pour tout réel } x", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 15. Simplifier ln(e^a × e^b) (numeric) ----------
function genLnExponentielleReciproqueNumeric() {
  const a = randInt(-8, 8);
  const b = randInt(-8, 8);
  const answer = a + b;
  return {
    type: "numeric",
    chapter: "Logarithme népérien — Propriétés algébriques",
    prompt: `Simplifie \\(\\ln\\left(\\mathrm{e}^{${a}} \\times \\mathrm{e}^{${b}}\\right)\\).`,
    answer,
    steps: [`\\mathrm{e}^{${a}} \\times \\mathrm{e}^{${b}} = \\mathrm{e}^{${a}+${b}}`, `\\ln\\left(\\mathrm{e}^{${a}+${b}}\\right) = ${a} + ${b} = ${answer}`],
  };
}

const GENERATORS = [
  genLnProduitQCM,
  genLnQuotientQCM,
  genLnPuissanceCoefficientNumeric,
  genLnRacineFormuleQCM,
  genLnValeurRemarquableQCM,
  genDomaineDefinitionLnNumeric,
  genDeriveeLnAffineNumeric,
  genDeriveeLnFormuleQCM,
  genResoudreEquationLnNumeric,
  genResoudreEquationLnEgaliteNumeric,
  genSigneLnQCM,
  genComparerLnQCM,
  genLimiteLnQCM,
  genVraiFauxProprietesLnQCM,
  genLnExponentielleReciproqueNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "logarithme-neperien-terminale-spe",
    title: "Logarithme népérien",
    description: "Propriétés algébriques, domaine de définition, dérivée, équations, signe et limites du logarithme népérien.",
    level: "terminale-spe",
    free: false,
    order: 9,
  },
  generate,
};
