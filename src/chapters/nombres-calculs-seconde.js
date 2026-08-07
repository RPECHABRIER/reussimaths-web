// ---------------------------------------------------------------------------
// Chapitre : Nombres et calculs (2nde) — sous abonnement.
//
// Correspond au chapitre 0 du manuel de 2nde : intervalles (conversion
// inégalité ↔ intervalle, appartenance, encadrement transformé par une
// opération), valeur absolue et distance entre deux réels (calcul, résoudre
// |x|=a ou |x-a|⩽b), calcul numérique (simplifier une racine carrée,
// factoriser un facteur carré parfait, additionner des racines carrées de
// même "partie irrationnelle", puissances négatives, règles de calcul sur
// les puissances, écriture scientifique), opérations sur les fractions,
// identités remarquables utilisées « dans les deux sens » (factoriser pour
// résoudre, développer pour calculer mentalement), et comparaison additive
// (différence) / multiplicative (rapport) de deux quantités.
//
// NOTE (audit programme 2026, BO n°14 du 2 avril 2026) : les identités
// remarquables restent un contenu à utiliser en 2nde pour factoriser et
// résoudre (elles sont désormais introduites dès la 3e au collège, mais
// « (a+b)² et (a-b)² sont à travailler en classe de seconde dans les deux
// sens » — commentaire IA-IPR). La comparaison additive/multiplicative entre
// deux quantités est un ajout explicite du programme cible.
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
    steps: [
      { type: "regle", text: `\\text{Une inégalité stricte (<) correspond à un crochet ouvert, une inégalité large (⩽) correspond à un crochet fermé.}` },
      { type: "resultat", text: `${inegalite} \\text{ correspond à } ${bonneReponse}.` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Un crochet fermé ([ ou ]) inclut la borne, un crochet ouvert (] ou [) l'exclut.}` },
      {
        type: "resultat",
        text: appartient
          ? `${x} \\text{ est bien compris dans } ${c1}${a} ; ${b}${c2} \\text{ (en tenant compte des crochets).}`
          : `${x} \\text{ n'est pas compris dans } ${c1}${a} ; ${b}${c2} \\text{ (en tenant compte des crochets).}`,
      },
    ],
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
      steps: [
        { type: "donnee", text: `${a} \\leqslant x \\leqslant ${b}` },
        { type: "regle", text: `\\text{Multiplier une inégalité par un nombre positif conserve le sens des inégalités.}` },
        { type: "calcul", text: `${k * a} \\leqslant ${k}x \\leqslant ${k * b}` },
        { type: "resultat", text: `${newA} \\leqslant ${k}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)} \\leqslant ${newB}` },
      ],
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
      steps: [
        { type: "donnee", text: `${a} \\leqslant x \\leqslant ${b}` },
        { type: "regle", text: `\\text{Multiplier une inégalité par un nombre négatif inverse le sens des inégalités.}` },
        { type: "calcul", text: `${kNeg * b} \\leqslant ${kNeg}x \\leqslant ${kNeg * a}` },
        { type: "resultat", text: `${newA} \\leqslant ${kNeg}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)} \\leqslant ${newB}` },
      ],
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
    steps: [
      { type: "calcul", text: `${a} - (${b}) = ${a - b}` },
      { type: "resultat", text: `|${a - b}| = ${answer}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{La distance entre deux réels a et b est } |a - b|.` },
      { type: "resultat", text: `\\text{distance} = |${a} - (${b})| = ${answer}` },
    ],
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
    steps: [
      { type: "regle", text: `|X| = ${b} \\iff X = ${b} \\text{ ou } X = ${-b} \\text{ (un nombre a deux nombres qui ont pour valeur absolue } ${b}\\text{ : lui-même et son opposé).}` },
      { type: "calcul", text: `x - ${a} = ${b} \\text{ ou } x - ${a} = ${-b}` },
      { type: "resultat", text: `x = ${sol1} \\text{ ou } x = ${sol2}` },
    ],
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
    steps: [
      { type: "regle", text: `|X| \\leqslant ${b} \\iff ${-b} \\leqslant X \\leqslant ${b} \\text{ (X est à une distance de 0 inférieure ou égale à } ${b}\\text{).}` },
      { type: "calcul", text: `|x - ${a}| \\leqslant ${b} \\iff ${-b} \\leqslant x - ${a} \\leqslant ${b} \\iff ${a - b} \\leqslant x \\leqslant ${a + b}` },
      { type: "resultat", text: `x \\in ${bonneReponse}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Pour tout réel a, } \\sqrt{a^2} = |a| \\text{ (la racine carrée d'un carré est toujours positive).}` },
      { type: "resultat", text: `\\sqrt{${a}^2} = |${a}| = ${Math.abs(a)}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{On cherche le plus grand facteur carré parfait de } ${n}, \\text{ car } \\sqrt{a \\times b} = \\sqrt{a} \\times \\sqrt{b}.` },
      { type: "calcul", text: `${n} = ${k0} \\times ${m}` },
      { type: "resultat", text: `\\sqrt{${n}} = \\sqrt{${k0}} \\times \\sqrt{${m}} = ${kRacine}\\sqrt{${m}}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{On ne peut additionner que des racines carrées de même « partie irrationnelle » (ici } \\sqrt{${m}}\\text{), en additionnant leurs coefficients — comme pour } ax + bx = (a+b)x.` },
      { type: "resultat", text: `${c1}\\sqrt{${m}} + ${c2}\\sqrt{${m}} = (${c1} + ${c2})\\sqrt{${m}} = ${answer}\\sqrt{${m}}` },
    ],
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
    steps: [{ type: "regle", text: `\\text{Rappel : } a^{-n} = \\dfrac{1}{a^{n}}.` }, { type: "resultat", text: `${n}^{${exp}} = \\dfrac{1}{${n}^{${Math.abs(exp)}}} = ${fr(answer)}` }],
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
    steps: [
      { type: "regle", text: `\\text{Une puissance d'exposant pair est toujours positive ou nulle (le signe de la base n'a pas d'importance) ; une puissance d'exposant impair garde le signe de la base.}` },
      { type: "calcul", text: `(${n})^{${exp}} = ${fr(roundTo(valeur, 4))}` },
      { type: "resultat", text: positif ? `C'est bien positif ou nul.` : `Ce n'est pas positif ou nul.` },
    ],
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
    steps: [{ type: "resultat", text: `\\text{L'exposant est directement lisible dans l'écriture scientifique : } ${exposant}.` }],
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
    steps: [
      { type: "regle", text: `\\text{Pour additionner deux fractions, on les met au même dénominateur (ici } ${d1} \\times ${d2} = ${denResult}\\text{).}` },
      { type: "calcul", text: `\\dfrac{${n1}}{${d1}} + \\dfrac{${n2}}{${d2}} = \\dfrac{${n1 * d2}}{${d1 * d2}} + \\dfrac{${n2 * d1}}{${d1 * d2}} = \\dfrac{${numResult}}{${denResult}}` },
      { type: "resultat", text: `\\dfrac{${numResult}}{${denResult}} = \\dfrac{${numSimplifie}}{${denSimplifie}}` },
    ],
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
    steps: [
      { type: "calcul", text: `|${a} - (${b})| = ${valeur}` },
      { type: "resultat", text: propositionVraie ? `${valeur} \\leqslant ${c} : c'est vrai.` : `${valeur} > ${c} : c'est faux.` },
    ],
  };
}

