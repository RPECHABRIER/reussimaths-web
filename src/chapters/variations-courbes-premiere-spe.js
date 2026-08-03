// ---------------------------------------------------------------------------
// Chapitre : Variations et courbes représentatives des fonctions (Première Spé)
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
// Fragment "(x - alpha)" pour la forme canonique, sans "- 0" disgracieux si alpha = 0
const carreTerm = (alpha) => (alpha === 0 ? "x" : `x ${signedL(-alpha)}`);

// =========================== Générateurs paramétrés ===========================

// ---------- 1. Parité d'une fonction (à partir de sa formule) ----------
function genPariteFonctionQCM() {
  const kind = pick(["paire", "impaire", "aucune"]);
  const a = nonZero(-5, 5);
  let formule, reponse;
  if (kind === "paire") {
    const c = randInt(-8, 8);
    formule = `${a}x^2 ${signedL(c)}`;
    reponse = "paire";
  } else if (kind === "impaire") {
    const b = nonZero(-6, 6);
    formule = `${a}x^3 ${signedL(b, "x")}`;
    reponse = "impaire";
  } else {
    const b = nonZero(-6, 6);
    const c = nonZero(-8, 8);
    formule = `${a}x^2 ${signedL(b, "x")} ${signedL(c)}`;
    reponse = "ni paire ni impaire";
  }
  return {
    type: "qcm",
    chapter: "Variations et courbes — Parité",
    prompt: `On considère la fonction \\(f\\) définie sur \\(\\mathbb{R}\\) par \\(f(x) = ${formule}\\). Cette fonction est-elle paire, impaire, ou ni l'une ni l'autre ?`,
    answer: reponse,
    options: ["paire", "impaire", "ni paire ni impaire"],
    steps: [
      reponse === "paire"
        ? `\\text{Seules des puissances paires de } x \\text{ apparaissent : } f(-x) = f(x) \\text{, la fonction est paire.}`
        : reponse === "impaire"
        ? `\\text{Seules des puissances impaires de } x \\text{ apparaissent (sans constante) : } f(-x) = -f(x) \\text{, la fonction est impaire.}`
        : `\\text{Le mélange d'un terme en } x^2 \\text{ et d'un terme en } x \\text{ (ou d'une constante non nulle avec un terme impair) empêche toute parité.}`,
    ],
  };
}

// ---------- 2. Traduction géométrique de la parité ----------
function genTraductionGeometriqueQCM() {
  const paire = Math.random() < 0.5;
  const reponse = paire ? "symétrique par rapport à l'axe des ordonnées" : "symétrique par rapport à l'origine du repère";
  return {
    type: "qcm",
    chapter: "Variations et courbes — Parité",
    prompt: `La fonction \\(f\\) est ${paire ? "paire" : "impaire"}. Que peut-on dire de sa courbe représentative dans un repère ?`,
    answer: reponse,
    options: ["symétrique par rapport à l'axe des ordonnées", "symétrique par rapport à l'origine du repère"],
    steps: [reponse],
  };
}

// ---------- 3. Sens de variation à partir du signe de f' ----------
function genSensVariationSigneDeriveeQCM() {
  const positive = Math.random() < 0.5;
  const nomFonction = pick(["f", "g", "h"]);
  return {
    type: "qcm",
    chapter: "Variations et courbes — Signe de f' et variations",
    prompt: `Sur un intervalle \\(I\\), la fonction dérivée de ${nomFonction} vérifie \\(${nomFonction}'(x) ${positive ? ">" : "<"} 0\\). Quel est le sens de variation de ${nomFonction} sur \\(I\\) ?`,
    answer: positive ? "croissante" : "décroissante",
    options: ["croissante", "décroissante"],
    steps: [positive ? `\\text{f' positive} \\Rightarrow \\text{f croissante sur } I.` : `\\text{f' négative} \\Rightarrow \\text{f décroissante sur } I.`],
  };
}

