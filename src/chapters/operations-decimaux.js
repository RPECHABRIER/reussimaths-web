// ---------------------------------------------------------------------------
// Chapitre : Opérations sur les décimaux (6e) — sous abonnement.
//
// Reprend la tâche intellectuelle des exercices fournis (Mémo 1 "multiplier
// par 0,1 / 0,01 / 0,001 et puissances de dix", Mémo 2 "multiplier deux
// nombres décimaux", Mémo 3 "diviser un décimal par un entier / division
// euclidienne", Mémo 4 "appliquer un programme de calcul", et une sélection
// de problèmes), avec des nombres, prénoms et contextes différents à chaque
// génération.
//
// Volontairement laissés de côté (pas automatisables avec le format actuel
// numeric/qcm/text/multi + figures point/segment/droite/cercle) : les
// schémas de programme de calcul en boîtes/flèches (remplacés ici par un
// énoncé textuel équivalent, voir genProgrammeCalcul), les multiplications /
// divisions posées en colonnes avec cases à compléter, le puzzle-pyramide de
// multiplications, les questions ouvertes type "invente une question"
// (ex. 86) et le problème du spectacle avec recettes/dépenses à plusieurs
// inconnues (ex. 87, trop multi-étapes pour une correction automatique fiable).
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
const randDecimal = (min, max, decimals) => roundTo(min + Math.random() * (max - min), decimals);

// Affichage français : virgule décimale. `fr` pour le texte normal, `frTex`
// pour l'intérieur d'un bloc LaTeX \( ... \) (accolades autour de la virgule
// pour éviter l'espacement supplémentaire que KaTeX ajoute après une virgule).
const fr = (n) => String(n).replace(".", ",");
const frTex = (n) => String(n).replace(".", "{,}");

function shuffleStatements(items) {
  const order = shuffle(items.map((_, i) => i));
  const options = order.map((i) => items[i].text);
  const answer = order.map((i, newIndex) => (items[i].correct ? newIndex : null)).filter((v) => v !== null);
  return { options, answer };
}

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

// =========================== Mémo 1 : puissances de dix ===========================

// ---------- 1. Multiplier / diviser par 10, 100, 1000 ----------
function genMultiplierDiviserPuissanceDix() {
  const base = pick([10, 100, 1000]);
  const isMult = Math.random() < 0.5;
  const decimals = pick([1, 2, 3]);
  const x = randDecimal(0.01, 900, decimals);
  const answer = roundTo(isMult ? x * base : x / base, 6);
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Puissances de dix",
    prompt: `\\(${frTex(x)} ${isMult ? "\\times" : "\\div"} ${base} = ?\\)`,
    answer,
    steps: [`\\(${frTex(x)} ${isMult ? "\\times" : "\\div"} ${base} = ${frTex(answer)}\\)`],
  };
}

// ---------- 2. Multiplier par 0,1 ; 0,01 ; 0,001 ----------
function genMultiplierParDecimalPuissance() {
  const mult = pick([0.1, 0.01, 0.001]);
  const decimals = pick([0, 1, 2]);
  const x = decimals === 0 ? randInt(2, 2000) : randDecimal(0.5, 900, decimals);
  const answer = roundTo(x * mult, 6);
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Puissances de dix",
    prompt: `\\(${frTex(x)} \\times ${frTex(mult)} = ?\\)`,
    answer,
    steps: [`\\(${frTex(x)} \\times ${frTex(mult)} = ${frTex(answer)}\\)`],
  };
}

// ---------- 3. Combien de fois plus grand / petit ----------
function genFoisPlusGrandPetit() {
  const base = randDecimal(1, 99, pick([1, 2]));
  const facteur = pick([10, 100, 1000]);
  const bigger = Math.random() < 0.5;
  const result = roundTo(bigger ? base * facteur : base / facteur, 4);
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Puissances de dix",
    prompt: `${fr(result)} est le nombre combien de fois plus ${bigger ? "grand" : "petit"} que ${fr(base)} ?`,
    answer: facteur,
    steps: [bigger ? `${fr(base)} \\times ${facteur} = ${fr(result)}` : `${fr(base)} \\div ${facteur} = ${fr(result)}`],
  };
}

