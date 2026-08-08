// ---------------------------------------------------------------------------
// Chapitre : Nombres entiers (3e) — sous abonnement.
//
// Correspond au chapitre 1 du manuel de 3e : division euclidienne (quotient,
// reste), critères de divisibilité, nombres premiers (reconnaître, décrire),
// décomposition en produit de facteurs premiers, PGCD (plus grand commun
// diviseur) et son usage pour simplifier une fraction ou résoudre un problème
// de répartition, ainsi que quelques exercices de raisonnement (parité d'un
// programme de calcul, test d'une conjecture par un contre-exemple).
// Reprend la tâche intellectuelle des exercices du manuel (avec correction
// utilisée pour rédiger les steps), avec des nombres, prénoms et contextes
// différents à chaque génération pour éviter toute reproduction à l'identique.
// Voir automatismes-troisieme.js (thème "nombres-entiers-troisieme") pour les
// mini-exercices "Calcul mental".
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
const pronomPour = (prenom) => (prenom.endsWith("e") ? "elle" : "il");

function isPrime(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false;
  }
  return true;
}

function smallestPrimeFactor(n) {
  if (n % 2 === 0) return 2;
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return d;
  }
  return n;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
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

function coprimePair(min, max) {
  let a0, b0;
  do {
    a0 = randInt(min, max);
    b0 = randInt(min, max);
  } while (gcd(a0, b0) !== 1 || a0 === b0);
  return [a0, b0];
}

// =========================== Division euclidienne ===========================

// ---------- 1. Trouver le quotient ou le reste d'une division euclidienne ----------
function genDivisionEuclidienneNumeric() {
  const diviseur = randInt(6, 45);
  const quotient = randInt(4, 90);
  const reste = randInt(0, diviseur - 1);
  const dividende = diviseur * quotient + reste;
  const askQuotient = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Nombres entiers — Division euclidienne",
    prompt: `Effectue la division euclidienne de ${dividende} par ${diviseur}. Donne le ${askQuotient ? "quotient" : "reste"}.`,
    answer: askQuotient ? quotient : reste,
    steps: [
      { type: "calcul", text: `${dividende} = ${diviseur} \\times ${quotient} + ${reste}` },
      { type: "resultat", text: `Le quotient vaut ${quotient} et le reste vaut ${reste} (avec ${reste} < ${diviseur}).` },
    ],
  };
}

// ---------- 2. Division euclidienne dans un problème concret ----------
const objetsRepartir = ["bonbons", "billes", "cartes à collectionner", "perles", "crayons", "autocollants", "jetons"];
function genDivisionEuclidienneProblemeNumeric() {
  const diviseur = randInt(12, 35);
  const quotient = randInt(5, 60);
  const reste = randInt(1, diviseur - 1);
  const dividende = diviseur * quotient + reste;
  const objet = pick(objetsRepartir);
  const prenom = pick(prenoms);
  const pronom = pronomPour(prenom);
  const askQuotient = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Nombres entiers — Division euclidienne",
    prompt: askQuotient
      ? `${prenom} a ${dividende} ${objet} à répartir équitablement dans ${diviseur} sachets identiques. Combien de ${objet} au maximum ${pronom} peut-${pronom === "il" ? "il" : "elle"} mettre dans chaque sachet ?`
      : `${prenom} a ${dividende} ${objet} à répartir équitablement dans ${diviseur} sachets identiques, en mettant le maximum possible dans chaque sachet. Combien de ${objet} lui restera-t-il ?`,
    answer: askQuotient ? quotient : reste,
    steps: [
      { type: "calcul", text: `${dividende} = ${diviseur} \\times ${quotient} + ${reste}` },
      { type: "resultat", text: `Dans chaque sachet : ${quotient} ${objet}. Il en reste ${reste}.` },
    ],
  };
}