// =========================== Identités remarquables (niveau 2nde) ===========================
// NOTE (audit programme 2026, 3.10) : usage niveau 2nde des identités
// remarquables — développer pour calculer mentalement, factoriser pour
// résoudre (« dans les deux sens »), à distinguer des exercices de simple
// calcul mental sur les identités remarquables déjà présents dans le
// chapitre de révision de 3e (reviser-les-bases-seconde.js).

// ---------- 16. Factoriser une différence de carrés ----------
function genFactoriserDifferenceCarresNumeric() {
  const k = randInt(2, 15);
  const a2 = k * k;
  return {
    type: "numeric",
    chapter: "Nombres et calculs — Identités remarquables",
    prompt: `On factorise \\(x^2 - ${a2}\\) sous la forme \\((x - k)(x + k)\\), grâce à l'identité remarquable \\(a^2 - b^2 = (a-b)(a+b)\\). Quelle est la valeur de k ?`,
    answer: k,
    steps: [
      { type: "regle", text: `${a2} = ${k}^2, \\text{ donc } x^2 - ${a2} = x^2 - ${k}^2 = (x - ${k})(x + ${k}).` },
      { type: "resultat", text: `k = ${k}` },
    ],
  };
}

// ---------- 17. Calcul mental d'un carré via une identité remarquable ----------
function genCalculMentalCarreViaIdentiteNumeric() {
  const base = pick([20, 30, 40, 50, 60, 70, 80, 90]);
  const ecart = randInt(1, 9);
  const plus = Math.random() < 0.5;
  const n = plus ? base + ecart : base - ecart;
  const answer = n * n;
  const identite = plus
    ? `(${base} + ${ecart})^2 = ${base}^2 + 2 \\times ${base} \\times ${ecart} + ${ecart}^2`
    : `(${base} - ${ecart})^2 = ${base}^2 - 2 \\times ${base} \\times ${ecart} + ${ecart}^2`;
  const detail = plus ? `${base ** 2} + ${2 * base * ecart} + ${ecart ** 2} = ${answer}` : `${base ** 2} - ${2 * base * ecart} + ${ecart ** 2} = ${answer}`;
  return {
    type: "numeric",
    chapter: "Nombres et calculs — Identités remarquables",
    prompt: `En utilisant une identité remarquable (on écrira ${n} = ${base} ${plus ? "+" : "-"} ${ecart}), calcule \\(${n}^2\\) sans calculatrice.`,
    answer,
    steps: [
      { type: "regle", text: `n = ${base} ${plus ? "+" : "-"} ${ecart} : ${identite}` },
      { type: "resultat", text: detail },
    ],
  };
}

