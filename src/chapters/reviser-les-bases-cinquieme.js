// ---------------------------------------------------------------------------
// Chapitre : Réviser les bases (5e) — gratuit, illimité.
//
// Équivalent, pour l'entrée en 5e, du chapitre "Réviser les bases" (6e) : un
// tour d'horizon des savoir-faire de 6e indispensables pour aborder les
// nouveaux chapitres de 5e (décimaux, fractions, pourcentages, angles,
// périmètres/aires, symétrie). Fichier indépendant (par convention, chaque
// chapitre a ses propres helpers, pas de mutualisation entre fichiers).
//
// Volontairement laissés de côté : les exercices de construction/tracé à la
// main (compas, règle, rapporteur) — l'appli ne sait pas encore faire
// dessiner l'élève, seulement afficher une figure déjà construite (voir
// Figure.jsx : points, segments, droites, cercles, angles droits).
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
const fr = (n) => String(n).replace(".", ",");
const frTex = (n) => String(n).replace(".", "{,}");

function pgcd(a, b) {
  let x = a, y = b;
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function buildAngleFigure(angleDeg, startAngleDeg) {
  const rayLen = 60;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const S = { id: "S", x: 0, y: 0, dx: -14, dy: 12 };
  const A = { id: "A", x: rayLen * Math.cos(toRad(startAngleDeg)), y: rayLen * Math.sin(toRad(startAngleDeg)), dy: -8 };
  const B = { id: "B", x: rayLen * Math.cos(toRad(startAngleDeg + angleDeg)), y: rayLen * Math.sin(toRad(startAngleDeg + angleDeg)), dy: -8 };
  return { points: [S, A, B], segments: [{ from: "S", to: "A" }, { from: "S", to: "B" }] };
}

function buildRectangleFigure(L, l) {
  const scale = Math.min(9, 130 / Math.max(L, l));
  const A = { id: "A", x: 20, y: 20 };
  const B = { id: "B", x: 20 + L * scale, y: 20 };
  const C = { id: "C", x: 20 + L * scale, y: 20 + l * scale };
  const D = { id: "D", x: 20, y: 20 + l * scale };
  return {
    points: [A, B, C, D],
    segments: [
      { from: "A", to: "B", ticks: 1 },
      { from: "D", to: "C", ticks: 1 },
      { from: "A", to: "D", ticks: 2 },
      { from: "B", to: "C", ticks: 2 },
    ],
    rightAngles: [
      { at: "A", from: "D", to: "B" },
      { at: "B", from: "A", to: "C" },
      { at: "C", from: "B", to: "D" },
      { at: "D", from: "C", to: "A" },
    ],
    freeLabels: [
      { x: (A.x + B.x) / 2, y: A.y - 8, text: `${L} cm` },
      { x: A.x - 18, y: (A.y + D.y) / 2, text: `${l} cm` },
    ],
  };
}

// =========================== Nombres décimaux ===========================

// ---------- 1. Arrondir un décimal ----------
function genArrondirDecimal() {
  const n = randDecimal(1, 500, pick([1, 2]));
  const cible = pick(["à l'unité", "au dixième"]);
  const answer = cible === "à l'unité" ? Math.round(n) : roundTo(n, 1);
  return {
    type: "numeric",
    chapter: "Réviser les bases (5e) — Nombres décimaux",
    prompt: `Arrondis ${fr(n)} ${cible}.`,
    answer,
    tolerance: 0.001,
    steps: [{ type: "resultat", text: `${fr(n)} arrondi ${cible} donne ${fr(answer)}.` }],
  };
}

// ---------- 2. Comparer deux décimaux ----------
function genComparerDecimaux() {
  // Un cas sur deux est un piège délibéré : un décimal à 1 chiffre après la
  // virgule mais plus grand qu'un décimal à 2 chiffres (ex. 0,7 > 0,65),
  // pour casser le réflexe "plus de chiffres après la virgule = plus grand"
  // plutôt que de ne jamais le rencontrer (cf. dossier Neurosciences).
  const trap = Math.random() < 0.5;
  let a, b;
  if (trap) {
    const shortVal = randDecimal(0.1, 0.9, 1);
    const longVal = randDecimal(0.01, shortVal - 0.01, 2);
    [a, b] = Math.random() < 0.5 ? [shortVal, longVal] : [longVal, shortVal];
  } else {
    a = randDecimal(0, 200, 2);
    b = randDecimal(0, 200, 2);
  }
  const correct = a > b ? ">" : a < b ? "<" : "=";
  return {
    type: "qcm",
    chapter: "Réviser les bases (5e) — Nombres décimaux",
    prompt: `Complète par <, > ou = : \\(${frTex(a)}\\) ... \\(${frTex(b)}\\)`,
    answer: correct,
    options: ["<", ">", "="],
    steps: [{ type: "regle", text: `On compare d'abord la partie entière, puis les décimales une à une — pas le nombre total de chiffres.` }],
  };
}

// ---------- 3. Additionner/soustraire des décimaux ----------
function genAdditionSoustractionDecimaux() {
  const a = randDecimal(1, 200, 2);
  const b = randDecimal(1, 200, 2);
  const isAdd = Math.random() < 0.5;
  const answer = roundTo(isAdd ? a + b : Math.max(a, b) - Math.min(a, b), 2);
  const [x, y] = isAdd ? [a, b] : [Math.max(a, b), Math.min(a, b)];
  return {
    type: "numeric",
    chapter: "Réviser les bases (5e) — Nombres décimaux",
    prompt: `Calcule : \\(${frTex(x)} ${isAdd ? "+" : "-"} ${frTex(y)}\\)`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${fr(x)} ${isAdd ? "+" : "-"} ${fr(y)} = ${fr(answer)}` }],
  };
}

// ---------- 4. Multiplier un décimal par un entier ----------
function genMultiplierDecimalParEntier() {
  const dec = randDecimal(1, 50, 2);
  const k = randInt(2, 12);
  const answer = roundTo(dec * k, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (5e) — Nombres décimaux",
    prompt: `Calcule : \\(${frTex(dec)} \\times ${k}\\)`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${fr(dec)} \\times ${k} = ${fr(answer)}` }],
  };
}

