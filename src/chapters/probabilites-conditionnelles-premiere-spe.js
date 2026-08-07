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
//
// NOTE (audit programme 2026) : le chapitre utilisait déjà la notation
// \(P_{A_1}(B)\) comme donnée d'entrée (probabilités totales, arbre) mais ne
// demandait jamais explicitement de la calculer via \(P_A(B) = P(A \cap B) /
// P(A)\), malgré le nom du chapitre. Ajout de
// genCalculerPABNumeric, genCalculerIntersectionDepuisPABNumeric,
// genInterpreterNotationPABQCM, genIndependanceViaPABQCM.
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
      { type: "regle", text: `\\text{A et B sont indépendants si et seulement si } P(A \\cap B) = P(A) \\times P(B).` },
      { type: "calcul", text: `P(A) \\times P(B) = ${fr(pA)} \\times ${fr(pB)} = ${fr(roundTo(pA * pB, 4))}` },
      { type: "resultat", text: reponse === "indépendants" ? `\\text{Cette valeur est bien égale à } P(A \\cap B) : \\text{les évènements sont indépendants.}` : `\\text{Cette valeur est différente de } P(A \\cap B) : \\text{les évènements ne sont pas indépendants.}` },
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
    steps: [
      { type: "regle", text: `\\text{A et B étant indépendants : } P(A \\cap B) = P(A) \\times P(B).` },
      { type: "resultat", text: `P(A \\cap B) = ${fr(pA)} \\times ${fr(pB)} = ${fr(answer)}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{On isole } P(A) \\text{ dans } P(A \\cap B) = P(A) \\times P(B).` },
      { type: "resultat", text: `P(A) = \\dfrac{P(A \\cap B)}{P(B)} = \\dfrac{${fr(pAB)}}{${fr(pB)}} = ${fr(pA)}` },
    ],
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
      { type: "calcul", text: `P(A \\cap B) = ${fr(pA)} \\times ${fr(pB)} = ${fr(roundTo(pA * pB, 4))}` },
      { type: "resultat", text: `P(A \\cup B) = ${fr(pA)} + ${fr(pB)} - ${fr(roundTo(pA * pB, 4))} = ${fr(answer)}` },
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
    steps: [
      { type: "regle", text: `\\text{Une partition vérifie } P(A_1) + P(A_2) + P(A_3) = 1.` },
      { type: "resultat", text: `P(A_3) = 1 - ${fr(p1)} - ${fr(p2)} = ${fr(answer)}` },
    ],
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
      { type: "regle", text: `\\text{Formule des probabilités totales : } P(B) = P(A_1) \\times P_{A_1}(B) + P(A_2) \\times P_{A_2}(B).` },
      { type: "resultat", text: `P(B) = ${fr(p1)} \\times ${fr(pB1)} + ${fr(p2)} \\times ${fr(pB2)} = ${fr(roundTo(p1 * pB1, 4))} + ${fr(roundTo(p2 * pB2, 4))} = ${fr(answer)}` },
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
    steps: [
      { type: "regle", text: `\\text{Le long d'une branche de l'arbre, on multiplie les probabilités.}` },
      { type: "resultat", text: `${fr(p1)} \\times ${fr(p2)} = ${fr(answer)}` },
    ],
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
      { type: "regle", text: `\\text{On additionne les probabilités des deux chemins qui donnent le même résultat aux deux épreuves.}` },
      { type: "calcul", text: `P(\\text{deux succès}) = ${fr(p1)} \\times ${fr(p2)} = ${fr(chemin1)}, \\quad P(\\text{deux échecs}) = ${fr(roundTo(1 - p1, 4))} \\times ${fr(roundTo(1 - p2, 4))} = ${fr(chemin2)}` },
      { type: "resultat", text: `P(\\text{même résultat}) = ${fr(chemin1)} + ${fr(chemin2)} = ${fr(answer)}` },
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
    steps: [
      { type: "regle", text: `\\text{Les épreuves étant indépendantes, on multiplie les probabilités } n \\text{ fois : } P(n \\text{ succès}) = p^n.` },
      { type: "resultat", text: `P(${n} \\text{ succès}) = ${fr(p)}^{${n}} = ${fr(answer)}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{L'évènement contraire de 'au moins un succès' est 'aucun succès' : } P(\\text{au moins un}) = 1 - P(\\text{aucun}).` },
      { type: "resultat", text: `P(\\text{au moins un succès}) = 1 - (1-${fr(p)})^{${n}} = 1 - ${fr(q)}^{${n}} = 1 - ${fr(roundTo(q ** n, 4))} = ${fr(answer)}` },
    ],
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
    steps: [
      { type: "regle", text: `\\text{Le long d'un chemin précis de l'arbre, on multiplie les probabilités rencontrées.}` },
      { type: "resultat", text: `P(\\text{ce chemin}) = ${fr(p)}^{${k}} \\times ${fr(roundTo(1 - p, 4))}^{${n - k}} = ${fr(answer)}` },
    ],
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
    steps: [{ type: "regle", text: `\\text{On compte le nombre de façons de placer } ${k} \\text{ succès parmi } ${n} \\text{ épreuves : } \\dbinom{${n}}{${k}} = ${answer}.` }],
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
      { type: "regle", text: `\\text{Formule de la loi binomiale : } P(k \\text{ succès}) = \\dbinom{n}{k} \\times p^k \\times (1-p)^{n-k}.` },
      { type: "calcul", text: `\\text{Nombre de chemins avec ${k} succès : } \\dbinom{${n}}{${k}} = ${nbChemins}` },
      { type: "resultat", text: `P(${k} \\text{ succès}) = ${nbChemins} \\times ${fr(p)}^{${k}} \\times ${fr(roundTo(1 - p, 4))}^{${n - k}} = ${fr(answer)}` },
    ],
  };
}

