// ---------------------------------------------------------------------------
// Chapitre : Automatismes (6e) — gratuit, freemium (5 questions/jour sans
// abonnement, illimité avec abonnement). Regroupe les mini-exercices de
// calcul rapide ("Je travaille mes automatismes") rencontrés à la fin de
// chaque chapitre du manuel 6e. Contient les 12 automatismes du chapitre 1
// (Nombres décimaux), les 12 du chapitre 2 (Opérations sur les décimaux, voir
// src/chapters/operations-decimaux.js), les 12 du chapitre 3 (Fractions, voir
// src/chapters/fractions.js), les 12 du chapitre 4 (Grandeurs et mesures, voir
// src/chapters/grandeurs-mesures.js), les 9 du chapitre 5 (Distances et
// symétries, voir src/chapters/distances-symetries.js — seulement 9 car ce
// chapitre est très construction/dessin, voir la note plus bas), les 12 du
// chapitre 6 (Angles, voir src/chapters/angles.js), les 6 du chapitre 7
// (Configurations géométriques, voir
// src/chapters/configurations-geometriques.js — seulement 6, même remarque
// que le chapitre 5), les 10 du chapitre 8 (Organisation et gestion de
// données, voir src/chapters/organisation-gestion-donnees.js) et les 12 du
// chapitre 9 (Proportionnalité, voir src/chapters/proportionnalite.js) —
// dernier chapitre du programme de 6e couvert par l'application.
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

function shuffleStatements(items) {
  const order = shuffle(items.map((_, i) => i));
  const options = order.map((i) => items[i].text);
  const answer = order.map((i, newIndex) => (items[i].correct ? newIndex : null)).filter((v) => v !== null);
  return { options, answer };
}

// Affichage français : virgule décimale. `fr` pour le texte normal, `frTex`
// pour l'intérieur d'un bloc LaTeX \( ... \) (accolades autour de la virgule
// pour éviter l'espacement supplémentaire que KaTeX ajoute après une virgule).
const fr = (n) => String(n).replace(".", ",");
const frTex = (n) => String(n).replace(".", "{,}");

// ---------- 1. Comprendre la numération décimale ----------
function genNumerationDecimale() {
  const base = pick([10, 100]);
  const mot = base === 10 ? "dixième" : "centième";
  const unite = randInt(0, 20);
  const count = randInt(1, base * 3);
  const value = roundTo(unite + count / base, base === 10 ? 1 : 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Numération décimale",
    prompt: `${unite} unité${unite > 1 ? "s" : ""} + ${count} ${mot}${count > 1 ? "s" : ""} = ?`,
    answer: value,
    steps: [`${unite} + ${count}/${base} = ${fr(value)}`],
  };
}

// ---------- 2. Écriture décimale / fractions décimales ----------
function genEcritureFractionDecimale() {
  const k = pick([10, 100, 1000]);
  const n = randInt(1, k === 10 ? 99 : k === 100 ? 999 : 3000);
  const value = roundTo(n / k, k === 10 ? 1 : k === 100 ? 2 : 3);
  const askDecimal = Math.random() < 0.5;
  if (askDecimal) {
    return {
      type: "numeric",
      chapter: "Automatismes — Écriture décimale",
      prompt: `\\(\\dfrac{${n}}{${k}} = ?\\) (écriture décimale)`,
      answer: value,
      steps: [`\\(\\dfrac{${n}}{${k}} = ${frTex(value)}\\)`],
    };
  }
  return {
    type: "numeric",
    chapter: "Automatismes — Écriture décimale",
    prompt: `Quel numérateur complète \\(\\dfrac{?}{${k}} = ${frTex(value)}\\) ?`,
    answer: n,
    steps: [`${fr(value)} \\times ${k} = ${n}`],
  };
}

// ---------- 3. Compléter un nombre décimal à 1 ----------
function genCompleterA1() {
  const x = randDecimal(0.01, 0.99, 2);
  const answer = roundTo(1 - x, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Compléter à 1",
    prompt: `${fr(x)} + ? = 1`,
    answer,
    steps: [`1 - ${fr(x)} = ${fr(answer)}`],
  };
}

// ---------- 4. Compléter un nombre décimal à 10 ----------
function genCompleterA10() {
  const x = randDecimal(0.1, 9.9, 2);
  const answer = roundTo(10 - x, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Compléter à 10",
    prompt: `${fr(x)} + ? = 10`,
    answer,
    steps: [`10 - ${fr(x)} = ${fr(answer)}`],
  };
}

// ---------- 5. Multiplier par 10, 100 ou 1 000 ----------
function genMultiplierPar10() {
  const base = pick([10, 100, 1000]);
  const decimals = pick([1, 2, 3]);
  const x = randDecimal(0.001, 90, decimals);
  const answer = roundTo(x * base, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplier par 10, 100, 1000",
    prompt: `\\(${frTex(x)} \\times ${base} = ?\\)`,
    answer,
    steps: [`\\(${frTex(x)} \\times ${base} = ${frTex(answer)}\\)`],
  };
}

// ---------- 6. Diviser par 10, 100 ou 1 000 ----------
function genDiviserPar10() {
  const base = pick([10, 100, 1000]);
  const x = randInt(1, 90) + pick([0, 0.5, 0.2]);
  const answer = roundTo(x / base, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Diviser par 10, 100, 1000",
    prompt: `\\(${frTex(x)} \\div ${base} = ?\\)`,
    answer,
    steps: [`\\(${frTex(x)} \\div ${base} = ${frTex(answer)}\\)`],
  };
}

// ---------- 7. Additionner et soustraire ----------
function genAdditionnerSoustraire() {
  const decimals = pick([1, 2]);
  const isAdd = Math.random() < 0.5;
  let a = randDecimal(0.01, 0.9, decimals);
  let b = randDecimal(0.01, 0.9, decimals);
  if (!isAdd && a < b) [a, b] = [b, a];
  const answer = roundTo(isAdd ? a + b : a - b, decimals);
  return {
    type: "numeric",
    chapter: "Automatismes — Additionner et soustraire",
    prompt: `\\(${frTex(a)} ${isAdd ? "+" : "-"} ${frTex(b)} = ?\\)`,
    answer,
    steps: [`\\(${frTex(a)} ${isAdd ? "+" : "-"} ${frTex(b)} = ${frTex(answer)}\\)`],
  };
}

// ---------- 8. Trouver un ordre de grandeur ----------
function genOrdreDeGrandeur() {
  const op = pick(["+", "-", "×", "÷"]);
  const roundUnit = (v) => Math.round(v);
  let a, b, exact, estimate;
  if (op === "+" || op === "-") {
    a = randDecimal(5, 60, 2);
    b = randDecimal(5, 60, 2);
    if (op === "-" && a < b) [a, b] = [b, a];
    exact = op === "+" ? a + b : a - b;
    estimate = op === "+" ? roundUnit(a) + roundUnit(b) : roundUnit(a) - roundUnit(b);
  } else if (op === "×") {
    a = randDecimal(1, 9, 1);
    b = randDecimal(1, 9, 1);
    exact = a * b;
    estimate = roundUnit(a) * roundUnit(b);
  } else {
    const divisor = randInt(2, 90);
    const quotient = randInt(2, 20);
    a = roundTo(divisor * quotient + randDecimal(0, 0.9, 2), 2);
    b = divisor;
    exact = a / b;
    estimate = roundUnit(a) / roundUnit(b);
  }
  const tolerance = Math.max(1, Math.abs(estimate) * 0.15);
  const opTex = op === "×" ? "\\times" : op === "÷" ? "\\div" : op;
  return {
    type: "numeric",
    chapter: "Automatismes — Ordre de grandeur",
    prompt: `Donne un ordre de grandeur de \\(${frTex(a)} ${opTex} ${frTex(b)}\\) (arrondis chaque nombre puis calcule).`,
    answer: estimate,
    tolerance,
    steps: [
      `On arrondit chaque nombre à l'unité : ${roundUnit(a)} et ${roundUnit(b)}.`,
      `${roundUnit(a)} ${opTex} ${roundUnit(b)} = ${fr(estimate)}`,
      `(Valeur exacte : environ ${fr(roundTo(exact, 2))})`,
    ],
  };
}

// ---------- 9. Calculer des doubles et moitiés ----------
function genDoublesMoities() {
  const isDouble = Math.random() < 0.5;
  const decimals = pick([1, 2]);
  const x = randDecimal(0.02, 20, decimals);
  const answer = roundTo(isDouble ? x * 2 : x / 2, decimals + 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Doubles et moitiés",
    prompt: `\\(${frTex(x)} ${isDouble ? "\\times 2" : "\\div 2"} = ?\\)`,
    answer,
    steps: [`\\(${frTex(x)} ${isDouble ? "\\times 2" : "\\div 2"} = ${frTex(answer)}\\)`],
  };
}

// ---------- 10. Compléter les suites ----------
function genSuitesDecimales() {
  const step = pick([0.1, -0.1, 0.2, -0.2, 0.01, -0.01, 0.5, -0.5]);
  const decimals = Math.abs(step) >= 0.1 ? 1 : 2;
  const start = randDecimal(1, 100, decimals);
  const terms = [start, roundTo(start + step, decimals), roundTo(start + 2 * step, decimals)];
  const answer = roundTo(start + 3 * step, decimals);
  return {
    type: "numeric",
    chapter: "Automatismes — Compléter les suites",
    prompt: `Complète la suite logique : ${terms.map(fr).join(" • ")} • ... ?`,
    answer,
    steps: [`Le pas entre deux termes est ${step >= 0 ? "+" : ""}${fr(step)}.`, `${fr(terms[2])} ${step >= 0 ? "+" : "-"} ${fr(Math.abs(step))} = ${fr(answer)}`],
  };
}

// ---------- 11. Arrondir un nombre décimal ----------
function genArrondir() {
  const x = randDecimal(0.5, 300, 2);
  const answer = roundTo(x, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Arrondir",
    prompt: `${fr(x)} ≈ ? (au dixième près)`,
    answer,
    tolerance: 0.05,
    steps: [`On regarde le chiffre des centièmes pour arrondir au dixième : ${fr(x)} ≈ ${fr(answer)}`],
  };
}