// ---------- 5. Diviser un décimal par un entier ----------
function genDiviserDecimalParEntier() {
  const k = randInt(2, 10);
  const answer = randDecimal(1, 40, 1);
  const dividende = roundTo(answer * k, 2);
  return {
    type: "numeric",
    chapter: "Réviser les bases (5e) — Nombres décimaux",
    prompt: `Calcule : \\(${frTex(dividende)} \\div ${k}\\)`,
    answer,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `${fr(dividende)} \\div ${k} = ${fr(answer)}` }],
  };
}

// ---------- 6. Multiplier/diviser par 10, 100, 1000 ----------
function genMultDiviserPuissanceDix() {
  const n = randDecimal(0.01, 900, 2);
  const p = pick([10, 100, 1000]);
  const isMult = Math.random() < 0.5;
  const answer = roundTo(isMult ? n * p : n / p, 4);
  return {
    type: "numeric",
    chapter: "Réviser les bases (5e) — Nombres décimaux",
    prompt: `Calcule : \\(${frTex(n)} ${isMult ? "\\times" : "\\div"} ${p}\\)`,
    answer,
    tolerance: 0.001,
    steps: [{ type: "regle", text: `${isMult ? "Multiplier" : "Diviser"} par ${p} déplace la virgule de ${Math.log10(p)} rang(s) vers ${isMult ? "la droite" : "la gauche"}.` }],
  };
}

// =========================== Fractions ===========================

// ---------- 7. Fraction d'un nombre entier ----------
function genFractionDunNombre() {
  const den = pick([2, 3, 4, 5, 10]);
  const k = randInt(2, 12);
  const n = den * k;
  const num = randInt(1, den - 1);
  const answer = num * k;
  return {
    type: "numeric",
    chapter: "Réviser les bases (5e) — Fractions",
    prompt: `Calcule \\(\\dfrac{${num}}{${den}}\\) de ${n}.`,
    answer,
    steps: [
      { type: "regle", text: `Prendre \\(\\dfrac{${num}}{${den}}\\) d'un nombre, c'est diviser ce nombre par ${den} puis multiplier le résultat par ${num}.` },
      { type: "calcul", text: `${n} \\div ${den} = ${k}` },
      { type: "calcul", text: `${k} \\times ${num} = ${answer}` },
    ],
  };
}

// ---------- 8. Simplifier une fraction ----------
function genSimplifierFraction() {
  const g = pick([2, 3, 4, 5]);
  const a = nonZero(1, 8);
  const b = a + nonZero(1, 8);
  const num = a * g;
  const den = b * g;
  const askNum = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Réviser les bases (5e) — Fractions",
    prompt: `Simplifie la fraction \\(\\dfrac{${num}}{${den}}\\) le plus possible. Donne le ${askNum ? "numérateur" : "dénominateur"} de la fraction simplifiée.`,
    answer: askNum ? a : b,
    steps: [{ type: "calcul", text: `\\(\\dfrac{${num}}{${den}} = \\dfrac{${a}}{${b}}\\) (on divise haut et bas par ${g}).` }],
  };
}

