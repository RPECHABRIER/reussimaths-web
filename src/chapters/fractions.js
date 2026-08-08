// ---------------------------------------------------------------------------
// Chapitre : Fractions (6e) — sous abonnement.
//
// Reprend la tâche intellectuelle des exercices fournis (Mémo 1 "fraction de
// l'unité / fraction partage", Mémo 2 "fraction quotient", Mémos 3-4
// "fractions égales / différentes écritures", Mémo 5 "comparer, encadrer,
// ranger", Mémo 6 "calculer avec les fractions", et une sélection de
// problèmes), avec des nombres, prénoms et contextes différents à chaque
// génération.
//
// Convention pour les résultats "fraction" : comme l'application ne dispose
// pas d'un type de réponse "fraction" dédié, chaque exercice est reformulé
// pour avoir une réponse numérique unique et non ambiguë — soit une valeur
// décimale (arrondie si besoin), soit le numérateur/dénominateur manquant
// d'une égalité de fractions à dénominateur commun connu (ex : "3/10 + 4/10
// = ?/10", on ne demande que le numérateur).
//
// Volontairement laissés de côté (pas automatisables avec le format actuel
// numeric/qcm/text/multi + figures point/segment/droite/cercle) : les
// exercices de coloriage de figures/bandes (Mémo 1, ex. 1-15, 41, 44),
// le pliage physique de bande de papier (ex. 147), les questions ouvertes
// type "invente une question" (ex. 129, 143) et le problème à plusieurs
// inconnues du partage de facture (ex. 151, trop d'inconnues croisées pour
// une correction automatique fiable).
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

// =========================== Mémo 1 : fraction de l'unité / fraction quotient ===========================

// ---------- 1. Prendre une fraction d'un nombre ----------
function genFractionDunNombreEntier() {
  const den = randInt(2, 12);
  const num = nonZero(1, den * 2);
  const k = randInt(2, 15);
  const nombre = den * k;
  const answer = num * k;
  return {
    type: "numeric",
    chapter: "Fractions — Fraction d'un nombre",
    prompt: `\\(\\dfrac{${num}}{${den}}\\) de ${nombre} = ?`,
    answer,
    steps: [
      { type: "calcul", text: `${nombre} \\div ${den} = ${k}` },
      { type: "calcul", text: `${k} \\times ${num} = ${answer}` },
    ],
  };
}

// ---------- 2. Fraction quotient : écriture décimale (arrondie si besoin) ----------
function genFractionQuotientDecimal() {
  const den = randInt(2, 12);
  const num = randInt(1, den * 6);
  const answer = roundTo(num / den, 2);
  return {
    type: "numeric",
    chapter: "Fractions — Fraction quotient",
    prompt: `Donne l'écriture décimale de \\(\\dfrac{${num}}{${den}}\\), arrondie au centième si besoin.`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `\\(\\dfrac{${num}}{${den}} = ${num} \\div ${den} \\approx ${fr(answer)}\\)` }],
  };
}

// ---------- 3. Repérer une fraction sur une demi-droite graduée ----------
function genLireAbscisseFraction() {
  const den = pick([2, 3, 4, 5]);
  const maxEntier = randInt(2, 4);
  const posNum = randInt(1, maxEntier * den - 1);
  const value = roundTo(posNum / den, 4);
  const letter = pick(["A", "B", "C", "D", "M", "N"]);
  const x0 = 20;
  const x1 = 260;
  const y = 100;
  const px = x0 + (posNum / (maxEntier * den)) * (x1 - x0);
  const figure = {
    points: [
      { id: "endL", x: x0, y, hideDot: true, hideLabel: true },
      { id: "endR", x: x1, y, hideDot: true, hideLabel: true },
      { id: letter, x: px, y, dy: -14 },
    ],
    lines: [{ from: "endL", to: "endR", extend: 6, arrowEnd: true }],
    freeLabels: [
      { x: x0, y: y + 20, text: "0" },
      { x: x1, y: y + 20, text: String(maxEntier) },
    ],
  };
  return {
    type: "numeric",
    chapter: "Fractions — Droite graduée",
    prompt: `La demi-droite ci-dessous va de 0 à ${maxEntier} et chaque unité est partagée en ${den} parts égales. Donne l'écriture décimale de l'abscisse du point ${letter}.`,
    figure,
    answer: value,
    steps: [{ type: "calcul", text: `${letter} est à ${posNum} graduation${posNum > 1 ? "s" : ""} de ${den}e : \\(\\dfrac{${posNum}}{${den}} = ${frTex(value)}\\)` }],
  };
}

