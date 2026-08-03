// ---------------------------------------------------------------------------
// Chapitre : Variables aléatoires discrètes finies et loi binomiale
// (Terminale technologique / STMG)
// Programme 2026 : espérance d'une variable aléatoire discrète ; loi
// binomiale B(n,p) et son espérance ; coefficients binomiaux (n choose k) et
// triangle de Pascal. Capacités : calculer l'espérance, calculer des
// coefficients binomiaux via le triangle de Pascal pour n ⩽ 10, reconnaître
// une situation de loi binomiale et identifier (n,p), interpréter {X=k} sur
// un arbre, calculer P(X=0)/P(X=1)/P(X=n)/P(X=n-1) et des unions, calculer
// P(X=k) via les coefficients binomiaux.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const roundTo = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const fr = (n) => String(n).replace(".", ",");
const combinaison = (n, k) => {
  if (k < 0 || k > n) return 0;
  let res = 1;
  for (let i = 0; i < k; i++) res = (res * (n - i)) / (i + 1);
  return Math.round(res);
};

// ---------- 1. Coefficient binomial via le triangle de Pascal (n ⩽ 10) ----------
function genCoefficientBinomialNumeric() {
  const n = randInt(2, 10);
  const k = randInt(0, n);
  const answer = combinaison(n, k);
  return {
    type: "numeric",
    chapter: "Variables aléatoires (Terminale techno) — Triangle de Pascal",
    prompt: `Calcule le coefficient binomial \\(\\dbinom{${n}}{${k}}\\) (à l'aide du triangle de Pascal).`,
    answer,
    steps: [`\\dbinom{${n}}{${k}} = ${answer}`],
  };
}

// ---------- 2. Reconnaître une situation de loi binomiale et identifier (n, p) ----------
function genReconnaitreEtIdentifierBinomialeNumeric() {
  const n = randInt(4, 12);
  const p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
  const demandeN = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Variables aléatoires (Terminale techno) — Loi binomiale",
    prompt: `On répète ${n} fois, de façon indépendante, un même tirage avec remise dans une urne où la probabilité de succès est ${fr(p)}. X est le nombre de succès : X suit une loi binomiale \\(\\mathcal{B}(n\\,;\\,p)\\). Donne la valeur de ${demandeN ? "n" : "p"}.`,
    answer: demandeN ? n : p,
    tolerance: demandeN ? undefined : 0.0005,
    steps: [`X \\sim \\mathcal{B}(${n}\\,;\\,${fr(p)})`, `${demandeN ? "n" : "p"} = ${demandeN ? n : fr(p)}`],
  };
}

