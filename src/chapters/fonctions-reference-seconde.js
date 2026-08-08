// ---------------------------------------------------------------------------
// Chapitre : Fonctions de référence (2nde) — sous abonnement.
//
// NOTE (audit programme 2026, BO n°14 du 2 avril 2026, applicable dès la
// rentrée 2026) : le changement-phare du nouveau programme de 2nde est ici.
// Les fonctions de référence sont désormais carré, valeur absolue, inverse
// (« ajout : valeur absolue ; suppression : racine carrée, cube »). Cube et
// racine carrée disparaissent de la liste des fonctions de référence à
// connaître par cœur (image, antécédents, monotonie globale, équations) —
// seule une vision ponctuelle de √x en approfondissement reste autorisée,
// non retenue ici pour rester strictement dans le cadre du programme cible.
// La parité des fonctions de référence est également retirée du programme.
//
// Trois fonctions de référence — carré (x ↦ x²), valeur absolue (x ↦ |x|) et
// inverse (x ↦ 1/x) — leurs ensembles de définition, leur sens de variation,
// le nombre d'antécédents d'un nombre par chacune, comparaison d'images par
// monotonie, et résolution d'équations/inéquations simples du type x² = a,
// |x| = a, 1/x = a.
// Voir automatismes-seconde.js (thème "fonctions-reference-seconde") pour
// les mini-exercices "Calcul mental" associés.
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

// ---------- 1. Calculer une image par une fonction de référence ----------
function genImageFonctionReferenceNumeric() {
  const type = pick(["carré", "valeur absolue", "inverse"]);
  if (type === "carré") {
    const x = randInt(-12, 12);
    return {
      type: "numeric",
      chapter: "Fonctions de référence — Images",
      prompt: `Calcule l'image de ${x} par la fonction carré.`,
      answer: x * x,
      steps: [{ type: "calcul", text: `${x}^2 = ${x * x}` }],
    };
  }
  if (type === "valeur absolue") {
    const x = nonZero(-15, 15);
    return {
      type: "numeric",
      chapter: "Fonctions de référence — Images",
      prompt: `Calcule l'image de ${x} par la fonction valeur absolue.`,
      answer: Math.abs(x),
      steps: [{ type: "calcul", text: `\\left|${x}\\right| = ${Math.abs(x)}` }],
    };
  }
  // inverse
  const x = nonZero(-12, 12);
  return {
    type: "numeric",
    chapter: "Fonctions de référence — Images",
    prompt: `Calcule l'image de ${x} par la fonction inverse (sous forme décimale si besoin, avec deux décimales).`,
    answer: roundTo(1 / x, 2),
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `\\dfrac{1}{${x}} \\approx ${roundTo(1 / x, 2)}` }],
  };
}

// ---------- 2. Nombre d'antécédents par la fonction carré ----------
function genAntecedentsCarreQCM() {
  const cas = pick(["positif", "négatif", "nul"]);
  const k = cas === "nul" ? 0 : cas === "positif" ? nonZero(1, 100) : nonZero(-100, -1);
  const nb = cas === "négatif" ? 0 : cas === "nul" ? 1 : 2;
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Antécédents",
    prompt: `Combien le nombre ${k} a-t-il d'antécédents par la fonction carré ?`,
    answer: String(nb),
    options: ["0", "1", "2"],
    steps: [
      { type: "regle", text: `\\text{Un carré n'est jamais négatif. Un réel strictement positif a deux antécédents opposés par la fonction carré, 0 en a un seul (lui-même), et un réel négatif n'en a aucun.}` },
      {
        type: "resultat",
        text:
          cas === "négatif"
            ? `${k} \\text{ est négatif : il n'a aucun antécédent par la fonction carré.}`
            : cas === "nul"
              ? `0 \\text{ a un unique antécédent par la fonction carré : 0 lui-même.}`
              : `${k} \\text{ est strictement positif : il a deux antécédents opposés par la fonction carré.}`,
      },
    ],
  };
}

