// ---------------------------------------------------------------------------
// Chapitre : Multiplication et division de nombres rationnels (4e) — sous abonnement.
//
// Correspond au chapitre 3 du sommaire officiel : multiplier des fractions
// (signées), fraction d'un nombre, inverse et opposé d'un nombre, diviser par
// une fraction, priorités opératoires avec plusieurs opérations, programmes
// de calcul, problèmes de proportions et d'aires. Reprend la tâche
// intellectuelle des exercices fournis, avec des nombres, prénoms et
// contextes différents à chaque génération. Voir automatismes-quatrieme.js
// pour le thème "Calcul mental" associé.
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

// =========================== Multiplier des fractions ===========================

// ---------- 1. Multiplier deux fractions signées ----------
function genMultiplierDeuxFractionsSigneesNumeric() {
  const a = nonZero(-12, 12);
  const b = randInt(2, 12);
  const c = nonZero(-12, 12);
  const d = randInt(2, 12);
  const answer = a * c;
  return {
    type: "numeric",
    chapter: "Multiplication, division de rationnels — Multiplier",
    prompt: `\\(\\dfrac{${a}}{${b}} \\times \\dfrac{${c}}{${d}} = \\dfrac{?}{${b * d}}\\) — quel est ce numérateur ?`,
    answer,
    steps: [
      { type: "regle", text: `Pour multiplier deux fractions, on multiplie les numérateurs entre eux, et les dénominateurs entre eux.` },
      { type: "resultat", text: `${a} \\times ${c} = ${answer}` },
      { type: "calcul", text: `${b} \\times ${d} = ${b * d}` },
    ],
  };
}

// ---------- 2. Chaîne de trois multiplications signées ----------
function genChaineMultiplicationsSigneesNumeric() {
  const a = nonZero(-9, 9);
  const b = randInt(2, 9);
  const c = nonZero(-9, 9);
  const d = randInt(2, 9);
  const e = nonZero(-9, 9);
  const f = randInt(2, 9);
  const answerNum = a * c * e;
  const answerDen = b * d * f;
  return {
    type: "numeric",
    chapter: "Multiplication, division de rationnels — Multiplier",
    prompt: `\\(\\dfrac{${a}}{${b}} \\times \\dfrac{${c}}{${d}} \\times \\dfrac{${e}}{${f}} = \\dfrac{?}{${answerDen}}\\) — quel est ce numérateur ?`,
    answer: answerNum,
    steps: [
      { type: "regle", text: `Pour multiplier plusieurs fractions, on multiplie tous les numérateurs entre eux, et tous les dénominateurs entre eux.` },
      { type: "resultat", text: `${a} \\times ${c} \\times ${e} = ${answerNum}` },
      { type: "calcul", text: `${b} \\times ${d} \\times ${f} = ${answerDen}` },
    ],
  };
}

// ---------- 3. Calculer une fraction d'un nombre ----------
function genFractionDUnNombreNumeric() {
  const den = randInt(2, 9);
  const num = randInt(1, 3 * den);
  const nombre = randInt(5, 200);
  const answer = roundTo((num / den) * nombre, 2);
  return {
    type: "numeric",
    chapter: "Multiplication, division de rationnels — Multiplier",
    prompt: `Calcule les \\(\\dfrac{${num}}{${den}}\\) de ${nombre}.`,
    answer,
    tolerance: 0.05,
    steps: [
      { type: "regle", text: `Calculer une fraction d'un nombre revient à multiplier ce nombre par la fraction.` },
      { type: "calcul", text: `\\dfrac{${num}}{${den}} \\times ${nombre} = ${fr(answer)}` },
    ],
  };
}

