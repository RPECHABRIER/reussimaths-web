// ---------------------------------------------------------------------------
// Chapitre : Primitives, équations différentielles (Terminale Spé) — abonnement.
// Primitives usuelles (polynômes, e^u, cos(u), sin(u)), détermination de la
// constante à partir d'une condition initiale, équations différentielles
// y'=ay et y'=ay+b.
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

// ---------- 1. Constante d'une primitive d'un polynôme (numeric) ----------
function genPrimitivePolynomeConstanteNumeric() {
  const a = nonZero(-5, 5); // coefficient de x^2 dans F
  const q = randInt(-6, 6); // coefficient de x dans F (et dans f)
  const k = randInt(-9, 9); // constante recherchée
  const x0 = randInt(-4, 4);
  const v0 = a * x0 * x0 + q * x0 + k;
  const p = 2 * a;
  return {
    type: "numeric",
    chapter: "Primitives, équations différentielles — Primitives",
    prompt: `On considère \\(f(x) = ${p}x ${q >= 0 ? "+" : "-"} ${Math.abs(q)}\\). Les primitives de f sont les fonctions \\(F(x) = ${a}x^2 ${q >= 0 ? "+" : "-"} ${Math.abs(q)}x + k\\), où k est une constante réelle. Sachant que \\(F(${x0}) = ${v0}\\), détermine k.`,
    answer: k,
    steps: [
      { type: "regle", text: "Substituer x = x₀ dans F(x) permet de déterminer k grâce à la valeur connue F(x₀)." },
      { type: "calcul", text: `${a} \\times ${x0}^2 ${q >= 0 ? "+" : "-"} ${Math.abs(q)} \\times ${x0} + k = ${v0}` },
      { type: "resultat", text: `k = ${k}` },
    ],
  };
}

// ---------- 2. Coefficient d'une primitive de c·e^(ax+b) (numeric) ----------
function genPrimitiveExpCompositionCoefficientNumeric() {
  const a = nonZero(-6, 6);
  const b = randInt(-6, 6);
  const m = nonZero(-6, 6); // coefficient recherché dans la primitive
  const c = m * a;
  const expo = texAffine(a, b);
  return {
    type: "numeric",
    chapter: "Primitives, équations différentielles — Primitives",
    prompt: `On considère \\(f(x) = ${c}\\mathrm{e}^{${expo}}\\). Une primitive de f est de la forme \\(F(x) = k\\mathrm{e}^{${expo}}\\). Détermine k.`,
    answer: m,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : une primitive de e^(ax+b) est (1/a)·e^(ax+b)." },
      { type: "resultat", text: `k = \\dfrac{${c}}{${a}} = ${m}` },
    ],
  };
}

// ---------- 3. Primitive de c·x^n (QCM) ----------
function genPrimitivePuissanceQCM() {
  const n = randInt(1, 6);
  const m = nonZero(-6, 6); // coefficient recherché dans la primitive
  const c = m * (n + 1);
  const correct = `${m}x^{${n + 1}}`;
  const options = shuffle([correct, `${m}x^{${n}}`, `${c}x^{${n + 1}}`, `${m}x^{${n + 2}}`]);
  return {
    type: "qcm",
    chapter: "Primitives, équations différentielles — Primitives",
    prompt: `On considère \\(f(x) = ${c}x^{${n}}\\). Quelle est une primitive de f ?`,
    answer: correct,
    options,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : une primitive de x^n est x^(n+1)/(n+1)." },
      { type: "resultat", text: `F(x) = \\dfrac{${c}}{${n + 1}}x^{${n + 1}} = ${correct}` },
    ],
  };
}

