// ---------------------------------------------------------------------------
// Chapitre : Informations chiffrées (2nde) — sous abonnement.
//
// Correspond au chapitre 9 du manuel de 2nde : proportion d'une partie dans
// un total (et ses réciproques : trouver la partie ou le total), proportion
// d'une proportion, variation absolue et relative (taux d'évolution),
// coefficient multiplicateur associé à un taux (hausse ou baisse) et sa
// réciproque, évolutions successives (coefficient multiplicateur global,
// produit des coefficients), distinction entre un pourcentage de proportion
// et un pourcentage d'évolution.
// La correction du livre du professeur (exercices 17-40 : proportions,
// coefficients multiplicateurs, évolutions successives et réciproques) a
// servi à identifier la méthode ; les nombres et contextes sont générés
// aléatoirement à chaque tirage, en construisant les évolutions à l'envers
// depuis leurs coefficients pour garder des résultats exacts lorsque c'est
// pertinent (et une tolérance pour les évolutions successives / réciproques,
// comme dans le manuel où les résultats sont eux-mêmes arrondis).
// Voir automatismes-seconde.js (thème "informations-chiffrees-seconde")
// pour les mini-exercices "Calcul mental" associés.
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

const contextesProportion = [
  { total: "le nombre total d'élèves du lycée", partie: "le nombre d'élèves externes" },
  { total: "le budget total des vacances", partie: "le budget consacré à l'hébergement" },
  { total: "la population totale de la ville", partie: "le nombre d'habitants de moins de 25 ans" },
  { total: "le nombre total d'articles du magasin", partie: "le nombre d'articles soldés" },
  { total: "la superficie totale de la région", partie: "la superficie couverte par la forêt" },
  { total: "le nombre total de votants", partie: "le nombre de votes en faveur du projet" },
];

// ---------- 1. Calculer une proportion ----------
function genCalculerProportionNumeric() {
  const ctx = pick(contextesProportion);
  const p = randInt(5, 95);
  const k = randInt(2, 20);
  const total = k * 100;
  const partie = (total * p) / 100;
  return {
    type: "numeric",
    chapter: "Informations chiffrées — Proportions",
    prompt: `Dans un lycée, ${ctx.total} est de ${total}. ${ctx.partie.charAt(0).toUpperCase() + ctx.partie.slice(1)} est de ${partie}. Quelle est la proportion (en %) que représente ${ctx.partie} par rapport à ${ctx.total} ?`,
    answer: p,
    steps: [`\\text{Proportion} = \\dfrac{${partie}}{${total}} \\times 100 = ${p}\\%`],
  };
}

// ---------- 2. Calculer la partie depuis une proportion ----------
function genCalculerPartieDepuisProportionNumeric() {
  const ctx = pick(contextesProportion);
  const p = randInt(5, 95);
  const k = randInt(2, 20);
  const total = k * 100;
  const partie = (total * p) / 100;
  return {
    type: "numeric",
    chapter: "Informations chiffrées — Proportions",
    prompt: `${ctx.total.charAt(0).toUpperCase() + ctx.total.slice(1)} est de ${total}. ${ctx.partie.charAt(0).toUpperCase() + ctx.partie.slice(1)} représente ${p} % de ce total. Calcule ${ctx.partie}.`,
    answer: partie,
    steps: [`${p}\\% \\times ${total} = \\dfrac{${p}}{100} \\times ${total} = ${partie}`],
  };
}

// ---------- 3. Calculer le total depuis une proportion et une partie ----------
function genCalculerTotalDepuisProportionEtPartieNumeric() {
  const ctx = pick(contextesProportion);
  const p = randInt(5, 95);
  const k = randInt(2, 20);
  const total = k * 100;
  const partie = (total * p) / 100;
  return {
    type: "numeric",
    chapter: "Informations chiffrées — Proportions",
    prompt: `${ctx.partie.charAt(0).toUpperCase() + ctx.partie.slice(1)} est de ${partie}, ce qui représente ${p} % de ${ctx.total}. Calcule ${ctx.total}.`,
    answer: total,
    steps: [`\\text{Total} = \\dfrac{${partie}}{${p}} \\times 100 = ${total}`],
  };
}

