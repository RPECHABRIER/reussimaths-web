// ---------------------------------------------------------------------------
// Chapitre : Analyse de l'information chiffrée (Première, enseignement
// mathématique non spé) — sous abonnement.
//
// NOTE (audit programme 2026, M2) : genQualifierCorrelationQCM ne traite la
// corrélation que de façon qualitative/narrative (à partir d'une description
// de situation, sans nuage de points chiffré) — c'est volontairement une
// simple mise en bouche à la notion, pas le traitement complet du thème
// « statistiques à deux variables ». Le volet quantitatif (point moyen,
// droite d'ajustement, prédiction par extrapolation) a été ajouté dans
// statistique-probabilites-premiere-non-spe.js (genCalculerPointMoyenNumeric,
// genEquationDroiteAjustementNumeric, genPredictionParAjustementNumeric).
//
// Correspond au chapitre 1 du programme d'enseignement mathématique de
// première (non spécialité) : tableaux croisés d'effectifs (calcul d'une
// case manquante à partir des totaux, calcul de totaux marginaux),
// proportions et proportions conditionnelles depuis un tableau croisé, taux
// de réussite / taux d'évolution, distinction entre pourcentage d'évolution
// et écart en points de pourcentage, lecture critique de diagrammes
// (diagramme en bâtons à échelle faussée, diagramme circulaire dont l'angle
// ne correspond pas au pourcentage annoncé), qualification narrative d'une
// corrélation à partir d'une description de nuage de points (voir aussi le
// traitement quantitatif dans statistique-probabilites-premiere-non-spe.js).
// La correction du livre du professeur (source .tex, exercices 4-23 :
// Automatismes méthodes 1-4, Entraînement parties 1-2 sur les tableaux
// croisés et les représentations graphiques) a servi à identifier la
// méthode ; les nombres et contextes sont générés aléatoirement à chaque
// tirage.
// Voir automatismes-premiere-non-spe.js (thème
// "analyse-information-chiffree-premiere-non-spe") pour les mini-exercices
// "Calcul mental" associés.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// ---------------------------------------------------------------------------

import { texTable } from "../utils/texTable.js";

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

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

// Construit un tableau croisé 2x2 cohérent : lignes L1/L2, colonnes C1/C2.
function tableauCroise2x2() {
  const a = randInt(10, 60); // L1 ∩ C1
  const b = randInt(10, 60); // L1 ∩ C2
  const c = randInt(10, 60); // L2 ∩ C1
  const d = randInt(10, 60); // L2 ∩ C2
  return {
    a, b, c, d,
    totalL1: a + b,
    totalL2: c + d,
    totalC1: a + c,
    totalC2: b + d,
    total: a + b + c + d,
  };
}

// Construit un tableau croisé 2x2 en LaTeX propre via texTable() — évite tout
// débordement du cadre de l'exercice (voir informations-chiffrees-seconde.js
// pour le précédent buildCrossTableTex équivalent en 2nde).
function buildTableauCroiseTex(t, rowNames, colNames, { hidden = null, includeTotals = false } = {}) {
  const cell = (key, val) => (hidden === key ? "?" : String(val));
  const header = ["", `\\text{${colNames[0]}}`, `\\text{${colNames[1]}}`, ...(includeTotals ? ["\\text{Total}"] : [])];
  const row1 = [rowNames[0], cell("a", t.a), cell("b", t.b), ...(includeTotals ? [String(t.totalL1)] : [])];
  const row2 = [rowNames[1], cell("c", t.c), cell("d", t.d), ...(includeTotals ? [String(t.totalL2)] : [])];
  const rows = [header, row1, row2];
  if (includeTotals) rows.push(["Total", String(t.totalC1), String(t.totalC2), String(t.total)]);
  return texTable(rows);
}

