// ---------------------------------------------------------------------------
// Chapitre : Compléments sur la dérivation (Terminale Spé) — abonnement.
// Dérivée d'une composée (u^n, sqrt(u), e^u), dérivée seconde, convexité /
// concavité, points d'inflexion, tangentes et position relative de la
// courbe par rapport à ses tangentes, domaine de dérivabilité.
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

// Formate "ax + b" avec le signe correct de b (jamais de digit perdu).
const texAffine = (a, b) => `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`;

// ---------- 1. Dérivée d'une composée (ax+b)^n, valeur numérique ----------
function genDeriveePuissanceNumeric() {
  const a = nonZero(-4, 4);
  const b = randInt(-8, 8);
  const x0 = randInt(-5, 5);
  const n = pick([2, 3]);
  const u0 = a * x0 + b;
  const answer = n * a * u0 ** (n - 1);
  return {
    type: "numeric",
    chapter: "Compléments sur la dérivation — Dérivée d'une composée",
    prompt: `On considère \\(f(x) = (${texAffine(a, b)})^{${n}}\\). Calcule \\(f'(${x0})\\).`,
    answer,
    steps: [
      `f'(x) = ${n} \\times ${a} \\times (${texAffine(a, b)})^{${n - 1}}`,
      `f'(${x0}) = ${n} \\times ${a} \\times (${u0})^{${n - 1}} = ${answer}`,
    ],
  };
}

// ---------- 2. Dérivée d'une composée sqrt(ax+b), valeur numérique ----------
function genDeriveeRacineNumeric() {
  const s = randInt(1, 6); // sqrt(u0) = s, un entier positif
  const a = nonZero(-6, 6);
  const x0 = randInt(-5, 5);
  const b = s * s - a * x0; // garantit a*x0+b = s^2
  const answer = roundTo(a / (2 * s), 4);
  return {
    type: "numeric",
    chapter: "Compléments sur la dérivation — Dérivée d'une composée",
    prompt: `On considère \\(f(x) = \\sqrt{${texAffine(a, b)}}\\). Calcule \\(f'(${x0})\\), arrondi au millième si nécessaire.`,
    answer,
    tolerance: 0.001,
    steps: [
      `f'(x) = \\dfrac{${a}}{2\\sqrt{${texAffine(a, b)}}}`,
      `f'(${x0}) = \\dfrac{${a}}{2\\sqrt{${s * s}}} = \\dfrac{${a}}{2 \\times ${s}} = ${fr(answer)}`,
    ],
  };
}

// ---------- 3. Reconnaître la dérivée de e^(ax+b) (QCM) ----------
function genDeriveeExponentielleAffineQCM() {
  const a = pick([-5, -4, -3, -2, 2, 3, 4, 5]);
  const b = randInt(-6, 6);
  const expo = texAffine(a, b);
  const correct = `${a}\\mathrm{e}^{${expo}}`;
  const distracteur1 = `\\mathrm{e}^{${expo}}`; // oublie le facteur a
  const distracteur2 = `${a}x\\mathrm{e}^{${expo}}`; // facteur x en trop
  const distracteur3 = `(${expo})\\mathrm{e}^{${expo}}`; // confusion avec la règle du produit
  const options = shuffle([correct, distracteur1, distracteur2, distracteur3]);
  return {
    type: "qcm",
    chapter: "Compléments sur la dérivation — Dérivée d'une composée",
    prompt: `On considère \\(f(x) = \\mathrm{e}^{${expo}}\\). Quelle est l'expression de \\(f'(x)\\) ?`,
    answer: correct,
    options,
    steps: [`f'(x) = (${a}) \\times \\mathrm{e}^{${expo}} = ${correct}`],
  };
}

