// ---------------------------------------------------------------------------
// Chapitre : Nombres décimaux (6e) — sous abonnement.
//
// Reprend la tâche intellectuelle des exercices fournis (Mémo 2 "écriture
// décimale / fractions décimales", Mémo 3 "demi-droite graduée", Mémo 4
// "comparer/ranger/encadrer", et une sélection de problèmes), avec des
// nombres, prénoms et contextes différents à chaque génération.
//
// Volontairement laissés de côté (pas automatisables avec le format actuel
// numeric/qcm/text/multi + figures point/segment/droite/cercle) : les
// exercices de coloriage d'aire (Mémo 1), l'enquête à partir de documents
// (ex. 98) et les questions ouvertes type "invente une question" (ex. 95,
// 81.b) qui n'ont pas de réponse unique à corriger automatiquement.
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
const randDecimal = (min, max, decimals) => roundTo(min + Math.random() * (max - min), decimals);

// Affichage français : virgule décimale. `fr` pour le texte normal, `frTex`
// pour l'intérieur d'un bloc LaTeX \( ... \) (accolades autour de la virgule
// pour éviter l'espacement supplémentaire que KaTeX ajoute après une virgule).
const fr = (n) => String(n).replace(".", ",");
const frTex = (n) => String(n).replace(".", "{,}");

function shuffleStatements(items) {
  const order = shuffle(items.map((_, i) => i));
  const options = order.map((i) => items[i].text);
  const answer = order.map((i, newIndex) => (items[i].correct ? newIndex : null)).filter((v) => v !== null);
  return { options, answer };
}

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

function numberToFrenchWords(n) {
  const units = [
    "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
    "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf",
  ];
  const tensWords = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "", "", ""];
  if (n < 20) return units[n];
  if (n < 70) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (u === 0) return tensWords[t];
    if (u === 1) return `${tensWords[t]}-et-un`;
    return `${tensWords[t]}-${units[u]}`;
  }
  if (n < 80) {
    const u = n - 60;
    if (u === 11) return "soixante-et-onze";
    return `soixante-${units[u]}`;
  }
  if (n < 90) {
    const u = n - 80;
    if (u === 0) return "quatre-vingts";
    return `quatre-vingt-${units[u]}`;
  }
  const u = n - 80;
  return `quatre-vingt-${units[u]}`;
}

// ---------- Écriture décimale / fractions décimales (Mémo 2) ----------

function genChiffrePositionDecimal() {
  const unitPart = randInt(1, 999);
  const decimalDigits = [randInt(0, 9), randInt(0, 9), randInt(0, 9)];
  const value = Number(`${unitPart}.${decimalDigits.join("")}`);
  const positions = ["dixièmes", "centièmes", "millièmes"];
  const posIndex = randInt(0, 2);
  const digit = decimalDigits[posIndex];
  return {
    type: "numeric",
    chapter: "Nombres décimaux — Écriture décimale",
    prompt: `Dans le nombre ${fr(value)}, quel est le chiffre des ${positions[posIndex]} ?`,
    answer: digit,
    steps: [
      { type: "regle", text: `On compte les rangs après la virgule : dixièmes, centièmes, millièmes.` },
      { type: "resultat", text: `Le chiffre des ${positions[posIndex]} est ${digit}.` },
    ],
  };
}

function genFractionDecimaleVersDecimal() {
  const k = pick([10, 100, 1000]);
  const decimals = k === 10 ? 1 : k === 100 ? 2 : 3;
  const n = randInt(1, k === 10 ? 999 : k === 100 ? 9999 : 30000);
  const value = roundTo(n / k, decimals);
  const askDecimal = Math.random() < 0.5;
  const rang = k === 10 ? "1 rang" : k === 100 ? "2 rangs" : "3 rangs";
  if (askDecimal) {
    return {
      type: "numeric",
      chapter: "Nombres décimaux — Fractions décimales",
      prompt: `\\(\\dfrac{${n}}{${k}} = ?\\) (écriture décimale)`,
      answer: value,
      steps: [
        { type: "regle", text: `Diviser par ${k}, c'est décaler la virgule de ${rang} vers la gauche.` },
        { type: "resultat", text: `\\(\\dfrac{${n}}{${k}} = ${frTex(value)}\\)` },
      ],
    };
  }
  return {
    type: "numeric",
    chapter: "Nombres décimaux — Fractions décimales",
    prompt: `Quel numérateur complète \\(\\dfrac{?}{${k}} = ${frTex(value)}\\) ?`,
    answer: n,
    steps: [
      { type: "regle", text: `Pour retrouver le numérateur, on fait l'opération inverse : on multiplie par ${k}.` },
      { type: "resultat", text: `${fr(value)} \\times ${k} = ${n}` },
    ],
  };
}

