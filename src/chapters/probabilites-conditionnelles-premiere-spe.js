// ---------------------------------------------------------------------------
// Chapitre : Probabilités conditionnelles et indépendance (Première Spé)
// Ce fichier ne contient QUE du contenu (générateurs d'exercices + métadonnées).
// L'affichage (mode Classique/Jeu, pavé numérique, QCM, aide progressive) est
// géré par le composant générique <ChapterRunner /> pour tous les chapitres.
//
// Convention LaTeX : tout passage mathématique est entouré de \( ... \)
// (rendu ensuite en jolie notation par le composant <MathText />, voir
// src/components/MathText.jsx). Le reste du texte reste du français normal.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr() pour utiliser la virgule française — voir fr() ci-dessous.
//
// Programme : indépendance de deux évènements, partition de l'univers,
// formule des probabilités totales, arbres pour deux épreuves indépendantes,
// répétition (n ≤ 4) d'épreuves de Bernoulli indépendantes et identiques.
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
const combinaison = (n, k) => {
  if (k < 0 || k > n) return 0;
  let res = 1;
  for (let i = 0; i < k; i++) res = (res * (n - i)) / (i + 1);
  return Math.round(res);
};

// =========================== Générateurs paramétrés ===========================

// ---------- 1. Vérifier l'indépendance de deux évènements ----------
function genVerifierIndependanceQCM() {
  const pA = pick([0.2, 0.3, 0.4, 0.5, 0.6]);
  const pB = pick([0.2, 0.3, 0.4, 0.5]);
  const independants = Math.random() < 0.5;
  const pAB = independants ? roundTo(pA * pB, 4) : roundTo(pA * pB + pick([0.05, -0.05, 0.1, -0.1]), 4);
  const reponse = roundTo(pAB, 4) === roundTo(pA * pB, 4) ? "indépendants" : "non indépendants";
  return {
    type: "qcm",
    chapter: "Probabilités conditionnelles — Indépendance",
    prompt: `On donne \\(P(A) = ${fr(pA)}\\), \\(P(B) = ${fr(pB)}\\), et \\(P(A \\cap B) = ${fr(pAB)}\\). Les évènements \\(A\\) et \\(B\\) sont-ils indépendants ?`,
    answer: reponse,
    options: ["indépendants", "non indépendants"],
    steps: [
      `\\text{A et B sont indépendants si et seulement si } P(A \\cap B) = P(A) \\times P(B).`,
      `P(A) \\times P(B) = ${fr(pA)} \\times ${fr(pB)} = ${fr(roundTo(pA * pB, 4))}`,
      reponse === "indépendants" ? `\\text{Cette valeur est bien égale à } P(A \\cap B) : \\text{les évènements sont indépendants.}` : `\\text{Cette valeur est différente de } P(A \\cap B) : \\text{les évènements ne sont pas indépendants.}`,
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
    chapter: "Probabilités conditionnelles — Indépendance",
    prompt: `Les évènements \\(A\\) et \\(B\\) sont indépendants, avec \\(P(A) = ${fr(pA)}\\) et \\(P(B) = ${fr(pB)}\\). Calcule \\(P(A \\cap B)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [`P(A \\cap B) = P(A) \\times P(B) = ${fr(pA)} \\times ${fr(pB)} = ${fr(answer)}`],
  };
}

// ---------- 3. Retrouver P(A) connaissant P(A ∩ B) et P(B), indépendants ----------
function genRetrouverPANumeric() {
  const pA = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8]);
  const pB = pick([0.2, 0.4, 0.5, 0.8]);
  const pAB = roundTo(pA * pB, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles — Indépendance",
    prompt: `Les évènements \\(A\\) et \\(B\\) sont indépendants, avec \\(P(B) = ${fr(pB)}\\) et \\(P(A \\cap B) = ${fr(pAB)}\\). Calcule \\(P(A)\\).`,
    answer: pA,
    tolerance: 0.0005,
    steps: [`P(A) = \\dfrac{P(A \\cap B)}{P(B)} = \\dfrac{${fr(pAB)}}{${fr(pB)}} = ${fr(pA)}`],
  };
}

// ---------- 4. Probabilité de l'union de deux évènements indépendants ----------
function genUnionIndependantsNumeric() {
  const pA = pick([0.2, 0.3, 0.4, 0.5]);
  const pB = pick([0.1, 0.2, 0.3, 0.4]);
  const answer = roundTo(pA + pB - pA * pB, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles — Indépendance",
    prompt: `Les évènements \\(A\\) et \\(B\\) sont indépendants, avec \\(P(A) = ${fr(pA)}\\) et \\(P(B) = ${fr(pB)}\\). Calcule \\(P(A \\cup B)\\) (formule \\(P(A \\cup B) = P(A) + P(B) - P(A \\cap B)\\)).`,
    answer,
    tolerance: 0.0005,
    steps: [
      `P(A \\cap B) = ${fr(pA)} \\times ${fr(pB)} = ${fr(roundTo(pA * pB, 4))}`,
      `P(A \\cup B) = ${fr(pA)} + ${fr(pB)} - ${fr(roundTo(pA * pB, 4))} = ${fr(answer)}`,
    ],
  };
}

// ---------- 5. Partition de l'univers : retrouver la probabilité manquante ----------
function genPartitionCompleterNumeric() {
  const p1 = pick([0.1, 0.15, 0.2, 0.25, 0.3]);
  const p2 = pick([0.1, 0.15, 0.2, 0.25, 0.3]);
  const answer = roundTo(1 - p1 - p2, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles — Partition de l'univers",
    prompt: `Les évènements \\(A_1\\), \\(A_2\\), \\(A_3\\) forment une partition de l'univers, avec \\(P(A_1) = ${fr(p1)}\\) et \\(P(A_2) = ${fr(p2)}\\). Calcule \\(P(A_3)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [`\\text{Une partition vérifie } P(A_1) + P(A_2) + P(A_3) = 1.`, `P(A_3) = 1 - ${fr(p1)} - ${fr(p2)} = ${fr(answer)}`],
  };
}

// ---------- 6. Formule des probabilités totales ----------
function genProbabilitesTotalesNumeric() {
  const p1 = pick([0.3, 0.4, 0.5, 0.6]);
  const p2 = roundTo(1 - p1, 4);
  const pB1 = pick([0.1, 0.2, 0.3, 0.4]);
  const pB2 = pick([0.5, 0.6, 0.7, 0.8]);
  const answer = roundTo(p1 * pB1 + p2 * pB2, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles — Probabilités totales",
    prompt: `\\(A_1\\) et \\(A_2\\) forment une partition de l'univers, avec \\(P(A_1) = ${fr(p1)}\\) et \\(P(A_2) = ${fr(p2)}\\). On donne \\(P_{A_1}(B) = ${fr(pB1)}\\) et \\(P_{A_2}(B) = ${fr(pB2)}\\). Calcule \\(P(B)\\) à l'aide de la formule des probabilités totales.`,
    answer,
    tolerance: 0.0005,
    steps: [
      `P(B) = P(A_1) \\times P_{A_1}(B) + P(A_2) \\times P_{A_2}(B)`,
      `P(B) = ${fr(p1)} \\times ${fr(pB1)} + ${fr(p2)} \\times ${fr(pB2)} = ${fr(roundTo(p1 * pB1, 4))} + ${fr(roundTo(p2 * pB2, 4))} = ${fr(answer)}`,
    ],
  };
}

// ---------- 7. Arbre : probabilité d'une branche (deux épreuves indépendantes) ----------
function genProbabiliteBrancheArbreNumeric() {
  const p1 = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);
  const p2 = pick([0.1, 0.25, 0.4, 0.5, 0.6, 0.75]);
  const answer = roundTo(p1 * p2, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles — Arbre de probabilités",
    prompt: `Deux épreuves indépendantes se succèdent. La première a pour probabilité de succès \\(${fr(p1)}\\), la seconde \\(${fr(p2)}\\). Calcule la probabilité d'obtenir un succès aux deux épreuves.`,
    answer,
    tolerance: 0.0005,
    steps: [`\\text{Le long d'une branche de l'arbre, on multiplie les probabilités.}`, `${fr(p1)} \\times ${fr(p2)} = ${fr(answer)}`],
  };
}

