// ---------------------------------------------------------------------------
// Chapitre : Variables aléatoires réelles (Première Spé)
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

// =========================== Générateurs paramétrés ===========================

// ---------- 1. Loi de probabilité : retrouver une probabilité manquante ----------
function genLoiProbabiliteCompleterNumeric() {
  const p1 = pick([0.1, 0.2, 0.25, 0.3]);
  const p2 = pick([0.1, 0.2, 0.25, 0.3]);
  const p3 = pick([0.1, 0.2]);
  const answer = roundTo(1 - p1 - p2 - p3, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Loi de probabilité",
    prompt: `Une variable aléatoire \\(X\\) prend les valeurs \\(1\\), \\(2\\), \\(3\\), \\(4\\), avec \\(P(X=1) = ${fr(p1)}\\), \\(P(X=2) = ${fr(p2)}\\), \\(P(X=3) = ${fr(p3)}\\). Calcule \\(P(X=4)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [`\\text{La somme des probabilités vaut 1.}`, `P(X=4) = 1 - ${fr(p1)} - ${fr(p2)} - ${fr(p3)} = ${fr(answer)}`],
  };
}

// ---------- 2. Espérance d'une variable aléatoire ----------
function genEsperanceNumeric() {
  const valeurs = [randInt(-5, 0), randInt(1, 3), randInt(4, 8)];
  const p1 = pick([0.2, 0.3, 0.4]);
  const p2 = pick([0.2, 0.3]);
  const p3 = roundTo(1 - p1 - p2, 4);
  const answer = roundTo(valeurs[0] * p1 + valeurs[1] * p2 + valeurs[2] * p3, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Espérance",
    prompt: `Une variable aléatoire \\(X\\) suit la loi : \\(P(X=${valeurs[0]}) = ${fr(p1)}\\), \\(P(X=${valeurs[1]}) = ${fr(p2)}\\), \\(P(X=${valeurs[2]}) = ${fr(p3)}\\). Calcule l'espérance \\(E(X)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      `E(X) = \\sum x_i \\times p_i`,
      `E(X) = ${valeurs[0]} \\times ${fr(p1)} + ${valeurs[1]} \\times ${fr(p2)} + ${valeurs[2]} \\times ${fr(p3)}`,
      `E(X) = ${fr(roundTo(valeurs[0] * p1, 4))} + ${fr(roundTo(valeurs[1] * p2, 4))} + ${fr(roundTo(valeurs[2] * p3, 4))} = ${fr(answer)}`,
    ],
  };
}

// ---------- 3. Variance via la formule de König-Huygens ----------
function genVarianceKonigHuygensNumeric() {
  const EX = pick([1, 2, 3, -1, -2]);
  const EX2 = EX * EX + randInt(1, 8);
  const answer = roundTo(EX2 - EX * EX, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Variance",
    prompt: `Une variable aléatoire \\(X\\) vérifie \\(E(X) = ${EX}\\) et \\(E(X^2) = ${EX2}\\). Calcule la variance \\(V(X)\\) à l'aide de la formule de König-Huygens \\(V(X) = E(X^2) - [E(X)]^2\\).`,
    answer,
    steps: [`V(X) = ${EX2} - (${EX})^2 = ${EX2} - ${EX * EX} = ${answer}`],
  };
}

// ---------- 4. Écart-type à partir de la variance ----------
function genEcartTypeNumeric() {
  const variances = [4, 9, 16, 25, 36, 49, 64];
  const V = pick(variances);
  const answer = Math.sqrt(V);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Écart-type",
    prompt: `Une variable aléatoire \\(X\\) a pour variance \\(V(X) = ${V}\\). Calcule son écart-type \\(\\sigma(X) = \\sqrt{V(X)}\\).`,
    answer,
    steps: [`\\sigma(X) = \\sqrt{${V}} = ${answer}`],
  };
}

