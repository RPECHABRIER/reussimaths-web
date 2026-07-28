// ---------------------------------------------------------------------------
// Chapitre : Automatismes (4e) — gratuit, freemium (5 questions/jour sans
// abonnement, illimité avec abonnement). Regroupe les mini-exercices de
// calcul rapide ("Calcul mental") rencontrés en tête de chaque page
// d'entraînement du manuel de 4e, un thème par chapitre du sommaire (voir
// THEMES ci-dessous) ; sera enrichi au fur et à mesure que les autres
// chapitres 4e seront écrits — voir automatismes-cinquieme.js pour le même
// principe en 5e.
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
const signedTex = (n) => `${n >= 0 ? "+" : ""}${frTex(n)}`;

// =========================== Chapitre 1 : Nombres relatifs ===========================
// (Reprend l'esprit des mini-exercices "Calcul mental" en tête de chaque
// page d'entraînement du chapitre : chaînes d'additions/soustractions de
// relatifs, multiplier/diviser par 10/100/0,1, calculs avec priorités.)

// ---------- 1. Chaîne d'additions/soustractions de relatifs (entiers) ----------
function genChaineAdditionSoustractionRelatifs() {
  const n = randInt(3, 4);
  const termes = Array.from({ length: n }, () => nonZero(-15, 15));
  let total = termes[0];
  const parts = [`${termes[0]}`];
  for (let i = 1; i < n; i++) {
    total += termes[i];
    parts.push(`${termes[i] >= 0 ? "+" : "-"} ${Math.abs(termes[i])}`);
  }
  return {
    type: "numeric",
    chapter: "Automatismes — Additionner, soustraire",
    prompt: `Calcule : \\(${parts.join(" ")}\\)`,
    answer: total,
    steps: [`${parts.join(" ")} = ${total}`],
  };
}

// ---------- 2. Somme/différence décimale simple ----------
function genSommeDifferenceDecimaleSimple() {
  const a = randDecimal(1, 20, 1);
  const b = randDecimal(1, 20, 1);
  const isAdd = Math.random() < 0.5;
  const answer = roundTo(isAdd ? a + b : a - b, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Additionner, soustraire",
    prompt: `Calcule : \\(${frTex(a)} ${isAdd ? "+" : "-"} ${frTex(b)}\\)`,
    answer,
    tolerance: 0.01,
    steps: [`${fr(a)} ${isAdd ? "+" : "-"} ${fr(b)} = ${fr(answer)}`],
  };
}

// ---------- 3. Multiplier deux petits entiers relatifs ----------
function genMultiplierPetitsRelatifs() {
  const a = nonZero(-12, 12);
  const b = nonZero(-12, 12);
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplier, diviser",
    prompt: `Calcule : \\(${a} \\times ${signedTex(b).replace("+", "")}\\)`,
    answer: a * b,
    steps: [`${a} \\times ${b} = ${a * b}`],
  };
}

// ---------- 4. Multiplier/diviser un décimal par 10, 100 ou 0,1 ----------
function genMultDiviserDecimalPuissanceDix() {
  const n = randDecimal(0.01, 90, 2);
  const p = pick([10, 100, 0.1]);
  const isMult = Math.random() < 0.5;
  const answer = roundTo(isMult ? n * p : n / p, 4);
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplier, diviser",
    prompt: `Calcule : \\(${frTex(n)} ${isMult ? "\\times" : "\\div"} ${fr(p)}\\)`,
    answer,
    tolerance: 0.001,
    steps: [`${fr(n)} ${isMult ? "\\times" : "\\div"} ${fr(p)} = ${fr(answer)}`],
  };
}

// ---------- 5. Diviser deux petits entiers relatifs ----------
function genDiviserPetitsRelatifs() {
  const b = nonZero(-12, 12);
  const k = nonZero(-10, 10);
  const a = b * k;
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplier, diviser",
    prompt: `Calcule : \\(${a} \\div ${signedTex(b).replace("+", "")}\\)`,
    answer: k,
    steps: [`${a} \\div ${b} = ${k}`],
  };
}

// ---------- 6. Calcul avec priorités (relatifs, une seule opération prioritaire) ----------
function genCalculPrioriteRelatifsMental() {
  const a = nonZero(-15, 15);
  const b = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const op1 = pick(["+", "-"]);
  const produit = b * c;
  const answer = op1 === "+" ? a + produit : a - produit;
  return {
    type: "numeric",
    chapter: "Automatismes — Priorités",
    prompt: `Calcule en respectant les priorités : \\(${a} ${op1} ${b} \\times ${signedTex(c).replace("+", "")}\\)`,
    answer,
    steps: [`${b} \\times ${c} = ${produit}`, `${a} ${op1} ${produit} = ${answer}`],
  };
}

const CH_NOMBRES_RELATIFS_Q = [
  genChaineAdditionSoustractionRelatifs,
  genSommeDifferenceDecimaleSimple,
  genMultiplierPetitsRelatifs,
  genMultDiviserDecimalPuissanceDix,
  genDiviserPetitsRelatifs,
  genCalculPrioriteRelatifsMental,
];

// =========================== Chapitre 2 : Addition et soustraction de nombres rationnels ===========================
// (Mini-exercices "Calcul mental" en tête de page : additionner/soustraire
// deux fractions de même dénominateur, simplifier une fraction simple,
// comparer deux fractions de même dénominateur.)

// ---------- 1. Additionner deux fractions de même dénominateur (mental) ----------
function genAutoAdditionFractionsMemeDenominateur() {
  const den = randInt(3, 9);
  const numA = nonZero(-8, 8);
  const numB = nonZero(-8, 8);
  const answer = numA + numB;
  return {
    type: "numeric",
    chapter: "Automatismes — Rationnels",
    prompt: `Calcule le numérateur : \\(\\dfrac{${numA}}{${den}} + \\dfrac{${numB}}{${den}} = \\dfrac{?}{${den}}\\)`,
    answer,
    steps: [`${numA} + ${numB} = ${answer}`],
  };
}

// ---------- 2. Soustraire deux fractions de même dénominateur (mental) ----------
function genAutoSoustractionFractionsMemeDenominateur() {
  const den = randInt(3, 9);
  const numA = nonZero(-8, 8);
  const numB = nonZero(-8, 8);
  const answer = numA - numB;
  return {
    type: "numeric",
    chapter: "Automatismes — Rationnels",
    prompt: `Calcule le numérateur : \\(\\dfrac{${numA}}{${den}} - \\dfrac{${numB}}{${den}} = \\dfrac{?}{${den}}\\)`,
    answer,
    steps: [`${numA} - ${numB} = ${answer}`],
  };
}