function genDecompositionSommeDecimale() {
  const whole = randInt(1, 90);
  const k = pick([10, 100]);
  const num = randInt(1, k - 1);
  const value = roundTo(whole + num / k, k === 10 ? 1 : 2);
  const fracStr = k === 10 ? `0,${num}` : `0,${String(num).padStart(2, "0")}`;
  return {
    type: "numeric",
    chapter: "Nombres décimaux — Décomposition",
    prompt: `\\(${whole} + \\dfrac{${num}}{${k}} = ?\\)`,
    answer: value,
    steps: [
      { type: "regle", text: `${num}/${k} est ${k} fois plus petit que ${num}, donc ${num}/${k} = ${fracStr}.` },
      { type: "calcul", text: `${whole} + ${num}/${k} = ${whole} + ${fracStr}` },
      { type: "resultat", text: `${whole} + ${fracStr} = ${fr(value)}` },
    ],
  };
}

// ---------- Demi-droite graduée (Mémo 3) — utilise <Figure /> ----------

function genLireAbscisseDecimale() {
  const level = pick([1, 2]);
  const step = level === 1 ? 0.1 : 0.01;
  const decimals = level === 1 ? 1 : 2;
  const left = level === 1 ? randInt(0, 12) : roundTo(randDecimal(1, 12, 1), 1);
  const right = roundTo(left + (level === 1 ? 1 : 0.1), decimals);
  const idx = randInt(1, 9);
  const value = roundTo(left + idx * step, decimals);
  const letter = pick(["A", "B", "C", "D", "M", "N"]);
  const x0 = 20;
  const x1 = 260;
  const y = 100;
  const px = x0 + (idx / 10) * (x1 - x0);
  const figure = {
    points: [
      { id: "endL", x: x0, y, hideDot: true, hideLabel: true },
      { id: "endR", x: x1, y, hideDot: true, hideLabel: true },
      { id: letter, x: px, y, dy: -14 },
    ],
    lines: [{ from: "endL", to: "endR", extend: 6 }],
    freeLabels: [
      { x: x0, y: y + 20, text: fr(left) },
      { x: x1, y: y + 20, text: fr(right) },
    ],
  };
  return {
    type: "numeric",
    chapter: "Nombres décimaux — Droite graduée",
    prompt: `La demi-droite ci-dessous est graduée de ${fr(step)} en ${fr(step)}, de ${fr(left)} à ${fr(right)}. Quelle est l'abscisse du point ${letter} ?`,
    figure,
    answer: value,
    steps: [
      { type: "donnee", text: `Chaque graduation vaut ${fr(step)}.` },
      { type: "calcul", text: `${letter} est à ${idx} graduation${idx > 1 ? "s" : ""} de ${fr(left)} : ${fr(left)} + ${idx} \\times ${fr(step)} = ${fr(value)}` },
    ],
  };
}