// ---------- 4. Proportion d'une proportion ----------
function genProportionDeProportionNumeric() {
  const p1 = pick([10, 20, 25, 40, 50, 60, 75, 80]);
  const p2 = pick([10, 20, 25, 40, 50, 60, 75, 80]);
  const combinee = roundTo((p1 * p2) / 100, 2);
  return {
    type: "numeric",
    chapter: "Informations chiffrées — Proportion d'une proportion",
    prompt: `Dans une entreprise, ${p1} % des salariés sont cadres. Parmi les cadres, ${p2} % optent pour le télétravail. Quel pourcentage des salariés de l'entreprise sont des cadres qui optent pour le télétravail ?`,
    answer: combinee,
    tolerance: 0.01,
    steps: [`${p1}\\% \\times ${p2}\\% = \\dfrac{${p1}}{100} \\times \\dfrac{${p2}}{100} = \\dfrac{${combinee}}{100}`, `\\text{Soit } ${combinee}\\% \\text{ des salariés.}`],
  };
}

// ---------- 5. Coefficient multiplicateur depuis un taux ----------
function genCoefficientMultiplicateurDepuisTauxNumeric() {
  const t = randInt(1, 95);
  const hausse = Math.random() < 0.5;
  const cm = hausse ? (100 + t) / 100 : (100 - t) / 100;
  return {
    type: "numeric",
    chapter: "Informations chiffrées — Coefficient multiplicateur",
    prompt: `Quel est le coefficient multiplicateur associé à une ${hausse ? "hausse" : "baisse"} de ${t} % ?`,
    answer: cm,
    steps: [hausse ? `\\text{CM} = 1 + \\dfrac{${t}}{100} = ${cm}` : `\\text{CM} = 1 - \\dfrac{${t}}{100} = ${cm}`],
  };
}

// ---------- 6. Taux depuis un coefficient multiplicateur ----------
function genTauxDepuisCoefficientMultiplicateurNumeric() {
  const t = randInt(1, 95);
  const hausse = Math.random() < 0.5;
  const cm = hausse ? (100 + t) / 100 : (100 - t) / 100;
  return {
    type: "numeric",
    chapter: "Informations chiffrées — Coefficient multiplicateur",
    prompt: `Une quantité a été multipliée par ${fr(cm)}. Quel est le taux d'évolution associé (en %, positif pour une hausse, négatif pour une baisse) ?`,
    answer: hausse ? t : -t,
    steps: [`\\text{Taux} = (${cm} - 1) \\times 100 = ${hausse ? t : -t}\\%`],
  };
}

// ---------- 7. Valeur finale après une évolution ----------
function genValeurFinaleApresEvolutionNumeric() {
  const t = randInt(1, 80);
  const hausse = Math.random() < 0.5;
  const k = randInt(2, 15);
  const V0 = k * 100;
  const V1 = hausse ? k * (100 + t) : k * (100 - t);
  return {
    type: "numeric",
    chapter: "Informations chiffrées — Évolutions",
    prompt: `Une quantité valant initialement ${V0} subit une ${hausse ? "hausse" : "baisse"} de ${t} %. Quelle est sa valeur finale ?`,
    answer: V1,
    steps: [hausse ? `${V0} \\times \\left(1 + \\dfrac{${t}}{100}\\right) = ${V0} \\times ${(100 + t) / 100} = ${V1}` : `${V0} \\times \\left(1 - \\dfrac{${t}}{100}\\right) = ${V0} \\times ${(100 - t) / 100} = ${V1}`],
  };
}

// ---------- 8. Valeur initiale depuis la valeur finale ----------
function genValeurInitialeDepuisValeurFinaleNumeric() {
  const t = randInt(1, 80);
  const hausse = Math.random() < 0.5;
  const k = randInt(2, 15);
  const V0 = k * 100;
  const V1 = hausse ? k * (100 + t) : k * (100 - t);
  return {
    type: "numeric",
    chapter: "Informations chiffrées — Évolutions",
    prompt: `Après une ${hausse ? "hausse" : "baisse"} de ${t} %, une quantité vaut ${V1}. Quelle était sa valeur initiale ?`,
    answer: V0,
    steps: [hausse ? `\\text{Valeur initiale} = \\dfrac{${V1}}{1 + ${t}/100} = \\dfrac{${V1}}{${(100 + t) / 100}} = ${V0}` : `\\text{Valeur initiale} = \\dfrac{${V1}}{1 - ${t}/100} = \\dfrac{${V1}}{${(100 - t) / 100}} = ${V0}`],
  };
}

