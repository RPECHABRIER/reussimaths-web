// ---------------------------------------------------------------------------
// Chapitre : Fonctions de référence (2nde) — sous abonnement.
//
// Correspond au chapitre 4 du manuel de 2nde : les quatre fonctions de
// référence — carré (x ↦ x²), cube (x ↦ x³), racine carrée (x ↦ √x) et
// inverse (x ↦ 1/x) — leurs ensembles de définition, leur sens de variation,
// leur parité, le nombre d'antécédents d'un nombre par chacune, comparaison
// d'images par monotonie, et résolution d'équations/inéquations simples du
// type x² = a, x³ = a, 1/x = a.
// La correction du livre du professeur (exercices 15-33 : équations,
// comparaisons par monotonie, antécédents) a servi à identifier la méthode ;
// les nombres et fonctions sont générés aléatoirement à chaque tirage.
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
  const type = pick(["carré", "cube", "racine carrée", "inverse"]);
  if (type === "carré") {
    const x = randInt(-12, 12);
    return {
      type: "numeric",
      chapter: "Fonctions de référence — Images",
      prompt: `Calcule l'image de ${x} par la fonction carré.`,
      answer: x * x,
      steps: [`${x}^2 = ${x * x}`],
    };
  }
  if (type === "cube") {
    const x = randInt(-6, 6);
    return {
      type: "numeric",
      chapter: "Fonctions de référence — Images",
      prompt: `Calcule l'image de ${x} par la fonction cube.`,
      answer: x ** 3,
      steps: [`${x}^3 = ${x ** 3}`],
    };
  }
  if (type === "racine carrée") {
    const racine = randInt(0, 12);
    const x = racine * racine;
    return {
      type: "numeric",
      chapter: "Fonctions de référence — Images",
      prompt: `Calcule l'image de ${x} par la fonction racine carrée.`,
      answer: racine,
      steps: [`\\sqrt{${x}} = ${racine}`],
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
    steps: [`\\dfrac{1}{${x}} \\approx ${roundTo(1 / x, 2)}`],
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
      cas === "négatif"
        ? `Un carré n'est jamais négatif : ${k} n'a aucun antécédent par la fonction carré.`
        : cas === "nul"
          ? `0 a un unique antécédent par la fonction carré : 0 lui-même.`
          : `${k} est strictement positif : il a deux antécédents opposés par la fonction carré.`,
    ],
  };
}

// ---------- 3. Nombre d'antécédents par cube, inverse ou racine carrée ----------
function genAntecedentsAutresFonctionsQCM() {
  const fonction = pick(["cube", "inverse", "racine carrée"]);
  let k, nb, explication;
  if (fonction === "cube") {
    k = randInt(-50, 50);
    nb = 1;
    explication = `La fonction cube est strictement croissante sur \\(\\mathbb{R}\\) : tout nombre réel a exactement un antécédent par la fonction cube.`;
  } else if (fonction === "inverse") {
    const estNul = Math.random() < 0.3;
    k = estNul ? 0 : nonZero(-50, 50);
    nb = estNul ? 0 : 1;
    explication = estNul ? `0 n'a aucun antécédent par la fonction inverse (elle n'est jamais nulle).` : `La fonction inverse est bijective sur \\(\\mathbb{R}^*\\) : ${k} a exactement un antécédent.`;
  } else {
    const estNegatif = Math.random() < 0.4;
    k = estNegatif ? nonZero(-50, -1) : randInt(0, 50);
    nb = estNegatif ? 0 : 1;
    explication = estNegatif ? `La fonction racine carrée ne prend que des valeurs positives ou nulles : ${k} n'a aucun antécédent.` : `${k} est positif ou nul : il a exactement un antécédent par la fonction racine carrée.`;
  }
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Antécédents",
    prompt: `Combien le nombre ${k} a-t-il d'antécédents par la fonction ${fonction} ?`,
    answer: String(nb),
    options: ["0", "1", "2"],
    steps: [explication],
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
    steps: [`La fonction carré est strictement décroissante sur \\(]-\\infty ; 0]\\) puis strictement croissante sur \\([0 ; +\\infty[\\).`],
  };
}

// ---------- 5. Sens de variation de la fonction inverse ----------
function genSensVariationInverseQCM() {
  const surPositifs = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Sens de variation",
    prompt: `Quel est le sens de variation de la fonction inverse sur \\(${surPositifs ? "]0 ; +\\infty[" : "]-\\infty ; 0["}\\) ?`,
    answer: "décroissante",
    options: ["croissante", "décroissante"],
    steps: [`La fonction inverse est strictement décroissante sur chacun des deux intervalles \\(]-\\infty ; 0[\\) et \\(]0 ; +\\infty[\\) (attention : elle n'est pas décroissante sur \\(\\mathbb{R}^*\\) tout entier).`],
  };
}

