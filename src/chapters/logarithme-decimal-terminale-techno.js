// ---------------------------------------------------------------------------
// Chapitre : Fonction logarithme décimal (Terminale technologique / STMG)
// Programme 2026 : log(b) défini comme l'unique solution de 10^x = b (pour
// b > 0), noté log ; sens de variation (croissante) ; propriétés algébriques
// log(ab)=log(a)+log(b), log(a/b)=log(a)-log(b), log(a^n)=n·log(a).
// Capacités : utiliser log pour résoudre une équation ou inéquation du type
// a^x=b ou x^a=b, utiliser les propriétés algébriques. Commentaire du
// programme : log(x) donne l'ordre de grandeur et, pour un entier, le
// nombre de chiffres de son écriture décimale.
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

// ---------- 1. Valeurs immédiates de log ----------
function genValeurImmediateNumeric() {
  const cas = pick([
    { b: "1", log: 0 },
    { b: "10", log: 1 },
    { b: "100", log: 2 },
    { b: "1\\,000", log: 3 },
    { b: "10\\,000", log: 4 },
    { b: "0{,}1", log: -1 },
    { b: "0{,}01", log: -2 },
  ]);
  return {
    type: "numeric",
    chapter: "Logarithme décimal (Terminale techno) — Valeurs immédiates",
    prompt: `Calcule \\(\\log(${cas.b})\\) (valeur exacte, sans calculatrice).`,
    answer: cas.log,
    steps: [{ type: "resultat", text: `\\log(${cas.b}) = ${cas.log}` }],
  };
}

// ---------- 2. Résoudre 10^x = b ----------
function genResoudre10PuissanceNumeric() {
  const exp = randInt(-2, 5);
  const b = 10 ** exp;
  return {
    type: "numeric",
    chapter: "Logarithme décimal (Terminale techno) — Résolution",
    prompt: `Résous l'équation \\(10^x = ${b < 1 ? fr(b) : b}\\).`,
    answer: exp,
    steps: [
      { type: "regle", text: "Par définition, log(b) est l'unique solution de l'équation 10^x = b." },
      { type: "resultat", text: `x = \\log(${b < 1 ? fr(b) : b}) = ${exp}` },
    ],
  };
}

// ---------- 3. Approximation de log(b) à la calculatrice ----------
function genApproximationLogNumeric() {
  const b = randInt(2, 5000);
  const answer = roundTo(Math.log10(b), 3);
  return {
    type: "numeric",
    chapter: "Logarithme décimal (Terminale techno) — Calcul approché",
    prompt: `À l'aide de la calculatrice, donne une valeur approchée de \\(\\log(${b})\\) (arrondi au millième).`,
    answer,
    tolerance: 0.002,
    steps: [{ type: "resultat", text: `\\log(${b}) \\approx ${fr(answer)}` }],
  };
}