// ---------- 1. Compléter une case manquante d'un tableau croisé ----------
function genCompleterCaseTableauCroiseNumeric() {
  const contexte = pick([
    { ligne: "Fille", ligne2: "Garçon", colonne: "Demi-pensionnaire", colonne2: "Externe", sujet: "les élèves d'un collège" },
    { ligne: "Adopté", ligne2: "Non adopté", colonne: "Chat", colonne2: "Chien", sujet: "les animaux d'un refuge" },
    { ligne: "A vu le volet 1", ligne2: "N'a pas vu le volet 1", colonne: "A vu le volet 2", colonne2: "N'a pas vu le volet 2", sujet: "un sondage" },
  ]);
  const t = tableauCroise2x2();
  const caseChoisie = pick(["a", "b", "c", "d"]);
  const autresCases = ["a", "b", "c", "d"].filter((k) => k !== caseChoisie);
  return {
    type: "numeric",
    chapter: "Analyse de l'information chiffrée — Tableaux croisés",
    prompt: `On étudie ${contexte.sujet} à l'aide d'un tableau croisé d'effectifs (la case « ? » est à déterminer) : ${buildTableauCroiseTex(t, [contexte.ligne, contexte.ligne2], [contexte.colonne, contexte.colonne2], { hidden: caseChoisie, includeTotals: true })} Détermine la case manquante (« ? »).`,
    answer: t[caseChoisie],
    steps: [
      { type: "regle", text: `\\text{La somme des trois cases connues et de la case manquante doit être égale au total général : la case manquante s'obtient donc par soustraction.}` },
      { type: "calcul", text: `${t.total} - (${autresCases.map((k) => t[k]).join(" + ")}) = ${t.total} - ${autresCases.reduce((s, k) => s + t[k], 0)}` },
      { type: "resultat", text: `\\text{Case manquante} = ${t[caseChoisie]}` },
    ],
  };
}

// ---------- 2. Total marginal d'un tableau croisé ----------
function genTotalMarginalTableauCroiseNumeric() {
  const t = tableauCroise2x2();
  const demanderLigne = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Analyse de l'information chiffrée — Tableaux croisés",
    prompt: `Un tableau croisé d'effectifs donne les quatre cases suivantes : ${buildTableauCroiseTex(t, ["Ligne 1", "Ligne 2"], ["Colonne 1", "Colonne 2"])} Calcule le total de ${demanderLigne ? "la première ligne" : "la première colonne"}.`,
    answer: demanderLigne ? t.totalL1 : t.totalC1,
    steps: [
      { type: "regle", text: `\\text{Le total d'une ligne (ou d'une colonne) est la somme des cases qui la composent.}` },
      { type: "resultat", text: demanderLigne ? `${t.a} + ${t.b} = ${t.totalL1}` : `${t.a} + ${t.c} = ${t.totalC1}` },
    ],
  };
}