// ---------- 5. Linéarité de l'espérance : E(aX + b) ----------
function genLineariteEsperanceNumeric() {
  const EX = randInt(-6, 6);
  const a = nonZero(-5, 5);
  const b = randInt(-10, 10);
  const answer = a * EX + b;
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Linéarité de l'espérance",
    prompt: `Une variable aléatoire \\(X\\) vérifie \\(E(X) = ${EX}\\). Calcule \\(E(${a}X ${b >= 0 ? "+" : "-"} ${Math.abs(b)})\\) (formule \\(E(aX+b) = aE(X)+b\\)).`,
    answer,
    steps: [`E(${a}X ${b >= 0 ? "+" : "-"} ${Math.abs(b)}) = ${a} \\times ${EX} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${a * EX} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}`],
  };
}

// ---------- 6. Linéarité de la variance : V(aX + b) = a²V(X) ----------
function genLineariteVarianceNumeric() {
  const VX = pick([2, 3, 4, 5, 6]);
  const a = nonZero(-4, 4);
  const answer = a * a * VX;
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Linéarité de la variance",
    prompt: `Une variable aléatoire \\(X\\) vérifie \\(V(X) = ${VX}\\). Calcule \\(V(${a}X + 5)\\) (formule \\(V(aX+b) = a^2 V(X)\\), le terme \\(b\\) n'a aucun effet sur la variance).`,
    answer,
    steps: [`V(${a}X + 5) = ${a}^2 \\times V(X) = ${a * a} \\times ${VX} = ${answer}`],
  };
}

// ---------- 7. Jeu équitable : déterminer le gain manquant ----------
function genJeuEquitableNumeric() {
  const gain1 = randInt(2, 10);
  const p1 = pick([0.2, 0.25, 0.4, 0.5]);
  const perte = randInt(1, 5);
  const p2 = roundTo(1 - p1, 4);
  const answer = roundTo((perte * p2) / p1, 2);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Jeu équitable",
    prompt: `Dans un jeu, on gagne \\(g\\) euros avec une probabilité de \\(${fr(p1)}\\), ou on perd \\(${perte}\\) euros avec une probabilité de \\(${fr(p2)}\\). Pour que le jeu soit équitable (espérance de gain nulle), calcule la valeur de \\(g\\) (valeur arrondie au centième).`,
    answer,
    tolerance: 0.01,
    steps: [
      `E(\\text{gain}) = g \\times ${fr(p1)} - ${perte} \\times ${fr(p2)} = 0`,
      `g = \\dfrac{${perte} \\times ${fr(p2)}}{${fr(p1)}} = ${fr(answer)}`,
    ],
  };
}

// ---------- 8. Lecture de P(X = a) dans une loi de probabilité ----------
function genLecturePXEgalANumeric() {
  const p1 = pick([0.1, 0.2, 0.3]);
  const p2 = pick([0.15, 0.25, 0.35]);
  const p3 = roundTo(1 - p1 - p2, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Loi de probabilité",
    prompt: `Une variable aléatoire \\(X\\) suit la loi : \\(P(X=1) = ${fr(p1)}\\), \\(P(X=2) = ${fr(p2)}\\), \\(P(X=3) = ${fr(p3)}\\). Donne la valeur de \\(P(X=3)\\).`,
    answer: p3,
    tolerance: 0.0005,
    steps: [`P(X=3) = ${fr(p3)}`],
  };
}

