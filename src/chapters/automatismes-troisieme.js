// ---------------------------------------------------------------------------
// Chapitre : Automatismes (3e) — gratuit, freemium (5 questions/jour sans
// abonnement, illimité avec abonnement). Regroupe les mini-exercices de
// calcul rapide ("Calcul mental") en tête de chaque chapitre du manuel de 3e,
// un thème par chapitre du sommaire (voir THEMES ci-dessous) ; sera enrichi
// au fur et à mesure que les autres chapitres 3e seront écrits — voir
// automatismes-quatrieme.js pour le même principe en 4e.
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
const toRad = (deg) => (deg * Math.PI) / 180;
const toDeg = (rad) => (rad * 180) / Math.PI;

function isPrime(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function coprimePair(min, max) {
  let a0, b0;
  do {
    a0 = randInt(min, max);
    b0 = randInt(min, max);
  } while (gcd(a0, b0) !== 1 || a0 === b0);
  return [a0, b0];
}

// Réduit une fraction num/den sous forme irréductible, dénominateur positif.
function reduceFrac(num, den) {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den) || 1;
  return [num / g, den / g];
}

// =========================== Chapitre 1 : Nombres entiers ===========================
// (Mini-exercices "Calcul mental" en tête de page : division euclidienne
// rapide, critère de divisibilité, reconnaître un nombre premier, PGCD de
// petits nombres.)

// ---------- 1. Division euclidienne rapide (mental) ----------
function genAutoDivisionEuclidienneMental() {
  const diviseur = randInt(3, 12);
  const quotient = randInt(2, 15);
  const reste = randInt(0, diviseur - 1);
  const dividende = diviseur * quotient + reste;
  const askQuotient = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Nombres entiers",
    prompt: `Dans la division euclidienne de ${dividende} par ${diviseur}, quel est le ${askQuotient ? "quotient" : "reste"} ?`,
    answer: askQuotient ? quotient : reste,
    steps: [{ type: "calcul", text: `${dividende} = ${diviseur} \\times ${quotient} + ${reste}` }],
  };
}

// ---------- 2. Critère de divisibilité (mental) ----------
const criteresTextMental = {
  2: "pair",
  3: "somme des chiffres multiple de 3",
  5: "chiffre des unités 0 ou 5",
  9: "somme des chiffres multiple de 9",
  10: "chiffre des unités 0",
};
function genAutoCritereDivisibiliteMental() {
  const d = pick([2, 3, 5, 9, 10]);
  const divisible = Math.random() < 0.5;
  const k = randInt(8, 40);
  const r = divisible ? 0 : randInt(1, d - 1);
  const n = d * k + r;
  return {
    type: "qcm",
    chapter: "Automatismes — Nombres entiers",
    prompt: `${n} est-il divisible par ${d} ?`,
    answer: divisible ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: `Critère : ${criteresTextMental[d]}.` }],
  };
}

// ---------- 3. Reconnaître un nombre premier (mental) ----------
function genAutoEstPremierMental() {
  const n = randInt(2, 50);
  return {
    type: "qcm",
    chapter: "Automatismes — Nombres entiers",
    prompt: `${n} est-il un nombre premier ?`,
    answer: isPrime(n) ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      {
        type: "regle",
        text: isPrime(n) ? `${n} n'a que deux diviseurs : 1 et lui-même.` : `${n} a au moins un diviseur autre que 1 et lui-même.`,
      },
    ],
  };
}

// ---------- 4. PGCD de deux petits nombres (mental) ----------
function genAutoPGCDMental() {
  const [a0, b0] = coprimePair(2, 6);
  const g = randInt(2, 6);
  const a = a0 * g;
  const b = b0 * g;
  return {
    type: "numeric",
    chapter: "Automatismes — Nombres entiers",
    prompt: `Quel est le PGCD de ${a} et ${b} ?`,
    answer: g,
    steps: [
      { type: "calcul", text: `${a} = ${g} \\times ${a0}` },
      { type: "calcul", text: `${b} = ${g} \\times ${b0}` },
    ],
  };
}

// ---------- 5. Multiple ou diviseur ? (mental) ----------
function genAutoMultipleOuDiviseurQCM() {
  const a = randInt(2, 12);
  const k = randInt(2, 10);
  const b = a * k;
  const aEstMultiple = Math.random() < 0.5;
  const gauche = aEstMultiple ? b : a;
  const droite = aEstMultiple ? a : b;
  return {
    type: "qcm",
    chapter: "Automatismes — Nombres entiers",
    prompt: `${gauche} est-il un multiple de ${droite}, ou un diviseur de ${droite} ?`,
    answer: aEstMultiple ? "Multiple" : "Diviseur",
    options: ["Multiple", "Diviseur"],
    steps: [{ type: "regle", text: `${b} = ${a} \\times ${k}, donc ${b} est un multiple de ${a}, et ${a} est un diviseur de ${b}.` }],
  };
}

const CH_NOMBRES_ENTIERS_T = [
  genAutoDivisionEuclidienneMental,
  genAutoCritereDivisibiliteMental,
  genAutoEstPremierMental,
  genAutoPGCDMental,
  genAutoMultipleOuDiviseurQCM,
];

// =========================== Chapitre 2 : Calcul numérique ===========================
// (Mini-exercices "Calcul mental" en tête de page : opérations simples sur
// des fractions, calculer une puissance, règle du produit de puissances de
// même base.)

// ---------- 1. Additionner deux fractions de même dénominateur (mental) ----------
function genAutoAdditionFractionsMemeDenominateurMental() {
  const den = randInt(3, 10);
  const numA = nonZero(-8, 8);
  const numB = nonZero(-8, 8);
  const [rn, rd] = reduceFrac(numA + numB, den);
  const askNum = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul numérique",
    prompt: `Calcule (fraction irréductible, dénominateur positif) : \\(\\dfrac{${numA}}{${den}} + \\dfrac{${numB}}{${den}}\\). Donne son ${askNum ? "numérateur" : "dénominateur"}.`,
    answer: askNum ? rn : rd,
    steps: [{ type: "calcul", text: `\\dfrac{${numA}}{${den}} + \\dfrac{${numB}}{${den}} = \\dfrac{${numA + numB}}{${den}} = \\dfrac{${rn}}{${rd}}` }],
  };
}

