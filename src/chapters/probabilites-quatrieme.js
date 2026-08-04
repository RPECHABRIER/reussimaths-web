// ---------------------------------------------------------------------------
// Chapitre : Probabilités (4e) — sous abonnement.
//
// Correspond au chapitre 8 du sommaire officiel : calculer une probabilité
// dans une situation d'équiprobabilité, reconnaître une situation
// d'équiprobabilité, événements certains/impossibles/élémentaires,
// événement contraire, vérifier qu'une répartition de probabilités est
// valide. Reprend la tâche intellectuelle des exercices fournis, avec des
// nombres, prénoms et contextes différents à chaque génération. Voir
// automatismes-quatrieme.js pour le thème "Calcul mental" associé.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const roundTo = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const fr = (n) => String(n).replace(".", ",");

// =========================== Calculer une probabilité ===========================

// ---------- 1. Probabilité dans une situation d'équiprobabilité ----------
function genProbabiliteEquiprobableNumeric() {
  const total = randInt(4, 20);
  const favorables = randInt(1, total - 1);
  const answer = roundTo(favorables / total, 4);
  return {
    type: "numeric",
    chapter: "Probabilités — Calculer",
    prompt: `Une expérience aléatoire comporte ${total} issues équiprobables. Un événement A est réalisé par ${favorables} de ces issues. Quelle est la probabilité de l'événement A (écriture décimale, arrondie au centième) ?`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `P(A) = \\dfrac{${favorables}}{${total}} \\approx ${fr(answer)}` }],
  };
}

// ---------- 2. Nombre d'issues favorables à partir d'une probabilité ----------
function genNombreIssuesFavorablesDepuisProbabiliteNumeric() {
  const total = pick([10, 20, 25, 40, 50, 80, 100, 200]);
  const favorables = randInt(1, total - 1);
  const proba = roundTo(favorables / total, 4);
  return {
    type: "numeric",
    chapter: "Probabilités — Calculer",
    prompt: `Une expérience comporte ${total} issues équiprobables. La probabilité d'un événement A est de ${fr(proba)}. Combien d'issues favorables réalisent l'événement A ?`,
    answer: favorables,
    steps: [{ type: "calcul", text: `${fr(proba)} \\times ${total} = ${favorables}` }],
  };
}