// ---------- 4. Traduire une phrase par une expression mathématique ----------
function genTraduireExpressionQCM() {
  let num, den;
  do {
    num = randInt(1, 9);
    den = randInt(2, 9);
  } while (num === den);
  const nombre = randInt(10, 100);
  const correct = `\\dfrac{${num}}{${den}} \\times ${nombre}`;
  const wrong1 = `\\dfrac{${den}}{${num}} \\times ${nombre}`;
  const wrong2 = `\\dfrac{${num}}{${den}} + ${nombre}`;
  const wrong3 = `${nombre} \\div \\dfrac{${num}}{${den}}`;
  const options = shuffle([correct, wrong1, wrong2, wrong3]);
  return {
    type: "qcm",
    chapter: "Multiplication, division de rationnels — Multiplier",
    prompt: `Quelle expression mathématique traduit correctement la phrase suivante : "Calculer les \\(\\dfrac{${num}}{${den}}\\) de ${nombre}" ?`,
    answer: correct,
    options,
    steps: [{ type: "regle", text: `Calculer une fraction d'un nombre revient à multiplier ce nombre par la fraction : \\dfrac{${num}}{${den}} \\times ${nombre}.` }],
  };
}

// =========================== Diviser par une fraction ===========================

// ---------- 5. Inverse d'une fraction ----------
function genInverseDUneFractionQCM() {
  let a, b;
  do {
    a = nonZero(-9, 9);
    b = randInt(2, 9);
  } while (a === b);
  const correct = `\\dfrac{${b}}{${a}}`;
  const opts = new Set([correct]);
  opts.add(`\\dfrac{${-b}}{${a}}`);
  opts.add(`\\dfrac{${a}}{${b}}`);
  opts.add(`\\dfrac{${-a}}{${b}}`);
  const options = shuffle([...opts]).slice(0, 4);
  if (!options.includes(correct)) options[0] = correct;
  return {
    type: "qcm",
    chapter: "Multiplication, division de rationnels — Diviser",
    prompt: `Quel est l'inverse de \\(\\dfrac{${a}}{${b}}\\) ?`,
    answer: correct,
    options: shuffle(options),
    steps: [{ type: "regle", text: `L'inverse de \\dfrac{${a}}{${b}} est \\dfrac{${b}}{${a}} car \\dfrac{${a}}{${b}} \\times \\dfrac{${b}}{${a}} = 1.` }],
  };
}

// ---------- 6. Distinguer opposé et inverse ----------
function genDistinguerOpposeInverseQCM() {
  const a = nonZero(-9, 9);
  const b = randInt(2, 9);
  const oppose = `\\dfrac{${-a}}{${b}}`;
  const inverse = `\\dfrac{${b}}{${a}}`;
  const askOppose = Math.random() < 0.5;
  const correct = askOppose ? oppose : inverse;
  const options = shuffle([oppose, inverse]);
  return {
    type: "qcm",
    chapter: "Multiplication, division de rationnels — Diviser",
    prompt: `Quel est ${askOppose ? "l'opposé" : "l'inverse"} de \\(\\dfrac{${a}}{${b}}\\) ?`,
    answer: correct,
    options,
    steps: [
      {
        type: "regle",
        text: askOppose
          ? `L'opposé change le signe : \\dfrac{${a}}{${b}} \\to ${oppose}.`
          : `L'inverse échange le numérateur et le dénominateur : \\dfrac{${a}}{${b}} \\to ${inverse}.`,
      },
    ],
  };
}

// ---------- 7. Inverse de l'opposé d'un nombre ----------
function genInverseOpposeDoubleQCM() {
  const a = nonZero(-9, 9);
  const b = randInt(2, 9);
  const correct = `\\dfrac{${-b}}{${a}}`;
  const wrong1 = `\\dfrac{${b}}{${a}}`;
  const wrong2 = `\\dfrac{${-a}}{${b}}`;
  const wrong3 = `\\dfrac{${a}}{${b}}`;
  const options = shuffle([...new Set([correct, wrong1, wrong2, wrong3])]);
  return {
    type: "qcm",
    chapter: "Multiplication, division de rationnels — Diviser",
    prompt: `Quel est l'inverse de l'opposé de \\(\\dfrac{${a}}{${b}}\\) ?`,
    answer: correct,
    options: options.length >= 2 ? options : [correct, wrong1],
    steps: [
      { type: "calcul", text: `L'opposé de \\dfrac{${a}}{${b}} est \\dfrac{${-a}}{${b}}.` },
      { type: "resultat", text: `L'inverse de \\dfrac{${-a}}{${b}} est \\dfrac{${b}}{${-a}} = \\dfrac{${-b}}{${a}}.` },
    ],
  };
}