// ---------- 3. Simplifier une fraction simple (mental) ----------
function genAutoSimplifierFractionSimple() {
  const pgcdLocal = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
  };
  let a0, b0;
  do {
    a0 = randInt(1, 6);
    b0 = randInt(a0 + 1, 9);
  } while (pgcdLocal(a0, b0) !== 1);
  const k = randInt(2, 5);
  const num = a0 * k;
  const den = b0 * k;
  return {
    type: "numeric",
    chapter: "Automatismes — Rationnels",
    prompt: `Simplifie au maximum : \\(\\dfrac{${num}}{${den}} = \\dfrac{?}{${b0}}\\)`,
    answer: a0,
    steps: [`${num} \\div ${k} = ${a0}`, `${den} \\div ${k} = ${b0}`],
  };
}

// ---------- 4. Comparer deux fractions de même dénominateur (mental) ----------
function genAutoComparerFractionsMemeDenominateurQCM() {
  const den = randInt(2, 12);
  let numA, numB;
  do {
    numA = nonZero(-10, 10);
    numB = nonZero(-10, 10);
  } while (numA === numB);
  const correct = numA < numB ? "<" : ">";
  return {
    type: "qcm",
    chapter: "Automatismes — Rationnels",
    prompt: `Compare : \\(\\dfrac{${numA}}{${den}}\\) ... \\(\\dfrac{${numB}}{${den}}\\)`,
    answer: correct,
    options: ["<", ">", "="],
    steps: [`Même dénominateur : on compare les numérateurs ${numA} et ${numB}.`],
  };
}

// ---------- 5. Somme d'un entier et d'une petite fraction (mental) ----------
function genAutoSommeEntierFractionMental() {
  const den = randInt(2, 6);
  const numFrac = nonZero(-(den - 1), den - 1);
  const entier = nonZero(-6, 6);
  const answer = numFrac + entier * den;
  return {
    type: "numeric",
    chapter: "Automatismes — Rationnels",
    prompt: `Calcule le numérateur : \\(\\dfrac{${numFrac}}{${den}} ${entier >= 0 ? "+" : "-"} ${Math.abs(entier)} = \\dfrac{?}{${den}}\\)`,
    answer,
    steps: [`${entier} = \\dfrac{${entier * den}}{${den}}`, `${numFrac} ${entier >= 0 ? "+" : "-"} ${Math.abs(entier * den)} = ${answer}`],
  };
}

const CH_ADDITION_SOUSTRACTION_RATIONNELS = [
  genAutoAdditionFractionsMemeDenominateur,
  genAutoSoustractionFractionsMemeDenominateur,
  genAutoSimplifierFractionSimple,
  genAutoComparerFractionsMemeDenominateurQCM,
  genAutoSommeEntierFractionMental,
];

// =========================== Chapitre 3 : Multiplication et division de nombres rationnels ===========================
// (Mini-exercices "Calcul mental" en tête de page : multiplier deux
// fractions, calculer une fraction simple d'un nombre, trouver l'inverse
// d'un petit nombre, diviser par une fraction.)

// ---------- 1. Multiplier deux fractions (mental) ----------
function genAutoMultiplierFractionsMental() {
  const a = nonZero(-9, 9);
  const b = randInt(2, 9);
  const c = nonZero(-9, 9);
  const d = randInt(2, 9);
  const answer = a * c;
  return {
    type: "numeric",
    chapter: "Automatismes — Rationnels",
    prompt: `Calcule le numérateur : \\(\\dfrac{${a}}{${b}} \\times \\dfrac{${c}}{${d}} = \\dfrac{?}{${b * d}}\\)`,
    answer,
    steps: [`${a} \\times ${c} = ${answer}`],
  };
}

// ---------- 2. Fraction simple d'un nombre entier (mental) ----------
function genAutoFractionDUnNombreMental() {
  const den = randInt(2, 6);
  const nombre = den * randInt(2, 12);
  const num = randInt(1, den - 1);
  const answer = (num / den) * nombre;
  return {
    type: "numeric",
    chapter: "Automatismes — Rationnels",
    prompt: `Calcule les \\(\\dfrac{${num}}{${den}}\\) de ${nombre}.`,
    answer,
    steps: [`${nombre} \\div ${den} \\times ${num} = ${answer}`],
  };
}

// ---------- 3. Inverse d'un petit entier relatif (mental, QCM) ----------
function genAutoInversePetitEntierQCM() {
  const n = nonZero(-9, 9);
  const correct = `\\dfrac{1}{${n}}`;
  const options = shuffle([...new Set([correct, `${-n}`, `${n}`, `\\dfrac{${-1}}{${n}}`])]).slice(0, 4);
  if (!options.includes(correct)) options[0] = correct;
  return {
    type: "qcm",
    chapter: "Automatismes — Rationnels",
    prompt: `Quel est l'inverse de ${n} ?`,
    answer: correct,
    options: shuffle(options),
    steps: [`L'inverse de ${n} est \\dfrac{1}{${n}} car ${n} \\times \\dfrac{1}{${n}} = 1.`],
  };
}

// ---------- 4. Diviser deux fractions simples (mental) ----------
function genAutoDiviserFractionsMental() {
  const a = nonZero(-9, 9);
  const b = randInt(2, 9);
  const c = nonZero(-9, 9);
  const d = randInt(2, 9);
  const answer = a * d;
  return {
    type: "numeric",
    chapter: "Automatismes — Rationnels",
    prompt: `Calcule le numérateur : \\(\\dfrac{${a}}{${b}} \\div \\dfrac{${c}}{${d}} = \\dfrac{?}{${b * c}}\\)`,
    answer,
    steps: [`Diviser par \\dfrac{${c}}{${d}}, c'est multiplier par \\dfrac{${d}}{${c}}.`, `${a} \\times ${d} = ${answer}`],
  };
}

// ---------- 5. Pourcentage simple d'un nombre rond (mental) ----------
function genAutoPourcentageSimpleMental() {
  const pourcentage = pick([10, 20, 25, 50, 75]);
  const nombre = randInt(1, 20) * 20;
  const answer = (pourcentage / 100) * nombre;
  return {
    type: "numeric",
    chapter: "Automatismes — Rationnels",
    prompt: `Calcule ${pourcentage} % de ${nombre}.`,
    answer,
    steps: [`${pourcentage}/100 \\times ${nombre} = ${answer}`],
  };
}

const CH_MULTIPLICATION_DIVISION_RATIONNELS = [
  genAutoMultiplierFractionsMental,
  genAutoFractionDUnNombreMental,
  genAutoInversePetitEntierQCM,
  genAutoDiviserFractionsMental,
  genAutoPourcentageSimpleMental,
];

// =========================== Chapitre 4 : Puissances ===========================
// (Mini-exercices "Calcul mental" en tête de page : calculer une petite
// puissance, une puissance de 10, appliquer les règles produit/quotient sur
// les puissances de 10, convertir une écriture décimale simple.)

// ---------- 1. Calculer une petite puissance (mental) ----------
function genAutoValeurPuissanceMental() {
  const a = nonZero(-6, 6);
  const n = randInt(2, 4);
  const answer = a ** n;
  return {
    type: "numeric",
    chapter: "Automatismes — Puissances",
    prompt: `Calcule : \\(\\left(${a}\\right)^{${n}}\\)`,
    answer,
    steps: [`${Array(n).fill(`(${a})`).join(" \\times ")} = ${answer}`],
  };
}

