// ---------------------------------------------------------------------------
// Chapitre : Calcul numérique (3e) — sous abonnement.
//
// Correspond au chapitre 2 du manuel de 3e : opérations sur les fractions
// (addition, soustraction, multiplication, division, priorités opératoires),
// problèmes contextualisés avec des fractions, calcul avec les puissances
// (calculer une puissance, puissance négative, priorités avec puissances,
// règles de calcul sur les puissances de même base ou même exposant),
// encadrement d'une racine carrée entre deux entiers consécutifs, carrés
// parfaits, et écriture scientifique.
// Reprend la tâche intellectuelle des exercices du manuel (avec correction
// utilisée pour rédiger les steps), avec des nombres, prénoms et contextes
// différents à chaque génération pour éviter toute reproduction à l'identique.
// Voir automatismes-troisieme.js (thème "calcul-numerique-troisieme") pour
// les mini-exercices "Calcul mental".
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
const frTex = (n) => String(n).replace(".", "{,}");

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
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

function isPerfectSquare(n) {
  if (n < 0) return false;
  const r = Math.round(Math.sqrt(n));
  return r * r === n;
}

// =========================== Fractions ===========================

// ---------- 1. Additionner/soustraire deux fractions de dénominateurs différents ----------
function genAdditionSoustractionFractionsNumeric() {
  const d1 = randInt(2, 9);
  let d2 = randInt(2, 9);
  while (d2 === d1) d2 = randInt(2, 9);
  const n1 = nonZero(-9, 9);
  const n2 = nonZero(-9, 9);
  const op = pick(["+", "-"]);
  const commonDen = d1 * d2;
  const num1Scaled = n1 * d2;
  const num2Scaled = n2 * d1;
  const totalNum = op === "+" ? num1Scaled + num2Scaled : num1Scaled - num2Scaled;
  const [rn, rd] = reduceFrac(totalNum, commonDen);
  const askNum = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Calcul numérique — Fractions",
    prompt: `Calcule et donne le résultat sous forme de fraction irréductible (dénominateur positif) : \\(\\dfrac{${n1}}{${d1}} ${op} \\dfrac{${n2}}{${d2}}\\). Donne son ${askNum ? "numérateur" : "dénominateur"}.`,
    answer: askNum ? rn : rd,
    steps: [
      { type: "calcul", text: `\\dfrac{${n1}}{${d1}} ${op} \\dfrac{${n2}}{${d2}} = \\dfrac{${num1Scaled}}{${commonDen}} ${op} \\dfrac{${num2Scaled}}{${commonDen}} = \\dfrac{${totalNum}}{${commonDen}}` },
      { type: "resultat", text: `Sous forme irréductible : \\dfrac{${rn}}{${rd}}` },
    ],
  };
}

// ---------- 2. Multiplier deux fractions ----------
function genMultiplicationFractionsNumeric() {
  const n1 = nonZero(-9, 9);
  const d1 = randInt(2, 9);
  const n2 = nonZero(-9, 9);
  const d2 = randInt(2, 9);
  const numProd = n1 * n2;
  const denProd = d1 * d2;
  const [rn, rd] = reduceFrac(numProd, denProd);
  const askNum = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Calcul numérique — Fractions",
    prompt: `Calcule et donne le résultat sous forme de fraction irréductible (dénominateur positif) : \\(\\dfrac{${n1}}{${d1}} \\times \\dfrac{${n2}}{${d2}}\\). Donne son ${askNum ? "numérateur" : "dénominateur"}.`,
    answer: askNum ? rn : rd,
    steps: [
      { type: "calcul", text: `\\dfrac{${n1}}{${d1}} \\times \\dfrac{${n2}}{${d2}} = \\dfrac{${numProd}}{${denProd}}` },
      { type: "resultat", text: `Sous forme irréductible : \\dfrac{${rn}}{${rd}}` },
    ],
  };
}