// ---------- 18. Résoudre une équation par différence de carrés ----------
function genResoudreEquationDifferenceCarresIdentiteNumeric() {
  const k = randInt(2, 12);
  const a2 = k * k;
  return {
    type: "numeric",
    chapter: "Nombres et calculs — Identités remarquables",
    prompt: `On veut résoudre l'équation \\(x^2 - ${a2} = 0\\). En factorisant grâce à l'identité remarquable \\(a^2-b^2=(a-b)(a+b)\\), donne la solution positive.`,
    answer: k,
    steps: [
      { type: "calcul", text: `x^2 - ${a2} = (x - ${k})(x + ${k}) = 0` },
      { type: "regle", text: `\\text{Un produit de facteurs est nul si l'un des facteurs est nul.}` },
      { type: "resultat", text: `x = ${k} \\text{ ou } x = ${-k} \\text{ ; la solution positive est } ${k}.` },
    ],
  };
}

// =========================== Comparer deux quantités ===========================
// NOTE (audit programme 2026, 3.9) : ajout du programme cible — comparaison
// additive (différence) et multiplicative (rapport), et interprétation du
// contexte le plus adapté.

// ---------- 19. Différence ou rapport de deux quantités ----------
function genCompareDifferenceRapportNumeric() {
  const contextes = [
    { unite: "habitants", nomA: "le village A", nomB: "la ville B" },
    { unite: "€", nomA: "le prix du modèle standard", nomB: "le prix du modèle premium" },
    { unite: "vues", nomA: "la vidéo 1", nomB: "la vidéo 2" },
  ];
  const ctx = pick(contextes);
  const A = randInt(20, 500);
  const B = A + randInt(10, 500);
  const askDiff = Math.random() < 0.5;
  if (askDiff) {
    const answer = B - A;
    return {
      type: "numeric",
      chapter: "Nombres et calculs — Comparer deux quantités",
      prompt: `${ctx.nomA} compte ${A} ${ctx.unite} et ${ctx.nomB} compte ${B} ${ctx.unite}. Quelle est leur différence (comparaison additive), en ${ctx.unite} ?`,
      answer,
      steps: [{ type: "calcul", text: `${B} - ${A} = ${answer}` }],
    };
  }
  const answer = roundTo(B / A, 2);
  return {
    type: "numeric",
    chapter: "Nombres et calculs — Comparer deux quantités",
    prompt: `${ctx.nomA} compte ${A} ${ctx.unite} et ${ctx.nomB} compte ${B} ${ctx.unite}. Quel est leur rapport \\(\\dfrac{${B}}{${A}}\\) (comparaison multiplicative), arrondi au centième ?`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `\\dfrac{${B}}{${A}} \\approx ${fr(answer)}` }],
  };
}