// ---------- 3. Vérifier si une écriture est bien une division euclidienne ----------
function genVerifierDivisionEuclidienneQCM() {
  const diviseur = randInt(6, 40);
  const quotient = randInt(3, 50);
  const trueReste = randInt(0, diviseur - 1);
  const dividende = diviseur * quotient + trueReste;
  const valid = Math.random() < 0.5;
  let qProp, rProp;
  if (valid) {
    qProp = quotient;
    rProp = trueReste;
  } else {
    const decal = randInt(1, 3);
    qProp = Math.max(0, quotient - decal);
    rProp = dividende - diviseur * qProp;
  }
  return {
    type: "qcm",
    chapter: "Nombres entiers — Division euclidienne",
    prompt: `Quelqu'un affirme que ${dividende} = ${diviseur} \\times ${qProp} + ${rProp}, avec un quotient ${qProp} et un reste ${rProp}. Est-ce bien la division euclidienne de ${dividende} par ${diviseur} ?`,
    answer: valid ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `Dans une division euclidienne, le reste doit toujours être strictement inférieur au diviseur : il faut ${rProp} < ${diviseur}.` },
      { type: "resultat", text: valid ? `C'est bien le cas ici : l'écriture est correcte.` : `Ce n'est pas le cas ici (${rProp} ≥ ${diviseur}) : ce n'est pas la division euclidienne.` },
    ],
  };
}

// =========================== Divisibilité ===========================

const criteresTexte = {
  2: "un nombre est divisible par 2 s'il est pair (son chiffre des unités est 0, 2, 4, 6 ou 8)",
  3: "un nombre est divisible par 3 si la somme de ses chiffres est un multiple de 3",
  4: "un nombre est divisible par 4 si le nombre formé par ses deux derniers chiffres est un multiple de 4",
  5: "un nombre est divisible par 5 si son chiffre des unités est 0 ou 5",
  6: "un nombre est divisible par 6 s'il est divisible à la fois par 2 et par 3",
  9: "un nombre est divisible par 9 si la somme de ses chiffres est un multiple de 9",
  10: "un nombre est divisible par 10 si son chiffre des unités est 0",
};

// ---------- 4. Tester un critère de divisibilité ----------
function genCritereDivisibiliteQCM() {
  const d = pick([2, 3, 4, 5, 6, 9, 10]);
  const divisible = Math.random() < 0.5;
  const k = randInt(15, 90);
  const r = divisible ? 0 : randInt(1, d - 1);
  const n = d * k + r;
  return {
    type: "qcm",
    chapter: "Nombres entiers — Divisibilité",
    prompt: `Le nombre ${n} est-il divisible par ${d} ?`,
    answer: divisible ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: divisible
      ? [
          { type: "regle", text: `Rappel : ${criteresTexte[d]}.` },
          { type: "resultat", text: `${n} = ${d} \\times ${k}, donc ${n} est bien divisible par ${d}.` },
        ]
      : [
          { type: "regle", text: `Rappel : ${criteresTexte[d]}.` },
          { type: "resultat", text: `${n} = ${d} \\times ${k} + ${r}, le reste n'est pas nul : ${n} n'est pas divisible par ${d}.` },
        ],
  };
}

// ---------- 5. Plus petit nombre à ajouter pour obtenir un multiple ----------
function genPlusPetitNombreAAjouterNumeric() {
  const d = pick([3, 4, 5, 6, 7, 8, 9, 11, 12]);
  const k = randInt(20, 90);
  const r = randInt(1, d - 1);
  const n = d * k + r;
  const answer = d - r;
  return {
    type: "numeric",
    chapter: "Nombres entiers — Divisibilité",
    prompt: `Quel est le plus petit nombre entier positif à ajouter à ${n} pour obtenir un multiple de ${d} ?`,
    answer,
    steps: [
      { type: "calcul", text: `${n} = ${d} \\times ${k} + ${r}` },
      { type: "resultat", text: `Il manque ${d} - ${r} = ${answer} pour atteindre le multiple suivant de ${d}.` },
    ],
  };
}