// ---------- 4. Comparer avant/après multiplication ----------
function genComparerAvantApresMultiplication() {
  const x = randDecimal(0.1, 90, pick([1, 2]));
  const k = pick([10, 100, 2, 3, 5]);
  const left = roundTo(x + k, 4);
  const right = roundTo(x * k, 4);
  const correct = left > right ? ">" : left < right ? "<" : "=";
  return {
    type: "qcm",
    chapter: "Opérations sur les décimaux — Puissances de dix",
    prompt: `Complète par <, > ou = : \\(${frTex(x)} + ${k}\\) ... \\(${frTex(x)} \\times ${k}\\)`,
    answer: correct,
    options: ["<", ">", "="],
    steps: [`À gauche : ${fr(left)} ; à droite : ${fr(right)}.`],
  };
}

// ---------- 5. Conversions de longueurs (km / m / cm / mm) ----------
function genConversionLongueurs() {
  const chain = pick([
    { from: "km", to: "m", factor: 1000 },
    { from: "m", to: "cm", factor: 100 },
    { from: "cm", to: "mm", factor: 10 },
    { from: "m", to: "mm", factor: 1000 },
    { from: "km", to: "cm", factor: 100000 },
  ]);
  const value = randDecimal(0.5, 50, pick([1, 2]));
  const result = roundTo(value * chain.factor, 4);
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Puissances de dix",
    prompt: `Convertis ${fr(value)} ${chain.from} en ${chain.to}.`,
    answer: result,
    steps: [`1 ${chain.from} = ${chain.factor} ${chain.to}`, `${fr(value)} \\times ${chain.factor} = ${fr(result)}`],
  };
}

// =========================== Mémo 2 : multiplier deux décimaux ===========================

// ---------- 6. Multiplier deux nombres décimaux ----------
function genMultiplierDeuxDecimaux() {
  const a = randDecimal(0.02, 9, pick([1, 2]));
  const b = randDecimal(0.02, 9, pick([1, 2]));
  const answer = roundTo(a * b, 4);
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Multiplier deux décimaux",
    prompt: `\\(${frTex(a)} \\times ${frTex(b)} = ?\\)`,
    answer,
    steps: [`\\(${frTex(a)} \\times ${frTex(b)} = ${frTex(answer)}\\)`],
  };
}

// ---------- 7. Placer la virgule (choisir le bon résultat) ----------
function genChoisirBonneReponseVirgule() {
  const a = randDecimal(1, 99, pick([1, 2]));
  const b = randDecimal(1, 99, pick([1, 2]));
  const exact = roundTo(a * b, 4);
  const decoys = [roundTo(exact * 10, 4), roundTo(exact / 10, 4), roundTo(exact * 100, 4)];
  const uniqueValues = [...new Set([exact, ...decoys].map((v) => fr(v)))].slice(0, 4);
  const options = shuffle(uniqueValues);
  return {
    type: "qcm",
    chapter: "Opérations sur les décimaux — Multiplier deux décimaux",
    prompt: `Choisis le résultat de \\(${frTex(a)} \\times ${frTex(b)}\\) parmi les réponses proposées.`,
    answer: fr(exact),
    options,
    steps: [
      `On multiplie sans tenir compte des virgules, puis on place la virgule grâce à un ordre de grandeur.`,
      `Résultat : ${fr(exact)}`,
    ],
  };
}