// ---------- 2. Multiplier deux fractions simples (mental) ----------
function genAutoMultiplierFractionsMental() {
  const n1 = nonZero(-6, 6);
  const d1 = randInt(2, 6);
  const n2 = nonZero(-6, 6);
  const d2 = randInt(2, 6);
  const [rn, rd] = reduceFrac(n1 * n2, d1 * d2);
  const askNum = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul numérique",
    prompt: `Calcule (fraction irréductible, dénominateur positif) : \\(\\dfrac{${n1}}{${d1}} \\times \\dfrac{${n2}}{${d2}}\\). Donne son ${askNum ? "numérateur" : "dénominateur"}.`,
    answer: askNum ? rn : rd,
    steps: [{ type: "calcul", text: `\\dfrac{${n1}}{${d1}} \\times \\dfrac{${n2}}{${d2}} = \\dfrac{${n1 * n2}}{${d1 * d2}} = \\dfrac{${rn}}{${rd}}` }],
  };
}

// ---------- 3. Calculer une puissance simple (mental) ----------
function genAutoCalculerPuissanceMental() {
  const base = nonZero(-6, 6);
  const exp = randInt(2, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul numérique",
    prompt: `Calcule : \\((${base})^{${exp}}\\)`,
    answer: base ** exp,
    steps: [{ type: "calcul", text: `${Array.from({ length: exp }, () => `(${base})`).join(" \\times ")} = ${base ** exp}` }],
  };
}

// ---------- 4. Produit de puissances de même base (mental) ----------
function genAutoProduitPuissancesMemeBaseMental() {
  const base = randInt(2, 10);
  const m = randInt(1, 5);
  const n = randInt(1, 5);
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul numérique",
    prompt: `Écris \\(${base}^{${m}} \\times ${base}^{${n}}\\) sous la forme \\(${base}^{k}\\). Quelle est la valeur de k ?`,
    answer: m + n,
    steps: [{ type: "calcul", text: `${base}^{${m}} \\times ${base}^{${n}} = ${base}^{${m + n}}` }],
  };
}

// ---------- 5. Carré parfait (mental) ----------
function genAutoCarreParfaitMental() {
  const r = randInt(2, 15);
  const isCarre = Math.random() < 0.5;
  const n = isCarre ? r * r : r * r + randInt(1, r);
  const carre = Number.isInteger(Math.sqrt(n));
  return {
    type: "qcm",
    chapter: "Automatismes — Calcul numérique",
    prompt: `${n} est-il un carré parfait ?`,
    answer: carre ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: carre ? `${n} = ${Math.round(Math.sqrt(n))}^2.` : `Aucun entier n'a ${n} pour carré.` }],
  };
}

const CH_CALCUL_NUMERIQUE_T = [
  genAutoAdditionFractionsMemeDenominateurMental,
  genAutoMultiplierFractionsMental,
  genAutoCalculerPuissanceMental,
  genAutoProduitPuissancesMemeBaseMental,
  genAutoCarreParfaitMental,
];

// =========================== Chapitre 3 : Calcul littéral ===========================
// (Mini-exercices "Calcul mental" en tête de page : développer une simple
// distributivité, gérer un signe devant une parenthèse, réduire une
// expression courte, mettre un facteur commun en évidence, évaluer une
// expression littérale pour une valeur donnée.)

// ---------- 1. Développer une simple distributivité (mental) ----------
function genAutoDevelopperSimpleMental() {
  const k = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const askCoefX = Math.random() < 0.5;
  const coefX = k;
  const constant = k * b;
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul littéral",
    prompt: `On développe \\(${k}\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right)\\). Quel est ${askCoefX ? "le coefficient de x" : "le terme constant"} ?`,
    answer: askCoefX ? coefX : constant,
    steps: [{ type: "calcul", text: `${k}\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right) = ${k}x ${constant >= 0 ? "+" : "-"} ${Math.abs(constant)}` }],
  };
}

// ---------- 2. Signe devant une parenthèse (mental) ----------
function genAutoSigneDevantParentheseMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const isNeg = Math.random() < 0.5;
  const coefX = isNeg ? -a : a;
  const constant = isNeg ? -b : b;
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul littéral",
    prompt: `On développe \\(${isNeg ? "-" : "+"}\\left(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right)\\). Quel est le terme constant ?`,
    answer: constant,
    steps: [
      {
        type: "calcul",
        text: `${isNeg ? "-" : "+"}\\left(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right) = ${coefX}x ${constant >= 0 ? "+" : "-"} ${Math.abs(constant)}`,
      },
    ],
  };
}

// ---------- 3. Réduire une expression courte (mental) ----------
function genAutoReduireExpressionMental() {
  const a = nonZero(-9, 9);
  const c = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const coefX = a + c;
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul littéral",
    prompt: `On réduit \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} ${c >= 0 ? "+" : "-"} ${Math.abs(c)}x\\). Quel est le coefficient de x dans la forme réduite ?`,
    answer: coefX,
    steps: [{ type: "calcul", text: `${a} + ${c} = ${coefX}` }],
  };
}

// ---------- 4. Mettre un facteur commun numérique en évidence (mental) ----------
function genAutoFactoriserFacteurCommunMental() {
  const k = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul littéral",
    prompt: `On factorise \\(${k}x ${k * b >= 0 ? "+" : "-"} ${Math.abs(k * b)} = ?\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right)\\). Quel est ce facteur commun ?`,
    answer: k,
    steps: [
      {
        type: "calcul",
        text: `${k}x ${k * b >= 0 ? "+" : "-"} ${Math.abs(k * b)} = ${k}\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right)`,
      },
    ],
  };
}

// ---------- 5. Évaluer une expression littérale (mental) ----------
function genAutoEvaluerExpressionMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const x = nonZero(-6, 6);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul littéral",
    prompt: `Évalue \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\) pour \\(x = ${x}\\).`,
    answer,
    steps: [{ type: "calcul", text: `${a} \\times ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}` }],
  };
}

const CH_CALCUL_LITTERAL_T = [
  genAutoDevelopperSimpleMental,
  genAutoSigneDevantParentheseMental,
  genAutoReduireExpressionMental,
  genAutoFactoriserFacteurCommunMental,
  genAutoEvaluerExpressionMental,
];

// =========================== Chapitre 4 : Équations ===========================
// (Mini-exercices "Calcul mental" en tête de page : résoudre une équation
// très simple ax=b ou ax+b=c, résoudre une équation produit à coefficient 1,
// déterminer le nombre de solutions de x²=a.)

// ---------- 1. Résoudre ax = b (mental) ----------
function genAutoResoudreAxMental() {
  const a = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const b = a * x0;
  return {
    type: "numeric",
    chapter: "Automatismes — Équations",
    prompt: `Résous : \\(${a}x = ${b}\\)`,
    answer: x0,
    steps: [{ type: "calcul", text: `x = \\dfrac{${b}}{${a}} = ${x0}` }],
  };
}