// ---------- 12. Trouver un nombre manquant dans une égalité à trou ----------
function genEgaliteATrou() {
  const form = pick(["axb", "sommeb", "diva", "axsoustrait"]);
  if (form === "axb") {
    // a × ? + b = c
    const a = nonZero(2, 9);
    const x = randInt(2, 15);
    const b = randInt(1, 20);
    const c = a * x + b;
    return {
      type: "numeric",
      chapter: "Automatismes — Égalité à trou",
      prompt: `${a} × ? + ${b} = ${c}`,
      answer: x,
      steps: [`${c} - ${b} = ${c - b}`, `${c - b} \\div ${a} = ${x}`],
    };
  }
  if (form === "sommeb") {
    // (a + ?) × b = c
    const a = randInt(2, 15);
    const b = nonZero(2, 9);
    const x = randInt(2, 15);
    const c = (a + x) * b;
    return {
      type: "numeric",
      chapter: "Automatismes — Égalité à trou",
      prompt: `(${a} + ?) × ${b} = ${c}`,
      answer: x,
      steps: [`${c} \\div ${b} = ${a + x}`, `${a + x} - ${a} = ${x}`],
    };
  }
  if (form === "diva") {
    // a ÷ ? + b = c
    const x = nonZero(2, 9);
    const quotient = randInt(2, 15);
    const a = x * quotient;
    const b = randInt(1, 20);
    const c = quotient + b;
    return {
      type: "numeric",
      chapter: "Automatismes — Égalité à trou",
      prompt: `${a} ÷ ? + ${b} = ${c}`,
      answer: x,
      steps: [`${c} - ${b} = ${quotient}`, `${a} \\div ${quotient} = ${x}`],
    };
  }
  // a × ? - b = c
  const a = nonZero(2, 9);
  const x = randInt(2, 15);
  const b = randInt(1, 20);
  const c = a * x - b;
  return {
    type: "numeric",
    chapter: "Automatismes — Égalité à trou",
    prompt: `${a} × ? - ${b} = ${c}`,
    answer: x,
    steps: [`${c} + ${b} = ${c + b}`, `${c + b} \\div ${a} = ${x}`],
  };
}

// ===========================================================================
// Chapitre 2 (Opérations sur les décimaux) — 12 automatismes supplémentaires,
// voir src/chapters/operations-decimaux.js pour le chapitre complet associé.
// ===========================================================================

// ---------- 13. Multiplier et diviser par 10, 100, 1000 ----------
function genMultDiviserPar10_100_1000() {
  const base = pick([10, 100, 1000]);
  const isMult = Math.random() < 0.5;
  const decimals = pick([1, 2, 3]);
  const x = randDecimal(0.01, 900, decimals);
  const answer = roundTo(isMult ? x * base : x / base, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplier et diviser par 10, 100, 1000",
    prompt: `${fr(x)} ${isMult ? "×" : "÷"} ${base} = ?`,
    answer,
    steps: [`${fr(x)} ${isMult ? "\\times" : "\\div"} ${base} = ${fr(answer)}`],
  };
}

// ---------- 14. Multiplier par 0,1 ; 0,01 ; 0,001 ----------
function genMultiplierPar0_1_001_0001() {
  const mult = pick([0.1, 0.01, 0.001]);
  const decimals = pick([0, 1, 2]);
  const x = decimals === 0 ? randInt(2, 2000) : randDecimal(0.5, 900, decimals);
  const answer = roundTo(x * mult, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplier par 0,1 ; 0,01 ; 0,001",
    prompt: `${fr(x)} × ${fr(mult)} = ?`,
    answer,
    steps: [`${fr(x)} \\times ${fr(mult)} = ${fr(answer)}`],
  };
}

// ---------- 15. Multiplier deux nombres décimaux ----------
function genMultiplierDeuxDecimauxAuto() {
  const a = randDecimal(0.01, 0.9, 2);
  const b = randDecimal(0.01, 0.9, 2);
  const answer = roundTo(a * b, 4);
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplier deux nombres décimaux",
    prompt: `${fr(a)} × ${fr(b)} = ?`,
    answer,
    steps: [`${fr(a)} \\times ${fr(b)} = ${fr(answer)}`],
  };
}

// ---------- 16. Ajouter deux nombres décimaux ----------
function genAjouterDeuxDecimaux() {
  const decimals = pick([1, 2, 3]);
  const a = randDecimal(0.1, 50, decimals);
  const b = randDecimal(0.1, 50, decimals);
  const answer = roundTo(a + b, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — Ajouter deux nombres décimaux",
    prompt: `${fr(a)} + ${fr(b)} = ?`,
    answer,
    steps: [`${fr(a)} + ${fr(b)} = ${fr(answer)}`],
  };
}

// ---------- 17. Soustraire deux nombres décimaux ----------
function genSoustraireDeuxDecimaux() {
  const decimals = pick([1, 2]);
  const b = randDecimal(0.1, 30, decimals);
  const a = roundTo(b + randDecimal(0.1, 20, decimals), decimals);
  const answer = roundTo(a - b, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — Soustraire deux nombres décimaux",
    prompt: `${fr(a)} - ${fr(b)} = ?`,
    answer,
    steps: [`${fr(a)} - ${fr(b)} = ${fr(answer)}`],
  };
}

// ---------- 18. Diviser un nombre décimal par un entier ----------
function genDiviserDecimalParEntierAuto() {
  const diviseur = nonZero(2, 9);
  const quotient = randDecimal(0.5, 20, pick([1, 2]));
  const dividende = roundTo(quotient * diviseur, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — Diviser un décimal par un entier",
    prompt: `${fr(dividende)} ÷ ${diviseur} = ?`,
    answer: quotient,
    steps: [`${fr(dividende)} \\div ${diviseur} = ${fr(quotient)}`],
  };
}

// ---------- 19. Ordre de grandeur d'un produit de décimaux ----------
function genOrdreDeGrandeurProduitAuto() {
  const a = randDecimal(1, 90, pick([1, 2]));
  const b = randDecimal(1, 20, pick([1, 2]));
  const estimate = Math.round(a) * Math.round(b);
  const tolerance = Math.max(2, Math.abs(estimate) * 0.15);
  return {
    type: "numeric",
    chapter: "Automatismes — Ordre de grandeur d'un produit",
    prompt: `Donne un ordre de grandeur de ${fr(a)} × ${fr(b)}.`,
    answer: estimate,
    tolerance,
    steps: [`${Math.round(a)} \\times ${Math.round(b)} = ${estimate}`],
  };
}

// ---------- 20. Multiplier un décimal par 5, par 50 ----------
function genMultiplierPar5ou50() {
  const mult = pick([5, 50]);
  const x = randDecimal(0.1, 40, pick([1, 2]));
  const answer = roundTo(x * mult, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplier par 5, par 50",
    prompt: `${fr(x)} × ${mult} = ?`,
    answer,
    steps: [`${fr(x)} \\times ${mult} = ${fr(answer)}`],
  };
}

// ---------- 21. Doubles et moitiés ----------
function genDoublesMoitiesAuto() {
  const isDouble = Math.random() < 0.5;
  const decimals = pick([0, 1, 2]);
  const x = decimals === 0 ? randInt(2, 100) : randDecimal(0.2, 90, decimals);
  const answer = roundTo(isDouble ? x * 2 : x / 2, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — Doubles et moitiés",
    prompt: isDouble ? `Quel est le double de ${fr(x)} ?` : `Quelle est la moitié de ${fr(x)} ?`,
    answer,
    steps: [isDouble ? `${fr(x)} \\times 2 = ${fr(answer)}` : `${fr(x)} \\div 2 = ${fr(answer)}`],
  };
}

// ---------- 22. Multiplier un nombre entier par 10 ; 100 ; 0,1 ; 0,01 ----------
function genMultiplierEntierParPuissance() {
  const mult = pick([10, 100, 0.1, 0.01]);
  const x = randInt(2, 500);
  const answer = roundTo(x * mult, 4);
  const asOpDroite = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplier par 10, 100, 0,1 ou 0,01",
    prompt: asOpDroite ? `${x} × ${fr(mult)} = ?` : `${fr(mult)} × ${x} = ?`,
    answer,
    steps: [`${x} \\times ${fr(mult)} = ${fr(answer)}`],
  };
}

// ---------- 23. Multiplier par 0,5 ----------
function genMultiplierPar0_5() {
  const x = randInt(2, 400);
  const answer = roundTo(x * 0.5, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplier par 0,5",
    prompt: `${x} × 0,5 = ?`,
    answer,
    steps: [`${x} \\times 0{,}5 = ${fr(answer)}`],
  };
}

// ---------- 24. Diviser par 4 et par 8 ----------
function genDiviserPar4Et8() {
  const diviseur = pick([4, 8]);
  const quotient = randInt(2, 200);
  const dividende = quotient * diviseur;
  return {
    type: "numeric",
    chapter: "Automatismes — Diviser par 4 et par 8",
    prompt: `${dividende} ÷ ${diviseur} = ?`,
    answer: quotient,
    steps: [`${dividende} \\div ${diviseur} = ${quotient}`],
  };
}

// ===========================================================================
// Chapitre 3 (Fractions) — 12 automatismes supplémentaires, voir
// src/chapters/fractions.js pour le chapitre complet associé.
// ===========================================================================

// ---------- 25. Écrire sous forme décimale des fractions simples ----------
function genEcritureDecimaleFractionSimple() {
  const pairs = [
    [5, 4], [9, 2], [8, 5], [12, 10], [5, 2], [102, 100],
    [7, 4], [3, 2], [21, 20], [9, 4], [11, 10], [3, 4],
  ];
  const [num, den] = pick(pairs);
  const answer = roundTo(num / den, 4);
  return {
    type: "numeric",
    chapter: "Automatismes — Écriture décimale de fractions",
    prompt: `\\(\\dfrac{${num}}{${den}} = ?\\) (écriture décimale)`,
    answer,
    steps: [`\\(\\dfrac{${num}}{${den}} = ${frTex(answer)}\\)`],
  };
}

// ---------- 26. Compléter une multiplication à trou ----------
function genMultiplicationATrouDecimale() {
  const a = pick([2, 4, 5, 8, 10, 20, 25, 50]);
  const x = randDecimal(0.2, 20, pick([1, 2]));
  const c = roundTo(a * x, 4);
  const missingLeft = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplication à trou",
    prompt: missingLeft ? `${a} × ? = ${fr(c)}` : `? × ${a} = ${fr(c)}`,
    answer: x,
    steps: [`${fr(c)} \\div ${a} = ${fr(x)}`],
  };
}

// ---------- 27. Prendre une fraction d'un nombre ----------
function genPrendreFractionDunNombre() {
  const den = randInt(2, 10);
  const num = nonZero(1, den * 2);
  const k = randInt(2, 12);
  const nombre = den * k;
  const answer = num * k;
  return {
    type: "numeric",
    chapter: "Automatismes — Fraction d'un nombre",
    prompt: `\\(\\dfrac{${num}}{${den}}\\) de ${nombre} = ?`,
    answer,
    steps: [`${nombre} \\div ${den} = ${k}`, `${k} \\times ${num} = ${answer}`],
  };
}