// ---------- 9. Calcul de P(X ≤ a) (cumul) ----------
function genPXInferieurEgalNumeric() {
  const p1 = pick([0.1, 0.15, 0.2]);
  const p2 = pick([0.2, 0.25, 0.3]);
  const p3 = pick([0.1, 0.15]);
  const p4 = roundTo(1 - p1 - p2 - p3, 4);
  const answer = roundTo(p1 + p2 + p3, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Loi de probabilité",
    prompt: `Une variable aléatoire \\(X\\) prend les valeurs \\(1, 2, 3, 4\\) avec \\(P(X=1) = ${fr(p1)}\\), \\(P(X=2) = ${fr(p2)}\\), \\(P(X=3) = ${fr(p3)}\\), \\(P(X=4) = ${fr(p4)}\\). Calcule \\(P(X \\leq 3)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [`P(X \\leq 3) = P(X=1) + P(X=2) + P(X=3) = ${fr(p1)} + ${fr(p2)} + ${fr(p3)} = ${fr(answer)}`],
  };
}

// ---------- 10. Interpréter les notations {X=a} et {X≤a} ----------
function genInterpreterNotationsQCM() {
  const cas = pick([
    { description: "\\(P(X = 3)\\)", reponse: "La probabilité que X soit exactement égal à 3" },
    { description: "\\(P(X \\leq 3)\\)", reponse: "La probabilité que X soit inférieur ou égal à 3" },
  ]);
  return {
    type: "qcm",
    chapter: "Variables aléatoires — Notations",
    prompt: `Comment interprète-t-on \\(${cas.description}\\) ?`,
    answer: cas.reponse,
    options: ["La probabilité que X soit exactement égal à 3", "La probabilité que X soit inférieur ou égal à 3"],
    steps: [cas.reponse],
  };
}

// ---------- 11. Calcul d'espérance dans un jeu simple ----------
function genEsperanceJeuNumeric() {
  const gain = randInt(5, 20);
  const perte = randInt(1, 8);
  const p = pick([0.1, 0.2, 0.25, 0.3, 0.4]);
  const q = roundTo(1 - p, 4);
  const answer = roundTo(gain * p - perte * q, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Espérance",
    prompt: `Dans un jeu, un joueur gagne \\(${gain}\\) euros avec une probabilité de \\(${fr(p)}\\), ou perd \\(${perte}\\) euros avec une probabilité de \\(${fr(q)}\\). Calcule l'espérance de gain de ce jeu.`,
    answer,
    tolerance: 0.0005,
    steps: [`E(\\text{gain}) = ${gain} \\times ${fr(p)} - ${perte} \\times ${fr(q)} = ${fr(roundTo(gain * p, 4))} - ${fr(roundTo(perte * q, 4))} = ${fr(answer)}`],
  };
}

// ---------- 12. Comparer deux jeux par leur espérance ----------
function genComparerJeuxQCM() {
  const e1 = roundTo(randInt(-5, 5) + Math.random() * 0.9, 2);
  let e2 = roundTo(randInt(-5, 5) + Math.random() * 0.9, 2);
  while (roundTo(e2, 1) === roundTo(e1, 1)) e2 = roundTo(randInt(-5, 5) + Math.random() * 0.9, 2);
  const meilleur = e1 > e2 ? "Jeu 1" : "Jeu 2";
  return {
    type: "qcm",
    chapter: "Variables aléatoires — Comparaison de jeux",
    prompt: `Le jeu 1 a une espérance de gain de \\(${fr(e1)}\\) euros. Le jeu 2 a une espérance de gain de \\(${fr(e2)}\\) euros. Quel jeu est le plus avantageux pour le joueur ?`,
    answer: meilleur,
    options: ["Jeu 1", "Jeu 2"],
    steps: [`\\text{Le jeu le plus avantageux est celui dont l'espérance de gain est la plus élevée : ${meilleur}.}`],
  };
}

