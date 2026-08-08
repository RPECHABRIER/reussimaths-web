// ---------------------------------------------------------------------------
// Chapitre : Addition et soustraction de nombres rationnels (4e) — sous abonnement.
//
// Correspond au chapitre 2 du sommaire officiel : rappels (nombres premiers,
// simplifier et comparer des fractions), additionner/soustraire des nombres
// rationnels (positifs ou négatifs), problèmes de proportions. Reprend la
// tâche intellectuelle des exercices fournis, avec des nombres, prénoms et
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

function pgcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

function ppcm(a, b) {
  return Math.abs(a * b) / pgcd(a, b);
}

function primeFactorsList(n) {
  let x = n;
  const factors = [];
  let d = 2;
  while (d * d <= x) {
    while (x % d === 0) {
      factors.push(d);
      x /= d;
    }
    d++;
  }
  if (x > 1) factors.push(x);
  return factors;
}

// Étapes détaillées de la décomposition en facteurs premiers (divisions successives).
function primeFactorDivisionSteps(n) {
  let x = n;
  const steps = [];
  let d = 2;
  while (d * d <= x) {
    while (x % d === 0) {
      steps.push(`${x} \\div ${d} = ${x / d}`);
      x /= d;
    }
    d++;
  }
  if (x > 1 && x !== n) steps.push(`${x} est un nombre premier : on s'arrête.`);
  return steps;
}

// Étapes détaillées de l'algorithme d'Euclide pour calculer un PGCD.
function pgcdEuclideSteps(a, b) {
  let x = a, y = b;
  const steps = [];
  while (y !== 0) {
    const q = Math.floor(x / y);
    const r = x % y;
    steps.push(r === 0 ? `${x} = ${q} \\times ${y}` : `${x} = ${q} \\times ${y} + ${r}`);
    [x, y] = [y, r];
  }
  return steps;
}

// =========================== Rappels : nombres premiers, simplifier, comparer ===========================

// ---------- 1. Décomposition en produit de facteurs premiers (QCM) ----------
function genDecompositionFacteursPremiersQCM() {
  const candidates = [42, 60, 72, 84, 90, 105, 120, 126, 132, 140, 150, 168, 180, 198, 210, 220, 231, 252, 264, 275, 286, 308, 315, 330, 336, 364, 378, 392, 405, 414, 420, 441, 455, 462, 480];
  const n = pick(candidates);
  const factors = primeFactorsList(n);
  const correct = factors.join(" × ");
  const opts = new Set([correct]);
  if (factors.length > 2) opts.add(factors.slice(0, -1).join(" × "));
  const altFactors = [...factors];
  altFactors[randInt(0, altFactors.length - 1)] += 2;
  opts.add(altFactors.join(" × "));
  const dupFactors = [...factors, pick(factors)];
  opts.add(dupFactors.join(" × "));
  let bump = 3;
  while (opts.size < 4) {
    const alt2 = [...factors];
    alt2[0] = alt2[0] + bump;
    opts.add(alt2.join(" × "));
    bump++;
  }
  const options = shuffle([...opts]).slice(0, 4);
  if (!options.includes(correct)) options[0] = correct;
  return {
    type: "qcm",
    chapter: "Addition, soustraction de rationnels — Rappels",
    prompt: `Quelle est la décomposition en produit de facteurs premiers de ${n} ?`,
    answer: correct,
    options: shuffle(options),
    steps: [
      { type: "regle", text: `On divise ${n} successivement par les nombres premiers (2, 3, 5, 7, ...) jusqu'à obtenir 1.` },
      ...primeFactorDivisionSteps(n).map((text) => ({ type: "calcul", text })),
      { type: "resultat", text: `${n} = ${correct}` },
    ],
  };
}

// ---------- 2. Simplifier une fraction à l'aide des critères de divisibilité ----------
function genSimplifierFractionCriteresDivisibilite() {
  let a0, b0;
  do {
    a0 = randInt(2, 9);
    b0 = randInt(a0 + 1, 15);
  } while (pgcd(a0, b0) !== 1);
  const k = randInt(3, 9);
  const num = a0 * k;
  const den = b0 * k;
  return {
    type: "numeric",
    chapter: "Addition, soustraction de rationnels — Rappels",
    prompt: `En utilisant les critères de divisibilité, simplifie au maximum : \\(\\dfrac{${num}}{${den}} = \\dfrac{?}{${b0}}\\)`,
    answer: a0,
    steps: [
      { type: "calcul", text: `${num} \\div ${k} = ${a0}` },
      { type: "calcul", text: `${den} \\div ${k} = ${b0}` },
    ],
  };
}

