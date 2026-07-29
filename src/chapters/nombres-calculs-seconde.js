// ---------------------------------------------------------------------------
// Chapitre : Nombres et calculs (2nde) — sous abonnement.
//
// Correspond au chapitre 0 du manuel de 2nde : intervalles (conversion
// inégalité ↔ intervalle, appartenance, encadrement transformé par une
// opération), valeur absolue et distance entre deux réels (calcul, résoudre
// |x|=a ou |x-a|⩽b), calcul numérique (simplifier une racine carrée,
// factoriser un facteur carré parfait, additionner des racines carrées de
// même "partie irrationnelle", puissances négatives, règles de calcul sur
// les puissances, écriture scientifique) et opérations sur les fractions.
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique.
// Voir automatismes-seconde.js (thème "nombres-calculs-seconde") pour les
// mini-exercices "Calcul mental" associés.
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

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

// Décompose n en k^2 * m avec m sans facteur carré (m "réduit"), pour simplifier une racine carrée.
function extraireFacteurCarre(n) {
  let k = 1;
  let m = n;
  for (let d = 2; d * d <= m; d++) {
    while (m % (d * d) === 0) {
      m /= d * d;
      k *= d;
    }
  }
  return [k, m];
}

// =========================== Intervalles ===========================

// ---------- 1. Convertir une inégalité en notation d'intervalle ----------
function genConvertirInegaliteIntervalleQCM() {
  const a = randInt(-10, 5);
  const b = randInt(a + 2, a + 15);
  const type = pick(["ouvert-ouvert", "ferme-ferme", "ouvert-ferme", "ferme-ouvert"]);
  let inegalite, bonneReponse;
  if (type === "ouvert-ouvert") {
    inegalite = `${a} < x < ${b}`;
    bonneReponse = `]${a} ; ${b}[`;
  } else if (type === "ferme-ferme") {
    inegalite = `${a} \\leqslant x \\leqslant ${b}`;
    bonneReponse = `[${a} ; ${b}]`;
  } else if (type === "ouvert-ferme") {
    inegalite = `${a} < x \\leqslant ${b}`;
    bonneReponse = `]${a} ; ${b}]`;
  } else {
    inegalite = `${a} \\leqslant x < ${b}`;
    bonneReponse = `[${a} ; ${b}[`;
  }
  const options = shuffle([`]${a} ; ${b}[`, `[${a} ; ${b}]`, `]${a} ; ${b}]`, `[${a} ; ${b}[`]);
  return {
    type: "qcm",
    chapter: "Nombres et calculs — Intervalles",
    prompt: `Quel intervalle correspond à l'inégalité \\(${inegalite}\\) ?`,
    answer: bonneReponse,
    options,
    steps: [`Une inégalité stricte (<) correspond à un crochet ouvert, une inégalité large (⩽) correspond à un crochet fermé.`, `\\(${inegalite}\\) correspond à ${bonneReponse}.`],
  };
}

// ---------- 2. Appartenance à un intervalle ----------
function genAppartientIntervalleQCM() {
  const a = randInt(-10, 5);
  const b = randInt(a + 2, a + 15);
  const ferme1 = Math.random() < 0.5;
  const ferme2 = Math.random() < 0.5;
  const c1 = ferme1 ? "[" : "]";
  const c2 = ferme2 ? "]" : "[";
  const testBorne = Math.random() < 0.4;
  let x;
  if (testBorne) {
    x = pick([a, b]);
  } else {
    x = randInt(a - 5, b + 5);
  }
  const dansIntervalleOuvert = x > a && x < b;
  const appartient = (x === a && ferme1) || (x === b && ferme2) || dansIntervalleOuvert;
  return {
    type: "qcm",
    chapter: "Nombres et calculs — Intervalles",
    prompt: `Le nombre ${x} appartient-il à l'intervalle \\(${c1}${a} ; ${b}${c2}\\) ?`,
    answer: appartient ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [appartient ? `${x} est bien compris dans cet intervalle (en tenant compte des crochets).` : `${x} n'est pas compris dans cet intervalle (en tenant compte des crochets).`],
  };
}