// ---------- 3. Nombre d'antécédents par valeur absolue ou inverse ----------
function genAntecedentsValeurAbsolueInverseQCM() {
  const fonction = pick(["valeur absolue", "inverse"]);
  let k, nb, explication;
  if (fonction === "valeur absolue") {
    const cas = pick(["positif", "négatif", "nul"]);
    k = cas === "nul" ? 0 : cas === "positif" ? nonZero(1, 50) : nonZero(-50, -1);
    nb = cas === "négatif" ? 0 : cas === "nul" ? 1 : 2;
    explication =
      cas === "négatif"
        ? `Une valeur absolue n'est jamais négative : ${k} n'a aucun antécédent par la fonction valeur absolue.`
        : cas === "nul"
          ? `0 a un unique antécédent par la fonction valeur absolue : 0 lui-même.`
          : `${k} est strictement positif : il a deux antécédents opposés par la fonction valeur absolue, -${k} et ${k}.`;
  } else {
    const estNul = Math.random() < 0.3;
    k = estNul ? 0 : nonZero(-50, 50);
    nb = estNul ? 0 : 1;
    explication = estNul ? `0 n'a aucun antécédent par la fonction inverse (elle n'est jamais nulle).` : `La fonction inverse est bijective sur \\(\\mathbb{R}^*\\) : ${k} a exactement un antécédent.`;
  }
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Antécédents",
    prompt: `Combien le nombre ${k} a-t-il d'antécédents par la fonction ${fonction} ?`,
    answer: String(nb),
    options: ["0", "1", "2"],
    steps: [
      { type: "regle", text: `\\text{Une valeur absolue n'est jamais négative (0, 1 ou 2 antécédents selon le signe) ; l'inverse n'est jamais nulle et 0 n'a pas d'antécédent.}` },
      { type: "resultat", text: explication },
    ],
  };
}

// ---------- 4. Sens de variation de la fonction carré selon l'intervalle ----------
function genSensVariationCarreQCM() {
  const surPositifs = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Sens de variation",
    prompt: `Quel est le sens de variation de la fonction carré sur \\(${surPositifs ? "[0 ; +\\infty[" : "]-\\infty ; 0]"}\\) ?`,
    answer: surPositifs ? "croissante" : "décroissante",
    options: ["croissante", "décroissante"],
    steps: [
      { type: "regle", text: `\\text{La fonction carré est strictement décroissante sur } ]-\\infty ; 0] \\text{ puis strictement croissante sur } [0 ; +\\infty[.` },
      { type: "resultat", text: `\\text{Sur } ${surPositifs ? "[0 ; +\\infty[" : "]-\\infty ; 0]"}, \\text{ elle est } ${surPositifs ? "croissante" : "décroissante"}.` },
    ],
  };
}

// ---------- 5. Sens de variation de la fonction valeur absolue ----------
function genSensVariationValeurAbsolueQCM() {
  const surPositifs = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Sens de variation",
    prompt: `Quel est le sens de variation de la fonction valeur absolue sur \\(${surPositifs ? "[0 ; +\\infty[" : "]-\\infty ; 0]"}\\) ?`,
    answer: surPositifs ? "croissante" : "décroissante",
    options: ["croissante", "décroissante"],
    steps: [
      { type: "regle", text: `\\text{La fonction valeur absolue est strictement décroissante sur } ]-\\infty ; 0] \\text{ puis strictement croissante sur } [0 ; +\\infty[ \\text{ (sa courbe forme un V).}` },
      { type: "resultat", text: `\\text{Sur } ${surPositifs ? "[0 ; +\\infty[" : "]-\\infty ; 0]"}, \\text{ elle est } ${surPositifs ? "croissante" : "décroissante"}.` },
    ],
  };
}

// ---------- 6. Sens de variation de la fonction inverse ----------
function genSensVariationInverseQCM() {
  const surPositifs = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Sens de variation",
    prompt: `Quel est le sens de variation de la fonction inverse sur \\(${surPositifs ? "]0 ; +\\infty[" : "]-\\infty ; 0["}\\) ?`,
    answer: "décroissante",
    options: ["croissante", "décroissante"],
    steps: [
      { type: "regle", text: `\\text{La fonction inverse est strictement décroissante sur chacun des deux intervalles } ]-\\infty ; 0[ \\text{ et } ]0 ; +\\infty[ \\text{ (attention : elle n'est pas décroissante sur } \\mathbb{R}^* \\text{ tout entier).}` },
      { type: "resultat", text: `\\text{Sur } ${surPositifs ? "]0 ; +\\infty[" : "]-\\infty ; 0["}, \\text{ elle est décroissante.}` },
    ],
  };
}