// ---------- 8. Arbre : probabilité totale via deux chemins ----------
function genProbabiliteTotaleArbreNumeric() {
  const p1 = pick([0.3, 0.4, 0.5, 0.6, 0.7]);
  const p2 = pick([0.2, 0.3, 0.5, 0.6]);
  const chemin1 = roundTo(p1 * p2, 4);
  const chemin2 = roundTo((1 - p1) * (1 - p2), 4);
  const answer = roundTo(chemin1 + chemin2, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles — Arbre de probabilités",
    prompt: `Deux épreuves indépendantes ont chacune pour probabilité de succès \\(${fr(p1)}\\) et \\(${fr(p2)}\\) respectivement. Calcule la probabilité d'obtenir exactement le même résultat aux deux épreuves (deux succès, ou deux échecs).`,
    answer,
    tolerance: 0.0005,
    steps: [
      `P(\\text{deux succès}) = ${fr(p1)} \\times ${fr(p2)} = ${fr(chemin1)}`,
      `P(\\text{deux échecs}) = (1-${fr(p1)}) \\times (1-${fr(p2)}) = ${fr(roundTo(1 - p1, 4))} \\times ${fr(roundTo(1 - p2, 4))} = ${fr(chemin2)}`,
      `P(\\text{même résultat}) = ${fr(chemin1)} + ${fr(chemin2)} = ${fr(answer)}`,
    ],
  };
}