// =========================== Mémos 3-4 : fractions égales, décomposition ===========================

// ---------- 4. Trouver le terme manquant d'une égalité de fractions ----------
function genFractionsEgalesTrouver() {
  const a = nonZero(1, 9);
  const b = randInt(2, 10);
  const m = randInt(2, 9);
  const askNumerator = Math.random() < 0.5;
  if (askNumerator) {
    return {
      type: "numeric",
      chapter: "Fractions — Fractions égales",
      prompt: `\\(\\dfrac{${a}}{${b}} = \\dfrac{?}{${b * m}}\\)`,
      answer: a * m,
      steps: [
        { type: "regle", text: `Le dénominateur est passé de ${b} à ${b * m}, donc de ${b} \\times ${m}. On multiplie donc aussi le numérateur par ${m}.` },
        { type: "resultat", text: `${a} \\times ${m} = ${a * m}` },
      ],
    };
  }
  return {
    type: "numeric",
    chapter: "Fractions — Fractions égales",
    prompt: `\\(\\dfrac{${a}}{${b}} = \\dfrac{${a * m}}{?}\\)`,
    answer: b * m,
    steps: [
      { type: "regle", text: `Le numérateur est passé de ${a} à ${a * m}, donc de ${a} \\times ${m}. On multiplie donc aussi le dénominateur par ${m}.` },
      { type: "resultat", text: `${b} \\times ${m} = ${b * m}` },
    ],
  };
}

// ---------- 5. Décomposer une fraction en somme d'un entier et d'une fraction ----------
function genDecomposerFractionEntierFraction() {
  const den = randInt(2, 12);
  const q = randInt(1, 9);
  const r = nonZero(1, den - 1);
  const num = den * q + r;
  return {
    type: "numeric",
    chapter: "Fractions — Décomposition",
    prompt: `Donne l'écriture décimale de \\(${q} + \\dfrac{${r}}{${den}}\\).`,
    answer: roundTo(q + r / den, 4),
    steps: [
      { type: "regle", text: `${den} rentre ${q} fois dans ${num} (reste ${r}) : ${num} = ${den} \\times ${q} + ${r}.` },
      { type: "calcul", text: `\\(\\dfrac{${num}}{${den}} = ${q} + \\dfrac{${r}}{${den}}\\)` },
      { type: "resultat", text: `${q} + \\dfrac{${r}}{${den}} = ${frTex(roundTo(q + r / den, 4))}` },
    ],
  };
}

// =========================== Mémo 5 : comparer, encadrer, ranger ===========================

// ---------- 6. Comparer une fraction à 1 ou à 1/2 ----------
function genComparerFractionUniteDemi() {
  const den = randInt(2, 14);
  const target = pick(["1", "1/2"]);
  const seuil = target === "1" ? den : den / 2;
  const num = Math.random() < 0.34 ? Math.round(seuil) : nonZero(1, den * 2);
  const correct = num > seuil ? ">" : num < seuil ? "<" : "=";
  const targetTex = target === "1" ? "1" : "\\dfrac{1}{2}";
  return {
    type: "qcm",
    chapter: "Fractions — Comparer",
    prompt: `Complète par <, > ou = : \\(\\dfrac{${num}}{${den}}\\) ... ${targetTex}`,
    answer: correct,
    options: ["<", ">", "="],
    steps: [{ type: "calcul", text: `\\(\\dfrac{${num}}{${den}} = ${frTex(roundTo(num / den, 4))}\\)` }],
  };
}

