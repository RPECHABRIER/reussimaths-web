// ---------------------------------------------------------------------------
// Chapitre : Loi des grands nombres (Terminale Spé) — abonnement.
// Inégalité de Markov, inégalité de Bienaymé-Tchebychev, inégalité de
// concentration, variance de la moyenne empirique, loi des grands nombres.
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

// ---------- 1. Inégalité de Markov (numeric) ----------
function genInegaliteMarkovNumeric() {
  const EX = randInt(1, 20); // X positive, donc E(X) > 0
  const a = randInt(EX + 1, EX + 20); // a > E(X) pour que le majorant soit informatif
  const answer = roundTo(EX / a, 4);
  return {
    type: "numeric",
    chapter: "Loi des grands nombres — Inégalité de Markov",
    prompt: `X est une variable aléatoire positive avec \\(E(X) = ${EX}\\). D'après l'inégalité de Markov, majore \\(P(X \\geqslant ${a})\\), arrondi au millième.`,
    answer,
    tolerance: 0.001,
    steps: [`P(X \\geqslant ${a}) \\leqslant \\dfrac{E(X)}{${a}} = \\dfrac{${EX}}{${a}} \\approx ${fr(answer)}`],
  };
}

// ---------- 2. Reconnaître la formule de Markov (QCM) ----------
function genFormuleMarkovQCM() {
  const correct = "\\dfrac{E(X)}{a}";
  const options = shuffle([correct, "\\dfrac{a}{E(X)}", "\\dfrac{V(X)}{a}", "\\dfrac{E(X)}{a^2}"]);
  return {
    type: "qcm",
    chapter: "Loi des grands nombres — Inégalité de Markov",
    prompt: `X est une variable aléatoire positive et a > 0. D'après l'inégalité de Markov, quelle est la majoration de \\(P(X \\geqslant a)\\) ?`,
    answer: correct,
    options,
    steps: [`P(X \\geqslant a) \\leqslant ${correct}`],
  };
}

// ---------- 3. Inégalité de Bienaymé-Tchebychev (numeric) ----------
function genInegaliteBienaymeTchebychevNumeric() {
  const VX = randInt(1, 30);
  const a = randInt(1, 10);
  const answer = roundTo(VX / (a * a), 4);
  return {
    type: "numeric",
    chapter: "Loi des grands nombres — Inégalité de Bienaymé-Tchebychev",
    prompt: `X est une variable aléatoire de variance \\(V(X) = ${VX}\\). D'après l'inégalité de Bienaymé-Tchebychev, majore \\(P(|X - E(X)| \\geqslant ${a})\\), arrondi au millième.`,
    answer,
    tolerance: 0.001,
    steps: [`P(|X-E(X)| \\geqslant ${a}) \\leqslant \\dfrac{V(X)}{${a}^2} = \\dfrac{${VX}}{${a * a}} \\approx ${fr(answer)}`],
  };
}

// ---------- 4. Minorant complémentaire de Bienaymé-Tchebychev (numeric) ----------
function genInegaliteBienaymeTchebychevComplementaireNumeric() {
  const VX = randInt(1, 30);
  const a = randInt(1, 10);
  const majorant = VX / (a * a);
  const answer = roundTo(1 - majorant, 4);
  return {
    type: "numeric",
    chapter: "Loi des grands nombres — Inégalité de Bienaymé-Tchebychev",
    prompt: `X est une variable aléatoire de variance \\(V(X) = ${VX}\\). On sait que \\(P(|X - E(X)| \\geqslant ${a}) \\leqslant ${fr(roundTo(majorant, 4))}\\). Utilise l'événement contraire pour minorer \\(P(|X - E(X)| < ${a})\\).`,
    answer,
    tolerance: 0.001,
    steps: [`P(|X-E(X)| < ${a}) \\geqslant 1 - ${fr(roundTo(majorant, 4))} = ${fr(answer)}`],
  };
}

// ---------- 5. Reconnaître la formule de Bienaymé-Tchebychev (QCM) ----------
function genFormuleBienaymeTchebychevQCM() {
  const correct = "\\dfrac{V(X)}{a^2}";
  const options = shuffle([correct, "\\dfrac{E(X)}{a^2}", "\\dfrac{V(X)}{a}", "\\dfrac{a^2}{V(X)}"]);
  return {
    type: "qcm",
    chapter: "Loi des grands nombres — Inégalité de Bienaymé-Tchebychev",
    prompt: `X est une variable aléatoire de variance \\(V(X)\\) et a > 0. D'après l'inégalité de Bienaymé-Tchebychev, quelle est la majoration de \\(P(|X-E(X)| \\geqslant a)\\) ?`,
    answer: correct,
    options,
    steps: [`P(|X-E(X)| \\geqslant a) \\leqslant ${correct}`],
  };
}

