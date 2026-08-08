// ---------------------------------------------------------------------------
// Chapitre : Fonction exponentielle (Première Spé)
// Ce fichier ne contient QUE du contenu (générateurs d'exercices + métadonnées).
// L'affichage (mode Classique/Jeu, pavé numérique, QCM, aide progressive) est
// géré par le composant générique <ChapterRunner /> pour tous les chapitres.
//
// Convention LaTeX : tout passage mathématique est entouré de \( ... \)
// (rendu ensuite en jolie notation par le composant <MathText />, voir
// src/components/MathText.jsx). Le reste du texte reste du français normal.
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
const signedL = (n, withVar = "") => (n >= 0 ? `+ ${n}${withVar}` : `- ${Math.abs(n)}${withVar}`);

// =========================== Générateurs paramétrés ===========================

// ---------- 1. Propriété exp(x+y) = exp(x)exp(y) ----------
function genProduitExponentiellesNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const answer = a + b;
  return {
    type: "numeric",
    chapter: "Fonction exponentielle — Propriétés algébriques",
    prompt: `On simplifie \\(e^{${a}} \\times e^{${b}}\\) sous la forme \\(e^{k}\\), avec \\(k\\) un entier. Donne la valeur de \\(k\\).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Propriété de référence : } e^{x} \\times e^{y} = e^{x+y}.` },
      { type: "resultat", text: `e^{${a}} \\times e^{${b}} = e^{${a} + ${b}} = e^{${answer}}` },
    ],
  };
}

// ---------- 2. Propriété exp(x) × exp(-x) = 1 ----------
function genProduitOpposesQCM() {
  const a = nonZero(-9, 9);
  return {
    type: "qcm",
    chapter: "Fonction exponentielle — Propriétés algébriques",
    prompt: `Simplifier : \\(e^{${a}} \\times e^{${-a}}\\)`,
    answer: "1",
    options: ["1", "0", `e^{${2 * a}}`],
    steps: [
      { type: "regle", text: `\\text{Propriété de référence : } e^{x} \\times e^{-x} = e^{0} = 1.` },
      { type: "resultat", text: `e^{${a}} \\times e^{-${a}} = e^{${a} - ${a}} = e^0 = 1` },
    ],
  };
}

// ---------- 3. Propriété (e^a)^n = e^{an} ----------
function genPuissanceExponentielleNumeric() {
  const a = nonZero(-5, 5);
  const n = randInt(2, 4);
  const answer = a * n;
  return {
    type: "numeric",
    chapter: "Fonction exponentielle — Propriétés algébriques",
    prompt: `On simplifie \\(\\left(e^{${a}}\\right)^{${n}}\\) sous la forme \\(e^{k}\\), avec \\(k\\) un entier. Donne la valeur de \\(k\\).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Propriété de référence : } \\left(e^{x}\\right)^{n} = e^{n \\times x}.` },
      { type: "resultat", text: `\\left(e^{${a}}\\right)^{${n}} = e^{${a} \\times ${n}} = e^{${answer}}` },
    ],
  };
}

// ---------- 4. Quotient e^a / e^b = e^{a-b} ----------
function genQuotientExponentiellesNumeric() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const answer = a - b;
  return {
    type: "numeric",
    chapter: "Fonction exponentielle — Propriétés algébriques",
    prompt: `On simplifie \\(\\dfrac{e^{${a}}}{e^{${b}}}\\) sous la forme \\(e^{k}\\), avec \\(k\\) un entier. Donne la valeur de \\(k\\).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Propriété de référence : } \\dfrac{e^{x}}{e^{y}} = e^{x-y}.` },
      { type: "resultat", text: `\\dfrac{e^{${a}}}{e^{${b}}} = e^{${a} - (${b})} = e^{${answer}}` },
    ],
  };
}

// ---------- 5. Signe de la fonction exponentielle ----------
function genSigneExponentielleQCM() {
  const x = randInt(-20, 20);
  return {
    type: "qcm",
    chapter: "Fonction exponentielle — Signe et variations",
    prompt: `Quel est le signe de \\(e^{${x}}\\) ?`,
    answer: "Toujours strictement positif",
    options: ["Toujours strictement positif", "Toujours strictement négatif", "Cela dépend du signe de x"],
    steps: [{ type: "regle", text: `\\text{La fonction exponentielle est strictement positive sur } \\mathbb{R}, \\text{ quel que soit le signe de l'exposant.}` }],
  };
}