// ---------- 2. Calculer une puissance de 10 (mental) ----------
function genAutoPuissanceDixMental() {
  const n = randInt(-3, 5);
  const answer = 10 ** n;
  return {
    type: "numeric",
    chapter: "Automatismes — Puissances",
    prompt: `Calcule : \\(10^{${n}}\\) (écriture décimale)`,
    answer,
    tolerance: Math.abs(answer) < 1 ? 0.00001 : 0.5,
    steps: [`10^{${n}} = ${fr(answer)}`],
  };
}

// ---------- 3. Règle produit/quotient sur les puissances de 10 (mental) ----------
function genAutoRegleProduitQuotientDixMental() {
  const m = randInt(-6, 8);
  const n = randInt(-6, 8);
  const isProduit = Math.random() < 0.5;
  const answer = isProduit ? m + n : m - n;
  return {
    type: "numeric",
    chapter: "Automatismes — Puissances",
    prompt: `\\(10^{${m}} ${isProduit ? "\\times" : "\\div"} 10^{${n}} = 10^{?}\\) — quel est cet exposant ?`,
    answer,
    steps: [isProduit ? `${m} + ${n} = ${answer}` : `${m} - ${n} = ${answer}`],
  };
}

// ---------- 4. Multiplier/diviser un nombre décimal par une puissance de 10 (mental) ----------
function genAutoMultDiviserPuissanceDixMental() {
  const n = randDecimal(0.01, 90, 2);
  const p = pick([10, 100, 1000, 0.1, 0.01]);
  const isMult = Math.random() < 0.5;
  const answer = roundTo(isMult ? n * p : n / p, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Puissances",
    prompt: `Calcule : \\(${frTex(n)} ${isMult ? "\\times" : "\\div"} ${fr(p)}\\)`,
    answer,
    tolerance: 0.001,
    steps: [`${fr(n)} ${isMult ? "\\times" : "\\div"} ${fr(p)} = ${fr(answer)}`],
  };
}

// ---------- 5. Carré ou racine carrée d'un petit entier (mental) ----------
function genAutoCarreOuRacineCarreeMental() {
  const isCarre = Math.random() < 0.5;
  if (isCarre) {
    const n = randInt(2, 15);
    return {
      type: "numeric",
      chapter: "Automatismes — Puissances",
      prompt: `Calcule : \\(${n}^{2}\\)`,
      answer: n * n,
      steps: [`${n} \\times ${n} = ${n * n}`],
    };
  }
  const racine = randInt(2, 15);
  const carre = racine * racine;
  return {
    type: "numeric",
    chapter: "Automatismes — Puissances",
    prompt: `Calcule : \\(\\sqrt{${carre}}\\)`,
    answer: racine,
    steps: [`${racine}^2 = ${carre}\\ \\text{donc}\\ \\sqrt{${carre}} = ${racine}`],
  };
}

const CH_PUISSANCES_Q = [
  genAutoValeurPuissanceMental,
  genAutoPuissanceDixMental,
  genAutoRegleProduitQuotientDixMental,
  genAutoMultDiviserPuissanceDixMental,
  genAutoCarreOuRacineCarreeMental,
];

// =========================== Chapitre 5 : Calcul littéral ===========================
// (Mini-exercices "Calcul mental" en tête de page : évaluer une petite
// expression littérale, réduire une expression simple, multiplier des
// termes littéraux.)

// ---------- 1. Évaluer une petite expression littérale (mental) ----------
function genAutoEvaluerExpressionMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const x = nonZero(-9, 9);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul littéral",
    prompt: `Évalue \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\) pour \\(x = ${x}\\).`,
    answer,
    steps: [`${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}`],
  };
}

// ---------- 2. Réduire une expression littérale simple (coefficient de x, mental) ----------
function genAutoReduireExpressionMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul littéral",
    prompt: `Réduis : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x\\) — quel est le coefficient de x ?`,
    answer: a + b,
    steps: [`${a} + ${b} = ${a + b}`],
  };
}

// ---------- 3. Multiplier deux termes littéraux (mental) ----------
function genAutoMultiplierTermesLitterauxMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul littéral",
    prompt: `Calcule le coefficient de \\(x^{2}\\) dans \\(${a}x \\times ${b}x\\).`,
    answer: a * b,
    steps: [`${a} \\times ${b} = ${a * b}`],
  };
}

// ---------- 4. Développer avec la simple distributivité (mental) ----------
function genAutoDevelopperSimpleMental() {
  const k = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul littéral",
    prompt: `On développe \\(${k}\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right) = ${k}x + ?\\). Quel est ce terme constant ?`,
    answer: k * b,
    steps: [`${k} \\times ${b} = ${k * b}`],
  };
}

// ---------- 5. Factoriser un facteur commun (mental) ----------
function genAutoFactoriserFacteurCommunMental() {
  const k = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul littéral",
    prompt: `On factorise \\(${k}x ${k * b >= 0 ? "+" : "-"} ${Math.abs(k * b)} = ?\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right)\\). Quel est ce facteur commun ?`,
    answer: k,
    steps: [`${k}x ${k * b >= 0 ? "+" : "-"} ${Math.abs(k * b)} = ${k}\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right)`],
  };
}

const CH_CALCUL_LITTERAL_Q = [
  genAutoEvaluerExpressionMental,
  genAutoReduireExpressionMental,
  genAutoMultiplierTermesLitterauxMental,
  genAutoDevelopperSimpleMental,
  genAutoFactoriserFacteurCommunMental,
];

// =========================== Chapitre 6 : Résolution d'équations ===========================
// (Mini-exercices "Calcul mental" en tête de page : résoudre une petite
// équation du premier degré, tester si un nombre est solution.)

// ---------- 1. Résoudre une équation x + a = b (mental) ----------
function genAutoResoudreEquationAdditionMental() {
  const xSol = nonZero(-15, 15);
  const a = nonZero(-15, 15);
  const b = xSol + a;
  return {
    type: "numeric",
    chapter: "Automatismes — Équations",
    prompt: `Résous : \\(x ${a >= 0 ? "+" : "-"} ${Math.abs(a)} = ${b}\\)`,
    answer: xSol,
    steps: [`x = ${b} ${a >= 0 ? "-" : "+"} ${Math.abs(a)} = ${xSol}`],
  };
}

// ---------- 2. Résoudre une équation ax = b (mental) ----------
function genAutoResoudreEquationMultiplicationMental() {
  const a = nonZero(-9, 9);
  const xSol = nonZero(-12, 12);
  const b = a * xSol;
  return {
    type: "numeric",
    chapter: "Automatismes — Équations",
    prompt: `Résous : \\(${a}x = ${b}\\)`,
    answer: xSol,
    steps: [`x = ${b} \\div ${a} = ${xSol}`],
  };
}