// ---------- 4. Primitive de c·e^(ax+b) (QCM) ----------
function genPrimitiveExponentielleAffineQCM() {
  let a = nonZero(-6, 6);
  if (a === 1 || a === -1) a = 2; // évite que "c" (=m×a) coïncide avec m ou -m quand a=±1
  const b = randInt(-6, 6);
  const m = nonZero(-6, 6);
  const c = m * a;
  const expo = texAffine(a, b);
  const correct = `${m}\\mathrm{e}^{${expo}}`;
  const options = shuffle([correct, `${c}\\mathrm{e}^{${expo}}`, `${m}x\\mathrm{e}^{${expo}}`, `${-m}\\mathrm{e}^{${expo}}`]);
  return {
    type: "qcm",
    chapter: "Primitives, équations différentielles — Primitives",
    prompt: `On considère \\(f(x) = ${c}\\mathrm{e}^{${expo}}\\). Quelle est une primitive de f ?`,
    answer: correct,
    options,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : une primitive de e^(ax+b) est (1/a)·e^(ax+b)." },
      { type: "resultat", text: `F(x) = \\dfrac{${c}}{${a}}\\mathrm{e}^{${expo}} = ${correct}` },
    ],
  };
}

// ---------- 5. Primitive de c·cos(ax+b) (QCM) ----------
function genPrimitiveCosAffineQCM() {
  let a = nonZero(-6, 6);
  if (a === 1 || a === -1) a = 2;
  const b = randInt(-6, 6);
  const m = nonZero(-6, 6);
  const c = m * a;
  const expo = texAffine(a, b);
  const correct = `${m}\\sin(${expo})`;
  const options = shuffle([correct, `${c}\\sin(${expo})`, `${-m}\\sin(${expo})`, `${m}\\cos(${expo})`]);
  return {
    type: "qcm",
    chapter: "Primitives, équations différentielles — Primitives",
    prompt: `On considère \\(f(x) = ${c}\\cos(${expo})\\). Quelle est une primitive de f ?`,
    answer: correct,
    options,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : une primitive de cos(ax+b) est (1/a)·sin(ax+b)." },
      { type: "resultat", text: `F(x) = \\dfrac{${c}}{${a}}\\sin(${expo}) = ${correct}` },
    ],
  };
}

// ---------- 6. Primitive de c·sin(ax+b) (QCM) ----------
function genPrimitiveSinAffineQCM() {
  let a = nonZero(-6, 6);
  if (a === 1 || a === -1) a = 2;
  const b = randInt(-6, 6);
  const m = nonZero(-6, 6);
  const c = m * a;
  const expo = texAffine(a, b);
  const correct = `${-m}\\cos(${expo})`;
  const options = shuffle([correct, `${m}\\cos(${expo})`, `${-c}\\cos(${expo})`, `${-m}\\sin(${expo})`]);
  return {
    type: "qcm",
    chapter: "Primitives, équations différentielles — Primitives",
    prompt: `On considère \\(f(x) = ${c}\\sin(${expo})\\). Quelle est une primitive de f ?`,
    answer: correct,
    options,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : une primitive de sin(ax+b) est -(1/a)·cos(ax+b)." },
      { type: "resultat", text: `F(x) = -\\dfrac{${c}}{${a}}\\cos(${expo}) = ${correct}` },
    ],
  };
}

// ---------- 7. Solutions de l'équation homogène y'=ay (QCM) ----------
function genEquationDiffHomogeneQCM() {
  const a = nonZero(-6, 6);
  const correct = `C\\mathrm{e}^{${a}x}`;
  const options = shuffle([correct, `C\\mathrm{e}^{${-a}x}`, `Ca\\mathrm{e}^{x}`, `\\dfrac{C}{a}\\mathrm{e}^{${a}x}`]);
  return {
    type: "qcm",
    chapter: "Primitives, équations différentielles — Équations différentielles",
    prompt: `Quelles sont les solutions de l'équation différentielle \\(y' = ${a}y\\) (avec C un réel quelconque) ?`,
    answer: correct,
    options,
    steps: [{ type: "regle", text: `\\text{Les solutions de } y'=ay \\text{ sont les fonctions } x \\mapsto ${correct}` }],
  };
}