// ---------- 6. Sens de variation de la fonction exponentielle ----------
function genSensVariationExponentielleQCM() {
  return {
    type: "qcm",
    chapter: "Fonction exponentielle — Signe et variations",
    prompt: `Quel est le sens de variation de la fonction exponentielle sur \\(\\mathbb{R}\\) ?`,
    answer: "strictement croissante",
    options: ["strictement croissante", "strictement décroissante", "elle n'est pas monotone"],
    steps: [{ type: "regle", text: `\\text{La fonction exponentielle est strictement croissante sur } \\mathbb{R}.` }],
  };
}

// ---------- 7. Valeur particulière e^0 = 1 ----------
function genValeurExponentielleZeroNumeric() {
  const k = randInt(2, 9);
  return {
    type: "numeric",
    chapter: "Fonction exponentielle — Valeurs particulières",
    prompt: `Sachant que \\(e^0 = 1\\), calcule \\(${k} \\times e^0\\).`,
    answer: k,
    steps: [
      { type: "regle", text: `\\text{Valeur particulière à connaître : } e^{0} = 1.` },
      { type: "resultat", text: `${k} \\times e^0 = ${k} \\times 1 = ${k}` },
    ],
  };
}

// ---------- 8. Dérivée de t ↦ e^{at} ----------
function genDeriveeExponentielleAffineQCM() {
  let a = nonZero(-6, 6);
  if (a === 1 || a === -1) a = 2;
  const correctRaw = `${a}e^{${a}t}`;
  const options = shuffle([correctRaw, `e^{${a}t}`, `${a}e^{t}`, `${a}te^{${a}t}`]);
  return {
    type: "qcm",
    chapter: "Fonction exponentielle — Dérivation",
    prompt: `Quelle est la dérivée de la fonction \\(t \\mapsto e^{${a}t}\\) ?`,
    answer: correctRaw,
    options,
    steps: [
      { type: "regle", text: `\\text{Formule de référence à connaître : la dérivée de } t \\mapsto e^{at} \\text{ est } t \\mapsto ae^{at}.` },
      { type: "resultat", text: `\\text{Ici : } ${correctRaw}` },
    ],
  };
}

// ---------- 9. Dérivée de f(x) = e^{ax+b} ----------
function genDeriveeExponentielleComposeeQCM() {
  let a = nonZero(-5, 5);
  if (a === 1 || a === -1) a = 2;
  const b = nonZero(-6, 6);
  const correctRaw = `${a}e^{${a}x ${signedL(b)}}`;
  const options = shuffle([correctRaw, `e^{${a}x ${signedL(b)}}`, `${a}e^{x ${signedL(b)}}`, `${a + b}e^{${a}x ${signedL(b)}}`]);
  return {
    type: "qcm",
    chapter: "Fonction exponentielle — Dérivation",
    prompt: `Quelle est la dérivée de la fonction \\(f(x) = e^{${a}x ${signedL(b)}}\\) ?`,
    answer: correctRaw,
    options,
    steps: [
      { type: "regle", text: `\\text{Formule de référence à connaître : pour } f(x) = e^{ax+b}, \\text{ on a } f'(x) = ae^{ax+b}.` },
      { type: "resultat", text: `f'(x) = ${correctRaw}` },
    ],
  };
}

// ---------- 10. Résoudre e^x = e^a ----------
function genResoudreEgaliteExponentiellesNumeric() {
  const a = randInt(-15, 15);
  return {
    type: "numeric",
    chapter: "Fonction exponentielle — Équations",
    prompt: `Résoudre dans \\(\\mathbb{R}\\) l'équation \\(e^{x} = e^{${a}}\\).`,
    answer: a,
    steps: [
      { type: "regle", text: `\\text{La fonction exponentielle est strictement croissante, donc injective : } e^x = e^a \\Leftrightarrow x = a.` },
      { type: "resultat", text: `x = ${a}` },
    ],
  };
}

// ---------- 11. Résoudre e^{2x-1} = e^{a} ----------
function genResoudreEquationAffineExponentielleNumeric() {
  const xSol = randInt(-8, 8);
  const b = randInt(-6, 6);
  const a = 2 * xSol + b;
  return {
    type: "numeric",
    chapter: "Fonction exponentielle — Équations",
    prompt: `Résoudre dans \\(\\mathbb{R}\\) l'équation \\(e^{2x ${signedL(b)}} = e^{${a}}\\).`,
    answer: xSol,
    steps: [
      { type: "regle", text: `\\text{La fonction exponentielle est injective : } e^{2x${signedL(b)}} = e^{${a}} \\Leftrightarrow 2x ${signedL(b)} = ${a}.` },
      { type: "calcul", text: `2x = ${a} ${b >= 0 ? "-" : "+"} ${Math.abs(b)} = ${a - b}` },
      { type: "resultat", text: `x = ${a - b} \\div 2 = ${xSol}` },
    ],
  };
}

