// ---------------------------------------------------------------------------
// Chapitre : Réviser les bases (Première non spé) — gratuit, illimité.
//
// Équivalent, pour l'entrée en Première (enseignement mathématique, non
// spé), du chapitre "Réviser les bases" des niveaux précédents : un tour
// d'horizon des savoir-faire de 2nde indispensables pour aborder les
// nouveaux chapitres de Première (fonctions affines et taux de variation,
// évolutions et pourcentages, fonction carré, résolution d'équations,
// lecture de tableaux de variations, statistiques descriptives,
// probabilités). Fichier indépendant (par convention, chaque chapitre a ses
// propres helpers, pas de mutualisation entre fichiers).
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

// =========================== Fonctions affines (2nde) ===========================

// ---------- 1. Image par une fonction affine ----------
function genImageFonctionAffineNumeric() {
  const a = nonZero(-6, 6);
  const b = randInt(-10, 10);
  const x = randInt(-8, 8);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première) — Fonctions affines",
    prompt: `On considère la fonction affine f définie par \\(f(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(f(${x})\\).`,
    answer,
    steps: [`f(${x}) = ${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}`],
  };
}

// ---------- 2. Taux de variation (coefficient directeur) entre deux points ----------
function genTauxVariationNumeric() {
  const xA = randInt(-8, 8);
  let xB = randInt(-8, 8);
  while (xB === xA) xB = randInt(-8, 8);
  const a = nonZero(-5, 5);
  const b = randInt(-10, 10);
  const yA = a * xA + b;
  const yB = a * xB + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première) — Fonctions affines",
    prompt: `Une fonction affine f vérifie \\(f(${xA}) = ${yA}\\) et \\(f(${xB}) = ${yB}\\). Calcule le taux de variation de f entre ${xA} et ${xB} (c'est-à-dire son coefficient directeur).`,
    answer: a,
    steps: [`\\dfrac{${yB} - (${yA})}{${xB} - (${xA})} = \\dfrac{${yB - yA}}{${xB - xA}} = ${a}`],
  };
}

// =========================== Équations (2nde/3e) ===========================

// ---------- 3. Résoudre une équation simple ax + b = c ----------
function genResoudreEquationSimpleNumeric() {
  const xSol = nonZero(-15, 15);
  const a = nonZero(-9, 9);
  const b = randInt(-20, 20);
  const c = a * xSol + b;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première) — Équations",
    prompt: `Résous l'équation : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}\\)`,
    answer: xSol,
    steps: [`${a}x = ${c} ${b >= 0 ? "-" : "+"} ${Math.abs(b)} = ${c - b}`, `x = ${c - b} \\div ${a} = ${xSol}`],
  };
}

// ---------- 4. Résoudre une équation produit nul ----------
function genEquationProduitNulQCM() {
  const r1 = nonZero(-8, 8);
  const r2 = nonZero(-8, 8);
  const solutions = [...new Set([r1, r2])].sort((a, b) => a - b);
  const mauvaise1 = [...new Set([r1, r2 + nonZero(1, 4)])].sort((a, b) => a - b);
  const mauvaise2 = [r1];
  const bonneReponse = solutions.join(" ; ");
  const options = new Set([bonneReponse]);
  for (const cand of [mauvaise1.join(" ; "), mauvaise2.join(" ; "), [r2].join(" ; ")]) {
    if (options.size >= 3) break;
    if (cand !== bonneReponse) options.add(cand);
  }
  return {
    type: "qcm",
    chapter: "Réviser les bases (Première) — Équations",
    prompt: `On considère l'équation \\((x ${r1 >= 0 ? "-" : "+"} ${Math.abs(r1)})(x ${r2 >= 0 ? "-" : "+"} ${Math.abs(r2)}) = 0\\). Quel est son ensemble de solutions ?`,
    answer: bonneReponse,
    options: shuffle([...options]),
    steps: [`\\text{Un produit de facteurs est nul si et seulement si l'un au moins des facteurs est nul.}`, `x - (${r1}) = 0 \\text{ ou } x - (${r2}) = 0`, `S = \\{${bonneReponse}\\}`],
  };
}

// =========================== Fonction carré (2nde) ===========================

// ---------- 5. Image par la fonction carré ----------
function genImageFonctionCarreNumeric() {
  const x = nonZero(-12, 12);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première) — Fonction carré",
    prompt: `On considère la fonction carré définie par \\(f(x) = x^2\\). Calcule \\(f(${x})\\).`,
    answer: x * x,
    steps: [`f(${x}) = ${x}^2 = ${x * x}`],
  };
}

// ---------- 6. Sens de variation de la fonction carré ----------
function genSensVariationCarreQCM() {
  const cas = pick([
    { intervalle: "sur \\(]-\\infty ; 0]\\)", reponse: "décroissante" },
    { intervalle: "sur \\([0 ; +\\infty[\\)", reponse: "croissante" },
  ]);
  return {
    type: "qcm",
    chapter: "Réviser les bases (Première) — Fonction carré",
    prompt: `Quel est le sens de variation de la fonction carré ${cas.intervalle} ?`,
    answer: cas.reponse,
    options: ["croissante", "décroissante"],
    steps: [`\\text{La fonction carré est ${cas.reponse} ${cas.intervalle}.}`],
  };
}

// =========================== Évolutions et pourcentages (2nde) ===========================

// ---------- 7. Pourcentage d'une quantité ----------
function genPourcentageDuneQuantiteNumeric() {
  const p = pick([10, 15, 20, 25, 40, 50, 75]);
  const total = randInt(20, 400);
  const answer = roundTo((p / 100) * total, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première) — Évolutions et pourcentages",
    prompt: `Calcule ${p} % de ${total}.`,
    answer,
    tolerance: 0.02,
    steps: [`${total} \\times \\dfrac{${p}}{100} = ${fr(answer)}`],
  };
}