// ---------- 2. Résoudre ax + b = c (mental) ----------
function genAutoResoudreAxPlusBMental() {
  const a = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const c = a * x0 + b;
  return {
    type: "numeric",
    chapter: "Automatismes — Équations",
    prompt: `Résous : \\(${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}\\)`,
    answer: x0,
    steps: [
      { type: "calcul", text: `${a}x = ${c - b}` },
      { type: "resultat", text: `x = ${x0}` },
    ],
  };
}

// ---------- 3. Résoudre une équation produit (x+a)(x+b) = 0 (mental) ----------
function genAutoResoudreProduitMental() {
  const r1 = nonZero(-9, 9);
  let r2;
  do {
    r2 = nonZero(-9, 9);
  } while (r2 === r1);
  const a = -r1;
  const b = -r2;
  const askFirst = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Équations",
    prompt: `Résous : \\(\\left(x ${a >= 0 ? "+" : "-"} ${Math.abs(a)}\\right)\\left(x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\right) = 0\\). Donne la solution associée au ${askFirst ? "premier" : "second"} facteur.`,
    answer: askFirst ? r1 : r2,
    steps: [
      { type: "calcul", text: `x ${a >= 0 ? "+" : "-"} ${Math.abs(a)} = 0 \\Rightarrow x = ${r1}` },
      { type: "calcul", text: `x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = 0 \\Rightarrow x = ${r2}` },
    ],
  };
}

// ---------- 4. Nombre de solutions de x² = a (mental) ----------
function genAutoCombienSolutionsCarreMental() {
  const kind = pick(["pos", "zero", "neg"]);
  const a = kind === "pos" ? randInt(1, 100) : kind === "zero" ? 0 : -randInt(1, 60);
  const answer = kind === "pos" ? "2" : kind === "zero" ? "1" : "0";
  return {
    type: "qcm",
    chapter: "Automatismes — Équations",
    prompt: `Combien de solutions a l'équation \\(x^{2} = ${a}\\) ?`,
    answer,
    options: ["0", "1", "2"],
    steps: [
      {
        type: "regle",
        text: kind === "pos" ? `${a} > 0 : deux solutions.` : kind === "zero" ? `x = 0 : une seule solution.` : `${a} < 0 : aucune solution.`,
      },
    ],
  };
}

// ---------- 5. Résoudre x² = a, a carré parfait (mental) ----------
function genAutoResoudreCarreMental() {
  const r = randInt(2, 12);
  const a = r * r;
  return {
    type: "numeric",
    chapter: "Automatismes — Équations",
    prompt: `Résous \\(x^{2} = ${a}\\). Donne la solution positive.`,
    answer: r,
    steps: [{ type: "calcul", text: `\\sqrt{${a}} = ${r}` }],
  };
}

const CH_EQUATIONS_T = [
  genAutoResoudreAxMental,
  genAutoResoudreAxPlusBMental,
  genAutoResoudreProduitMental,
  genAutoCombienSolutionsCarreMental,
  genAutoResoudreCarreMental,
];

// =========================== Chapitre 5 : Notion de fonction ===========================
// (Mini-exercices "Calcul mental" en tête de page : calculer une image par
// une fonction affine, trouver un antécédent simple, vocabulaire
// image/antécédent, lecture d'une image dans un petit tableau de valeurs.)

// ---------- 1. Calculer une image par une fonction affine (mental) ----------
function genAutoImageFonctionAffineMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const answer = a * x0 + b;
  return {
    type: "numeric",
    chapter: "Automatismes — Notion de fonction",
    prompt: `On définit \\(f(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Calcule \\(f(${x0})\\).`,
    answer,
    steps: [{ type: "calcul", text: `f(${x0}) = ${a} \\times ${x0} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${answer}` }],
  };
}

// ---------- 2. Trouver un antécédent simple (mental) ----------
function genAutoAntecedentSimpleMental() {
  const a = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const target = a * x0;
  return {
    type: "numeric",
    chapter: "Automatismes — Notion de fonction",
    prompt: `On définit \\(f(x) = ${a}x\\). Quel est l'antécédent de ${target} par f ?`,
    answer: x0,
    steps: [
      { type: "calcul", text: `${a}x = ${target}` },
      { type: "resultat", text: `x = ${x0}` },
    ],
  };
}

// ---------- 3. Vocabulaire image / antécédent (mental) ----------
function genAutoVocabulaireImageMental() {
  const fname = pick(["f", "g", "h"]);
  const x0 = nonZero(-9, 9);
  let y0;
  do {
    y0 = nonZero(-9, 9);
  } while (y0 === x0);
  const isImage = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Automatismes — Notion de fonction",
    prompt: `On sait que \\(${fname}(${x0}) = ${y0}\\). ${isImage ? `${y0} est-il l'image de ${x0} par ${fname} ?` : `${y0} est-il un antécédent de ${x0} par ${fname} ?`}`,
    answer: isImage ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      {
        type: "regle",
        text: `${fname}(${x0}) = ${y0}, \\text{ donc } ${y0} \\text{ est l'image de } ${x0}, \\text{ et } ${x0} \\text{ est l'antécédent de } ${y0}.`,
      },
    ],
  };
}

// ---------- 4. Lire une image dans un petit tableau (mental) ----------
function genAutoLectureTableauMental() {
  const xs = [-1, 0, 1, 2];
  const ys = [];
  while (ys.length < 4) {
    const v = nonZero(-9, 9);
    if (!ys.includes(v)) ys.push(v);
  }
  const idx = randInt(0, 3);
  const table = xs.map((x, i) => `f(${x}) = ${ys[i]}`).join(", ");
  return {
    type: "numeric",
    chapter: "Automatismes — Notion de fonction",
    prompt: `${table}. Quelle est l'image de ${xs[idx]} par f ?`,
    answer: ys[idx],
    steps: [{ type: "donnee", text: `f(${xs[idx]}) = ${ys[idx]}` }],
  };
}

// ---------- 5. Nombre d'antécédents d'une fonction constante (mental) ----------
function genAutoConstanteAntecedentsMental() {
  const k = nonZero(-9, 9);
  const same = Math.random() < 0.5;
  const target = same ? k : k + nonZero(1, 9);
  return {
    type: "qcm",
    chapter: "Automatismes — Notion de fonction",
    prompt: `\\(f(x) = ${k}\\) pour tout x. Combien ${target} a-t-il d'antécédents par f ?`,
    answer: same ? "Une infinité" : "0",
    options: ["0", "1", "Une infinité"],
    steps: [
      {
        type: "regle",
        text: same ? `f \\text{ vaut toujours } ${k} : \\text{une infinité d'antécédents.}` : `f \\text{ ne vaut jamais } ${target} : \\text{aucun antécédent.}`,
      },
    ],
  };
}