// ---------- 7. Comparer deux fractions ----------
function genComparerDeuxFractions() {
  const mode = pick(["memeDen", "memeNum", "libre"]);
  let a, b, c, d;
  if (mode === "memeDen") {
    b = d = randInt(2, 12);
    a = nonZero(1, 20);
    c = nonZero(1, 20);
  } else if (mode === "memeNum") {
    a = c = nonZero(1, 12);
    b = randInt(2, 12);
    d = randInt(2, 12);
  } else {
    a = nonZero(1, 15);
    b = randInt(2, 12);
    c = nonZero(1, 15);
    d = randInt(2, 12);
  }
  const left = a / b;
  const right = c / d;
  const correct = left > right ? ">" : left < right ? "<" : "=";
  return {
    type: "qcm",
    chapter: "Fractions — Comparer",
    prompt: `Complète par <, > ou = : \\(\\dfrac{${a}}{${b}}\\) ... \\(\\dfrac{${c}}{${d}}\\)`,
    answer: correct,
    options: ["<", ">", "="],
    steps: [{ type: "calcul", text: `\\(\\dfrac{${a}}{${b}} \\approx ${roundTo(left, 3)}\\) ; \\(\\dfrac{${c}}{${d}} \\approx ${roundTo(right, 3)}\\)` }],
  };
}

// ---------- 8. Encadrer une fraction par deux entiers consécutifs ----------
function genEncadrerFraction() {
  const den = randInt(2, 12);
  const num = randInt(den + 1, den * 9);
  const answer = Math.floor(num / den);
  return {
    type: "numeric",
    chapter: "Fractions — Encadrer",
    prompt: `Quel est le plus grand entier inférieur ou égal à \\(\\dfrac{${num}}{${den}}\\) ?`,
    answer,
    steps: [{ type: "calcul", text: `${num} \\div ${den} \\approx ${roundTo(num / den, 2)}` }],
  };
}

// ---------- 9. Ranger des fractions (trouver la plus grande / la plus petite) ----------
function genRangerFractions() {
  let fractions;
  let values;
  do {
    fractions = Array.from({ length: 3 }, () => ({ num: nonZero(1, 15), den: randInt(2, 12) }));
    values = fractions.map((f) => f.num / f.den);
  } while (new Set(values.map((v) => roundTo(v, 4))).size < 3);
  const askMax = Math.random() < 0.5;
  const targetIndex = askMax ? values.indexOf(Math.max(...values)) : values.indexOf(Math.min(...values));
  const options = fractions.map((f) => `\\(\\dfrac{${f.num}}{${f.den}}\\)`);
  return {
    type: "qcm",
    chapter: "Fractions — Ranger",
    prompt: `Parmi ces fractions, laquelle est la plus ${askMax ? "grande" : "petite"} ?`,
    answer: options[targetIndex],
    options,
    steps: fractions.map((f, i) => ({ type: "calcul", text: `\\(\\dfrac{${f.num}}{${f.den}} \\approx ${roundTo(values[i], 3)}\\)` })),
  };
}

// =========================== Mémo 6 : calculer avec les fractions ===========================

// ---------- 10. Addition de fractions de même dénominateur (numérateur du résultat) ----------
function genAdditionMemeDenominateur() {
  const den = randInt(2, 14);
  const n1 = randInt(1, den * 2);
  const n2 = randInt(1, den * 2);
  return {
    type: "numeric",
    chapter: "Fractions — Additionner",
    prompt: `\\(\\dfrac{${n1}}{${den}} + \\dfrac{${n2}}{${den}} = \\dfrac{?}{${den}}\\) — quel est ce numérateur ?`,
    answer: n1 + n2,
    steps: [
      { type: "regle", text: `Même dénominateur : il ne change pas, on additionne seulement les numérateurs.` },
      { type: "resultat", text: `${n1} + ${n2} = ${n1 + n2}` },
    ],
  };
}

// ---------- 11. Soustraction de fractions de même dénominateur ----------
function genSoustractionMemeDenominateur() {
  const den = randInt(2, 14);
  const n2 = randInt(1, den * 2);
  const n1 = n2 + nonZero(1, den * 2);
  return {
    type: "numeric",
    chapter: "Fractions — Soustraire",
    prompt: `\\(\\dfrac{${n1}}{${den}} - \\dfrac{${n2}}{${den}} = \\dfrac{?}{${den}}\\) — quel est ce numérateur ?`,
    answer: n1 - n2,
    steps: [
      { type: "regle", text: `Même dénominateur : il ne change pas, on soustrait seulement les numérateurs.` },
      { type: "resultat", text: `${n1} - ${n2} = ${n1 - n2}` },
    ],
  };
}