// ---------- 14. Vrai ou faux sur indépendance et partitions ----------
function genVraiFauxIndependanceQCM() {
  const cas = pick([
    {
      description: "Si A et B sont indépendants, alors P(A ∩ B) = P(A) × P(B).",
      reponse: "Vrai",
      explication: `\\text{C'est la définition même de l'indépendance de deux évènements.}`,
    },
    {
      description: "Deux évènements incompatibles (disjoints) sont toujours indépendants.",
      reponse: "Faux",
      explication: `\\text{Au contraire : si A et B sont incompatibles (} A \\cap B = \\emptyset\\text{) avec } P(A) > 0 \\text{ et } P(B) > 0, \\text{ alors } P(A \\cap B) = 0 \\neq P(A) \\times P(B). \\text{ Ils ne sont donc pas indépendants (savoir que A se réalise interdit B).}`,
    },
    {
      description: "Dans une partition de l'univers, la somme des probabilités des évènements vaut 1.",
      reponse: "Vrai",
      explication: `\\text{Une partition recouvre tout l'univers sans chevauchement, donc la somme des probabilités des parts vaut } P(\\Omega) = 1.`,
    },
    {
      description: "La formule des probabilités totales nécessite que les évènements Ai forment une partition de l'univers.",
      reponse: "Vrai",
      explication: `\\text{C'est une condition d'application de la formule : les } A_i \\text{ doivent être deux à deux incompatibles et recouvrir tout l'univers.}`,
    },
  ]);
  return {
    type: "qcm",
    chapter: "Probabilités conditionnelles — Vrai ou faux",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
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
    steps: [
      { type: "regle", text: `\\text{Trois évènements deux à deux incompatibles forment une partition si et seulement si la somme de leurs probabilités vaut 1.}` },
      { type: "calcul", text: `\\text{Somme des probabilités} = ${fr(p1)} + ${fr(p2)} + ${fr(p3)} = ${fr(somme)}` },
      { type: "resultat", text: answer === "C'est une partition de l'univers" ? `\\text{La somme vaut 1 : c'est bien une partition.}` : `\\text{La somme ne vaut pas 1 : ce n'est pas une partition.}` },
    ],
  };
}

// ---------- 16. Calculer P_A(B) = P(A ∩ B) / P(A) ----------
function genCalculerPABNumeric() {
  const pA = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8]);
  const facteur = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.75]);
  const pAB = roundTo(pA * facteur, 4);
  const answer = roundTo(pAB / pA, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles — Probabilité conditionnelle",
    prompt: `On donne \\(P(A) = ${fr(pA)}\\) et \\(P(A \\cap B) = ${fr(pAB)}\\). Calcule la probabilité conditionnelle \\(P_A(B)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{Formule de référence à connaître : } P_A(B) = \\dfrac{P(A \\cap B)}{P(A)}.` },
      { type: "resultat", text: `P_A(B) = \\dfrac{${fr(pAB)}}{${fr(pA)}} = ${fr(answer)}` },
    ],
  };
}