// ---------- 28. Écrire des fractions égales ----------
function genFractionsEgalesAuto() {
  const a = nonZero(1, 9);
  const b = randInt(2, 10);
  const m = randInt(2, 9);
  const askNumerator = Math.random() < 0.5;
  if (askNumerator) {
    return {
      type: "numeric",
      chapter: "Automatismes — Fractions égales",
      prompt: `\\(\\dfrac{${a}}{${b}} = \\dfrac{?}{${b * m}}\\)`,
      answer: a * m,
      steps: [`On multiplie numérateur et dénominateur par ${m}.`],
    };
  }
  return {
    type: "numeric",
    chapter: "Automatismes — Fractions égales",
    prompt: `\\(\\dfrac{${a}}{${b}} = \\dfrac{${a * m}}{?}\\)`,
    answer: b * m,
    steps: [`On multiplie numérateur et dénominateur par ${m}.`],
  };
}

// ---------- 29. Décomposer une fraction en somme d'un entier et d'une fraction ----------
function genDecomposerFractionAuto() {
  const den = randInt(2, 10);
  const q = randInt(1, 8);
  const r = nonZero(1, den - 1) || 1;
  const num = den * q + r;
  const askEntier = Math.random() < 0.5;
  if (askEntier) {
    return {
      type: "numeric",
      chapter: "Automatismes — Décomposer une fraction",
      prompt: `\\(\\dfrac{${num}}{${den}} = ? + \\dfrac{${r}}{${den}}\\) — quelle est la partie entière ?`,
      answer: q,
      steps: [`${num} = ${den} \\times ${q} + ${r}`],
    };
  }
  return {
    type: "numeric",
    chapter: "Automatismes — Décomposer une fraction",
    prompt: `\\(\\dfrac{${num}}{${den}} = ${q} + \\dfrac{?}{${den}}\\) — quel est ce numérateur ?`,
    answer: r,
    steps: [`${num} = ${den} \\times ${q} + ${r}`],
  };
}

// ---------- 30. Appliquer un pourcentage à un nombre ----------
function genAppliquerPourcentageAuto() {
  const base = randInt(1, 15) * 20;
  const pct = pick([10, 20, 30, 40, 50, 60, 70, 80, 90]);
  const answer = (base * pct) / 100;
  return {
    type: "numeric",
    chapter: "Automatismes — Pourcentage d'un nombre",
    prompt: `${pct} % de ${base} = ?`,
    answer,
    steps: [`${base} \\times \\dfrac{${pct}}{100} = ${answer}`],
  };
}

// ---------- 31. Savoir si un nombre est multiple de 2, 3, 5 ou 10 ----------
function genMultipleDe2_3_5_10() {
  const n = randInt(10, 200);
  const diviseurs = [2, 3, 5, 10];
  const items = diviseurs.map((d) => ({ text: `${n} est un multiple de ${d}.`, correct: n % d === 0 }));
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Automatismes — Multiples de 2, 3, 5, 10",
    prompt: `Coche les affirmations vraies à propos de ${n}.`,
    options,
    answer,
    steps: [`${n} est multiple de 2 : ${n % 2 === 0 ? "vrai" : "faux"} ; de 3 : ${n % 3 === 0 ? "vrai" : "faux"} ; de 5 : ${n % 5 === 0 ? "vrai" : "faux"} ; de 10 : ${n % 10 === 0 ? "vrai" : "faux"}.`],
  };
}

// ---------- 32. Réviser ses tables de multiplication ----------
function genTablesMultiplicationAuto() {
  const a = randInt(2, 10);
  const b = randInt(2, 10);
  const c = a * b;
  const hideFirst = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Tables de multiplication",
    prompt: hideFirst ? `? × ${b} = ${c}` : `${a} × ? = ${c}`,
    answer: hideFirst ? a : b,
    steps: [`${a} \\times ${b} = ${c}`],
  };
}

// ---------- 33. Nombres entiers et fractions ----------
function genNombresEntiersFractionsAuto() {
  const n = randInt(1, 9);
  const den = randInt(2, 10);
  const answer = n * den;
  return {
    type: "numeric",
    chapter: "Automatismes — Nombres entiers et fractions",
    prompt: `${n} = \\(\\dfrac{?}{${den}}\\)`,
    answer,
    steps: [`${n} \\times ${den} = ${answer}`],
  };
}

// ---------- 34. Encadrer une fraction par deux entiers consécutifs ----------
function genEncadrerFractionAuto() {
  const den = randInt(2, 10);
  const num = randInt(den + 1, den * 9);
  const answer = Math.floor(num / den);
  return {
    type: "numeric",
    chapter: "Automatismes — Encadrer une fraction",
    prompt: `Quel est le plus grand entier inférieur ou égal à \\(\\dfrac{${num}}{${den}}\\) ?`,
    answer,
    steps: [`${num} \\div ${den} \\approx ${roundTo(num / den, 2)}`],
  };
}

// ---------- 35. Donner l'écriture décimale d'une fraction ----------
function genEcritureDecimaleFractionAuto() {
  const den = pick([10, 20, 25, 40, 50, 100, 200, 250, 400, 500, 800]);
  const quotient = randDecimal(0.5, 60, pick([0, 1, 2]));
  const num = Math.round(den * quotient);
  const answer = roundTo(num / den, 4);
  return {
    type: "numeric",
    chapter: "Automatismes — Écriture décimale d'une fraction",
    prompt: `\\(\\dfrac{${num}}{${den}} = ?\\)`,
    answer,
    steps: [`${num} \\div ${den} = ${fr(answer)}`],
  };
}

// ---------- 36. Utiliser le lexique des opérations ----------
function genLexiqueOperationsAuto() {
  const op = pick(["somme", "difference", "produit", "quotient"]);
  if (op === "somme") {
    const a = randInt(5, 150);
    const b = randInt(5, 150);
    return {
      type: "numeric",
      chapter: "Automatismes — Lexique des opérations",
      prompt: `La somme de ${a} et ${b} est :`,
      answer: a + b,
      steps: [`${a} + ${b} = ${a + b}`],
    };
  }
  if (op === "difference") {
    const b = randInt(5, 100);
    const a = b + randInt(5, 100);
    return {
      type: "numeric",
      chapter: "Automatismes — Lexique des opérations",
      prompt: `La différence de ${a} et ${b} est :`,
      answer: a - b,
      steps: [`${a} - ${b} = ${a - b}`],
    };
  }
  if (op === "produit") {
    const a = randInt(2, 12);
    const b = randInt(2, 12);
    return {
      type: "numeric",
      chapter: "Automatismes — Lexique des opérations",
      prompt: `Le produit de ${a} par ${b} est :`,
      answer: a * b,
      steps: [`${a} \\times ${b} = ${a * b}`],
    };
  }
  const b = nonZero(2, 9);
  const quotient = randInt(2, 15);
  const a = b * quotient;
  return {
    type: "numeric",
    chapter: "Automatismes — Lexique des opérations",
    prompt: `Le quotient de ${a} par ${b} est :`,
    answer: quotient,
    steps: [`${a} \\div ${b} = ${quotient}`],
  };
}

// ===========================================================================
// Chapitre 4 (Grandeurs et mesures) — 12 automatismes supplémentaires, voir
// src/chapters/grandeurs-mesures.js pour le chapitre complet associé.
// ===========================================================================

// ---------- 37. Périmètre d'un disque ou d'une partie de disque ----------
function genPerimetreDisqueOuPartieAuto() {
  const r = randInt(2, 15);
  const isDemi = Math.random() < 0.5;
  const D = 2 * r;
  const perimCercle = roundTo(Math.PI * D, 2);
  const perimDemi = roundTo(Math.PI * r + D, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Périmètre d'un disque",
    prompt: isDemi
      ? `Un demi-disque a un rayon de ${r} cm. Quel est le périmètre de ce demi-disque (arc + diamètre), arrondi au centième ?`
      : `Un disque a un rayon de ${r} cm. Quel est son périmètre, arrondi au centième ?`,
    answer: isDemi ? perimDemi : perimCercle,
    tolerance: 0.05,
    steps: [isDemi ? `\\pi \\times ${r} + ${D} \\approx ${perimDemi}` : `\\pi \\times ${D} \\approx ${perimCercle}`],
  };
}

// ---------- 38. Périmètre d'une figure complexe (somme de côtés) ----------
function genPerimetreFigureComplexeAuto() {
  const n = randInt(4, 7);
  const segs = Array.from({ length: n }, () => randInt(2, 25));
  const total = segs.reduce((a, b) => a + b, 0);
  return {
    type: "numeric",
    chapter: "Automatismes — Périmètre d'une figure complexe",
    prompt: `Une figure a pour côtés (en cm) : ${segs.join(", ")}. Quel est son périmètre ?`,
    answer: total,
    steps: [`${segs.join(" + ")} = ${total}`],
  };
}

// ---------- 39. Convertir des unités de longueur ----------
const UNITES_LONGUEUR_AUTO = ["km", "hm", "dam", "m", "dm", "cm", "mm"];
function genConvertirLongueurAuto() {
  const i = randInt(0, UNITES_LONGUEUR_AUTO.length - 2);
  const j = randInt(i + 1, UNITES_LONGUEUR_AUTO.length - 1);
  const facteur = 10 ** (j - i);
  const value = randDecimal(0.5, 90, pick([0, 1, 2]));
  const result = roundTo(value * facteur, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Convertir des longueurs",
    prompt: `Convertis ${fr(value)} ${UNITES_LONGUEUR_AUTO[i]} en ${UNITES_LONGUEUR_AUTO[j]}.`,
    answer: result,
    steps: [`1 ${UNITES_LONGUEUR_AUTO[i]} = ${facteur} ${UNITES_LONGUEUR_AUTO[j]}`],
  };
}

// ---------- 40-41. Convertir des unités d'aire (niveaux 1 et 2) ----------
const UNITES_AIRE_AUTO = ["km2", "hm2", "dam2", "m2", "dm2", "cm2", "mm2"];
const UNITES_AIRE_LABEL_AUTO = { km2: "km²", hm2: "hm²", dam2: "dam²", m2: "m²", dm2: "dm²", cm2: "cm²", mm2: "mm²" };
function genConvertirAireAuto(niveau) {
  const maxSpan = niveau === 1 ? 2 : 3;
  const i = randInt(0, UNITES_AIRE_AUTO.length - 2);
  const j = randInt(i + 1, Math.min(UNITES_AIRE_AUTO.length - 1, i + maxSpan));
  const facteur = 100 ** (j - i);
  const value = randDecimal(0.5, 90, pick([0, 1, 2]));
  const result = roundTo(value * facteur, 6);
  return {
    type: "numeric",
    chapter: `Automatismes — Convertir des aires (niveau ${niveau})`,
    prompt: `Convertis ${fr(value)} ${UNITES_AIRE_LABEL_AUTO[UNITES_AIRE_AUTO[i]]} en ${UNITES_AIRE_LABEL_AUTO[UNITES_AIRE_AUTO[j]]}.`,
    answer: result,
    steps: [`1 ${UNITES_AIRE_LABEL_AUTO[UNITES_AIRE_AUTO[i]]} = ${facteur} ${UNITES_AIRE_LABEL_AUTO[UNITES_AIRE_AUTO[j]]}`],
  };
}
function genConvertirAireNiveau1Auto() {
  return genConvertirAireAuto(1);
}
function genConvertirAireNiveau2Auto() {
  return genConvertirAireAuto(2);
}