// ---------- 12. Résoudre une inéquation e^x < e^a ----------
function genResoudreInequationExponentielleQCM() {
  const a = randInt(-10, 10);
  const sens = pick(["<", ">"]);
  const correctRaw = sens === "<" ? `x < ${a}` : `x > ${a}`;
  const wrongRaw = sens === "<" ? `x > ${a}` : `x < ${a}`;
  return {
    type: "qcm",
    chapter: "Fonction exponentielle — Inéquations",
    prompt: `Résoudre dans \\(\\mathbb{R}\\) : \\(e^{x} ${sens} e^{${a}}\\)`,
    answer: correctRaw,
    options: [correctRaw, wrongRaw, `x = ${a}`],
    steps: [
      { type: "regle", text: `\\text{La fonction exponentielle est strictement croissante : elle conserve le sens de l'inégalité.}` },
      { type: "resultat", text: `\\text{Solution : } ${correctRaw}` },
    ],
  };
}

// ---------- 13. Comparer deux exponentielles selon leurs exposants ----------
function genComparerExponentiellesQCM() {
  const a = randInt(-10, 10);
  let b = randInt(-10, 10);
  while (b === a) b = randInt(-10, 10);
  const answer = a < b ? `e^{${a}} < e^{${b}}` : `e^{${a}} > e^{${b}}`;
  const autre = a < b ? `e^{${a}} > e^{${b}}` : `e^{${a}} < e^{${b}}`;
  return {
    type: "qcm",
    chapter: "Fonction exponentielle — Comparaison",
    prompt: `Compare \\(e^{${a}}\\) et \\(e^{${b}}\\), sans calculatrice.`,
    answer,
    options: [answer, autre, `e^{${a}} = e^{${b}}`],
    steps: [
      { type: "regle", text: `\\text{La fonction exponentielle est strictement croissante, donc elle conserve l'ordre des exposants.}` },
      { type: "resultat", text: `\\text{Comme } ${a} ${a < b ? "<" : ">"} ${b}, \\text{ on a } ${answer}.` },
    ],
  };
}

// ---------- 14. Modéliser une croissance ou décroissance exponentielle ----------
function genModeliserCroissanceDecroissanceQCM() {
  const cas = pick([
    { description: "Un capital placé évolue selon \\(C(t) = C_0 e^{kt}\\), avec \\(k > 0\\).", reponse: "croissance exponentielle" },
    { description: "Une substance radioactive évolue selon \\(m(t) = m_0 e^{kt}\\), avec \\(k < 0\\).", reponse: "décroissance exponentielle" },
    { description: "Une population évolue selon \\(P(t) = P_0 e^{kt}\\), avec \\(k > 0\\).", reponse: "croissance exponentielle" },
  ]);
  return {
    type: "qcm",
    chapter: "Fonction exponentielle — Modélisation",
    prompt: `${cas.description} S'agit-il d'une croissance ou d'une décroissance exponentielle ?`,
    answer: cas.reponse,
    options: ["croissance exponentielle", "décroissance exponentielle"],
    steps: [{ type: "regle", text:
      cas.reponse === "croissance exponentielle"
        ? `\\text{Dans } e^{kt}, \\text{ le coefficient } k \\text{ est strictement positif : la fonction } t \\mapsto e^{kt} \\text{ est croissante, la quantité augmente donc au cours du temps.}`
        : `\\text{Dans } e^{kt}, \\text{ le coefficient } k \\text{ est strictement négatif : la fonction } t \\mapsto e^{kt} \\text{ est décroissante, la quantité diminue donc au cours du temps.}`,
    }],
  };
}

// ---------- 15. Simplifier un produit de plusieurs exponentielles ----------
function genSimplifierProduitTripleNumeric() {
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const c = nonZero(-8, 8);
  const answer = a + b + c;
  return {
    type: "numeric",
    chapter: "Fonction exponentielle — Propriétés algébriques",
    prompt: `On simplifie \\(e^{${a}} \\times e^{${b}} \\times e^{${c}}\\) sous la forme \\(e^{k}\\), avec \\(k\\) un entier. Donne la valeur de \\(k\\).`,
    answer,
    steps: [
      { type: "regle", text: `\\text{Propriété de référence : } e^{x} \\times e^{y} = e^{x+y} \\text{ (applicable de proche en proche à plusieurs facteurs).}` },
      { type: "resultat", text: `e^{${a}} \\times e^{${b}} \\times e^{${c}} = e^{${a} + ${b} + ${c}} = e^{${answer}}` },
    ],
  };
}