// ---------- 3. Encadrement transformé par une opération ----------
function genEncadrementOperationNumeric() {
  const a = randInt(-10, 5);
  const b = randInt(a + 2, a + 12);
  const k = nonZero(2, 6);
  const c = randInt(-8, 8);
  const askMultiplication = Math.random() < 0.5;
  if (askMultiplication) {
    const newA = k * a + c;
    const newB = k * b + c;
    const askBorneInf = Math.random() < 0.5;
    return {
      type: "numeric",
      chapter: "Nombres et calculs — Intervalles",
      prompt: `On sait que \\(x \\in [${a} ; ${b}]\\). Détermine ${askBorneInf ? "la borne inférieure" : "la borne supérieure"} de l'encadrement de \\(${k}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)}\\).`,
      answer: askBorneInf ? newA : newB,
      steps: [`${a} \\leqslant x \\leqslant ${b}`, `${k * a} \\leqslant ${k}x \\leqslant ${k * b}`, `${newA} \\leqslant ${k}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)} \\leqslant ${newB}`],
    };
  } else {
    const kNeg = -k;
    const newA = kNeg * b + c;
    const newB = kNeg * a + c;
    const askBorneInf = Math.random() < 0.5;
    return {
      type: "numeric",
      chapter: "Nombres et calculs — Intervalles",
      prompt: `On sait que \\(x \\in [${a} ; ${b}]\\). Détermine ${askBorneInf ? "la borne inférieure" : "la borne supérieure"} de l'encadrement de \\(${kNeg}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)}\\) (attention au sens des inégalités, le coefficient est négatif).`,
      answer: askBorneInf ? newA : newB,
      steps: [`${a} \\leqslant x \\leqslant ${b}`, `\\text{Coefficient négatif : les inégalités changent de sens.}`, `${kNeg * b} \\leqslant ${kNeg}x \\leqslant ${kNeg * a}`, `${newA} \\leqslant ${kNeg}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)} \\leqslant ${newB}`],
    };
  }
}

// =========================== Valeur absolue et distance ===========================

// ---------- 4. Calculer une valeur absolue ----------
function genValeurAbsolueNumeric() {
  const a = randInt(-30, 30);
  const b = randInt(-30, 30);
  const answer = Math.abs(a - b);
  return {
    type: "numeric",
    chapter: "Nombres et calculs — Valeur absolue",
    prompt: `Calcule : \\(|${a} - (${b})|\\)`,
    answer,
    steps: [`${a} - (${b}) = ${a - b}`, `|${a - b}| = ${answer}`],
  };
}

// ---------- 5. Distance entre deux réels ----------
function genDistanceDeuxReelsNumeric() {
  const a = randInt(-40, 40);
  const b = randInt(-40, 40);
  const answer = Math.abs(a - b);
  return {
    type: "numeric",
    chapter: "Nombres et calculs — Valeur absolue",
    prompt: `Calcule la distance entre les nombres ${a} et ${b}.`,
    answer,
    steps: [`\\text{distance} = |${a} - (${b})| = ${answer}`],
  };
}

// ---------- 6. Résoudre |x - a| = b (donner la plus grande solution) ----------
function genResoudreValeurAbsolueEgaliteNumeric() {
  const a = randInt(-15, 15);
  const b = randInt(1, 15);
  const sol1 = a + b;
  const sol2 = a - b;
  const askPlusGrande = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Nombres et calculs — Valeur absolue",
    prompt: `Résous l'équation \\(|x - ${a}| = ${b}\\) et donne ${askPlusGrande ? "la plus grande" : "la plus petite"} des deux solutions.`,
    answer: askPlusGrande ? Math.max(sol1, sol2) : Math.min(sol1, sol2),
    steps: [`x - ${a} = ${b} \\text{ ou } x - ${a} = ${-b}`, `x = ${sol1} \\text{ ou } x = ${sol2}`],
  };
}

