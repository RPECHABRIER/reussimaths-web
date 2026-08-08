// ---------------------------------------------------------------------------
// Chapitre : Probabilités conditionnelles et indépendance (Première
// technologique)
// Programme 2026 : définition de l'indépendance de deux évènements via
// P_A(B) = P(B) ; formule des probabilités totales. Capacités : utiliser et
// justifier l'indépendance de deux évènements, calculer une probabilité via
// la formule des probabilités totales dans des cas simples (tableau croisé,
// arbre pondéré).
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

// ---------- 1. Vérifier l'indépendance via P_A(B) = P(B) ----------
function genVerifierIndependancePAQCM() {
  const pB = pick([0.2, 0.3, 0.4, 0.5, 0.6]);
  const independants = Math.random() < 0.5;
  const pAB = independants ? pB : roundTo(pB + pick([0.1, -0.1, 0.15, -0.15]), 4);
  const reponse = roundTo(pAB, 4) === roundTo(pB, 4) ? "indépendants" : "non indépendants";
  return {
    type: "qcm",
    chapter: "Probabilités conditionnelles (Première techno) — Indépendance",
    prompt: `On donne \\(P(B) = ${fr(pB)}\\) et \\(P_A(B) = ${fr(pAB)}\\). Les évènements \\(A\\) et \\(B\\) sont-ils indépendants ?`,
    answer: reponse,
    options: ["indépendants", "non indépendants"],
    steps: [
      { type: "regle", text: `\\text{A et B sont indépendants si et seulement si } P_A(B) = P(B).` },
      { type: "resultat", text: reponse === "indépendants" ? `\\text{Ici } P_A(B) = P(B) = ${fr(pB)} : \\text{les évènements sont indépendants.}` : `\\text{Ici } P_A(B) = ${fr(pAB)} \\neq P(B) = ${fr(pB)} : \\text{les évènements ne sont pas indépendants.}` },
    ],
  };
}