// ---------- 3. Diviser deux fractions ----------
function genDivisionFractionsNumeric() {
  const n1 = nonZero(-9, 9);
  const d1 = randInt(2, 9);
  const n2 = nonZero(-9, 9);
  const d2 = randInt(2, 9);
  // (n1/d1) ÷ (n2/d2) = (n1/d1) × (d2/n2)
  const numRes = n1 * d2;
  const denRes = d1 * n2;
  const [rn, rd] = reduceFrac(numRes, denRes);
  const askNum = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Calcul numérique — Fractions",
    prompt: `Calcule et donne le résultat sous forme de fraction irréductible (dénominateur positif) : \\(\\dfrac{${n1}}{${d1}} \\div \\dfrac{${n2}}{${d2}}\\). Donne son ${askNum ? "numérateur" : "dénominateur"}.`,
    answer: askNum ? rn : rd,
    steps: [
      { type: "calcul", text: `\\dfrac{${n1}}{${d1}} \\div \\dfrac{${n2}}{${d2}} = \\dfrac{${n1}}{${d1}} \\times \\dfrac{${d2}}{${n2}} = \\dfrac{${numRes}}{${denRes}}` },
      { type: "resultat", text: `Sous forme irréductible : \\dfrac{${rn}}{${rd}}` },
    ],
  };
}

// ---------- 4. Priorités avec des fractions (addition/soustraction et multiplication) ----------
function genPrioriteFractionsNumeric() {
  const a = nonZero(-9, 9);
  const b = randInt(2, 8);
  const c = nonZero(-8, 8);
  const d = randInt(2, 8);
  const e = nonZero(-8, 8);
  const f = randInt(2, 8);
  const op = pick(["+", "-"]);
  const prodNum = c * e;
  const prodDen = d * f;
  const commonDen = b * prodDen;
  const leftScaled = a * prodDen;
  const rightScaled = prodNum * b;
  const totalNum = op === "+" ? leftScaled + rightScaled : leftScaled - rightScaled;
  const [rn, rd] = reduceFrac(totalNum, commonDen);
  const askNum = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Calcul numérique — Priorités",
    prompt: `Calcule en respectant les priorités, et donne le résultat sous forme de fraction irréductible (dénominateur positif) : \\(\\dfrac{${a}}{${b}} ${op} \\dfrac{${c}}{${d}} \\times \\dfrac{${e}}{${f}}\\). Donne son ${askNum ? "numérateur" : "dénominateur"}.`,
    answer: askNum ? rn : rd,
    steps: [
      { type: "calcul", text: `On calcule d'abord le produit : \\dfrac{${c}}{${d}} \\times \\dfrac{${e}}{${f}} = \\dfrac{${prodNum}}{${prodDen}}` },
      { type: "calcul", text: `\\dfrac{${a}}{${b}} ${op} \\dfrac{${prodNum}}{${prodDen}} = \\dfrac{${totalNum}}{${commonDen}}` },
      { type: "resultat", text: `Sous forme irréductible : \\dfrac{${rn}}{${rd}}` },
    ],
  };
}

// ---------- 5. Problème contextualisé : fraction du reste ----------
const objetsPartage = ["une tablette de chocolat", "une pizza", "un gâteau", "une plaque de nougat", "un pain d'épices"];
function genFractionResteProblemeNumeric() {
  const d1 = pick([3, 4, 5]);
  const d2 = pick([2, 3, 4]);
  const objet = pick(objetsPartage);
  const p1 = pick(prenoms);
  let p2 = pick(prenoms);
  while (p2 === p1) p2 = pick(prenoms);
  const consumed1 = d2; // sur d1*d2 parts, 1/d1 = d2 parts
  const remainingAfter1 = d1 * d2 - consumed1; // toujours divisible par d2
  const consumed2 = remainingAfter1 / d2; // 1/d2 du reste
  const totalConsumed = consumed1 + consumed2;
  const restNum = d1 * d2 - totalConsumed;
  const restDen = d1 * d2;
  const [rn, rd] = reduceFrac(restNum, restDen);
  const askNum = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Calcul numérique — Problèmes",
    prompt: `${p1} et ${p2} se partagent ${objet}. ${p1} en mange \\(\\dfrac{1}{${d1}}\\), puis ${p2} mange \\(\\dfrac{1}{${d2}}\\) de ce qu'il reste. Quelle fraction de ${objet} reste-t-il, sous forme irréductible ? Donne son ${askNum ? "numérateur" : "dénominateur"}.`,
    answer: askNum ? rn : rd,
    steps: [
      { type: "calcul", text: `${p1} mange \\dfrac{1}{${d1}} = \\dfrac{${consumed1}}{${restDen}}. Il reste \\dfrac{${remainingAfter1}}{${restDen}}.` },
      { type: "calcul", text: `${p2} mange \\dfrac{1}{${d2}} de ce reste, soit \\dfrac{${consumed2}}{${restDen}}.` },
      { type: "resultat", text: `Il reste : \\dfrac{${restDen}}{${restDen}} - \\dfrac{${totalConsumed}}{${restDen}} = \\dfrac{${restNum}}{${restDen}} = \\dfrac{${rn}}{${rd}}` },
    ],
  };
}