// ---------- 6. Inégalité de concentration (numeric) ----------
function genInegaliteConcentrationNumeric() {
  const VX = randInt(1, 20);
  const n = randInt(10, 200);
  const epsilon = pick([0.1, 0.2, 0.5, 1, 2]);
  const answer = roundTo(VX / (n * epsilon * epsilon), 4);
  return {
    type: "numeric",
    chapter: "Loi des grands nombres — Inégalité de concentration",
    prompt: `On répète n = ${n} fois une expérience associée à une variable X de variance \\(V(X) = ${VX}\\), et \\(M_n\\) est la moyenne des résultats. D'après l'inégalité de concentration, majore \\(P(|M_${n} - E(X)| \\geqslant ${fr(epsilon)})\\), arrondi au millième.`,
    answer,
    tolerance: 0.001,
    steps: [`P(|M_${n}-E(X)| \\geqslant ${fr(epsilon)}) \\leqslant \\dfrac{V(X)}{${n} \\times ${fr(epsilon)}^2} = \\dfrac{${VX}}{${roundTo(n * epsilon * epsilon, 4)}} \\approx ${fr(answer)}`],
  };
}

// ---------- 7. Minorant complémentaire de l'inégalité de concentration (numeric) ----------
function genInegaliteConcentrationComplementaireNumeric() {
  const VX = randInt(1, 20);
  const n = randInt(10, 200);
  const epsilon = pick([0.1, 0.2, 0.5, 1, 2]);
  const majorant = VX / (n * epsilon * epsilon);
  const answer = roundTo(1 - majorant, 4);
  return {
    type: "numeric",
    chapter: "Loi des grands nombres — Inégalité de concentration",
    prompt: `On sait que \\(P(|M_${n} - E(X)| \\geqslant ${fr(epsilon)}) \\leqslant ${fr(roundTo(majorant, 4))}\\). Minore \\(P(|M_${n} - E(X)| < ${fr(epsilon)})\\) grâce à l'événement contraire.`,
    answer,
    tolerance: 0.001,
    steps: [`P(|M_${n}-E(X)| < ${fr(epsilon)}) \\geqslant 1 - ${fr(roundTo(majorant, 4))} = ${fr(answer)}`],
  };
}

// ---------- 8. Reconnaître la formule de l'inégalité de concentration (QCM) ----------
function genFormuleConcentrationQCM() {
  const correct = "\\dfrac{V(X)}{n\\varepsilon^2}";
  const options = shuffle([correct, "\\dfrac{V(X)}{n\\varepsilon}", "\\dfrac{V(X)}{\\varepsilon^2}", "\\dfrac{nV(X)}{\\varepsilon^2}"]);
  return {
    type: "qcm",
    chapter: "Loi des grands nombres — Inégalité de concentration",
    prompt: `On répète n fois une expérience associée à X, et \\(M_n\\) est la moyenne des résultats. D'après l'inégalité de concentration, quelle est la majoration de \\(P(|M_n-E(X)| \\geqslant \\varepsilon)\\) ?`,
    answer: correct,
    options,
    steps: [`P(|M_n-E(X)| \\geqslant \\varepsilon) \\leqslant ${correct}`],
  };
}

// ---------- 9. Résoudre n dans l'inégalité de concentration (numeric) ----------
function genResoudreNConcentrationNumeric() {
  const n = randInt(20, 500); // valeur minimale recherchée
  const epsilon = pick([0.1, 0.2, 0.5, 1]);
  const seuil = pick([0.01, 0.02, 0.05, 0.1]);
  const VX = roundTo(n * epsilon * epsilon * seuil, 6);
  return {
    type: "numeric",
    chapter: "Loi des grands nombres — Inégalité de concentration",
    prompt: `On répète n fois une expérience associée à une variable X de variance \\(V(X) = ${fr(VX)}\\), et \\(M_n\\) est la moyenne des résultats. On veut que \\(\\dfrac{V(X)}{n\\varepsilon^2} \\leqslant ${fr(seuil)}\\) avec \\(\\varepsilon = ${fr(epsilon)}\\). Détermine la plus petite valeur entière de n qui convient.`,
    answer: n,
    steps: [`n \\geqslant \\dfrac{V(X)}{\\varepsilon^2 \\times ${fr(seuil)}} = \\dfrac{${fr(VX)}}{${fr(roundTo(epsilon * epsilon, 4))} \\times ${fr(seuil)}} = ${n}`],
  };
}

// ---------- 10. Variance de la moyenne empirique (numeric) ----------
function genVarianceMoyenneEmpiriqueNumeric() {
  const VX = randInt(1, 60);
  const n = randInt(2, 30);
  const answer = roundTo(VX / n, 4);
  return {
    type: "numeric",
    chapter: "Loi des grands nombres — Moyenne empirique",
    prompt: `On répète n = ${n} fois une expérience associée à une variable X de variance \\(V(X) = ${VX}\\), de manière indépendante. Calcule \\(V(M_${n})\\), arrondie au centième si nécessaire.`,
    answer,
    tolerance: 0.01,
    steps: [`V(M_${n}) = \\dfrac{V(X)}{${n}} = \\dfrac{${VX}}{${n}} \\approx ${fr(answer)}`],
  };
}