function genPlacerPointQCM() {
  const level = pick([1, 2]);
  const step = level === 1 ? 0.1 : 0.01;
  const decimals = level === 1 ? 1 : 2;
  const left = level === 1 ? randInt(0, 12) : roundTo(randDecimal(1, 12, 1), 1);
  const right = roundTo(left + (level === 1 ? 1 : 0.1), decimals);
  const letters = shuffle(["A", "B", "C", "D"]);
  const indices = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((a, b) => a - b);
  const x0 = 20;
  const x1 = 260;
  const y = 100;
  const points = [
    { id: "endL", x: x0, y, hideDot: true, hideLabel: true },
    { id: "endR", x: x1, y, hideDot: true, hideLabel: true },
  ];
  const values = {};
  letters.forEach((letter, i) => {
    const idx = indices[i];
    const px = x0 + (idx / 10) * (x1 - x0);
    points.push({ id: letter, x: px, y, dy: -14 });
    values[letter] = roundTo(left + idx * step, decimals);
  });
  const targetLetter = pick(letters);
  const targetValue = values[targetLetter];
  const figure = {
    points,
    lines: [{ from: "endL", to: "endR", extend: 6 }],
    freeLabels: [
      { x: x0, y: y + 20, text: fr(left) },
      { x: x1, y: y + 20, text: fr(right) },
    ],
  };
  return {
    type: "qcm",
    chapter: "Nombres décimaux — Droite graduée",
    prompt: `La droite est graduée de ${fr(step)} en ${fr(step)}, de ${fr(left)} à ${fr(right)}. Quel point a pour abscisse ${fr(targetValue)} ?`,
    figure,
    answer: targetLetter,
    options: shuffle(letters),
    steps: [
      { type: "donnee", text: `Chaque graduation vaut ${fr(step)}.` },
      { type: "resultat", text: `${targetLetter} correspond à ${fr(targetValue)}.` },
    ],
  };
}

// ---------- Comparer, ranger, encadrer (Mémo 4) ----------

function genComparerDecimaux() {
  // Un décimal sur deux (en moyenne) est délibérément un "piège" : le
  // nombre qui a LE PLUS de chiffres après la virgule n'est pas forcément
  // le plus grand (biais du nombre entier appliqué aux décimaux, ex.
  // 0,7 > 0,65 alors que 65 > 7). Mélanger ce piège avec des paires
  // "normales" dans la même série casse l'heuristique fausse plutôt que de
  // la laisser s'installer (cf. dossier Neurosciences — interleaving).
  const trap = Math.random() < 0.5;
  let a, b;
  if (trap) {
    const shortVal = randDecimal(0.1, 0.9, 1); // ex : 0,7 (1 chiffre après la virgule)
    const longVal = randDecimal(0.01, shortVal - 0.01, 2); // ex : 0,65 (2 chiffres), strictement < shortVal
    [a, b] = Math.random() < 0.5 ? [shortVal, longVal] : [longVal, shortVal];
  } else {
    const decimalsA = pick([1, 2]);
    const decimalsB = pick([1, 2]);
    a = randDecimal(0.01, 90, decimalsA);
    b = randDecimal(0.01, 90, decimalsB);
    while (b === a) b = randDecimal(0.01, 90, decimalsB);
  }
  const correct = a > b ? ">" : "<";
  return {
    type: "qcm",
    chapter: "Nombres décimaux — Comparer",
    prompt: `Complète par < ou > : \\(${frTex(a)}\\) ... \\(${frTex(b)}\\)`,
    answer: correct,
    options: ["<", ">"],
    steps: [
      {
        type: "regle",
        text: `On compare d'abord la partie entière, puis les chiffres après la virgule un par un — le nombre de chiffres après la virgule ne dit rien sur la taille du nombre.`,
      },
      { type: "resultat", text: `${fr(a)} ${correct} ${fr(b)}` },
    ],
  };
}

function genEncadrerEntierConsecutif() {
  const x = randDecimal(1.01, 998.99, 2);
  const answer = Math.floor(x);
  return {
    type: "numeric",
    chapter: "Nombres décimaux — Encadrer",
    prompt: `Quel est l'entier immédiatement inférieur à ${fr(x)} ?`,
    answer,
    steps: [{ type: "resultat", text: `${answer} < ${fr(x)} < ${answer + 1}` }],
  };
}

