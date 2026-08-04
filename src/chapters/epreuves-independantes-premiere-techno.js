// ---------------------------------------------------------------------------
// Chapitre : Modèle associé à une expérience aléatoire à plusieurs épreuves
// indépendantes (Première technologique)
// Programme 2026 : répétition de n ≤ 4 épreuves de Bernoulli identiques et
// indépendantes, représentées par un arbre.
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

// ---------- 1. Reconnaître une épreuve de Bernoulli ----------
function genReconnaitreBernoulliQCM() {
  const cas = pick([
    { description: "Lancer une pièce et regarder si on obtient Pile.", reponse: "C'est une épreuve de Bernoulli", explication: "C'est une épreuve de Bernoulli : il n'y a que deux issues possibles, Pile (succès) ou Face (échec)." },
    { description: "Lancer un dé à 6 faces et noter le numéro obtenu.", reponse: "Ce n'est pas une épreuve de Bernoulli", explication: "Ce n'est pas une épreuve de Bernoulli : il y a 6 issues possibles (1, 2, 3, 4, 5 ou 6), pas seulement deux." },
    { description: "Tester une pièce produite en usine : conforme ou défectueuse.", reponse: "C'est une épreuve de Bernoulli", explication: "C'est une épreuve de Bernoulli : il n'y a que deux issues possibles, conforme (succès) ou défectueuse (échec)." },
    { description: "Tirer une carte parmi 32 et noter sa couleur (il y a 4 couleurs).", reponse: "Ce n'est pas une épreuve de Bernoulli", explication: "Ce n'est pas une épreuve de Bernoulli : il y a 4 issues possibles (les 4 couleurs), pas seulement deux." },
    { description: "Interroger un client au hasard : a-t-il acheté le produit A, oui ou non ?", reponse: "C'est une épreuve de Bernoulli", explication: "C'est une épreuve de Bernoulli : il n'y a que deux issues possibles, oui (succès) ou non (échec)." },
  ]);
  return {
    type: "qcm",
    chapter: "Épreuves indépendantes (Première techno) — Bernoulli",
    prompt: `« ${cas.description} » S'agit-il d'une épreuve de Bernoulli (deux issues possibles : succès / échec) ?`,
    answer: cas.reponse,
    options: ["C'est une épreuve de Bernoulli", "Ce n'est pas une épreuve de Bernoulli"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 2. Probabilité de n succès consécutifs (n ≤ 4) ----------
function genTousSuccesNumeric() {
  const p = pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]);
  const n = randInt(2, 4);
  const answer = roundTo(p ** n, 4);
  return {
    type: "numeric",
    chapter: "Épreuves indépendantes (Première techno) — Répétition de Bernoulli",
    prompt: `On répète \\(${n}\\) fois, de façon indépendante, une épreuve de Bernoulli de probabilité de succès \\(p = ${fr(p)}\\). Calcule la probabilité d'obtenir ${n} succès consécutifs.`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: "Les épreuves étant indépendantes, la probabilité d'un chemin de l'arbre est le produit des probabilités rencontrées le long de ce chemin." },
      { type: "calcul", text: `P(${n} \\text{ succès}) = p^{${n}} = ${fr(p)}^{${n}}` },
      { type: "resultat", text: `P(${n} \\text{ succès}) = ${fr(answer)}` },
    ],
  };
}

// ---------- 3. Probabilité d'un chemin précis dans l'arbre ----------
function genCheminPrecisNumeric() {
  const p = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);
  const n = randInt(2, 4);
  const k = randInt(0, n);
  const answer = roundTo(p ** k * (1 - p) ** (n - k), 5);
  return {
    type: "numeric",
    chapter: "Épreuves indépendantes (Première techno) — Répétition de Bernoulli",
    prompt: `On répète \\(${n}\\) fois, de façon indépendante, une épreuve de Bernoulli de probabilité de succès \\(p = ${fr(p)}\\). Calcule la probabilité d'obtenir, dans cet ordre précis, ${k} succès suivis de ${n - k} échecs.`,
    answer,
    tolerance: 0.00005,
    steps: [
      { type: "regle", text: "Les épreuves étant indépendantes, la probabilité d'un chemin précis de l'arbre est le produit des probabilités rencontrées le long de ce chemin." },
      { type: "calcul", text: `P(\\text{ce chemin}) = p^{${k}} \\times (1-p)^{${n - k}} = ${fr(p)}^{${k}} \\times ${fr(roundTo(1 - p, 4))}^{${n - k}}` },
      { type: "resultat", text: `P(\\text{ce chemin}) = ${fr(answer)}` },
    ],
  };
}

// ---------- 4. Compter les chemins réalisant k succès parmi n ----------
function genNombreCheminsNumeric() {
  const n = randInt(2, 4);
  const k = randInt(0, n);
  const answer = combinaison(n, k);
  return {
    type: "numeric",
    chapter: "Épreuves indépendantes (Première techno) — Arbre pondéré",
    prompt: `Dans l'arbre représentant la répétition de \\(${n}\\) épreuves de Bernoulli indépendantes, combien de chemins réalisent exactement ${k} succès ?`,
    answer,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : le nombre de chemins de l'arbre réalisant k succès parmi n épreuves est le coefficient binomial \\binom{n}{k}." },
      { type: "resultat", text: `\\text{On compte les façons de placer } ${k} \\text{ succès parmi } ${n} \\text{ épreuves : } \\binom{${n}}{${k}} = ${answer} \\text{ chemin(s).}` },
    ],
  };
}