// ---------- 9. Variation absolue ----------
function genVariationAbsolueNumeric() {
  const V0 = randInt(50, 500);
  const V1 = randInt(50, 500);
  return {
    type: "numeric",
    chapter: "Informations chiffrées — Variation absolue et relative",
    prompt: `Une quantité passe de ${V0} à ${V1}. Calcule sa variation absolue (\\(V_1 - V_0\\)).`,
    answer: V1 - V0,
    steps: [`${V1} - ${V0} = ${V1 - V0}`],
  };
}

// ---------- 10. Variation relative (taux d'évolution) ----------
function genVariationRelativeNumeric() {
  const t = randInt(1, 80);
  const hausse = Math.random() < 0.5;
  const k = randInt(2, 15);
  const V0 = k * 100;
  const V1 = hausse ? k * (100 + t) : k * (100 - t);
  return {
    type: "numeric",
    chapter: "Informations chiffrées — Variation absolue et relative",
    prompt: `Une quantité passe de ${V0} à ${V1}. Calcule le taux d'évolution (en %, positif pour une hausse, négatif pour une baisse).`,
    answer: hausse ? t : -t,
    steps: [`\\text{Taux} = \\dfrac{${V1} - ${V0}}{${V0}} \\times 100 = ${hausse ? t : -t}\\%`],
  };
}

// ---------- 11. Coefficient multiplicateur global (évolutions successives) ----------
function genCoefficientGlobalEvolutionsSuccessivesNumeric() {
  const t1 = randInt(1, 60);
  const hausse1 = Math.random() < 0.5;
  const t2 = randInt(1, 60);
  const hausse2 = Math.random() < 0.5;
  const cm1 = hausse1 ? (100 + t1) / 100 : (100 - t1) / 100;
  const cm2 = hausse2 ? (100 + t2) / 100 : (100 - t2) / 100;
  const cmGlobal = roundTo(cm1 * cm2, 4);
  return {
    type: "numeric",
    chapter: "Informations chiffrées — Évolutions successives",
    prompt: `Une quantité subit d'abord une ${hausse1 ? "hausse" : "baisse"} de ${t1} %, puis une ${hausse2 ? "hausse" : "baisse"} de ${t2} %. Quel est le coefficient multiplicateur global de cette évolution ?`,
    answer: cmGlobal,
    tolerance: 0.001,
    steps: [`\\text{CM}_1 = ${cm1}`, `\\text{CM}_2 = ${cm2}`, `\\text{CM global} = ${cm1} \\times ${cm2} \\approx ${cmGlobal}`],
  };
}

// ---------- 12. Taux d'évolution global (évolutions successives) ----------
function genTauxGlobalEvolutionsSuccessivesNumeric() {
  const t1 = randInt(1, 60);
  const hausse1 = Math.random() < 0.5;
  const t2 = randInt(1, 60);
  const hausse2 = Math.random() < 0.5;
  const cm1 = hausse1 ? (100 + t1) / 100 : (100 - t1) / 100;
  const cm2 = hausse2 ? (100 + t2) / 100 : (100 - t2) / 100;
  const tauxGlobal = roundTo((cm1 * cm2 - 1) * 100, 2);
  return {
    type: "numeric",
    chapter: "Informations chiffrées — Évolutions successives",
    prompt: `Une quantité subit d'abord une ${hausse1 ? "hausse" : "baisse"} de ${t1} %, puis une ${hausse2 ? "hausse" : "baisse"} de ${t2} %. Quel est le taux d'évolution global (en %, positif pour une hausse, négatif pour une baisse) ?`,
    answer: tauxGlobal,
    tolerance: 0.01,
    steps: [`\\text{CM global} = ${cm1} \\times ${cm2} \\approx ${roundTo(cm1 * cm2, 4)}`, `\\text{Taux global} \\approx ${tauxGlobal}\\%`],
  };
}

// ---------- 13. Évolution réciproque ----------
function genEvolutionReciproqueNumeric() {
  const t = randInt(5, 80);
  const hausse = Math.random() < 0.5;
  const cm = hausse ? (100 + t) / 100 : (100 - t) / 100;
  const cmReciproque = 1 / cm;
  const tauxReciproque = roundTo((cmReciproque - 1) * 100, 2);
  return {
    type: "numeric",
    chapter: "Informations chiffrées — Évolution réciproque",
    prompt: `Une quantité a subi une ${hausse ? "hausse" : "baisse"} de ${t} %. Quel est le taux d'évolution réciproque (en %, celui qui permettrait de revenir à la valeur de départ) ?`,
    answer: tauxReciproque,
    tolerance: 0.01,
    steps: [`\\text{CM} = ${cm}`, `\\text{CM réciproque} = \\dfrac{1}{${cm}} \\approx ${roundTo(cmReciproque, 4)}`, `\\text{Taux réciproque} \\approx ${tauxReciproque}\\%`],
  };
}