// ---------- 7. Résoudre une inéquation avec valeur absolue (intervalle) ----------
function genResoudreInequationValeurAbsolueQCM() {
  const a = randInt(-10, 10);
  const b = randInt(1, 10);
  const bonneReponse = `[${a - b} ; ${a + b}]`;
  const mauvaise1 = `[${a - b} ; ${a + b}[`;
  const mauvaise2 = `]-\\infty ; ${a - b}] \\cup [${a + b} ; +\\infty[`;
  return {
    type: "qcm",
    chapter: "Nombres et calculs — Valeur absolue",
    prompt: `Résous l'inéquation \\(|x - ${a}| \\leqslant ${b}\\) (sous forme d'intervalle).`,
    answer: bonneReponse,
    options: shuffle([bonneReponse, mauvaise1, mauvaise2]),
    steps: [`|x - ${a}| \\leqslant ${b} \\iff ${-b} \\leqslant x - ${a} \\leqslant ${b} \\iff ${a - b} \\leqslant x \\leqslant ${a + b}`, `x \\in ${bonneReponse}`],
  };
}

// =========================== Calcul numérique ===========================

// ---------- 8. Simplifier √(a²) ----------
function genSimplifierRacineCarreNumeric() {
  const a = nonZero(-25, 25);
  return {
    type: "numeric",
    chapter: "Nombres et calculs — Racines carrées",
    prompt: `Calcule : \\(\\sqrt{${a}^2}\\)`,
    answer: Math.abs(a),
    steps: [`\\sqrt{${a}^2} = |${a}| = ${Math.abs(a)}`],
  };
}

// ---------- 9. Simplifier une racine carrée (facteur carré parfait) ----------
function genSimplifierRacineFacteurCarreNumeric() {
  const carresParfaits = [4, 9, 16, 25, 36, 49];
  const k0 = pick(carresParfaits);
  const kRacine = Math.round(Math.sqrt(k0));
  const m = pick([2, 3, 5, 6, 7, 10, 11]);
  const n = k0 * m;
  return {
    type: "numeric",
    chapter: "Nombres et calculs — Racines carrées",
    prompt: `On sait que \\(\\sqrt{${n}} = k\\sqrt{${m}}\\) pour un certain entier k. Détermine k.`,
    answer: kRacine,
    steps: [`${n} = ${k0} \\times ${m}`, `\\sqrt{${n}} = \\sqrt{${k0}} \\times \\sqrt{${m}} = ${kRacine}\\sqrt{${m}}`],
  };
}

// ---------- 10. Addition de racines carrées (même partie irrationnelle) ----------
function genSommeRacinesCarreesNumeric() {
  const m = pick([2, 3, 5, 6, 7]);
  const c1 = randInt(2, 8);
  const c2 = randInt(2, 8);
  const answer = c1 + c2;
  return {
    type: "numeric",
    chapter: "Nombres et calculs — Racines carrées",
    prompt: `On sait que \\(${c1}\\sqrt{${m}} + ${c2}\\sqrt{${m}} = k\\sqrt{${m}}\\) pour un certain entier k. Détermine k.`,
    answer,
    steps: [`${c1}\\sqrt{${m}} + ${c2}\\sqrt{${m}} = (${c1} + ${c2})\\sqrt{${m}} = ${answer}\\sqrt{${m}}`],
  };
}

// ---------- 11. Puissance négative ----------
function genPuissanceNegativeNumeric() {
  const n = pick([2, 3, 4, 5, 10]);
  const exp = pick([-1, -2, -3]);
  const answer = roundTo(n ** exp, 5);
  return {
    type: "numeric",
    chapter: "Nombres et calculs — Puissances",
    prompt: `Calcule : \\(${n}^{${exp}}\\) (donne le résultat sous forme décimale).`,
    answer,
    tolerance: 0.0001,
    steps: [`${n}^{${exp}} = \\dfrac{1}{${n}^{${Math.abs(exp)}}} = ${fr(answer)}`],
  };
}

// ---------- 12. Comparer une expression de puissance à 0 (vrai/faux) ----------
function genComparerPuissanceZeroQCM() {
  const n = nonZero(-9, 9);
  const exp = pick([2, 4, -2, -4]);
  const valeur = n ** exp;
  const positif = valeur >= 0;
  return {
    type: "qcm",
    chapter: "Nombres et calculs — Puissances",
    prompt: `L'expression \\((${n})^{${exp}}\\) est-elle positive ou nulle (⩾ 0) ?`,
    answer: positif ? "Vrai" : "Faux",
    options: ["Vrai", "Faux"],
    steps: [`(${n})^{${exp}} = ${fr(roundTo(valeur, 4))}`, positif ? `C'est bien positif ou nul.` : `Ce n'est pas positif ou nul.`],
  };
}