// ---------- 8. Aire et périmètre d'un rectangle (dimensions décimales) ----------
function genRectangleDecimal() {
  const L = randDecimal(2, 12, 1);
  const l = randDecimal(1, 8, 1);
  const perim = roundTo(2 * (L + l), 2);
  const aire = roundTo(L * l, 2);
  const askAire = Math.random() < 0.5;
  const A = { id: "A", x: 20, y: 20 };
  const B = { id: "B", x: 20 + L * 15, y: 20 };
  const C = { id: "C", x: 20 + L * 15, y: 20 + l * 15 };
  const D = { id: "D", x: 20, y: 20 + l * 15 };
  const figure = {
    points: [A, B, C, D],
    segments: [
      { from: "A", to: "B", ticks: 1 },
      { from: "D", to: "C", ticks: 1 },
      { from: "A", to: "D", ticks: 2 },
      { from: "B", to: "C", ticks: 2 },
    ],
    rightAngles: [
      { at: "A", from: "D", to: "B" },
      { at: "B", from: "A", to: "C" },
      { at: "C", from: "B", to: "D" },
      { at: "D", from: "C", to: "A" },
    ],
    freeLabels: [
      { x: (A.x + B.x) / 2, y: A.y - 8, text: `${fr(L)} cm` },
      { x: A.x - 18, y: (A.y + D.y) / 2, text: `${fr(l)} cm` },
    ],
  };
  if (askAire) {
    return {
      type: "numeric",
      chapter: "Opérations sur les décimaux — Aire et périmètre",
      prompt: `ABCD est un rectangle. Calcule son aire, en cm².`,
      figure,
      answer: aire,
      steps: [`Aire = longueur × largeur`, `${fr(L)} \\times ${fr(l)} = ${fr(aire)}`],
    };
  }
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Aire et périmètre",
    prompt: `ABCD est un rectangle. Calcule son périmètre, en cm.`,
    figure,
    answer: perim,
    steps: [`Périmètre = 2 × (longueur + largeur)`, `2 \\times (${fr(L)} + ${fr(l)}) = ${fr(perim)}`],
  };
}

// ---------- 9. Ordre de grandeur d'un produit de décimaux ----------
function genOrdreDeGrandeurProduitDecimaux() {
  const a = randDecimal(1, 90, pick([1, 2]));
  const b = randDecimal(1, 20, pick([1, 2]));
  const estimate = Math.round(a) * Math.round(b);
  const exact = roundTo(a * b, 2);
  const tolerance = Math.max(2, Math.abs(estimate) * 0.15);
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Ordre de grandeur",
    prompt: `Donne un ordre de grandeur de \\(${frTex(a)} \\times ${frTex(b)}\\).`,
    answer: estimate,
    tolerance,
    steps: [`${Math.round(a)} \\times ${Math.round(b)} = ${estimate}`, `(Valeur exacte : environ ${fr(exact)})`],
  };
}

// ---------- 10. Problème : prix total (quantité × prix unitaire) ----------
function genProblemePrixTotal() {
  const qty = nonZero(2, 20);
  const prixUnitaire = randDecimal(0.5, 20, 2);
  const total = roundTo(qty * prixUnitaire, 2);
  const objet = pick(["CD", "BD", "timbres", "cahiers", "stylos", "livres"]);
  const prenom = pick(prenoms);
  const pronom = prenom.endsWith("e") ? "elle" : "il";
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Problèmes",
    prompt: `${prenom} achète ${qty} ${objet} à ${fr(prixUnitaire)} € l'unité. Combien va-t-${pronom} payer ?`,
    answer: total,
    steps: [`${qty} \\times ${frTex(prixUnitaire)} = ${frTex(total)}`],
  };
}

// =========================== Mémo 3 : diviser / division euclidienne ===========================

// ---------- 11. Diviser un décimal par un entier ----------
function genDiviserDecimalParEntier() {
  const diviseur = nonZero(2, 12);
  const quotient = randDecimal(0.5, 40, pick([1, 2]));
  const dividende = roundTo(quotient * diviseur, 3);
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Diviser",
    prompt: `\\(${frTex(dividende)} \\div ${diviseur} = ?\\)`,
    answer: quotient,
    steps: [`\\(${frTex(dividende)} \\div ${diviseur} = ${frTex(quotient)}\\)`],
  };
}