function genRangerDecimaux() {
  const count = 4;
  const values = new Set();
  while (values.size < count) {
    values.add(randDecimal(1, 50, pick([1, 2])));
  }
  const nums = [...values];
  const asc = Math.random() < 0.5;
  const sorted = [...nums].sort((a, b) => (asc ? a - b : b - a));
  const correctOrder = sorted.map(fr).join(" ; ");
  const wrongReverse = [...nums].sort((a, b) => (asc ? b - a : a - b)).map(fr).join(" ; ");
  const wrongRandom = shuffle(nums).map(fr).join(" ; ");
  const options = shuffle([...new Set([correctOrder, wrongReverse, wrongRandom])]);
  return {
    type: "qcm",
    chapter: "Nombres décimaux — Ranger",
    prompt: `Range dans l'ordre ${asc ? "croissant" : "décroissant"} les nombres suivants : ${nums.map(fr).join(" ; ")}`,
    answer: correctOrder,
    options: options.length >= 2 ? options : [correctOrder, wrongRandom],
    steps: [
      { type: "regle", text: `On compare les nombres un par un.` },
      { type: "resultat", text: `Ordre correct : ${correctOrder}` },
    ],
  };
}

function genEcritureLettresDecimal() {
  const unitPart = randInt(1, 99);
  const centPart = randInt(1, 99);
  const value = roundTo(unitPart + centPart / 100, 2);
  const words = `${numberToFrenchWords(unitPart)} unité${unitPart > 1 ? "s" : ""} et ${numberToFrenchWords(centPart)} centième${centPart > 1 ? "s" : ""}`;
  const fracStr = `0,${String(centPart).padStart(2, "0")}`;
  return {
    type: "numeric",
    chapter: "Nombres décimaux — Écrire en chiffres",
    prompt: `Écris en chiffres : « ${words} ».`,
    answer: value,
    steps: [
      { type: "regle", text: `${centPart}/100 est 100 fois plus petit que ${centPart}, donc ${centPart} centième${centPart > 1 ? "s" : ""} = ${fracStr}.` },
      { type: "resultat", text: `${unitPart} + ${fracStr} = ${fr(value)}` },
    ],
  };
}

function genVraiFauxComparaison() {
  // Même logique de piège délibéré que genComparerDecimaux ci-dessus : une
  // fois sur deux, on compare un décimal "court" à un décimal "long" plus
  // petit que lui, pour ne pas laisser s'installer le réflexe "plus de
  // chiffres = plus grand".
  const trap = Math.random() < 0.5;
  let a, b;
  if (trap) {
    const shortVal = randDecimal(0.1, 0.9, 1);
    const longVal = randDecimal(0.01, shortVal - 0.01, 2);
    [a, b] = Math.random() < 0.5 ? [shortVal, longVal] : [longVal, shortVal];
  } else {
    a = randDecimal(0.01, 40, pick([1, 2]));
    b = randDecimal(0.01, 40, pick([1, 2]));
  }
  const op = pick([">", "<"]);
  const statementHolds = op === ">" ? a > b : a < b;
  const correct = statementHolds ? "Vrai" : "Faux";
  return {
    type: "qcm",
    chapter: "Nombres décimaux — Vrai ou faux",
    prompt: `Vrai ou faux ? \\(${frTex(a)} ${op} ${frTex(b)}\\)`,
    answer: correct,
    options: ["Vrai", "Faux"],
    steps: [
      { type: "calcul", text: `En réalité, ${fr(a)} ${a > b ? ">" : a < b ? "<" : "="} ${fr(b)}.` },
      { type: "resultat", text: `L'affirmation est donc ${correct.toLowerCase()}.` },
    ],
  };
}

// ---------- Problèmes ----------

function genProblemeCocheQuestions() {
  const prenom = pick(prenoms);
  const amount = randDecimal(1, 25, 2);
  const target = roundTo(amount + randDecimal(0.5, 5, 2), 2);
  const price = randDecimal(1, amount + 5, 2);
  const pronom = prenom.endsWith("e") ? "elle" : "il";
  const items = [
    { text: `Combien lui manque-t-il pour avoir ${fr(target)} € ?`, correct: true },
    { text: `Combien de pièces a-t-${pronom} exactement ?`, correct: false },
    { text: `Peut-${pronom} s'acheter un objet à ${fr(price)} € ?`, correct: true },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Nombres décimaux — Problèmes",
    prompt: `${prenom} a ${fr(amount)} € dans sa tirelire. Coche les questions auxquelles tu pourrais répondre avec cette seule information.`,
    options,
    answer,
    steps: [
      { type: "regle", text: `On peut calculer une différence avec un montant donné, ou comparer à un prix donné.` },
      { type: "regle", text: `On ne peut pas savoir combien de pièces il y a sans connaître leur valeur individuelle.` },
    ],
  };
}

