// ---------------------------------------------------------------------------
// Chapitre : Fonctions exponentielles (Terminale technologique / STMG)
// Programme 2026 : x ↦ a^x pour a > 0, prolongement continu de la suite
// géométrique (a^n), extension à ℝ via a^{-x} = 1/a^x ; sens de variation
// selon a ; allure selon a ; propriétés algébriques a^{x+y}=a^x·a^y,
// (a^x)^n = a^{xn}, a^{x-y}=a^x/a^y ; cas particulier de l'exposant 1/n pour
// le taux d'évolution moyen équivalent à n évolutions successives.
// Capacités : connaître le sens de variation de x↦k·a^x, utiliser les
// propriétés algébriques, calculer le taux d'évolution moyen.
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

// ---------- 1. Calculer une puissance a^x ----------
function genCalculerPuissanceNumeric() {
  const a = pick([2, 3, 1.5, 1.2, 0.5, 0.8]);
  const x = randInt(2, 5);
  const answer = roundTo(a ** x, 4);
  return {
    type: "numeric",
    chapter: "Fonctions exponentielles (Terminale techno) — Calcul",
    prompt: `Calcule \\(${fr(a)}^{${x}}\\) (arrondi à 0,0001 près).`,
    answer,
    tolerance: 0.001,
    steps: [{ type: "resultat", text: `${fr(a)}^{${x}} \\approx ${fr(answer)}` }],
  };
}