// ---------- 12. Division euclidienne (quotient et reste) ----------
function genDivisionEuclidienneQuotientReste() {
  const diviseur = nonZero(3, 15);
  const quotient = randInt(3, 40);
  const reste = randInt(0, diviseur - 1);
  const dividende = quotient * diviseur + reste;
  const askQuotient = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Division euclidienne",
    prompt: `Dans la division euclidienne de ${dividende} par ${diviseur}, quel est le ${askQuotient ? "quotient" : "reste"} ?`,
    answer: askQuotient ? quotient : reste,
    steps: [`${dividende} = ${diviseur} \\times ${quotient} + ${reste}`],
  };
}

// ---------- 13. Périmètre → longueur du côté (carré / triangle équilatéral) ----------
function genPerimetreDiviserCote() {
  const shape = pick(["carre", "triangle"]);
  const n = shape === "carre" ? 4 : 3;
  const cote = randDecimal(3, 25, 1);
  const perim = roundTo(cote * n, 2);
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Problèmes",
    prompt: `Le périmètre d'un ${shape === "carre" ? "carré" : "triangle équilatéral"} est de ${fr(perim)} cm. Combien mesure un côté ?`,
    answer: cote,
    steps: [`${fr(perim)} \\div ${n} = ${fr(cote)}`],
  };
}

// ---------- 14. Partage équitable d'une somme d'argent ----------
function genPartageArgentEquitable() {
  const nbPersonnes = nonZero(2, 8);
  const partShare = randDecimal(1, 40, 2);
  const total = roundTo(partShare * nbPersonnes, 2);
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Problèmes",
    prompt: `${nbPersonnes} amis souhaitent partager équitablement ${fr(total)} €. Quelle sera la part de chacun, en € ?`,
    answer: partShare,
    steps: [`${fr(total)} \\div ${nbPersonnes} = ${fr(partShare)}`],
  };
}

// ---------- 15. Partage d'objets avec reste (division euclidienne en contexte) ----------
function genPartageObjetsAvecReste() {
  const perGroup = nonZero(4, 12);
  const groups = randInt(15, 60);
  const extra = randInt(0, perGroup - 1);
  const total = groups * perGroup + extra;
  const objet = pick(["roses", "billes", "images", "perles", "bonbons"]);
  const prenom = pick(prenoms);
  const pronom = prenom.endsWith("e") ? "elle" : "il";
  const question = pick(["max", "reste", "manque"]);
  let answer;
  let promptExtra;
  if (question === "max") {
    answer = groups;
    promptExtra = `Combien de lots de ${perGroup} ${objet} ${pronom === "elle" ? "peut-elle" : "peut-il"} former au maximum ?`;
  } else if (question === "reste") {
    answer = extra;
    promptExtra = `Une fois les lots formés, combien de ${objet} restera-t-il ?`;
  } else {
    answer = perGroup - extra;
    promptExtra = `Combien de ${objet} manque-t-il pour former un lot de plus ?`;
  }
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Problèmes",
    prompt: `${prenom} dispose de ${total} ${objet} et souhaite former des lots de ${perGroup} ${objet} chacun. ${promptExtra}`,
    answer,
    steps: [`${total} = ${perGroup} \\times ${groups} + ${extra}`],
  };
}

// ---------- 16. Conversion de durées (minutes / secondes / heures) ----------
function genConversionDureeSecondes() {
  const direction = pick(["versSecondes", "versMinutes", "versHeuresEntieres"]);
  if (direction === "versSecondes") {
    const m = randInt(2, 50);
    return {
      type: "numeric",
      chapter: "Opérations sur les décimaux — Problèmes",
      prompt: `Convertis ${m} minutes en secondes.`,
      answer: m * 60,
      steps: [`${m} \\times 60 = ${m * 60}`],
    };
  }
  if (direction === "versMinutes") {
    const mins = randInt(2, 50);
    const s = mins * 60;
    return {
      type: "numeric",
      chapter: "Opérations sur les décimaux — Problèmes",
      prompt: `Convertis ${s} secondes en minutes.`,
      answer: mins,
      steps: [`${s} \\div 60 = ${mins}`],
    };
  }
  const mins = randInt(65, 300);
  const heures = Math.floor(mins / 60);
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Problèmes",
    prompt: `Combien d'heures ENTIÈRES y a-t-il dans ${mins} minutes ?`,
    answer: heures,
    steps: [`${mins} \\div 60 \\approx ${roundTo(mins / 60, 2)}`, `On garde la partie entière : ${heures} heure${heures > 1 ? "s" : ""}.`],
  };
}