// ---------- 5. Probabilité d'exactement k succès sur n épreuves ----------
function genExactementKSuccesNumeric() {
  const p = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
  const n = randInt(2, 4);
  const k = randInt(0, n);
  const nbChemins = combinaison(n, k);
  const answer = roundTo(nbChemins * p ** k * (1 - p) ** (n - k), 4);
  return {
    type: "numeric",
    chapter: "Épreuves indépendantes (Première techno) — Répétition de Bernoulli",
    prompt: `On répète \\(${n}\\) fois, de façon indépendante, une épreuve de Bernoulli de probabilité de succès \\(p = ${fr(p)}\\). Calcule la probabilité d'obtenir exactement ${k} succès.`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : P(k succès) = (nombre de chemins avec k succès) × p^k × (1-p)^(n-k), où le nombre de chemins est le coefficient binomial \\binom{n}{k}." },
      { type: "calcul", text: `\\text{Nombre de chemins avec ${k} succès : } \\binom{${n}}{${k}} = ${nbChemins}` },
      { type: "calcul", text: `P(${k} \\text{ succès}) = ${nbChemins} \\times ${fr(p)}^{${k}} \\times ${fr(roundTo(1 - p, 4))}^{${n - k}}` },
      { type: "resultat", text: `P(${k} \\text{ succès}) = ${fr(answer)}` },
    ],
  };
}

// ---------- 6. Probabilité d'au moins un succès ----------
function genAuMoinsUnSuccesNumeric() {
  const p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
  const n = randInt(2, 4);
  const q = roundTo(1 - p, 4);
  const answer = roundTo(1 - q ** n, 4);
  return {
    type: "numeric",
    chapter: "Épreuves indépendantes (Première techno) — Répétition de Bernoulli",
    prompt: `On répète \\(${n}\\) fois, de façon indépendante, une épreuve de Bernoulli de probabilité de succès \\(p = ${fr(p)}\\). Calcule la probabilité d'obtenir au moins un succès.`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: "L'événement contraire de « au moins un succès » est « aucun succès ». On calcule d'abord P(aucun succès), puis P(au moins un succès) = 1 - P(aucun succès)." },
      { type: "calcul", text: `P(\\text{aucun succès}) = (1-${fr(p)})^{${n}} = ${fr(q)}^{${n}} = ${fr(roundTo(q ** n, 4))}` },
      { type: "resultat", text: `P(\\text{au moins un succès}) = 1 - ${fr(roundTo(q ** n, 4))} = ${fr(answer)}` },
    ],
  };
}

// ---------- 7. Lire un arbre à deux niveaux (n=2) et calculer une probabilité ----------
function genArbreDeuxNiveauxNumeric() {
  const p = pick([0.3, 0.4, 0.5, 0.6, 0.7]);
  const q = roundTo(1 - p, 4);
  // P(exactement un succès sur 2 répétitions) = 2 * p * q
  const answer = roundTo(2 * p * q, 4);
  return {
    type: "numeric",
    chapter: "Épreuves indépendantes (Première techno) — Arbre pondéré",
    prompt: `On répète 2 fois, de façon indépendante, une épreuve de Bernoulli de probabilité de succès \\(p = ${fr(p)}\\). En t'aidant de l'arbre (deux chemins : succès-échec et échec-succès), calcule la probabilité d'obtenir exactement un succès.`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: "Pour lire un arbre, on additionne les probabilités de tous les chemins qui réalisent l'événement recherché : ces chemins sont disjoints." },
      { type: "calcul", text: `P(\\text{S puis E}) = ${fr(p)} \\times ${fr(q)} = ${fr(roundTo(p * q, 4))}` },
      { type: "calcul", text: `P(\\text{E puis S}) = ${fr(q)} \\times ${fr(p)} = ${fr(roundTo(p * q, 4))}` },
      { type: "resultat", text: `P(\\text{exactement un succès}) = ${fr(roundTo(p * q, 4))} + ${fr(roundTo(p * q, 4))} = ${fr(answer)}` },
    ],
  };
}

const GENERATORS = [
  genReconnaitreBernoulliQCM,
  genTousSuccesNumeric,
  genCheminPrecisNumeric,
  genNombreCheminsNumeric,
  genExactementKSuccesNumeric,
  genAuMoinsUnSuccesNumeric,
  genArbreDeuxNiveauxNumeric,
];

const DIFFICULTY = {
  genReconnaitreBernoulliQCM: "facile",
  genTousSuccesNumeric: "facile",
  genNombreCheminsNumeric: "facile",
  genArbreDeuxNiveauxNumeric: "standard",
  genCheminPrecisNumeric: "standard",
  genExactementKSuccesNumeric: "expert",
  genAuMoinsUnSuccesNumeric: "expert",
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
    id: "epreuves-independantes-premiere-techno",
    title: "Épreuves indépendantes et répétition de Bernoulli",
    description: "Épreuve de Bernoulli, répétition de n ≤ 4 épreuves indépendantes, arbre pondéré, dénombrement des chemins.",
    pourquoi: "Modéliser une répétition d'épreuves indépendantes, c'est ce qui permet de calculer le risque d'un événement répété (contrôle qualité, sondage, jeu de hasard).",
    level: "premiere-techno",
    order: 7,
  },
  generate,
};