// ---------- 7. Comparer deux carrés par monotonie ----------
function genComparerCarresQCM() {
  const memeSignePositif = Math.random() < 0.5;
  const a = memeSignePositif ? randInt(1, 10) : randInt(-10, -1);
  let b = memeSignePositif ? randInt(1, 10) : randInt(-10, -1);
  while (b === a) b = memeSignePositif ? randInt(1, 10) : randInt(-10, -1);
  const [xmin, xmax] = a < b ? [a, b] : [b, a];
  const bonneReponse = memeSignePositif ? `${xmin}^2 < ${xmax}^2` : `${xmin}^2 > ${xmax}^2`;
  const mauvaise = memeSignePositif ? `${xmin}^2 > ${xmax}^2` : `${xmin}^2 < ${xmax}^2`;
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Comparaison d'images",
    prompt: `On a \\(${xmin} < ${xmax}\\), ${memeSignePositif ? "tous deux positifs" : "tous deux négatifs"}. Que peut-on dire de \\(${xmin}^2\\) et \\(${xmax}^2\\) ?`,
    answer: bonneReponse,
    options: shuffle([bonneReponse, mauvaise]),
    steps: [
      { type: "regle", text: `\\text{La fonction carré est } ${memeSignePositif ? "\\text{strictement croissante sur } [0 ; +\\infty[" : "\\text{strictement décroissante sur } ]-\\infty ; 0]"}.` },
      { type: "resultat", text: `${bonneReponse.replace(/\^2/g, "²")}` },
    ],
  };
}

// ---------- 8. Comparer deux valeurs absolues par monotonie ----------
function genComparerValeurAbsolueQCM() {
  const memeSignePositif = Math.random() < 0.5;
  const a = memeSignePositif ? randInt(1, 15) : randInt(-15, -1);
  let b = memeSignePositif ? randInt(1, 15) : randInt(-15, -1);
  while (b === a) b = memeSignePositif ? randInt(1, 15) : randInt(-15, -1);
  const [xmin, xmax] = a < b ? [a, b] : [b, a];
  const bonneReponse = memeSignePositif ? `\\left|${xmin}\\right| < \\left|${xmax}\\right|` : `\\left|${xmin}\\right| > \\left|${xmax}\\right|`;
  const mauvaise = memeSignePositif ? `\\left|${xmin}\\right| > \\left|${xmax}\\right|` : `\\left|${xmin}\\right| < \\left|${xmax}\\right|`;
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Comparaison d'images",
    prompt: `On a \\(${xmin} < ${xmax}\\), ${memeSignePositif ? "tous deux positifs" : "tous deux négatifs"}. Que peut-on dire de \\(\\left|${xmin}\\right|\\) et \\(\\left|${xmax}\\right|\\) ?`,
    answer: bonneReponse,
    options: shuffle([bonneReponse, mauvaise]),
    steps: [
      { type: "regle", text: `\\text{La fonction valeur absolue est } ${memeSignePositif ? "\\text{strictement croissante sur } [0 ; +\\infty[" : "\\text{strictement décroissante sur } ]-\\infty ; 0]"}.` },
      { type: "resultat", text: bonneReponse },
    ],
  };
}

// ---------- 9. Comparer deux inverses par monotonie ----------
function genComparerInversesQCM() {
  const memeSignePositif = Math.random() < 0.5;
  const a = memeSignePositif ? randInt(1, 10) : randInt(-10, -1);
  let b = memeSignePositif ? randInt(1, 10) : randInt(-10, -1);
  while (b === a) b = memeSignePositif ? randInt(1, 10) : randInt(-10, -1);
  const [xmin, xmax] = a < b ? [a, b] : [b, a];
  const bonneReponse = `\\dfrac{1}{${xmin}} > \\dfrac{1}{${xmax}}`;
  const mauvaise = `\\dfrac{1}{${xmin}} < \\dfrac{1}{${xmax}}`;
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Comparaison d'images",
    prompt: `On a \\(${xmin} < ${xmax}\\), ${memeSignePositif ? "tous deux strictement positifs" : "tous deux strictement négatifs"}. Que peut-on dire de \\(\\dfrac{1}{${xmin}}\\) et \\(\\dfrac{1}{${xmax}}\\) ?`,
    answer: bonneReponse,
    options: [bonneReponse, mauvaise],
    steps: [
      { type: "regle", text: `\\text{La fonction inverse est strictement décroissante sur cet intervalle.}` },
      { type: "resultat", text: `\\dfrac{1}{${xmin}} > \\dfrac{1}{${xmax}}` },
    ],
  };
}