// =========================== Mémo 4 : programme de calcul ===========================

// ---------- 17. Programme de calcul (sens direct ou sens inverse) ----------
function genProgrammeCalcul() {
  const stepCount = pick([2, 3]);
  const opsPool = [
    { desc: (k) => `Ajouter ${fr(k)}`, apply: (x, k) => x + k, pickK: () => randInt(1, 15) },
    { desc: (k) => `Soustraire ${fr(k)}`, apply: (x, k) => x - k, pickK: () => randInt(1, 10) },
    { desc: (k) => `Multiplier par ${fr(k)}`, apply: (x, k) => x * k, pickK: () => pick([2, 3, 4, 5, 10, 0.5]) },
    { desc: () => `Prendre la moitié`, apply: (x) => x / 2, pickK: () => null },
    { desc: () => `Doubler`, apply: (x) => x * 2, pickK: () => null },
  ];
  const chosenOps = Array.from({ length: stepCount }, () => pick(opsPool));
  const x0 = randInt(2, 20);
  let value = x0;
  const stepDescriptions = [];
  chosenOps.forEach((op, i) => {
    const k = op.pickK();
    stepDescriptions.push(`${i + 1}. ${op.desc(k)}`);
    value = roundTo(op.apply(value, k), 4);
  });
  const result = value;
  const programText = stepDescriptions.join(" ; ");
  const askBackward = Math.random() < 0.5;
  if (!askBackward) {
    return {
      type: "numeric",
      chapter: "Opérations sur les décimaux — Programme de calcul",
      prompt: `Voici un programme de calcul : Choisir un nombre ; ${programText}. Si je choisis ${x0}, quel résultat j'obtiens ?`,
      answer: result,
      steps: [`On applique les étapes dans l'ordre en partant de ${x0}.`, `Résultat : ${fr(result)}`],
    };
  }
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Programme de calcul",
    prompt: `Voici un programme de calcul : Choisir un nombre ; ${programText}. Je veux obtenir ${fr(result)} comme résultat final. Quel nombre dois-je choisir au départ ?`,
    answer: x0,
    steps: [`En partant de ${x0} et en appliquant les étapes, on obtient bien ${fr(result)}.`],
  };
}

// =========================== Problèmes ===========================

// ---------- 18. Coche les questions auxquelles on peut répondre ----------
function genProblemeCocheQuestionsEssence() {
  const prixLitre = randDecimal(1.5, 2.2, 2);
  const litres = randInt(5, 40);
  const items = [
    { text: `Combien coûtent ${litres} litres d'essence ?`, correct: true },
    { text: `Combien de kilomètres puis-je faire avec ${litres} litres d'essence ?`, correct: false },
    { text: `Combien de litres puis-je acheter avec ${randInt(10, 50)} euros ?`, correct: true },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Opérations sur les décimaux — Problèmes",
    prompt: `L'essence coûte ${fr(prixLitre)} € le litre. Coche les questions auxquelles tu pourrais répondre avec cette seule information.`,
    options,
    answer,
    steps: [`On peut calculer un coût total ou une quantité à partir d'un prix au litre, mais pas une distance sans connaître la consommation du véhicule.`],
  };
}

// ---------- 19. Comparaison multiplicative ("... fois moins/plus") ----------
function genProblemeComparaisonFoisMoins() {
  const facteur = pick([2, 3, 5, 10, 100]);
  const base = randInt(2, 30);
  const total = base * facteur;
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  const objet = pick(["billes", "images", "autocollants", "cartes"]);
  const pronom = p1.endsWith("e") ? "elle" : "il";
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Problèmes",
    prompt: `${p1} a ${facteur} fois moins de ${objet} que ${p2}, qui en a ${total}. Combien de ${objet} ${p1} a-t-${pronom} ?`,
    answer: base,
    steps: [`${total} \\div ${facteur} = ${base}`],
  };
}