// ---------- 3. Probabilité à partir d'effectifs (contexte urne) ----------
function genProbabiliteDepuisEffectifsNumeric() {
  const couleurs = ["vertes", "rouges", "bleues", "jaunes", "noires"];
  const nCouleurs = randInt(3, 4);
  const chosenCouleurs = shuffle(couleurs).slice(0, nCouleurs);
  const effectifs = chosenCouleurs.map(() => randInt(2, 15));
  const total = effectifs.reduce((a, b) => a + b, 0);
  const idx = randInt(0, nCouleurs - 1);
  const answer = roundTo(effectifs[idx] / total, 4);
  return {
    type: "numeric",
    chapter: "Probabilités — Calculer",
    prompt: `Une urne contient ${chosenCouleurs.map((c, i) => `${effectifs[i]} boules ${c}`).join(", ")}, toutes indiscernables au toucher. On pioche une boule au hasard. Quelle est la probabilité d'obtenir une boule ${chosenCouleurs[idx]} (arrondie au centième) ?`,
    answer,
    tolerance: 0.01,
    steps: [
      { type: "calcul", text: `\\text{Total de boules} = ${effectifs.join(" + ")} = ${total}` },
      { type: "resultat", text: `P = \\dfrac{${effectifs[idx]}}{${total}} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 4. Un nombre peut-il correspondre à une probabilité ? ----------
function genPeutEtreProbabiliteQCM() {
  const candidates = [
    { valid: true, display: "0,57" },
    { valid: false, display: "1,2" },
    { valid: false, display: "-0,25" },
    { valid: true, display: "0,33" },
    { valid: true, display: "0" },
    { valid: true, display: "1" },
    { valid: false, display: "15" },
    { valid: false, display: "200 %" },
    { valid: true, display: "15 %" },
    { valid: true, display: "0,2 %" },
  ];
  const item = pick(candidates);
  return {
    type: "qcm",
    chapter: "Probabilités — Calculer",
    prompt: `Le nombre ${item.display} peut-il correspondre à une probabilité ?`,
    answer: item.valid ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: `Une probabilité est toujours comprise entre 0 et 1 (soit entre 0 % et 100 %).` }],
  };
}

// ---------- 5. Probabilité de la réunion de deux événements incompatibles ----------
function genProbabiliteDeuxEvenementsReunisNumeric() {
  const total = randInt(10, 30);
  const favA = randInt(1, Math.floor(total / 3));
  const favB = randInt(1, Math.floor(total / 3));
  const answer = roundTo((favA + favB) / total, 4);
  return {
    type: "numeric",
    chapter: "Probabilités — Calculer",
    prompt: `Une expérience comporte ${total} issues équiprobables. L'événement A est réalisé par ${favA} issues et l'événement B (incompatible avec A) par ${favB} issues. Quelle est la probabilité que A ou B se réalise (arrondie au centième) ?`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `P(A \\text{ ou } B) = \\dfrac{${favA} + ${favB}}{${total}} \\approx ${fr(answer)}` }],
  };
}

// ---------- 6. Convertir une probabilité en pourcentage (ou l'inverse) ----------
function genProbabiliteEnPourcentageNumeric() {
  const asDecimalToPercent = Math.random() < 0.5;
  if (asDecimalToPercent) {
    const p = roundTo(Math.random() * 0.9 + 0.05, 2);
    const answer = roundTo(p * 100, 2);
    return {
      type: "numeric",
      chapter: "Probabilités — Calculer",
      prompt: `On a \\(P(A) = ${fr(p)}\\). Exprime cette probabilité sous forme de pourcentage.`,
      answer,
      tolerance: 0.1,
      steps: [{ type: "calcul", text: `${fr(p)} \\times 100 = ${fr(answer)}\\%` }],
    };
  }
  const pct = randInt(1, 99);
  const answer = roundTo(pct / 100, 4);
  return {
    type: "numeric",
    chapter: "Probabilités — Calculer",
    prompt: `On a \\(P(A) = ${pct}\\%\\). Exprime cette probabilité en écriture décimale.`,
    answer,
    tolerance: 0.001,
    steps: [{ type: "calcul", text: `${pct} \\div 100 = ${fr(answer)}` }],
  };
}

// =========================== Équiprobabilité ===========================

// ---------- 7. Une situation est-elle équiprobable ? ----------
function genEstEquiprobableQCM() {
  const contexts = [
    { desc: "On lance une pièce de monnaie équilibrée et on regarde la face obtenue.", equi: true },
    { desc: "On lance un dé équilibré à six faces et on regarde le nombre obtenu.", equi: true },
    {
      desc: "Dans une urne il y a 3 boules rouges et 7 boules vertes, indiscernables au toucher, et on pioche une boule au hasard en regardant sa couleur.",
      equi: false,
    },
    { desc: "On choisit une carte au hasard dans un jeu de 32 cartes et on regarde sa couleur (pique, cœur, carreau, trèfle) — chaque couleur compte 8 cartes.", equi: true },
    { desc: "On lance un dé truqué à six faces dont les probabilités ne sont pas toutes égales, et on regarde le nombre obtenu.", equi: false },
    { desc: "Une roue est divisée en 4 secteurs de tailles différentes, et on regarde le secteur sur lequel elle s'arrête.", equi: false },
    { desc: "On tire au hasard un papier parmi huit papiers portant chacun une lettre différente, et on regarde la lettre obtenue.", equi: true },
  ];
  const ctx = pick(contexts);
  return {
    type: "qcm",
    chapter: "Probabilités — Équiprobabilité",
    prompt: `${ctx.desc} S'agit-il d'une situation d'équiprobabilité ?`,
    answer: ctx.equi ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      {
        type: "regle",
        text: ctx.equi
          ? "Chaque issue a la même probabilité de se réaliser : c'est une situation d'équiprobabilité."
          : "Les issues n'ont pas toutes la même probabilité de se réaliser : ce n'est pas une situation d'équiprobabilité.",
      },
    ],
  };
}

// =========================== Événements certains, impossibles, contraires ===========================

// ---------- 8. Reconnaître le type d'un événement ----------
function genTypeEvenementQCM() {
  const items = [
    { desc: "On lance un dé à 6 faces. Événement : « Obtenir un nombre entre 1 et 6. »", type: "Certain" },
    { desc: "On lance un dé à 6 faces. Événement : « Obtenir 7. »", type: "Impossible" },
    { desc: "On lance un dé à 6 faces. Événement : « Obtenir 4. »", type: "Élémentaire" },
    { desc: "On lance un dé à 6 faces. Événement : « Obtenir un nombre pair. »", type: "Non élémentaire" },
    { desc: "On tire une carte dans un jeu de 32 cartes. Événement : « Obtenir une carte du jeu. »", type: "Certain" },
    { desc: "On tire une carte dans un jeu de 32 cartes. Événement : « Obtenir un joker. »", type: "Impossible" },
    { desc: "On tire une boule dans une urne de boules numérotées de 1 à 10. Événement : « Obtenir le numéro 5. »", type: "Élémentaire" },
  ];
  const item = pick(items);
  return {
    type: "qcm",
    chapter: "Probabilités — Vocabulaire",
    prompt: `${item.desc} Quel est le type de cet événement ?`,
    answer: item.type,
    options: ["Certain", "Impossible", "Élémentaire", "Non élémentaire"],
    steps: [{ type: "regle", text: `Cet événement est ${item.type.toLowerCase()}.` }],
  };
}

// ---------- 9. Probabilité de l'événement contraire ----------
function genProbabiliteEvenementContraireNumeric() {
  const pA = roundTo(Math.random() * 0.9 + 0.05, 2);
  const answer = roundTo(1 - pA, 2);
  return {
    type: "numeric",
    chapter: "Probabilités — Événement contraire",
    prompt: `On a \\(P(A) = ${fr(pA)}\\). Quelle est la probabilité de l'événement contraire \\(\\overline{A}\\) ?`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `P(\\overline{A}) = 1 - P(A) = 1 - ${fr(pA)} = ${fr(answer)}` }],
  };
}