// =========================== Nombres premiers ===========================

// ---------- 6. Compter les nombres premiers dans une liste ----------
function genCompterNombresPremiersListeNumeric() {
  const n = randInt(5, 7);
  const candidats = new Set();
  while (candidats.size < n) candidats.add(randInt(20, 100));
  const liste = [...candidats];
  const premiers = liste.filter(isPrime);
  return {
    type: "numeric",
    chapter: "Nombres entiers — Nombres premiers",
    prompt: `Voici une liste de nombres : ${liste.join(" ; ")}. Combien de nombres premiers contient cette liste ?`,
    answer: premiers.length,
    steps: [{ type: "resultat", text: `On teste chaque nombre : les nombres premiers de la liste sont ${premiers.length ? premiers.join(", ") : "aucun"}.` }],
  };
}

// ---------- 7. Un nombre donné est-il premier ? ----------
function genEstPremierQCM() {
  const wantPrime = Math.random() < 0.5;
  let n;
  if (wantPrime) {
    n = pick([53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131]);
  } else {
    const p = pick([2, 3, 5, 7, 11]);
    let k = randInt(6, 15);
    n = p * k;
    while (isPrime(n)) {
      k += 1;
      n = p * k;
    }
  }
  const premier = isPrime(n);
  const facteur = premier ? null : smallestPrimeFactor(n);
  return {
    type: "qcm",
    chapter: "Nombres entiers — Nombres premiers",
    prompt: `${n} est-il un nombre premier ?`,
    answer: premier ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: premier
      ? [{ type: "regle", text: `${n} n'a aucun diviseur autre que 1 et lui-même parmi les nombres inférieurs à sa racine carrée : c'est un nombre premier.` }]
      : [{ type: "regle", text: `${n} est divisible par ${facteur} (${n} = ${facteur} \\times ${n / facteur}) : ce n'est pas un nombre premier.` }],
  };
}

// ---------- 8. Plus petit diviseur premier d'un nombre ----------
const PRIMES_SMALL = [2, 3, 5, 7, 11, 13, 17, 19, 23];
function genPlusPetitDiviseurPremierNumeric() {
  const idx = randInt(0, PRIMES_SMALL.length - 2);
  const p = PRIMES_SMALL[idx];
  const q = pick(PRIMES_SMALL.slice(idx));
  const n = p * q;
  return {
    type: "numeric",
    chapter: "Nombres entiers — Nombres premiers",
    prompt: `Quel est le plus petit diviseur premier de ${n} ?`,
    answer: p,
    steps: [{ type: "regle", text: `On teste les nombres premiers dans l'ordre (2, 3, 5, 7, ...) : le premier qui divise ${n} est ${p} (${n} = ${p} \\times ${q}).` }],
  };
}

// =========================== Décomposition en facteurs premiers ===========================

// ---------- 9. Calculer un nombre à partir de sa décomposition ----------
function genCalculerProduitFacteursPremiersNumeric() {
  const poolPrimes = [2, 3, 5, 7, 11];
  const primes = shuffle(poolPrimes).slice(0, randInt(2, 3)).sort((a, b) => a - b);
  const exps = primes.map((p) => (p <= 3 ? randInt(1, 3) : 1));
  const n = primes.reduce((acc, p, i) => acc * p ** exps[i], 1);
  const expr = primes.map((p, i) => (exps[i] === 1 ? `${p}` : `${p}^{${exps[i]}}`)).join(" \\times ");
  return {
    type: "numeric",
    chapter: "Nombres entiers — Décomposition en facteurs premiers",
    prompt: `Calcule le nombre N dont la décomposition en produit de facteurs premiers est \\(N = ${expr}\\).`,
    answer: n,
    steps: [{ type: "calcul", text: `${expr} = ${n}` }],
  };
}