// ---------- 17. Calculer P(A ∩ B) connaissant P(A) et P_A(B) ----------
function genCalculerIntersectionDepuisPABNumeric() {
  const pA = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8]);
  const pAB_cond = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75]);
  const answer = roundTo(pA * pAB_cond, 4);
  return {
    type: "numeric",
    chapter: "Probabilités conditionnelles — Probabilité conditionnelle",
    prompt: `On donne \\(P(A) = ${fr(pA)}\\) et \\(P_A(B) = ${fr(pAB_cond)}\\). Calcule \\(P(A \\cap B)\\).`,
    answer,
    tolerance: 0.0005,
    steps: [
      { type: "regle", text: `\\text{On isole } P(A \\cap B) \\text{ dans } P_A(B) = \\dfrac{P(A \\cap B)}{P(A)} : \\quad P(A \\cap B) = P(A) \\times P_A(B).` },
      { type: "resultat", text: `P(A \\cap B) = ${fr(pA)} \\times ${fr(pAB_cond)} = ${fr(answer)}` },
    ],
  };
}

// ---------- 18. Interpréter la notation P_A(B) ----------
function genInterpreterNotationPABQCM() {
  const correct = "La probabilité que B se réalise, sachant que A est déjà réalisé";
  const distracteurs = [
    "La probabilité que A et B se réalisent tous les deux",
    "La probabilité que A se réalise, sachant que B est déjà réalisé",
    "La probabilité que A ou B se réalise",
  ];
  return {
    type: "qcm",
    chapter: "Probabilités conditionnelles — Notations",
    prompt: `Comment interprète-t-on la notation \\(P_A(B)\\) ?`,
    answer: correct,
    options: shuffle([correct, ...distracteurs]),
    steps: [{ type: "regle", text: `\\text{La notation } P_A(B) \\text{ se lit 'probabilité de B sachant A' : on suppose que A est déjà réalisé, et on regarde la probabilité que B se réalise dans ce nouveau contexte.}` }],
  };
}

// ---------- 19. Indépendance via la probabilité conditionnelle : P_A(B) = P(B) ----------
function genIndependanceViaPABQCM() {
  const pB = pick([0.2, 0.3, 0.4, 0.5, 0.6]);
  const independants = Math.random() < 0.5;
  const pAB_cond = independants ? pB : roundTo(pB + pick([0.1, -0.1, 0.15, -0.15]), 4);
  const reponse = roundTo(pAB_cond, 4) === roundTo(pB, 4) ? "indépendants" : "non indépendants";
  return {
    type: "qcm",
    chapter: "Probabilités conditionnelles — Indépendance",
    prompt: `On donne \\(P(B) = ${fr(pB)}\\) et \\(P_A(B) = ${fr(pAB_cond)}\\). Les évènements \\(A\\) et \\(B\\) sont-ils indépendants ?`,
    answer: reponse,
    options: ["indépendants", "non indépendants"],
    steps: [
      { type: "regle", text: `\\text{A et B sont indépendants si et seulement si le fait de savoir que A est réalisé ne change rien à la probabilité de B : } P_A(B) = P(B).` },
      { type: "resultat", text: reponse === "indépendants" ? `\\text{Ici } P_A(B) = P(B) : \\text{les évènements sont indépendants.}` : `\\text{Ici } P_A(B) \\neq P(B) : \\text{les évènements ne sont pas indépendants (savoir que A est réalisé change la probabilité de B).}` },
    ],
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
  genCalculerPABNumeric,
  genCalculerIntersectionDepuisPABNumeric,
  genInterpreterNotationPABQCM,
  genIndependanceViaPABQCM,
];

const DIFFICULTY = {
  genCalculerIntersectionIndependantsNumeric: "facile",
  genPartitionCompleterNumeric: "facile",
  genProbabiliteBrancheArbreNumeric: "facile",
  genBernoulliTousSuccesNumeric: "facile",
  genInterpreterNotationPABQCM: "facile",
  genRetrouverPANumeric: "standard",
  genUnionIndependantsNumeric: "standard",
  genProbabilitesTotalesNumeric: "standard",
  genProbabiliteTotaleArbreNumeric: "standard",
  genBernoulliCheminParticulierNumeric: "standard",
  genNombreCheminsNumeric: "standard",
  genReconnaitrePartitionQCM: "standard",
  genCalculerPABNumeric: "standard",
  genCalculerIntersectionDepuisPABNumeric: "standard",
  genIndependanceViaPABQCM: "standard",
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
    description: "Probabilité conditionnelle P_A(B), indépendance de deux évènements, partition et probabilités totales, arbres, répétition d'épreuves de Bernoulli.",
    pourquoi: "Les probabilités conditionnelles permettent d'actualiser un risque quand une information nouvelle arrive — un test médical positif, un email détecté comme spam.",
    level: "premiere-spe",
    order: 10,
  },
  generate,
};