// ---------- 20. Consommation quotidienne (division euclidienne en contexte) ----------
function genProblemeConsommationJours() {
  const total = randInt(200, 600);
  const parJour = randInt(15, 50);
  const nbJours = Math.floor(total / parJour);
  const prenom = pick(prenoms);
  const pronom = prenom.endsWith("e") ? "peut-elle" : "peut-il";
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Problèmes",
    prompt: `${prenom} a un paquet de céréales de ${total} g. Il/elle en mange environ ${parJour} g chaque matin. Combien de petits déjeuners ${pronom} prendre avec ce paquet ?`,
    answer: nbJours,
    steps: [`${total} \\div ${parJour} \\approx ${roundTo(total / parJour, 2)}`, `On garde la partie entière : ${nbJours} petits déjeuners complets.`],
  };
}

// ---------- 21. Prix à l'unité (division) ----------
function genProblemePrixUnitaireSaucisses() {
  const qty = nonZero(3, 12);
  const prixUnitaire = randDecimal(0.5, 3, 2);
  const total = roundTo(qty * prixUnitaire, 2);
  const objet = pick(["saucisses", "yaourts", "œufs", "biscuits"]);
  const prenom = pick(prenoms);
  return {
    type: "numeric",
    chapter: "Opérations sur les décimaux — Problèmes",
    prompt: `Chez le commerçant, ${prenom} achète ${qty} ${objet} pour ${fr(total)} €. Quel est le prix à l'unité, en € ?`,
    answer: prixUnitaire,
    steps: [`${fr(total)} \\div ${qty} = ${fr(prixUnitaire)}`],
  };
}

const GENERATORS = [
  genMultiplierDiviserPuissanceDix,
  genMultiplierParDecimalPuissance,
  genFoisPlusGrandPetit,
  genComparerAvantApresMultiplication,
  genConversionLongueurs,
  genMultiplierDeuxDecimaux,
  genChoisirBonneReponseVirgule,
  genRectangleDecimal,
  genOrdreDeGrandeurProduitDecimaux,
  genProblemePrixTotal,
  genDiviserDecimalParEntier,
  genDivisionEuclidienneQuotientReste,
  genPerimetreDiviserCote,
  genPartageArgentEquitable,
  genPartageObjetsAvecReste,
  genConversionDureeSecondes,
  genProgrammeCalcul,
  genProblemeCocheQuestionsEssence,
  genProblemeComparaisonFoisMoins,
  genProblemeConsommationJours,
  genProblemePrixUnitaireSaucisses,
];

// Tag de difficulté par générateur (voir nombres-decimaux.js pour la
// convention complète) — utilisé par les Parcours (débutant/avancé/expert).
const DIFFICULTY = {
  genMultiplierDiviserPuissanceDix: "facile",
  genMultiplierParDecimalPuissance: "facile",
  genFoisPlusGrandPetit: "standard",
  genComparerAvantApresMultiplication: "standard",
  genConversionLongueurs: "standard",
  genMultiplierDeuxDecimaux: "facile",
  genChoisirBonneReponseVirgule: "facile",
  genRectangleDecimal: "standard",
  genOrdreDeGrandeurProduitDecimaux: "standard",
  genProblemePrixTotal: "standard",
  genDiviserDecimalParEntier: "facile",
  genDivisionEuclidienneQuotientReste: "standard",
  genPerimetreDiviserCote: "standard",
  genPartageArgentEquitable: "standard",
  genPartageObjetsAvecReste: "standard",
  genConversionDureeSecondes: "standard",
  genProgrammeCalcul: "standard",
  genProblemeCocheQuestionsEssence: "expert",
  genProblemeComparaisonFoisMoins: "expert",
  genProblemeConsommationJours: "expert",
  genProblemePrixUnitaireSaucisses: "expert",
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
    id: "operations-decimaux",
    title: "Opérations sur les décimaux",
    description: "Multiplier et diviser des nombres décimaux, division euclidienne, programmes de calcul.",
    level: "sixieme",
    free: false,
    order: 3,
  },
  generate,
};