// ---------- 20. Choisir la comparaison adaptée au contexte ----------
function genChoisirComparaisonAdapteeQCM() {
  const cases = [
    {
      desc: "Un village de 300 habitants et une métropole de 2 000 000 d'habitants : comment décrire au mieux cet écart ?",
      correct: "Par un rapport (la métropole a environ 6 700 fois plus d'habitants)",
      distractor: "Par une différence (la métropole a 1 999 700 habitants de plus)",
    },
    {
      desc: "Deux notes de contrôle, 12/20 et 14/20 : comment décrire au mieux cet écart ?",
      correct: "Par une différence (2 points d'écart)",
      distractor: "Par un rapport (la deuxième note est environ 1,17 fois la première)",
    },
    {
      desc: "Le capital d'une petite entreprise (10 000 €) et celui d'une multinationale (50 milliards €) : comment décrire au mieux cet écart ?",
      correct: "Par un rapport (la multinationale pèse des millions de fois plus)",
      distractor: "Par une différence (l'écart en euros, un nombre gigantesque et peu parlant)",
    },
  ];
  const c = pick(cases);
  const options = shuffle([c.correct, c.distractor]);
  return {
    type: "qcm",
    chapter: "Nombres et calculs — Comparer deux quantités",
    prompt: c.desc,
    answer: c.correct,
    options,
    steps: [
      {
        type: "regle",
        text: `Quand deux quantités sont d'ordres de grandeur très différents, un rapport (comparaison multiplicative) est plus parlant qu'une différence brute. Quand elles sont proches, une différence (comparaison additive) suffit à décrire l'écart.`,
      },
    ],
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
  genFactoriserDifferenceCarresNumeric,
  genCalculMentalCarreViaIdentiteNumeric,
  genResoudreEquationDifferenceCarresIdentiteNumeric,
  genCompareDifferenceRapportNumeric,
  genChoisirComparaisonAdapteeQCM,
];

const DIFFICULTY = {
  genConvertirInegaliteIntervalleQCM: "facile",
  genAppartientIntervalleQCM: "facile",
  genValeurAbsolueNumeric: "facile",
  genDistanceDeuxReelsNumeric: "facile",
  genSimplifierRacineCarreNumeric: "facile",
  genPuissanceNegativeNumeric: "facile",
  genComparerPuissanceZeroQCM: "facile",
  genAdditionFractionsNumeric: "facile",
  genEncadrementOperationNumeric: "standard",
  genResoudreValeurAbsolueEgaliteNumeric: "standard",
  genSimplifierRacineFacteurCarreNumeric: "standard",
  genSommeRacinesCarreesNumeric: "standard",
  genEcritureScientifiqueNumeric: "standard",
  genComparerValeurAbsolueQCM: "standard",
  genFactoriserDifferenceCarresNumeric: "standard",
  genCalculMentalCarreViaIdentiteNumeric: "standard",
  genCompareDifferenceRapportNumeric: "facile",
  genChoisirComparaisonAdapteeQCM: "facile",
  genResoudreInequationValeurAbsolueQCM: "expert",
  genResoudreEquationDifferenceCarresIdentiteNumeric: "expert",
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
    id: "nombres-calculs-seconde",
    title: "Nombres et calculs",
    description: "Intervalles (conversion, appartenance, encadrement), valeur absolue et distance entre deux réels, racines carrées, puissances, écriture scientifique, fractions, identités remarquables et comparaison de deux quantités.",
    pourquoi: "Les intervalles et la valeur absolue permettent d'exprimer précisément une marge d'erreur ou une plage de valeurs acceptables — utilisé en sciences et en génie industriel.",
    level: "seconde",
    free: false,
    order: 2,
  },
  generate,
};
