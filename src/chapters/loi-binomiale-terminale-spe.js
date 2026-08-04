// ---------------------------------------------------------------------------
// Chapitre : Loi binomiale (Terminale Spé) — abonnement.
// Paramètres n et p, espérance, variance, écart-type, formule de
// P(X=k), symétrie des coefficients binomiaux, conditions de validité
// d'un schéma de Bernoulli répété.
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

function factorielle(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function arrangement(n, k) {
  let r = 1;
  for (let i = 0; i < k; i++) r *= n - i;
  return r;
}
function combinaison(n, k) {
  if (k < 0 || k > n) return 0;
  return Math.round(arrangement(n, k) / factorielle(k));
}

const P_VALUES = [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9];

// ---------- 1. Identifier le paramètre n d'une loi binomiale (numeric) ----------
function genParametresLoiBinomialeNumeric() {
  const n = randInt(5, 40);
  return {
    type: "numeric",
    chapter: "Loi binomiale — Paramètres",
    prompt: `On tire une carte dans un jeu, on regarde si c'est un pique (succès de probabilité \\(p = \\dfrac{1}{4}\\)), puis on remet la carte. On répète cette expérience ${n} fois de manière identique et indépendante. La variable aléatoire X (nombre de piques obtenus) suit une loi binomiale \\(\\mathcal{B}(n;p)\\). Donne la valeur de n.`,
    answer: n,
    steps: [{ type: "resultat", text: `n = ${n}` }],
  };
}

// ---------- 2. Espérance E(X) = np (numeric) ----------
function genEsperanceNumeric() {
  const n = randInt(5, 60);
  const p = pick(P_VALUES);
  const answer = roundTo(n * p, 4);
  return {
    type: "numeric",
    chapter: "Loi binomiale — Espérance et variance",
    prompt: `X suit une loi binomiale \\(\\mathcal{B}(n;p)\\) avec \\(n = ${n}\\) et \\(p = ${fr(p)}\\). Calcule \\(E(X)\\).`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : E(X) = np." },
      { type: "resultat", text: `E(X) = np = ${n} \\times ${fr(p)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 3. Variance V(X) = np(1-p) (numeric) ----------
function genVarianceNumeric() {
  const n = randInt(5, 60);
  const p = pick(P_VALUES);
  const answer = roundTo(n * p * (1 - p), 4);
  return {
    type: "numeric",
    chapter: "Loi binomiale — Espérance et variance",
    prompt: `X suit une loi binomiale \\(\\mathcal{B}(n;p)\\) avec \\(n = ${n}\\) et \\(p = ${fr(p)}\\). Calcule \\(V(X)\\), arrondie au centième si nécessaire.`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : V(X) = np(1-p)." },
      { type: "resultat", text: `V(X) = np(1-p) = ${n} \\times ${fr(p)} \\times ${fr(roundTo(1 - p, 4))} = ${fr(answer)}` },
    ],
  };
}

// ---------- 4. Écart-type (numeric) ----------
function genEcartTypeNumeric() {
  const n = randInt(5, 60);
  const p = pick(P_VALUES);
  const variance = n * p * (1 - p);
  const answer = roundTo(Math.sqrt(variance), 4);
  return {
    type: "numeric",
    chapter: "Loi binomiale — Espérance et variance",
    prompt: `X suit une loi binomiale \\(\\mathcal{B}(n;p)\\) avec \\(n = ${n}\\) et \\(p = ${fr(p)}\\). Calcule l'écart-type \\(\\sigma(X)\\), arrondi au centième.`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : σ(X) = √(np(1-p))." },
      { type: "resultat", text: `\\sigma(X) = \\sqrt{np(1-p)} = \\sqrt{${fr(roundTo(variance, 4))}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 5. Probabilité ponctuelle P(X=k) (numeric) ----------
function genProbabilitePonctuelleNumeric() {
  const n = randInt(3, 6);
  const k = randInt(0, n);
  const p = pick(P_VALUES);
  const answer = roundTo(combinaison(n, k) * p ** k * (1 - p) ** (n - k), 4);
  return {
    type: "numeric",
    chapter: "Loi binomiale — Calcul de probabilités",
    prompt: `X suit une loi binomiale \\(\\mathcal{B}(n;p)\\) avec \\(n = ${n}\\) et \\(p = ${fr(p)}\\). Calcule \\(P(X=${k})\\), arrondie au millième.`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : P(X=k) = (n k)·p^k·(1-p)^(n-k)." },
      { type: "resultat", text: `P(X=${k}) = \\dbinom{${n}}{${k}} \\times ${fr(p)}^{${k}} \\times ${fr(roundTo(1 - p, 4))}^{${n - k}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 6. Reconnaître la formule de P(X=k) (QCM) ----------
function genFormuleProbabiliteQCM() {
  const n = randInt(4, 12);
  let k = randInt(1, n - 1);
  if (k === n - k) k = k === 1 ? k + 1 : k - 1; // évite k = n-k, qui rend certains distracteurs identiques à la réponse
  const correct = `\\dbinom{${n}}{${k}}p^{${k}}(1-p)^{${n - k}}`;
  const options = shuffle([
    correct,
    `\\dbinom{${n}}{${k}}p^{${n - k}}(1-p)^{${k}}`,
    `p^{${k}}(1-p)^{${n - k}}`,
    `\\dbinom{${n}}{${n - k}}p^{${k}}(1-p)^{${k}}`,
  ]);
  return {
    type: "qcm",
    chapter: "Loi binomiale — Calcul de probabilités",
    prompt: `X suit une loi binomiale \\(\\mathcal{B}(${n};p)\\). Quelle est l'expression de \\(P(X=${k})\\) ?`,
    answer: correct,
    options,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : P(X=k) = (n k)·p^k·(1-p)^(n-k)." },
      { type: "resultat", text: `P(X=${k}) = ${correct}` },
    ],
  };
}

// ---------- 7. Symétrie des coefficients binomiaux (numeric) ----------
function genCoefficientBinomialSymetrieNumeric() {
  const n = randInt(5, 12);
  const k = randInt(1, n - 1);
  const V = combinaison(n, k);
  return {
    type: "numeric",
    chapter: "Loi binomiale — Coefficients binomiaux",
    prompt: `On sait que \\(\\dbinom{${n}}{${k}} = ${V}\\). En utilisant la symétrie des coefficients binomiaux, donne la valeur de \\(\\dbinom{${n}}{${n - k}}\\).`,
    answer: V,
    steps: [
      { type: "regle", text: "Symétrie des coefficients binomiaux : (n k) = (n, n-k)." },
      { type: "resultat", text: `\\dbinom{${n}}{${n - k}} = \\dbinom{${n}}{${k}} = ${V}` },
    ],
  };
}

// ---------- 8. Identifier un schéma de succès valide (QCM Vrai/Faux) ----------
function genIdentifierSuccesQCM() {
  const cas = pick([
    { description: "On lance un dé et X donne le résultat obtenu (1 à 6). X suit une loi binomiale.", reponse: "Faux", explication: "C'est faux : X n'est pas le comptage d'un nombre de succès dans une répétition d'épreuves à deux issues, c'est directement le résultat d'un seul lancer à 6 issues." },
    { description: "On lance 5 fois une pièce et X compte le nombre de \"Face\" obtenus. X suit une loi binomiale.", reponse: "Vrai", explication: "C'est vrai : 5 répétitions identiques et indépendantes d'une épreuve à deux issues (Face/Pile), X compte le nombre de succès." },
    { description: "On tire successivement et sans remise 3 boules dans une urne, et X compte le nombre de boules rouges. X suit une loi binomiale.", reponse: "Faux", explication: "C'est faux : sans remise, la composition de l'urne change à chaque tirage, donc la probabilité de succès n'est pas constante — les tirages ne sont pas indépendants." },
    { description: "On répète 10 fois, de manière indépendante, une épreuve de Bernoulli de paramètre p, et X compte le nombre de succès. X suit une loi binomiale.", reponse: "Vrai", explication: "C'est vrai : c'est exactement la définition d'une loi binomiale B(n;p)." },
  ]);
  return {
    type: "qcm",
    chapter: "Loi binomiale — Paramètres",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 9. Vrai ou faux sur les propriétés de la loi binomiale (QCM) ----------
function genVraiFauxLoiBinomialeQCM() {
  const cas = pick([
    { description: "Pour \\(X \\sim \\mathcal{B}(n;p)\\), \\(E(X) = np\\).", reponse: "Vrai", explication: "C'est vrai : c'est la formule de référence de l'espérance d'une loi binomiale." },
    { description: "Pour \\(X \\sim \\mathcal{B}(n;p)\\), \\(V(X) = np(1-p)\\).", reponse: "Vrai", explication: "C'est vrai : c'est la formule de référence de la variance d'une loi binomiale." },
    { description: "Pour \\(X \\sim \\mathcal{B}(n;p)\\), \\(V(X) = (1-p)E(X)\\).", reponse: "Vrai", explication: "C'est vrai : comme E(X) = np, on a (1-p)E(X) = (1-p)np = np(1-p) = V(X)." },
    { description: "\\(P(X=k) = \\dbinom{n}{k}p^{n-k}(1-p)^{k}\\).", reponse: "Faux", explication: "C'est faux : les exposants sont inversés. La formule correcte est P(X=k) = (n k)·p^k·(1-p)^(n-k)." },
    { description: "\\(\\dbinom{n}{k} = \\dbinom{n}{n-k}\\).", reponse: "Vrai", explication: "C'est vrai : c'est la propriété de symétrie des coefficients binomiaux." },
  ]);
  return {
    type: "qcm",
    chapter: "Loi binomiale — Espérance et variance",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 10. Retrouver n connaissant E(X) et p (numeric) ----------
function genTrouverNNumeric() {
  const n = randInt(5, 60);
  const p = pick(P_VALUES);
  const E = roundTo(n * p, 4);
  return {
    type: "numeric",
    chapter: "Loi binomiale — Espérance et variance",
    prompt: `X suit une loi binomiale \\(\\mathcal{B}(n;p)\\) avec \\(p = ${fr(p)}\\) et \\(E(X) = ${fr(E)}\\). Détermine n.`,
    answer: n,
    steps: [
      { type: "regle", text: "On inverse la formule E(X) = np pour isoler n : n = E(X)/p." },
      { type: "resultat", text: `n = \\dfrac{E(X)}{p} = \\dfrac{${fr(E)}}{${fr(p)}} = ${n}` },
    ],
  };
}

// ---------- 11. Retrouver p connaissant E(X) et n (numeric) ----------
function genTrouverPNumeric() {
  const n = randInt(5, 60);
  const p = pick(P_VALUES);
  const E = roundTo(n * p, 4);
  return {
    type: "numeric",
    chapter: "Loi binomiale — Espérance et variance",
    prompt: `X suit une loi binomiale \\(\\mathcal{B}(n;p)\\) avec \\(n = ${n}\\) et \\(E(X) = ${fr(E)}\\). Détermine p.`,
    answer: p,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: "On inverse la formule E(X) = np pour isoler p : p = E(X)/n." },
      { type: "resultat", text: `p = \\dfrac{E(X)}{n} = \\dfrac{${fr(E)}}{${n}} = ${fr(p)}` },
    ],
  };
}

// ---------- 12. Probabilité d'au moins un succès (numeric) ----------
function genProbabiliteComplementaireNumeric() {
  const n = randInt(3, 10);
  const p = pick(P_VALUES);
  const p0 = (1 - p) ** n;
  const answer = roundTo(1 - p0, 4);
  return {
    type: "numeric",
    chapter: "Loi binomiale — Calcul de probabilités",
    prompt: `X suit une loi binomiale \\(\\mathcal{B}(n;p)\\) avec \\(n = ${n}\\) et \\(p = ${fr(p)}\\). Calcule \\(P(X \\geqslant 1)\\), arrondie au millième, en utilisant l'événement contraire.`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: "L'événement contraire de « au moins un succès » est « aucun succès » : P(X≥1) = 1 - P(X=0)." },
      { type: "calcul", text: `P(X=0) = (1-${fr(p)})^{${n}} \\approx ${fr(roundTo(p0, 4))}` },
      { type: "resultat", text: `P(X \\geqslant 1) = 1 - P(X=0) \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 13. Conditions de validité du schéma de Bernoulli répété (QCM) ----------
function genIdentifierLoiBinomialeQCM() {
  const cas = pick([
    { description: "Une loi binomiale modélise la répétition d'expériences identiques et indépendantes.", reponse: "Vrai", explication: "C'est vrai : c'est la définition même du schéma de Bernoulli répété qui donne naissance à une loi binomiale." },
    { description: "Une loi binomiale peut s'appliquer même si la probabilité de succès change à chaque répétition.", reponse: "Faux", explication: "C'est faux : la probabilité de succès p doit rester constante à chaque répétition pour que la loi binomiale s'applique." },
    { description: "Une épreuve de Bernoulli n'admet que deux issues possibles : succès ou échec.", reponse: "Vrai", explication: "C'est vrai : c'est la définition d'une épreuve de Bernoulli." },
    { description: "Un tirage sans remise donne toujours lieu à une loi binomiale.", reponse: "Faux", explication: "C'est faux : sans remise, la probabilité de succès change à chaque tirage (les épreuves ne sont pas indépendantes), donc ce n'est pas une loi binomiale." },
  ]);
  return {
    type: "qcm",
    chapter: "Loi binomiale — Paramètres",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 14. Reconnaître la formule de la variance (QCM) ----------
function genFormuleVarianceQCM() {
  const correct = "np(1-p)";
  const options = shuffle([correct, "np", "n(1-p)", "p(1-p)"]);
  return {
    type: "qcm",
    chapter: "Loi binomiale — Espérance et variance",
    prompt: `X suit une loi binomiale \\(\\mathcal{B}(n;p)\\). Quelle est l'expression de \\(V(X)\\) ?`,
    answer: correct,
    options,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : V(X) = np(1-p)." },
      { type: "resultat", text: `V(X) = ${correct}` },
    ],
  };
}

// ---------- 15. Relation V(X) = (1-p)E(X) (numeric) ----------
function genRelationVarianceEsperanceNumeric() {
  const n = randInt(5, 60);
  const p = pick(P_VALUES);
  const E = roundTo(n * p, 4);
  const answer = roundTo((1 - p) * E, 4);
  return {
    type: "numeric",
    chapter: "Loi binomiale — Espérance et variance",
    prompt: `X suit une loi binomiale \\(\\mathcal{B}(n;p)\\) avec \\(p = ${fr(p)}\\) et \\(E(X) = ${fr(E)}\\). En utilisant la relation \\(V(X) = (1-p)E(X)\\), calcule \\(V(X)\\).`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: "On applique directement la relation donnée : V(X) = (1-p)E(X)." },
      { type: "resultat", text: `V(X) = (1-${fr(p)}) \\times ${fr(E)} = ${fr(roundTo(1 - p, 4))} \\times ${fr(E)} = ${fr(answer)}` },
    ],
  };
}

const GENERATORS = [
  genParametresLoiBinomialeNumeric,
  genEsperanceNumeric,
  genVarianceNumeric,
  genEcartTypeNumeric,
  genProbabilitePonctuelleNumeric,
  genFormuleProbabiliteQCM,
  genCoefficientBinomialSymetrieNumeric,
  genIdentifierSuccesQCM,
  genVraiFauxLoiBinomialeQCM,
  genTrouverNNumeric,
  genTrouverPNumeric,
  genProbabiliteComplementaireNumeric,
  genIdentifierLoiBinomialeQCM,
  genFormuleVarianceQCM,
  genRelationVarianceEsperanceNumeric,
];

const DIFFICULTY = {
  genParametresLoiBinomialeNumeric: "facile",
  genEsperanceNumeric: "facile",
  genFormuleProbabiliteQCM: "facile",
  genIdentifierSuccesQCM: "facile",
  genProbabiliteComplementaireNumeric: "facile",
  genVarianceNumeric: "standard",
  genEcartTypeNumeric: "standard",
  genProbabilitePonctuelleNumeric: "standard",
  genCoefficientBinomialSymetrieNumeric: "standard",
  genVraiFauxLoiBinomialeQCM: "standard",
  genIdentifierLoiBinomialeQCM: "standard",
  genTrouverNNumeric: "expert",
  genTrouverPNumeric: "expert",
  genFormuleVarianceQCM: "expert",
  genRelationVarianceEsperanceNumeric: "expert",
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
    id: "loi-binomiale-terminale-spe",
    title: "Loi binomiale",
    description: "Paramètres n et p, espérance, variance, écart-type, calcul de probabilités.",
    pourquoi: "La loi binomiale modélise toute répétition d'expériences identiques et indépendantes : contrôle qualité, sondages, jeux de hasard.",
    level: "terminale-spe",
    free: false,
    order: 13,
  },
  generate,
};