// ---------- 3. Résoudre une équation ax + b = c (mental) ----------
function genAutoResoudreEquationDeuxEtapesMental() {
  const a = nonZero(-6, 6);
  const xSol = nonZero(-10, 10);
  const b = nonZero(-10, 10);
  const c = a * xSol + b;
  return {
    type: "numeric",
    chapter: "Automatismes — Équations",
    prompt: `Résous : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}\\)`,
    answer: xSol,
    steps: [`${a}x = ${c - b}`, `x = ${c - b} \\div ${a} = ${xSol}`],
  };
}

// ---------- 4. Tester si un nombre est solution (mental, QCM) ----------
function genAutoTesterSolutionMentalQCM() {
  const a = nonZero(-9, 9);
  const xSol = nonZero(-10, 10);
  const b = nonZero(-9, 9);
  const c = a * xSol + b;
  const testIsSolution = Math.random() < 0.5;
  const xTest = testIsSolution ? xSol : xSol + nonZero(1, 3);
  const isSolution = a * xTest + b === c;
  return {
    type: "qcm",
    chapter: "Automatismes — Équations",
    prompt: `${xTest} est-il solution de \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}\\) ?`,
    answer: isSolution ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`${a} \\times ${xTest} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${a * xTest + b}`],
  };
}

// ---------- 5. Quelle opération pour isoler x (mental, QCM) ----------
function genAutoOperationInverseMentalQCM() {
  const a = nonZero(-9, 9);
  const isAdd = Math.random() < 0.5;
  const correct = isAdd ? `Soustraire ${Math.abs(a)}` : `Ajouter ${Math.abs(a)}`;
  const wrong = isAdd ? `Ajouter ${Math.abs(a)}` : `Soustraire ${Math.abs(a)}`;
  const b = nonZero(-15, 15);
  return {
    type: "qcm",
    chapter: "Automatismes — Équations",
    prompt: `Pour résoudre \\(x ${isAdd ? "+" : "-"} ${Math.abs(a)} = ${b}\\), quelle opération faut-il effectuer ?`,
    answer: correct,
    options: [correct, wrong],
    steps: [`On effectue l'opération inverse : ${correct}.`],
  };
}

const CH_RESOLUTION_EQUATIONS_Q = [
  genAutoResoudreEquationAdditionMental,
  genAutoResoudreEquationMultiplicationMental,
  genAutoResoudreEquationDeuxEtapesMental,
  genAutoTesterSolutionMentalQCM,
  genAutoOperationInverseMentalQCM,
];

// =========================== Chapitre 7 : Statistiques ===========================
// (Mini-exercices "Calcul mental" en tête de page : petite moyenne pondérée,
// médiane d'une petite série, effectif total.)

// ---------- 1. Moyenne pondérée d'une petite série (mental) ----------
function genAutoMoyennePondereeMental() {
  const v1 = randInt(0, 20);
  const e1 = randInt(1, 5);
  const v2 = randInt(0, 20);
  const e2 = randInt(1, 5);
  const total = e1 + e2;
  const somme = v1 * e1 + v2 * e2;
  const answer = roundTo(somme / total, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques",
    prompt: `Une série a pour valeurs ${v1} (effectif ${e1}) et ${v2} (effectif ${e2}). Calcule sa moyenne pondérée (arrondie au centième si nécessaire).`,
    answer,
    tolerance: 0.01,
    steps: [`\\dfrac{${v1} \\times ${e1} + ${v2} \\times ${e2}}{${total}} \\approx ${fr(answer)}`],
  };
}

// ---------- 2. Médiane d'une petite série à effectif impair (mental) ----------
function genAutoMedianeImpaireMental() {
  const n = pick([3, 5, 7]);
  const values = Array.from({ length: n }, () => randInt(0, 20)).sort((a, b) => a - b);
  const median = values[(n - 1) / 2];
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques",
    prompt: `Voici une série rangée dans l'ordre croissant : ${values.join(" ; ")}. Quelle est sa médiane ?`,
    answer: median,
    steps: [`Effectif ${n} (impair) : la médiane est la valeur centrale, ${median}.`],
  };
}

// ---------- 3. Effectif total d'un petit tableau (mental) ----------
function genAutoEffectifTotalMental() {
  const n = randInt(3, 5);
  const effectifs = Array.from({ length: n }, () => randInt(1, 10));
  const total = effectifs.reduce((a, b) => a + b, 0);
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques",
    prompt: `Un tableau donne les effectifs suivants : ${effectifs.join(", ")}. Quel est l'effectif total ?`,
    answer: total,
    steps: [`${effectifs.join(" + ")} = ${total}`],
  };
}

// ---------- 4. Convertir un pourcentage en angle de diagramme circulaire (mental) ----------
function genAutoPourcentageEnAngleMental() {
  const pourcentage = pick([10, 20, 25, 50, 75]);
  const angle = pourcentage * 3.6;
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques",
    prompt: `Un secteur d'un diagramme circulaire représente ${pourcentage} % du total. Quelle est la mesure de cet angle, en degrés ?`,
    answer: angle,
    steps: [`${pourcentage} \\times 3,6 = ${angle}`],
  };
}

// ---------- 5. Angle manquant d'un diagramme (mental) ----------
function genAutoAngleManquantMental() {
  const isSemi = Math.random() < 0.5;
  const totalAngle = isSemi ? 180 : 360;
  const a1 = randInt(20, Math.floor(totalAngle / 3));
  const a2 = randInt(20, Math.floor(totalAngle / 3));
  const manquant = totalAngle - a1 - a2;
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques",
    prompt: `Dans un diagramme ${isSemi ? "semi-circulaire" : "circulaire"}, deux secteurs mesurent ${a1}° et ${a2}°. Quelle est la mesure du troisième secteur ?`,
    answer: manquant,
    steps: [`${totalAngle} - ${a1} - ${a2} = ${manquant}`],
  };
}

const CH_STATISTIQUES_Q = [
  genAutoMoyennePondereeMental,
  genAutoMedianeImpaireMental,
  genAutoEffectifTotalMental,
  genAutoPourcentageEnAngleMental,
  genAutoAngleManquantMental,
];

// =========================== Chapitre 8 : Probabilités ===========================
// (Mini-exercices "Calcul mental" en tête de page : calculer une probabilité
// simple, probabilité de l'événement contraire, vérifier une somme de
// probabilités.)

// ---------- 1. Probabilité simple (mental) ----------
function genAutoProbabiliteSimpleMental() {
  const total = randInt(4, 10);
  const favorables = randInt(1, total - 1);
  const answer = roundTo(favorables / total, 4);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `Une expérience comporte ${total} issues équiprobables. Un événement A est réalisé par ${favorables} de ces issues. Quelle est \\(P(A)\\) (arrondie au centième) ?`,
    answer,
    tolerance: 0.01,
    steps: [`\\dfrac{${favorables}}{${total}} \\approx ${fr(answer)}`],
  };
}