// ---------- 9. Bernoulli répété : probabilité de n succès consécutifs ----------
function genBernoulliTousSuccesNumeric() {
  const p = pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]);
  const n = randInt(2, 4);
  const answer = roundTo(p ** n, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles — Répétition d'épreuves de Bernoulli",
    prompt: `On répète \\(${n}\\) fois, de façon indépendante, une épreuve de Bernoulli de probabilité de succès \\(p = ${fr(p)}\\). Calcule la probabilité d'obtenir \\(${n}\\) succès consécutifs.`,
    answer,
    tolerance: 0.0005,
    steps: [`P(${n} \\text{ succès}) = p^{${n}} = ${fr(p)}^{${n}} = ${fr(answer)}`],
  };
}

// ---------- 10. Bernoulli répété : au moins un succès ----------
function genBernoulliAuMoinsUnSuccesNumeric() {
  const p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
  const n = randInt(2, 4);
  const q = roundTo(1 - p, 4);
  const answer = roundTo(1 - q ** n, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles — Répétition d'épreuves de Bernoulli",
    prompt: `On répète \\(${n}\\) fois, de façon indépendante, une épreuve de Bernoulli de probabilité de succès \\(p = ${fr(p)}\\). Calcule la probabilité d'obtenir au moins un succès (formule \\(1 - (1-p)^n\\)).`,
    answer,
    tolerance: 0.0005,
    steps: [`P(\\text{au moins un succès}) = 1 - (1-${fr(p)})^{${n}} = 1 - ${fr(q)}^{${n}} = 1 - ${fr(roundTo(q ** n, 4))} = ${fr(answer)}`],
  };
}

// ---------- 11. Bernoulli répété : probabilité d'un chemin particulier ----------
function genBernoulliCheminParticulierNumeric() {
  const p = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);
  const n = randInt(2, 4);
  const k = randInt(1, n - 1);
  const answer = roundTo(p ** k * (1 - p) ** (n - k), 5);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles — Répétition d'épreuves de Bernoulli",
    prompt: `On répète \\(${n}\\) fois, de façon indépendante, une épreuve de Bernoulli de probabilité de succès \\(p = ${fr(p)}\\). Calcule la probabilité d'obtenir, dans cet ordre précis, ${k} succès suivis de ${n - k} échecs.`,
    answer,
    tolerance: 0.00005,
    steps: [`P(\\text{ce chemin}) = p^{${k}} \\times (1-p)^{${n - k}} = ${fr(p)}^{${k}} \\times ${fr(roundTo(1 - p, 4))}^{${n - k}} = ${fr(answer)}`],
  };
}

// ---------- 12. Nombre de chemins réalisant k succès parmi n (n ≤ 4) ----------
function genNombreCheminsNumeric() {
  const n = randInt(2, 4);
  const k = randInt(0, n);
  const answer = combinaison(n, k);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles — Répétition d'épreuves de Bernoulli",
    prompt: `Dans l'arbre représentant la répétition de \\(${n}\\) épreuves de Bernoulli indépendantes, combien de chemins réalisent exactement ${k} succès ?`,
    answer,
    steps: [`\\text{On compte le nombre de façons de placer } ${k} \\text{ succès parmi } ${n} \\text{ épreuves : } \\dbinom{${n}}{${k}} = ${answer}`],
  };
}

// ---------- 13. Probabilité d'exactement k succès sur n épreuves ----------
function genProbabiliteExactementKSuccesNumeric() {
  const p = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
  const n = randInt(2, 4);
  const k = randInt(0, n);
  const nbChemins = combinaison(n, k);
  const answer = roundTo(nbChemins * p ** k * (1 - p) ** (n - k), 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles — Répétition d'épreuves de Bernoulli",
    prompt: `On répète \\(${n}\\) fois, de façon indépendante, une épreuve de Bernoulli de probabilité de succès \\(p = ${fr(p)}\\). Calcule la probabilité d'obtenir exactement ${k} succès.`,
    answer,
    tolerance: 0.0005,
    steps: [
      `\\text{Nombre de chemins avec ${k} succès : } \\dbinom{${n}}{${k}} = ${nbChemins}`,
      `P(${k} \\text{ succès}) = ${nbChemins} \\times ${fr(p)}^{${k}} \\times ${fr(roundTo(1 - p, 4))}^{${n - k}} = ${fr(answer)}`,
    ],
  };
}