// ---------- 8. Solutions de y'=ay+b (QCM) ----------
function genEquationDiffAvecSecondMembreQCM() {
  const a = nonZero(-6, 6);
  const q = nonZero(-9, 9); // q = -b/a
  const b = -a * q;
  const correct = `C\\mathrm{e}^{${a}x} ${q >= 0 ? "+" : "-"} ${Math.abs(q)}`;
  const options = shuffle([
    correct,
    `C\\mathrm{e}^{${a}x} ${q >= 0 ? "-" : "+"} ${Math.abs(q)}`,
    `C\\mathrm{e}^{${-a}x} ${q >= 0 ? "+" : "-"} ${Math.abs(q)}`,
    `C\\mathrm{e}^{${a}x}`,
  ]);
  return {
    type: "qcm",
    chapter: "Primitives, équations différentielles — Équations différentielles",
    prompt: `On considère l'équation \\((E) : y' = ${a}y ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Quelles sont les solutions de (E) (avec C un réel quelconque) ?`,
    answer: correct,
    options,
    steps: [{ type: "regle", text: `\\text{Les solutions de } y'=ay+b \\text{ sont les fonctions } x \\mapsto C\\mathrm{e}^{ax} - \\dfrac{b}{a} = ${correct}` }],
  };
}

// ---------- 9. Déterminer C pour y'=ay (numeric) ----------
function genDeterminerConstanteHomogeneNumeric() {
  const a = nonZero(-6, 6);
  const v0 = randInt(-9, 9);
  return {
    type: "numeric",
    chapter: "Primitives, équations différentielles — Équations différentielles",
    prompt: `Les solutions de \\(y' = ${a}y\\) sont les fonctions \\(x \\mapsto C\\mathrm{e}^{${a}x}\\), où C est un réel. Sachant que la solution F vérifie \\(F(0) = ${v0}\\), détermine C.`,
    answer: v0,
    steps: [
      { type: "regle", text: "e^0 = 1, donc F(0) = C." },
      { type: "resultat", text: `F(0) = C\\mathrm{e}^{0} = C = ${v0}` },
    ],
  };
}

// ---------- 10. Déterminer C pour y'=ay+b (numeric) ----------
function genDeterminerConstanteAvecSecondMembreNumeric() {
  const a = nonZero(-6, 6);
  const q = nonZero(-9, 9);
  const b = -a * q;
  const C = randInt(-9, 9);
  const v0 = C + q;
  return {
    type: "numeric",
    chapter: "Primitives, équations différentielles — Équations différentielles",
    prompt: `Les solutions de \\((E) : y' = ${a}y ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\) sont les fonctions \\(x \\mapsto C\\mathrm{e}^{${a}x} ${q >= 0 ? "+" : "-"} ${Math.abs(q)}\\), où C est un réel. Sachant que la solution F vérifie \\(F(0) = ${v0}\\), détermine C.`,
    answer: C,
    steps: [
      { type: "regle", text: "e^0 = 1, donc F(0) = C + q." },
      { type: "calcul", text: `F(0) = C ${q >= 0 ? "+" : "-"} ${Math.abs(q)} = ${v0}` },
      { type: "resultat", text: `C = ${C}` },
    ],
  };
}