// ---------- 4. Propriété algébrique log(ab) = log(a) + log(b) ----------
function genProprieteProduitNumeric() {
  const a = randInt(2, 50);
  const b = randInt(2, 50);
  const logA = roundTo(Math.log10(a), 3);
  const logB = roundTo(Math.log10(b), 3);
  const answer = roundTo(Math.log10(a * b), 3);
  return {
    type: "numeric",
    chapter: "Logarithme décimal (Terminale techno) — Propriétés algébriques",
    prompt: `Sachant que \\(\\log(${a}) \\approx ${fr(logA)}\\) et \\(\\log(${b}) \\approx ${fr(logB)}\\), calcule \\(\\log(${a * b})\\) en utilisant \\(\\log(ab) = \\log(a) + \\log(b)\\).`,
    answer,
    tolerance: 0.005,
    steps: [
      { type: "calcul", text: `\\log(${a * b}) = \\log(${a}) + \\log(${b}) \\approx ${fr(logA)} + ${fr(logB)}` },
      { type: "resultat", text: `\\log(${a * b}) \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 5. Propriété algébrique log(a^n) = n·log(a) ----------
function genProprietePuissanceNumeric() {
  const a = randInt(2, 20);
  const n = randInt(2, 4);
  const logA = roundTo(Math.log10(a), 3);
  const answer = roundTo(n * logA, 3);
  return {
    type: "numeric",
    chapter: "Logarithme décimal (Terminale techno) — Propriétés algébriques",
    prompt: `Sachant que \\(\\log(${a}) \\approx ${fr(logA)}\\), calcule \\(\\log(${a}^{${n}})\\) en utilisant \\(\\log(a^n) = n \\times \\log(a)\\).`,
    answer,
    tolerance: 0.005,
    steps: [
      { type: "calcul", text: `\\log(${a}^{${n}}) = ${n} \\times \\log(${a}) \\approx ${n} \\times ${fr(logA)}` },
      { type: "resultat", text: `\\log(${a}^{${n}}) \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 6. Résoudre a^x = b à l'aide du log ----------
function genResoudreAPuissanceXNumeric() {
  const a = pick([1.05, 1.1, 1.2, 2, 3]);
  const x = randInt(2, 6);
  const b = roundTo(a ** x, 4);
  const answer = roundTo(Math.log10(b) / Math.log10(a), 2);
  return {
    type: "numeric",
    chapter: "Logarithme décimal (Terminale techno) — Résolution",
    prompt: `Résous l'équation \\(${fr(a)}^x = ${fr(b)}\\) en utilisant \\(x = \\dfrac{\\log(b)}{\\log(a)}\\) (arrondi au centième).`,
    answer,
    tolerance: 0.05,
    steps: [
      { type: "calcul", text: `x = \\dfrac{\\log(${fr(b)})}{\\log(${fr(a)})}` },
      { type: "resultat", text: `x \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 7. Sens de variation de la fonction log ----------
function genSensVariationLogQCM() {
  const a = randInt(2, 50);
  const b = a + nonZero(1, 30);
  return {
    type: "qcm",
    chapter: "Logarithme décimal (Terminale techno) — Sens de variation",
    prompt: `Sachant que ${a} < ${b}, que peut-on dire de \\(\\log(${a})\\) et \\(\\log(${b})\\) ?`,
    answer: `\\(\\log(${a}) < \\log(${b})\\)`,
    options: [`\\(\\log(${a}) < \\log(${b})\\)`, `\\(\\log(${a}) > \\log(${b})\\)`, `\\(\\log(${a}) = \\log(${b})\\)`],
    steps: [{ type: "regle", text: `\\text{La fonction log est croissante sur } ]0;+\\infty[\\text{, donc } ${a} < ${b} \\Rightarrow \\log(${a}) < \\log(${b}).` }],
  };
}

// ---------- 8. Ordre de grandeur / nombre de chiffres d'un entier ----------
function genNombreDeChiffresQCM() {
  const chiffres = randInt(3, 9);
  const n = randInt(10 ** (chiffres - 1), 10 ** chiffres - 1);
  const logN = Math.log10(n);
  return {
    type: "numeric",
    chapter: "Logarithme décimal (Terminale techno) — Ordre de grandeur",
    prompt: `On admet que pour un entier naturel n non nul, le nombre de chiffres de son écriture décimale est \\(E(\\log(n)) + 1\\) (partie entière). Sachant que \\(\\log(${n}) \\approx ${fr(roundTo(logN, 3))}\\), combien de chiffres comporte l'écriture décimale de ${n} ?`,
    answer: chiffres,
    steps: [
      { type: "calcul", text: `E(\\log(${n})) + 1 = E(${fr(roundTo(logN, 3))}) + 1 = ${Math.floor(logN)} + 1` },
      { type: "resultat", text: `${chiffres} \\text{ chiffres}` },
    ],
  };
}

// ---------- 9. Résoudre x^a = b (racine a-ième via log) ----------
function genResoudreXPuissanceANumeric() {
  const a = pick([2, 3, 4]);
  const x = randInt(2, 10);
  const b = x ** a;
  const answer = roundTo(10 ** (Math.log10(b) / a), 2);
  return {
    type: "numeric",
    chapter: "Logarithme décimal (Terminale techno) — Résolution",
    prompt: `Résous \\(x^{${a}} = ${b}\\) (avec \\(x > 0\\)) en utilisant \\(x = 10^{\\log(b)/${a}}\\) (arrondi au centième).`,
    answer,
    tolerance: 0.05,
    steps: [
      { type: "calcul", text: `x = 10^{\\log(${b})/${a}}` },
      { type: "resultat", text: `x \\approx ${fr(answer)}` },
    ],
  };
}

const GENERATORS = [
  genValeurImmediateNumeric,
  genResoudre10PuissanceNumeric,
  genApproximationLogNumeric,
  genProprieteProduitNumeric,
  genProprietePuissanceNumeric,
  genResoudreAPuissanceXNumeric,
  genSensVariationLogQCM,
  genNombreDeChiffresQCM,
  genResoudreXPuissanceANumeric,
];

const DIFFICULTY = {
  genValeurImmediateNumeric: "facile",
  genResoudre10PuissanceNumeric: "facile",
  genSensVariationLogQCM: "facile",
  genApproximationLogNumeric: "standard",
  genProprieteProduitNumeric: "standard",
  genProprietePuissanceNumeric: "standard",
  genNombreDeChiffresQCM: "standard",
  genResoudreAPuissanceXNumeric: "expert",
  genResoudreXPuissanceANumeric: "expert",
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
    id: "logarithme-decimal-terminale-techno",
    title: "Fonction logarithme décimal",
    description: "Définition via 10^x = b, sens de variation, propriétés algébriques, résolution d'équations, ordre de grandeur.",
    pourquoi: "Le logarithme décimal sert à mesurer des échelles qui varient énormément : le pH, l'intensité sonore (décibels), la magnitude d'un séisme.",
    level: "terminale-techno",
    order: 4,
  },
  generate,
};