// ---------- 10. Résoudre une équation x² = a ----------
function genResoudreEquationCarreQCM() {
  const cas = pick(["deux", "une", "aucune"]);
  const r = nonZero(1, 12);
  let a, bonneReponse, options;
  if (cas === "deux") {
    a = r * r;
    bonneReponse = `{-${r} ; ${r}}`;
    options = [bonneReponse, `{${r}}`, `\\emptyset`];
  } else if (cas === "une") {
    a = 0;
    bonneReponse = `{0}`;
    options = [bonneReponse, `\\emptyset`, `{-${r} ; ${r}}`];
  } else {
    a = -(r * r);
    bonneReponse = `\\emptyset`;
    options = [bonneReponse, `{-${r} ; ${r}}`, `{0}`];
  }
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Équations et inéquations",
    prompt: `Résous l'équation \\(x^2 = ${a}\\) (donne l'ensemble des solutions).`,
    answer: bonneReponse,
    options: shuffle(options),
    steps: [
      { type: "regle", text: `\\text{Un carré n'est jamais négatif. Si } a > 0, \\text{ l'équation } x^2 = a \\text{ a deux solutions opposées } x = \\pm\\sqrt{a} \\text{ ; si } a = 0, \\text{ une seule solution } x=0 \\text{ ; si } a < 0, \\text{ aucune solution.}` },
      {
        type: "resultat",
        text:
          cas === "deux"
            ? `${a} > 0 : \\text{ l'équation a deux solutions opposées, } x = \\pm\\sqrt{${a}}, \\text{ soit } ${bonneReponse}.`
            : cas === "une"
              ? `x^2 = 0 \\text{ a une unique solution : } x = 0.`
              : `${a} < 0 : \\text{ l'équation n'a aucune solution.}`,
      },
    ],
  };
}

// ---------- 11. Résoudre une équation |x| = a ----------
function genResoudreEquationValeurAbsolueQCM() {
  const cas = pick(["deux", "une", "aucune"]);
  const r = nonZero(1, 12);
  let a, bonneReponse, options;
  if (cas === "deux") {
    a = r;
    bonneReponse = `{-${r} ; ${r}}`;
    options = [bonneReponse, `{${r}}`, `\\emptyset`];
  } else if (cas === "une") {
    a = 0;
    bonneReponse = `{0}`;
    options = [bonneReponse, `\\emptyset`, `{-${r} ; ${r}}`];
  } else {
    a = -r;
    bonneReponse = `\\emptyset`;
    options = [bonneReponse, `{-${r} ; ${r}}`, `{0}`];
  }
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Équations et inéquations",
    prompt: `Résous l'équation \\(|x| = ${a}\\) (donne l'ensemble des solutions).`,
    answer: bonneReponse,
    options: shuffle(options),
    steps: [
      { type: "regle", text: `\\text{Une valeur absolue n'est jamais négative. Si } a > 0, \\text{ l'équation } |x| = a \\text{ a deux solutions opposées } x = \\pm a \\text{ ; si } a = 0, \\text{ une seule solution } x=0 \\text{ ; si } a < 0, \\text{ aucune solution.}` },
      {
        type: "resultat",
        text:
          cas === "deux"
            ? `${a} > 0 : \\text{ l'équation a deux solutions opposées, } x = \\pm ${a}, \\text{ soit } ${bonneReponse}.`
            : cas === "une"
              ? `|x| = 0 \\text{ a une unique solution : } x = 0.`
              : `${a} < 0 : \\text{ l'équation n'a aucune solution.}`,
      },
    ],
  };
}