// ---------- 12. Addition de fractions à dénominateurs multiples l'un de l'autre ----------
function genAdditionDenominateursMultiples() {
  const den1 = randInt(2, 9);
  const k = randInt(2, 5);
  const den2 = den1 * k;
  const num1 = nonZero(1, den1 * 2);
  const num2 = randInt(1, den2 * 2);
  const num1Converti = num1 * k;
  const answer = num1Converti + num2;
  return {
    type: "numeric",
    chapter: "Fractions — Additionner (dénominateurs différents)",
    prompt: `\\(\\dfrac{${num1}}{${den1}} + \\dfrac{${num2}}{${den2}} = \\dfrac{?}{${den2}}\\) — quel est ce numérateur ?`,
    answer,
    steps: [
      { type: "regle", text: `${den2} = ${den1} \\times ${k}, donc on multiplie aussi le numérateur de la première fraction par ${k} pour la mettre au même dénominateur.` },
      { type: "calcul", text: `\\(\\dfrac{${num1}}{${den1}} = \\dfrac{${num1Converti}}{${den2}}\\)` },
      { type: "resultat", text: `${num1Converti} + ${num2} = ${answer}` },
    ],
  };
}

// ---------- 13. Multiplier un nombre entier par une fraction ----------
function genMultiplierEntierParFraction() {
  const k = randInt(2, 12);
  const den = randInt(2, 10);
  const num = randInt(1, den * 2);
  const answer = k * num;
  return {
    type: "numeric",
    chapter: "Fractions — Multiplier",
    prompt: `${k} × \\(\\dfrac{${num}}{${den}}\\) = \\(\\dfrac{?}{${den}}\\) — quel est ce numérateur ?`,
    answer,
    steps: [
      { type: "regle", text: `Multiplier une fraction par un nombre entier : on multiplie le numérateur, le dénominateur ne change pas.` },
      { type: "resultat", text: `${k} \\times ${num} = ${answer}` },
    ],
  };
}

// NOTE (audit programme, voir AUTOMATION_LOG.md) : un générateur
// "genMultiplierDeuxFractions" (fraction × fraction, ex. 2/3 × 4/5) a été
// retiré d'ici — la multiplication de deux fractions entre elles n'est PAS
// au programme officiel de 6e (BO du 17 avril 2025, cycle 3) : seule la
// multiplication d'UNE fraction PAR UN NOMBRE ENTIER y figure (voir
// genMultiplierEntierParFraction ci-dessus). La multiplication de deux
// fractions est introduite plus tard dans la scolarité (voir par ex.
// multiplication-division-rationnels.js, niveau "quatrieme").

// =========================== Pourcentages ===========================

// ---------- 15. Appliquer un pourcentage à un nombre ----------
function genAppliquerPourcentageNombre() {
  const base = randInt(1, 15) * 20;
  const pct = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90]);
  const answer = roundTo((base * pct) / 100, 2);
  return {
    type: "numeric",
    chapter: "Fractions — Pourcentages",
    prompt: `${pct} % de ${base} = ?`,
    answer,
    steps: [{ type: "calcul", text: `${base} \\times \\dfrac{${pct}}{100} = ${fr(answer)}` }],
  };
}

// ---------- 16. Réduction : prix avant / après (sens direct ou inverse) ----------
function genPourcentageReductionBidirectionnel() {
  const prixInitial = randInt(2, 50) * 2;
  const pct = pick([10, 20, 25, 50]);
  const reduction = roundTo((prixInitial * pct) / 100, 2);
  const prixFinal = roundTo(prixInitial - reduction, 2);
  const askForward = Math.random() < 0.5;
  if (askForward) {
    return {
      type: "numeric",
      chapter: "Fractions — Problèmes",
      prompt: `Un article coûte ${fr(prixInitial)} €. Il est soldé à ${pct} %. Quel est son nouveau prix, en € ?`,
      answer: prixFinal,
      steps: [
        { type: "calcul", text: `Réduction : ${fr(prixInitial)} \\times \\dfrac{${pct}}{100} = ${fr(reduction)}` },
        { type: "calcul", text: `${fr(prixInitial)} - ${fr(reduction)} = ${fr(prixFinal)}` },
      ],
    };
  }
  return {
    type: "numeric",
    chapter: "Fractions — Problèmes",
    prompt: `Après une réduction de ${pct} %, un article coûte ${fr(prixFinal)} €. Quel était son prix avant réduction, en € ?`,
    answer: prixInitial,
    steps: [
      { type: "regle", text: `Le prix soldé représente ${100 - pct} % du prix initial.` },
      { type: "calcul", text: `${fr(prixFinal)} \\div ${(100 - pct) / 100} = ${fr(prixInitial)}` },
    ],
  };
}