// ---------- 8. Coefficient multiplicateur d'une évolution ----------
function genCoefficientMultiplicateurNumeric() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 90);
  const answer = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première) — Évolutions et pourcentages",
    prompt: `Une grandeur ${direction} de ${p} %. Quel est le coefficient multiplicateur associé ?`,
    answer,
    tolerance: 0.001,
    steps: [`${fr(answer)}`],
  };
}

// =========================== Statistiques descriptives (2nde) ===========================

// ---------- 9. Médiane d'une série ----------
function genMedianeNumeric() {
  const n = pick([7, 9]);
  const valeurs = Array.from({ length: n }, () => randInt(0, 50)).sort((a, b) => a - b);
  const answer = valeurs[(n - 1) / 2];
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première) — Statistiques",
    prompt: `Calcule la médiane de la série suivante, déjà triée : ${valeurs.join(" ; ")}.`,
    answer,
    steps: [`\\text{La série contient } ${n} \\text{ valeurs, la médiane est la valeur centrale : } ${answer}`],
  };
}

// ---------- 10. Étendue d'une série ----------
function genEtendueNumeric() {
  const n = pick([6, 7, 8, 9]);
  const values = Array.from({ length: n }, () => randInt(0, 50));
  const max = Math.max(...values);
  const min = Math.min(...values);
  const answer = max - min;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première) — Statistiques",
    prompt: `Calcule l'étendue de la série suivante : ${values.join(" ; ")}.`,
    answer,
    steps: [`${max} - ${min} = ${answer}`],
  };
}

// =========================== Probabilités (2nde) ===========================

// ---------- 11. Probabilité simple ----------
function genProbabiliteSimpleNumeric() {
  const total = randInt(20, 40);
  const favorables = randInt(3, total - 3);
  const answer = roundTo(favorables / total, 3);
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première) — Probabilités",
    prompt: `Un sac contient ${total} jetons indiscernables au toucher, dont ${favorables} sont rouges. Quelle est la probabilité de tirer un jeton rouge (valeur décimale, arrondie au millième) ?`,
    answer,
    tolerance: 0.002,
    steps: [`P = \\dfrac{${favorables}}{${total}} \\approx ${fr(answer)}`],
  };
}

// =========================== Puissances et calcul numérique (3e) ===========================

// ---------- 12. Puissances d'un nombre relatif ----------
function genPuissanceRelatifNumeric() {
  const n = nonZero(-8, 8);
  const exp = pick([2, 3]);
  const answer = n ** exp;
  return {
    type: "numeric",
    chapter: "Réviser les bases (Première) — Calcul numérique",
    prompt: `Calcule : \\((${n})^{${exp}}\\)`,
    answer,
    steps: [`${Array.from({ length: exp }, () => `(${n})`).join(" \\times ")} = ${answer}`],
  };
}

// ---------- 13. Lecture d'un tableau de variations ----------
function genLectureTableauVariationsQCM() {
  const sens = pick(["croissante", "décroissante"]);
  const xMin = -3;
  const xMax = 3;
  const yMin = sens === "croissante" ? -2 : 8;
  const yMax = sens === "croissante" ? 8 : -2;
  return {
    type: "qcm",
    chapter: "Réviser les bases (Première) — Lecture de tableaux",
    prompt: `Le tableau de variations d'une fonction f montre que f est ${sens} sur \\([${xMin} ; ${xMax}]\\), avec \\(f(${xMin}) = ${yMin}\\) et \\(f(${xMax}) = ${yMax}\\). Que peut-on dire de \\(f(0)\\) par rapport à \\(f(${xMin})\\) et \\(f(${xMax})\\) ?`,
    answer: sens === "croissante" ? `f(0) \\text{ est compris entre } ${yMin} \\text{ et } ${yMax}` : `f(0) \\text{ est compris entre } ${yMax} \\text{ et } ${yMin}`,
    options: shuffle([
      sens === "croissante" ? `f(0) \\text{ est compris entre } ${yMin} \\text{ et } ${yMax}` : `f(0) \\text{ est compris entre } ${yMax} \\text{ et } ${yMin}`,
      `f(0) \\text{ est supérieur à } ${Math.max(yMin, yMax)}`,
      `f(0) \\text{ est inférieur à } ${Math.min(yMin, yMax)}`,
    ]),
    steps: [`\\text{Comme } f \\text{ est ${sens} sur } [${xMin} ; ${xMax}] \\text{ et que } 0 \\text{ est entre } ${xMin} \\text{ et } ${xMax}, \\text{ f(0) est encadré par les images des bornes.}`],
  };
}

const GENERATORS = [
  genImageFonctionAffineNumeric,
  genTauxVariationNumeric,
  genResoudreEquationSimpleNumeric,
  genEquationProduitNulQCM,
  genImageFonctionCarreNumeric,
  genSensVariationCarreQCM,
  genPourcentageDuneQuantiteNumeric,
  genCoefficientMultiplicateurNumeric,
  genMedianeNumeric,
  genEtendueNumeric,
  genProbabiliteSimpleNumeric,
  genPuissanceRelatifNumeric,
  genLectureTableauVariationsQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "reviser-les-bases-premiere-non-spe",
    title: "Réviser les bases",
    description: "Un tour d'horizon des savoir-faire de 2nde indispensables pour aborder les nouveaux chapitres de Première.",
    level: "premiere-non-spe",
    free: true,
    order: 0,
  },
  generate,
};