// ---------- 8. Diviser deux fractions signées ----------
function genDiviserParUneFractionNumeric() {
  const a = nonZero(-12, 12);
  const b = randInt(2, 12);
  const c = nonZero(-12, 12);
  const d = randInt(2, 12);
  const answer = a * d;
  return {
    type: "numeric",
    chapter: "Multiplication, division de rationnels — Diviser",
    prompt: `\\(\\dfrac{${a}}{${b}} \\div \\dfrac{${c}}{${d}} = \\dfrac{?}{${b * c}}\\) — quel est ce numérateur ?`,
    answer,
    steps: [
      { type: "regle", text: `Diviser par \\dfrac{${c}}{${d}}, c'est multiplier par son inverse \\dfrac{${d}}{${c}}.` },
      { type: "resultat", text: `${a} \\times ${d} = ${answer}` },
      { type: "calcul", text: `${b} \\times ${c} = ${b * c}` },
    ],
  };
}

// ---------- 9. Diviser un nombre décimal par une fraction (contexte) ----------
function genDiviserNombreDecimalParFractionNumeric() {
  const den = randInt(2, 8);
  const num = randInt(1, den - 1);
  const nbUnitsWanted = randInt(4, 15);
  const totalDecimal = roundTo((num / den) * nbUnitsWanted, 2);
  return {
    type: "numeric",
    chapter: "Multiplication, division de rationnels — Diviser",
    prompt: `Pour un anniversaire, on a préparé ${fr(totalDecimal)} kg de mousse au chocolat. Chaque ramequin peut contenir \\(\\dfrac{${num}}{${den}}\\) kg de mousse. Combien de ramequins peut-on remplir ?`,
    answer: nbUnitsWanted,
    steps: [{ type: "calcul", text: `${fr(totalDecimal)} \\div \\dfrac{${num}}{${den}} = ${fr(totalDecimal)} \\times \\dfrac{${den}}{${num}} = ${nbUnitsWanted}` }],
  };
}

// =========================== Priorités opératoires et programmes de calcul ===========================

// ---------- 10. Calculer une expression avec priorités (multiplication + addition de fractions) ----------
function genPrioriteOperatoireFractionsNumeric() {
  const a = nonZero(-9, 9);
  const b = randInt(2, 9);
  const c = nonZero(-9, 9);
  const d = randInt(2, 9);
  const e = nonZero(-9, 9);
  const f = randInt(2, 9);
  const produit = roundTo((c / d) * (e / f), 4);
  const answer = roundTo(a / b + produit, 4);
  return {
    type: "numeric",
    chapter: "Multiplication, division de rationnels — Priorités",
    prompt: `Calcule, en respectant les priorités opératoires : \\(\\dfrac{${a}}{${b}} + \\dfrac{${c}}{${d}} \\times \\dfrac{${e}}{${f}}\\) (résultat en écriture décimale, arrondi au centième).`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "calcul", text: `\\dfrac{${c}}{${d}} \\times \\dfrac{${e}}{${f}} \\approx ${fr(produit)}` },
      { type: "resultat", text: `\\dfrac{${a}}{${b}} + ${fr(produit)} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 11. Programme de calcul avec une étape "inverse" ----------
function genProgrammeCalculAvecInverseNumeric() {
  let denStart, numStart, p, sumNum;
  do {
    denStart = randInt(2, 9);
    numStart = nonZero(-(3 * denStart), 3 * denStart);
    p = randInt(1, 6);
    sumNum = numStart + p * denStart;
  } while (sumNum === 0);
  const answer = roundTo(denStart / sumNum, 4);
  return {
    type: "numeric",
    chapter: "Multiplication, division de rationnels — Priorités",
    prompt: `Un programme de calcul consiste à : prendre un nombre, lui ajouter ${p}, puis prendre l'inverse du résultat. Quel résultat obtient-on si on choisit initialement \\(\\dfrac{${numStart}}{${denStart}}\\) ? (Écriture décimale, arrondie au centième si nécessaire.)`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "calcul", text: `\\dfrac{${numStart}}{${denStart}} + ${p} = \\dfrac{${sumNum}}{${denStart}}` },
      { type: "resultat", text: `\\text{Inverse} = \\dfrac{${denStart}}{${sumNum}} \\approx ${fr(answer)}` },
    ],
  };
}