// ---------- 9. Écriture décimale d'une fraction ----------
function genEcritureDecimaleFraction() {
  const den = pick([2, 4, 5, 10, 20, 25, 50, 100]);
  const num = randInt(1, den * 3);
  const answer = roundTo(num / den, 4);
  return {
    type: "numeric",
    chapter: "Réviser les bases (5e) — Fractions",
    prompt: `Donne l'écriture décimale de \\(\\dfrac{${num}}{${den}}\\).`,
    answer,
    tolerance: 0.001,
    steps: [
      { type: "regle", text: `L'écriture décimale d'une fraction s'obtient en divisant le numérateur par le dénominateur.` },
      { type: "calcul", text: `${num} \\div ${den} = ${fr(answer)}` },
    ],
  };
}

// ---------- 10. Comparer deux fractions simples ----------
function genComparerFractions() {
  const den = randInt(2, 12);
  let num1 = randInt(1, den * 2);
  let num2 = randInt(1, den * 2);
  while (num1 === num2) num2 = randInt(1, den * 2);
  const correct = num1 > num2 ? ">" : "<";
  return {
    type: "qcm",
    chapter: "Réviser les bases (5e) — Fractions",
    prompt: `Complète par < ou > : \\(\\dfrac{${num1}}{${den}}\\) ... \\(\\dfrac{${num2}}{${den}}\\)`,
    answer: correct,
    options: ["<", ">"],
    steps: [{ type: "regle", text: `Deux fractions de même dénominateur : on compare les numérateurs.` }],
  };
}

// =========================== Pourcentages ===========================

// ---------- 11. Calculer un pourcentage ----------
function genCalculerPourcentage() {
  const pct = pick([10, 20, 25, 50, 75]);
  const n = randInt(2, 40) * (100 / pgcd(pct, 100));
  const answer = Math.round((n * pct) / 100);
  return {
    type: "numeric",
    chapter: "Réviser les bases (5e) — Pourcentages",
    prompt: `Calcule ${pct} % de ${n}.`,
    answer,
    steps: [
      { type: "regle", text: `Calculer ${pct} % d'un nombre, c'est le multiplier par \\(\\dfrac{${pct}}{100}\\).` },
      { type: "calcul", text: `${n} \\times \\dfrac{${pct}}{100} = ${answer}` },
    ],
  };
}

// =========================== Géométrie ===========================

// ---------- 12. Nature d'un angle ----------
function genNatureAngle() {
  const angle = pick([randInt(1, 89), 90, randInt(91, 179), 180]);
  let nature;
  if (angle < 90) nature = "aigu";
  else if (angle === 90) nature = "droit";
  else if (angle < 180) nature = "obtus";
  else nature = "plat";
  return {
    type: "qcm",
    chapter: "Réviser les bases (5e) — Géométrie",
    prompt: `Observe cet angle. Quelle est sa nature ?`,
    figure: buildAngleFigure(Math.max(angle, 2), randInt(0, 360)),
    answer: nature,
    options: ["aigu", "droit", "obtus", "plat"],
    steps: [{ type: "resultat", text: `Angle ${nature}.` }],
  };
}

// ---------- 13. Mesurer un angle (lecture approchée) ----------
function genMesurerAngle() {
  const angle = randInt(15, 165);
  return {
    type: "numeric",
    chapter: "Réviser les bases (5e) — Géométrie",
    prompt: `Quelle est la mesure de l'angle ASB, en degrés ?`,
    figure: buildAngleFigure(angle, randInt(0, 360)),
    answer: angle,
    tolerance: 3,
    steps: [{ type: "donnee", text: `L'angle ASB mesure ${angle}°.` }],
  };
}

// ---------- 14. Périmètre d'un rectangle ----------
function genPerimetreRectangle() {
  const L = randInt(6, 15);
  const l = randInt(3, L - 1);
  const perim = 2 * (L + l);
  return {
    type: "numeric",
    chapter: "Réviser les bases (5e) — Géométrie",
    prompt: `ABCD est un rectangle. Calcule son périmètre, en cm.`,
    figure: buildRectangleFigure(L, l),
    answer: perim,
    steps: [
      { type: "regle", text: `Périmètre d'un rectangle = 2 × (longueur + largeur).` },
      { type: "calcul", text: `2 \\times (${L} + ${l}) = ${perim}` },
    ],
  };
}