const CH_NOTION_FONCTION_T = [
  genAutoImageFonctionAffineMental,
  genAutoAntecedentSimpleMental,
  genAutoVocabulaireImageMental,
  genAutoLectureTableauMental,
  genAutoConstanteAntecedentsMental,
];

// =========================== Chapitre 6 : Fonctions affines ===========================
// (Mini-exercices "Calcul mental" en tête de page : identifier a et b,
// sens de variation à partir du signe de a, vérifier un point sur une
// droite, comparer deux coefficients directeurs.)

// ---------- 1. Identifier a et b (mental) ----------
function genAutoIdentifierABMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const askA = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Fonctions affines",
    prompt: `\\(f(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Quelle est ${askA ? "la valeur de a" : "la valeur de b"} ?`,
    answer: askA ? a : b,
    steps: [{ type: "donnee", text: `a = ${a}, b = ${b}` }],
  };
}

// ---------- 2. Sens de variation (mental) ----------
function genAutoSensVariationMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions affines",
    prompt: `\\(f(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\) est-elle croissante ou décroissante ?`,
    answer: a > 0 ? "Croissante" : "Décroissante",
    options: ["Croissante", "Décroissante"],
    steps: [{ type: "regle", text: `a = ${a} \\text{ est } ${a > 0 ? "positif" : "négatif"}.` }],
  };
}

// ---------- 3. Point sur une droite (mental) ----------
function genAutoPointSurDroiteMental() {
  const a = nonZero(-9, 9);
  const b = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const trueY = a * x0 + b;
  const isOn = Math.random() < 0.5;
  const y0 = isOn ? trueY : trueY + nonZero(1, 5);
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions affines",
    prompt: `\\(f(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}\\). Le point \\((${x0}\\,;\\,${y0})\\) est-il sur la droite ?`,
    answer: isOn ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "calcul", text: `f(${x0}) = ${trueY}` }],
  };
}

// ---------- 4. Comparer deux coefficients directeurs (mental) ----------
function genAutoComparerCoefMental() {
  const a1 = nonZero(-9, 9);
  let a2;
  do {
    a2 = nonZero(-9, 9);
  } while (a2 === a1);
  return {
    type: "qcm",
    chapter: "Automatismes — Fonctions affines",
    prompt: `f a pour coefficient directeur ${a1} et g a pour coefficient directeur ${a2}. Laquelle a la droite la plus "pentue" vers le haut ?`,
    answer: a1 > a2 ? "f" : "g",
    options: ["f", "g"],
    steps: [{ type: "calcul", text: `${a1} ${a1 > a2 ? ">" : "<"} ${a2}` }],
  };
}

// ---------- 5. Antécédent d'une fonction linéaire (mental) ----------
function genAutoAntecedentLineaireMental() {
  const a = nonZero(-9, 9);
  const x0 = nonZero(-9, 9);
  const target = a * x0;
  return {
    type: "numeric",
    chapter: "Automatismes — Fonctions affines",
    prompt: `\\(f(x) = ${a}x\\). Quel est l'antécédent de ${target} par f ?`,
    answer: x0,
    steps: [{ type: "calcul", text: `${a}x = ${target}, \\text{ donc } x = ${x0}` }],
  };
}

const CH_FONCTIONS_AFFINES_T = [
  genAutoIdentifierABMental,
  genAutoSensVariationMental,
  genAutoPointSurDroiteMental,
  genAutoComparerCoefMental,
  genAutoAntecedentLineaireMental,
];

// =========================== Chapitre 7 : Situations de proportionnalité ===========================
// (Mini-exercices "Calcul mental" en tête de page : simplifier un ratio,
// coefficient multiplicateur d'une évolution, calculer un prix après
// évolution, partager selon un ratio.)

// ---------- 1. Simplifier un ratio (mental) ----------
function genAutoSimplifierRatioMental() {
  const [p, q] = coprimePair(2, 9);
  const k = randInt(2, 6);
  const askP = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Proportionnalité",
    prompt: `Simplifie le ratio ${p * k} : ${q * k} sous sa forme irréductible p : q. Donne ${askP ? "p" : "q"}.`,
    answer: askP ? p : q,
    steps: [{ type: "calcul", text: `${p * k} : ${q * k} = ${p} : ${q}` }],
  };
}

// ---------- 2. Coefficient multiplicateur (mental) ----------
function genAutoCoefficientMultiplicateurMental() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 90);
  const answer = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Proportionnalité",
    prompt: `Une grandeur ${direction} de ${p} %. Quel est le coefficient multiplicateur ?`,
    answer,
    tolerance: 0.001,
    steps: [{ type: "resultat", text: `${fr(answer)}` }],
  };
}

// ---------- 3. Prix après évolution (mental) ----------
function genAutoPrixApresEvolutionMental() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(5, 50);
  const cm = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  const P0 = randInt(10, 200);
  const P1 = roundTo(P0 * cm, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Proportionnalité",
    prompt: `Un article à ${P0} € ${direction === "augmente" ? "augmente" : "diminue"} de ${p} %. Nouveau prix ?`,
    answer: P1,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${P0} \\times ${fr(cm)} = ${fr(P1)}` }],
  };
}

// ---------- 4. Partager selon un ratio (mental) ----------
function genAutoPartagerRatioMental() {
  const [p, q] = coprimePair(2, 6);
  const k = randInt(2, 10);
  const total = (p + q) * k;
  const askP = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Proportionnalité",
    prompt: `On partage ${total} selon le ratio ${p} : ${q}. Quelle est ${askP ? "la première part" : "la seconde part"} ?`,
    answer: askP ? p * k : q * k,
    steps: [{ type: "calcul", text: `\\text{Une part} = \\dfrac{${total}}{${p + q}} = ${k}` }],
  };
}

// ---------- 5. Pourcentage depuis un coefficient multiplicateur (mental) ----------
function genAutoPourcentageDepuisCoefMental() {
  const direction = pick(["augmente", "diminue"]);
  const p = randInt(1, 90);
  const cm = direction === "augmente" ? roundTo(1 + p / 100, 2) : roundTo(1 - p / 100, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Proportionnalité",
    prompt: `Un coefficient multiplicateur de ${fr(cm)} correspond à une ${direction === "augmente" ? "augmentation" : "diminution"} de quel pourcentage ?`,
    answer: p,
    steps: [{ type: "resultat", text: `${p}\\%` }],
  };
}

const CH_PROPORTIONNALITE_T = [
  genAutoSimplifierRatioMental,
  genAutoCoefficientMultiplicateurMental,
  genAutoPrixApresEvolutionMental,
  genAutoPartagerRatioMental,
  genAutoPourcentageDepuisCoefMental,
];

// =========================== Chapitre 8 : Statistiques ===========================
// (Mini-exercices "Calcul mental" en tête de page : moyenne rapide, étendue,
// médiane d'une petite série, angle d'un secteur circulaire.)

// ---------- 1. Moyenne rapide de 3 valeurs (mental) ----------
function genAutoMoyenneRapideMental() {
  const a = randInt(1, 20);
  const b = randInt(1, 20);
  const c = randInt(1, 20);
  const somme = a + b + c;
  let answer, prompt;
  if (somme % 3 === 0) {
    answer = somme / 3;
    prompt = `Calcule la moyenne de la série : ${a} ; ${b} ; ${c}.`;
  } else {
    answer = somme;
    prompt = `Calcule la somme de la série : ${a} ; ${b} ; ${c}.`;
  }
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques",
    prompt,
    answer,
    steps: [{ type: "calcul", text: `${a} + ${b} + ${c} = ${somme}` }],
  };
}

// ---------- 2. Étendue rapide (mental) ----------
function genAutoEtendueRapideMental() {
  const n = 5;
  const values = Array.from({ length: n }, () => randInt(0, 30));
  const answer = Math.max(...values) - Math.min(...values);
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques",
    prompt: `Calcule l'étendue de la série : ${values.join(" ; ")}.`,
    answer,
    steps: [{ type: "calcul", text: `${Math.max(...values)} - ${Math.min(...values)} = ${answer}` }],
  };
}