// ---------- 2. Probabilité de l'événement contraire (mental) ----------
function genAutoProbabiliteContraireMental() {
  const pA = roundTo(Math.random() * 0.9 + 0.05, 2);
  const answer = roundTo(1 - pA, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `\\(P(A) = ${fr(pA)}\\). Calcule \\(P(\\overline{A})\\).`,
    answer,
    tolerance: 0.01,
    steps: [`1 - ${fr(pA)} = ${fr(answer)}`],
  };
}

// ---------- 3. Un nombre peut-il être une probabilité ? (mental, QCM) ----------
function genAutoPeutEtreProbabiliteMentalQCM() {
  const candidates = [
    { valid: true, display: "0,4" },
    { valid: false, display: "1,3" },
    { valid: false, display: "-0,1" },
    { valid: true, display: "0,9" },
    { valid: false, display: "120 %" },
    { valid: true, display: "40 %" },
  ];
  const item = pick(candidates);
  return {
    type: "qcm",
    chapter: "Automatismes — Probabilités",
    prompt: `${item.display} peut-il correspondre à une probabilité ?`,
    answer: item.valid ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`Une probabilité est toujours comprise entre 0 et 1.`],
  };
}

// ---------- 4. Compléter une probabilité manquante (mental) ----------
function genAutoCompleterProbabiliteMental() {
  const p1 = roundTo(Math.random() * 0.4 + 0.1, 2);
  const p2 = roundTo(Math.random() * 0.3 + 0.1, 2);
  const manquant = roundTo(1 - p1 - p2, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `Trois issues A, B et C ont pour probabilités \\(P(A) = ${fr(p1)}\\), \\(P(B) = ${fr(p2)}\\) et \\(P(C) = ?\\). Sachant que la somme vaut 1, calcule \\(P(C)\\).`,
    answer: manquant,
    tolerance: 0.01,
    steps: [`1 - ${fr(p1)} - ${fr(p2)} = ${fr(manquant)}`],
  };
}

// ---------- 5. Nombre d'issues favorables (mental) ----------
function genAutoIssuesFavorablesMental() {
  const total = pick([10, 20, 25, 50, 100]);
  const favorables = randInt(1, total - 1);
  const proba = roundTo(favorables / total, 4);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `Une expérience comporte ${total} issues équiprobables et \\(P(A) = ${fr(proba)}\\). Combien d'issues favorables réalisent A ?`,
    answer: favorables,
    steps: [`${fr(proba)} \\times ${total} = ${favorables}`],
  };
}

const CH_PROBABILITES_Q = [
  genAutoProbabiliteSimpleMental,
  genAutoProbabiliteContraireMental,
  genAutoPeutEtreProbabiliteMentalQCM,
  genAutoCompleterProbabiliteMental,
  genAutoIssuesFavorablesMental,
];

// =========================== Chapitre 9 : Notion de fonctions ===========================
// (Mini-exercices "Calcul mental" en tête de page : calculer une image par
// une fonction affine simple, retrouver un antécédent.)

// ---------- 1. Image par une fonction affine (mental) ----------
function genAutoImageFonctionAffineMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const x = nonZero(-9, 9);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Automatismes — Fonctions",
    prompt: `Une fonction f associe à x le nombre \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Quel est le nombre associé à ${x} par f ?`,
    answer,
    steps: [`${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}`],
  };
}

// ---------- 2. Antécédent par une fonction affine (mental) ----------
function genAutoAntecedentFonctionAffineMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const xSol = nonZero(-10, 10);
  const y = a * xSol + b;
  return {
    type: "numeric",
    chapter: "Automatismes — Fonctions",
    prompt: `Une fonction f associe à x le nombre \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Quel est l'antécédent de ${y} par f ?`,
    answer: xSol,
    steps: [`${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${y}`, `x = ${y - b} \\div ${a} = ${xSol}`],
  };
}

// ---------- 3. Image par une fonction du second degré (mental) ----------
function genAutoImageFonctionQuadratiqueMental() {
  const a = nonZero(-4, 4);
  const b = nonZero(-9, 9);
  const x = nonZero(-6, 6);
  const answer = a * x * x + b;
  return {
    type: "numeric",
    chapter: "Automatismes — Fonctions",
    prompt: `Une fonction f associe à x le nombre \\(${a}x^{2} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Quel est le nombre associé à ${x} par f ?`,
    answer,
    steps: [`${a} \\times ${x}^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}`],
  };
}

// ---------- 4. Un point appartient-il à la courbe ? (mental, QCM) ----------
function genAutoAppartientCourbeMentalQCM() {
  const a = nonZero(-6, 6);
  const b = nonZero(-9, 9);
  const x = nonZero(-8, 8);
  const yCorrect = a * x + b;
  const testBelongs = Math.random() < 0.5;
  const yTest = testBelongs ? yCorrect : yCorrect + nonZero(1, 4);
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions",
    prompt: `f associe à x le nombre \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Le point \\((${x} ; ${yTest})\\) appartient-il à sa représentation graphique ?`,
    answer: testBelongs ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${yCorrect}`],
  };
}

// ---------- 5. Lire une image dans un petit tableau (mental) ----------
function genAutoLireTableauMental() {
  const xs = shuffle([-4, -2, -1, 0, 1, 2, 4]).slice(0, 4).sort((a, b) => a - b);
  const ys = xs.map(() => randInt(-10, 10));
  const idx = randInt(0, xs.length - 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Fonctions",
    prompt: `Tableau : ${xs.map((x, i) => `x=${x} → ${ys[i]}`).join(", ")}. Quel est le nombre associé à ${xs[idx]} ?`,
    answer: ys[idx],
    steps: [`D'après le tableau : ${ys[idx]}.`],
  };
}

const CH_NOTION_FONCTIONS_Q = [
  genAutoImageFonctionAffineMental,
  genAutoAntecedentFonctionAffineMental,
  genAutoImageFonctionQuadratiqueMental,
  genAutoAppartientCourbeMentalQCM,
  genAutoLireTableauMental,
];

// =========================== Chapitre 10 : Proportionnalité ===========================
// (Mini-exercices "Calcul mental" en tête de page : quatrième
// proportionnelle simple, conversions d'unités, vitesse.)

// ---------- 1. Quatrième proportionnelle (mental) ----------
function genAutoQuatriemeProportionnelleMental() {
  const a = randInt(2, 12);
  const k = randInt(2, 9);
  const b = a * k;
  const c = randInt(2, 15);
  const d = c * k;
  return {
    type: "numeric",
    chapter: "Automatismes — Proportionnalité",
    prompt: `\\(\\dfrac{${b}}{${a}} = \\dfrac{?}{${c}}\\) — quelle est cette quatrième proportionnelle ?`,
    answer: d,
    steps: [`${b} \\times ${c} \\div ${a} = ${d}`],
  };
}

