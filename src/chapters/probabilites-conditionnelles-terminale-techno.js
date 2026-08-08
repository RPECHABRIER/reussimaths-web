// ---------------------------------------------------------------------------
// Chapitre : Probabilités conditionnelles (Terminale technologique / STMG)
// Programme 2026 : formule des probabilités totales pour une partition de
// l'univers (plus de deux évènements qu'en Première). Capacités : construire
// un arbre, interpréter les pondérations, utiliser un arbre pour calculer
// des probabilités, calculer via la formule des probabilités totales.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const roundTo = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const fr = (n) => String(n).replace(".", ",");

// ---------- 1. Partition de l'univers à 3 évènements : retrouver la probabilité manquante ----------
function genPartition3EvenementsNumeric() {
  const p1 = pick([0.1, 0.15, 0.2, 0.25]);
  const p2 = pick([0.2, 0.25, 0.3]);
  const p3 = pick([0.1, 0.15, 0.2]);
  const answer = roundTo(1 - p1 - p2 - p3, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles (Terminale techno) — Partition de l'univers",
    prompt: `\\(A_1, A_2, A_3, A_4\\) forment une partition de l'univers, avec \\(P(A_1)=${fr(p1)}\\), \\(P(A_2)=${fr(p2)}\\), \\(P(A_3)=${fr(p3)}\\). Calcule \\(P(A_4)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{Une partition vérifie } P(A_1)+P(A_2)+P(A_3)+P(A_4)=1.` },
      { type: "resultat", text: `P(A_4) = 1 - ${fr(p1)} - ${fr(p2)} - ${fr(p3)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 2. Formule des probabilités totales avec une partition à 3 évènements ----------
function genProbabilitesTotales3EvenementsNumeric() {
  const p1 = pick([0.2, 0.3, 0.4]);
  const p2 = pick([0.2, 0.3]);
  const p3 = roundTo(1 - p1 - p2, 4);
  const pB1 = pick([0.1, 0.2, 0.3]);
  const pB2 = pick([0.4, 0.5, 0.6]);
  const pB3 = pick([0.6, 0.7, 0.8]);
  const answer = roundTo(p1 * pB1 + p2 * pB2 + p3 * pB3, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles (Terminale techno) — Probabilités totales",
    prompt: `\\(A_1, A_2, A_3\\) forment une partition de l'univers, avec \\(P(A_1)=${fr(p1)}\\), \\(P(A_2)=${fr(p2)}\\), \\(P(A_3)=${fr(p3)}\\). On donne \\(P_{A_1}(B)=${fr(pB1)}\\), \\(P_{A_2}(B)=${fr(pB2)}\\), \\(P_{A_3}(B)=${fr(pB3)}\\). Calcule \\(P(B)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `P(B) = P(A_1)P_{A_1}(B) + P(A_2)P_{A_2}(B) + P(A_3)P_{A_3}(B)` },
      { type: "calcul", text: `P(B) = ${fr(p1)}\\times${fr(pB1)} + ${fr(p2)}\\times${fr(pB2)} + ${fr(p3)}\\times${fr(pB3)}` },
      { type: "resultat", text: `P(B) \\approx ${fr(roundTo(p1 * pB1, 4))} + ${fr(roundTo(p2 * pB2, 4))} + ${fr(roundTo(p3 * pB3, 4))} = ${fr(answer)}` },
    ],
  };
}