// ---------- 3. Proportion depuis un tableau croisé (sur le total général) ----------
function genProportionTableauCroiseNumeric() {
  const t = tableauCroise2x2();
  return {
    type: "numeric",
    chapter: "Analyse de l'information chiffrée — Tableaux croisés",
    prompt: `Un tableau croisé d'effectifs donne les quatre cases suivantes : ${buildTableauCroiseTex(t, ["Ligne 1", "Ligne 2"], ["Colonne 1", "Colonne 2"], { includeTotals: true })} Quelle proportion (arrondie au centième) représente la case « Ligne 1 / Colonne 1 » par rapport au total général ?`,
    answer: roundTo(t.a / t.total, 2),
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Une proportion sur le total général se calcule en divisant l'effectif de la case par l'effectif total.}` },
      { type: "resultat", text: `\\dfrac{${t.a}}{${t.total}} \\approx ${roundTo(t.a / t.total, 2)}` },
    ],
  };
}

// ---------- 4. Proportion conditionnelle (parmi une sous-catégorie) ----------
function genProportionConditionnelleNumeric() {
  const t = tableauCroise2x2();
  return {
    type: "numeric",
    chapter: "Analyse de l'information chiffrée — Tableaux croisés",
    prompt: `Un tableau croisé d'effectifs donne, pour la première ligne : ${t.a} dans la première colonne et ${t.b} dans la seconde colonne. Parmi les individus de cette première ligne, quelle proportion (arrondie au centième) appartient à la première colonne ?`,
    answer: roundTo(t.a / (t.a + t.b), 2),
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Une proportion } \\textbf{conditionnelle} \\text{ se calcule par rapport au total de la sous-catégorie concernée (ici la ligne), et non par rapport au total général.}` },
      { type: "calcul", text: `\\text{Total de la ligne} = ${t.a} + ${t.b} = ${t.a + t.b}` },
      { type: "resultat", text: `\\dfrac{${t.a}}{${t.a + t.b}} \\approx ${roundTo(t.a / (t.a + t.b), 2)}` },
    ],
  };
}

// ---------- 5. Taux de réussite / proportion en pourcentage ----------
function genTauxReussiteNumeric() {
  const candidats = randInt(200, 900) * 10;
  const tauxReel = randInt(70, 99);
  const admis = Math.round((candidats * tauxReel) / 100);
  return {
    type: "numeric",
    chapter: "Analyse de l'information chiffrée — Proportions et taux",
    prompt: `Lors d'un examen, ${candidats} candidats se sont présentés et ${admis} ont été admis. Calcule le taux de réussite (en %, arrondi à l'unité).`,
    answer: Math.round((admis / candidats) * 100),
    steps: [
      { type: "regle", text: `\\text{Le taux de réussite (en \\%) s'obtient en divisant l'effectif des admis par l'effectif total, puis en multipliant par 100.}` },
      { type: "resultat", text: `\\dfrac{${admis}}{${candidats}} \\times 100 \\approx ${Math.round((admis / candidats) * 100)}\\%` },
    ],
  };
}

// ---------- 6. Calcul de l'angle d'un secteur circulaire ----------
function genAngleSecteurCirculaireNumeric() {
  const p = pick([5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 75]);
  const angle = (p * 360) / 100;
  return {
    type: "numeric",
    chapter: "Analyse de l'information chiffrée — Diagrammes circulaires",
    prompt: `Dans un diagramme circulaire, un secteur représente ${p} % d'un total. Quelle est la mesure de l'angle de ce secteur (en degrés) ?`,
    answer: angle,
    steps: [
      { type: "regle", text: `\\text{Un cercle complet mesure } 360°, \\text{ répartis proportionnellement aux pourcentages : angle du secteur} = \\text{pourcentage} \\times 360°.` },
      { type: "resultat", text: `${p}\\% \\times 360° = \\dfrac{${p}}{100} \\times 360 = ${angle}°` },
    ],
  };
}

// ---------- 7. Vérifier la cohérence d'un diagramme circulaire ----------
function genVerifierDiagrammeCirculaireQCM() {
  const p = pick([10, 20, 25, 30, 40, 50, 60]);
  const angleCorrect = (p * 360) / 100;
  const coherent = Math.random() < 0.5;
  const angleAffiche = coherent ? angleCorrect : angleCorrect + pick([-40, -30, 30, 40, 50]);
  return {
    type: "qcm",
    chapter: "Analyse de l'information chiffrée — Diagrammes circulaires",
    prompt: `Dans un diagramme circulaire, un secteur est annoncé comme représentant ${p} % du total, mais son angle mesure ${angleAffiche}°. Ce diagramme est-il cohérent ?`,
    answer: coherent ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `\\text{Angle attendu} = ${p}\\% \\times 360° = ${angleCorrect}°` },
      { type: "resultat", text: coherent ? `${angleAffiche}° = ${angleCorrect}° : le diagramme est cohérent.` : `${angleAffiche}° \\neq ${angleCorrect}° : le diagramme n'est pas cohérent (l'échelle est faussée).` },
    ],
  };
}