// ---------- 2. Vitesse moyenne (mental) ----------
function genAutoVitesseMoyenneMental() {
  const vitesse = randInt(2, 20);
  const temps = randInt(1, 8);
  const distance = vitesse * temps;
  return {
    type: "numeric",
    chapter: "Automatismes — Proportionnalité",
    prompt: `Un mobile parcourt ${distance} km en ${temps} h. Quelle est sa vitesse moyenne, en km/h ?`,
    answer: vitesse,
    steps: [`${distance} \\div ${temps} = ${vitesse}`],
  };
}

// ---------- 3. Conversion km/h en m/s ou l'inverse (mental) ----------
function genAutoConversionVitesseMental() {
  const versMs = Math.random() < 0.5;
  if (versMs) {
    const kmh = pick([18, 36, 54, 72, 90, 108]);
    return {
      type: "numeric",
      chapter: "Automatismes — Proportionnalité",
      prompt: `Convertis ${kmh} km/h en m/s.`,
      answer: roundTo(kmh / 3.6, 2),
      steps: [`${kmh} \\div 3,6 = ${fr(roundTo(kmh / 3.6, 2))}`],
    };
  }
  const ms = randInt(1, 40);
  return {
    type: "numeric",
    chapter: "Automatismes — Proportionnalité",
    prompt: `Convertis ${ms} m/s en km/h.`,
    answer: roundTo(ms * 3.6, 2),
    steps: [`${ms} \\times 3,6 = ${fr(roundTo(ms * 3.6, 2))}`],
  };
}

// ---------- 4. Agrandissement ou réduction ? (mental, QCM) ----------
function genAutoAgrandissementReductionMentalQCM() {
  const k = pick([0.25, 0.5, 0.8, 1.2, 1.5, 2, 4]);
  const answer = k > 1 ? "Agrandissement" : "Réduction";
  return {
    type: "qcm",
    chapter: "Automatismes — Proportionnalité",
    prompt: `Un rapport \\(k = ${fr(k)}\\) correspond-il à un agrandissement ou à une réduction ?`,
    answer,
    options: ["Agrandissement", "Réduction"],
    steps: [k > 1 ? "k > 1 : agrandissement." : "k < 1 : réduction."],
  };
}

// ---------- 5. Nouvelle longueur après un rapport k (mental) ----------
function genAutoLongueurRapportMental() {
  const longueur = randInt(2, 30);
  const k = pick([0.5, 2, 3, 4]);
  return {
    type: "numeric",
    chapter: "Automatismes — Proportionnalité",
    prompt: `Une longueur de ${longueur} cm est multipliée par un rapport \\(k = ${fr(k)}\\). Quelle est la nouvelle longueur, en cm ?`,
    answer: longueur * k,
    steps: [`${longueur} \\times ${fr(k)} = ${longueur * k}`],
  };
}

const CH_PROPORTIONNALITE_Q = [
  genAutoQuatriemeProportionnelleMental,
  genAutoVitesseMoyenneMental,
  genAutoConversionVitesseMental,
  genAutoAgrandissementReductionMentalQCM,
  genAutoLongueurRapportMental,
];

// =========================== Chapitre 11 : Théorème de Thalès ===========================

// ---------- 1. Calculer AN (mental) ----------
function genAutoThalesCalculerANMental() {
  const AM = randInt(2, 8);
  const AB = randInt(AM + 2, AM + 8);
  const AC = randInt(4, 15);
  const AN = roundTo((AM / AB) * AC, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Théorème de Thalès",
    prompt: `M sur [AB], N sur [AC], (MN) // (BC). AM = ${AM}, AB = ${AB}, AC = ${AC}. Calcule AN (arrondi au centième si besoin).`,
    answer: AN,
    tolerance: 0.01,
    steps: [`AN = \\dfrac{${AM} \\times ${AC}}{${AB}} \\approx ${fr(AN)}`],
  };
}

// ---------- 2. Calculer MN (mental) ----------
function genAutoThalesCalculerMNMental() {
  const AM = randInt(2, 8);
  const AB = randInt(AM + 2, AM + 8);
  const BC = randInt(4, 20);
  const MN = roundTo((AM / AB) * BC, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Théorème de Thalès",
    prompt: `M sur [AB], N sur [AC], (MN) // (BC). AM = ${AM}, AB = ${AB}, BC = ${BC}. Calcule MN (arrondi au centième si besoin).`,
    answer: MN,
    tolerance: 0.01,
    steps: [`MN = \\dfrac{${AM} \\times ${BC}}{${AB}} \\approx ${fr(MN)}`],
  };
}

// ---------- 3. Réciproque : parallèles ou non (mental, QCM) ----------
function genAutoThalesReciproqueMentalQCM() {
  const q = randInt(2, 5);
  const p = randInt(1, q - 1);
  const AB = q * randInt(2, 6);
  const AC = q * randInt(2, 6);
  const AM = (AB * p) / q;
  const isParallel = Math.random() < 0.5;
  const AN = isParallel ? (AC * p) / q : (AC * p) / q + nonZero(1, 2);
  return {
    type: "qcm",
    chapter: "Automatismes — Théorème de Thalès",
    prompt: `AM = ${AM}, AB = ${AB}, AN = ${AN}, AC = ${AC}. Les droites (MN) et (BC) sont-elles parallèles ?`,
    answer: isParallel ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`\\dfrac{AM}{AB} = \\dfrac{${AM}}{${AB}}`, `\\dfrac{AN}{AC} = \\dfrac{${AN}}{${AC}}`],
  };
}

// ---------- 4. Résoudre une proportion (mental) ----------
function genAutoThalesProportionMental() {
  const a = randInt(2, 15);
  const b = randInt(2, 15);
  const c = randInt(2, 15);
  const x = roundTo((b * c) / a, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Théorème de Thalès",
    prompt: `Sachant que \\(\\dfrac{${a}}{${b}} = \\dfrac{${c}}{x}\\), calcule x (arrondi au centième si besoin).`,
    answer: x,
    tolerance: 0.01,
    steps: [`x = \\dfrac{${b} \\times ${c}}{${a}} \\approx ${fr(x)}`],
  };
}

// ---------- 5. Agrandissement ou réduction (mental, QCM) ----------
function genAutoThalesAgrandissementReductionMentalQCM() {
  let a = randInt(2, 15);
  let b = randInt(2, 15);
  while (a === b) b = randInt(2, 15);
  const answer = a < b ? "Réduction" : "Agrandissement";
  return {
    type: "qcm",
    chapter: "Automatismes — Théorème de Thalès",
    prompt: `PT = ${a} cm et PR = ${b} cm, avec T sur [PR]. Le triangle PTV (V sur [PS], (TV) // (RS)) est-il un agrandissement ou une réduction de PRS ?`,
    answer,
    options: ["Agrandissement", "Réduction"],
    steps: [`Rapport PT/PR = ${fr(roundTo(a / b, 3))} ${a < b ? "< 1 : réduction" : "> 1 : agrandissement"}.`],
  };
}

const CH_THALES_Q = [
  genAutoThalesCalculerANMental,
  genAutoThalesCalculerMNMental,
  genAutoThalesReciproqueMentalQCM,
  genAutoThalesProportionMental,
  genAutoThalesAgrandissementReductionMentalQCM,
];