// ---------- 42. Lire l'heure sur une horloge ----------
function buildClockFigureAuto(heureAffichee, minute) {
  const R = 55;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const minuteAngleDeg = (minute / 60) * 360 - 90;
  const hourAngleDeg = (((heureAffichee % 12) + minute / 60) / 12) * 360 - 90;
  const minuteLen = R * 0.85;
  const hourLen = R * 0.55;
  const C = { id: "C", x: 0, y: 0, hideDot: true, hideLabel: true };
  const M = { id: "M", x: minuteLen * Math.cos(toRad(minuteAngleDeg)), y: minuteLen * Math.sin(toRad(minuteAngleDeg)), hideDot: true, hideLabel: true };
  const H = { id: "H", x: hourLen * Math.cos(toRad(hourAngleDeg)), y: hourLen * Math.sin(toRad(hourAngleDeg)), hideDot: true, hideLabel: true };
  const markLabel = (num, angleDeg) => ({ x: (R + 12) * Math.cos(toRad(angleDeg)), y: (R + 12) * Math.sin(toRad(angleDeg)) + 3, text: String(num) });
  return {
    points: [C, M, H],
    circles: [{ center: "C", radius: R }],
    segments: [{ from: "C", to: "M" }, { from: "C", to: "H" }],
    freeLabels: [markLabel(12, -90), markLabel(3, 0), markLabel(6, 90), markLabel(9, 180)],
  };
}
function genLireHeureHorlogeAuto() {
  const heureAffichee = randInt(1, 12);
  const minute = randInt(0, 11) * 5;
  const hStr = String(heureAffichee);
  const mStr = String(minute).padStart(2, "0");
  const accepted = minute === 0 ? [`${hStr}h`, `${hStr}h00`, `${hStr}:00`, `${hStr}h 00`] : [`${hStr}h${mStr}`, `${hStr}h ${mStr}`, `${hStr}:${mStr}`];
  return {
    type: "text",
    chapter: "Automatismes — Lire l'heure",
    prompt: `Quelle heure indique cette horloge ? (réponds au format 4h15)`,
    figure: buildClockFigureAuto(heureAffichee, minute),
    answer: accepted,
    steps: [`La petite aiguille est entre ${heureAffichee} et ${heureAffichee === 12 ? 1 : heureAffichee + 1}, la grande aiguille indique ${minute} minutes.`],
  };
}

// ---------- 43. Additionner des durées ----------
function genAdditionnerDeuxDureesAuto() {
  const h1 = randInt(0, 3);
  const m1 = randInt(0, 59);
  const h2 = randInt(0, 3);
  const m2 = randInt(0, 59);
  const totalMin = h1 * 60 + m1 + (h2 * 60 + m2);
  const askMinutes = Math.random() < 0.5;
  if (askMinutes) {
    return {
      type: "numeric",
      chapter: "Automatismes — Additionner des durées",
      prompt: `${h1} h ${m1} min + ${h2} h ${m2} min = ? minutes (au total)`,
      answer: totalMin,
      steps: [`${h1 * 60 + m1} + ${h2 * 60 + m2} = ${totalMin}`],
    };
  }
  return {
    type: "numeric",
    chapter: "Automatismes — Additionner des durées",
    prompt: `${h1} h ${m1} min + ${h2} h ${m2} min = ? heures entières (partie entière du total)`,
    answer: Math.floor(totalMin / 60),
    steps: [`${totalMin} \\div 60 \\approx ${roundTo(totalMin / 60, 2)}`],
  };
}

// ---------- 44. Convertir des durées (niveau 1) ----------
function genConvertirDureeNiveau1Auto() {
  const type = pick(["minVersHeureReste", "sVersMinReste", "heureMinVersMin"]);
  if (type === "minVersHeureReste") {
    const mins = randInt(65, 500);
    const askHeures = Math.random() < 0.5;
    return {
      type: "numeric",
      chapter: "Automatismes — Convertir des durées (niveau 1)",
      prompt: askHeures ? `${mins} min = ? h (partie entière)` : `${mins} min : combien de minutes restantes après les heures entières (le reste) ?`,
      answer: askHeures ? Math.floor(mins / 60) : mins % 60,
      steps: [`${mins} = 60 \\times ${Math.floor(mins / 60)} + ${mins % 60}`],
    };
  }
  if (type === "sVersMinReste") {
    const secs = randInt(65, 500);
    const askMin = Math.random() < 0.5;
    return {
      type: "numeric",
      chapter: "Automatismes — Convertir des durées (niveau 1)",
      prompt: askMin ? `${secs} s = ? min (partie entière)` : `${secs} s : combien de secondes restantes après les minutes entières (le reste) ?`,
      answer: askMin ? Math.floor(secs / 60) : secs % 60,
      steps: [`${secs} = 60 \\times ${Math.floor(secs / 60)} + ${secs % 60}`],
    };
  }
  const h = randInt(1, 5);
  const m = randInt(1, 59);
  return {
    type: "numeric",
    chapter: "Automatismes — Convertir des durées (niveau 1)",
    prompt: `${h} h ${m} min = ? minutes`,
    answer: h * 60 + m,
    steps: [`${h} \\times 60 + ${m} = ${h * 60 + m}`],
  };
}

// ---------- 45. Convertir des durées (niveau 2) ----------
function genConvertirDureeNiveau2Auto() {
  const type = pick(["heureVersJourReste", "joursHeureVersHeure"]);
  if (type === "heureVersJourReste") {
    const heures = randInt(25, 400);
    const askJours = Math.random() < 0.5;
    return {
      type: "numeric",
      chapter: "Automatismes — Convertir des durées (niveau 2)",
      prompt: askJours ? `${heures} h = ? jours (partie entière)` : `${heures} h : combien d'heures restantes après les jours entiers ?`,
      answer: askJours ? Math.floor(heures / 24) : heures % 24,
      steps: [`${heures} = 24 \\times ${Math.floor(heures / 24)} + ${heures % 24}`],
    };
  }
  const jours = randInt(1, 10);
  const heuresReste = randInt(0, 23);
  return {
    type: "numeric",
    chapter: "Automatismes — Convertir des durées (niveau 2)",
    prompt: `${jours} jours ${heuresReste} h = ? heures au total`,
    answer: jours * 24 + heuresReste,
    steps: [`${jours} \\times 24 + ${heuresReste} = ${jours * 24 + heuresReste}`],
  };
}

// ---------- 46. Comparer des durées ----------
const DUREE_UNITES_AUTO = { minute: 60, heure: 3600, jour: 86400, mois: 2592000, an: 31536000, siecle: 3153600000 };
function randomDureeExprAuto() {
  const unit = pick(["minute", "heure", "jour", "mois", "an", "siecle"]);
  const value = randInt(1, unit === "siecle" ? 5 : unit === "an" ? 400 : 60);
  return { text: `${value} ${unit}${value > 1 ? "s" : ""}`, seconds: value * DUREE_UNITES_AUTO[unit] };
}
function genComparerDureesAuto() {
  let d1, d2;
  do {
    d1 = randomDureeExprAuto();
    d2 = randomDureeExprAuto();
  } while (d1.seconds === d2.seconds);
  const correct = d1.seconds > d2.seconds ? d1.text : d2.text;
  return {
    type: "qcm",
    chapter: "Automatismes — Comparer des durées",
    prompt: `Quelle est la durée la plus grande ?`,
    answer: correct,
    options: [d1.text, d2.text],
    steps: [`${d1.text} = ${d1.seconds} s ; ${d2.text} = ${d2.seconds} s`],
  };
}

// ---------- 47. Convertir une durée sexagésimale en écriture décimale ----------
function genConvertirDureeSexagesimaleVersDecimaleAuto() {
  const m = randInt(1, 9) * 6;
  const answer = roundTo(m / 60, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Durées sexagésimal → décimal",
    prompt: `${m} min = ? h (écriture décimale)`,
    answer,
    steps: [`${m} \\div 60 = ${fr(answer)}`],
  };
}

// ---------- 48. Convertir une durée décimale en écriture sexagésimale ----------
function genConvertirDureeDecimaleVersSexagesimaleAuto() {
  const dixieme = randInt(1, 9);
  const heureDecimale = roundTo(dixieme / 10, 1);
  const answer = dixieme * 6;
  return {
    type: "numeric",
    chapter: "Automatismes — Durées décimal → sexagésimal",
    prompt: `${fr(heureDecimale)} h = ? min`,
    answer,
    steps: [`${fr(heureDecimale)} \\times 60 = ${answer}`],
  };
}

// ===========================================================================
// Chapitre 5 (Distances et symétries) — le chapitre source ne propose que 9
// automatismes (au lieu de 12), et les 4 premiers ("tracer à main levée le
// symétrique", "tracer les axes de symétrie", "tracer un schéma d'un
// programme", "écrire le programme d'une figure") sont des tâches de
// construction/dessin non automatisables. Ils sont remplacés ici par des
// automatismes équivalents en contenu (mêmes notions : symétrie, cercle,
// distance) mais à réponse unique vérifiable. Les 5 derniers ("transversaux"
// du manuel) sont repris fidèlement. Voir src/chapters/distances-symetries.js
// pour le chapitre complet associé.
// ===========================================================================

// ---------- 37 (substitut). Symétrique réciproque d'un point ----------
function genSymetriqueReciproqueAuto() {
  const [p1, p2] = shuffle(["A", "B", "C", "D", "E", "F", "G", "H"]).slice(0, 2);
  return {
    type: "text",
    chapter: "Automatismes — Symétrie axiale",
    prompt: `Le point ${p1} est le symétrique du point ${p2} par rapport à la droite (d). Quel est le symétrique du point ${p2} par rapport à (d) ?`,
    answer: [p1],
    steps: [`La symétrie axiale est réciproque : si ${p1} est le symétrique de ${p2}, alors ${p2} est le symétrique de ${p1}.`],
  };
}