// ---------- 3. Médiane d'une petite série impaire (mental) ----------
function genAutoMedianeRapideMental() {
  const values = Array.from({ length: 5 }, () => randInt(1, 30));
  const sorted = [...values].sort((a, b) => a - b);
  const answer = sorted[2];
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques",
    prompt: `Détermine la médiane de la série : ${values.join(" ; ")}.`,
    answer,
    steps: [{ type: "calcul", text: `Ordre croissant : ${sorted.join(" ; ")}. Médiane = ${answer}.` }],
  };
}

// ---------- 4. Angle d'un secteur circulaire simple (mental) ----------
function genAutoAngleSecteurMental() {
  const fractionsSimples = [
    [1, 2, 180], [1, 4, 90], [3, 4, 270], [1, 3, 120], [2, 3, 240], [1, 6, 60], [1, 10, 36], [1, 5, 72],
  ];
  const [num, den, answer] = pick(fractionsSimples);
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques",
    prompt: `Dans un diagramme circulaire, une catégorie représente ${num}/${den} de l'effectif total. Quel est l'angle de son secteur (en degrés) ?`,
    answer,
    steps: [{ type: "calcul", text: `\\dfrac{${num}}{${den}} \\times 360 = ${answer}\\text{°}` }],
  };
}

// ---------- 5. Fréquence rapide en pourcentage (mental) ----------
function genAutoFrequenceRapideMental() {
  const total = pick([10, 20, 25, 50, 100]);
  const effectif = randInt(1, total - 1);
  const answer = roundTo((effectif / total) * 100, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Statistiques",
    prompt: `Sur ${total} valeurs, une catégorie en compte ${effectif}. Quelle est sa fréquence en pourcentage ?`,
    answer,
    tolerance: 0.2,
    steps: [{ type: "calcul", text: `\\dfrac{${effectif}}{${total}} \\times 100 = ${fr(answer)}\\ \\%` }],
  };
}

const CH_STATISTIQUES_T = [
  genAutoMoyenneRapideMental,
  genAutoEtendueRapideMental,
  genAutoMedianeRapideMental,
  genAutoAngleSecteurMental,
  genAutoFrequenceRapideMental,
];

// =========================== Chapitre 9 : Probabilités ===========================
// (Mini-exercices "Calcul mental" en tête de page : probabilité dans une
// urne simple, événement contraire, probabilité avec un dé, somme des
// probabilités.)

// ---------- 1. Probabilité simple dans une urne (mental) ----------
function genAutoProbabiliteUrneMental() {
  const favorables = randInt(1, 8);
  const autres = randInt(2, 10);
  const total = favorables + autres;
  const answer = roundTo(favorables / total, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `Une urne contient ${total} boules dont ${favorables} rouges. Donne la probabilité d'obtenir une boule rouge (fraction ${favorables}/${total} acceptée, ou valeur décimale).`,
    answer,
    tolerance: 0.002,
    steps: [{ type: "calcul", text: `P = \\dfrac{${favorables}}{${total}} \\approx ${fr(answer)}` }],
  };
}

// ---------- 2. Événement contraire (mental) ----------
function genAutoEvenementContraireMental() {
  const pA = roundTo(randInt(5, 95) / 100, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `P(A) = ${fr(pA)}. Quelle est la probabilité de l'événement contraire de A ?`,
    answer: roundTo(1 - pA, 2),
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `1 - ${fr(pA)} = ${fr(roundTo(1 - pA, 2))}` }],
  };
}

// ---------- 3. Probabilité avec un dé à 6 faces (mental) ----------
function genAutoProbabiliteDeMental() {
  const critere = pick(["pair", "impair", "multiple de 3"]);
  const favorables = critere === "multiple de 3" ? 2 : 3;
  const answer = roundTo(favorables / 6, 3);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `On lance un dé à 6 faces. Donne la probabilité d'obtenir un nombre ${critere} (fraction ou valeur décimale).`,
    answer,
    tolerance: 0.002,
    steps: [{ type: "calcul", text: `\\dfrac{${favorables}}{6} \\approx ${fr(answer)}` }],
  };
}

// ---------- 4. Somme des probabilités (mental) ----------
function genAutoSommeProbabilitesMental() {
  const pA = roundTo(randInt(10, 40) / 100, 2);
  const pB = roundTo(randInt(10, 40) / 100, 2);
  const answer = roundTo(1 - pA - pB, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `Une expérience a 3 issues A, B et C. P(A) = ${fr(pA)} et P(B) = ${fr(pB)}. Quelle est P(C) ?`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `1 - ${fr(pA)} - ${fr(pB)} = ${fr(answer)}` }],
  };
}