// ---------- 3. Interpréter une pondération dans un arbre ----------
function genInterpreterPonderationQCM() {
  const cas = pick([
    {
      description: "Sur la branche partant du nœud A vers le nœud B, on lit la pondération 0,4.",
      reponse: "P_A(B) = 0,4",
      explication: "P_A(B) = 0,4 : une pondération portée par une branche qui part d'un nœud intermédiaire (ici A) est une probabilité conditionnelle, sachant que l'évènement de départ est déjà réalisé.",
    },
    {
      description: "Sur la première branche de l'arbre, partant de la racine vers A, on lit la pondération 0,6.",
      reponse: "P(A) = 0,6",
      explication: "P(A) = 0,6 : une pondération portée par une branche qui part de la racine de l'arbre est une probabilité simple (non conditionnelle).",
    },
  ]);
  return {
    type: "qcm",
    chapter: "Probabilités conditionnelles (Terminale techno) — Arbre pondéré",
    prompt: `« ${cas.description} » Comment interpréter cette pondération ?`,
    answer: cas.reponse,
    options: ["P_A(B) = 0,4", "P(A) = 0,6"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 4. Construire un arbre : compléter une pondération manquante ----------
function genCompleterPonderationNumeric() {
  const p1 = pick([0.2, 0.3, 0.4, 0.5, 0.6]);
  const answer = roundTo(1 - p1, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles (Terminale techno) — Arbre pondéré",
    prompt: `Sur un nœud de l'arbre, une branche a pour pondération ${fr(p1)}. Quelle est la pondération de l'autre branche issue de ce même nœud (les deux issues sont complémentaires) ?`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: "Les pondérations des branches issues d'un même nœud somment à 1." },
      { type: "resultat", text: `1 - ${fr(p1)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 5. Calculer une probabilité via un chemin de l'arbre (3 niveaux) ----------
function genCheminTroisNiveauxNumeric() {
  const p1 = pick([0.3, 0.4, 0.5, 0.6]);
  const p2 = pick([0.2, 0.3, 0.4]);
  const p3 = pick([0.5, 0.6, 0.7]);
  const answer = roundTo(p1 * p2 * p3, 5);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles (Terminale techno) — Arbre pondéré",
    prompt: `Un arbre pondéré comporte 3 niveaux successifs, de pondérations ${fr(p1)}, ${fr(p2)} et ${fr(p3)} le long d'un même chemin. Calcule la probabilité de ce chemin.`,
    answer,
    tolerance: 0.00005,
    steps: [
      { type: "regle", text: "Le long d'un chemin de l'arbre, on multiplie les pondérations rencontrées." },
      { type: "resultat", text: `${fr(p1)} \\times ${fr(p2)} \\times ${fr(p3)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 6. Reconnaître une partition valide de l'univers (3+ évènements) ----------
function genReconnaitrePartitionQCM() {
  const estPartition = Math.random() < 0.5;
  const p1 = pick([0.2, 0.3]);
  const p2 = pick([0.2, 0.3]);
  const p3 = estPartition ? roundTo(1 - p1 - p2, 4) : roundTo(1 - p1 - p2 + pick([0.1, -0.1, 0.15]), 4);
  const somme = roundTo(p1 + p2 + p3, 4);
  const answer = Math.abs(somme - 1) < 0.001 ? "C'est une partition de l'univers" : "Ce n'est pas une partition de l'univers";
  return {
    type: "qcm",
    chapter: "Probabilités conditionnelles (Terminale techno) — Partition de l'univers",
    prompt: `On donne trois évènements deux à deux incompatibles A₁, A₂, A₃, avec \\(P(A_1)=${fr(p1)}\\), \\(P(A_2)=${fr(p2)}\\), \\(P(A_3)=${fr(p3)}\\). Forment-ils une partition de l'univers ?`,
    answer,
    options: ["C'est une partition de l'univers", "Ce n'est pas une partition de l'univers"],
    steps: [
      { type: "regle", text: "Des évènements deux à deux incompatibles forment une partition de l'univers seulement si la somme de leurs probabilités vaut exactement 1." },
      { type: "calcul", text: `\\text{Somme} = ${fr(p1)}+${fr(p2)}+${fr(p3)} = ${fr(somme)}` },
      { type: "resultat", text: answer },
    ],
  };
}

// ---------- 7. Problème contextualisé (test médical à plusieurs populations) ----------
function genTestMedicalNumeric() {
  const pMalade = pick([0.01, 0.02, 0.05]);
  const pPositifSiMalade = pick([0.9, 0.95, 0.98]);
  const pPositifSiSain = pick([0.02, 0.05, 0.08]);
  const answer = roundTo(pMalade * pPositifSiMalade + (1 - pMalade) * pPositifSiSain, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles (Terminale techno) — Problème",
    prompt: `Dans une population, ${fr(pMalade * 100)} % des personnes sont malades. Un test est positif chez ${fr(pPositifSiMalade * 100)} % des malades et chez ${fr(pPositifSiSain * 100)} % des personnes saines (faux positifs). Calcule la probabilité qu'une personne prise au hasard ait un test positif.`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `P(\\text{positif}) = P(\\text{malade})\\times P_{\\text{malade}}(\\text{positif}) + P(\\text{sain})\\times P_{\\text{sain}}(\\text{positif})` },
      { type: "calcul", text: `${fr(pMalade)}\\times${fr(pPositifSiMalade)} + ${fr(roundTo(1 - pMalade, 4))}\\times${fr(pPositifSiSain)}` },
      { type: "resultat", text: `P(\\text{positif}) \\approx ${fr(answer)}` },
    ],
  };
}

const GENERATORS = [
  genPartition3EvenementsNumeric,
  genProbabilitesTotales3EvenementsNumeric,
  genInterpreterPonderationQCM,
  genCompleterPonderationNumeric,
  genCheminTroisNiveauxNumeric,
  genReconnaitrePartitionQCM,
  genTestMedicalNumeric,
];

const DIFFICULTY = {
  genCompleterPonderationNumeric: "facile",
  genInterpreterPonderationQCM: "facile",
  genPartition3EvenementsNumeric: "facile",
  genCheminTroisNiveauxNumeric: "standard",
  genReconnaitrePartitionQCM: "standard",
  genProbabilitesTotales3EvenementsNumeric: "expert",
  genTestMedicalNumeric: "expert",
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
    id: "probabilites-conditionnelles-terminale-techno",
    title: "Probabilités conditionnelles et probabilités totales",
    description: "Partition de l'univers, formule des probabilités totales, arbres pondérés à plusieurs niveaux.",
    pourquoi: "La formule des probabilités totales permet de calculer un risque global à partir de sous-populations différentes — assurance, contrôle qualité, épidémiologie.",
    level: "terminale-techno",
    order: 7,
    cours: {
      mindMap: {
        title: "Probabilités conditionnelles et probabilités totales",
        branches: [
          {
            title: "Partition de l'univers",
            items: [
              "Une partition découpe tous les cas possibles en événements disjoints (aucun point commun) qui recouvrent tout l'univers.",
              "La somme des probabilités des événements d'une partition vaut toujours 1.",
            ],
          },
          {
            title: "Formule des probabilités totales",
            items: [
              "Additionner les probabilités de B sur chaque morceau de la partition.",
            ],
            formula: "\\(P(B) = P(A_1)\\times P_{A_1}(B) + P(A_2)\\times P_{A_2}(B) + \\cdots\\)",
          },
          {
            title: "Arbre à plusieurs niveaux",
            items: [
              "Sur chaque nœud, la somme des probabilités des branches issues de ce nœud vaut 1.",
              "La probabilité d'un chemin = produit des probabilités le long de ce chemin.",
            ],
          },
          {
            title: "Piège classique : P_A(B) ≠ P_B(A)",
            items: [
              "Dans un test médical, « être malade sachant test positif » et « avoir un test positif sachant malade » sont deux probabilités très différentes.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