function genProblemeVraiFauxAffirmations() {
  const depart = randDecimal(3, 15, 1);
  const ajout = randDecimal(2, 12, 1);
  const total = roundTo(depart + ajout, 1);
  const off = () => pick([-6, -3, -1, 1, 3, 6]);
  const t1 = Math.max(1, roundTo(total + off(), 1));
  const t2 = Math.max(1, roundTo(total + off(), 1));
  const t3 = Math.max(1, roundTo(total + off(), 1));
  const contenant = pick(["bassine", "citerne", "cuve"]);
  const items = [
    { text: `Il a moins de ${fr(t1)} L dans sa ${contenant}.`, correct: total < t1 },
    { text: `Il a plus de ${fr(t2)} L dans sa ${contenant}.`, correct: total > t2 },
    { text: `Il doit encore verser de l'eau pour arriver à ${fr(t3)} L.`, correct: total < t3 },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Nombres décimaux — Problèmes",
    prompt: `${pick(prenoms)} a déjà ${fr(depart)} L d'eau dans sa ${contenant}. Il en verse encore ${fr(ajout)} L. Coche les affirmations vraies.`,
    options,
    answer,
    steps: [{ type: "calcul", text: `Total dans la ${contenant} : ${fr(depart)} + ${fr(ajout)} = ${fr(total)} L.` }],
  };
}

function genProblemeRecetteSuffisante() {
  const flourNeeded = randDecimal(0.3, 0.8, 2);
  const sugarNeeded = randDecimal(0.15, 0.5, 2);
  const flourHave = randDecimal(0.5, 2, 2);
  const sugarHave = randDecimal(0.2, 1.2, 2);
  const items = [
    { text: `Assez de farine pour faire un gâteau.`, correct: flourHave >= flourNeeded },
    { text: `Assez de farine pour faire deux gâteaux.`, correct: flourHave >= 2 * flourNeeded },
    { text: `Assez de sucre pour faire un gâteau.`, correct: sugarHave >= sugarNeeded },
    { text: `Assez de sucre pour faire deux gâteaux.`, correct: sugarHave >= 2 * sugarNeeded },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Nombres décimaux — Problèmes",
    prompt: `Pour un gâteau, il faut ${fr(flourNeeded)} kg de farine et ${fr(sugarNeeded)} kg de sucre. ${pick(prenoms)} a ${fr(flourHave)} kg de farine et ${fr(sugarHave)} kg de sucre dans son placard. Coche les affirmations vraies.`,
    options,
    answer,
    steps: [{ type: "regle", text: `On compare ce qu'il faut à ce qui est disponible, pour un gâteau puis pour deux.` }],
  };
}

function genProblemeCompletePhrase() {
  const kind = pick(["distance", "argent"]);
  if (kind === "distance") {
    const total = randDecimal(6, 25, 1);
    const parcouru = randDecimal(1, total - 1, 1);
    const restant = roundTo(total - parcouru, 1);
    return {
      type: "numeric",
      chapter: "Nombres décimaux — Problèmes",
      prompt: `${pick(prenoms)} est parti(e) faire une randonnée de ${fr(total)} km. Il/elle a déjà parcouru ${fr(parcouru)} km. Combien de kilomètres lui reste-t-il à parcourir ?`,
      answer: restant,
      steps: [{ type: "calcul", text: `${fr(total)} - ${fr(parcouru)} = ${fr(restant)}` }],
    };
  }
  const wallet = randDecimal(5, 20, 2);
  const price = randDecimal(1, wallet - 0.5, 2);
  const askRemaining = Math.random() < 0.5;
  const remaining = roundTo(wallet - price, 2);
  const prenom = pick(prenoms);
  if (askRemaining) {
    return {
      type: "numeric",
      chapter: "Nombres décimaux — Problèmes",
      prompt: `${prenom} a ${fr(wallet)} €. Il/elle s'achète un article à ${fr(price)} €. Combien lui reste-t-il ?`,
      answer: remaining,
      steps: [{ type: "calcul", text: `${fr(wallet)} - ${fr(price)} = ${fr(remaining)}` }],
    };
  }
  return {
    type: "numeric",
    chapter: "Nombres décimaux — Problèmes",
    prompt: `${prenom} avait ${fr(wallet)} €. Après un achat, il/elle lui reste ${fr(remaining)} €. Combien a coûté l'article ?`,
    answer: price,
    steps: [{ type: "calcul", text: `${fr(wallet)} - ${fr(remaining)} = ${fr(price)}` }],
  };
}