// ---------- 10. Quel est l'événement contraire ? ----------
function genEvenementContraireDescriptionQCM() {
  const items = [
    { evt: "Obtenir un nombre pair", contraire: "Obtenir un nombre impair" },
    { evt: "Obtenir une carte rouge", contraire: "Obtenir une carte noire" },
    { evt: "Avoir au moins un défaut", contraire: "N'avoir aucun défaut" },
    { evt: "Obtenir un nombre supérieur ou égal à 3", contraire: "Obtenir un nombre strictement inférieur à 3" },
    { evt: "Obtenir une voyelle", contraire: "Obtenir une consonne" },
  ];
  const item = pick(items);
  const distractors = shuffle(items.filter((i) => i.contraire !== item.contraire)).slice(0, 3).map((i) => i.contraire);
  const options = shuffle([item.contraire, ...distractors]);
  return {
    type: "qcm",
    chapter: "Probabilités — Événement contraire",
    prompt: `Quel est l'événement contraire de « ${item.evt} » ?`,
    answer: item.contraire,
    options,
    steps: [{ type: "regle", text: `L'événement contraire de « ${item.evt} » est « ${item.contraire} ».` }],
  };
}

// =========================== Vérifier une répartition de probabilités ===========================

// ---------- 11. La somme des probabilités vaut-elle 1 ? ----------
function genSommeProbabilitesVerificationQCM() {
  const n = randInt(3, 5);
  const isValid = Math.random() < 0.5;
  const probs = [];
  if (isValid) {
    let remaining = 1;
    for (let i = 0; i < n - 1; i++) {
      const p = roundTo(Math.random() * remaining * 0.6, 2);
      probs.push(p);
      remaining = roundTo(remaining - p, 4);
    }
    probs.push(roundTo(remaining, 2));
  } else {
    for (let i = 0; i < n; i++) probs.push(roundTo(Math.random() * 0.4 + 0.05, 2));
  }
  const sum = roundTo(probs.reduce((a, b) => a + b, 0), 2);
  const reallyValid = Math.abs(sum - 1) < 0.005;
  return {
    type: "qcm",
    chapter: "Probabilités — Vérifier",
    prompt: `Voici les probabilités des issues d'une expérience aléatoire : ${probs.map((p) => fr(p)).join(", ")}. Cette répartition est-elle possible (la somme des probabilités doit valoir 1) ?`,
    answer: reallyValid ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `${probs.map((p) => fr(p)).join(" + ")} = ${fr(sum)}` },
      {
        type: "resultat",
        text: reallyValid ? "La somme vaut 1 : la répartition est possible." : "La somme ne vaut pas 1 : la répartition n'est pas possible.",
      },
    ],
  };
}