// ---------- 4. Dérivée seconde d'un polynôme du 3e degré, valeur numérique ----------
function genDeriveeSecondeNumeric() {
  const a = nonZero(-4, 4);
  const b = randInt(-6, 6);
  const c = randInt(-6, 6);
  const d = randInt(-6, 6);
  const x0 = randInt(-5, 5);
  const answer = 6 * a * x0 + 2 * b;
  return {
    type: "numeric",
    chapter: "Compléments sur la dérivation — Dérivée seconde",
    prompt: `On considère \\(f(x) = ${a}x^3 ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x^2 ${c >= 0 ? "+" : "-"} ${Math.abs(c)}x ${d >= 0 ? "+" : "-"} ${Math.abs(d)}\\). Calcule \\(f''(${x0})\\).`,
    answer,
    steps: [
      `f'(x) = ${3 * a}x^2 ${2 * b >= 0 ? "+" : "-"} ${Math.abs(2 * b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)}`,
      `f''(x) = ${6 * a}x ${2 * b >= 0 ? "+" : "-"} ${Math.abs(2 * b)}`,
      `f''(${x0}) = ${6 * a} \\times ${x0} ${2 * b >= 0 ? "+" : "-"} ${Math.abs(2 * b)} = ${answer}`,
    ],
  };
}

// ---------- 5. Signe de f'' et convexité/concavité en un point (QCM) ----------
function genSigneConvexiteQCM() {
  const a = nonZero(-4, 4);
  const x0 = randInt(-5, 5);
  let b = randInt(-10, 10);
  let valeur = 6 * a * x0 + 2 * b;
  if (valeur === 0) {
    b += 1;
    valeur = 6 * a * x0 + 2 * b;
  }
  const convexe = valeur > 0;
  return {
    type: "qcm",
    chapter: "Compléments sur la dérivation — Convexité",
    prompt: `Une fonction f vérifie, pour tout x, \\(f''(x) = ${6 * a}x ${2 * b >= 0 ? "+" : "-"} ${Math.abs(2 * b)}\\). f est-elle convexe ou concave au point d'abscisse ${x0} ?`,
    answer: convexe ? "Convexe" : "Concave",
    options: ["Convexe", "Concave"],
    steps: [
      `f''(${x0}) = ${6 * a} \\times ${x0} ${2 * b >= 0 ? "+" : "-"} ${Math.abs(2 * b)} = ${valeur}`,
      convexe ? "f'' est positive : f est convexe en ce point." : "f'' est négative : f est concave en ce point.",
    ],
  };
}

// ---------- 6. Abscisse du point d'inflexion (f'' affine), valeur numérique ----------
function genPointInflexionNumeric() {
  const x0 = randInt(-6, 6); // l'abscisse recherchée
  const a = nonZero(-5, 5);
  const b = -a * x0;
  return {
    type: "numeric",
    chapter: "Compléments sur la dérivation — Points d'inflexion",
    prompt: `Une fonction f vérifie, pour tout x, \\(f''(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Détermine l'abscisse du point d'inflexion de la courbe de f (résous \\(f''(x)=0\\)).`,
    answer: x0,
    steps: [`${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = 0`, `x = ${x0}`],
  };
}

// ---------- 7. Nombre de points d'inflexion via f'' du second degré (numeric) ----------
function genNombrePointsInflexionQCM() {
  const deuxPoints = Math.random() < 0.5;
  const a = nonZero(-4, 4);
  let b, c, answer;
  if (deuxPoints) {
    const r1 = randInt(-6, 6);
    let r2 = randInt(-6, 6);
    if (r2 === r1) r2 += 1;
    b = -a * (r1 + r2);
    c = a * r1 * r2;
    answer = 2;
  } else {
    b = 0;
    // ac > 0 garantit un discriminant -4ac négatif (0 - 4ac < 0)
    c = a > 0 ? randInt(1, 8) : -randInt(1, 8);
    answer = 0;
  }
  return {
    type: "numeric",
    chapter: "Compléments sur la dérivation — Points d'inflexion",
    prompt: `Une fonction f vérifie, pour tout x, \\(f''(x) = ${a}x^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)}\\). Combien de points d'inflexion la courbe de f admet-elle ?`,
    answer,
    steps: [
      `\\Delta = ${b}^2 - 4 \\times ${a} \\times ${c} = ${b * b - 4 * a * c}`,
      answer === 2 ? "Le discriminant est strictement positif : deux points d'inflexion." : "Le discriminant est strictement négatif : aucun point d'inflexion.",
    ],
  };
}