// ---------- 5. Probabilité depuis un pourcentage (mental) ----------
function genAutoProbabiliteDepuisPourcentageMental() {
  const p = randInt(1, 99);
  return {
    type: "numeric",
    chapter: "Automatismes — Probabilités",
    prompt: `Un événement a ${p} % de chances de se réaliser. Donne sa probabilité sous forme décimale.`,
    answer: roundTo(p / 100, 2),
    tolerance: 0.005,
    steps: [{ type: "calcul", text: `${p}\\% = ${fr(roundTo(p / 100, 2))}` }],
  };
}

const CH_PROBABILITES_T = [
  genAutoProbabiliteUrneMental,
  genAutoEvenementContraireMental,
  genAutoProbabiliteDeMental,
  genAutoSommeProbabilitesMental,
  genAutoProbabiliteDepuisPourcentageMental,
];

// =========================== Chapitre 10 : Thalès et triangles semblables ===========================
// (Mini-exercices "Calcul mental" en tête de page : rapport de Thalès simple,
// coefficient d'agrandissement/réduction, troisième angle d'un triangle,
// aire après agrandissement.)

// ---------- 1. Calculer une longueur (Thalès simple, mental) ----------
function genAutoThalesMental() {
  const AB = randInt(2, 10);
  const k = pick([2, 3, 4, 0.5]);
  const AM = roundTo(AB * k, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Thalès et triangles semblables",
    prompt: `Dans une configuration de Thalès, AB = ${AB} cm et le coefficient entre AM et AB est ${fr(k)}. Calcule AM.`,
    answer: AM,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `${AB} \\times ${fr(k)} = ${fr(AM)}` }],
  };
}

// ---------- 2. Coefficient d'agrandissement/réduction (mental) ----------
function genAutoCoefficientAgrandissementMental() {
  const c1 = randInt(2, 8);
  const k = pick([2, 3, 0.5]);
  const c2 = roundTo(c1 * k, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Thalès et triangles semblables",
    prompt: `Un côté de ${c1} cm devient ${fr(c2)} cm après transformation. Quel est le coefficient ?`,
    answer: k,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `${fr(c2)} \\div ${c1} = ${fr(k)}` }],
  };
}

// ---------- 3. Troisième angle d'un triangle (mental) ----------
function genAutoTroisiemeAngleMental() {
  const a1 = randInt(30, 90);
  const a2 = randInt(30, 90);
  const a3 = 180 - a1 - a2;
  if (a3 <= 5) return genAutoTroisiemeAngleMental();
  return {
    type: "numeric",
    chapter: "Automatismes — Thalès et triangles semblables",
    prompt: `Un triangle a des angles de ${a1}° et ${a2}°. Quel est le troisième ?`,
    answer: a3,
    steps: [{ type: "calcul", text: `180 - ${a1} - ${a2} = ${a3}` }],
  };
}

// ---------- 4. Aire après agrandissement (mental) ----------
function genAutoAireAgrandissementMental() {
  const aire = randInt(4, 20);
  const k = pick([2, 3]);
  return {
    type: "numeric",
    chapter: "Automatismes — Thalès et triangles semblables",
    prompt: `Une figure d'aire ${aire} cm² est agrandie avec un coefficient ${k}. Quelle est la nouvelle aire ?`,
    answer: aire * k * k,
    steps: [{ type: "calcul", text: `${aire} \\times ${k}^2 = ${aire * k * k}` }],
  };
}

// ---------- 5. Reconnaître agrandissement ou réduction (mental) ----------
function genAutoAgrandissementReductionMental() {
  const k = pick([2, 3, 4, 0.5, 0.25, 0.2]);
  const answer = k > 1 ? "Agrandissement" : "Réduction";
  return {
    type: "qcm",
    chapter: "Automatismes — Thalès et triangles semblables",
    prompt: `Un coefficient de ${fr(k)} correspond-il à un agrandissement ou à une réduction ?`,
    answer,
    options: ["Agrandissement", "Réduction"],
    steps: [{ type: "regle", text: k > 1 ? `${fr(k)} > 1 : agrandissement.` : `${fr(k)} < 1 : réduction.` }],
  };
}

const CH_THALES_T = [
  genAutoThalesMental,
  genAutoCoefficientAgrandissementMental,
  genAutoTroisiemeAngleMental,
  genAutoAireAgrandissementMental,
  genAutoAgrandissementReductionMental,
];

// =========================== Chapitre 11 : Trigonométrie dans le triangle rectangle ===========================
// (Mini-exercices "Calcul mental" en tête de page : identifier la relation à
// utiliser, calculer une longueur simple avec cosinus/sinus/tangente, angles
// complémentaires.)

// ---------- 1. Identifier la relation à utiliser (mental) ----------
function genAutoIdentifierRatioMental() {
  const connus = pick([
    { cotes: "adjacent et hypoténuse", ratio: "Cosinus" },
    { cotes: "opposé et hypoténuse", ratio: "Sinus" },
    { cotes: "opposé et adjacent", ratio: "Tangente" },
  ]);
  return {
    type: "qcm",
    chapter: "Automatismes — Trigonométrie",
    prompt: `On connaît les côtés ${connus.cotes}. Quelle relation utiliser ?`,
    answer: connus.ratio,
    options: ["Cosinus", "Sinus", "Tangente"],
    steps: [{ type: "resultat", text: connus.ratio }],
  };
}

// ---------- 2. Calculer une longueur simple (cosinus, mental) ----------
function genAutoLongueurCosinusMental() {
  const angle = pick([30, 45, 60]);
  const hyp = randInt(4, 20);
  const answer = roundTo(hyp * Math.cos(toRad(angle)), 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Trigonométrie",
    prompt: `Hypoténuse = ${hyp} cm, angle = ${angle}°. Calcule le côté adjacent (arrondi au centième).`,
    answer,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `${hyp} \\times \\cos(${angle}°) \\approx ${fr(answer)}` }],
  };
}

// ---------- 3. Calculer une longueur simple (sinus, mental) ----------
function genAutoLongueurSinusMental() {
  const angle = pick([30, 45, 60]);
  const hyp = randInt(4, 20);
  const answer = roundTo(hyp * Math.sin(toRad(angle)), 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Trigonométrie",
    prompt: `Hypoténuse = ${hyp} cm, angle = ${angle}°. Calcule le côté opposé (arrondi au centième).`,
    answer,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `${hyp} \\times \\sin(${angle}°) \\approx ${fr(answer)}` }],
  };
}

// ---------- 4. Calculer un angle simple (arctan, mental) ----------
function genAutoAngleArctanMental() {
  const adj = randInt(3, 15);
  const opp = randInt(3, 15);
  const answer = Math.round(toDeg(Math.atan(opp / adj)));
  return {
    type: "numeric",
    chapter: "Automatismes — Trigonométrie",
    prompt: `Côté opposé = ${opp} cm, côté adjacent = ${adj} cm. Calcule l'angle (arrondi au degré).`,
    answer,
    steps: [{ type: "calcul", text: `\\tan^{-1}\\left(\\dfrac{${opp}}{${adj}}\\right) \\approx ${answer}°` }],
  };
}