// ---------- 4. Extremum d'une fonction polynôme du second degré ----------
function genExtremumSecondDegreNumeric() {
  const a = nonZero(-4, 4);
  const alpha = randInt(-6, 6);
  const beta = randInt(-10, 10);
  return {
    type: "numeric",
    chapter: "Variations et courbes — Extremum",
    prompt: `On considère \\(f(x) = ${a}(${carreTerm(alpha)})^2 ${signedL(beta)}\\), écrite sous forme canonique. Donne la valeur de l'extremum (minimum ou maximum) de \\(f\\).`,
    answer: beta,
    steps: [`\\text{Le carré } (x - ${alpha})^2 \\text{ vaut } 0 \\text{ en } x = ${alpha}, \\text{ où } f \\text{ atteint son extremum : } f(${alpha}) = ${beta}.`],
  };
}

// ---------- 5. Allure de la parabole selon le signe de a ----------
function genAllureParaboleQCM() {
  const a = nonZero(-6, 6);
  const reponse = a > 0 ? "un minimum" : "un maximum";
  return {
    type: "qcm",
    chapter: "Variations et courbes — Allure de la parabole",
    prompt: `On considère la fonction polynôme du second degré \\(f(x) = ${a}x^2 + bx + c\\). La parabole représentant \\(f\\) admet-elle un minimum ou un maximum ?`,
    answer: reponse,
    options: ["un minimum", "un maximum"],
    steps: [a > 0 ? `\\text{Comme } a = ${a} > 0, \\text{ la parabole est tournée vers le haut : elle admet un minimum.}` : `\\text{Comme } a = ${a} < 0, \\text{ la parabole est tournée vers le bas : elle admet un maximum.}`],
  };
}

// ---------- 6. Établir une inégalité à partir des variations ----------
function genInegaliteVariationsQCM() {
  const croissante = Math.random() < 0.5;
  const nomFonction = pick(["f", "g", "h"]);
  const xA = randInt(-8, 3);
  const xB = xA + nonZero(1, 6);
  const reponse = croissante ? `${nomFonction}(${xA}) < ${nomFonction}(${xB})` : `${nomFonction}(${xA}) > ${nomFonction}(${xB})`;
  const autre = croissante ? `${nomFonction}(${xA}) > ${nomFonction}(${xB})` : `${nomFonction}(${xA}) < ${nomFonction}(${xB})`;
  return {
    type: "qcm",
    chapter: "Variations et courbes — Inégalités",
    prompt: `La fonction ${nomFonction} est ${croissante ? "croissante" : "décroissante"} sur un intervalle contenant ${xA} et ${xB}, avec \\(${xA} < ${xB}\\). Que peut-on en déduire ?`,
    answer: reponse,
    options: [reponse, autre, `${nomFonction}(${xA}) = ${nomFonction}(${xB})`],
    steps: [`\\text{Comme } ${xA} < ${xB} \\text{ et que } ${nomFonction} \\text{ est ${croissante ? "croissante" : "décroissante"}, on a } ${reponse}.`],
  };
}

// ---------- 7. Optimisation : abscisse qui réalise l'extremum ----------
function genOptimisationAbscisseNumeric() {
  const a = nonZero(-4, 4);
  const b = randInt(-16, 16);
  const answer = roundTo(-b / (2 * a), 2);
  return {
    type: "numeric",
    chapter: "Variations et courbes — Optimisation",
    prompt: `On veut optimiser \\(f(x) = ${a}x^2 ${signedL(b, "x")} + 4\\). Calcule la valeur de \\(x\\) qui réalise l'extremum de \\(f\\) (formule \\(\\alpha = \\dfrac{-b}{2a}\\)).`,
    answer,
    tolerance: 0.01,
    steps: [`\\alpha = \\dfrac{-(${b})}{2 \\times ${a}} = ${fr(answer)}`],
  };
}