// ---------- 13. Vrai ou faux sur l'espérance et la variance ----------
function genVraiFauxVariablesAleatoiresQCM() {
  const cas = pick([
    { description: "L'espérance E(aX+b) est égale à aE(X)+b.", reponse: "Vrai" },
    { description: "La variance mesure la dispersion des valeurs autour de l'espérance.", reponse: "Vrai" },
    { description: "V(X) = E(X²) + [E(X)]².", reponse: "Faux" },
    { description: "L'écart-type est toujours positif ou nul.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Variables aléatoires — Vrai ou faux",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 14. Variance depuis une loi à deux valeurs (type Bernoulli) ----------
function genVarianceLoiDeuxValeursNumeric() {
  const x1 = 0;
  const x2 = 1;
  const p = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);
  const q = roundTo(1 - p, 4);
  const EX = p;
  const EX2 = p; // car x2^2 = 1 = x2
  const answer = roundTo(EX2 - EX * EX, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Variance",
    prompt: `Une variable aléatoire \\(X\\) prend la valeur \\(1\\) avec probabilité \\(${fr(p)}\\), et la valeur \\(0\\) avec probabilité \\(${fr(q)}\\). Calcule la variance \\(V(X)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      `E(X) = 1 \\times ${fr(p)} + 0 \\times ${fr(q)} = ${fr(p)}`,
      `E(X^2) = 1^2 \\times ${fr(p)} + 0^2 \\times ${fr(q)} = ${fr(p)}`,
      `V(X) = E(X^2) - [E(X)]^2 = ${fr(p)} - (${fr(p)})^2 = ${fr(answer)}`,
    ],
  };
}

// ---------- 15. Retrouver E(X) connaissant E(aX+b) ----------
function genRetrouverEsperanceNumeric() {
  const a = nonZero(-5, 5);
  const b = randInt(-10, 10);
  const EX = randInt(-8, 8);
  const EaXb = a * EX + b;
  return {
    type: "numeric",
    chapter: "Variables aléatoires — Linéarité de l'espérance",
    prompt: `On sait que \\(E(${a}X ${b >= 0 ? "+" : "-"} ${Math.abs(b)}) = ${EaXb}\\). Calcule \\(E(X)\\).`,
    answer: EX,
    steps: [`${a} \\times E(X) ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${EaXb}`, `E(X) = \\dfrac{${EaXb} ${b >= 0 ? "-" : "+"} ${Math.abs(b)}}{${a}} = \\dfrac{${EaXb - b}}{${a}} = ${EX}`],
  };
}

const GENERATORS = [
  genLoiProbabiliteCompleterNumeric,
  genEsperanceNumeric,
  genVarianceKonigHuygensNumeric,
  genEcartTypeNumeric,
  genLineariteEsperanceNumeric,
  genLineariteVarianceNumeric,
  genJeuEquitableNumeric,
  genLecturePXEgalANumeric,
  genPXInferieurEgalNumeric,
  genInterpreterNotationsQCM,
  genEsperanceJeuNumeric,
  genComparerJeuxQCM,
  genVraiFauxVariablesAleatoiresQCM,
  genVarianceLoiDeuxValeursNumeric,
  genRetrouverEsperanceNumeric,
];

const DIFFICULTY = {
  genLoiProbabiliteCompleterNumeric: "facile",
  genEsperanceNumeric: "facile",
  genLecturePXEgalANumeric: "facile",
  genInterpreterNotationsQCM: "facile",
  genEcartTypeNumeric: "standard",
  genLineariteEsperanceNumeric: "standard",
  genJeuEquitableNumeric: "standard",
  genPXInferieurEgalNumeric: "standard",
  genEsperanceJeuNumeric: "standard",
  genVraiFauxVariablesAleatoiresQCM: "standard",
  genVarianceLoiDeuxValeursNumeric: "standard",
  genVarianceKonigHuygensNumeric: "expert",
  genLineariteVarianceNumeric: "expert",
  genComparerJeuxQCM: "expert",
  genRetrouverEsperanceNumeric: "expert",
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
    id: "variables-aleatoires-premiere-spe",
    title: "Variables aléatoires réelles",
    description: "Loi de probabilité, espérance, variance, écart-type, linéarité de l'espérance, jeu équitable.",
    level: "premiere-spe",
    order: 11,
  },
  generate,
};