// ---------- 10. Exposant d'un facteur premier dans une décomposition ----------
function genExposantDecompositionNumeric() {
  const poolPrimes = [2, 3, 5, 7, 11];
  const primes = shuffle(poolPrimes).slice(0, randInt(2, 3)).sort((a, b) => a - b);
  const exps = primes.map((p) => (p <= 3 ? randInt(1, 3) : randInt(1, 2)));
  const n = primes.reduce((acc, p, i) => acc * p ** exps[i], 1);
  const idx = randInt(0, primes.length - 1);
  const decompStr = primes.map((p, i) => (exps[i] === 1 ? `${p}` : `${p}^{${exps[i]}}`)).join(" \\times ");
  return {
    type: "numeric",
    chapter: "Nombres entiers — Décomposition en facteurs premiers",
    prompt: `Décompose ${n} en produit de facteurs premiers. Quel est l'exposant du facteur premier ${primes[idx]} dans cette décomposition ?`,
    answer: exps[idx],
    steps: [
      { type: "donnee", text: `${n} = ${decompStr}` },
      { type: "resultat", text: `L'exposant de ${primes[idx]} est ${exps[idx]}.` },
    ],
  };
}

// ---------- 11. Nombre de diviseurs à partir d'une décomposition ----------
function genNombreDeDiviseursNumeric() {
  const poolPrimes = [2, 3, 5, 7, 11];
  const primes = shuffle(poolPrimes).slice(0, randInt(2, 3)).sort((a, b) => a - b);
  const exps = primes.map(() => randInt(1, 3));
  const decompStr = primes.map((p, i) => `${p}^{${exps[i]}}`).join(" \\times ");
  const nbDiviseurs = exps.reduce((acc, e) => acc * (e + 1), 1);
  return {
    type: "numeric",
    chapter: "Nombres entiers — Décomposition en facteurs premiers",
    prompt: `Un nombre N a pour décomposition en produit de facteurs premiers \\(N = ${decompStr}\\). Combien N a-t-il de diviseurs ?`,
    answer: nbDiviseurs,
    steps: [
      { type: "regle", text: `Formule : si \\(N = ${decompStr}\\), le nombre de diviseurs est \\((${exps.map((e) => `${e}+1`).join(") \\times (")})\\).` },
      { type: "resultat", text: `${exps.map((e) => e + 1).join(" \\times ")} = ${nbDiviseurs}` },
    ],
  };
}

// =========================== PGCD et fractions ===========================

// ---------- 12. Calculer un PGCD ----------
function genPGCDNumeric() {
  const [a0, b0] = coprimePair(2, 12);
  const g = randInt(3, 15);
  const a = a0 * g;
  const b = b0 * g;
  return {
    type: "numeric",
    chapter: "Nombres entiers — PGCD",
    prompt: `Quel est le PGCD (plus grand commun diviseur) de ${a} et ${b} ?`,
    answer: g,
    steps: [
      { type: "regle", text: `On applique l'algorithme d'Euclide : on divise le plus grand nombre par le plus petit, puis on recommence avec le diviseur et le reste, jusqu'à obtenir un reste nul. Le PGCD est le dernier diviseur utilisé.` },
      ...pgcdEuclideSteps(a, b).map((text) => ({ type: "calcul", text })),
      { type: "resultat", text: `PGCD(${a} ; ${b}) = ${g}.` },
    ],
  };
}