// ---------- 5. Angles complémentaires (mental) ----------
function genAutoAnglesComplementairesMental() {
  const angle = randInt(5, 85);
  return {
    type: "numeric",
    chapter: "Automatismes — Trigonométrie",
    prompt: `Dans un triangle rectangle, un angle aigu mesure ${angle}°. Quel est l'autre angle aigu ?`,
    answer: 90 - angle,
    steps: [{ type: "calcul", text: `90 - ${angle} = ${90 - angle}` }],
  };
}

const CH_TRIGONOMETRIE_T = [
  genAutoIdentifierRatioMental,
  genAutoLongueurCosinusMental,
  genAutoLongueurSinusMental,
  genAutoAngleArctanMental,
  genAutoAnglesComplementairesMental,
];

// =========================== Chapitre 12 : Transformations dans le plan ===========================
// (Mini-exercices "Calcul mental" en tête de page : coefficient d'homothétie,
// effet sur une longueur/aire, image par symétrie centrale.)

// ---------- 1. Coefficient d'homothétie (mental) ----------
function genAutoCoefficientHomothetieMental() {
  const OM = randInt(2, 10);
  const k = pick([2, 3, 0.5]);
  const OMprime = roundTo(OM * k, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Transformations",
    prompt: `OM = ${OM} cm, OM' = ${fr(OMprime)} cm. Quel est le coefficient de l'homothétie (positif) ?`,
    answer: k,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `${fr(OMprime)} \\div ${OM} = ${fr(k)}` }],
  };
}

// ---------- 2. Longueur après homothétie (mental) ----------
function genAutoLongueurHomothetieMental() {
  const longueur = randInt(2, 15);
  const k = pick([2, 3, 0.5]);
  return {
    type: "numeric",
    chapter: "Automatismes — Transformations",
    prompt: `Un segment de ${longueur} cm subit une homothétie de coefficient ${fr(k)}. Nouvelle longueur ?`,
    answer: roundTo(longueur * k, 2),
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `${longueur} \\times ${fr(k)} = ${fr(roundTo(longueur * k, 2))}` }],
  };
}

// ---------- 3. Aire après homothétie (mental) ----------
function genAutoAireHomothetieMental() {
  const aire = randInt(3, 15);
  const k = pick([2, 3]);
  return {
    type: "numeric",
    chapter: "Automatismes — Transformations",
    prompt: `Une figure d'aire ${aire} cm² subit une homothétie de coefficient ${k}. Nouvelle aire ?`,
    answer: aire * k * k,
    steps: [{ type: "calcul", text: `${aire} \\times ${k}^2 = ${aire * k * k}` }],
  };
}

// ---------- 4. Image par symétrie centrale à l'origine (mental) ----------
function genAutoSymetrieCentraleOrigineMental() {
  const x = randInt(-10, 10);
  const y = randInt(-10, 10);
  const askX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Automatismes — Transformations",
    prompt: `M(${x} ; ${y}). Donne ${askX ? "l'abscisse" : "l'ordonnée"} de l'image de M par la symétrie centrale de centre O(0 ; 0).`,
    answer: askX ? -x : -y,
    steps: [{ type: "resultat", text: `(-${x}\\, ;\\ -${y})` }],
  };
}

// ---------- 5. Propriété conservée (mental) ----------
function genAutoProprieteConserveeMental() {
  const conserveLongueurs = Math.random() < 0.7;
  const transfo = conserveLongueurs ? pick(["une translation", "une symétrie", "une rotation"]) : "une homothétie de coefficient 3";
  return {
    type: "qcm",
    chapter: "Automatismes — Transformations",
    prompt: `${transfo.charAt(0).toUpperCase() + transfo.slice(1)} conserve-t-elle les longueurs ?`,
    answer: conserveLongueurs ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: conserveLongueurs ? "Oui." : "Non, elle les multiplie par 3." }],
  };
}

const CH_TRANSFORMATIONS_T = [
  genAutoCoefficientHomothetieMental,
  genAutoLongueurHomothetieMental,
  genAutoAireHomothetieMental,
  genAutoSymetrieCentraleOrigineMental,
  genAutoProprieteConserveeMental,
];

// =========================== Chapitre 13 : Géométrie dans l'espace ===========================
// (Mini-exercices "Calcul mental" en tête de page : volume/aire d'une sphère
// simple, latitude/longitude, section d'un solide.)

// ---------- 1. Aire d'une sphère (mental, rayon simple) ----------
function genAutoAireSphereMental() {
  const R = pick([1, 2, 3, 5, 10]);
  const answer = roundTo(4 * Math.PI * R ** 2, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie dans l'espace",
    prompt: `Aire d'une sphère de rayon ${R} cm (arrondie au dixième) ?`,
    answer,
    tolerance: Math.max(0.5, answer * 0.01),
    steps: [{ type: "calcul", text: `4 \\times \\pi \\times ${R}^2 \\approx ${fr(answer)}` }],
  };
}

// ---------- 2. Volume d'une sphère (mental, rayon simple) ----------
function genAutoVolumeSphereMental() {
  const R = pick([1, 2, 3, 5]);
  const answer = roundTo((4 / 3) * Math.PI * R ** 3, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Géométrie dans l'espace",
    prompt: `Volume d'une boule de rayon ${R} cm (arrondi au dixième) ?`,
    answer,
    tolerance: Math.max(0.5, answer * 0.01),
    steps: [{ type: "calcul", text: `\\dfrac{4}{3} \\times \\pi \\times ${R}^3 \\approx ${fr(answer)}` }],
  };
}

// ---------- 3. Latitude ou longitude (mental) ----------
function genAutoLatitudeLongitudeMental() {
  const askLatitude = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Automatismes — Géométrie dans l'espace",
    prompt: askLatitude ? `Quelle coordonnée mesure la position Nord/Sud ?` : `Quelle coordonnée mesure la position Est/Ouest ?`,
    answer: askLatitude ? "Latitude" : "Longitude",
    options: ["Latitude", "Longitude"],
    steps: [{ type: "resultat", text: askLatitude ? "Latitude" : "Longitude" }],
  };
}

// ---------- 4. Section d'un cube (mental) ----------
function genAutoSectionCubeMental() {
  return {
    type: "qcm",
    chapter: "Automatismes — Géométrie dans l'espace",
    prompt: `Un plan de coupe parallèle à une face d'un cube donne une section de quelle forme ?`,
    answer: "Un carré",
    options: ["Un carré", "Un rectangle", "Un disque"],
    steps: [{ type: "regle", text: `Un carré identique à la face.` }],
  };
}