// =========================== Chapitre 12 : Propriétés des triangles rectangles ===========================

// ---------- 1. Calculer l'hypoténuse (mental, triplet pythagoricien) ----------
const AUTO_TRIPLETS = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
];
function genAutoPythagoreHypotenuseMental() {
  const [a, b, c] = pick(AUTO_TRIPLETS);
  return {
    type: "numeric",
    chapter: "Automatismes — Triangles rectangles",
    prompt: `RST rectangle en R, RS = ${a} cm, RT = ${b} cm. Calcule ST, en cm.`,
    answer: c,
    steps: [`ST^2 = ${a}^2 + ${b}^2 = ${c * c}`, `ST = ${c}`],
  };
}

// ---------- 2. Calculer un côté de l'angle droit (mental) ----------
function genAutoPythagoreCoteMental() {
  const [a, b, c] = pick(AUTO_TRIPLETS);
  return {
    type: "numeric",
    chapter: "Automatismes — Triangles rectangles",
    prompt: `DEF rectangle en D, EF = ${c} cm (hypoténuse), DE = ${a} cm. Calcule DF, en cm.`,
    answer: b,
    steps: [`DF^2 = ${c}^2 - ${a}^2 = ${b * b}`, `DF = ${b}`],
  };
}

// ---------- 3. Réciproque : rectangle ou non (mental, QCM) ----------
function genAutoPythagoreReciproqueMentalQCM() {
  const isRight = Math.random() < 0.5;
  const [a, b, c0] = pick(AUTO_TRIPLETS);
  const c = isRight ? c0 : c0 + nonZero(1, 3);
  return {
    type: "qcm",
    chapter: "Automatismes — Triangles rectangles",
    prompt: `Un triangle ABC a pour côtés AB = ${a} cm, BC = ${b} cm et AC = ${c} cm. Est-il rectangle ?`,
    answer: isRight ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`AC^2 = ${c * c}`, `AB^2 + BC^2 = ${a * a + b * b}`],
  };
}

// ---------- 4. Calculer un angle avec le cosinus (mental) ----------
function genAutoCosinusAngleMental() {
  const adjacent = randInt(3, 12);
  const hypotenuse = randInt(adjacent + 2, adjacent + 15);
  const angle = roundTo((Math.acos(adjacent / hypotenuse) * 180) / Math.PI, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Triangles rectangles",
    prompt: `NPQ rectangle en P, NP = ${adjacent} cm, NQ = ${hypotenuse} cm (hypoténuse). Calcule l'angle \\(\\widehat{PNQ}\\), en degrés (arrondi au dixième).`,
    answer: angle,
    tolerance: 0.2,
    steps: [`\\cos(\\widehat{PNQ}) = \\dfrac{${adjacent}}{${hypotenuse}}`, `\\widehat{PNQ} \\approx ${fr(angle)}°`],
  };
}

// ---------- 5. Calculer une longueur avec le cosinus (mental) ----------
function genAutoCosinusLongueurMental() {
  const angle = randInt(20, 70);
  const hypotenuse = randInt(8, 25);
  const adjacent = roundTo(hypotenuse * Math.cos((angle * Math.PI) / 180), 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Triangles rectangles",
    prompt: `UVW rectangle en V, \\(\\widehat{WUV} = ${angle}°\\), UW = ${hypotenuse} cm (hypoténuse). Calcule UV, en cm (arrondie au centième).`,
    answer: adjacent,
    tolerance: 0.05,
    steps: [`UV = \\cos(${angle}°) \\times ${hypotenuse} \\approx ${fr(adjacent)}`],
  };
}

const CH_TRIANGLES_RECTANGLES_Q = [
  genAutoPythagoreHypotenuseMental,
  genAutoPythagoreCoteMental,
  genAutoPythagoreReciproqueMentalQCM,
  genAutoCosinusAngleMental,
  genAutoCosinusLongueurMental,
];

// =========================== Chapitre 13 : Géométrie plane ===========================

// ---------- 1. Angle inconnu dans un triangle (mental) ----------
function genAutoAngleTriangleMental() {
  const a1 = randInt(20, 90);
  const a2 = randInt(20, 150 - a1);
  const a3 = 180 - a1 - a2;
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie plane",
    prompt: `Dans un triangle ABC, \\(\\widehat{A} = ${a1}°\\) et \\(\\widehat{B} = ${a2}°\\). Calcule \\(\\widehat{C}\\), en degrés.`,
    answer: a3,
    steps: [`\\widehat{C} = 180 - ${a1} - ${a2} = ${a3}°`],
  };
}

// ---------- 2. Angle dans un triangle isocèle (mental) ----------
function genAutoAngleIsoceleMental() {
  const apex = randInt(20, 140);
  const base = roundTo((180 - apex) / 2, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie plane",
    prompt: `MNP isocèle en M, \\(\\widehat{M} = ${apex}°\\). Calcule \\(\\widehat{N}\\), en degrés (arrondi au dixième si besoin).`,
    answer: base,
    tolerance: 0.1,
    steps: [`\\widehat{N} = \\dfrac{180 - ${apex}}{2} = ${fr(base)}°`],
  };
}

// ---------- 3. Translation : conservation des longueurs (mental) ----------
function genAutoTranslationLongueurMental() {
  const longueur = roundTo(2 + Math.random() * 10, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie plane",
    prompt: `[CD] est l'image de [AB] par une translation, avec AB = ${fr(longueur)} cm. Quelle est la longueur CD, en cm ?`,
    answer: longueur,
    steps: [`\\text{Une translation conserve les longueurs : } CD = ${fr(longueur)}\\ \\text{cm}`],
  };
}

// ---------- 4. Translation : conservation des angles (mental) ----------
function genAutoTranslationAngleMental() {
  const angle = randInt(15, 165);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie plane",
    prompt: `L'angle \\(\\widehat{XYZ}\\) est l'image de l'angle \\(\\widehat{ABC}\\) par une translation, avec \\(\\widehat{ABC} = ${angle}°\\). Quelle est la mesure de \\(\\widehat{XYZ}\\), en degrés ?`,
    answer: angle,
    steps: [`\\text{Une translation conserve les angles : } \\widehat{XYZ} = ${angle}°`],
  };
}

// ---------- 5. Translation : conservation de l'aire (mental) ----------
function genAutoTranslationAireMental() {
  const base = randInt(3, 12);
  const hauteur = randInt(2, 10);
  const aire = roundTo((base * hauteur) / 2, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie plane",
    prompt: `Un triangle a une aire de ${fr(aire)} m². Son image par une translation a une aire de combien de m² ?`,
    answer: aire,
    tolerance: 0.01,
    steps: [`\\text{Une translation conserve les aires : } ${fr(aire)}\\ m^2`],
  };
}

const CH_GEOMETRIE_PLANE_Q = [
  genAutoAngleTriangleMental,
  genAutoAngleIsoceleMental,
  genAutoTranslationLongueurMental,
  genAutoTranslationAngleMental,
  genAutoTranslationAireMental,
];