function genProblemeDifferenceLongueur() {
  const fil1 = randDecimal(0.5, 3, 2);
  const fil2 = roundTo(fil1 + randDecimal(0.1, 1.5, 2), 2);
  const needed = roundTo(fil2 - fil1, 2);
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  const pronom = p2.endsWith("e") ? "elle" : "il";
  return {
    type: "numeric",
    chapter: "Nombres décimaux — Problèmes",
    prompt: `${p1} a un fil de ${fr(fil1)} m et ${p2} a un fil de ${fr(fil2)} m. Quelle longueur ${p2} doit-${pronom} couper pour avoir la même longueur que ${p1} ?`,
    answer: needed,
    steps: [{ type: "calcul", text: `${fr(fil2)} - ${fr(fil1)} = ${fr(needed)}` }],
  };
}

function genProblemeTrouverPlusGrand() {
  const base = randDecimal(1, 15, 2);
  const diff = randDecimal(0.5, 5, 2);
  const larger = roundTo(base + diff, 2);
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  const pronom = p2.endsWith("e") ? "elle" : "il";
  return {
    type: "numeric",
    chapter: "Nombres décimaux — Problèmes",
    prompt: `${p1} a ${fr(base)} €, il/elle a ${fr(diff)} € de moins que ${p2}. Combien d'argent ${p2} a-t-${pronom} ?`,
    answer: larger,
    steps: [{ type: "calcul", text: `${fr(base)} + ${fr(diff)} = ${fr(larger)}` }],
  };
}

function genProblemeTrouverPlusPetit() {
  const smaller = randDecimal(1, 20, 2);
  const mult = pick([2, 3]);
  const larger = roundTo(smaller * mult, 2);
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  const mot = mult === 2 ? "deux fois" : "trois fois";
  const pronom = p2.endsWith("e") ? "elle" : "il";
  return {
    type: "numeric",
    chapter: "Nombres décimaux — Problèmes",
    prompt: `${p1} a ${fr(larger)} €, ${mot} plus que ${p2}. Combien d'argent ${p2} a-t-${pronom} ?`,
    answer: smaller,
    steps: [{ type: "calcul", text: `${fr(larger)} \\div ${mult} = ${fr(smaller)}` }],
  };
}

const TARIFS = [
  { max: 0.25, price: 4.99 },
  { max: 0.5, price: 6.99 },
  { max: 0.75, price: 8.1 },
  { max: 1, price: 8.8 },
  { max: 2, price: 10.15 },
  { max: 5, price: 15.6 },
  { max: 10, price: 22.7 },
  { max: 15, price: 28.7 },
  { max: 30, price: 35.55 },
];
function priceForWeight(w) {
  const tier = TARIFS.find((t) => w <= t.max);
  return tier ? tier.price : TARIFS[TARIFS.length - 1].price;
}