// ---------- 8. Vérifier la cohérence d'un diagramme en bâtons ----------
function genVerifierDiagrammeBatonsQCM() {
  const valeur1 = randInt(10, 30);
  const valeur2 = valeur1 * pick([2, 3, 4]);
  const rapportReel = valeur2 / valeur1;
  const coherent = Math.random() < 0.5;
  const hauteur1 = 2;
  const hauteur2 = coherent ? hauteur1 * rapportReel : hauteur1 * (rapportReel === 2 ? 4 : 2);
  return {
    type: "qcm",
    chapter: "Analyse de l'information chiffrée — Diagrammes en bâtons",
    prompt: `Un diagramme en bâtons représente deux valeurs : ${valeur1} et ${valeur2}. Le bâton de la première valeur mesure ${hauteur1} cm et celui de la seconde mesure ${hauteur2} cm. L'échelle de ce diagramme est-elle respectée ?`,
    answer: coherent ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "regle", text: `\\text{Un diagramme en bâtons respecte l'échelle si le rapport des hauteurs des bâtons est égal au rapport des valeurs qu'ils représentent.}` },
      { type: "calcul", text: `\\text{Rapport réel des valeurs} = \\dfrac{${valeur2}}{${valeur1}} = ${rapportReel}, \\quad \\text{Rapport des hauteurs} = \\dfrac{${hauteur2}}{${hauteur1}} = ${hauteur2 / hauteur1}` },
      { type: "resultat", text: coherent ? "Les deux rapports sont égaux : l'échelle est respectée." : "Les deux rapports sont différents : l'échelle est faussée, ce qui peut induire en erreur." },
    ],
  };
}