// ---------- 3. Calculer P(X=k) via les coefficients binomiaux ----------
function genCalculerPXEgalKNumeric() {
  const n = randInt(3, 8);
  const p = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
  const k = randInt(0, n);
  const nbChemins = combinaison(n, k);
  const answer = roundTo(nbChemins * p ** k * (1 - p) ** (n - k), 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires (Terminale techno) — Loi binomiale",
    prompt: `\\(X \\sim \\mathcal{B}(${n}\\,;\\,${fr(p)})\\). Calcule \\(P(X=${k})\\) (arrondi à 0,0001 près), à l'aide de la formule \\(P(X=k) = \\dbinom{n}{k}p^k(1-p)^{n-k}\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      `\\dbinom{${n}}{${k}} = ${nbChemins}`,
      `P(X=${k}) = ${nbChemins} \\times ${fr(p)}^{${k}} \\times ${fr(roundTo(1 - p, 4))}^{${n - k}} \\approx ${fr(answer)}`,
    ],
  };
}

// ---------- 4. Cas particuliers : P(X=0) et P(X=n) ----------
function genCasParticuliersNumeric() {
  const n = randInt(3, 8);
  const p = pick([0.2, 0.25, 0.3, 0.4, 0.5]);
  const cas = pick(["0", "n"]);
  const k = cas === "0" ? 0 : n;
  const answer = cas === "0" ? roundTo((1 - p) ** n, 5) : roundTo(p ** n, 5);
  return {
    type: "numeric",
    chapter: "Variables aléatoires (Terminale techno) — Loi binomiale",
    prompt: `\\(X \\sim \\mathcal{B}(${n}\\,;\\,${fr(p)})\\). Calcule \\(P(X=${k})\\) (cas particulier, arrondi à 0,00001 près).`,
    answer,
    tolerance: 0.00005,
    steps: cas === "0" ? [`P(X=0) = (1-p)^n = ${fr(roundTo(1 - p, 4))}^{${n}} \\approx ${fr(answer)}`] : [`P(X=n) = p^n = ${fr(p)}^{${n}} \\approx ${fr(answer)}`],
  };
}

// ---------- 5. Calculer P(X=n-1) ----------
function genPXEgalNMoins1Numeric() {
  const n = randInt(3, 8);
  const p = pick([0.2, 0.25, 0.3, 0.4, 0.5]);
  const nbChemins = combinaison(n, n - 1);
  const answer = roundTo(nbChemins * p ** (n - 1) * (1 - p) ** 1, 5);
  return {
    type: "numeric",
    chapter: "Variables aléatoires (Terminale techno) — Loi binomiale",
    prompt: `\\(X \\sim \\mathcal{B}(${n}\\,;\\,${fr(p)})\\). Calcule \\(P(X=${n - 1})\\) (arrondi à 0,00001 près).`,
    answer,
    tolerance: 0.00005,
    steps: [`\\dbinom{${n}}{${n - 1}} = ${nbChemins}`, `P(X=${n - 1}) = ${nbChemins} \\times ${fr(p)}^{${n - 1}} \\times ${fr(roundTo(1 - p, 4))} \\approx ${fr(answer)}`],
  };
}

// ---------- 6. Union d'évènements : P(X ⩽ 1) = P(X=0) + P(X=1) ----------
function genUnionPXInferieurNumeric() {
  const n = randInt(3, 6);
  const p = pick([0.1, 0.15, 0.2, 0.25]);
  const p0 = roundTo((1 - p) ** n, 5);
  const p1 = roundTo(n * p * (1 - p) ** (n - 1), 5);
  const answer = roundTo(p0 + p1, 5);
  return {
    type: "numeric",
    chapter: "Variables aléatoires (Terminale techno) — Loi binomiale",
    prompt: `\\(X \\sim \\mathcal{B}(${n}\\,;\\,${fr(p)})\\). Calcule \\(P(X \\leqslant 1) = P(X=0) + P(X=1)\\) (arrondi à 0,00001 près).`,
    answer,
    tolerance: 0.0001,
    steps: [`P(X=0) \\approx ${fr(p0)}`, `P(X=1) \\approx ${fr(p1)}`, `P(X\\leqslant 1) \\approx ${fr(p0)} + ${fr(p1)} = ${fr(answer)}`],
  };
}

// ---------- 7. Espérance d'une loi binomiale E(X) = np ----------
function genEsperanceBinomialeNumeric() {
  const n = randInt(4, 20);
  const p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75]);
  const answer = roundTo(n * p, 3);
  return {
    type: "numeric",
    chapter: "Variables aléatoires (Terminale techno) — Espérance de la loi binomiale",
    prompt: `\\(X \\sim \\mathcal{B}(${n}\\,;\\,${fr(p)})\\). Calcule l'espérance \\(E(X)\\) (formule \\(E(X) = np\\)).`,
    answer,
    tolerance: 0.005,
    steps: [`E(X) = n\\times p = ${n} \\times ${fr(p)} = ${fr(answer)}`],
  };
}