// =========================== Problèmes ===========================

// ---------- 17. Chaîne de partages successifs par moitié (reconstituer le départ) ----------
function genChaineMoitieReserve() {
  const peopleCount = randInt(2, 3);
  const finalAmount = randInt(2, 12);
  const x0 = finalAmount * 2 ** peopleCount;
  const shuffledPrenoms = shuffle(prenoms);
  const prenomPrincipal = shuffledPrenoms[0];
  const beneficiaires = shuffledPrenoms.slice(1, 1 + peopleCount);
  const pronomP = prenomPrincipal.endsWith("e") ? "elle" : "il";
  let recit = `donne la moitié de ce qu'${pronomP === "elle" ? "elle a" : "il a"} à ${beneficiaires[0]}`;
  for (let i = 1; i < beneficiaires.length; i++) {
    recit += `, puis la moitié de ce qui lui reste à ${beneficiaires[i]}`;
  }
  return {
    type: "numeric",
    chapter: "Fractions — Problèmes",
    prompt: `${prenomPrincipal} a une réserve de bonbons. ${pronomP === "elle" ? "Elle" : "Il"} ${recit}. Il lui reste alors ${finalAmount} bonbons. Combien ${prenomPrincipal} avait-${pronomP} de bonbons au départ ?`,
    answer: x0,
    steps: [{ type: "calcul", text: `En remontant les partages par moitié : ${finalAmount} × 2${peopleCount > 1 ? `^${peopleCount}` : ""} = ${x0}` }],
  };
}

// ---------- 18. Coche les questions auxquelles on peut répondre ----------
function genProblemeCocheQuestionsFractions() {
  const prix = randInt(10, 80);
  const pct = pick([10, 20, 25, 50]);
  const items = [
    { text: `Quel est le montant de la réduction sur un article à ${prix} € ?`, correct: true },
    { text: `Quel sera le prix payé après la réduction ?`, correct: true },
    { text: `Combien de clients ont profité de la réduction ?`, correct: false },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Fractions — Problèmes",
    prompt: `Un article coûte ${prix} € et bénéficie d'une réduction de ${pct} %. Coche les questions auxquelles tu pourrais répondre avec ces informations.`,
    options,
    answer,
    steps: [{ type: "regle", text: `On peut calculer un montant de réduction ou un prix final à partir d'un prix et d'un taux, mais pas un nombre de clients.` }],
  };
}

// ---------- 19. Complète la phrase (fraction d'une quantité) ----------
function genProblemeCompletePhraseFraction() {
  const den = pick([2, 3, 4, 5, 6, 8, 10]);
  const num = nonZero(1, den - 1);
  const k = randInt(2, 20);
  const N = den * k;
  const answer = num * k;
  const prenom = pick(prenoms);
  const unit = pick(["g de sucre", "g de farine", "mL d'eau", "cL de sirop", "€"]);
  return {
    type: "numeric",
    chapter: "Fractions — Problèmes",
    prompt: `${prenom} doit prendre \\(\\dfrac{${num}}{${den}}\\) de ${N} ${unit}. Complète : ${prenom} doit prendre ... ${unit}.`,
    answer,
    steps: [{ type: "calcul", text: `\\(\\dfrac{${num}}{${den}} \\times ${N} = ${answer}\\)` }],
  };
}