// ---------- 8. Valeur d'une tangente en un autre point, valeur numérique ----------
function genTangenteValeurNumeric() {
  const a = randInt(-6, 6);
  const m = nonZero(-6, 6);
  const p = randInt(-8, 8);
  let x1 = randInt(-6, 6);
  if (x1 === a) x1 += 1;
  const answer = m * (x1 - a) + p;
  return {
    type: "numeric",
    chapter: "Compléments sur la dérivation — Tangentes",
    prompt: `On a \\(f(${a}) = ${p}\\) et \\(f'(${a}) = ${m}\\). La tangente à la courbe de f au point d'abscisse ${a} a pour équation \\(y = ${m}(x - (${a})) + ${p}\\). Quelle est l'ordonnée du point de cette tangente d'abscisse ${x1} ?`,
    answer,
    steps: [`y = ${m} \\times (${x1} - (${a})) + ${p}`, `y = ${answer}`],
  };
}

// ---------- 9. Position de la courbe par rapport à ses tangentes (QCM) ----------
function genPositionRelativeQCM() {
  const convexe = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Compléments sur la dérivation — Convexité",
    prompt: `Une fonction f est ${convexe ? "convexe" : "concave"} sur un intervalle I. Sur I, la courbe de f est-elle au-dessus ou en-dessous de ses tangentes ?`,
    answer: convexe ? "Au-dessus" : "En-dessous",
    options: ["Au-dessus", "En-dessous"],
    steps: [convexe ? "Une fonction convexe a une courbe au-dessus de ses tangentes." : "Une fonction concave a une courbe en-dessous de ses tangentes."],
  };
}