// ---------- 5. Section d'un cylindre (mental) ----------
function genAutoSectionCylindreMental() {
  return {
    type: "qcm",
    chapter: "Automatismes — Géométrie dans l'espace",
    prompt: `Un plan de coupe parallèle à la base d'un cylindre donne une section de quelle forme ?`,
    answer: "Un disque",
    options: ["Un disque", "Un rectangle", "Un carré"],
    steps: [{ type: "regle", text: `Un disque de même rayon que la base.` }],
  };
}

const CH_GEOMETRIE_ESPACE_T = [
  genAutoAireSphereMental,
  genAutoVolumeSphereMental,
  genAutoLatitudeLongitudeMental,
  genAutoSectionCubeMental,
  genAutoSectionCylindreMental,
];

// =========================== Chapitre 14 : Mesures et grandeurs ===========================
// (Mini-exercices "Calcul mental" en tête de page : vitesse simple,
// conversion km/h-m/s, débit.)

// ---------- 1. Vitesse simple (mental) ----------
function genAutoVitesseMental() {
  const t = randInt(1, 5);
  const v = pick([10, 20, 30, 40, 50, 60, 80, 100]);
  const d = t * v;
  return {
    type: "numeric",
    chapter: "Automatismes — Mesures et grandeurs",
    prompt: `Distance = ${d} km, temps = ${t} h. Vitesse (en km/h) ?`,
    answer: v,
    steps: [{ type: "calcul", text: `${d} \\div ${t} = ${v}` }],
  };
}

// ---------- 2. Conversion km/h vers m/s (mental) ----------
function genAutoConversionKmhMsMental() {
  const vKmh = pick([18, 36, 54, 72, 90]);
  const answer = roundTo(vKmh / 3.6, 1);
  return {
    type: "numeric",
    chapter: "Automatismes — Mesures et grandeurs",
    prompt: `Convertis ${vKmh} km/h en m/s.`,
    answer,
    tolerance: 0.1,
    steps: [{ type: "calcul", text: `${vKmh} \\div 3,6 = ${fr(answer)}` }],
  };
}

// ---------- 3. Débit simple (mental) ----------
function genAutoDebitMental() {
  const debit = randInt(2, 20);
  const temps = randInt(2, 10);
  const volume = debit * temps;
  return {
    type: "numeric",
    chapter: "Automatismes — Mesures et grandeurs",
    prompt: `Un robinet remplit ${volume} L en ${temps} min. Débit (en L/min) ?`,
    answer: debit,
    steps: [{ type: "calcul", text: `${volume} \\div ${temps} = ${debit}` }],
  };
}

// ---------- 4. Échelle simple (mental) ----------
function genAutoEchelleMental() {
  const echelle = pick([100, 1000]);
  const distancePlanCm = randInt(2, 20);
  const distanceReelleM = roundTo((distancePlanCm * echelle) / 100, 2);
  return {
    type: "numeric",
    chapter: "Automatismes — Mesures et grandeurs",
    prompt: `Sur un plan à l'échelle 1/${echelle}, une distance mesure ${distancePlanCm} cm. Distance réelle (en m) ?`,
    answer: distanceReelleM,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `${distancePlanCm} \\times ${echelle} \\div 100 = ${fr(distanceReelleM)}` }],
  };
}

// ---------- 5. Énergie simple (mental) ----------
function genAutoEnergieMental() {
  const P = pick([100, 500, 1000, 2000]);
  const t = randInt(1, 8);
  return {
    type: "numeric",
    chapter: "Automatismes — Mesures et grandeurs",
    prompt: `Puissance = ${P} W, temps = ${t} h. Énergie consommée (en Wh) ?`,
    answer: P * t,
    steps: [{ type: "calcul", text: `${P} \\times ${t} = ${P * t}` }],
  };
}

const CH_MESURES_GRANDEURS_T = [
  genAutoVitesseMental,
  genAutoConversionKmhMsMental,
  genAutoDebitMental,
  genAutoEchelleMental,
  genAutoEnergieMental,
];

const THEMES = [
  { id: "nombres-entiers-troisieme", title: "Nombres entiers", generators: CH_NOMBRES_ENTIERS_T },
  { id: "calcul-numerique-troisieme", title: "Calcul numérique", generators: CH_CALCUL_NUMERIQUE_T },
  { id: "calcul-litteral-troisieme", title: "Calcul littéral", generators: CH_CALCUL_LITTERAL_T },
  { id: "equations-troisieme", title: "Équations", generators: CH_EQUATIONS_T },
  { id: "notion-fonction-troisieme", title: "Notion de fonction", generators: CH_NOTION_FONCTION_T },
  { id: "fonctions-affines-troisieme", title: "Fonctions affines", generators: CH_FONCTIONS_AFFINES_T },
  { id: "proportionnalite-troisieme", title: "Situations de proportionnalité", generators: CH_PROPORTIONNALITE_T },
  { id: "statistiques-troisieme", title: "Statistiques", generators: CH_STATISTIQUES_T },
  { id: "probabilites-troisieme", title: "Probabilités", generators: CH_PROBABILITES_T },
  { id: "thales-triangles-semblables-troisieme", title: "Thalès et triangles semblables", generators: CH_THALES_T },
  { id: "trigonometrie-triangle-rectangle-troisieme", title: "Trigonométrie dans le triangle rectangle", generators: CH_TRIGONOMETRIE_T },
  { id: "transformations-plan-troisieme", title: "Transformations dans le plan", generators: CH_TRANSFORMATIONS_T },
  { id: "geometrie-espace-troisieme", title: "Géométrie dans l'espace", generators: CH_GEOMETRIE_ESPACE_T },
  { id: "mesures-grandeurs-troisieme", title: "Mesures et grandeurs", generators: CH_MESURES_GRANDEURS_T },
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
    id: "automatismes-troisieme",
    title: "Automatismes",
    description: "Calcul rapide et automatismes du programme de 3e, chapitre après chapitre.",
    pourquoi: "Les automatismes, c'est le calcul mental qui libère de la place dans ta tête pour réfléchir au problème plutôt qu'à l'arithmétique : quelques minutes régulières valent mieux qu'une révision unique la veille du contrôle.",
    level: "troisieme",
    freemiumDaily: 5,
    order: 1,
    isAutomatismes: true,
  },
  themes: THEMES.map(({ id, title }) => ({ id, title })),
  generate,
};