// ---------- 13. Écriture scientifique ----------
function genEcritureScientifiqueNumeric() {
  const coeff = roundTo(randInt(11, 99) / 10, 1);
  const exposant = randInt(-6, 8);
  const nombre = coeff * 10 ** exposant;
  return {
    type: "numeric",
    chapter: "Nombres et calculs — Puissances",
    prompt: `Le nombre \\(${fr(coeff)} \\times 10^{${exposant}}\\) est l'écriture scientifique d'un nombre. Quel est l'exposant de cette écriture scientifique ?`,
    answer: exposant,
    steps: [`\\text{L'exposant est directement lisible dans l'écriture scientifique : } ${exposant}.`],
  };
}

// ---------- 14. Addition de deux fractions ----------
function genAdditionFractionsNumeric() {
  const d1 = randInt(2, 9);
  const d2 = randInt(2, 9);
  const n1 = randInt(1, d1 - 1);
  const n2 = randInt(1, d2 - 1);
  const numResult = n1 * d2 + n2 * d1;
  const denResult = d1 * d2;
  const g = gcd(numResult, denResult);
  const numSimplifie = numResult / g;
  const denSimplifie = denResult / g;
  const askNum = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Nombres et calculs — Fractions",
    prompt: `Calcule \\(\\dfrac{${n1}}{${d1}} + \\dfrac{${n2}}{${d2}}\\), et donne le résultat sous forme de fraction irréductible p/q. Donne ${askNum ? "p (le numérateur)" : "q (le dénominateur)"}.`,
    answer: askNum ? numSimplifie : denSimplifie,
    steps: [`\\dfrac{${n1}}{${d1}} + \\dfrac{${n2}}{${d2}} = \\dfrac{${n1 * d2}}{${d1 * d2}} + \\dfrac{${n2 * d1}}{${d1 * d2}} = \\dfrac{${numResult}}{${denResult}}`, `\\dfrac{${numResult}}{${denResult}} = \\dfrac{${numSimplifie}}{${denSimplifie}}`],
  };
}

// ---------- 15. Comparer deux valeurs absolues (vrai/faux) ----------
function genComparerValeurAbsolueQCM() {
  const a = randInt(-10, 10);
  const b = randInt(-10, 10);
  const c = randInt(1, 15);
  const valeur = Math.abs(a - b);
  const propositionVraie = valeur <= c;
  return {
    type: "qcm",
    chapter: "Nombres et calculs — Valeur absolue",
    prompt: `Un élève affirme que \\(|${a} - (${b})| \\leqslant ${c}\\). Cette affirmation est-elle vraie ?`,
    answer: propositionVraie ? "Vrai" : "Faux",
    options: ["Vrai", "Faux"],
    steps: [`|${a} - (${b})| = ${valeur}`, propositionVraie ? `${valeur} \\leqslant ${c} : c'est vrai.` : `${valeur} > ${c} : c'est faux.`],
  };
}

const GENERATORS = [
  genConvertirInegaliteIntervalleQCM,
  genAppartientIntervalleQCM,
  genEncadrementOperationNumeric,
  genValeurAbsolueNumeric,
  genDistanceDeuxReelsNumeric,
  genResoudreValeurAbsolueEgaliteNumeric,
  genResoudreInequationValeurAbsolueQCM,
  genSimplifierRacineCarreNumeric,
  genSimplifierRacineFacteurCarreNumeric,
  genSommeRacinesCarreesNumeric,
  genPuissanceNegativeNumeric,
  genComparerPuissanceZeroQCM,
  genEcritureScientifiqueNumeric,
  genAdditionFractionsNumeric,
  genComparerValeurAbsolueQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "nombres-calculs-seconde",
    title: "Nombres et calculs",
    description: "Intervalles (conversion, appartenance, encadrement), valeur absolue et distance entre deux réels, racines carrées, puissances, écriture scientifique et fractions.",
    level: "seconde",
    free: false,
    order: 2,
  },
  generate,
};