function genProblemeTarifPoids() {
  const item1 = randDecimal(0.05, 0.3, 3);
  const item2 = randDecimal(0.2, 1.5, 2);
  const item3 = randDecimal(0.5, 2, 2);
  const packaging = randDecimal(0.2, 0.6, 2);
  const total = roundTo(item1 + item2 + item3 + packaging, 3);
  const price = priceForWeight(total);
  const tarifText = TARIFS.map((t) => `jusqu'à ${fr(t.max)} kg → ${fr(t.price)} €`).join(" ; ");
  const prenom = pick(prenoms);
  const objets = pick([
    ["un sac de bonbons", "un pull", "une paire de baskets"],
    ["un livre", "une écharpe", "une paire de gants"],
    ["une trousse", "un tee-shirt", "une casquette"],
  ]);
  return {
    type: "numeric",
    chapter: "Nombres décimaux — Problèmes",
    prompt: `${prenom} veut envoyer un colis contenant ${objets[0]} (${fr(item1)} kg), ${objets[1]} (${fr(item2)} kg) et ${objets[2]} (${fr(item3)} kg). L'emballage vide pèse ${fr(packaging)} kg. Tarifs : ${tarifText}. Combien doit payer ${prenom} pour envoyer ce colis (en €) ?`,
    answer: price,
    steps: [
      { type: "calcul", text: `Poids total : ${fr(item1)} + ${fr(item2)} + ${fr(item3)} + ${fr(packaging)} = ${fr(total)} kg` },
      { type: "resultat", text: `Ce poids correspond au tarif : ${fr(price)} €` },
    ],
  };
}

function genProblemeRubanRestant() {
  const besoin1 = randDecimal(0.5, 2, 2);
  const besoin2 = randDecimal(1, 3, 2);
  const totalBesoin = roundTo(besoin1 + besoin2, 2);
  const roll = pick([3, 5, 10]);
  if (roll <= totalBesoin) return genProblemeRubanRestant();
  const restant = roundTo(roll - totalBesoin, 2);
  const prenom = pick(prenoms);
  const pronom = prenom.endsWith("e") ? "elle" : "il";
  return {
    type: "numeric",
    chapter: "Nombres décimaux — Problèmes",
    prompt: `${prenom} a besoin de ruban pour décorer un cadeau : ${fr(besoin1)} m pour le premier nœud et ${fr(besoin2)} m pour le second. Combien de ruban lui restera-t-il si ${pronom} achète un rouleau de ${roll} m ?`,
    answer: restant,
    steps: [
      { type: "calcul", text: `Besoin total : ${fr(besoin1)} + ${fr(besoin2)} = ${fr(totalBesoin)} m` },
      { type: "calcul", text: `${roll} - ${fr(totalBesoin)} = ${fr(restant)}` },
    ],
  };
}

function genProblemeArgentSuffisant() {
  const amount1 = randDecimal(1, 8, 2);
  const centimesCount = randInt(5, 80);
  const amount2 = roundTo(centimesCount * 0.1, 2);
  const total = roundTo(amount1 + amount2, 2);
  const priceDelta = randDecimal(-4, 4, 2);
  const price = roundTo(Math.max(1, total - priceDelta), 2);
  const enough = total >= price;
  const diff = roundTo(Math.abs(total - price), 2);
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  const prompt = enough
    ? `${p1} a ${fr(amount1)} € et ${p2} a ${centimesCount} pièces de 10 centimes. Ils/elles mettent tout en commun pour acheter un jeu à ${fr(price)} €. Combien leur restera-t-il après l'achat ?`
    : `${p1} a ${fr(amount1)} € et ${p2} a ${centimesCount} pièces de 10 centimes. Ils/elles mettent tout en commun pour acheter un jeu à ${fr(price)} €. Combien leur manque-t-il pour pouvoir l'acheter ?`;
  return {
    type: "numeric",
    chapter: "Nombres décimaux — Problèmes",
    prompt,
    answer: diff,
    steps: [
      { type: "calcul", text: `${p2} a ${centimesCount} \\times 0,10 = ${fr(amount2)} €.` },
      { type: "calcul", text: `Total : ${fr(amount1)} + ${fr(amount2)} = ${fr(total)} €.` },
      { type: "calcul", text: enough ? `${fr(total)} - ${fr(price)} = ${fr(diff)}` : `${fr(price)} - ${fr(total)} = ${fr(diff)}` },
    ],
  };
}