// ---------- 38 (substitut). Position d'un point par rapport à un cercle ----------
function genPositionCercleDisqueAuto() {
  const r = randInt(3, 20);
  const relation = pick(["dans", "sur", "hors"]);
  const OP = relation === "dans" ? randInt(1, r - 1) : relation === "sur" ? r : r + randInt(1, 10);
  const options = ["P est dans le disque", "P est sur le cercle", "P est hors du disque"];
  const correct = relation === "dans" ? options[0] : relation === "sur" ? options[1] : options[2];
  return {
    type: "qcm",
    chapter: "Automatismes — Cercles et disques",
    prompt: `Le cercle de centre O a pour rayon ${r} cm. Le point P est situé à ${OP} cm de O. Que peut-on dire de P ?`,
    answer: correct,
    options,
    steps: [`On compare OP = ${OP} cm au rayon ${r} cm.`],
  };
}

// ---------- 39 (substitut). Rayon / diamètre d'un cercle ----------
function genRayonDiametreAuto() {
  const askDiametre = Math.random() < 0.5;
  if (askDiametre) {
    const r = randDecimal(0.5, 40, pick([0, 1]));
    return {
      type: "numeric",
      chapter: "Automatismes — Cercles et disques",
      prompt: `Un cercle a un rayon de ${fr(r)} cm. Quel est son diamètre, en cm ?`,
      answer: roundTo(r * 2, 2),
      steps: [`${fr(r)} \\times 2 = ${fr(roundTo(r * 2, 2))}`],
    };
  }
  const D = randDecimal(1, 80, pick([0, 1]));
  return {
    type: "numeric",
    chapter: "Automatismes — Cercles et disques",
    prompt: `Un cercle a un diamètre de ${fr(D)} cm. Quel est son rayon, en cm ?`,
    answer: roundTo(D / 2, 2),
    steps: [`${fr(D)} \\div 2 = ${fr(roundTo(D / 2, 2))}`],
  };
}

// ---------- 40 (substitut). Milieu d'un segment (additivité des longueurs) ----------
function genMilieuSegmentAdditiviteAuto() {
  const AM = randDecimal(0.5, 30, pick([0, 1]));
  const askAB = Math.random() < 0.5;
  if (askAB) {
    return {
      type: "numeric",
      chapter: "Automatismes — Distances",
      prompt: `M est le milieu du segment [AB]. AM = ${fr(AM)} cm. Quelle est la longueur AB ?`,
      answer: roundTo(AM * 2, 2),
      steps: [`AB = 2 \\times AM = ${fr(roundTo(AM * 2, 2))}`],
    };
  }
  const AB = roundTo(AM * 2, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Distances",
    prompt: `M est le milieu du segment [AB]. AB = ${fr(AB)} cm. Quelle est la longueur AM ?`,
    answer: AM,
    steps: [`AM = AB \\div 2 = ${fr(AM)}`],
  };
}

// ---------- 41. Multiplier par 11, 12 et 13 ----------
function genMultiplierPar11_12_13() {
  const mult = pick([11, 12, 13]);
  const x = randInt(2, 90);
  const answer = x * mult;
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplier par 11, 12, 13",
    prompt: `${x} × ${mult} = ?`,
    answer,
    steps: [`${x} \\times ${mult} = ${answer}`],
  };
}

// ---------- 42. Déterminer des diviseurs d'un nombre entier ----------
function genDiviseursEntier() {
  const n = randInt(10, 100);
  const candidats = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 6).sort((a, b) => a - b);
  const items = candidats.map((d) => ({ text: `${d} est un diviseur de ${n}.`, correct: n % d === 0 }));
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Automatismes — Diviseurs d'un nombre entier",
    prompt: `Parmi les nombres proposés, coche ceux qui divisent ${n}.`,
    options,
    answer,
    steps: [`Diviseurs de ${n} parmi ceux proposés : ${candidats.filter((d) => n % d === 0).join(", ") || "aucun"}.`],
  };
}

// ---------- 43. Résoudre des problèmes de durée ----------
function genProblemeDureeAuto() {
  const h1 = randInt(6, 18);
  const m1 = pick([0, 10, 15, 20, 30, 40, 45, 50]);
  const dureeMin = randInt(15, 180);
  const totalMin = h1 * 60 + m1 + dureeMin;
  const h2 = Math.floor(totalMin / 60) % 24;
  const m2 = totalMin % 60;
  return {
    type: "numeric",
    chapter: "Automatismes — Problèmes de durée",
    prompt: `Paul part à ${h1} h ${String(m1).padStart(2, "0")} et rentre à ${h2} h ${String(m2).padStart(2, "0")}. Combien de temps est-il parti, en minutes ?`,
    answer: dureeMin,
    steps: [`${h2 * 60 + m2} - ${h1 * 60 + m1} = ${dureeMin}`],
  };
}

// ---------- 44. Comparer des longueurs ----------
const LONGUEUR_FACTEURS_AUTO = { mm: 1, cm: 10, dm: 100, m: 1000, dam: 10000, hm: 100000, km: 1000000 };
function randomLongueurExprAuto() {
  const unit = pick(["mm", "cm", "dm", "m", "dam", "km"]);
  const value = randInt(1, 500);
  return { text: `${value} ${unit}`, base: value * LONGUEUR_FACTEURS_AUTO[unit] };
}
function genComparerLongueursAuto() {
  let e1, e2;
  do {
    e1 = randomLongueurExprAuto();
    e2 = randomLongueurExprAuto();
  } while (e1.base === e2.base);
  const correct = e1.base > e2.base ? e1.text : e2.text;
  return {
    type: "qcm",
    chapter: "Automatismes — Comparer des longueurs",
    prompt: `Quelle est la longueur la plus grande ?`,
    answer: correct,
    options: [e1.text, e2.text],
    steps: [`${e1.text} = ${e1.base} mm ; ${e2.text} = ${e2.base} mm`],
  };
}

// ---------- 45. Convertir des contenances ----------
const UNITES_CONTENANCE_AUTO = ["hL", "daL", "L", "dL", "cL", "mL"];
function genConvertirContenancesAuto() {
  const i = randInt(0, UNITES_CONTENANCE_AUTO.length - 2);
  const j = randInt(i + 1, UNITES_CONTENANCE_AUTO.length - 1);
  const facteur = 10 ** (j - i);
  const value = randDecimal(0.5, 90, pick([0, 1, 2]));
  const result = roundTo(value * facteur, 6);
  return {
    type: "numeric",
    chapter: "Automatismes — Convertir des contenances",
    prompt: `Convertis ${fr(value)} ${UNITES_CONTENANCE_AUTO[i]} en ${UNITES_CONTENANCE_AUTO[j]}.`,
    answer: result,
    steps: [`1 ${UNITES_CONTENANCE_AUTO[i]} = ${facteur} ${UNITES_CONTENANCE_AUTO[j]}`],
  };
}

// ===========================================================================
// Chapitre 6 (Angles) — 12 automatismes supplémentaires, voir
// src/chapters/angles.js pour le chapitre complet associé.
// ===========================================================================

// ---------- 46. Estimer un angle (figure) ----------
function genEstimerAngleAuto() {
  const angle = pick([20, 30, 45, 60, 75, 90, 105, 120, 135, 150, 160]);
  const startAngle = randInt(0, 360);
  const rayLen = 60;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const S = { id: "S", x: 0, y: 0, dx: -14, dy: 12 };
  const A = { id: "A", x: rayLen * Math.cos(toRad(startAngle)), y: rayLen * Math.sin(toRad(startAngle)), dy: -8 };
  const B = { id: "B", x: rayLen * Math.cos(toRad(startAngle + angle)), y: rayLen * Math.sin(toRad(startAngle + angle)), dy: -8 };
  const figure = { points: [S, A, B], segments: [{ from: "S", to: "A" }, { from: "S", to: "B" }] };
  const decoys = shuffle([angle - 30, angle + 30, angle - 60, angle + 60].filter((d) => d > 0 && d < 180 && d !== angle)).slice(0, 2);
  const options = shuffle([`${angle}°`, ...decoys.map((d) => `${d}°`)]);
  return {
    type: "qcm",
    chapter: "Automatismes — Estimer un angle",
    prompt: `Estime la mesure de cet angle et choisis la réponse la plus proche.`,
    figure,
    answer: `${angle}°`,
    options,
    steps: [`L'angle mesure exactement ${angle}°.`],
  };
}

// ---------- 47. Calculer le troisième angle d'un triangle ----------
function genTroisiemeAngleTriangleAuto() {
  const a = randInt(20, 120);
  const b = randInt(20, 160 - a);
  const c = 180 - a - b;
  return {
    type: "numeric",
    chapter: "Automatismes — Troisième angle d'un triangle",
    prompt: `Dans un triangle, deux angles mesurent ${a}° et ${b}°. Quelle est la mesure du troisième angle ?`,
    answer: c,
    steps: [`180 - (${a} + ${b}) = ${c}`],
  };
}

// ---------- 48. Calculer le troisième angle d'un triangle rectangle ----------
function genTroisiemeAngleTriangleRectangleAuto() {
  const a = randInt(5, 85);
  const b = 90 - a;
  return {
    type: "numeric",
    chapter: "Automatismes — Triangle rectangle",
    prompt: `Dans un triangle rectangle, un angle aigu mesure ${a}°. Quelle est la mesure de l'autre angle aigu ?`,
    answer: b,
    steps: [`90 - ${a} = ${b}`],
  };
}

// ---------- 49. Mesurer un angle (figure) ----------
function genMesurerAngleAuto() {
  const angle = randInt(15, 165);
  const startAngle = randInt(0, 360);
  const rayLen = 60;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const S = { id: "S", x: 0, y: 0, dx: -14, dy: 12 };
  const A = { id: "A", x: rayLen * Math.cos(toRad(startAngle)), y: rayLen * Math.sin(toRad(startAngle)), dy: -8 };
  const B = { id: "B", x: rayLen * Math.cos(toRad(startAngle + angle)), y: rayLen * Math.sin(toRad(startAngle + angle)), dy: -8 };
  const figure = { points: [S, A, B], segments: [{ from: "S", to: "A" }, { from: "S", to: "B" }] };
  return {
    type: "numeric",
    chapter: "Automatismes — Mesurer un angle",
    prompt: `Quelle est la mesure de l'angle ASB, en degrés ?`,
    figure,
    answer: angle,
    tolerance: 3,
    steps: [`L'angle ASB mesure ${angle}°.`],
  };
}