// ---------- 2. Calculer P(A ∩ B) pour deux évènements indépendants ----------
function genCalculerIntersectionIndependantsNumeric() {
  const pA = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8]);
  const pB = pick([0.1, 0.2, 0.25, 0.5, 0.6, 0.75]);
  const answer = roundTo(pA * pB, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles (Première techno) — Indépendance",
    prompt: `Les évènements \\(A\\) et \\(B\\) sont indépendants, avec \\(P(A) = ${fr(pA)}\\) et \\(P(B) = ${fr(pB)}\\). Calcule \\(P(A \\cap B)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "calcul", text: `P(A \\cap B) = P(A) \\times P(B) = ${fr(pA)} \\times ${fr(pB)}` },
      { type: "resultat", text: `P(A \\cap B) = ${fr(answer)}` },
    ],
  };
}

// ---------- 3. Justifier l'indépendance à partir d'un tableau croisé ----------
function genJustifierIndependanceTableauQCM() {
  const total = pick([200, 250, 400, 500]);
  const pA = pick([0.3, 0.4, 0.5, 0.6]);
  const pB = pick([0.2, 0.25, 0.4, 0.5]);
  const independants = Math.random() < 0.5;
  const effA = Math.round(pA * total);
  const effB = Math.round(pB * total);
  const effAB = independants ? Math.round(pA * pB * total) : Math.round(pA * pB * total) + randInt(5, 20);
  const pAcalc = roundTo(effA / total, 4);
  const pBcalc = roundTo(effB / total, 4);
  const pABcalc = roundTo(effAB / total, 4);
  const reponse = Math.abs(pABcalc - roundTo(pAcalc * pBcalc, 4)) < 0.01 ? "indépendants" : "non indépendants";
  return {
    type: "qcm",
    chapter: "Probabilités conditionnelles (Première techno) — Indépendance",
    prompt: `Un tableau croisé de ${total} personnes donne : ${effA} personnes dans la catégorie A, ${effB} dans la catégorie B, et ${effAB} dans A et B à la fois. Les évènements A et B sont-ils indépendants ?`,
    answer: reponse,
    options: ["indépendants", "non indépendants"],
    steps: [
      { type: "regle", text: "A et B sont indépendants si et seulement si P(A ∩ B) = P(A) × P(B). On compare donc les deux valeurs." },
      { type: "calcul", text: `P(A) \\times P(B) = ${fr(pAcalc)} \\times ${fr(pBcalc)} = ${fr(roundTo(pAcalc * pBcalc, 4))}` },
      { type: "calcul", text: `P(A \\cap B) = \\dfrac{${effAB}}{${total}} = ${fr(pABcalc)}` },
      { type: "resultat", text: reponse === "indépendants" ? `\\text{Les deux valeurs sont (à peu près) égales : A et B sont indépendants.}` : `\\text{Les deux valeurs sont différentes : A et B ne sont pas indépendants.}` },
    ],
  };
}

// ---------- 4. Partition de l'univers : retrouver la probabilité manquante ----------
function genPartitionCompleterNumeric() {
  const p1 = pick([0.1, 0.15, 0.2, 0.25, 0.3]);
  const p2 = pick([0.1, 0.15, 0.2, 0.25, 0.3]);
  const answer = roundTo(1 - p1 - p2, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles (Première techno) — Probabilités totales",
    prompt: `Les évènements \\(A_1\\), \\(A_2\\), \\(A_3\\) forment une partition de l'univers, avec \\(P(A_1) = ${fr(p1)}\\) et \\(P(A_2) = ${fr(p2)}\\). Calcule \\(P(A_3)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{Une partition vérifie } P(A_1) + P(A_2) + P(A_3) = 1.` },
      { type: "resultat", text: `P(A_3) = 1 - ${fr(p1)} - ${fr(p2)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 5. Formule des probabilités totales (2 sous-cas) ----------
function genProbabilitesTotalesNumeric() {
  const p1 = pick([0.3, 0.4, 0.5, 0.6]);
  const p2 = roundTo(1 - p1, 4);
  const pB1 = pick([0.1, 0.2, 0.3, 0.4]);
  const pB2 = pick([0.5, 0.6, 0.7, 0.8]);
  const answer = roundTo(p1 * pB1 + p2 * pB2, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles (Première techno) — Probabilités totales",
    prompt: `\\(A_1\\) et \\(A_2\\) forment une partition de l'univers, avec \\(P(A_1) = ${fr(p1)}\\) et \\(P(A_2) = ${fr(p2)}\\). On donne \\(P_{A_1}(B) = ${fr(pB1)}\\) et \\(P_{A_2}(B) = ${fr(pB2)}\\). Calcule \\(P(B)\\) à l'aide de la formule des probabilités totales.`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `P(B) = P(A_1) \\times P_{A_1}(B) + P(A_2) \\times P_{A_2}(B)` },
      { type: "calcul", text: `P(B) = ${fr(p1)} \\times ${fr(pB1)} + ${fr(p2)} \\times ${fr(pB2)} = ${fr(roundTo(p1 * pB1, 4))} + ${fr(roundTo(p2 * pB2, 4))}` },
      { type: "resultat", text: `P(B) = ${fr(answer)}` },
    ],
  };
}

// ---------- 6. Arbre pondéré : probabilité d'une branche ----------
function genProbabiliteBrancheArbreNumeric() {
  const p1 = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);
  const p2 = pick([0.1, 0.25, 0.4, 0.5, 0.6, 0.75]);
  const answer = roundTo(p1 * p2, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles (Première techno) — Arbre pondéré",
    prompt: `Dans un arbre pondéré, une première branche a pour probabilité \\(${fr(p1)}\\), suivie d'une branche de probabilité conditionnelle \\(${fr(p2)}\\). Calcule la probabilité du chemin complet.`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{Le long d'une branche de l'arbre, on multiplie les probabilités.}` },
      { type: "resultat", text: `${fr(p1)} \\times ${fr(p2)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 7. Arbre pondéré : probabilité totale via deux chemins ----------
function genProbabiliteTotaleArbreNumeric() {
  const p1 = pick([0.3, 0.4, 0.5, 0.6, 0.7]);
  const pB1 = pick([0.2, 0.3, 0.5, 0.6]);
  const pB2 = pick([0.1, 0.2, 0.4, 0.5]);
  const p2 = roundTo(1 - p1, 4);
  const chemin1 = roundTo(p1 * pB1, 4);
  const chemin2 = roundTo(p2 * pB2, 4);
  const answer = roundTo(chemin1 + chemin2, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles (Première techno) — Arbre pondéré",
    prompt: `Un arbre pondéré représente une partition \\(A_1\\) (probabilité \\(${fr(p1)}\\)) et \\(A_2\\) (probabilité \\(${fr(p2)}\\)), suivie d'un évènement \\(B\\) avec \\(P_{A_1}(B) = ${fr(pB1)}\\) et \\(P_{A_2}(B) = ${fr(pB2)}\\). Calcule \\(P(B)\\) en additionnant les probabilités des chemins menant à B.`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: "P(B) s'obtient en additionnant les probabilités de tous les chemins de l'arbre menant à B (chemins disjoints)." },
      { type: "calcul", text: `\\text{Chemin } A_1 \\to B : ${fr(p1)} \\times ${fr(pB1)} = ${fr(chemin1)}` },
      { type: "calcul", text: `\\text{Chemin } A_2 \\to B : ${fr(p2)} \\times ${fr(pB2)} = ${fr(chemin2)}` },
      { type: "resultat", text: `P(B) = ${fr(chemin1)} + ${fr(chemin2)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 8. Retrouver P_A(B) à partir de P(A ∩ B) et P(A) ----------
function genRetrouverPABNumeric() {
  const pA = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8]);
  const pAB = roundTo(pA * pick([0.1, 0.2, 0.3, 0.4, 0.5]), 4);
  const answer = roundTo(pAB / pA, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles (Première techno) — Probabilités conditionnelles",
    prompt: `On donne \\(P(A) = ${fr(pA)}\\) et \\(P(A \\cap B) = ${fr(pAB)}\\). Calcule \\(P_A(B)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: "Formule de référence à connaître : P_A(B) = P(A ∩ B) / P(A) (probabilité conditionnelle)." },
      { type: "resultat", text: `P_A(B) = \\dfrac{${fr(pAB)}}{${fr(pA)}} = ${fr(answer)}` },
    ],
  };
}

// ---------- 9. Vrai ou faux sur indépendance et partitions ----------
function genVraiFauxIndependanceQCM() {
  const cas = pick([
    { description: "Si A et B sont indépendants, alors P_A(B) = P(B).", reponse: "Vrai", explication: "Vrai : c'est la définition même de l'indépendance de deux évènements." },
    { description: "Deux évènements incompatibles (disjoints) sont toujours indépendants.", reponse: "Faux", explication: "Faux : au contraire, si A et B sont incompatibles avec P(A)>0 et P(B)>0, alors P(A∩B)=0 mais P(A)×P(B)>0, donc A et B ne sont pas indépendants." },
    { description: "Dans une partition de l'univers, la somme des probabilités des évènements vaut 1.", reponse: "Vrai", explication: "Vrai : une partition couvre tout l'univers sans chevauchement, donc les probabilités des évènements qui la composent s'additionnent pour donner 1." },
    { description: "La formule des probabilités totales nécessite que les évènements Ai forment une partition de l'univers.", reponse: "Vrai", explication: "Vrai : la formule des probabilités totales ne s'applique que si les évènements A_i sont deux à deux incompatibles et que leur union est l'univers tout entier." },
    { description: "Si A et B sont indépendants, alors P(A ∩ B) = P(A) + P(B).", reponse: "Faux", explication: "Faux : pour des évènements indépendants, P(A∩B) = P(A) × P(B) (un produit, pas une somme)." },
  ]);
  return {
    type: "qcm",
    chapter: "Probabilités conditionnelles (Première techno) — Vrai ou faux",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

const GENERATORS = [
  genVerifierIndependancePAQCM,
  genCalculerIntersectionIndependantsNumeric,
  genJustifierIndependanceTableauQCM,
  genPartitionCompleterNumeric,
  genProbabilitesTotalesNumeric,
  genProbabiliteBrancheArbreNumeric,
  genProbabiliteTotaleArbreNumeric,
  genRetrouverPABNumeric,
  genVraiFauxIndependanceQCM,
];

const DIFFICULTY = {
  genCalculerIntersectionIndependantsNumeric: "facile",
  genPartitionCompleterNumeric: "facile",
  genProbabiliteBrancheArbreNumeric: "facile",
  genRetrouverPABNumeric: "standard",
  genVerifierIndependancePAQCM: "standard",
  genProbabilitesTotalesNumeric: "standard",
  genProbabiliteTotaleArbreNumeric: "standard",
  genJustifierIndependanceTableauQCM: "expert",
  genVraiFauxIndependanceQCM: "expert",
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
    id: "probabilites-conditionnelles-premiere-techno",
    title: "Probabilités conditionnelles et indépendance",
    description: "Indépendance de deux évènements (P_A(B) = P(B)), partition de l'univers, formule des probabilités totales, arbres pondérés.",
    pourquoi: "Les probabilités conditionnelles permettent d'actualiser un risque quand une information nouvelle arrive — un test médical positif, un email détecté comme spam.",
    level: "premiere-techno",
    order: 6,
    cours: {
      mindMap: {
        title: "Probabilités conditionnelles et indépendance",
        branches: [
          {
            title: "Probabilité conditionnelle",
            items: [
              "\\(P_A(B)\\) : probabilité de B sachant A déjà réalisé.",
            ],
            formula: "\\(P(A \\cap B) = P(A) \\times P_A(B)\\)",
          },
          {
            title: "Indépendance de deux évènements",
            items: [
              "A et B indépendants ⟺ \\(P_A(B)=P(B)\\), ce qui équivaut aussi à \\(P(A \\cap B)=P(A) \\times P(B)\\) (produit, et non une somme).",
              "Pour vérifier l'indépendance sur un tableau croisé : comparer la valeur lue de \\(P(A \\cap B)\\) au produit calculé \\(P(A) \\times P(B)\\).",
              "Piège classique : indépendant ne veut pas dire incompatible — deux évènements incompatibles de probabilités non nulles ne sont jamais indépendants.",
            ],
            formula: "\\(P(A \\cap B) = P(A) \\times P(B)\\)",
          },
          {
            title: "Partition et probabilités totales",
            items: [
              "Une partition découpe l'univers en événements disjoints qui recouvrent tous les cas possibles.",
              "Formule des probabilités totales : additionner les probabilités de B sur chaque morceau de la partition.",
            ],
            formula: "\\(P(B) = \\sum_i P(A_i) \\times P_{A_i}(B)\\)",
          },
          {
            title: "Arbre pondéré",
            items: [
              "Sur chaque nœud, la somme des probabilités des branches vaut 1.",
              "La probabilité d'un chemin = produit des probabilités le long des branches.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