// ---------- 3. Comparer deux fractions signées ----------
function genComparerDeuxFractionsSigneesQCM() {
  let a, b, c, d;
  do {
    a = nonZero(-15, 15);
    b = randInt(2, 15);
    c = nonZero(-15, 15);
    d = randInt(2, 15);
  } while (a * d === c * b);
  const correct = a * d < c * b ? "<" : ">";
  return {
    type: "qcm",
    chapter: "Addition, soustraction de rationnels — Comparer",
    prompt: `Compare : \\(\\dfrac{${a}}{${b}}\\) ... \\(\\dfrac{${c}}{${d}}\\)`,
    answer: correct,
    options: ["<", ">", "="],
    steps: [
      { type: "regle", text: `${b} et ${d} sont positifs : comparer \\(\\dfrac{${a}}{${b}}\\) et \\(\\dfrac{${c}}{${d}}\\) revient à comparer les produits en croix ${a} \\times ${d} et ${c} \\times ${b}.` },
      { type: "calcul", text: `${a} \\times ${d} = ${a * d}\\ \\text{et}\\ ${c} \\times ${b} = ${c * b}` },
      { type: "resultat", text: `${a * d} ${correct} ${c * b}, donc \\(\\dfrac{${a}}{${b}}\\) ${correct} \\(\\dfrac{${c}}{${d}}\\).` },
    ],
  };
}

// ---------- 4. Plus grand diviseur commun (PGCD) ----------
function genPlusGrandDiviseurCommunNumeric() {
  const g = pick([6, 7, 8, 9, 11, 12, 13, 14, 15, 17, 18]);
  const a = g * randInt(3, 9);
  const b = g * randInt(2, 8);
  const pg = pgcd(a, b);
  return {
    type: "numeric",
    chapter: "Addition, soustraction de rationnels — Rappels",
    prompt: `Quel est le plus grand diviseur commun (PGCD) à ${a} et ${b} ?`,
    answer: pg,
    steps: [
      { type: "regle", text: `On applique l'algorithme d'Euclide : on divise le plus grand nombre par le plus petit, puis on recommence avec le diviseur et le reste, jusqu'à obtenir un reste nul. Le PGCD est le dernier diviseur utilisé.` },
      ...pgcdEuclideSteps(a, b).map((text) => ({ type: "calcul", text })),
      { type: "resultat", text: `PGCD(${a}, ${b}) = ${pg}.` },
    ],
  };
}

// ---------- 5. Placer un rationnel sur une droite graduée (valeur décimale) ----------
function genPlacerFractionSurDroiteGradueeNumeric() {
  const den = pick([2, 4, 8, 16]);
  const num = nonZero(-3 * den, 3 * den);
  const answer = roundTo(num / den, 4);
  return {
    type: "numeric",
    chapter: "Addition, soustraction de rationnels — Comparer",
    prompt: `Sur une droite graduée, à quelle valeur décimale correspond le point d'abscisse \\(\\dfrac{${num}}{${den}}\\) ?`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${num} \\div ${den} = ${fr(answer)}` }],
  };
}

// ---------- 6. Ranger des nombres rationnels ----------
function genRangerRationnelsCroissantQCM() {
  const values = new Map();
  while (values.size < 4) {
    const num = nonZero(-11, 11);
    const den = randInt(2, 12);
    const dec = roundTo(num / den, 4);
    if (![...values.values()].includes(dec)) values.set(`\\dfrac{${num}}{${den}}`, dec);
  }
  const entries = [...values.entries()];
  const asc = Math.random() < 0.5;
  const sorted = [...entries].sort((x, y) => (asc ? x[1] - y[1] : y[1] - x[1]));
  const correctOrder = sorted.map((e) => e[0]).join(" ; ");
  const wrongReverse = [...sorted].reverse().map((e) => e[0]).join(" ; ");
  const wrongRandom = shuffle(entries).map((e) => e[0]).join(" ; ");
  const options = shuffle([...new Set([correctOrder, wrongReverse, wrongRandom])]);
  return {
    type: "qcm",
    chapter: "Addition, soustraction de rationnels — Comparer",
    prompt: `Range dans l'ordre ${asc ? "croissant" : "décroissant"} les nombres rationnels suivants : \\(${entries.map((e) => e[0]).join(", ")}\\)`,
    answer: correctOrder,
    options: options.length >= 2 ? options : [correctOrder, wrongRandom],
    steps: [{ type: "regle", text: `On convertit chaque écriture fractionnaire en écriture décimale pour comparer.` }],
  };
}