// ---------- 11. Espérance de la moyenne empirique (QCM) ----------
function genEsperanceMoyenneEmpiriqueQCM() {
  return {
    type: "qcm",
    chapter: "Loi des grands nombres — Moyenne empirique",
    prompt: `On répète n fois une expérience associée à une variable X. Comment s'exprime \\(E(M_n)\\), l'espérance de la moyenne empirique, en fonction de \\(E(X)\\) ?`,
    answer: "E(M_n) = E(X)",
    options: ["E(M_n) = E(X)", "E(M_n) = nE(X)", "E(M_n) = \\dfrac{E(X)}{n}"],
    steps: ["E(M_n) = E(X), quel que soit n."],
  };
}

// ---------- 12. Vrai ou faux sur la loi des grands nombres (QCM) ----------
function genVraiFauxLGNQCM() {
  const cas = pick([
    { description: "Plus n est grand, plus la moyenne empirique \\(M_n\\) se rapproche de \\(E(X)\\).", reponse: "Vrai" },
    { description: "L'inégalité de Markov s'applique à toute variable aléatoire, même si elle prend des valeurs négatives.", reponse: "Faux" },
    { description: "L'inégalité de concentration permet de justifier la loi des grands nombres.", reponse: "Vrai" },
    { description: "L'inégalité de Bienaymé-Tchebychev donne une égalité exacte de la probabilité.", reponse: "Faux" },
    { description: "La loi des grands nombres ne dit rien sur la valeur de \\(M_n\\) pour un n particulier, mais sur son comportement quand n devient grand.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Loi des grands nombres — Moyenne empirique",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 13. Condition d'application de Markov (QCM) ----------
function genConditionMarkovQCM() {
  const cas = pick([
    { description: "L'inégalité de Markov peut être appliquée à une variable aléatoire qui prend des valeurs négatives.", reponse: "Faux" },
    { description: "L'inégalité de Markov nécessite que X soit une variable aléatoire positive.", reponse: "Vrai" },
    { description: "L'inégalité de Markov nécessite de connaître la variance de X.", reponse: "Faux" },
  ]);
  return {
    type: "qcm",
    chapter: "Loi des grands nombres — Inégalité de Markov",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 14. Bienaymé-Tchebychev en nombre d'écarts-types (numeric) ----------
function genChebyshevKEcartTypeNumeric() {
  const k = randInt(2, 10);
  const answer = roundTo(1 / (k * k), 4);
  return {
    type: "numeric",
    chapter: "Loi des grands nombres — Inégalité de Bienaymé-Tchebychev",
    prompt: `X est une variable aléatoire d'écart-type \\(\\sigma\\). D'après l'inégalité de Bienaymé-Tchebychev, majore \\(P(|X-E(X)| \\geqslant ${k}\\sigma)\\), arrondi au millième.`,
    answer,
    tolerance: 0.001,
    steps: [`P(|X-E(X)| \\geqslant ${k}\\sigma) \\leqslant \\dfrac{V(X)}{(${k}\\sigma)^2} = \\dfrac{\\sigma^2}{${k}^2\\sigma^2} = \\dfrac{1}{${k}^2} \\approx ${fr(answer)}`],
  };
}

// ---------- 15. Vrai ou faux sur les inégalités probabilistes (QCM) ----------
function genVraiFauxInegalitesQCM() {
  const cas = pick([
    { description: "L'inégalité de Bienaymé-Tchebychev est plus précise lorsque la variance de X est petite.", reponse: "Vrai" },
    { description: "Une majoration obtenue par l'inégalité de Markov est toujours utile, même supérieure à 1.", reponse: "Faux" },
    { description: "L'inégalité de concentration s'applique à la moyenne \\(M_n\\) de n variables indépendantes de même loi.", reponse: "Vrai" },
    { description: "Augmenter n dans l'inégalité de concentration diminue le majorant de \\(P(|M_n-E(X)|\\geqslant \\varepsilon)\\).", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Loi des grands nombres — Inégalité de concentration",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

const GENERATORS = [
  genInegaliteMarkovNumeric,
  genFormuleMarkovQCM,
  genInegaliteBienaymeTchebychevNumeric,
  genInegaliteBienaymeTchebychevComplementaireNumeric,
  genFormuleBienaymeTchebychevQCM,
  genInegaliteConcentrationNumeric,
  genInegaliteConcentrationComplementaireNumeric,
  genFormuleConcentrationQCM,
  genResoudreNConcentrationNumeric,
  genVarianceMoyenneEmpiriqueNumeric,
  genEsperanceMoyenneEmpiriqueQCM,
  genVraiFauxLGNQCM,
  genConditionMarkovQCM,
  genChebyshevKEcartTypeNumeric,
  genVraiFauxInegalitesQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "loi-grands-nombres-terminale-spe",
    title: "Loi des grands nombres",
    description: "Inégalité de Markov, inégalité de Bienaymé-Tchebychev, inégalité de concentration, moyenne empirique.",
    level: "terminale-spe",
    free: false,
    order: 15,
  },
  generate,
};