// ---------- 20. Partage d'une somme et comparaison des dépenses ----------
function genProblemePartageArgentFractions() {
  const gcd = (x, y) => (y ? gcd(y, x % y) : x);
  const lcm = (x, y) => (x * y) / gcd(x, y);
  const b1 = pick([2, 3, 4, 5, 6]);
  const b2 = pick([2, 3, 4, 5, 6]);
  const M = lcm(b1, b2) * randInt(2, 8);
  const a1 = nonZero(1, b1 - 1);
  const a2 = nonZero(1, b2 - 1);
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  const dep1 = (M * a1) / b1;
  const dep2 = (M * a2) / b2;
  const optA = `${p1} a le plus dépensé`;
  const optB = `${p2} a le plus dépensé`;
  const optEq = "Ils ont dépensé la même somme";
  const correct = dep1 > dep2 ? optA : dep2 > dep1 ? optB : optEq;
  return {
    type: "qcm",
    chapter: "Fractions — Problèmes",
    prompt: `${p1} et ${p2} ont reçu chacun ${M} €. ${p1} dépense \\(\\dfrac{${a1}}{${b1}}\\) de cette somme, ${p2} dépense \\(\\dfrac{${a2}}{${b2}}\\) de la sienne. Qui a le plus dépensé ?`,
    answer: correct,
    options: [optA, optB, optEq],
    steps: [{ type: "calcul", text: `${p1} : ${dep1} € ; ${p2} : ${dep2} €.` }],
  };
}

// ---------- 21. Réduction : coche les affirmations vraies ----------
function genProblemeReductionVraiFaux() {
  const prix = pick([20, 30, 40, 50, 60, 80, 100]);
  const pct = pick([10, 20, 25, 50]);
  const reduction = (prix * pct) / 100;
  const prixFinal = prix - reduction;
  const wrongReduction = Math.max(1, reduction + pick([-5, 5, 10]));
  const items = [
    { text: `Le montant de la réduction est de ${reduction} €.`, correct: true },
    { text: `Le montant de la réduction est de ${wrongReduction} €.`, correct: false },
    { text: `Le prix payé est de ${prixFinal} €.`, correct: true },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Fractions — Problèmes",
    prompt: `Un pull coûte ${prix} €. Il y a une réduction de ${pct} %. Coche les affirmations vraies.`,
    options,
    answer,
    steps: [
      { type: "calcul", text: `Réduction : ${prix} \\times \\dfrac{${pct}}{100} = ${reduction}` },
      { type: "calcul", text: `Prix payé : ${prix} - ${reduction} = ${prixFinal}` },
    ],
  };
}

// ---------- 22. Fraction d'un effectif de classe ----------
function genProblemeGroupeElevesFraction() {
  const den = pick([2, 3, 4, 5, 6, 9, 10]);
  const num = nonZero(1, Math.min(den - 1, 3));
  const k = randInt(2, 10);
  const N = den * k;
  const answer = (N * num) / den;
  return {
    type: "numeric",
    chapter: "Fractions — Problèmes",
    prompt: `Dans une classe de ${N} élèves, \\(\\dfrac{${num}}{${den}}\\) des élèves n'ont lu aucun livre pendant les vacances. Combien d'élèves cela représente-t-il ?`,
    answer,
    steps: [{ type: "calcul", text: `\\(\\dfrac{${num}}{${den}} \\times ${N} = ${answer}\\)` }],
  };
}

// ---------- 23. Fractions successives d'un trajet ----------
function genProblemeDistanceParcourueFraction() {
  const den = pick([4, 5, 6, 8, 10, 12]);
  const num1 = nonZero(1, den - 2);
  const num2 = nonZero(1, den - num1 - 1) || 1;
  const usedNum = num1 + num2;
  const askRemaining = Math.random() < 0.5;
  const prenom = pick(prenoms);
  const pronom = prenom.endsWith("e") ? "elle" : "il";
  const answerNum = askRemaining ? den - usedNum : usedNum;
  return {
    type: "numeric",
    chapter: "Fractions — Problèmes",
    prompt: `${prenom} utilise \\(\\dfrac{${num1}}{${den}}\\) de son plein d'essence, puis \\(\\dfrac{${num2}}{${den}}\\) supplémentaires. ${
      askRemaining ? `Quelle fraction du plein lui reste-t-${pronom === "elle" ? "elle" : "il"}` : `Quelle fraction du plein a-t-${pronom === "elle" ? "elle" : "il"} déjà utilisée`
    } ? (donne le numérateur, le dénominateur étant ${den})`,
    answer: answerNum,
    steps: [{ type: "calcul", text: `\\(\\dfrac{${num1}}{${den}} + \\dfrac{${num2}}{${den}} = \\dfrac{${usedNum}}{${den}}\\)` }],
  };
}