// ---------- 2. Exposant négatif : a^{-x} = 1/a^x ----------
function genExposantNegatifNumeric() {
  const a = pick([2, 3, 4, 5]);
  const x = randInt(1, 3);
  const answer = roundTo(1 / a ** x, 5);
  return {
    type: "numeric",
    chapter: "Fonctions exponentielles (Terminale techno) — Calcul",
    prompt: `Calcule \\(${a}^{-${x}}\\) (arrondi à 0,00001 près), en utilisant \\(a^{-x} = \\dfrac{1}{a^x}\\).`,
    answer,
    tolerance: 0.0001,
    steps: [
      { type: "calcul", text: `${a}^{-${x}} = \\dfrac{1}{${a}^{${x}}} = \\dfrac{1}{${a ** x}}` },
      { type: "resultat", text: `${a}^{-${x}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 3. Sens de variation de x↦k·a^x ----------
function genSensVariationQCM() {
  const a = pick([2, 3, 1.5, 0.5, 0.2, 0.8, 1.2]);
  const k = nonZero(-5, 5);
  const croissanceExp = a > 1;
  const answer = k > 0 ? (croissanceExp ? "croissante" : "décroissante") : croissanceExp ? "décroissante" : "croissante";
  return {
    type: "qcm",
    chapter: "Fonctions exponentielles (Terminale techno) — Sens de variation",
    prompt: `On considère la fonction \\(x \\mapsto ${k}\\times ${fr(a)}^x\\) sur ℝ. Quel est son sens de variation ?`,
    answer,
    options: ["croissante", "décroissante"],
    steps: [
      { type: "regle", text: `\\text{Comme } a = ${fr(a)} ${a > 1 ? ">" : "<"} 1\\text{, } x\\mapsto ${fr(a)}^x \\text{ est ${croissanceExp ? "croissante" : "décroissante"}.}` },
      { type: "regle", text: k > 0 ? `\\text{Multiplier par } k=${k} > 0 \\text{ ne change pas le sens de variation.}` : `\\text{Multiplier par } k=${k} < 0 \\text{ inverse le sens de variation.}` },
    ],
  };
}

// ---------- 4. Associer une allure de courbe à une base a ----------
function genAllureCourbeQCM() {
  const a = pick([2, 3, 0.5, 0.3]);
  const fn = (x) => a ** x;
  const croissante = a > 1;
  const answer = croissante ? "Courbe croissante, passant par (0 ; 1)" : "Courbe décroissante, passant par (0 ; 1)";
  return {
    type: "qcm",
    chapter: "Fonctions exponentielles (Terminale techno) — Allure",
    prompt: `On donne ci-dessous la courbe de \\(x \\mapsto ${fr(a)}^x\\). Quelle affirmation décrit correctement cette courbe ?`,
    answer,
    options: ["Courbe croissante, passant par (0 ; 1)", "Courbe décroissante, passant par (0 ; 1)"],
    steps: [{ type: "regle", text: `\\text{Comme } a=${fr(a)} ${a > 1 ? ">" : "<"} 1\\text{, la courbe est ${croissante ? "croissante" : "décroissante"}, et passe toujours par } (0;1) \\text{ car } a^0=1.` }],
    graph: { xMin: -3, xMax: 3, yMin: -0.5, yMax: Math.max(2, fn(3), fn(-3)) + 1, curves: [{ fn, label: "f" }], points: [{ x: 0, y: 1, label: "(0;1)" }] },
  };
}

// ---------- 5. Propriété algébrique a^{x+y} = a^x × a^y ----------
function genProprieteSommeNumeric() {
  const a = pick([2, 3, 1.5]);
  const x = randInt(1, 3);
  const y = randInt(1, 3);
  const answer = roundTo(a ** (x + y), 3);
  return {
    type: "numeric",
    chapter: "Fonctions exponentielles (Terminale techno) — Propriétés algébriques",
    prompt: `Sachant que \\(${fr(a)}^{${x}} \\approx ${fr(roundTo(a ** x, 3))}\\) et \\(${fr(a)}^{${y}} \\approx ${fr(roundTo(a ** y, 3))}\\), calcule \\(${fr(a)}^{${x + y}}\\) en utilisant \\(a^{x+y}=a^x \\times a^y\\) (arrondi au millième).`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "calcul", text: `${fr(a)}^{${x + y}} = ${fr(a)}^{${x}} \\times ${fr(a)}^{${y}} \\approx ${fr(roundTo(a ** x, 3))} \\times ${fr(roundTo(a ** y, 3))}` },
      { type: "resultat", text: `${fr(a)}^{${x + y}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 6. Propriété algébrique (a^x)^n = a^{xn} ----------
function genProprietePuissanceNumeric() {
  const a = pick([2, 3]);
  const x = randInt(1, 2);
  const n = randInt(2, 3);
  const answer = roundTo(a ** (x * n), 3);
  return {
    type: "numeric",
    chapter: "Fonctions exponentielles (Terminale techno) — Propriétés algébriques",
    prompt: `Simplifie puis calcule \\((${fr(a)}^{${x}})^{${n}}\\) en utilisant \\((a^x)^n = a^{xn}\\).`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "calcul", text: `(${fr(a)}^{${x}})^{${n}} = ${fr(a)}^{${x * n}}` },
      { type: "resultat", text: `= ${fr(answer)}` },
    ],
  };
}

// ---------- 7. Taux d'évolution moyen équivalent à n évolutions successives ----------
function genTauxEvolutionMoyenNumeric() {
  const p = pick([10, 15, 20, 25, 30, 33.1, 40]);
  const n = randInt(2, 5);
  const cmGlobal = roundTo(1 + p / 100, 4);
  const cmMoyen = roundTo(cmGlobal ** (1 / n), 4);
  const tauxMoyen = roundTo((cmMoyen - 1) * 100, 2);
  return {
    type: "numeric",
    chapter: "Fonctions exponentielles (Terminale techno) — Taux d'évolution moyen",
    prompt: `Une grandeur a augmenté de ${fr(p)} % au total sur ${n} années. Calcule le taux d'évolution moyen annuel équivalent (en %, arrondi au centième), sachant que \\(CM_{moyen} = (CM_{global})^{1/${n}}\\).`,
    answer: tauxMoyen,
    tolerance: 0.05,
    steps: [
      { type: "donnee", text: `CM_{global} = 1 + \\dfrac{${fr(p)}}{100} = ${fr(cmGlobal)}` },
      { type: "calcul", text: `CM_{moyen} = ${fr(cmGlobal)}^{1/${n}} \\approx ${fr(cmMoyen)}` },
      { type: "resultat", text: `\\text{Taux moyen} \\approx ${fr(tauxMoyen)} \\%` },
    ],
  };
}

// ---------- 8. Vérifier un taux d'évolution moyen (calcul inverse) ----------
function genVerifierTauxMoyenNumeric() {
  const tauxMoyen = pick([2, 5, 10]);
  const n = randInt(2, 4);
  const cmMoyen = roundTo(1 + tauxMoyen / 100, 4);
  const cmGlobal = roundTo(cmMoyen ** n, 4);
  const tauxGlobal = roundTo((cmGlobal - 1) * 100, 2);
  return {
    type: "numeric",
    chapter: "Fonctions exponentielles (Terminale techno) — Taux d'évolution moyen",
    prompt: `Une grandeur évolue de ${fr(tauxMoyen)} % chaque année pendant ${n} ans. Calcule le taux d'évolution global sur les ${n} ans (en %, arrondi au centième).`,
    answer: tauxGlobal,
    tolerance: 0.1,
    steps: [
      { type: "calcul", text: `CM_{global} = (1+\\dfrac{${fr(tauxMoyen)}}{100})^{${n}} = ${fr(cmMoyen)}^{${n}} \\approx ${fr(cmGlobal)}` },
      { type: "resultat", text: `\\text{Taux global} \\approx ${fr(tauxGlobal)} \\%` },
    ],
  };
}

// ---------- 9. Comparer deux fonctions exponentielles selon leur base ----------
function genComparerBasesQCM() {
  const a1 = pick([1.5, 2, 3]);
  const a2 = pick([0.3, 0.5, 0.8]);
  return {
    type: "qcm",
    chapter: "Fonctions exponentielles (Terminale techno) — Sens de variation",
    prompt: `On compare \\(f(x) = ${fr(a1)}^x\\) et \\(g(x) = ${fr(a2)}^x\\). Laquelle de ces fonctions est croissante ?`,
    answer: "f (car sa base est supérieure à 1)",
    options: ["f (car sa base est supérieure à 1)", "g (car sa base est supérieure à 1)"],
    steps: [{ type: "regle", text: `f \\text{ a pour base } ${fr(a1)} > 1 \\text{ (croissante) ; } g \\text{ a pour base } ${fr(a2)} < 1 \\text{ (décroissante).}` }],
  };
}

const GENERATORS = [
  genCalculerPuissanceNumeric,
  genExposantNegatifNumeric,
  genSensVariationQCM,
  genAllureCourbeQCM,
  genProprieteSommeNumeric,
  genProprietePuissanceNumeric,
  genTauxEvolutionMoyenNumeric,
  genVerifierTauxMoyenNumeric,
  genComparerBasesQCM,
];

const DIFFICULTY = {
  genCalculerPuissanceNumeric: "facile",
  genSensVariationQCM: "facile",
  genComparerBasesQCM: "facile",
  genExposantNegatifNumeric: "standard",
  genAllureCourbeQCM: "standard",
  genProprieteSommeNumeric: "standard",
  genProprietePuissanceNumeric: "standard",
  genVerifierTauxMoyenNumeric: "expert",
  genTauxEvolutionMoyenNumeric: "expert",
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
    id: "fonctions-exponentielles-terminale-techno",
    title: "Fonctions exponentielles",
    description: "x↦a^x pour a>0, sens de variation et allure selon a, propriétés algébriques, taux d'évolution moyen.",
    pourquoi: "x ↦ a^x modélise les évolutions en pourcentage constant (intérêts, inflation, décroissance d'un stock) qu'on retrouve partout en gestion et en économie.",
    level: "terminale-techno",
    order: 3,
  },
  generate,
};