// ---------- 8. Position de x0 où f'(x0) = 0 ----------
function genAbscisseDeriveeNulleNumeric() {
  const a2 = nonZero(-5, 5);
  const a1 = randInt(-14, 14);
  const answer = roundTo(-a1 / (2 * a2), 2);
  return {
    type: "numeric",
    chapter: "Variations et courbes — Extremum",
    prompt: `Une fonction \\(f\\) a pour dérivée \\(f'(x) = ${2 * a2}x ${signedL(a1)}\\). En quelle valeur de \\(x\\) la fonction \\(f\\) admet-elle un extremum (c'est-à-dire \\(f'(x) = 0\\)) ?`,
    answer,
    tolerance: 0.01,
    steps: [`${2 * a2}x ${signedL(a1)} = 0 \\Rightarrow x = \\dfrac{${-a1}}{${2 * a2}} = ${fr(answer)}`],
  };
}

// ---------- 9. Lecture d'un tableau de variations ----------
function genLectureTableauVariationsQCM() {
  const sens = pick(["croissante", "décroissante"]);
  const xMin = -4;
  const xMax = 4;
  const yMin = sens === "croissante" ? -3 : 9;
  const yMax = sens === "croissante" ? 9 : -3;
  const correct = sens === "croissante" ? `f(0) \\text{ est compris entre } ${yMin} \\text{ et } ${yMax}` : `f(0) \\text{ est compris entre } ${yMax} \\text{ et } ${yMin}`;
  return {
    type: "qcm",
    chapter: "Variations et courbes — Lecture de tableaux",
    prompt: `Le tableau de variations d'une fonction f montre que f est ${sens} sur \\([${xMin} ; ${xMax}]\\), avec \\(f(${xMin}) = ${yMin}\\) et \\(f(${xMax}) = ${yMax}\\). Que peut-on dire de \\(f(0)\\) ?`,
    answer: correct,
    options: [correct, `f(0) \\text{ est supérieur à } ${Math.max(yMin, yMax)}`, `f(0) \\text{ est inférieur à } ${Math.min(yMin, yMax)}`],
    steps: [`\\text{Comme } f \\text{ est ${sens} sur } [${xMin} ; ${xMax}] \\text{ et que } 0 \\text{ est entre les deux bornes, f(0) est encadré par les images des bornes.}`],
  };
}

// ---------- 10. Caractérisation des fonctions constantes ----------
function genFonctionConstanteQCM() {
  return {
    type: "qcm",
    chapter: "Variations et courbes — Fonctions constantes",
    prompt: `\\(f\\) est une fonction dérivable sur un intervalle \\(I\\) telle que, pour tout \\(x\\) de \\(I\\), \\(f'(x) = 0\\). Que peut-on en conclure sur \\(f\\) ?`,
    answer: "f est constante sur I",
    options: ["f est constante sur I", "f est croissante sur I", "f est décroissante sur I", "On ne peut rien conclure"],
    steps: [`\\text{Une fonction dérivable dont la dérivée est nulle sur tout un intervalle est constante sur cet intervalle.}`],
  };
}

// ---------- 11. Image par une fonction impaire ----------
function genImageFonctionImpaireNumeric() {
  const a = nonZero(-6, 6);
  const b = nonZero(-6, 6);
  const x0 = nonZero(-6, 6);
  const fx0 = a * x0 ** 3 + b * x0;
  const answer = -fx0;
  return {
    type: "numeric",
    chapter: "Variations et courbes — Parité",
    prompt: `\\(f\\) est une fonction impaire telle que \\(f(${x0}) = ${fx0}\\). Calcule \\(f(${-x0})\\).`,
    answer,
    steps: [`\\text{Comme } f \\text{ est impaire, } f(-x) = -f(x).`, `f(${-x0}) = -f(${x0}) = ${answer}`],
  };
}

// ---------- 12. Image par une fonction paire ----------
function genImageFonctionPaireNumeric() {
  const x0 = nonZero(-8, 8);
  const fx0 = randInt(-15, 15);
  return {
    type: "numeric",
    chapter: "Variations et courbes — Parité",
    prompt: `\\(f\\) est une fonction paire telle que \\(f(${x0}) = ${fx0}\\). Calcule \\(f(${-x0})\\).`,
    answer: fx0,
    steps: [`\\text{Comme } f \\text{ est paire, } f(-x) = f(x).`, `f(${-x0}) = f(${x0}) = ${fx0}`],
  };
}