// ---------- 24. Comparer deux "sucrosités" (fraction vs pourcentage) ----------
function genProblemeVraiFauxSucreTablette() {
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  const pct1 = pick([10, 15, 20, 25, 30]);
  const den2 = pick([3, 4, 5, 8]);
  const num2 = nonZero(1, den2 - 1);
  const pct2 = roundTo((num2 / den2) * 100, 1);
  const optA = `Celle de ${p1}`;
  const optB = `Celle de ${p2}`;
  const optEq = "Elles sont identiques";
  const correct = pct1 > pct2 ? optA : pct2 > pct1 ? optB : optEq;
  return {
    type: "qcm",
    chapter: "Fractions — Problèmes",
    prompt: `La tablette de chocolat de ${p1} contient ${pct1} % de sucre. La tablette de ${p2} contient \\(\\dfrac{${num2}}{${den2}}\\) de sucre. Quelle tablette est la plus sucrée ?`,
    answer: correct,
    options: [optA, optB, optEq],
    steps: [
      { type: "regle", text: `Pour comparer, on met les deux valeurs en pourcentage : \\(\\dfrac{${num2}}{${den2}} \\times 100\\).` },
      { type: "resultat", text: `${p1} : ${pct1} % ; ${p2} : environ ${pct2} %.` },
    ],
  };
}

// ---------- 25. Rubans et nœuds (division avec reste en contexte de fraction) ----------
function genRubanNoeuds() {
  const den = pick([3, 4, 5, 6]);
  const nbRubans = randInt(3, 8);
  const maxNoeuds = nbRubans * den;
  const nbNoeuds = randInt(den + 1, maxNoeuds - 1);
  const rubansEntiers = Math.floor(nbNoeuds / den);
  const noeudsSurRubanEntame = nbNoeuds % den;
  const askEntame = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Fractions — Problèmes",
    prompt: askEntame
      ? `${nbRubans} rubans identiques permettent chacun de faire ${den} nœuds (chaque nœud utilise \\(\\dfrac{1}{${den}}\\) de ruban). On a déjà réalisé ${nbNoeuds} nœuds au total. Combien de nœuds ont été faits sur le ruban actuellement entamé ?`
      : `${nbRubans} rubans identiques permettent chacun de faire ${den} nœuds (chaque nœud utilise \\(\\dfrac{1}{${den}}\\) de ruban). On a déjà réalisé ${nbNoeuds} nœuds au total. Combien de rubans ont été entièrement utilisés ?`,
    answer: askEntame ? noeudsSurRubanEntame : rubansEntiers,
    steps: [{ type: "calcul", text: `${nbNoeuds} = ${den} \\times ${rubansEntiers} + ${noeudsSurRubanEntame}` }],
  };
}

const GENERATORS = [
  genFractionDunNombreEntier,
  genFractionQuotientDecimal,
  genLireAbscisseFraction,
  genFractionsEgalesTrouver,
  genDecomposerFractionEntierFraction,
  genComparerFractionUniteDemi,
  genComparerDeuxFractions,
  genEncadrerFraction,
  genRangerFractions,
  genAdditionMemeDenominateur,
  genSoustractionMemeDenominateur,
  genAdditionDenominateursMultiples,
  genMultiplierEntierParFraction,
  genAppliquerPourcentageNombre,
  genPourcentageReductionBidirectionnel,
  genChaineMoitieReserve,
  genProblemeCocheQuestionsFractions,
  genProblemeCompletePhraseFraction,
  genProblemePartageArgentFractions,
  genProblemeReductionVraiFaux,
  genProblemeGroupeElevesFraction,
  genProblemeDistanceParcourueFraction,
  genProblemeVraiFauxSucreTablette,
  genRubanNoeuds,
];