// =========================== Problèmes ===========================

// ---------- 12. Pourcentage d'un effectif ----------
function genPourcentageEffectifNumeric() {
  const pourcentage = randInt(10, 90);
  const effectif = randInt(20, 400);
  const answer = Math.round((pourcentage / 100) * effectif);
  return {
    type: "numeric",
    chapter: "Multiplication, division de rationnels — Problèmes",
    prompt: `Dans un collège de ${effectif} élèves, ${pourcentage} % ont obtenu une mention. Combien d'élèves ont obtenu une mention (arrondi à l'unité) ?`,
    answer,
    tolerance: 0.5,
    steps: [
      { type: "regle", text: `Calculer ${pourcentage} % d'un effectif, c'est le multiplier par \\(\\dfrac{${pourcentage}}{100}\\).` },
      { type: "calcul", text: `${pourcentage}/100 \\times ${effectif} \\approx ${answer}` },
    ],
  };
}

// ---------- 13. Comparer deux pourcentages en contexte ----------
function genComparerDeuxPourcentagesQCM() {
  const p1 = randInt(40, 90);
  const n1 = randInt(50, 300);
  const p2 = randInt(40, 90);
  const n2 = randInt(50, 300);
  const c1 = Math.round((p1 / 100) * n1);
  const c2 = Math.round((p2 / 100) * n2);
  const winner = c1 > c2 ? "Collège A" : c2 > c1 ? "Collège B" : "Égalité";
  return {
    type: "qcm",
    chapter: "Multiplication, division de rationnels — Problèmes",
    prompt: `Dans le collège A, ${p1} % des ${n1} élèves de troisième ont obtenu une mention. Dans le collège B, ${p2} % des ${n2} élèves de troisième ont obtenu une mention. Quel collège compte le plus de lauréats avec mention ?`,
    answer: winner,
    options: ["Collège A", "Collège B", "Égalité"],
    steps: [
      { type: "regle", text: `On calcule le nombre d'élèves lauréats dans chaque collège en multipliant l'effectif par le pourcentage, puis on compare les deux nombres obtenus.` },
      { type: "calcul", text: `Collège A : ${p1}/100 \\times ${n1} \\approx ${c1}` },
      { type: "calcul", text: `Collège B : ${p2}/100 \\times ${n2} \\approx ${c2}` },
    ],
  };
}

// ---------- 14. Proportion en deux étapes (contexte : partage d'un lot) ----------
function genProportionDeuxEtapesNumeric() {
  const totalDen = pick([5, 8, 10, 12]);
  const numA = randInt(1, totalDen - 1);
  const k = randInt(2, 10);
  const totalCount = totalDen * 2 * k;
  const countA = numA * 2 * k;
  const remaining = totalCount - countA;
  const countB = remaining / 2;
  const [categorieA, categorieB] = pick([
    ["chocolat noir", "chocolat blanc"],
    ["billes bleues", "billes rouges"],
    ["bonbons acidulés", "bonbons au caramel"],
  ]);
  return {
    type: "numeric",
    chapter: "Multiplication, division de rationnels — Problèmes",
    prompt: `Une boîte contient ${totalCount} friandises. \\(\\dfrac{${numA}}{${totalDen}}\\) sont de type « ${categorieA} », et la moitié du reste est de type « ${categorieB} ». Combien y a-t-il de friandises « ${categorieB} » dans la boîte ?`,
    answer: countB,
    steps: [
      { type: "calcul", text: `\\dfrac{${numA}}{${totalDen}} \\times ${totalCount} = ${countA}` },
      { type: "calcul", text: `${totalCount} - ${countA} = ${remaining}\\ \\text{friandises restantes}` },
      { type: "resultat", text: `${remaining} \\div 2 = ${countB}` },
    ],
  };
}