// ---------- 6. Comparer deux carrés par monotonie ----------
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
    steps: [`La fonction carré est ${memeSignePositif ? "strictement croissante sur [0 ; +∞[" : "strictement décroissante sur ]-∞ ; 0]"}, donc ${bonneReponse.replace(/\^2/g, "²")}.`],
  };
}

// ---------- 7. Comparer deux racines carrées par monotonie ----------
function genComparerRacinesQCM() {
  let a = randInt(0, 40);
  let b = randInt(0, 40);
  while (b === a) b = randInt(0, 40);
  const [xmin, xmax] = a < b ? [a, b] : [b, a];
  const bonneReponse = `\\sqrt{${xmin}} < \\sqrt{${xmax}}`;
  const mauvaise = `\\sqrt{${xmin}} > \\sqrt{${xmax}}`;
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Comparaison d'images",
    prompt: `On a \\(${xmin} < ${xmax}\\). Que peut-on dire de \\(\\sqrt{${xmin}}\\) et \\(\\sqrt{${xmax}}\\) ?`,
    answer: bonneReponse,
    options: [bonneReponse, mauvaise],
    steps: [`La fonction racine carrée est strictement croissante sur \\([0 ; +\\infty[\\), donc \\(\\sqrt{${xmin}} < \\sqrt{${xmax}}\\).`],
  };
}

// ---------- 8. Comparer deux inverses par monotonie ----------
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
    steps: [`La fonction inverse est strictement décroissante sur cet intervalle, donc \\(\\dfrac{1}{${xmin}} > \\dfrac{1}{${xmax}}\\).`],
  };
}

// ---------- 9. Comparer deux cubes par monotonie ----------
function genComparerCubesQCM() {
  let a = randInt(-10, 10);
  let b = randInt(-10, 10);
  while (b === a) b = randInt(-10, 10);
  const [xmin, xmax] = a < b ? [a, b] : [b, a];
  const bonneReponse = `${xmin}^3 < ${xmax}^3`;
  const mauvaise = `${xmin}^3 > ${xmax}^3`;
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Comparaison d'images",
    prompt: `On a \\(${xmin} < ${xmax}\\). Que peut-on dire de \\(${xmin}^3\\) et \\(${xmax}^3\\) ?`,
    answer: bonneReponse,
    options: [bonneReponse, mauvaise],
    steps: [`La fonction cube est strictement croissante sur \\(\\mathbb{R}\\), donc ${bonneReponse.replace(/\^3/g, "³")}.`],
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
      cas === "deux"
        ? `${a} > 0 : l'équation a deux solutions opposées, \\(x = \\pm\\sqrt{${a}}\\), soit ${bonneReponse}.`
        : cas === "une"
          ? `x² = 0 a une unique solution : x = 0.`
          : `${a} < 0 : un carré n'est jamais négatif, l'équation n'a aucune solution.`,
    ],
  };
}

// ---------- 11. Résoudre une inéquation x² < a ou x² > a ----------
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
      sensInf
        ? `x^2 < ${a} \\iff -\\sqrt{${a}} < x < \\sqrt{${a}} \\iff -${r} < x < ${r}`
        : `x^2 > ${a} \\iff x < -\\sqrt{${a}} \\text{ ou } x > \\sqrt{${a}} \\iff x < -${r} \\text{ ou } x > ${r}`,
    ],
  };
}

// ---------- 12. Résoudre une équation x³ = a ----------
function genResoudreEquationCubeNumeric() {
  const xSol = randInt(-6, 6);
  const a = xSol ** 3;
  return {
    type: "numeric",
    chapter: "Fonctions de référence — Équations et inéquations",
    prompt: `Résous l'équation \\(x^3 = ${a}\\).`,
    answer: xSol,
    steps: [`\\text{L'équation } x^3 = ${a} \\text{ a une unique solution : } x = \\sqrt[3]{${a}} = ${xSol}`],
  };
}