// Tag de difficulté par générateur (voir nombres-decimaux.js pour la
// convention complète) — utilisé par les Parcours (débutant/avancé/expert).
const DIFFICULTY = {
  genFractionDunNombreEntier: "facile",
  genFractionQuotientDecimal: "facile",
  genLireAbscisseFraction: "standard",
  genFractionsEgalesTrouver: "facile",
  genDecomposerFractionEntierFraction: "standard",
  genComparerFractionUniteDemi: "facile",
  genComparerDeuxFractions: "standard",
  genEncadrerFraction: "standard",
  genRangerFractions: "standard",
  genAdditionMemeDenominateur: "facile",
  genSoustractionMemeDenominateur: "facile",
  genAdditionDenominateursMultiples: "standard",
  genMultiplierEntierParFraction: "standard",
  genAppliquerPourcentageNombre: "standard",
  genPourcentageReductionBidirectionnel: "standard",
  genChaineMoitieReserve: "expert",
  genProblemeCocheQuestionsFractions: "expert",
  genProblemeCompletePhraseFraction: "expert",
  genProblemePartageArgentFractions: "expert",
  genProblemeReductionVraiFaux: "expert",
  genProblemeGroupeElevesFraction: "expert",
  genProblemeDistanceParcourueFraction: "expert",
  genProblemeVraiFauxSucreTablette: "expert",
  genRubanNoeuds: "expert",
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
    id: "fractions",
    title: "Fractions",
    description: "Fraction d'un nombre, fractions égales, comparer, additionner, multiplier une fraction par un entier.",
    pourquoi: "Les fractions permettent de partager, comparer et mesurer avec précision — indispensables en cuisine, en bricolage comme en sciences.",
    level: "sixieme",
    free: false,
    order: 4,
    // Onglet "Cours" — voir le commentaire équivalent dans
    // src/chapters/nombres-decimaux.js.
    cours: {
      mindMap: {
        title: "Fractions",
        branches: [
          {
            title: "Une fraction, c'est quoi ?",
            items: [
              "Une fraction représente des parts prises sur un tout partagé en parts égales.",
              "Le nombre du bas (dénominateur) ne peut jamais être 0.",
            ],
            formula: "\\(\\dfrac{3}{4}\\) : 3 parts prises sur 4 parts égales.",
          },
          {
            title: "Fractions égales",
            items: [
              "On ne change pas la valeur d'une fraction en multipliant (ou en divisant) le haut et le bas par le même nombre.",
              "Simplifier, c'est diviser haut et bas par un diviseur commun.",
            ],
            formula: "\\(\\dfrac{6}{8} = \\dfrac{6 \\div 2}{8 \\div 2} = \\dfrac{3}{4}\\)",
          },
          {
            title: "Comparer des fractions",
            items: [
              "Même dénominateur : on compare directement les numérateurs.",
              "Dénominateurs différents : on les met d'abord au même dénominateur.",
              "Piège classique : à numérateur égal, ce n'est PAS la fraction au plus grand dénominateur qui est la plus grande — plus on partage en parts nombreuses, plus chaque part est petite.",
            ],
            formula: "\\(\\dfrac{5}{7} > \\dfrac{3}{7}\\) mais \\(\\dfrac{1}{3} > \\dfrac{1}{7}\\)",
          },
          {
            title: "Additionner, soustraire",
            items: [
              "Il faut le MÊME dénominateur pour additionner ou soustraire deux fractions.",
              "On additionne (ou soustrait) alors seulement les numérateurs.",
            ],
            formula: "\\(\\dfrac{2}{5} + \\dfrac{1}{5} = \\dfrac{3}{5}\\)",
          },
          {
            title: "Multiplier par un nombre entier",
            items: [
              "Pour multiplier une fraction par un nombre entier, on multiplie seulement le numérateur : le dénominateur ne change pas.",
              "C'est aussi ce qu'on utilise pour calculer une fraction d'une quantité (ex. les 2/3 de 12 œufs).",
            ],
            formula: "\\(4 \\times \\dfrac{2}{3} = \\dfrac{4 \\times 2}{3} = \\dfrac{8}{3}\\)",
          },
        ],
      },
    },
  },
  generate,
};