// ---------- 13. Problème de répartition en lots identiques (PGCD) ----------
const objetsLots = [
  { a: "roses", b: "tulipes" },
  { a: "billes rouges", b: "billes bleues" },
  { a: "livres", b: "cahiers" },
  { a: "chocolats noirs", b: "chocolats au lait" },
  { a: "stickers", b: "cartes postales" },
];
function genPGCDProblemeNumeric() {
  const [a0, b0] = coprimePair(2, 9);
  const g = randInt(4, 20);
  const A = a0 * g;
  const B = b0 * g;
  const { a: objA, b: objB } = pick(objetsLots);
  const prenom = pick(prenoms);
  const pronom = pronomPour(prenom);
  const question = pick(["lots", "objA_par_lot", "objB_par_lot"]);
  let prompt, answer;
  if (question === "lots") {
    prompt = `${prenom} a ${A} ${objA} et ${B} ${objB}. ${pronom === "il" ? "Il" : "Elle"} veut former des lots identiques (même composition), en utilisant tous les objets. Quel est le nombre maximum de lots que ${pronom} peut former ?`;
    answer = g;
  } else if (question === "objA_par_lot") {
    prompt = `${prenom} a ${A} ${objA} et ${B} ${objB}. ${pronom === "il" ? "Il" : "Elle"} forme le nombre maximum de lots identiques possible, en utilisant tous les objets. Combien de ${objA} y aura-t-il dans chaque lot ?`;
    answer = a0;
  } else {
    prompt = `${prenom} a ${A} ${objA} et ${B} ${objB}. ${pronom === "il" ? "Il" : "Elle"} forme le nombre maximum de lots identiques possible, en utilisant tous les objets. Combien de ${objB} y aura-t-il dans chaque lot ?`;
    answer = b0;
  }
  return {
    type: "numeric",
    chapter: "Nombres entiers — PGCD",
    prompt,
    answer,
    steps: [
      { type: "regle", text: `Le nombre maximum de lots identiques est le PGCD des deux effectifs (calculable par divisions successives, algorithme d'Euclide).` },
      { type: "calcul", text: `PGCD(${A} ; ${B}) = ${g} : c'est le nombre maximum de lots.` },
      { type: "calcul", text: `${A} \\div ${g} = ${a0} ${objA} par lot.` },
      { type: "resultat", text: `${B} \\div ${g} = ${b0} ${objB} par lot.` },
    ],
  };
}

// ---------- 14. Carrelage : le plus grand carreau carré possible (PGCD) ----------
function genPGCDCarrelageNumeric() {
  const [a0, b0] = coprimePair(2, 12);
  const g = randInt(2, 10);
  const L = a0 * g;
  const l = b0 * g;
  const question = pick(["cote", "nombre"]);
  const nbCarreaux = a0 * b0;
  return {
    type: "numeric",
    chapter: "Nombres entiers — PGCD",
    prompt:
      question === "cote"
        ? `On veut carreler un rectangle de ${L} cm sur ${l} cm avec des carreaux carrés identiques, les plus grands possible, sans découpe. Quelle doit être la longueur du côté d'un carreau, en cm ?`
        : `On carrelle un rectangle de ${L} cm sur ${l} cm avec les plus grands carreaux carrés possibles, sans découpe. Combien de carreaux seront nécessaires ?`,
    answer: question === "cote" ? g : nbCarreaux,
    steps: [
      { type: "regle", text: `Le côté du plus grand carreau possible est le PGCD des deux dimensions (calculable par divisions successives, algorithme d'Euclide).` },
      { type: "calcul", text: `Le côté du carreau le plus grand possible est le PGCD(${L} ; ${l}) = ${g} cm.` },
      { type: "resultat", text: `Nombre de carreaux : (${L} \\div ${g}) \\times (${l} \\div ${g}) = ${a0} \\times ${b0} = ${nbCarreaux}.` },
    ],
  };
}

// ---------- 15. Simplifier une fraction (PGCD) ----------
function genSimplifierFractionDecompositionNumeric() {
  const [a0, b0] = coprimePair(2, 12);
  const g = randInt(3, 15);
  const num = a0 * g;
  const den = b0 * g;
  const askNum = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Nombres entiers — Simplifier une fraction",
    prompt: `Écris la fraction \\(\\dfrac{${num}}{${den}}\\) sous forme irréductible. Donne son ${askNum ? "numérateur" : "dénominateur"}.`,
    answer: askNum ? a0 : b0,
    steps: [
      { type: "regle", text: `On divise le numérateur et le dénominateur par leur PGCD (calculable par divisions successives, algorithme d'Euclide).` },
      { type: "calcul", text: `PGCD(${num} ; ${den}) = ${g}.` },
      { type: "resultat", text: `\\dfrac{${num}}{${den}} = \\dfrac{${a0}}{${b0}}` },
    ],
  };
}