// ---------- 15. Aire d'un rectangle aux côtés fractionnaires ----------
function genAireRectangleFractionsNumeric() {
  const numL = randInt(1, 12);
  const denL = randInt(2, 9);
  const numW = randInt(1, 12);
  const denW = randInt(2, 9);
  const answer = roundTo((numL / denL) * (numW / denW), 4);
  return {
    type: "numeric",
    chapter: "Multiplication, division de rationnels — Problèmes",
    prompt: `Un rectangle a pour longueur \\(\\dfrac{${numL}}{${denL}}\\) cm et pour largeur \\(\\dfrac{${numW}}{${denW}}\\) cm. Calcule son aire, en cm² (écriture décimale, arrondie au centième).`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `Aire d'un rectangle = longueur × largeur.` },
      { type: "calcul", text: `\\dfrac{${numL}}{${denL}} \\times \\dfrac{${numW}}{${denW}} = \\dfrac{${numL * numW}}{${denL * denW}} \\approx ${fr(answer)}` },
    ],
  };
}

const GENERATORS = [
  genMultiplierDeuxFractionsSigneesNumeric,
  genChaineMultiplicationsSigneesNumeric,
  genFractionDUnNombreNumeric,
  genTraduireExpressionQCM,
  genInverseDUneFractionQCM,
  genDistinguerOpposeInverseQCM,
  genInverseOpposeDoubleQCM,
  genDiviserParUneFractionNumeric,
  genDiviserNombreDecimalParFractionNumeric,
  genPrioriteOperatoireFractionsNumeric,
  genProgrammeCalculAvecInverseNumeric,
  genPourcentageEffectifNumeric,
  genComparerDeuxPourcentagesQCM,
  genProportionDeuxEtapesNumeric,
  genAireRectangleFractionsNumeric,
];

const DIFFICULTY = {
  genMultiplierDeuxFractionsSigneesNumeric: "facile",
  genFractionDUnNombreNumeric: "facile",
  genInverseDUneFractionQCM: "facile",
  genDiviserParUneFractionNumeric: "facile",
  genPourcentageEffectifNumeric: "facile",
  genChaineMultiplicationsSigneesNumeric: "standard",
  genTraduireExpressionQCM: "standard",
  genDistinguerOpposeInverseQCM: "standard",
  genInverseOpposeDoubleQCM: "standard",
  genDiviserNombreDecimalParFractionNumeric: "standard",
  genPrioriteOperatoireFractionsNumeric: "standard",
  genProgrammeCalculAvecInverseNumeric: "standard",
  genComparerDeuxPourcentagesQCM: "standard",
  genProportionDeuxEtapesNumeric: "expert",
  genAireRectangleFractionsNumeric: "expert",
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
    id: "multiplication-division-rationnels",
    title: "Multiplication et division de nombres rationnels",
    description: "Multiplier et diviser des nombres rationnels, fraction d'un nombre, inverse et opposé, priorités opératoires, programmes de calcul, problèmes de proportions et d'aires.",
    pourquoi: "Multiplier et diviser des nombres relatifs, c'est un prérequis incontournable pour tout calcul algébrique plus avancé.",
    level: "quatrieme",
    free: false,
    order: 4,
  },
  generate,
};