// =========================== Puissances ===========================

// ---------- 6. Calculer une puissance simple ----------
function genCalculerPuissanceSimpleNumeric() {
  const base = nonZero(-9, 9);
  const exp = randInt(2, 5);
  const answer = base ** exp;
  return {
    type: "numeric",
    chapter: "Calcul numérique — Puissances",
    prompt: `Calcule : \\((${base})^{${exp}}\\)`,
    answer,
    steps: [{ type: "calcul", text: `${Array.from({ length: exp }, () => `(${base})`).join(" \\times ")} = ${answer}` }],
  };
}

// ---------- 7. Puissance négative (écriture fractionnaire) ----------
function genPuissanceNegativeNumeric() {
  const base = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  const exp = randInt(1, 4);
  const denom = base ** exp;
  return {
    type: "numeric",
    chapter: "Calcul numérique — Puissances",
    prompt: `On écrit \\(${base}^{${-exp}}\\) sous la forme d'une fraction \\(\\dfrac{1}{${base}^{${exp}}}\\). Quel est le dénominateur de cette fraction ?`,
    answer: denom,
    steps: [{ type: "regle", text: `${base}^{${-exp}} = \\dfrac{1}{${base}^{${exp}}} = \\dfrac{1}{${denom}}` }],
  };
}

// ---------- 8. Priorités avec puissances (somme) ----------
function genPrioritePuissanceSommeNumeric() {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const withParen = Math.random() < 0.5;
  const expr = withParen ? `(${a} + ${b})^2` : `${a}^2 + ${b}^2`;
  const answer = withParen ? (a + b) ** 2 : a ** 2 + b ** 2;
  return {
    type: "numeric",
    chapter: "Calcul numérique — Priorités avec puissances",
    prompt: `Calcule : \\(${expr}\\)`,
    answer,
    steps: withParen
      ? [
          { type: "calcul", text: `${a} + ${b} = ${a + b}` },
          { type: "resultat", text: `${a + b}^2 = ${answer}` },
        ]
      : [
          { type: "calcul", text: `${a}^2 = ${a * a}` },
          { type: "calcul", text: `${b}^2 = ${b * b}` },
          { type: "resultat", text: `${a * a} + ${b * b} = ${answer}` },
        ],
  };
}

// ---------- 9. Priorités avec puissances (produit) ----------
function genPrioritePuissanceProduitNumeric() {
  const a = randInt(2, 5);
  const b = randInt(2, 5);
  const withParen = Math.random() < 0.5;
  const pa = withParen ? 2 : randInt(2, 3);
  const pb = randInt(2, 3);
  const expr = withParen ? `(${a} \\times ${b})^{${pa}}` : `${a}^{${pa}} \\times ${b}^{${pb}}`;
  const answer = withParen ? (a * b) ** pa : a ** pa * b ** pb;
  return {
    type: "numeric",
    chapter: "Calcul numérique — Priorités avec puissances",
    prompt: `Calcule : \\(${expr}\\)`,
    answer,
    steps: withParen
      ? [
          { type: "calcul", text: `${a} \\times ${b} = ${a * b}` },
          { type: "resultat", text: `${a * b}^{${pa}} = ${answer}` },
        ]
      : [
          { type: "calcul", text: `${a}^{${pa}} = ${a ** pa}` },
          { type: "calcul", text: `${b}^{${pb}} = ${b ** pb}` },
          { type: "resultat", text: `${a ** pa} \\times ${b ** pb} = ${answer}` },
        ],
  };
}