// ---------- 13. Résoudre une équation 1/x = a ----------
function genResoudreEquationInverseNumeric() {
  const xSol = nonZero(-12, 12);
  // On choisit a de sorte que 1/xSol reste simple : a = 1/xSol seulement si xSol vaut ±1 ; sinon on
  // pose l'équation sous la forme a·x = 1 avec a = diviseur de 1 pour garder une solution entière propre,
  // c'est-à-dire qu'on fixe directement a = 1/xSol via une écriture en fraction unitaire de dénominateur xSol.
  return {
    type: "numeric",
    chapter: "Fonctions de référence — Équations et inéquations",
    prompt: `Résous l'équation \\(\\dfrac{1}{x} = \\dfrac{1}{${xSol}}\\) (avec \\(x \\neq 0\\)).`,
    answer: xSol,
    steps: [`\\dfrac{1}{x} = \\dfrac{1}{${xSol}} \\iff x = ${xSol}`],
  };
}

// ---------- 14. Identifier la fonction de référence depuis une propriété ----------
function genIdentifierFonctionProprieteQCM() {
  const cas = pick([
    { description: "sa courbe est symétrique par rapport à l'axe des ordonnées", reponse: "la fonction carré" },
    { description: "elle est strictement croissante sur \\(\\mathbb{R}\\) tout entier", reponse: "la fonction cube" },
    { description: "elle n'est définie que pour des nombres positifs ou nuls", reponse: "la fonction racine carrée" },
    { description: "elle n'est jamais définie en 0 et n'est jamais nulle", reponse: "la fonction inverse" },
  ]);
  const options = ["la fonction carré", "la fonction cube", "la fonction racine carrée", "la fonction inverse"];
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Propriétés",
    prompt: `Parmi les fonctions de référence (carré, cube, racine carrée, inverse), laquelle vérifie la propriété suivante : « ${cas.description} » ?`,
    answer: cas.reponse,
    options,
    steps: [`C'est ${cas.reponse}.`],
  };
}

// ---------- 15. Parité des fonctions de référence ----------
function genPariteFonctionReferenceQCM() {
  const cas = pick([
    { nom: "carré", parite: "paire" },
    { nom: "cube", parite: "impaire" },
    { nom: "inverse", parite: "impaire" },
    { nom: "racine carrée", parite: "ni paire ni impaire" },
  ]);
  return {
    type: "qcm",
    chapter: "Fonctions de référence — Propriétés",
    prompt: `La fonction ${cas.nom} est-elle paire, impaire, ou ni l'une ni l'autre ?`,
    answer: cas.parite,
    options: ["paire", "impaire", "ni paire ni impaire"],
    steps: [
      cas.nom === "carré"
        ? `Pour tout x, (-x)² = x² : la fonction carré est paire.`
        : cas.nom === "cube"
          ? `Pour tout x, (-x)³ = -x³ : la fonction cube est impaire.`
          : cas.nom === "inverse"
            ? `Pour tout x ≠ 0, 1/(-x) = -1/x : la fonction inverse est impaire.`
            : `La fonction racine carrée n'est même pas définie sur des nombres négatifs : elle n'est ni paire ni impaire.`,
    ],
  };
}

const GENERATORS = [
  genImageFonctionReferenceNumeric,
  genAntecedentsCarreQCM,
  genAntecedentsAutresFonctionsQCM,
  genSensVariationCarreQCM,
  genSensVariationInverseQCM,
  genComparerCarresQCM,
  genComparerRacinesQCM,
  genComparerInversesQCM,
  genComparerCubesQCM,
  genResoudreEquationCarreQCM,
  genResoudreInequationCarreQCM,
  genResoudreEquationCubeNumeric,
  genResoudreEquationInverseNumeric,
  genIdentifierFonctionProprieteQCM,
  genPariteFonctionReferenceQCM,
];

const DIFFICULTY = {
  genImageFonctionReferenceNumeric: "facile",
  genSensVariationCarreQCM: "facile",
  genSensVariationInverseQCM: "facile",
  genIdentifierFonctionProprieteQCM: "facile",
  genAntecedentsCarreQCM: "standard",
  genAntecedentsAutresFonctionsQCM: "standard",
  genComparerCarresQCM: "standard",
  genComparerRacinesQCM: "standard",
  genComparerInversesQCM: "standard",
  genComparerCubesQCM: "standard",
  genResoudreEquationCarreQCM: "standard",
  genResoudreEquationCubeNumeric: "standard",
  genResoudreEquationInverseNumeric: "standard",
  genResoudreInequationCarreQCM: "expert",
  genPariteFonctionReferenceQCM: "expert",
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
    description: "Fonctions carré, cube, racine carrée et inverse : images, antécédents, sens de variation, parité, comparaison d'images par monotonie, équations et inéquations simples.",
    level: "seconde",
    free: false,
    order: 6,
  },
  generate,
};