// ---------- 50. Calculer des expressions ----------
function genCalculerExpressionAuto() {
  const form = pick(["soustraireSomme", "doubleSoustraction", "simple"]);
  if (form === "soustraireSomme") {
    const a = randInt(10, 80);
    const b = randInt(10, 80);
    const answer = 180 - (a + b);
    return {
      type: "numeric",
      chapter: "Automatismes — Calculer des expressions",
      prompt: `180 - (${a} + ${b}) = ?`,
      answer,
      steps: [`${a} + ${b} = ${a + b}`, `180 - ${a + b} = ${answer}`],
    };
  }
  if (form === "doubleSoustraction") {
    const a = randInt(10, 80);
    const b = randInt(10, 80);
    const answer = 180 - a - b;
    return {
      type: "numeric",
      chapter: "Automatismes — Calculer des expressions",
      prompt: `180 - ${a} - ${b} = ?`,
      answer,
      steps: [`180 - ${a} = ${180 - a}`, `${180 - a} - ${b} = ${answer}`],
    };
  }
  const a = randInt(20, 90);
  const b = randInt(10, a - 5);
  return {
    type: "numeric",
    chapter: "Automatismes — Calculer des expressions",
    prompt: `${a} - ${b} = ?`,
    answer: a - b,
    steps: [`${a} - ${b} = ${a - b}`],
  };
}

// ---------- 51. Calculer un angle supplémentaire ----------
function genAngleSupplementaireAuto() {
  const a = randInt(10, 170);
  const b = 180 - a;
  const askB = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Angle supplémentaire",
    prompt: askB
      ? `Les points A, B et C sont alignés. L'angle ABD mesure ${a}°. Quelle est la mesure de l'angle DBC ?`
      : `Les points A, B et C sont alignés. L'angle DBC mesure ${b}°. Quelle est la mesure de l'angle ABD ?`,
    answer: askB ? b : a,
    steps: [`${a} + ${b} = 180`],
  };
}

// ---------- 52. Calculer des moitiés ----------
function genMoitiesAuto() {
  const half = randInt(5, 100);
  const isOdd = Math.random() < 0.3;
  const n = isOdd ? half * 2 + 1 : half * 2;
  const answer = roundTo(n / 2, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Calculer des moitiés",
    prompt: `${n} ÷ 2 = ?`,
    answer,
    steps: [`${n} \\div 2 = ${fr(answer)}`],
  };
}

// ---------- 53. Multiplier des grands nombres ----------
function genMultiplierGrandsNombresAuto() {
  const a = pick([20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 500, 600, 700, 800, 900, 1000, 2000, 2500, 5000, 7000]);
  const b = pick([2, 3, 4, 5, 6, 7, 8, 9, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400]);
  const answer = a * b;
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplier des grands nombres",
    prompt: `${a} × ${b} = ?`,
    answer,
    steps: [`${a} \\times ${b} = ${answer}`],
  };
}

// ---------- 54. Table de 60 ----------
function genTable60Auto() {
  const x = randInt(2, 15);
  const answer = x * 60;
  return {
    type: "numeric",
    chapter: "Automatismes — Table de 60",
    prompt: `${x} × 60 = ?`,
    answer,
    steps: [`${x} \\times 60 = ${answer}`],
  };
}

// ---------- 55. Multiplier en utilisant la distributivité ----------
function genDistributiviteAuto() {
  const a = randInt(2, 9);
  const b = pick([101, 102, 103, 104, 105, 107, 108, 109, 201, 202, 203, 301, 302, 998, 999, 1001, 1002, 1005]);
  const answer = a * b;
  return {
    type: "numeric",
    chapter: "Automatismes — Distributivité",
    prompt: `${a} × ${b} = ?`,
    answer,
    steps: [`${a} \\times ${b} = ${answer}`],
  };
}

// ---------- 56. Effectuer des calculs avec parenthèses ----------
function genCalculsParenthesesAuto() {
  const form = pick(["axbc", "abxc", "divisionParentheses"]);
  if (form === "axbc") {
    const a = randInt(2, 9);
    const b = randInt(2, 15);
    const c = randInt(2, 15);
    const answer = a * (b + c);
    return {
      type: "numeric",
      chapter: "Automatismes — Calculs avec parenthèses",
      prompt: `${a} × (${b} + ${c}) = ?`,
      answer,
      steps: [`${b} + ${c} = ${b + c}`, `${a} \\times ${b + c} = ${answer}`],
    };
  }
  if (form === "abxc") {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const c = randInt(2, 15);
    const answer = (a + b) * c;
    return {
      type: "numeric",
      chapter: "Automatismes — Calculs avec parenthèses",
      prompt: `(${a} + ${b}) × ${c} = ?`,
      answer,
      steps: [`${a} + ${b} = ${a + b}`, `${a + b} \\times ${c} = ${answer}`],
    };
  }
  const c = randInt(2, 9);
  const q = randInt(2, 15);
  const a = c * q;
  return {
    type: "numeric",
    chapter: "Automatismes — Calculs avec parenthèses",
    prompt: `${a} ÷ ${c} = ?`,
    answer: q,
    steps: [`${a} \\div ${c} = ${q}`],
  };
}

// ---------- 57. Calculer une proportion d'une heure ----------
function genProportionHeureAuto() {
  const den = pick([2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]);
  const num = randInt(1, den - 1);
  const answer = (num * 60) / den;
  return {
    type: "numeric",
    chapter: "Automatismes — Proportion d'une heure",
    prompt: `\\(\\dfrac{${num}}{${den}}\\) h = ? min`,
    answer,
    steps: [`${num} \\times 60 \\div ${den} = ${answer}`],
  };
}

// ===========================================================================
// Chapitre 7 (Configurations géométriques) — le chapitre source ne propose
// que 6 automatismes (pas de section "transversaux" distincte cette fois),
// et la moitié sont des tâches de construction/dessin non automatisables
// ("construire le schéma codé d'un triangle", "tracer des droites parallèles
// et perpendiculaires à main levée", "compter des cubes" sur un dessin en
// perspective donné). Remplacés ici par des automatismes équivalents en
// contenu (triangles particuliers, inégalité triangulaire, volume de cubes)
// à réponse unique vérifiable. Voir src/chapters/configurations-geometriques.js
// pour le chapitre complet associé.
// ===========================================================================

// ---------- 58 (substitut). Angle dans un triangle particulier ----------
function genAngleTriangleParticulierAuto() {
  const type = pick(["isocele", "equilateral", "rectangleIsocele"]);
  if (type === "equilateral") {
    return {
      type: "numeric",
      chapter: "Automatismes — Triangles particuliers",
      prompt: `ABC est un triangle équilatéral. Quelle est la mesure de chacun de ses angles ?`,
      answer: 60,
      steps: [`180 \\div 3 = 60`],
    };
  }
  if (type === "rectangleIsocele") {
    return {
      type: "numeric",
      chapter: "Automatismes — Triangles particuliers",
      prompt: `Un triangle rectangle isocèle a un angle droit. Quelle est la mesure de chacun des deux autres angles (égaux) ?`,
      answer: 45,
      steps: [`(180 - 90) \\div 2 = 45`],
    };
  }
  const baseAngle = randInt(20, 79);
  const sommetAngle = 180 - 2 * baseAngle;
  const askSommet = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Triangles particuliers",
    prompt: askSommet
      ? `Un triangle isocèle a deux angles à la base de ${baseAngle}° chacun. Quelle est la mesure de l'angle au sommet ?`
      : `Un triangle isocèle a un angle au sommet de ${sommetAngle}°. Quelle est la mesure de chacun des deux angles à la base ?`,
    answer: askSommet ? sommetAngle : baseAngle,
    steps: [`180 - 2 \\times ${baseAngle} = ${sommetAngle}`],
  };
}

// ---------- 59 (substitut). Un triangle existe-t-il ? ----------
function genTriangleExisteAuto() {
  const a = randInt(3, 20);
  const b = randInt(3, 20);
  const wantValid = Math.random() < 0.5;
  let c;
  if (wantValid) {
    const lo = Math.abs(a - b) + 1;
    const hi = a + b - 1;
    c = lo <= hi ? randInt(lo, hi) : Math.max(a, b);
  } else {
    c = a + b + randInt(0, 10);
  }
  const sorted = [a, b, c].sort((x, y) => x - y);
  const valid = sorted[0] + sorted[1] > sorted[2];
  return {
    type: "qcm",
    chapter: "Automatismes — Existence d'un triangle",
    prompt: `Peut-on construire un triangle ABC tel que AB = ${a} cm, AC = ${b} cm et BC = ${c} cm ?`,
    answer: valid ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [`${sorted[0]} + ${sorted[1]} ${valid ? ">" : "≤"} ${sorted[2]}`],
  };
}

// ---------- 60 (substitut). Décrire un triangle ----------
function genDecrireTriangleAuto() {
  const type = pick(["isocele", "equilateral", "rectangle", "rectangleIsocele", "quelconque"]);
  let desc, nature;
  if (type === "isocele") {
    desc = `Le triangle DEF est tel que DE = DF.`;
    nature = "isocèle";
  } else if (type === "equilateral") {
    desc = `Le triangle IJK est tel que IJ = JK = KI.`;
    nature = "équilatéral";
  } else if (type === "rectangle") {
    desc = `Le triangle MNP a un angle droit en M.`;
    nature = "rectangle";
  } else if (type === "rectangleIsocele") {
    desc = `Le triangle RST a un angle droit en R, avec RS = RT.`;
    nature = "rectangle isocèle";
  } else {
    desc = `Le triangle UVW n'a ni côtés ni angles particuliers connus.`;
    nature = "quelconque";
  }
  return {
    type: "qcm",
    chapter: "Automatismes — Décrire un triangle",
    prompt: `${desc} Quelle est la nature de ce triangle ?`,
    answer: nature,
    options: ["isocèle", "équilatéral", "rectangle", "rectangle isocèle", "quelconque"],
    steps: [desc],
  };
}

// ---------- 61 (substitut). Encadrement du troisième côté ----------
function genTroisiemeCoteAuto() {
  const a = randInt(4, 15);
  const b = randInt(4, 15);
  const validC = a + b - 1 >= Math.abs(a - b) + 1 ? randInt(Math.abs(a - b) + 1, a + b - 1) : a;
  const invalidC = a + b + randInt(1, 5);
  const options = shuffle([`${validC} cm`, `${invalidC} cm`]);
  return {
    type: "qcm",
    chapter: "Automatismes — Existence d'un triangle",
    prompt: `AB = ${a} cm et AC = ${b} cm. Laquelle de ces longueurs peut être BC pour que le triangle ABC existe ?`,
    answer: `${validC} cm`,
    options,
    steps: [`Il faut que BC soit strictement compris entre ${Math.abs(a - b)} et ${a + b} cm.`],
  };
}

// ---------- 62 (substitut). Troisième angle d'un triangle ----------
function genTroisiemeAngleTriangleAutoCh7() {
  const a = randInt(20, 120);
  const b = randInt(20, 160 - a);
  const c = 180 - a - b;
  return {
    type: "numeric",
    chapter: "Automatismes — Angles d'un triangle",
    prompt: `Dans un triangle, deux angles mesurent ${a}° et ${b}°. Quelle est la mesure du troisième ?`,
    answer: c,
    steps: [`180 - (${a} + ${b}) = ${c}`],
  };
}