// ---------- 10. Règle : produit de puissances de même base ----------
function genProduitPuissancesMemeBaseNumeric() {
  const base = randInt(2, 12);
  const m = randInt(-4, 6);
  const n = randInt(-4, 6);
  return {
    type: "numeric",
    chapter: "Calcul numérique — Règles des puissances",
    prompt: `On écrit \\(${base}^{${m}} \\times ${base}^{${n}}\\) sous la forme \\(${base}^{k}\\). Quelle est la valeur de k ?`,
    answer: m + n,
    steps: [{ type: "regle", text: `${base}^{${m}} \\times ${base}^{${n}} = ${base}^{${m} + (${n})} = ${base}^{${m + n}}` }],
  };
}

// ---------- 11. Règle : quotient de puissances de même base ----------
function genQuotientPuissancesMemeBaseNumeric() {
  const base = randInt(2, 12);
  const m = randInt(-4, 8);
  const n = randInt(-4, 8);
  return {
    type: "numeric",
    chapter: "Calcul numérique — Règles des puissances",
    prompt: `On écrit \\(\\dfrac{${base}^{${m}}}{${base}^{${n}}}\\) sous la forme \\(${base}^{k}\\). Quelle est la valeur de k ?`,
    answer: m - n,
    steps: [{ type: "regle", text: `\\dfrac{${base}^{${m}}}{${base}^{${n}}} = ${base}^{${m} - (${n})} = ${base}^{${m - n}}` }],
  };
}

// ---------- 12. Règle : puissance de puissance ----------
function genPuissanceDePuissanceNumeric() {
  const base = randInt(2, 12);
  const m = randInt(-4, 5);
  const n = randInt(-4, 5);
  return {
    type: "numeric",
    chapter: "Calcul numérique — Règles des puissances",
    prompt: `On écrit \\((${base}^{${m}})^{${n}}\\) sous la forme \\(${base}^{k}\\). Quelle est la valeur de k ?`,
    answer: m * n,
    steps: [{ type: "regle", text: `(${base}^{${m}})^{${n}} = ${base}^{${m} \\times ${n}} = ${base}^{${m * n}}` }],
  };
}

// ---------- 13. Règle : produit de puissances de même exposant ----------
function genProduitMemeExposantNumeric() {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const n = randInt(2, 6);
  return {
    type: "numeric",
    chapter: "Calcul numérique — Règles des puissances",
    prompt: `On écrit \\(${a}^{${n}} \\times ${b}^{${n}}\\) sous la forme \\(k^{${n}}\\). Quelle est la valeur de k ?`,
    answer: a * b,
    steps: [{ type: "regle", text: `${a}^{${n}} \\times ${b}^{${n}} = (${a} \\times ${b})^{${n}} = ${a * b}^{${n}}` }],
  };
}

// =========================== Racines carrées ===========================

// ---------- 14. Encadrer une racine carrée entre deux entiers consécutifs ----------
function genEncadrementRacineCarreeNumeric() {
  const n = randInt(2, 15);
  const lower = n * n;
  const upper = (n + 1) * (n + 1);
  const k = randInt(lower + 1, upper - 1);
  const askLower = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Calcul numérique — Racines carrées",
    prompt: `Sachant que \\(${lower} < ${k} < ${upper}\\), encadre \\(\\sqrt{${k}}\\) entre deux entiers consécutifs. Donne ${askLower ? "l'entier le plus petit" : "l'entier le plus grand"} de cet encadrement.`,
    answer: askLower ? n : n + 1,
    steps: [
      { type: "calcul", text: `${lower} = ${n}^2` },
      { type: "calcul", text: `${upper} = (${n + 1})^2` },
      { type: "resultat", text: `${n} < \\sqrt{${k}} < ${n + 1}` },
    ],
  };
}