// ---------- 13. Position relative de deux courbes (comparaison simple) ----------
function genPositionRelativeCourbesQCM() {
  const k = nonZero(1, 12);
  return {
    type: "qcm",
    chapter: "Variations et courbes — Position relative",
    prompt: `On considère deux fonctions \\(f\\) et \\(g\\) telles que, pour tout \\(x\\), \\(f(x) - g(x) = ${k}\\). Que peut-on dire de la position de la courbe de \\(f\\) par rapport à celle de \\(g\\) ?`,
    answer: "La courbe de f est entièrement au-dessus de celle de g",
    options: ["La courbe de f est entièrement au-dessus de celle de g", "La courbe de f est entièrement en-dessous de celle de g", "Les deux courbes se croisent"],
    steps: [`\\text{Comme } f(x) - g(x) = ${k} > 0 \\text{ pour tout } x, \\text{ on a toujours } f(x) > g(x) : \\text{la courbe de f est au-dessus.}`],
  };
}

// ---------- 14. Vrai ou faux sur les variations et courbes ----------
function genVraiFauxVariationsQCM() {
  const cas = pick([
    { description: "Si f est croissante et g est croissante, alors f + g est croissante.", reponse: "Vrai" },
    { description: "La courbe représentative d'une fonction paire est symétrique par rapport à l'origine du repère.", reponse: "Faux" },
    { description: "Si f'(a) = 0, alors f admet nécessairement un extremum en a.", reponse: "Faux" },
    { description: "Une fonction affine non constante est soit croissante, soit décroissante sur R.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Variations et courbes — Vrai ou faux",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 15. Comparaison de deux images d'une fonction du second degré (via le sommet) ----------
function genComparaisonImagesSommetQCM() {
  const a = nonZero(-4, 4);
  const alpha = randInt(-5, 5);
  const d = nonZero(1, 6);
  const xA = alpha - d;
  const xB = alpha + d;
  const reponse = "f(x_A) = f(x_B)";
  return {
    type: "qcm",
    chapter: "Variations et courbes — Symétrie de la parabole",
    prompt: `La parabole représentant \\(f(x) = ${a}(${carreTerm(alpha)})^2 + 2\\) a pour axe de symétrie la droite d'équation \\(x = ${alpha}\\). On pose \\(x_A = ${xA}\\) et \\(x_B = ${xB}\\). Que peut-on dire de \\(f(x_A)\\) et \\(f(x_B)\\) ?`,
    answer: reponse,
    options: [reponse, "f(x_A) > f(x_B)", "f(x_A) < f(x_B)"],
    steps: [`\\text{${xA} et ${xB} sont symétriques par rapport à ${alpha} (axe de symétrie de la parabole), donc } f(x_A) = f(x_B).`],
  };
}

const GENERATORS = [
  genPariteFonctionQCM,
  genTraductionGeometriqueQCM,
  genSensVariationSigneDeriveeQCM,
  genExtremumSecondDegreNumeric,
  genAllureParaboleQCM,
  genInegaliteVariationsQCM,
  genOptimisationAbscisseNumeric,
  genAbscisseDeriveeNulleNumeric,
  genLectureTableauVariationsQCM,
  genFonctionConstanteQCM,
  genImageFonctionImpaireNumeric,
  genImageFonctionPaireNumeric,
  genPositionRelativeCourbesQCM,
  genVraiFauxVariationsQCM,
  genComparaisonImagesSommetQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "variations-courbes-premiere-spe",
    title: "Variations et courbes représentatives des fonctions",
    description: "Parité, sens de variation et signe de f', extremums, optimisation, position relative de courbes.",
    level: "premiere-spe",
    order: 5,
  },
  generate,
};