// ---------- 63 (substitut). Volume d'un empilement de cubes ----------
function genVolumeCubesAuto() {
  const L = randInt(2, 6);
  const l = randInt(2, 6);
  const h = randInt(2, 6);
  const answer = L * l * h;
  return {
    type: "numeric",
    chapter: "Automatismes — Représenter l'espace",
    prompt: `Un empilement rectangulaire de petits cubes identiques mesure ${L} cubes de long, ${l} cubes de large et ${h} cubes de haut. Combien de petits cubes contient cet empilement ?`,
    answer,
    steps: [`${L} \\times ${l} \\times ${h} = ${answer}`],
  };
}

// =========================== Chapitre 8 : Organisation et gestion de données ===========================

// ---------- 64. Calculer un pourcentage manquant dans un diagramme ----------
function genPourcentageManquantDiagrammeAuto() {
  const a = randInt(10, 45);
  const b = randInt(10, 90 - a);
  const c = 100 - a - b;
  return {
    type: "numeric",
    chapter: "Automatismes — Pourcentages dans un diagramme",
    prompt: `Un diagramme circulaire est partagé en 3 parts. La première fait ${a} % et la deuxième fait ${b} %. Quel pourcentage représente la troisième part ?`,
    answer: c,
    steps: [`100 - (${a} + ${b}) = ${c}`],
  };
}

// ---------- 65. Estimer un pourcentage dans un diagramme ----------
function genEstimerPourcentageDiagrammeAuto() {
  const cases = [
    { texte: "environ un quart", correct: 25, autres: [50, 75, 10] },
    { texte: "environ la moitié", correct: 50, autres: [25, 75, 20] },
    { texte: "environ les trois quarts", correct: 75, autres: [25, 50, 60] },
    { texte: "environ un dixième", correct: 10, autres: [25, 33, 50] },
    { texte: "environ un tiers", correct: 33, autres: [25, 50, 66] },
  ];
  const c = pick(cases);
  const options = shuffle([c.correct, ...c.autres]).map((v) => `${v} %`);
  return {
    type: "qcm",
    chapter: "Automatismes — Estimer un pourcentage",
    prompt: `Sur un diagramme circulaire, une part occupe ${c.texte} du disque. Quel pourcentage lui correspond le mieux ?`,
    answer: `${c.correct} %`,
    options,
    steps: [`"${c.texte}" correspond à environ ${c.correct} %.`],
  };
}

// ---------- 66. Passer d'une fraction à un pourcentage ----------
function genFractionVersPourcentageAuto() {
  const dens = [4, 5, 10, 20, 25, 50];
  const den = pick(dens);
  const num = randInt(1, den - 1);
  const pct = Math.round((num / den) * 100);
  return {
    type: "numeric",
    chapter: "Automatismes — Fraction vers pourcentage",
    prompt: `Écris \\(\\dfrac{${num}}{${den}}\\) sous forme de pourcentage (donne juste le nombre, sans le %).`,
    answer: pct,
    steps: [`\\(\\dfrac{${num}}{${den}} = \\dfrac{${num * (100 / den)}}{100} = ${pct}\\%\\)`],
  };
}

// ---------- 67. Passer d'une écriture décimale à un pourcentage ----------
function genDecimalVersPourcentageAuto() {
  const dec = randDecimal(0.05, 0.95, 2);
  const pct = roundTo(dec * 100, 0);
  return {
    type: "numeric",
    chapter: "Automatismes — Décimal vers pourcentage",
    prompt: `Écris ${fr(dec)} sous forme de pourcentage (donne juste le nombre, sans le %).`,
    answer: pct,
    steps: [`${fr(dec)} = ${fr(dec)} \\times 100\\% = ${pct}\\%`],
  };
}

// ---------- 68. Passer d'une fraction simple à un nombre décimal ----------
function genFractionVersDecimaleSimpleAuto() {
  const fracs = [
    [1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10],
  ];
  const [num, den] = pick(fracs);
  const dec = roundTo(num / den, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Fraction vers décimal",
    prompt: `Écris \\(\\dfrac{${num}}{${den}}\\) sous forme d'un nombre décimal.`,
    answer: dec,
    steps: [`\\(\\dfrac{${num}}{${den}} = ${fr(dec)}\\)`],
  };
}

// ---------- 69. Lire l'abscisse d'un point sur un axe gradué ----------
function buildAxeGradueFigure(nTicks, step, startValue, targetIndex) {
  const dx = 24;
  const points = [];
  const segments = [];
  const freeLabels = [];
  for (let i = 0; i < nTicks; i++) {
    const x = i * dx;
    const isTarget = i === targetIndex;
    points.push({ id: `b${i}`, x, y: 0, hideDot: true, hideLabel: true });
    points.push({ id: `t${i}`, x, y: -8, hideDot: !isTarget, hideLabel: true });
    segments.push({ from: `b${i}`, to: `t${i}` });
    if (isTarget) {
      freeLabels.push({ x, y: -16, text: "D" });
    }
    if (i === 0 || i === nTicks - 1) {
      freeLabels.push({ x, y: 16, text: String(startValue + i * step) });
    }
  }
  segments.push({ from: "b0", to: `b${nTicks - 1}` });
  return { points, segments, freeLabels };
}

function genLireAbscissePointAxeGradueAuto() {
  const step = pick([1, 2, 4, 5, 10]);
  const nTicks = 7;
  const startValue = randInt(1, 20) * step;
  const targetIndex = randInt(1, nTicks - 2);
  const answer = startValue + targetIndex * step;
  const figure = buildAxeGradueFigure(nTicks, step, startValue, targetIndex);
  return {
    type: "numeric",
    chapter: "Automatismes — Lire un axe gradué",
    prompt: `Les graduations sont régulières, espacées de ${step}. Quelle est l'abscisse du point D ?`,
    answer,
    figure,
    steps: [`De ${startValue} à D, il y a ${targetIndex} graduation(s) de ${step} : ${startValue} + ${targetIndex} \\times ${step} = ${answer}`],
  };
}

// ---------- 70. Comparer une fraction simple et un nombre décimal ----------
function genComparerFractionDecimalAuto() {
  const fracs = [
    [1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [7, 10],
  ];
  const [num, den] = pick(fracs);
  const fracVal = num / den;
  const dec = randDecimal(0.05, 0.95, 2);
  const correct = dec > fracVal ? ">" : dec < fracVal ? "<" : "=";
  return {
    type: "qcm",
    chapter: "Automatismes — Comparer fraction et décimal",
    prompt: `Complète par <, > ou = : \\(${fr(dec)}\\) ... \\(\\dfrac{${num}}{${den}}\\)`,
    answer: correct,
    options: ["<", ">", "="],
    steps: [`\\(\\dfrac{${num}}{${den}} = ${fr(roundTo(fracVal, 2))}\\)`],
  };
}

// ---------- 71. Compter les diviseurs d'un entier ----------
function genNombreDeDiviseursEntierAuto() {
  const n = pick([8, 10, 12, 14, 15, 16, 18, 20, 24, 28, 30, 36, 40]);
  let count = 0;
  for (let i = 1; i <= n; i++) if (n % i === 0) count++;
  return {
    type: "numeric",
    chapter: "Automatismes — Diviseurs d'un entier",
    prompt: `Combien le nombre ${n} a-t-il de diviseurs (en comptant 1 et ${n}) ?`,
    answer: count,
    steps: [`Diviseurs de ${n} : ${Array.from({ length: n }, (_, i) => i + 1).filter((i) => n % i === 0).join(", ")}.`],
  };
}

// ---------- 72. PGCD de deux entiers ----------
function pgcdAuto(a, b) {
  let x = a, y = b;
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x;
}
function genPGCDDeuxEntiersAuto() {
  const a = randInt(6, 40);
  const b = randInt(6, 40);
  const answer = pgcdAuto(a, b);
  return {
    type: "numeric",
    chapter: "Automatismes — Diviseurs communs",
    prompt: `Quel est le plus grand diviseur commun de ${a} et ${b} ?`,
    answer,
    steps: [`On cherche le plus grand nombre qui divise à la fois ${a} et ${b} : ${answer}.`],
  };
}

// ---------- 73. PPCM de deux entiers ----------
function genPPCMDeuxEntiersAuto() {
  const a = randInt(3, 12);
  const b = randInt(3, 12);
  const answer = (a * b) / pgcdAuto(a, b);
  return {
    type: "numeric",
    chapter: "Automatismes — Multiples communs",
    prompt: `Quel est le plus petit multiple commun (non nul) de ${a} et ${b} ?`,
    answer,
    steps: [`On cherche le plus petit nombre qui est à la fois multiple de ${a} et de ${b} : ${answer}.`],
  };
}

// =========================== Chapitre 9 : Proportionnalité ===========================

// ---------- 74. Calculer des doubles et des moitiés ----------
function genDoublesMoitiesAuto9() {
  const askDouble = Math.random() < 0.5;
  const isDecimal = Math.random() < 0.35;
  const n = isDecimal ? randDecimal(1, 20, 1) : randInt(2, 500);
  const answer = askDouble ? roundTo(n * 2, 2) : roundTo(n / 2, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Doubles et moitiés",
    prompt: `${askDouble ? "Le double" : "La moitié"} de ${fr(n)} est`,
    answer,
    steps: [`${fr(n)} ${askDouble ? "\\times 2" : "\\div 2"} = ${fr(answer)}`],
  };
}

// ---------- 75. Calculer des triples et des tiers ----------
function genTriplesTiersAuto() {
  const askTriple = Math.random() < 0.5;
  const n = askTriple ? randInt(2, 300) : nonZero(1, 100) * 3;
  const answer = askTriple ? n * 3 : n / 3;
  return {
    type: "numeric",
    chapter: "Automatismes — Triples et tiers",
    prompt: `${askTriple ? "Le triple" : "Le tiers"} de ${n} est`,
    answer,
    steps: [`${n} ${askTriple ? "\\times 3" : "\\div 3"} = ${fr(answer)}`],
  };
}

// ---------- 76. Calculer des quarts ----------
function genQuartAuto() {
  const n = randInt(2, 200);
  const answer = roundTo(n / 4, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Quarts",
    prompt: `Le quart de ${n} est`,
    answer,
    steps: [`${n} \\div 4 = ${fr(answer)}`],
  };
}

// ---------- 77. Calculer des dixièmes ----------
function genDixiemeAuto() {
  const isDecimal = Math.random() < 0.3;
  const n = isDecimal ? randDecimal(1, 50, 1) : randInt(2, 500);
  const answer = roundTo(n / 10, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — Dixièmes",
    prompt: `Le dixième de ${fr(n)} est`,
    answer,
    steps: [`${fr(n)} \\div 10 = ${fr(answer)}`],
  };
}

// ---------- 78. Trouver un rapport multiplicatif ----------
function genRapportMultiplicatifAuto() {
  const k = randInt(2, 6);
  const isDecimal = Math.random() < 0.3;
  const b = isDecimal ? randDecimal(1, 15, 1) : randInt(2, 50);
  const a = roundTo(b * k, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Rapports multiplicatifs",
    prompt: `${fr(a)} est combien de fois plus grand que ${fr(b)} ?`,
    answer: k,
    steps: [`${fr(a)} \\div ${fr(b)} = ${k}`],
  };
}

// ---------- 79. Connaître ses tables de multiplication (trouver un facteur) ----------
function genTableMultiplicationFacteurAuto() {
  const facteur = randInt(2, 10);
  const autre = randInt(2, 10);
  const produit = facteur * autre;
  const askFirst = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Tables de multiplication",
    prompt: askFirst ? `${produit} = ? \\times ${autre}` : `${produit} = ${facteur} \\times ?`,
    answer: askFirst ? facteur : autre,
    steps: [`${produit} \\div ${askFirst ? autre : facteur} = ${askFirst ? facteur : autre}`],
  };
}