const GENERATORS = [
  genProduitExponentiellesNumeric,
  genProduitOpposesQCM,
  genPuissanceExponentielleNumeric,
  genQuotientExponentiellesNumeric,
  genSigneExponentielleQCM,
  genSensVariationExponentielleQCM,
  genValeurExponentielleZeroNumeric,
  genDeriveeExponentielleAffineQCM,
  genDeriveeExponentielleComposeeQCM,
  genResoudreEgaliteExponentiellesNumeric,
  genResoudreEquationAffineExponentielleNumeric,
  genResoudreInequationExponentielleQCM,
  genComparerExponentiellesQCM,
  genModeliserCroissanceDecroissanceQCM,
  genSimplifierProduitTripleNumeric,
];

const DIFFICULTY = {
  genProduitExponentiellesNumeric: "facile",
  genProduitOpposesQCM: "facile",
  genQuotientExponentiellesNumeric: "facile",
  genSigneExponentielleQCM: "facile",
  genSensVariationExponentielleQCM: "facile",
  genValeurExponentielleZeroNumeric: "facile",
  genPuissanceExponentielleNumeric: "standard",
  genDeriveeExponentielleAffineQCM: "standard",
  genResoudreEgaliteExponentiellesNumeric: "standard",
  genComparerExponentiellesQCM: "standard",
  genSimplifierProduitTripleNumeric: "standard",
  genDeriveeExponentielleComposeeQCM: "expert",
  genResoudreEquationAffineExponentielleNumeric: "expert",
  genResoudreInequationExponentielleQCM: "expert",
  genModeliserCroissanceDecroissanceQCM: "expert",
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
    id: "fonction-exponentielle-premiere-spe",
    title: "Fonction exponentielle",
    description: "Propriétés algébriques, signe et variations, dérivation, équations et inéquations, modélisation.",
    pourquoi: "La fonction exponentielle modélise toute croissance ou décroissance proportionnelle à la quantité déjà présente : population, radioactivité, propagation d'une épidémie.",
    level: "premiere-spe",
    order: 6,
    cours: {
      mindMap: {
        title: "Fonction exponentielle",
        branches: [
          {
            title: "Propriétés algébriques",
            items: [
              "Ce sont les mêmes règles que pour les puissances : transformer un produit en somme d'exposants, et inversement.",
              "\\(\\exp(0) = 1\\), et \\(\\exp(x) > 0\\) pour tout x.",
            ],
            formula: "\\(e^{a+b}=e^a e^b,\\quad e^{a-b}=\\dfrac{e^a}{e^b},\\quad (e^a)^n=e^{na}\\)",
          },
          {
            title: "Signe et sens de variation",
            items: [
              "\\(e^x\\) est toujours strictement positive, et strictement croissante sur \\(\\mathbb{R}\\).",
              "Piège classique : une exponentielle ne s'annule jamais — une équation \\(e^{u(x)}=0\\) n'a donc aucune solution.",
            ],
          },
          {
            title: "Dérivée",
            items: [
              "La fonction exponentielle est sa propre dérivée : \\((e^x)'=e^x\\).",
            ],
            formula: "\\((e^{ax+b})' = a \\times e^{ax+b}\\)",
          },
          {
            title: "Équations et inéquations",
            items: [
              "\\(e^A=e^B \\iff A=B\\) (l'exponentielle est strictement croissante, donc injective).",
              "Pour une inéquation \\(e^A > e^B\\), on garde le même sens en passant à \\(A > B\\) (fonction croissante).",
            ],
          },
          {
            title: "Modéliser une croissance ou décroissance exponentielle",
            items: [
              "Un phénomène qui évolue proportionnellement à la quantité déjà présente se modélise par \\(f(t)=C_0 e^{kt}\\), où \\(C_0\\) est la quantité initiale (à \\(t=0\\)).",
              "Le signe du coefficient \\(k\\) donne le comportement : \\(k>0\\) → croissance exponentielle, \\(k<0\\) → décroissance exponentielle (piège classique : ne pas confondre le signe de \\(k\\) avec celui de \\(C_0\\)).",
              "Exemples : capital qui rapporte des intérêts (k>0), population qui croît (k>0), substance radioactive qui se désintègre (k<0).",
            ],
            formula: "\\(f(t)=C_0 e^{kt},\\quad f(0)=C_0\\)",
          },
        ],
      },
    },
  },
  generate,
};