// ---------- 16. Une fraction est-elle irréductible ? ----------
function genFractionIrreductibleQCM() {
  const [a0, b0] = coprimePair(2, 20);
  const irreductible = Math.random() < 0.5;
  const g = irreductible ? 1 : randInt(2, 6);
  const num = a0 * g;
  const den = b0 * g;
  return {
    type: "qcm",
    chapter: "Nombres entiers — Fraction irréductible",
    prompt: `La fraction \\(\\dfrac{${num}}{${den}}\\) est-elle irréductible ?`,
    answer: irreductible ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: irreductible
      ? [{ type: "resultat", text: `PGCD(${num} ; ${den}) = 1 : la fraction est déjà irréductible.` }]
      : [{ type: "resultat", text: `PGCD(${num} ; ${den}) = ${g} : on peut simplifier par ${g}, la fraction n'est pas irréductible.` }],
  };
}

// =========================== Raisonnement ===========================

// ---------- 17. Parité d'un programme de calcul (dans le cas général) ----------
function genProgrammeCalculPariteGeneraleQCM() {
  const mult = pick([2, 3, 4, 5, 6, 7]);
  const add = randInt(1, 20);
  const options = ["Toujours pair", "Toujours impair", "Cela dépend du nombre choisi"];
  let answer, steps;
  if (mult % 2 === 0) {
    answer = add % 2 === 0 ? "Toujours pair" : "Toujours impair";
    steps = [
      { type: "regle", text: `${mult} est pair, donc ${mult} \\times n est toujours pair, quel que soit l'entier n.` },
      { type: "resultat", text: `pair + ${add} est ${add % 2 === 0 ? "toujours pair" : "toujours impair"} (car ${add} est ${add % 2 === 0 ? "pair" : "impair"}).` },
    ];
  } else {
    answer = "Cela dépend du nombre choisi";
    steps = [
      { type: "regle", text: `${mult} est impair, donc ${mult} \\times n a la même parité que n.` },
      { type: "resultat", text: `Le résultat n'a donc pas toujours la même parité : cela dépend de n.` },
    ];
  }
  return {
    type: "qcm",
    chapter: "Nombres entiers — Parité",
    prompt: `Programme de calcul : choisir un nombre entier n, le multiplier par ${mult}, puis ajouter ${add}. Le résultat est-il toujours pair, toujours impair, ou cela dépend-il de n ?`,
    answer,
    options,
    steps,
  };
}

// ---------- 18. Tester une conjecture avec un contre-exemple (n² + n + k) ----------
function genConjectureNombrePremierQCM() {
  const k = pick([41, 17, 11, 5]);
  const n = pick([randInt(0, 4), k - 1]);
  const valeur = n * n + n + k;
  const premier = isPrime(valeur);
  const facteur = premier ? null : smallestPrimeFactor(valeur);
  return {
    type: "qcm",
    chapter: "Nombres entiers — Nombres premiers (conjecture)",
    prompt: `On conjecture que \\(n^2 + n + ${k}\\) est toujours un nombre premier, pour tout entier naturel n. Pour \\(n = ${n}\\), obtient-on bien un nombre premier ?`,
    answer: premier ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: premier
      ? [
          { type: "calcul", text: `${n}^2 + ${n} + ${k} = ${valeur}` },
          { type: "resultat", text: `${valeur} est un nombre premier : la conjecture n'est pas mise en défaut ici.` },
        ]
      : [
          { type: "calcul", text: `${n}^2 + ${n} + ${k} = ${valeur}` },
          { type: "resultat", text: `${valeur} = ${facteur} \\times ${valeur / facteur} : ce n'est pas un nombre premier, c'est un contre-exemple qui invalide la conjecture.` },
        ],
  };
}