// ---------- 10. Vrai ou faux sur la convexité (QCM) ----------
function genVraiFauxConvexiteQCM() {
  const cas = pick([
    { description: "Si \\(f''\\) est positive sur I, alors f est convexe sur I.", reponse: "Vrai" },
    { description: "Un point d'inflexion est un point où la courbe traverse sa tangente.", reponse: "Vrai" },
    { description: "Si f est convexe sur I, alors \\(f'\\) est décroissante sur I.", reponse: "Faux" },
    { description: "Toute fonction affine est à la fois convexe et concave.", reponse: "Vrai" },
    { description: "Si f est concave sur I, alors \\(f'\\) est croissante sur I.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Compléments sur la dérivation — Convexité",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 11. Reconnaître la dérivée de sqrt(ax+b) (QCM) ----------
function genDeriveeRacineFormuleQCM() {
  const a = pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
  const b = randInt(-6, 6);
  const expo = texAffine(a, b);
  const correct = `\\dfrac{${a}}{2\\sqrt{${expo}}}`;
  const distracteur1 = `\\dfrac{1}{2\\sqrt{${expo}}}`; // oublie le facteur a
  const distracteur2 = `\\dfrac{${a}}{\\sqrt{${expo}}}`; // oublie le facteur 2
  const distracteur3 = `\\dfrac{${a}}{2\\sqrt{${a}x}} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}`; // b sorti de la racine à tort
  const options = shuffle([correct, distracteur1, distracteur2, distracteur3]);
  return {
    type: "qcm",
    chapter: "Compléments sur la dérivation — Dérivée d'une composée",
    prompt: `On considère \\(f(x) = \\sqrt{${expo}}\\). Quelle est l'expression de \\(f'(x)\\) ?`,
    answer: correct,
    options,
    steps: [`f'(x) = \\dfrac{u'(x)}{2\\sqrt{u(x)}} = ${correct}`],
  };
}

// ---------- 12. Reconnaître la dérivée de (ax+b)^n (QCM) ----------
function genDeriveePuissanceFormuleQCM() {
  const n = pick([2, 3, 4]);
  let a = nonZero(-5, 5);
  while (a === n) a = nonZero(-5, 5); // évite que le distracteur "sans a" coïncide avec le distracteur "sans n"
  const b = randInt(-6, 6);
  const expo = texAffine(a, b);
  const correct = `${n} \\times ${a}(${expo})^{${n - 1}}`;
  const distracteur1 = `${n}(${expo})^{${n - 1}}`; // oublie le facteur a
  const distracteur2 = `${n} \\times ${a}(${expo})^{${n}}`; // oublie de décrémenter l'exposant
  const distracteur3 = `${a}(${expo})^{${n - 1}}`; // oublie le facteur n
  const options = shuffle([correct, distracteur1, distracteur2, distracteur3]);
  return {
    type: "qcm",
    chapter: "Compléments sur la dérivation — Dérivée d'une composée",
    prompt: `On considère \\(f(x) = (${expo})^{${n}}\\). Quelle est l'expression de \\(f'(x)\\) ?`,
    answer: correct,
    options,
    steps: [`f'(x) = n \\times u'(x) \\times u(x)^{n-1} = ${correct}`],
  };
}

// ---------- 13. Lien entre le signe de f'' et le sens de variation de f' (QCM) ----------
function genLienDeriveeSecondeVariationDeriveeQCM() {
  const positive = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Compléments sur la dérivation — Convexité",
    prompt: `Sur un intervalle I, on a \\(f''(x) ${positive ? ">" : "<"} 0\\). Que peut-on en déduire sur le sens de variation de \\(f'\\) sur I ?`,
    answer: positive ? "f' est croissante sur I" : "f' est décroissante sur I",
    options: ["f' est croissante sur I", "f' est décroissante sur I"],
    steps: [positive ? "f'' > 0 signifie que f' est croissante." : "f'' < 0 signifie que f' est décroissante."],
  };
}

// ---------- 14. Dérivée d'un produit (ax+b)e^x en 0, valeur numérique ----------
function genValeurDeriveeProduitSimpleNumeric() {
  const a = nonZero(-6, 6);
  const b = randInt(-8, 8);
  const answer = a + b;
  return {
    type: "numeric",
    chapter: "Compléments sur la dérivation — Dérivée d'un produit",
    prompt: `On considère \\(f(x) = (${texAffine(a, b)})\\mathrm{e}^{x}\\). Calcule \\(f'(0)\\).`,
    answer,
    steps: [
      `f'(x) = ${a}\\mathrm{e}^{x} + (${texAffine(a, b)})\\mathrm{e}^{x}`,
      `f'(0) = ${a} + (${texAffine(a, b)})\\big|_{x=0} = ${a} + ${b} = ${answer}`,
    ],
  };
}

// ---------- 15. Borne du domaine de dérivabilité de sqrt(ax+b), valeur numérique ----------
function genBorneDomaineDeriveeNumeric() {
  const x0 = randInt(-6, 6); // borne recherchée
  const a = nonZero(-5, 5);
  const b = -a * x0;
  return {
    type: "numeric",
    chapter: "Compléments sur la dérivation — Domaine de dérivabilité",
    prompt: `On considère \\(f(x) = \\sqrt{${texAffine(a, b)}}\\). f est dérivable là où \\(${texAffine(a, b)} > 0\\). Détermine la valeur de x pour laquelle \\(${texAffine(a, b)} = 0\\) (borne du domaine de dérivabilité).`,
    answer: x0,
    steps: [`${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = 0`, `x = ${x0}`],
  };
}

const GENERATORS = [
  genDeriveePuissanceNumeric,
  genDeriveeRacineNumeric,
  genDeriveeExponentielleAffineQCM,
  genDeriveeSecondeNumeric,
  genSigneConvexiteQCM,
  genPointInflexionNumeric,
  genNombrePointsInflexionQCM,
  genTangenteValeurNumeric,
  genPositionRelativeQCM,
  genVraiFauxConvexiteQCM,
  genDeriveeRacineFormuleQCM,
  genDeriveePuissanceFormuleQCM,
  genLienDeriveeSecondeVariationDeriveeQCM,
  genValeurDeriveeProduitSimpleNumeric,
  genBorneDomaineDeriveeNumeric,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "complements-derivation-terminale-spe",
    title: "Compléments sur la dérivation",
    description: "Dérivée d'une composée, dérivée seconde, convexité, points d'inflexion et tangentes.",
    level: "terminale-spe",
    free: false,
    order: 8,
  },
  generate,
};