// ---------- 12. Résoudre une inéquation x² < a ou x² > a ----------
function genResoudreInequationCarreQCM() {
  const a = nonZero(1, 12) ** 2;
  const r = Math.sqrt(a);
  const sensInf = Math.random() < 0.5;
  const bonneReponse = sensInf ? `]-${r} ; ${r}[` : `]-\\infty ; -${r}[ \\cup ]${r} ; +\\infty[`;
  const mauvaise = sensInf ? `]-\\infty ; -${r}[ \\cup ]${r} ; +\\infty[` : `]-${r} ; ${r}[`;
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Équations et inéquations",
    prompt: `Résous l'inéquation \\(x^2 ${sensInf ? "<" : ">"} ${a}\\).`,
    answer: bonneReponse,
    options: [bonneReponse, mauvaise],
    steps: [
      {
        type: "regle",
        text: sensInf
          ? `\\text{Pour } a > 0, \\ x^2 < a \\iff -\\sqrt{a} < x < \\sqrt{a} \\text{ (les solutions sont comprises entre les deux racines opposées).}`
          : `\\text{Pour } a > 0, \\ x^2 > a \\iff x < -\\sqrt{a} \\text{ ou } x > \\sqrt{a} \\text{ (les solutions sont à l'extérieur des deux racines opposées).}`,
      },
      {
        type: "resultat",
        text: sensInf ? `-\\sqrt{${a}} < x < \\sqrt{${a}} \\iff -${r} < x < ${r}` : `x < -\\sqrt{${a}} \\text{ ou } x > \\sqrt{${a}} \\iff x < -${r} \\text{ ou } x > ${r}`,
      },
    ],
  };
}

// ---------- 13. Résoudre une inéquation |x| < a ou |x| > a ----------
function genResoudreInequationValeurAbsolueQCM() {
  const a = nonZero(1, 12);
  const sensInf = Math.random() < 0.5;
  const bonneReponse = sensInf ? `]-${a} ; ${a}[` : `]-\\infty ; -${a}[ \\cup ]${a} ; +\\infty[`;
  const mauvaise = sensInf ? `]-\\infty ; -${a}[ \\cup ]${a} ; +\\infty[` : `]-${a} ; ${a}[`;
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Équations et inéquations",
    prompt: `Résous l'inéquation \\(|x| ${sensInf ? "<" : ">"} ${a}\\).`,
    answer: bonneReponse,
    options: [bonneReponse, mauvaise],
    steps: [
      {
        type: "regle",
        text: sensInf
          ? `\\text{Pour } a > 0, \\ |x| < a \\iff -a < x < a.`
          : `\\text{Pour } a > 0, \\ |x| > a \\iff x < -a \\text{ ou } x > a.`,
      },
      {
        type: "resultat",
        text: sensInf ? `|x| < ${a} \\iff -${a} < x < ${a}` : `|x| > ${a} \\iff x < -${a} \\text{ ou } x > ${a}`,
      },
    ],
  };
}

// ---------- 14. Résoudre une équation 1/x = a ----------
function genResoudreEquationInverseNumeric() {
  const xSol = nonZero(-12, 12);
  return {
    type: "numeric",
    chapter: "Fonctions de référence — Équations et inéquations",
    prompt: `Résous l'équation \\(\\dfrac{1}{x} = \\dfrac{1}{${xSol}}\\) (avec \\(x \\neq 0\\)).`,
    answer: xSol,
    steps: [
      { type: "regle", text: `\\text{La fonction inverse est bijective sur } \\mathbb{R}^*, \\text{ donc deux fractions de numérateur 1 sont égales si et seulement si leurs dénominateurs le sont.}` },
      { type: "resultat", text: `\\dfrac{1}{x} = \\dfrac{1}{${xSol}} \\iff x = ${xSol}` },
    ],
  };
}

// ---------- 15. Identifier la fonction de référence depuis une propriété ----------
function genIdentifierFonctionProprieteQCM() {
  const cas = pick([
    { description: "sa courbe est une parabole", reponse: "la fonction carré" },
    { description: "sa courbe est formée de deux demi-droites symétriques par rapport à l'axe des ordonnées", reponse: "la fonction valeur absolue" },
    { description: "elle n'est jamais définie ni nulle en 0", reponse: "la fonction inverse" },
  ]);
  const options = ["la fonction carré", "la fonction valeur absolue", "la fonction inverse"];
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Propriétés",
    prompt: `Parmi les fonctions de référence (carré, valeur absolue, inverse), laquelle vérifie la propriété suivante : « ${cas.description} » ?`,
    answer: cas.reponse,
    options,
    steps: [
      {
        type: "regle",
        text: `\\text{Carré : courbe en forme de parabole. Valeur absolue : courbe en forme de V (deux demi-droites). Inverse : jamais définie ni nulle en 0.}`,
      },
      { type: "resultat", text: `\\text{La propriété « ${cas.description} » correspond à } ${cas.reponse}.` },
    ],
  };
}