// =========================== Chapitre 14 : Géométrie dans l'espace ===========================

// ---------- 1. Volume d'une pyramide (mental) ----------
function genAutoVolumePyramideMental() {
  const aireBase = randInt(6, 30);
  const hauteur = randInt(3, 12);
  const volume = roundTo((aireBase * hauteur) / 3, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie dans l'espace",
    prompt: `Pyramide : aire de la base = ${aireBase} cm², hauteur = ${hauteur} cm. Calcule le volume, en cm³ (arrondi au centième si besoin).`,
    answer: volume,
    tolerance: 0.02,
    steps: [`V = \\dfrac{${aireBase} \\times ${hauteur}}{3} \\approx ${fr(volume)}`],
  };
}

// ---------- 2. Volume d'un cône (mental) ----------
function genAutoVolumeConeMental() {
  const rayon = randInt(2, 8);
  const hauteur = randInt(3, 12);
  const volume = roundTo((Math.PI * rayon * rayon * hauteur) / 3, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie dans l'espace",
    prompt: `Cône : rayon = ${rayon} cm, hauteur = ${hauteur} cm. Calcule le volume, en cm³ (arrondi au centième).`,
    answer: volume,
    tolerance: 0.5,
    steps: [`V = \\dfrac{\\pi \\times ${rayon}^2 \\times ${hauteur}}{3} \\approx ${fr(volume)}`],
  };
}

// ---------- 3. Génératrice d'un cône (mental) ----------
function genAutoGeneratriceConeMental() {
  const rayon = randInt(2, 8);
  const hauteur = randInt(3, 10);
  const generatrice = roundTo(Math.sqrt(rayon * rayon + hauteur * hauteur), 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie dans l'espace",
    prompt: `Cône de rayon ${rayon} cm et de hauteur ${hauteur} cm. Calcule sa génératrice, en cm (arrondie au centième).`,
    answer: generatrice,
    tolerance: 0.02,
    steps: [`\\text{génératrice} = \\sqrt{${rayon}^2 + ${hauteur}^2} \\approx ${fr(generatrice)}`],
  };
}

// ---------- 4. Coordonnées d'un sommet de pavé droit (mental) ----------
function genAutoCoordonneesPaveMental() {
  const L = randInt(2, 10);
  const l = randInt(2, 10);
  const h = randInt(2, 10);
  const sommets = { B: [L, 0, 0], C: [L, l, 0], D: [0, l, 0], E: [0, 0, h], G: [L, l, h], H: [0, l, h] };
  const noms = Object.keys(sommets);
  const nom = pick(noms);
  const coords = sommets[nom];
  const indexInfo = [
    { label: "abscisse", index: 0 },
    { label: "ordonnée", index: 1 },
    { label: "altitude", index: 2 },
  ];
  const info = pick(indexInfo);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie dans l'espace",
    prompt: `Pavé droit ABCDEFGH, AB = ${L}, AD = ${l}, AE = ${h}, repère d'origine A. Quelle est l'${info.label} du point ${nom} ?`,
    answer: coords[info.index],
    steps: [`${nom}(${coords.join(" ; ")})`],
  };
}

// ---------- 5. Milieu d'un segment dans l'espace (mental) ----------
function genAutoMilieuSegmentMental() {
  const P1 = [randInt(0, 10), randInt(0, 10), randInt(0, 10)];
  const P2 = [randInt(0, 10), randInt(0, 10), randInt(0, 10)];
  const indexInfo = [
    { label: "abscisse", index: 0 },
    { label: "ordonnée", index: 1 },
    { label: "altitude", index: 2 },
  ];
  const info = pick(indexInfo);
  const milieu = roundTo((P1[info.index] + P2[info.index]) / 2, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie dans l'espace",
    prompt: `R(${P1.join(" ; ")}) et S(${P2.join(" ; ")}). M est le milieu de [RS]. Quelle est l'${info.label} de M ?`,
    answer: milieu,
    tolerance: 0.01,
    steps: [`${info.label}(M) = \\dfrac{${P1[info.index]} + ${P2[info.index]}}{2} = ${fr(milieu)}`],
  };
}

const CH_GEOMETRIE_ESPACE_QUATRIEME_Q = [
  genAutoVolumePyramideMental,
  genAutoVolumeConeMental,
  genAutoGeneratriceConeMental,
  genAutoCoordonneesPaveMental,
  genAutoMilieuSegmentMental,
];

const THEMES = [
  { id: "nombres-relatifs-quatrieme", title: "Nombres relatifs", generators: CH_NOMBRES_RELATIFS_Q },
  { id: "addition-soustraction-rationnels", title: "Addition, soustraction de rationnels", generators: CH_ADDITION_SOUSTRACTION_RATIONNELS },
  { id: "multiplication-division-rationnels", title: "Multiplication, division de rationnels", generators: CH_MULTIPLICATION_DIVISION_RATIONNELS },
  { id: "puissances-quatrieme", title: "Puissances", generators: CH_PUISSANCES_Q },
  { id: "calcul-litteral-quatrieme", title: "Calcul littéral", generators: CH_CALCUL_LITTERAL_Q },
  { id: "resolution-equations", title: "Résolution d'équations", generators: CH_RESOLUTION_EQUATIONS_Q },
  { id: "notion-fonctions", title: "Notion de fonctions", generators: CH_NOTION_FONCTIONS_Q },
  { id: "statistiques-quatrieme", title: "Statistiques", generators: CH_STATISTIQUES_Q },
  { id: "probabilites-quatrieme", title: "Probabilités", generators: CH_PROBABILITES_Q },
  { id: "proportionnalite-quatrieme", title: "Proportionnalité", generators: CH_PROPORTIONNALITE_Q },
  { id: "theoreme-thales", title: "Théorème de Thalès", generators: CH_THALES_Q },
  { id: "triangles-rectangles-quatrieme", title: "Propriétés des triangles rectangles", generators: CH_TRIANGLES_RECTANGLES_Q },
  { id: "geometrie-plane", title: "Géométrie plane", generators: CH_GEOMETRIE_PLANE_Q },
  { id: "geometrie-espace-quatrieme", title: "Géométrie dans l'espace", generators: CH_GEOMETRIE_ESPACE_QUATRIEME_Q },
];

const GENERATORS = THEMES.flatMap((t) => t.generators);

function generate(themeId) {
  if (themeId && themeId !== "mix") {
    const theme = THEMES.find((t) => t.id === themeId);
    if (theme) return pick(theme.generators)();
  }
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "automatismes-quatrieme",
    title: "Automatismes",
    description: "Calcul rapide et automatismes du programme de 4e, chapitre après chapitre.",
    level: "quatrieme",
    freemiumDaily: 5,
    order: 1,
    isAutomatismes: true,
  },
  themes: THEMES.map(({ id, title }) => ({ id, title })),
  generate,
};