// ---------- 8. Espérance d'une variable aléatoire discrète quelconque ----------
function genEsperanceDiscreteNumeric() {
  const valeurs = [0, 1, 2, 3];
  const p0 = pick([0.1, 0.15, 0.2]);
  const p1 = pick([0.2, 0.25, 0.3]);
  const p2 = pick([0.2, 0.25]);
  const p3 = roundTo(1 - p0 - p1 - p2, 4);
  const answer = roundTo(valeurs[1] * p1 + valeurs[2] * p2 + valeurs[3] * p3, 4);
  return {
    type: "numeric",
    chapter: "Variables aléatoires (Terminale techno) — Espérance",
    prompt: `Une variable aléatoire X prend les valeurs 0, 1, 2, 3 avec \\(P(X=0)=${fr(p0)}\\), \\(P(X=1)=${fr(p1)}\\), \\(P(X=2)=${fr(p2)}\\), \\(P(X=3)=${fr(p3)}\\). Calcule \\(E(X)\\) (arrondi au centième).`,
    answer: roundTo(answer, 2),
    tolerance: 0.01,
    steps: [`E(X) = 0\\times${fr(p0)} + 1\\times${fr(p1)} + 2\\times${fr(p2)} + 3\\times${fr(p3)} = ${fr(roundTo(answer, 2))}`],
  };
}

// ---------- 9. Interpréter {X=k} sur un arbre ----------
function genInterpreterXEgalKQCM() {
  const n = randInt(3, 6);
  const k = randInt(0, n);
  return {
    type: "qcm",
    chapter: "Variables aléatoires (Terminale techno) — Interprétation",
    prompt: `Dans l'arbre représentant la répétition de ${n} épreuves de Bernoulli, que représente l'évènement \\(\\{X=${k}\\}\\) ?`,
    answer: `L'ensemble des chemins de l'arbre comportant exactement ${k} succès`,
    options: [`L'ensemble des chemins de l'arbre comportant exactement ${k} succès`, `Un seul chemin précis de l'arbre`, `L'ensemble des chemins comportant au moins ${k} succès`],
    steps: [`\\{X=${k}\\} \\text{ regroupe TOUS les chemins de l'arbre où l'on obtient exactement } ${k} \\text{ succès (il peut y en avoir plusieurs).}`],
  };
}

// ---------- 10. Reconnaître (ou non) une situation de loi binomiale ----------
function genReconnaitreBinomialeQCM() {
  const cas = pick([
    { description: "On tire une carte, on note sa couleur, puis on la remet dans le jeu ; on répète cela 8 fois de façon indépendante.", reponse: "Loi binomiale" },
    { description: "On tire successivement 5 cartes d'un jeu de 32, sans remise.", reponse: "Pas une loi binomiale" },
    { description: "On interroge 15 personnes sur un sondage oui/non, chaque réponse étant indépendante des autres.", reponse: "Loi binomiale" },
  ]);
  return {
    type: "qcm",
    chapter: "Variables aléatoires (Terminale techno) — Reconnaître la loi binomiale",
    prompt: `« ${cas.description} » S'agit-il d'une situation de loi binomiale ?`,
    answer: cas.reponse,
    options: ["Loi binomiale", "Pas une loi binomiale"],
    steps: [cas.reponse],
  };
}

const GENERATORS = [
  genCoefficientBinomialNumeric,
  genReconnaitreEtIdentifierBinomialeNumeric,
  genCalculerPXEgalKNumeric,
  genCasParticuliersNumeric,
  genPXEgalNMoins1Numeric,
  genUnionPXInferieurNumeric,
  genEsperanceBinomialeNumeric,
  genEsperanceDiscreteNumeric,
  genInterpreterXEgalKQCM,
  genReconnaitreBinomialeQCM,
];

const DIFFICULTY = {
  genCoefficientBinomialNumeric: "facile",
  genReconnaitreBinomialeQCM: "facile",
  genInterpreterXEgalKQCM: "facile",
  genEsperanceBinomialeNumeric: "facile",
  genReconnaitreEtIdentifierBinomialeNumeric: "standard",
  genEsperanceDiscreteNumeric: "standard",
  genCasParticuliersNumeric: "standard",
  genCalculerPXEgalKNumeric: "expert",
  genPXEgalNMoins1Numeric: "expert",
  genUnionPXInferieurNumeric: "expert",
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
    id: "variables-aleatoires-terminale-techno",
    title: "Variables aléatoires et loi binomiale",
    description: "Espérance d'une variable aléatoire discrète, loi binomiale B(n,p), coefficients binomiaux et triangle de Pascal.",
    level: "terminale-techno",
    order: 8,
  },
  generate,
};