const GENERATORS = [
  genDivisionEuclidienneNumeric,
  genDivisionEuclidienneProblemeNumeric,
  genVerifierDivisionEuclidienneQCM,
  genCritereDivisibiliteQCM,
  genPlusPetitNombreAAjouterNumeric,
  genCompterNombresPremiersListeNumeric,
  genEstPremierQCM,
  genPlusPetitDiviseurPremierNumeric,
  genCalculerProduitFacteursPremiersNumeric,
  genExposantDecompositionNumeric,
  genNombreDeDiviseursNumeric,
  genPGCDNumeric,
  genPGCDProblemeNumeric,
  genPGCDCarrelageNumeric,
  genSimplifierFractionDecompositionNumeric,
  genFractionIrreductibleQCM,
  genProgrammeCalculPariteGeneraleQCM,
  genConjectureNombrePremierQCM,
];

const DIFFICULTY = {
  genDivisionEuclidienneNumeric: "facile",
  genVerifierDivisionEuclidienneQCM: "facile",
  genCritereDivisibiliteQCM: "facile",
  genCompterNombresPremiersListeNumeric: "facile",
  genEstPremierQCM: "facile",
  genPGCDNumeric: "facile",
  genFractionIrreductibleQCM: "facile",
  genPlusPetitNombreAAjouterNumeric: "standard",
  genPlusPetitDiviseurPremierNumeric: "standard",
  genCalculerProduitFacteursPremiersNumeric: "standard",
  genExposantDecompositionNumeric: "standard",
  genSimplifierFractionDecompositionNumeric: "standard",
  genConjectureNombrePremierQCM: "standard",
  genDivisionEuclidienneProblemeNumeric: "expert",
  genNombreDeDiviseursNumeric: "expert",
  genPGCDProblemeNumeric: "expert",
  genPGCDCarrelageNumeric: "expert",
  genProgrammeCalculPariteGeneraleQCM: "expert",
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
    id: "nombres-entiers-troisieme",
    title: "Nombres entiers",
    description: "Division euclidienne, critères de divisibilité, nombres premiers, décomposition en produit de facteurs premiers, PGCD et simplification de fractions.",
    pourquoi: "La division euclidienne et les nombres premiers sont à la base de la cryptographie qui protège aujourd'hui nos données bancaires en ligne.",
    level: "troisieme",
    free: false,
    order: 2,
    cours: {
      mindMap: {
        title: "Nombres entiers",
        branches: [
          {
            title: "Division euclidienne",
            items: [
              "Le reste est toujours strictement inférieur au diviseur.",
              "On vérifie une division euclidienne en recalculant : dividende = diviseur × quotient + reste.",
            ],
            formula: "\\(a = b \\times q + r\\ \\text{avec}\\ 0 \\leqslant r < b\\)",
          },
          {
            title: "Divisibilité, nombres premiers",
            items: [
              "Un nombre premier n'a que deux diviseurs : 1 et lui-même.",
              "Pour tester si un nombre est premier, on cherche un diviseur parmi les nombres premiers inférieurs à sa racine carrée.",
            ],
          },
          {
            title: "Décomposition en facteurs premiers",
            items: [
              "Tout entier supérieur à 1 se décompose de façon unique en produit de nombres premiers.",
              "On divise successivement par 2, 3, 5, 7... jusqu'à obtenir 1.",
            ],
          },
          {
            title: "PGCD",
            items: [
              "Le PGCD (plus grand commun diviseur) se calcule par l'algorithme d'Euclide (divisions successives).",
              "Il sert à simplifier une fraction jusqu'à sa forme irréductible, ou à répartir des objets en lots identiques.",
              "Piège classique : une fraction est irréductible seulement quand le PGCD du numérateur et du dénominateur vaut 1.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