// ---------- 14. Proportion ou évolution ? ----------
function genIdentifierProportionOuEvolutionQCM() {
  const cas = pick([
    { texte: "Le prix d'un article de 80 € diminue de 20 %.", reponse: "évolution" },
    { texte: "45 % des élèves de la classe sont des filles.", reponse: "proportion" },
    { texte: "La population d'une ville augmente de 5 % en un an.", reponse: "évolution" },
    { texte: "30 % du budget des vacances est consacré au transport.", reponse: "proportion" },
    { texte: "Le nombre d'abonnés d'une chaîne double (augmente de 100 %) en un mois.", reponse: "évolution" },
    { texte: "60 % des salariés de l'entreprise télétravaillent au moins un jour par semaine.", reponse: "proportion" },
  ]);
  return {
    type: "qcm",
    chapter: "Informations chiffrées — Proportion ou évolution",
    prompt: `« ${cas.texte} » Ce pourcentage exprime-t-il une proportion ou une évolution ?`,
    answer: cas.reponse,
    options: ["proportion", "évolution"],
    steps: [cas.reponse === "évolution" ? "Ce pourcentage compare une valeur avant/après : c'est une évolution." : "Ce pourcentage compare une partie à un tout : c'est une proportion."],
  };
}

// ---------- 15. Comparer deux coefficients multiplicateurs ----------
function genComparerCoefficientsMultiplicateursQCM() {
  const t1 = randInt(1, 90);
  const hausse1 = Math.random() < 0.5;
  let t2 = randInt(1, 90);
  let hausse2 = Math.random() < 0.5;
  const cm1 = hausse1 ? (100 + t1) / 100 : (100 - t1) / 100;
  let cm2 = hausse2 ? (100 + t2) / 100 : (100 - t2) / 100;
  while (cm2 === cm1) {
    t2 = randInt(1, 90);
    hausse2 = Math.random() < 0.5;
    cm2 = hausse2 ? (100 + t2) / 100 : (100 - t2) / 100;
  }
  const plusGrand = cm1 > cm2 ? `une ${hausse1 ? "hausse" : "baisse"} de ${t1} %` : `une ${hausse2 ? "hausse" : "baisse"} de ${t2} %`;
  return {
    type: "qcm",
    chapter: "Informations chiffrées — Coefficient multiplicateur",
    prompt: `Laquelle de ces deux évolutions a le plus grand coefficient multiplicateur : une ${hausse1 ? "hausse" : "baisse"} de ${t1} %, ou une ${hausse2 ? "hausse" : "baisse"} de ${t2} % ?`,
    answer: plusGrand,
    options: [`une ${hausse1 ? "hausse" : "baisse"} de ${t1} %`, `une ${hausse2 ? "hausse" : "baisse"} de ${t2} %`],
    steps: [`\\text{CM}_1 = ${cm1}`, `\\text{CM}_2 = ${cm2}`, `\\text{Le plus grand coefficient correspond à : } ${plusGrand}.`],
  };
}

const GENERATORS = [
  genCalculerProportionNumeric,
  genCalculerPartieDepuisProportionNumeric,
  genCalculerTotalDepuisProportionEtPartieNumeric,
  genProportionDeProportionNumeric,
  genCoefficientMultiplicateurDepuisTauxNumeric,
  genTauxDepuisCoefficientMultiplicateurNumeric,
  genValeurFinaleApresEvolutionNumeric,
  genValeurInitialeDepuisValeurFinaleNumeric,
  genVariationAbsolueNumeric,
  genVariationRelativeNumeric,
  genCoefficientGlobalEvolutionsSuccessivesNumeric,
  genTauxGlobalEvolutionsSuccessivesNumeric,
  genEvolutionReciproqueNumeric,
  genIdentifierProportionOuEvolutionQCM,
  genComparerCoefficientsMultiplicateursQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "informations-chiffrees-seconde",
    title: "Informations chiffrées",
    description: "Proportions (partie, total), proportion d'une proportion, coefficient multiplicateur, variation absolue et relative, évolutions successives et réciproques.",
    level: "seconde",
    free: false,
    order: 11,
  },
  generate,
};