// ---------- 80. Connaître ses tables de multiplication (combien de fois) ----------
function genTableCombienDeFoisAuto() {
  const facteur = randInt(2, 9);
  const fois = randInt(2, 10);
  const produit = facteur * fois;
  const askFois = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Tables de multiplication",
    prompt: askFois ? `Dans ${produit} il y a combien de fois ${facteur} ?` : `Dans ${produit} il y a ${fois} fois combien ?`,
    answer: askFois ? fois : facteur,
    steps: [`${produit} \\div ${askFois ? facteur : fois} = ${askFois ? fois : facteur}`],
  };
}

// ---------- 81. Diviser ----------
function genDiviserSimpleAuto() {
  const diviseur = randInt(2, 10);
  const quotient = randInt(2, 12);
  const dividende = diviseur * quotient;
  return {
    type: "numeric",
    chapter: "Automatismes — Diviser",
    prompt: `${dividende} \\div ${diviseur} =`,
    answer: quotient,
    steps: [`${dividende} \\div ${diviseur} = ${quotient}`],
  };
}

// ---------- 82. Calculer 50 % ----------
function genCinquantePourcentAuto() {
  const n = randInt(2, 900);
  const answer = roundTo(n / 2, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Calculer 50 %",
    prompt: `50 % de ${n} =`,
    answer,
    steps: [`50\\% \\text{ de } ${n} = ${n} \\div 2 = ${fr(answer)}`],
  };
}

// ---------- 83. Calculer 25 % ----------
function genVingtCinqPourcentAuto() {
  const n = randInt(2, 200);
  const answer = roundTo(n / 4, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Calculer 25 %",
    prompt: `25 % de ${n} =`,
    answer,
    steps: [`25\\% \\text{ de } ${n} = ${n} \\div 4 = ${fr(answer)}`],
  };
}

// ---------- 84. Calculer 10 % ----------
function genDixPourcentAuto() {
  const isDecimal = Math.random() < 0.3;
  const n = isDecimal ? randDecimal(1, 50, 1) : randInt(2, 500);
  const answer = roundTo(n / 10, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — Calculer 10 %",
    prompt: `10 % de ${fr(n)} =`,
    answer,
    steps: [`10\\% \\text{ de } ${fr(n)} = ${fr(n)} \\div 10 = ${fr(answer)}`],
  };
}

// ---------- 85. Multiplier par 25 ----------
function genMultiplierPar25Auto() {
  const n = randInt(2, 40);
  const answer = n * 25;
  return {
    type: "numeric",
    chapter: "Automatismes — Multiplier par 25",
    prompt: `${n} \\times 25 =`,
    answer,
    steps: [`${n} \\times 25 = ${n} \\times 100 \\div 4 = ${answer}`],
  };
}

// ---------------------------------------------------------------------------
// Regroupement par thème (chapitre du manuel) — permet à l'interface de
// proposer soit un entraînement ciblé sur un chapitre précis, soit un
// "Mélange" qui pioche dans tous les chapitres (voir
// src/components/AutomatismesRunner.jsx et `themes` dans l'export par
// défaut ci-dessous).
// ---------------------------------------------------------------------------
const CH1_NOMBRES_DECIMAUX = [
  genNumerationDecimale,
  genEcritureFractionDecimale,
  genCompleterA1,
  genCompleterA10,
  genMultiplierPar10,
  genDiviserPar10,
  genAdditionnerSoustraire,
  genOrdreDeGrandeur,
  genDoublesMoities,
  genSuitesDecimales,
  genArrondir,
  genEgaliteATrou,
];

const CH2_OPERATIONS_DECIMAUX = [
  genMultDiviserPar10_100_1000,
  genMultiplierPar0_1_001_0001,
  genMultiplierDeuxDecimauxAuto,
  genAjouterDeuxDecimaux,
  genSoustraireDeuxDecimaux,
  genDiviserDecimalParEntierAuto,
  genOrdreDeGrandeurProduitAuto,
  genMultiplierPar5ou50,
  genDoublesMoitiesAuto,
  genMultiplierEntierParPuissance,
  genMultiplierPar0_5,
  genDiviserPar4Et8,
];

const CH3_FRACTIONS = [
  genEcritureDecimaleFractionSimple,
  genMultiplicationATrouDecimale,
  genPrendreFractionDunNombre,
  genFractionsEgalesAuto,
  genDecomposerFractionAuto,
  genAppliquerPourcentageAuto,
  genMultipleDe2_3_5_10,
  genTablesMultiplicationAuto,
  genNombresEntiersFractionsAuto,
  genEncadrerFractionAuto,
  genEcritureDecimaleFractionAuto,
  genLexiqueOperationsAuto,
];

const CH4_GRANDEURS_MESURES = [
  genPerimetreDisqueOuPartieAuto,
  genPerimetreFigureComplexeAuto,
  genConvertirLongueurAuto,
  genConvertirAireNiveau1Auto,
  genConvertirAireNiveau2Auto,
  genLireHeureHorlogeAuto,
  genAdditionnerDeuxDureesAuto,
  genConvertirDureeNiveau1Auto,
  genConvertirDureeNiveau2Auto,
  genComparerDureesAuto,
  genConvertirDureeSexagesimaleVersDecimaleAuto,
  genConvertirDureeDecimaleVersSexagesimaleAuto,
];

const CH5_DISTANCES_SYMETRIES = [
  genSymetriqueReciproqueAuto,
  genPositionCercleDisqueAuto,
  genRayonDiametreAuto,
  genMilieuSegmentAdditiviteAuto,
  genMultiplierPar11_12_13,
  genDiviseursEntier,
  genProblemeDureeAuto,
  genComparerLongueursAuto,
  genConvertirContenancesAuto,
];

const CH6_ANGLES = [
  genEstimerAngleAuto,
  genTroisiemeAngleTriangleAuto,
  genTroisiemeAngleTriangleRectangleAuto,
  genMesurerAngleAuto,
  genCalculerExpressionAuto,
  genAngleSupplementaireAuto,
  genMoitiesAuto,
  genMultiplierGrandsNombresAuto,
  genTable60Auto,
  genDistributiviteAuto,
  genCalculsParenthesesAuto,
  genProportionHeureAuto,
];

const CH7_CONFIGURATIONS_GEOMETRIQUES = [
  genAngleTriangleParticulierAuto,
  genTriangleExisteAuto,
  genDecrireTriangleAuto,
  genTroisiemeCoteAuto,
  genTroisiemeAngleTriangleAutoCh7,
  genVolumeCubesAuto,
];

const CH8_ORGANISATION_DONNEES = [
  genPourcentageManquantDiagrammeAuto,
  genEstimerPourcentageDiagrammeAuto,
  genFractionVersPourcentageAuto,
  genDecimalVersPourcentageAuto,
  genFractionVersDecimaleSimpleAuto,
  genLireAbscissePointAxeGradueAuto,
  genComparerFractionDecimalAuto,
  genNombreDeDiviseursEntierAuto,
  genPGCDDeuxEntiersAuto,
  genPPCMDeuxEntiersAuto,
];

const CH9_PROPORTIONNALITE = [
  genDoublesMoitiesAuto9,
  genTriplesTiersAuto,
  genQuartAuto,
  genDixiemeAuto,
  genRapportMultiplicatifAuto,
  genTableMultiplicationFacteurAuto,
  genTableCombienDeFoisAuto,
  genDiviserSimpleAuto,
  genCinquantePourcentAuto,
  genVingtCinqPourcentAuto,
  genDixPourcentAuto,
  genMultiplierPar25Auto,
];

const THEMES = [
  { id: "nombres-decimaux", title: "Nombres décimaux", generators: CH1_NOMBRES_DECIMAUX },
  { id: "operations-decimaux", title: "Opérations sur les décimaux", generators: CH2_OPERATIONS_DECIMAUX },
  { id: "fractions", title: "Fractions", generators: CH3_FRACTIONS },
  { id: "grandeurs-mesures", title: "Grandeurs et mesures", generators: CH4_GRANDEURS_MESURES },
  { id: "distances-symetries", title: "Distances et symétries", generators: CH5_DISTANCES_SYMETRIES },
  { id: "angles", title: "Angles", generators: CH6_ANGLES },
  { id: "configurations-geometriques", title: "Configurations géométriques", generators: CH7_CONFIGURATIONS_GEOMETRIQUES },
  { id: "organisation-gestion-donnees", title: "Organisation et gestion de données", generators: CH8_ORGANISATION_DONNEES },
  { id: "proportionnalite", title: "Proportionnalité", generators: CH9_PROPORTIONNALITE },
];

const GENERATORS = THEMES.flatMap((t) => t.generators);

// themeId optionnel : un id de THEMES pour piocher uniquement dans ce
// thème, ou absent/"mix" pour piocher dans l'ensemble des chapitres (voir
// AutomatismesRunner.jsx, qui est le seul composant à passer un themeId —
// generate() reste appelable sans argument pour rester compatible avec tout
// code générique qui appellerait chapter.generate() sans le savoir, ex. un
// défi entre amis sur ce chapitre).
function generate(themeId) {
  if (themeId && themeId !== "mix") {
    const theme = THEMES.find((t) => t.id === themeId);
    if (theme) return pick(theme.generators)();
  }
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "automatismes-sixieme",
    title: "Automatismes",
    description: "Calcul rapide et automatismes du programme de 6e, chapitre après chapitre.",
    level: "sixieme",
    freemiumDaily: 5,
    order: 1,
    isAutomatismes: true,
  },
  themes: THEMES.map(({ id, title }) => ({ id, title })),
  generate,
};