const GENERATORS = [
  genImageFonctionReferenceNumeric,
  genAntecedentsCarreQCM,
  genAntecedentsValeurAbsolueInverseQCM,
  genSensVariationCarreQCM,
  genSensVariationValeurAbsolueQCM,
  genSensVariationInverseQCM,
  genComparerCarresQCM,
  genComparerValeurAbsolueQCM,
  genComparerInversesQCM,
  genResoudreEquationCarreQCM,
  genResoudreEquationValeurAbsolueQCM,
  genResoudreInequationCarreQCM,
  genResoudreInequationValeurAbsolueQCM,
  genResoudreEquationInverseNumeric,
  genIdentifierFonctionProprieteQCM,
];

const DIFFICULTY = {
  genImageFonctionReferenceNumeric: "facile",
  genSensVariationCarreQCM: "facile",
  genSensVariationValeurAbsolueQCM: "facile",
  genSensVariationInverseQCM: "facile",
  genIdentifierFonctionProprieteQCM: "facile",
  genAntecedentsCarreQCM: "standard",
  genAntecedentsValeurAbsolueInverseQCM: "standard",
  genComparerCarresQCM: "standard",
  genComparerValeurAbsolueQCM: "standard",
  genComparerInversesQCM: "standard",
  genResoudreEquationCarreQCM: "standard",
  genResoudreEquationValeurAbsolueQCM: "standard",
  genResoudreEquationInverseNumeric: "standard",
  genResoudreInequationCarreQCM: "expert",
  genResoudreInequationValeurAbsolueQCM: "expert",
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
    id: "fonctions-reference-seconde",
    title: "Fonctions de référence",
    description: "Fonctions carré, valeur absolue et inverse : images, antécédents, sens de variation, comparaison d'images par monotonie, équations et inéquations simples.",
    pourquoi: "Connaître l'allure des fonctions carré, valeur absolue et inverse, c'est reconnaître immédiatement le comportement d'un phénomène physique ou économique courant.",
    level: "seconde",
    free: false,
    order: 6,
    cours: {
      mindMap: {
        title: "Fonctions de référence",
        branches: [
          {
            title: "Fonction carré : x ↦ x²",
            items: [
              "Définie sur \\(\\mathbb{R}\\), décroissante sur \\(]-\\infty ; 0]\\), croissante sur \\([0 ; +\\infty[\\), minimum 0 en x = 0.",
              "Piège classique : un nombre strictement positif a toujours 2 antécédents par le carré (opposés l'un de l'autre).",
            ],
          },
          {
            title: "Fonction valeur absolue : x ↦ |x|",
            items: [
              "Définie sur \\(\\mathbb{R}\\), même allure en V que le carré : décroissante puis croissante, minimum 0 en x = 0.",
              "\\(|x| = a\\) (a > 0) a deux solutions : x = a ou x = -a.",
            ],
          },
          {
            title: "Fonction inverse : x ↦ 1/x",
            items: [
              "Définie sur \\(\\mathbb{R}\\) privé de 0, décroissante sur \\(]-\\infty ; 0[\\) et décroissante sur \\(]0 ; +\\infty[\\) (mais pas sur la réunion des deux).",
              "Piège classique : ne jamais dire « décroissante sur \\(\\mathbb{R}^*\\) » — le sens ne se compare pas d'un côté de 0 à l'autre.",
            ],
            formula: "\\(f(x) = \\dfrac{1}{x}\\)",
          },
          {
            title: "Comparer des images, résoudre",
            items: [
              "Utiliser le sens de variation sur l'intervalle concerné pour comparer deux images sans calculer.",
              "Pour résoudre \\(x^2=a\\), \\(|x|=a\\) ou \\(\\frac{1}{x}=a\\) : compter les solutions selon le signe de a.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