const GENERATORS = [
  genChiffrePositionDecimal,
  genFractionDecimaleVersDecimal,
  genDecompositionSommeDecimale,
  genLireAbscisseDecimale,
  genPlacerPointQCM,
  genComparerDecimaux,
  genEncadrerEntierConsecutif,
  genRangerDecimaux,
  genEcritureLettresDecimal,
  genVraiFauxComparaison,
  genProblemeCocheQuestions,
  genProblemeVraiFauxAffirmations,
  genProblemeRecetteSuffisante,
  genProblemeCompletePhrase,
  genProblemeDifferenceLongueur,
  genProblemeTrouverPlusGrand,
  genProblemeTrouverPlusPetit,
  genProblemeTarifPoids,
  genProblemeRubanRestant,
  genProblemeArgentSuffisant,
];

// ---------- Difficulté (pour les Parcours — voir src/parcours.js) ----------
// Classe chaque générateur en "facile" / "standard" / "expert" SANS toucher à
// son code : une simple table de correspondance nom de fonction -> niveau.
// generate(difficulty) pioche alors dans le sous-ensemble correspondant ; sans
// argument (usage historique, hors Parcours), le comportement est inchangé
// (pioche uniforme dans tous les générateurs). Un générateur absent de la
// table est traité comme "standard" par défaut.
const DIFFICULTY = {
  genChiffrePositionDecimal: "facile",
  genFractionDecimaleVersDecimal: "standard",
  genDecompositionSommeDecimale: "facile",
  genLireAbscisseDecimale: "standard",
  genPlacerPointQCM: "standard",
  genComparerDecimaux: "facile",
  genEncadrerEntierConsecutif: "facile",
  genRangerDecimaux: "standard",
  genEcritureLettresDecimal: "standard",
  genVraiFauxComparaison: "facile",
  genProblemeCocheQuestions: "expert",
  genProblemeVraiFauxAffirmations: "expert",
  genProblemeRecetteSuffisante: "expert",
  genProblemeCompletePhrase: "standard",
  genProblemeDifferenceLongueur: "standard",
  genProblemeTrouverPlusGrand: "standard",
  genProblemeTrouverPlusPetit: "standard",
  genProblemeTarifPoids: "expert",
  genProblemeRubanRestant: "standard",
  genProblemeArgentSuffisant: "expert",
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
    id: "nombres-decimaux",
    title: "Nombres décimaux",
    description: "Écriture décimale, fractions décimales, droite graduée, comparaison et problèmes.",
    pourquoi: "Bien écrire et comparer les nombres décimaux, c'est éviter les erreurs les plus fréquentes sur les prix, les mesures et les notes.",
    level: "sixieme",
    free: false,
    order: 2,
    // Onglet "Cours" (voir ChapterRunner.jsx / CoursPanel.jsx / MindMap.jsx) —
    // chapitre pilote de la fonctionnalité, pas de vidéo pour l'instant
    // (cours.videos resterait un tableau vide/absent tant que Romain n'en a
    // pas tourné pour ce chapitre).
    cours: {
      mindMap: {
        title: "Nombres décimaux",
        branches: [
          {
            title: "Écriture décimale",
            items: [
              "Un nombre décimal a une partie entière et une partie décimale, séparées par une virgule.",
              "Après la virgule, les rangs sont : dixièmes, centièmes, millièmes.",
            ],
            formula: "\\(12,45 = 12 + \\dfrac{4}{10} + \\dfrac{5}{100}\\)",
          },
          {
            title: "Fractions décimales",
            items: [
              "Une fraction décimale a pour dénominateur 10, 100, 1000...",
              "Elle s'écrit directement sous forme décimale.",
            ],
            formula: "\\(\\dfrac{7}{100} = 0,07\\)",
          },
          {
            title: "Comparer deux décimaux",
            items: [
              "On compare d'abord les parties entières.",
              "Si elles sont égales, on compare chiffre par chiffre après la virgule (en complétant avec des zéros si besoin).",
              "Piège classique : 3,4 est plus grand que 3,25 (4 dixièmes, c'est plus que 2 dixièmes).",
            ],
          },
          {
            title: "Droite graduée",
            items: [
              "Placer un décimal, c'est repérer entre quels deux nombres il se trouve.",
              "Un encadrement donne deux bornes qui entourent le nombre.",
            ],
            formula: "\\(4 < 4,6 < 5\\)",
          },
        ],
      },
    },
  },
  generate,
};