// ---------- 14. Vrai ou faux sur indépendance et partitions ----------
function genVraiFauxIndependanceQCM() {
  const cas = pick([
    { description: "Si A et B sont indépendants, alors P(A ∩ B) = P(A) × P(B).", reponse: "Vrai" },
    { description: "Deux évènements incompatibles (disjoints) sont toujours indépendants.", reponse: "Faux" },
    { description: "Dans une partition de l'univers, la somme des probabilités des évènements vaut 1.", reponse: "Vrai" },
    { description: "La formule des probabilités totales nécessite que les évènements Ai forment une partition de l'univers.", reponse: "Vrai" },
  ]);
  return {
    type: "qcm",
    chapter: "Probabilités conditionnelles — Vrai ou faux",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [cas.reponse],
  };
}

// ---------- 15. Reconnaître une partition valide de l'univers ----------
function genReconnaitrePartitionQCM() {
  const estPartition = Math.random() < 0.5;
  const p1 = pick([0.2, 0.3, 0.4]);
  const p2 = pick([0.2, 0.3]);
  const p3 = estPartition ? roundTo(1 - p1 - p2, 4) : roundTo(1 - p1 - p2 + pick([0.1, -0.1, 0.15]), 4);
  const somme = roundTo(p1 + p2 + p3, 4);
  const answer = somme === 1 ? "C'est une partition de l'univers" : "Ce n'est pas une partition de l'univers";
  return {
    type: "qcm",
    chapter: "Probabilités conditionnelles — Partition de l'univers",
    prompt: `On donne trois évènements deux à deux incompatibles \\(A_1\\), \\(A_2\\), \\(A_3\\), avec \\(P(A_1) = ${fr(p1)}\\), \\(P(A_2) = ${fr(p2)}\\), \\(P(A_3) = ${fr(p3)}\\). Forment-ils une partition de l'univers ?`,
    answer,
    options: ["C'est une partition de l'univers", "Ce n'est pas une partition de l'univers"],
    steps: [`\\text{Somme des probabilités} = ${fr(p1)} + ${fr(p2)} + ${fr(p3)} = ${fr(somme)}`, answer === "C'est une partition de l'univers" ? `\\text{La somme vaut 1 : c'est bien une partition.}` : `\\text{La somme ne vaut pas 1 : ce n'est pas une partition.}`],
  };
}

const GENERATORS = [
  genVerifierIndependanceQCM,
  genCalculerIntersectionIndependantsNumeric,
  genRetrouverPANumeric,
  genUnionIndependantsNumeric,
  genPartitionCompleterNumeric,
  genProbabilitesTotalesNumeric,
  genProbabiliteBrancheArbreNumeric,
  genProbabiliteTotaleArbreNumeric,
  genBernoulliTousSuccesNumeric,
  genBernoulliAuMoinsUnSuccesNumeric,
  genBernoulliCheminParticulierNumeric,
  genNombreCheminsNumeric,
  genProbabiliteExactementKSuccesNumeric,
  genVraiFauxIndependanceQCM,
  genReconnaitrePartitionQCM,
];

const DIFFICULTY = {
  genCalculerIntersectionIndependantsNumeric: "facile",
  genPartitionCompleterNumeric: "facile",
  genProbabiliteBrancheArbreNumeric: "facile",
  genBernoulliTousSuccesNumeric: "facile",
  genRetrouverPANumeric: "standard",
  genUnionIndependantsNumeric: "standard",
  genProbabilitesTotalesNumeric: "standard",
  genProbabiliteTotaleArbreNumeric: "standard",
  genBernoulliCheminParticulierNumeric: "standard",
  genNombreCheminsNumeric: "standard",
  genReconnaitrePartitionQCM: "standard",
  genVerifierIndependanceQCM: "expert",
  genBernoulliAuMoinsUnSuccesNumeric: "expert",
  genProbabiliteExactementKSuccesNumeric: "expert",
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
    id: "probabilites-conditionnelles-premiere-spe",
    title: "Probabilités conditionnelles et indépendance",
    description: "Indépendance de deux évènements, partition et probabilités totales, arbres, répétition d'épreuves de Bernoulli.",
    level: "premiere-spe",
    order: 10,
  },
  generate,
};