// ---------- 15. Carré parfait ou non ----------
function genEstCarreParfaitQCM() {
  const isCarre = Math.random() < 0.5;
  let n;
  if (isCarre) {
    const r = randInt(2, 22);
    n = r * r;
  } else {
    const r = randInt(2, 22);
    n = r * r + randInt(1, 2 * r);
    while (isPerfectSquare(n)) n += 1;
  }
  const carre = isPerfectSquare(n);
  const racine = carre ? Math.round(Math.sqrt(n)) : null;
  return {
    type: "qcm",
    chapter: "Calcul numérique — Racines carrées",
    prompt: `${n} est-il un carré parfait (le carré d'un nombre entier) ?`,
    answer: carre ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: carre
      ? [{ type: "regle", text: `${n} = ${racine}^2, donc ${n} est bien un carré parfait.` }]
      : [{ type: "regle", text: `Il n'existe aucun nombre entier dont le carré vaut ${n}, donc ${n} n'est pas un carré parfait.` }],
  };
}

// =========================== Écriture scientifique ===========================

// ---------- 16. Retrouver l'exposant en notation scientifique normalisée ----------
function genEcritureScientifiqueExposantNumeric() {
  const d0 = randInt(1, 9);
  const d1 = randInt(0, 9);
  const m = roundTo(d0 + d1 / 10, 1);
  const e = randInt(-6, 6);
  const k = pick([-2, -1, 1, 2]);
  const eDisplay = e - k;
  const mDisplay = roundTo(m * 10 ** k, 6);
  return {
    type: "numeric",
    chapter: "Calcul numérique — Écriture scientifique",
    prompt: `On écrit un nombre sous la forme \\(${fr(mDisplay)} \\times 10^{${eDisplay}}\\). Écris ce nombre en notation scientifique, avec une mantisse comprise entre 1 et 10 (en valeur absolue). Quel est l'exposant de cette écriture ?`,
    answer: e,
    steps: [
      { type: "regle", text: `On déplace la virgule de la mantisse pour qu'elle soit comprise entre 1 et 10, en ajustant l'exposant de la même quantité en sens inverse.` },
      { type: "resultat", text: `${fr(mDisplay)} \\times 10^{${eDisplay}} = ${fr(m)} \\times 10^{${e}}` },
    ],
  };
}

const GENERATORS = [
  genAdditionSoustractionFractionsNumeric,
  genMultiplicationFractionsNumeric,
  genDivisionFractionsNumeric,
  genPrioriteFractionsNumeric,
  genFractionResteProblemeNumeric,
  genCalculerPuissanceSimpleNumeric,
  genPuissanceNegativeNumeric,
  genPrioritePuissanceSommeNumeric,
  genPrioritePuissanceProduitNumeric,
  genProduitPuissancesMemeBaseNumeric,
  genQuotientPuissancesMemeBaseNumeric,
  genPuissanceDePuissanceNumeric,
  genProduitMemeExposantNumeric,
  genEncadrementRacineCarreeNumeric,
  genEstCarreParfaitQCM,
  genEcritureScientifiqueExposantNumeric,
];

const DIFFICULTY = {
  genAdditionSoustractionFractionsNumeric: "facile",
  genMultiplicationFractionsNumeric: "facile",
  genDivisionFractionsNumeric: "facile",
  genCalculerPuissanceSimpleNumeric: "facile",
  genEstCarreParfaitQCM: "facile",
  genPrioriteFractionsNumeric: "standard",
  genPuissanceNegativeNumeric: "standard",
  genPrioritePuissanceSommeNumeric: "standard",
  genPrioritePuissanceProduitNumeric: "standard",
  genProduitPuissancesMemeBaseNumeric: "standard",
  genQuotientPuissancesMemeBaseNumeric: "standard",
  genPuissanceDePuissanceNumeric: "standard",
  genProduitMemeExposantNumeric: "standard",
  genEncadrementRacineCarreeNumeric: "standard",
  genFractionResteProblemeNumeric: "expert",
  genEcritureScientifiqueExposantNumeric: "expert",
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
    id: "calcul-numerique-troisieme",
    title: "Calcul numérique",
    description: "Opérations et priorités avec des fractions, calcul avec les puissances (puissances négatives, règles de calcul), encadrement d'une racine carrée, carrés parfaits, écriture scientifique.",
    pourquoi: "Maîtriser fractions et puissances, c'est ce qui rend accessibles les calculs scientifiques (notation scientifique, ordres de grandeur) sans calculatrice.",
    level: "troisieme",
    free: false,
    order: 3,
  },
  generate,
};