// ---------- 9. Qualifier une corrélation depuis un nuage de points ----------
function genQualifierCorrelationQCM() {
  const cas = pick([
    {
      description: "Plus la surface d'un appartement est grande, plus son prix de vente est élevé.",
      reponse: "corrélation positive",
      explication: `\\text{Les deux grandeurs augmentent ensemble : quand l'une augmente, l'autre augmente aussi. C'est une } \\textbf{corrélation positive}.`,
    },
    {
      description: "Plus l'ancienneté d'une voiture augmente, plus son prix de revente diminue.",
      reponse: "corrélation négative",
      explication: `\\text{Les deux grandeurs varient en sens opposé : quand l'une augmente, l'autre diminue. C'est une } \\textbf{corrélation négative}.`,
    },
    {
      description: "Le nuage de points formé par la pointure de chaussure et la note en mathématiques des élèves d'une classe ne présente aucune tendance visible.",
      reponse: "aucune corrélation visible",
      explication: `\\text{Les points du nuage ne dessinent aucune tendance croissante ou décroissante : les deux grandeurs ne semblent pas liées.}`,
    },
    {
      description: "Plus la durée d'entraînement d'un sportif augmente, plus son temps au 100 m diminue.",
      reponse: "corrélation négative",
      explication: `\\text{Les deux grandeurs varient en sens opposé : quand l'une augmente, l'autre diminue. C'est une } \\textbf{corrélation négative}.`,
    },
    {
      description: "Plus la température extérieure augmente, plus les ventes de glaces augmentent.",
      reponse: "corrélation positive",
      explication: `\\text{Les deux grandeurs augmentent ensemble : quand l'une augmente, l'autre augmente aussi. C'est une } \\textbf{corrélation positive}.`,
    },
  ]);
  return {
    type: "qcm",
    chapter: "Analyse de l'information chiffrée — Nuages de points",
    prompt: `« ${cas.description} » Quel type de corrélation cette situation suggère-t-elle ?`,
    answer: cas.reponse,
    options: ["corrélation positive", "corrélation négative", "aucune corrélation visible"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 10. Taux d'évolution depuis un tableau ou un contexte chiffré ----------
function genTauxEvolutionContexteNumeric() {
  const t = randInt(1, 80);
  const hausse = Math.random() < 0.5;
  const k = randInt(2, 15);
  const V0 = k * 100;
  const V1 = hausse ? k * (100 + t) : k * (100 - t);
  return {
    type: "numeric",
    chapter: "Analyse de l'information chiffrée — Proportions et taux",
    prompt: `Une grandeur passe de ${V0} à ${V1}. Calcule le taux d'évolution (en %, positif pour une hausse, négatif pour une baisse).`,
    answer: hausse ? t : -t,
    steps: [
      { type: "regle", text: `\\text{Le taux d'évolution est } t = \\dfrac{\\text{valeur finale} - \\text{valeur initiale}}{\\text{valeur initiale}} \\times 100.` },
      { type: "resultat", text: `\\dfrac{${V1} - ${V0}}{${V0}} \\times 100 = ${hausse ? t : -t}\\%` },
    ],
  };
}

// ---------- 11. Écart en points de pourcentage ----------
function genEcartPointsDePourcentageNumeric() {
  const p1 = randInt(10, 90);
  let p2 = randInt(10, 90);
  while (p2 === p1) p2 = randInt(10, 90);
  const [pMin, pMax] = p1 < p2 ? [p1, p2] : [p2, p1];
  return {
    type: "numeric",
    chapter: "Analyse de l'information chiffrée — Points de pourcentage",
    prompt: `Dans une école, ${pMin} % des élèves maîtrisent une compétence en REP+, contre ${pMax} % dans le privé. Quel est l'écart, en points de pourcentage, entre ces deux proportions ?`,
    answer: pMax - pMin,
    steps: [
      { type: "regle", text: `\\text{L'écart en points de pourcentage est une simple soustraction des deux pourcentages : il ne faut pas le confondre avec un taux d'évolution (qui rapporte la différence à la valeur de départ).}` },
      { type: "resultat", text: `\\text{Écart en points de pourcentage} = ${pMax} - ${pMin} = ${pMax - pMin}` },
    ],
  };
}

// ---------- 12. Pourcentage d'évolution ou point de pourcentage ? ----------
function genPourcentageOuPointDePourcentageQCM() {
  const cas = pick([
    {
      description: "Une proportion passe de 20 % à 25 %. On dit que l'écart est de 5 points de pourcentage.",
      reponse: "Vrai",
      explication: `\\text{L'écart en points de pourcentage est une simple soustraction : } 25 - 20 = 5 \\text{ points de pourcentage.}`,
    },
    {
      description: "Une proportion passe de 20 % à 25 %. On dit que le taux d'évolution est de 5 %.",
      reponse: "Faux",
      explication: `\\text{Le taux d'évolution se calcule par rapport à la valeur de départ : } \\dfrac{25 - 20}{20} \\times 100 = 25\\%, \\text{ pas } 5\\%. \\text{ On confond ici l'écart en points avec le taux d'évolution.}`,
    },
    {
      description: "Un prix passe de 80 € à 100 €. On dit que le taux d'évolution est de 25 %.",
      reponse: "Vrai",
      explication: `\\dfrac{100 - 80}{80} \\times 100 = 25\\%. \\text{ Le taux d'évolution est bien correctement calculé par rapport à la valeur de départ.}`,
    },
    {
      description: "Le taux d'évolution entre deux pourcentages se calcule toujours par simple différence des deux pourcentages.",
      reponse: "Faux",
      explication: `\\text{Une simple différence donne un écart en points de pourcentage, pas un taux d'évolution. Le taux d'évolution rapporte cette différence à la valeur de départ.}`,
    },
  ]);
  return {
    type: "qcm",
    chapter: "Analyse de l'information chiffrée — Points de pourcentage",
    prompt: `Affirmation : « ${cas.description} » Vrai ou faux ?`,
    answer: cas.reponse,
    options: ["Vrai", "Faux"],
    steps: [{ type: "regle", text: cas.explication }],
  };
}

// ---------- 13. Calculer un effectif depuis un pourcentage ----------
function genEffectifDepuisPourcentageNumeric() {
  const p = randInt(5, 95);
  const k = randInt(2, 20);
  const total = k * 100;
  return {
    type: "numeric",
    chapter: "Analyse de l'information chiffrée — Proportions et taux",
    prompt: `${total} candidats se sont présentés à un examen, avec un taux de réussite de ${p} %. Combien de candidats ont été admis ?`,
    answer: (total * p) / 100,
    steps: [
      { type: "regle", text: `\\text{L'effectif correspondant à un pourcentage s'obtient en multipliant le total par ce pourcentage.}` },
      { type: "resultat", text: `${p}\\% \\times ${total} = \\dfrac{${p}}{100} \\times ${total} = ${(total * p) / 100}` },
    ],
  };
}

// ---------- 14. Vrai ou faux depuis un tableau croisé ----------
function genVraiFauxTableauCroiseQCM() {
  const t = tableauCroise2x2();
  const affirmationCorrecte = Math.random() < 0.5;
  const totalAnnonce = affirmationCorrecte ? t.total : t.total + nonZero(1, 20);
  return {
    type: "qcm",
    chapter: "Analyse de l'information chiffrée — Tableaux croisés",
    prompt: `Un tableau croisé d'effectifs donne les quatre cases : ${buildTableauCroiseTex(t, ["Ligne 1", "Ligne 2"], ["Colonne 1", "Colonne 2"])} Affirmation : « Le total général de ce tableau est ${totalAnnonce}. » Vrai ou faux ?`,
    answer: affirmationCorrecte ? "Vrai" : "Faux",
    options: ["Vrai", "Faux"],
    steps: [
      { type: "calcul", text: `${t.a} + ${t.b} + ${t.c} + ${t.d} = ${t.total}` },
      { type: "resultat", text: affirmationCorrecte ? "L'affirmation est correcte." : `${totalAnnonce} \\neq ${t.total} : l'affirmation est fausse.` },
    ],
  };
}

// ---------- 15. Comparer deux proportions ----------
function genComparerProportionsQCM() {
  const groupe1 = "le groupe 1";
  const groupe2 = "le groupe 2";
  const total1 = randInt(50, 300);
  const favorables1 = randInt(1, total1 - 1);
  const total2 = randInt(50, 300);
  let favorables2 = randInt(1, total2 - 1);
  while (roundTo(favorables2 / total2, 4) === roundTo(favorables1 / total1, 4)) {
    favorables2 = randInt(1, total2 - 1);
  }
  const p1 = favorables1 / total1;
  const p2 = favorables2 / total2;
  const plusGrand = p1 > p2 ? groupe1 : groupe2;
  return {
    type: "qcm",
    chapter: "Analyse de l'information chiffrée — Proportions et taux",
    prompt: `${groupe1} : ${favorables1} sur ${total1}. ${groupe2} : ${favorables2} sur ${total2}. Quel groupe a la plus grande proportion ?`,
    answer: plusGrand,
    options: [groupe1, groupe2],
    steps: [
      { type: "regle", text: `\\text{Pour comparer deux groupes d'effectifs différents, on ne compare pas les effectifs bruts mais leurs proportions (rapport effectif favorable / effectif total).}` },
      { type: "calcul", text: `\\text{Proportion 1} \\approx ${roundTo(p1, 4)}, \\quad \\text{Proportion 2} \\approx ${roundTo(p2, 4)}` },
      { type: "resultat", text: `\\text{La plus grande proportion est celle de : } ${plusGrand}.` },
    ],
  };
}

const GENERATORS = [
  genCompleterCaseTableauCroiseNumeric,
  genTotalMarginalTableauCroiseNumeric,
  genProportionTableauCroiseNumeric,
  genProportionConditionnelleNumeric,
  genTauxReussiteNumeric,
  genAngleSecteurCirculaireNumeric,
  genVerifierDiagrammeCirculaireQCM,
  genVerifierDiagrammeBatonsQCM,
  genQualifierCorrelationQCM,
  genTauxEvolutionContexteNumeric,
  genEcartPointsDePourcentageNumeric,
  genPourcentageOuPointDePourcentageQCM,
  genEffectifDepuisPourcentageNumeric,
  genVraiFauxTableauCroiseQCM,
  genComparerProportionsQCM,
];

const DIFFICULTY = {
  genTotalMarginalTableauCroiseNumeric: "facile",
  genTauxReussiteNumeric: "facile",
  genVerifierDiagrammeCirculaireQCM: "facile",
  genVerifierDiagrammeBatonsQCM: "facile",
  genEffectifDepuisPourcentageNumeric: "facile",
  genCompleterCaseTableauCroiseNumeric: "standard",
  genProportionTableauCroiseNumeric: "standard",
  genProportionConditionnelleNumeric: "standard",
  genAngleSecteurCirculaireNumeric: "standard",
  genQualifierCorrelationQCM: "standard",
  genTauxEvolutionContexteNumeric: "standard",
  genVraiFauxTableauCroiseQCM: "standard",
  genEcartPointsDePourcentageNumeric: "expert",
  genPourcentageOuPointDePourcentageQCM: "expert",
  genComparerProportionsQCM: "expert",
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
    id: "analyse-information-chiffree-premiere-non-spe",
    title: "Analyse de l'information chiffrée",
    description: "Tableaux croisés d'effectifs, proportions et proportions conditionnelles, taux de réussite et d'évolution, points de pourcentage, lecture critique de diagrammes, corrélation depuis un nuage de points.",
    pourquoi: "Lire des tableaux croisés et des taux d'évolution, c'est décoder les chiffres des médias, des études et des bulletins de salaire — une compétence citoyenne autant que mathématique.",
    level: "premiere-non-spe",
    free: false,
    order: 2,
    cours: {
      mindMap: {
        title: "Analyse de l'information chiffrée",
        branches: [
          {
            title: "Tableaux croisés d'effectifs",
            items: [
              "Une case manquante se retrouve à partir des totaux de sa ligne ou de sa colonne (par différence).",
              "Total marginal = somme d'une ligne ou d'une colonne, le total général = somme de tous les totaux marginaux.",
            ],
          },
          {
            title: "Proportions et proportions conditionnelles",
            items: [
              "Proportion simple : effectif d'une case / effectif total. Proportion conditionnelle : effectif d'une case / total de sa ligne ou colonne.",
              "Piège classique : pour comparer deux groupes d'effectifs différents, on compare toujours leurs proportions (pourcentages), jamais leurs effectifs bruts.",
            ],
            formula: "\\(\\text{proportion} = \\dfrac{\\text{effectif de la catégorie}}{\\text{effectif total}} \\ (\\times 100 \\text{ pour un pourcentage})\\)",
          },
          {
            title: "Pourcentage d'évolution vs point de pourcentage",
            items: [
              "Un taux qui passe de 20 % à 25 % gagne 5 points de pourcentage, mais évolue de +25 % (\\(\\frac{25-20}{20}\\)).",
              "Piège classique très fréquent : confondre les deux, surtout dans les articles de presse.",
            ],
            formula: "\\(t = \\dfrac{V_1-V_0}{V_0}\\times 100\\)",
          },
          {
            title: "Lecture critique de diagrammes",
            items: [
              "Diagramme en bâtons à échelle tronquée (ne partant pas de 0) : exagère visuellement les écarts.",
              "Dans un diagramme en bâtons, le rapport des hauteurs des bâtons doit être égal au rapport des valeurs représentées, sinon l'échelle est faussée.",
              "Diagramme circulaire : l'angle d'un secteur doit être proportionnel au pourcentage annoncé — vérifier que ce n'est pas trompeur.",
            ],
            formula: "\\(\\text{angle du secteur} = \\text{pourcentage} \\times 360°\\)",
          },
          {
            title: "Corrélation entre deux variables",
            items: [
              "Corrélation positive : les deux grandeurs augmentent ensemble. Corrélation négative : quand l'une augmente, l'autre diminue. Aucune corrélation visible : le nuage de points ne montre aucune tendance.",
              "Une corrélation observée entre deux variables ne prouve pas qu'une cause l'autre (piège classique : corrélation ≠ causalité).",
            ],
          },
        ],
      },
    },
  },
  generate,
};