// ---------- 7. Une simplification abusive n'est jamais valide (rappel conceptuel) ----------
function genErreurSimplificationAdditiveQCM() {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const k = randInt(2, 9);
  return {
    type: "qcm",
    chapter: "Addition, soustraction de rationnels — Rappels",
    prompt: `Pour simplifier une fraction, peut-on supprimer un même nombre ajouté au numérateur et au dénominateur (par exemple, simplifier \\(\\dfrac{${a}+${k}}{${b}+${k}}\\) en supprimant les deux \\(${k}\\)) ?`,
    answer: "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: `On ne peut simplifier une fraction qu'en divisant le numérateur et le dénominateur par un même facteur non nul (multiplication), jamais en retirant un même terme ajouté (addition).` }],
  };
}

// =========================== Additionner, soustraire des rationnels ===========================

// ---------- 8. Additionner deux rationnels de même dénominateur ----------
function genAdditionnerRationnelsMemeDenominateurSigne() {
  const den = randInt(3, 15);
  const numA = nonZero(-20, 20);
  const numB = nonZero(-20, 20);
  const answer = numA + numB;
  return {
    type: "numeric",
    chapter: "Addition, soustraction de rationnels — Additionner, soustraire",
    prompt: `\\(\\dfrac{${numA}}{${den}} + \\dfrac{${numB}}{${den}} = \\dfrac{?}{${den}}\\) — quel est ce numérateur ?`,
    answer,
    steps: [{ type: "calcul", text: `${numA} + ${numB} = ${answer}` }],
  };
}

// ---------- 9. Soustraire deux rationnels de même dénominateur ----------
function genSoustraireRationnelsMemeDenominateurSigne() {
  const den = randInt(3, 15);
  const numA = nonZero(-20, 20);
  const numB = nonZero(-20, 20);
  const answer = numA - numB;
  return {
    type: "numeric",
    chapter: "Addition, soustraction de rationnels — Additionner, soustraire",
    prompt: `\\(\\dfrac{${numA}}{${den}} - \\dfrac{${numB}}{${den}} = \\dfrac{?}{${den}}\\) — quel est ce numérateur ?`,
    answer,
    steps: [{ type: "calcul", text: `${numA} - ${numB} = ${answer}` }],
  };
}

// ---------- 10. Additionner deux rationnels de dénominateurs différents ----------
function genAdditionnerRationnelsDenominateursDifferentsSigne() {
  let b, d;
  do {
    b = randInt(3, 12);
    d = randInt(3, 12);
  } while (b === d);
  const L = ppcm(b, d);
  const numA = nonZero(-(b - 1), b - 1);
  const numD = nonZero(-(d - 1), d - 1);
  const newNumA = numA * (L / b);
  const newNumD = numD * (L / d);
  const answer = newNumA + newNumD;
  return {
    type: "numeric",
    chapter: "Addition, soustraction de rationnels — Additionner, soustraire",
    prompt: `\\(\\dfrac{${numA}}{${b}} + \\dfrac{${numD}}{${d}} = \\dfrac{?}{${L}}\\) — quel est ce numérateur ?`,
    answer,
    steps: [
      { type: "regle", text: `Dénominateur commun : PPCM(${b}, ${d}) = ${L}.` },
      { type: "calcul", text: `\\dfrac{${numA}}{${b}} = \\dfrac{${newNumA}}{${L}}\\ \\text{et}\\ \\dfrac{${numD}}{${d}} = \\dfrac{${newNumD}}{${L}}` },
      { type: "resultat", text: `${newNumA} + ${newNumD} = ${answer}` },
    ],
  };
}