// ---------- 15. Aire d'un rectangle ----------
function genAireRectangle() {
  const L = randInt(6, 15);
  const l = randInt(3, L - 1);
  const aire = L * l;
  return {
    type: "numeric",
    chapter: "Réviser les bases (5e) — Géométrie",
    prompt: `ABCD est un rectangle. Calcule son aire, en cm².`,
    figure: buildRectangleFigure(L, l),
    answer: aire,
    steps: [
      { type: "regle", text: `Aire d'un rectangle = longueur × largeur.` },
      { type: "calcul", text: `${L} \\times ${l} = ${aire}` },
    ],
  };
}

// NOTE (audit programme 2026, 3.6) : genSymetrieCentraleDistance a été
// retirée de ce chapitre de révision. Ce chapitre se présente comme un
// rappel des bases de 6e, mais la symétrie centrale (« demi-tour ») est en
// réalité un objectif NOUVEAU de 5e (« Définir le demi-tour, ou symétrie
// centrale. Connaitre les propriétés du demi-tour »), pas un prérequis
// acquis en 6e (où l'on travaille la symétrie axiale). L'exercice de
// conservation des distances par symétrie centrale est déjà couvert
// correctement, en tant que notion 5e à part entière, par
// genSymetriqueConservationLongueur dans symetrie-centrale-parallelogrammes.js.

// ---------- 17. Multiples et diviseurs ----------
function genMultipleOuDiviseur() {
  const askMultiple = Math.random() < 0.5;
  if (askMultiple) {
    const b = randInt(2, 12);
    const k = randInt(2, 10);
    const a = b * k;
    const decoy = a + randInt(1, b - 1 || 1);
    const options = shuffle([`${a}`, `${decoy}`]);
    return {
      type: "qcm",
      chapter: "Réviser les bases (5e) — Multiples et diviseurs",
      prompt: `Lequel de ces deux nombres est un multiple de ${b} ?`,
      answer: `${a}`,
      options,
      steps: [{ type: "calcul", text: `${a} \\div ${b} = ${k} (nombre entier), donc ${a} est un multiple de ${b}.` }],
    };
  }
  const n = pick([12, 18, 20, 24, 30, 36, 40, 45]);
  const divisors = Array.from({ length: n }, (_, i) => i + 1).filter((i) => n % i === 0);
  const count = divisors.length;
  return {
    type: "numeric",
    chapter: "Réviser les bases (5e) — Multiples et diviseurs",
    prompt: `Combien le nombre ${n} a-t-il de diviseurs (en comptant 1 et ${n}) ?`,
    answer: count,
    steps: [{ type: "resultat", text: `Diviseurs de ${n} : ${divisors.join(", ")}.` }],
  };
}

// ---------- 18. Vocabulaire : périmètre ou aire ----------
function genVocabulairePerimetreAire() {
  const cases = [
    { texte: "la longueur de clôture nécessaire pour entourer un jardin", correct: "périmètre" },
    { texte: "la quantité de peinture pour recouvrir un mur", correct: "aire" },
    { texte: "la longueur de ruban pour border une nappe rectangulaire", correct: "périmètre" },
    { texte: "la quantité de gazon pour recouvrir un terrain", correct: "aire" },
    { texte: "la distance parcourue en faisant le tour d'un stade", correct: "périmètre" },
    { texte: "le nombre de carreaux pour recouvrir un sol", correct: "aire" },
  ];
  const c = pick(cases);
  return {
    type: "qcm",
    chapter: "Réviser les bases (5e) — Vocabulaire",
    prompt: `Pour calculer ${c.texte}, a-t-on besoin du périmètre ou de l'aire ?`,
    answer: c.correct,
    options: ["périmètre", "aire"],
    steps: [{ type: "resultat", text: `On parle ici de la notion de "${c.correct}".` }],
  };
}

const GENERATORS = [
  genArrondirDecimal,
  genComparerDecimaux,
  genAdditionSoustractionDecimaux,
  genMultiplierDecimalParEntier,
  genDiviserDecimalParEntier,
  genMultDiviserPuissanceDix,
  genFractionDunNombre,
  genSimplifierFraction,
  genEcritureDecimaleFraction,
  genComparerFractions,
  genCalculerPourcentage,
  genNatureAngle,
  genMesurerAngle,
  genPerimetreRectangle,
  genAireRectangle,
  genMultipleOuDiviseur,
  genVocabulairePerimetreAire,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "reviser-les-bases-cinquieme",
    title: "Réviser les bases",
    description: "Décimaux, fractions, pourcentages, angles et aires de 6e — pour prendre un bon départ en 5e. Gratuit et illimité.",
    pourquoi: "Ce chapitre gratuit consolide les bases indispensables du niveau précédent, pour démarrer l'année sur des fondations solides plutôt que de découvrir des lacunes en cours de route.",
    level: "cinquieme",
    free: true,
    order: 0,
  },
  generate,
};