// ---------- 11. Vrai ou faux sur les équations différentielles (QCM) ----------
function genVraiFauxEquationDiffQCM() {
  const cas = pick([
    { description: "L'équation \\(y' = ay\\) admet une infinité de solutions sur \\(\\mathbb{R}\\).", reponse: "Vrai", explication: "C'est vrai : chaque valeur de la constante C donne une solution différente x ↦ Ce^(ax), il y en a donc une infinité." },
    { description: "Si F et G sont deux solutions de \\(y' = ay+b\\), alors F−G est solution de l'équation homogène \\(y' = ay\\).", reponse: "Vrai", explication: "C'est vrai : (F-G)' = F'-G' = (aF+b) - (aG+b) = a(F-G), donc F-G vérifie bien y'=ay." },
    { description: "La fonction nulle est solution de l'équation homogène \\(y' = ay\\).", reponse: "Vrai", explication: "C'est vrai : la fonction nulle a pour dérivée 0, et a×0=0, donc l'égalité y'=ay est vérifiée." },
    { description: "Une équation \\(y' = ay+b\\), associée à une condition initiale, admet une unique solution.", reponse: "Vrai", explication: "C'est vrai : la condition initiale permet de déterminer une unique valeur de la constante C parmi toutes les solutions." },
    { description: "L'équation \\(y' = ay\\) admet une seule solution sur \\(\\mathbb{R}\\).", reponse: "Faux", explication: "C'est faux : sans condition initiale, l'équation admet une infinité de solutions, une pour chaque valeur de la constante C." },
  ]);
  return {
    type: "qcm",
    chapter: "Primitives, équations différentielles — Équations différentielles",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 12. Identifier le coefficient a dans y'=ay+b (numeric) ----------
function genIdentifierCoefficientANumeric() {
  const p = nonZero(-6, 6); // coefficient de y dans "y' + p y = q"
  const q = randInt(-9, 9);
  const a = -p;
  return {
    type: "numeric",
    chapter: "Primitives, équations différentielles — Équations différentielles",
    prompt: `On écrit l'équation \\(y' ${p >= 0 ? "+" : "-"} ${Math.abs(p)}y = ${q}\\) sous la forme \\(y' = ay + b\\). Donne la valeur de a.`,
    answer: a,
    steps: [
      { type: "regle", text: "On isole y' pour identifier a et b dans la forme y' = ay + b." },
      { type: "calcul", text: `y' = ${a}y + ${q}` },
      { type: "resultat", text: `a = ${a}` },
    ],
  };
}

// ---------- 13. Nombre de primitives d'une fonction continue (QCM) ----------
function genNombrePrimitivesQCM() {
  return {
    type: "qcm",
    chapter: "Primitives, équations différentielles — Primitives",
    prompt: `Combien de primitives possède une fonction continue sur un intervalle I ?`,
    answer: "Une infinité",
    options: ["Une seule", "Aucune", "Une infinité"],
    steps: [{ type: "regle", text: "Deux primitives d'une même fonction diffèrent toujours d'une constante réelle : il y en a une infinité." }],
  };
}

// ---------- 14. Vrai ou faux sur les primitives (QCM) ----------
function genVraiFauxPrimitivesQCM() {
  const cas = pick([
    { description: "Deux primitives d'une même fonction sur un intervalle diffèrent d'une constante.", reponse: "Vrai", explication: "C'est vrai : si F et G sont deux primitives de f, alors (F-G)' = f-f = 0, donc F-G est constante sur l'intervalle." },
    { description: "Si F est une primitive de f, alors \\(F' = f\\).", reponse: "Vrai", explication: "C'est vrai : c'est la définition même d'une primitive." },
    { description: "Une fonction continue sur un intervalle admet toujours des primitives.", reponse: "Vrai", explication: "C'est vrai : c'est un théorème du cours, toute fonction continue sur un intervalle admet des primitives sur cet intervalle." },
    { description: "Il existe une seule primitive pour chaque fonction continue.", reponse: "Faux", explication: "C'est faux : il en existe une infinité, une pour chaque valeur de la constante ajoutée." },
    { description: "Si F est une primitive de f, alors \\(F + 5\\) est aussi une primitive de f.", reponse: "Vrai", explication: "C'est vrai : (F+5)' = F' = f, donc F+5 est bien une primitive de f." },
  ]);
  return {
    type: "qcm",
    chapter: "Primitives, équations différentielles — Primitives",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 15. Évaluer une solution en 0 (numeric) ----------
function genValeurSolutionNumeric() {
  const a = nonZero(-6, 6);
  const C = randInt(-9, 9);
  const q = randInt(-9, 9);
  const answer = C + q;
  return {
    type: "numeric",
    chapter: "Primitives, équations différentielles — Équations différentielles",
    prompt: `La solution d'une équation différentielle est \\(y(x) = ${C}\\mathrm{e}^{${a}x} ${q >= 0 ? "+" : "-"} ${Math.abs(q)}\\). Calcule \\(y(0)\\).`,
    answer,
    steps: [
      { type: "regle", text: "e^0 = 1." },
      { type: "resultat", text: `y(0) = ${C} \\times \\mathrm{e}^{0} ${q >= 0 ? "+" : "-"} ${Math.abs(q)} = ${C} ${q >= 0 ? "+" : "-"} ${Math.abs(q)} = ${answer}` },
    ],
  };
}

const GENERATORS = [
  genPrimitivePolynomeConstanteNumeric,
  genPrimitiveExpCompositionCoefficientNumeric,
  genPrimitivePuissanceQCM,
  genPrimitiveExponentielleAffineQCM,
  genPrimitiveCosAffineQCM,
  genPrimitiveSinAffineQCM,
  genEquationDiffHomogeneQCM,
  genEquationDiffAvecSecondMembreQCM,
  genDeterminerConstanteHomogeneNumeric,
  genDeterminerConstanteAvecSecondMembreNumeric,
  genVraiFauxEquationDiffQCM,
  genIdentifierCoefficientANumeric,
  genNombrePrimitivesQCM,
  genVraiFauxPrimitivesQCM,
  genValeurSolutionNumeric,
];

const DIFFICULTY = {
  genPrimitivePolynomeConstanteNumeric: "facile",
  genPrimitivePuissanceQCM: "facile",
  genIdentifierCoefficientANumeric: "facile",
  genNombrePrimitivesQCM: "facile",
  genPrimitiveExponentielleAffineQCM: "standard",
  genPrimitiveCosAffineQCM: "standard",
  genPrimitiveSinAffineQCM: "standard",
  genEquationDiffHomogeneQCM: "standard",
  genDeterminerConstanteHomogeneNumeric: "standard",
  genVraiFauxEquationDiffQCM: "standard",
  genVraiFauxPrimitivesQCM: "standard",
  genPrimitiveExpCompositionCoefficientNumeric: "expert",
  genEquationDiffAvecSecondMembreQCM: "expert",
  genDeterminerConstanteAvecSecondMembreNumeric: "expert",
  genValeurSolutionNumeric: "expert",
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
    id: "primitives-equations-differentielles-terminale-spe",
    title: "Primitives, équations différentielles",
    description: "Primitives usuelles, détermination de la constante, équations différentielles y'=ay et y'=ay+b.",
    pourquoi: "Les équations différentielles décrivent comment une quantité évolue selon sa propre valeur : refroidissement d'un objet, désintégration radioactive, croissance d'une population.",
    level: "terminale-spe",
    free: false,
    order: 11,
    cours: {
      mindMap: {
        title: "Primitives, équations différentielles",
        branches: [
          {
            title: "Primitives usuelles",
            items: [
              "Une primitive F de f vérifie \\(F'=f\\) ; il en existe une infinité, qui diffèrent toutes d'une constante.",
            ],
            formula: "\\(\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1}+k,\\quad \\int e^{ax+b}\\,dx = \\dfrac{1}{a}e^{ax+b}+k\\)",
          },
          {
            title: "Déterminer la constante",
            items: [
              "Une condition initiale (une valeur connue de F) permet de fixer la constante k parmi toutes les primitives possibles.",
              "Piège classique : chercher LA primitive sans utiliser de condition — il en existe une infinité tant qu'aucune valeur n'est fixée.",
            ],
          },
          {
            title: "Équation différentielle y'=ay",
            items: [
              "Les solutions sont exactement les fonctions \\(x \\mapsto Ce^{ax}\\) (C constante réelle quelconque).",
            ],
            formula: "\\(y'=ay \\iff y(x) = Ce^{ax}\\)",
          },
          {
            title: "Équation différentielle y'=ay+b",
            items: [
              "On cherche d'abord la solution constante \\(y=-\\frac{b}{a}\\), puis on ajoute la solution générale de \\(y'=ay\\).",
            ],
            formula: "\\(y'=ay+b \\iff y(x) = Ce^{ax}-\\dfrac{b}{a}\\)",
          },
        ],
      },
    },
  },
  generate,
};