// ---------- 11. Soustraire deux rationnels de dénominateurs différents ----------
function genSoustraireRationnelsDenominateursDifferentsSigne() {
  let b, d;
  do {
    b = randInt(3, 12);
    d = randInt(3, 12);
  } while (b === d);
  const L = ppcm(b, d);
  const numA = nonZero(-(b - 1), b - 1);
  const numD = nonZero(-(d - 1), d - 1);
  const newNumA = numA * (L / b);
  const newNumD = numD * (L / d);
  const answer = newNumA - newNumD;
  return {
    type: "numeric",
    chapter: "Addition, soustraction de rationnels — Additionner, soustraire",
    prompt: `\\(\\dfrac{${numA}}{${b}} - \\dfrac{${numD}}{${d}} = \\dfrac{?}{${L}}\\) — quel est ce numérateur ?`,
    answer,
    steps: [
      { type: "regle", text: `Dénominateur commun : PPCM(${b}, ${d}) = ${L}.` },
      { type: "calcul", text: `\\dfrac{${numA}}{${b}} = \\dfrac{${newNumA}}{${L}}\\ \\text{et}\\ \\dfrac{${numD}}{${d}} = \\dfrac{${newNumD}}{${L}}` },
      { type: "resultat", text: `${newNumA} - ${newNumD} = ${answer}` },
    ],
  };
}

// ---------- 12. Chaîne de trois fractions (addition/soustraction) ----------
function genChaineTroisFractionsAdditionSoustraction() {
  const dens = [randInt(2, 6), randInt(2, 8), randInt(2, 9)];
  const L = dens.reduce((acc, d) => ppcm(acc, d), 1);
  const nums = dens.map((d) => randInt(1, d - 1));
  const ops = [pick(["+", "-"]), pick(["+", "-"])];
  const scaled = nums.map((n, i) => n * (L / dens[i]));
  let total = scaled[0];
  total = ops[0] === "+" ? total + scaled[1] : total - scaled[1];
  total = ops[1] === "+" ? total + scaled[2] : total - scaled[2];
  const promptExpr = `\\dfrac{${nums[0]}}{${dens[0]}} ${ops[0]} \\dfrac{${nums[1]}}{${dens[1]}} ${ops[1]} \\dfrac{${nums[2]}}{${dens[2]}}`;
  return {
    type: "numeric",
    chapter: "Addition, soustraction de rationnels — Additionner, soustraire",
    prompt: `\\(${promptExpr} = \\dfrac{?}{${L}}\\) — quel est ce numérateur ?`,
    answer: total,
    steps: [
      { type: "regle", text: `Dénominateur commun : ${L}.` },
      { type: "calcul", text: `\\dfrac{${nums[0]}}{${dens[0]}} = \\dfrac{${scaled[0]}}{${L}},\\ \\dfrac{${nums[1]}}{${dens[1]}} = \\dfrac{${scaled[1]}}{${L}},\\ \\dfrac{${nums[2]}}{${dens[2]}} = \\dfrac{${scaled[2]}}{${L}}` },
      { type: "resultat", text: `${scaled[0]} ${ops[0]} ${scaled[1]} ${ops[1]} ${scaled[2]} = ${total}` },
    ],
  };
}

// ---------- 13. Somme d'une fraction et d'un entier relatif ----------
function genSommeFractionEtEntierSigne() {
  const den = randInt(2, 12);
  const numFrac = nonZero(-(den - 1), den - 1);
  const entier = nonZero(-8, 8);
  const entierScaled = entier * den;
  const answer = numFrac + entierScaled;
  const opStr = entier >= 0 ? `+ ${entier}` : `- ${Math.abs(entier)}`;
  return {
    type: "numeric",
    chapter: "Addition, soustraction de rationnels — Additionner, soustraire",
    prompt: `\\(\\dfrac{${numFrac}}{${den}} ${opStr} = \\dfrac{?}{${den}}\\) — quel est ce numérateur ?`,
    answer,
    steps: [
      { type: "calcul", text: `${entier} = \\dfrac{${entierScaled}}{${den}}` },
      { type: "calcul", text: `${numFrac} ${entier >= 0 ? "+" : "-"} ${Math.abs(entierScaled)} = ${answer}` },
    ],
  };
}