// ---------- 12. Compléter un tableau de probabilités ----------
function genCompleterTableauProbabiliteNumeric() {
  const n = randInt(3, 4);
  const probs = [];
  let remaining = 1;
  for (let i = 0; i < n - 1; i++) {
    const p = roundTo(Math.random() * remaining * 0.5, 2);
    probs.push(p);
    remaining = roundTo(remaining - p, 4);
  }
  const manquant = roundTo(remaining, 2);
  const issues = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
  return {
    type: "numeric",
    chapter: "Probabilités — Vérifier",
    prompt: `Voici un tableau de probabilités : ${issues.slice(0, n - 1).map((iss, i) => `${iss} : ${fr(probs[i])}`).join(", ")}, ${issues[n - 1]} : ?. Sachant que la somme des probabilités vaut 1, quelle est la probabilité manquante ?`,
    answer: manquant,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `1 - (${probs.map((p) => fr(p)).join(" + ")}) = ${fr(manquant)}` }],
  };
}

// =========================== Problèmes ===========================

// ---------- 13. Probabilité en contexte (sous-groupe d'une population) ----------
function genComparerDeuxGroupesProbabiliteNumeric() {
  const totalFilles4e = randInt(50, 150);
  const totalFilles = totalFilles4e + randInt(100, 300);
  const askParmiFilles = Math.random() < 0.5;
  let denom;
  let contexte;
  if (askParmiFilles) {
    denom = totalFilles;
    contexte = `parmi les ${totalFilles} filles du collège`;
  } else {
    const totalCollege = totalFilles + randInt(200, 400);
    denom = totalCollege;
    contexte = `parmi les ${totalCollege} élèves du collège`;
  }
  const answer = roundTo(totalFilles4e / denom, 4);
  return {
    type: "numeric",
    chapter: "Probabilités — Problèmes",
    prompt: `Dans un collège, il y a ${totalFilles4e} filles scolarisées en classe de 4e. On choisit au hasard un élève ${contexte}. Quelle est la probabilité que ce soit une fille de 4e (arrondie au centième) ?`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `\\dfrac{${totalFilles4e}}{${denom}} \\approx ${fr(answer)}` }],
  };
}

const GENERATORS = [
  genProbabiliteEquiprobableNumeric,
  genNombreIssuesFavorablesDepuisProbabiliteNumeric,
  genProbabiliteDepuisEffectifsNumeric,
  genPeutEtreProbabiliteQCM,
  genProbabiliteDeuxEvenementsReunisNumeric,
  genProbabiliteEnPourcentageNumeric,
  genEstEquiprobableQCM,
  genTypeEvenementQCM,
  genProbabiliteEvenementContraireNumeric,
  genEvenementContraireDescriptionQCM,
  genSommeProbabilitesVerificationQCM,
  genCompleterTableauProbabiliteNumeric,
  genComparerDeuxGroupesProbabiliteNumeric,
];

const DIFFICULTY = {
  genProbabiliteEquiprobableNumeric: "facile",
  genProbabiliteDepuisEffectifsNumeric: "facile",
  genPeutEtreProbabiliteQCM: "facile",
  genProbabiliteEnPourcentageNumeric: "facile",
  genTypeEvenementQCM: "facile",
  genEvenementContraireDescriptionQCM: "facile",
  genNombreIssuesFavorablesDepuisProbabiliteNumeric: "standard",
  genProbabiliteDeuxEvenementsReunisNumeric: "standard",
  genEstEquiprobableQCM: "standard",
  genProbabiliteEvenementContraireNumeric: "standard",
  genSommeProbabilitesVerificationQCM: "standard",
  genCompleterTableauProbabiliteNumeric: "standard",
  genComparerDeuxGroupesProbabiliteNumeric: "expert",
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
    id: "probabilites-quatrieme",
    title: "Probabilités",
    description: "Calculer une probabilité, reconnaître une situation d'équiprobabilité, événements certains, impossibles et contraires, vérifier une répartition de probabilités.",
    pourquoi: "Calculer une probabilité, c'est estimer le risque ou la chance qu'un évènement se produise — utile pour un jeu, une météo, une décision.",
    level: "quatrieme",
    free: false,
    order: 9,
  },
  generate,
};