// ---------- 14. Expression avec parenthèses (fractions de même dénominateur) ----------
function genExpressionParenthesesFractionsSignees() {
  const den = randInt(2, 10);
  const na = randInt(1, 3 * den);
  const nb = randInt(1, 3 * den);
  const nc = randInt(1, 3 * den);
  const answer = na - (nb - nc);
  return {
    type: "numeric",
    chapter: "Addition, soustraction de rationnels — Additionner, soustraire",
    prompt: `\\(\\dfrac{${na}}{${den}} - \\left(\\dfrac{${nb}}{${den}} - \\dfrac{${nc}}{${den}}\\right) = \\dfrac{?}{${den}}\\) — quel est ce numérateur ?`,
    answer,
    steps: [{ type: "calcul", text: `${na} - (${nb} - ${nc}) = ${na} - ${nb - nc} = ${answer}` }],
  };
}

// =========================== Problèmes ===========================

// ---------- 15. Proportion des élèves selon leur moyen de transport ----------
function genProportionEleveTransportNumeric() {
  let dens0, dens1, L, a, b, scaledA, scaledB, voitureNum, guard;
  guard = 0;
  do {
    dens0 = randInt(8, 16);
    dens1 = randInt(6, 12);
    L = ppcm(dens0, dens1);
    a = randInt(1, dens0 - 1);
    b = randInt(1, dens1 - 1);
    scaledA = a * (L / dens0);
    scaledB = b * (L / dens1);
    voitureNum = L - scaledA - scaledB;
    guard++;
  } while (voitureNum <= 0 && guard < 50);
  if (voitureNum <= 0) {
    a = 1;
    b = 1;
    dens0 = 10;
    dens1 = 8;
    L = ppcm(dens0, dens1);
    scaledA = a * (L / dens0);
    scaledB = b * (L / dens1);
    voitureNum = L - scaledA - scaledB;
  }
  const answer = roundTo(voitureNum / L, 4);
  const [moyen1, moyen2] = pick([
    ["les transports en commun", "à pied"],
    ["le bus", "à vélo"],
    ["le covoiturage", "à pied"],
  ]);
  return {
    type: "numeric",
    chapter: "Addition, soustraction de rationnels — Problèmes",
    prompt: `Dans un collège, \\(\\dfrac{${a}}{${dens0}}\\) des élèves viennent en utilisant ${moyen1}, \\(\\dfrac{${b}}{${dens1}}\\) viennent ${moyen2} et le reste vient en voiture. Quelle proportion des élèves vient en voiture ? (Donne le résultat en écriture décimale, arrondi au centième.)`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `Dénominateur commun : ${L}.` },
      { type: "calcul", text: `\\dfrac{${a}}{${dens0}} = \\dfrac{${scaledA}}{${L}}\\ \\text{et}\\ \\dfrac{${b}}{${dens1}} = \\dfrac{${scaledB}}{${L}}` },
      { type: "resultat", text: `1 - \\dfrac{${scaledA}}{${L}} - \\dfrac{${scaledB}}{${L}} = \\dfrac{${voitureNum}}{${L}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 16. Comparer deux proportions dans un contexte (choisir le produit) ----------
function genComparerDeuxProportionsChoixQCM() {
  let numA, denA, numB, denB;
  do {
    denA = randInt(10, 30);
    numA = randInt(1, denA - 1);
    denB = randInt(10, 30);
    numB = randInt(1, denB - 1);
  } while (numA * denB === numB * denA);
  const winner = numA * denB > numB * denA ? "A" : "B";
  const ingredient = pick(["noisettes", "chocolat", "fruits secs", "cacao"]);
  return {
    type: "qcm",
    chapter: "Addition, soustraction de rationnels — Problèmes",
    prompt: `Un client compare deux produits selon leur proportion de ${ingredient}. Le produit A en contient \\(\\dfrac{${numA}}{${denA}}\\) et le produit B en contient \\(\\dfrac{${numB}}{${denB}}\\). Quel produit contient la plus grande proportion de ${ingredient} ?`,
    answer: `Produit ${winner}`,
    options: ["Produit A", "Produit B"],
    steps: [
      { type: "regle", text: `Pour comparer \\(\\dfrac{${numA}}{${denA}}\\) et \\(\\dfrac{${numB}}{${denB}}\\), on compare les produits en croix ${numA} \\times ${denB} et ${numB} \\times ${denA}.` },
      { type: "calcul", text: `${numA} \\times ${denB} = ${numA * denB}\\ \\text{et}\\ ${numB} \\times ${denA} = ${numB * denA}` },
      { type: "resultat", text: `Le produit ${winner} contient la plus grande proportion de ${ingredient}.` },
    ],
  };
}

// ---------- 17. Programme de calcul avec des fractions ----------
function genProgrammeDeCalculFractionNumeric() {
  const denStart = randInt(3, 9);
  const numStart = randInt(1, denStart - 1);
  const p = randInt(1, 5);
  const q = randInt(2, 9);
  const r = randInt(1, 5);
  const s = randInt(2, 9);
  const L = [denStart, q, s].reduce((acc, d) => ppcm(acc, d), 1);
  const scaledStart = numStart * (L / denStart);
  const scaledP = p * (L / q);
  const scaledR = r * (L / s);
  const resultNum = scaledStart + scaledP - scaledR;
  const answer = roundTo(resultNum / L, 4);
  return {
    type: "numeric",
    chapter: "Addition, soustraction de rationnels — Problèmes",
    prompt: `Un programme de calcul consiste à : prendre un nombre, lui ajouter \\(\\dfrac{${p}}{${q}}\\), puis soustraire \\(\\dfrac{${r}}{${s}}\\). Quel résultat obtient-on si on choisit initialement \\(\\dfrac{${numStart}}{${denStart}}\\) ? (Donne le résultat en écriture décimale, arrondi au centième si nécessaire.)`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `Dénominateur commun : ${L}.` },
      { type: "resultat", text: `\\dfrac{${numStart}}{${denStart}} + \\dfrac{${p}}{${q}} - \\dfrac{${r}}{${s}} = \\dfrac{${resultNum}}{${L}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 18. Constructibilité d'un triangle dont les côtés sont des fractions ----------
function genConstructibiliteTriangleFractionsQCM() {
  const denA = randInt(2, 8);
  const numA = randInt(1, 3 * denA);
  const denB = randInt(2, 8);
  const numB = randInt(1, 3 * denB);
  const denC = randInt(2, 8);
  const numC = randInt(1, 3 * denC);
  const L = [denA, denB, denC].reduce((acc, d) => ppcm(acc, d), 1);
  const scaled = [numA * (L / denA), numB * (L / denB), numC * (L / denC)];
  const sorted = [...scaled].sort((x, y) => x - y);
  const constructible = sorted[2] < sorted[0] + sorted[1];
  return {
    type: "qcm",
    chapter: "Addition, soustraction de rationnels — Problèmes",
    prompt: `Peut-on construire un triangle dont les côtés mesurent \\(\\dfrac{${numA}}{${denA}}\\) cm, \\(\\dfrac{${numB}}{${denB}}\\) cm et \\(\\dfrac{${numC}}{${denC}}\\) cm ?`,
    answer: constructible ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `On met les trois longueurs au même dénominateur (${L}) : on obtient ${scaled.join(", ")}.` },
      {
        type: "regle",
        text:
          constructible
            ? `Le plus grand côté est inférieur à la somme des deux autres longueurs : le triangle est constructible.`
            : `Le plus grand côté n'est pas inférieur à la somme des deux autres longueurs : le triangle n'est pas constructible.`,
      },
    ],
  };
}

const GENERATORS = [
  genDecompositionFacteursPremiersQCM,
  genSimplifierFractionCriteresDivisibilite,
  genComparerDeuxFractionsSigneesQCM,
  genPlusGrandDiviseurCommunNumeric,
  genPlacerFractionSurDroiteGradueeNumeric,
  genRangerRationnelsCroissantQCM,
  genErreurSimplificationAdditiveQCM,
  genAdditionnerRationnelsMemeDenominateurSigne,
  genSoustraireRationnelsMemeDenominateurSigne,
  genAdditionnerRationnelsDenominateursDifferentsSigne,
  genSoustraireRationnelsDenominateursDifferentsSigne,
  genChaineTroisFractionsAdditionSoustraction,
  genSommeFractionEtEntierSigne,
  genExpressionParenthesesFractionsSignees,
  genProportionEleveTransportNumeric,
  genComparerDeuxProportionsChoixQCM,
  genProgrammeDeCalculFractionNumeric,
  genConstructibiliteTriangleFractionsQCM,
];

const DIFFICULTY = {
  genPlacerFractionSurDroiteGradueeNumeric: "facile",
  genAdditionnerRationnelsMemeDenominateurSigne: "facile",
  genSoustraireRationnelsMemeDenominateurSigne: "facile",
  genSommeFractionEtEntierSigne: "facile",
  genDecompositionFacteursPremiersQCM: "standard",
  genSimplifierFractionCriteresDivisibilite: "standard",
  genComparerDeuxFractionsSigneesQCM: "standard",
  genPlusGrandDiviseurCommunNumeric: "standard",
  genRangerRationnelsCroissantQCM: "standard",
  genAdditionnerRationnelsDenominateursDifferentsSigne: "standard",
  genSoustraireRationnelsDenominateursDifferentsSigne: "standard",
  genProgrammeDeCalculFractionNumeric: "standard",
  genErreurSimplificationAdditiveQCM: "expert",
  genChaineTroisFractionsAdditionSoustraction: "expert",
  genExpressionParenthesesFractionsSignees: "expert",
  genProportionEleveTransportNumeric: "expert",
  genComparerDeuxProportionsChoixQCM: "expert",
  genConstructibiliteTriangleFractionsQCM: "expert",
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
    id: "addition-soustraction-rationnels",
    title: "Addition et soustraction de nombres rationnels",
    description: "Rappels (nombres premiers, simplifier, comparer), additionner et soustraire des nombres rationnels positifs ou négatifs, problèmes de proportions.",
    pourquoi: "Additionner et soustraire des nombres relatifs et des fractions, c'est la base de tout calcul en physique, en budget ou en programmation : sans cette maîtrise, chaque étape suivante devient fragile.",
    level: "quatrieme",
    free: false,
    order: 3,
    cours: {
      mindMap: {
        title: "Addition et soustraction de rationnels",
        branches: [
          {
            title: "Rappels : simplifier, comparer",
            items: [
              "Pour décomposer un nombre en facteurs premiers, on le divise successivement par 2, 3, 5, 7... Exemple : \\(60 = 2^2 \\times 3 \\times 5\\).",
              "On simplifie une fraction en divisant numérateur et dénominateur par un même facteur (jamais en supprimant un terme ajouté).",
              "Pour comparer deux fractions de dénominateurs positifs, on compare les produits en croix. Exemple : pour comparer \\(\\dfrac{3}{4}\\) et \\(\\dfrac{5}{6}\\), on compare \\(3 \\times 6 = 18\\) et \\(5 \\times 4 = 20\\).",
            ],
          },
          {
            title: "Trouver un dénominateur commun",
            items: [
              "On calcule le PPCM des dénominateurs, puis on récrit chaque fraction avec ce dénominateur commun.",
              "PGCD (algorithme d'Euclide) et PPCM sont deux outils différents : le PGCD sert à simplifier, le PPCM à mettre au même dénominateur.",
            ],
            formula: "\\(\\text{PPCM}(4, 6) = 12 \\ \\text{donc} \\ \\dfrac{1}{4} = \\dfrac{3}{12} \\ \\text{et} \\ \\dfrac{1}{6} = \\dfrac{2}{12}\\)",
          },
          {
            title: "Additionner, soustraire",
            items: [
              "Même dénominateur : on additionne ou soustrait directement les numérateurs.",
              "Dénominateurs différents : on réduit au même dénominateur avant de combiner les numérateurs.",
              "Piège classique : un entier relatif s'écrit \\(n = \\dfrac{n \\times d}{d}\\) avant d'être combiné à une fraction de dénominateur d.",
            ],
            formula: "\\(\\dfrac{a}{d} + \\dfrac{b}{d} = \\dfrac{a+b}{d}\\)",
          },
          {
            title: "Problèmes de proportions",
            items: [
              "La part restante d'un tout se calcule en soustrayant les fractions connues à 1.",
              "Pour un triangle, on compare les longueurs (réduites au même dénominateur) pour vérifier que le plus grand côté est inférieur à la somme des deux autres.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
