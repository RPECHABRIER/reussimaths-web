// ---------------------------------------------------------------------------
// Chapitre : Proportionnalité (4e) — sous abonnement.
//
// Correspond au chapitre 10 du sommaire officiel : calculer une quatrième
// proportionnelle, vérifier si un tableau est un tableau de proportionnalité,
// grandeurs produits et grandeurs quotients (vitesse, débit, densité),
// représentation graphique (points alignés avec l'origine), agrandissement
// et réduction de figures (effet sur longueurs, aires, volumes). Reprend la
// tâche intellectuelle des exercices fournis, avec des nombres, prénoms et
// contextes différents à chaque génération. Voir automatismes-quatrieme.js
// pour le thème "Calcul mental" associé.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const roundTo = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const fr = (n) => String(n).replace(".", ",");

// =========================== Calculer une quatrième proportionnelle ===========================

// ---------- 1. Quatrième proportionnelle ----------
function genQuatriemeProportionnelleNumeric() {
  const a = randInt(2, 30);
  const kNum = randInt(1, 20);
  const kDen = pick([1, 1, 2, 4, 5]);
  const k = roundTo(kNum / kDen, 3);
  const b = roundTo(a * k, 3);
  const c = randInt(2, 100);
  const d = roundTo(c * k, 3);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Quatrième proportionnelle",
    prompt: `Dans un tableau de proportionnalité, on a \\(\\dfrac{${fr(b)}}{${a}} = \\dfrac{?}{${c}}\\). Quelle est cette quatrième proportionnelle (arrondie au centième si nécessaire) ?`,
    answer: d,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${fr(b)} \\times ${c} \\div ${a} = ${fr(d)}` }],
  };
}

// ---------- 2. Un tableau est-il un tableau de proportionnalité ? ----------
function genVerifierTableauProportionnaliteQCM() {
  const isProportional = Math.random() < 0.5;
  const a = randInt(2, 20);
  const c = randInt(2, 20);
  const k = roundTo(randInt(1, 15) / pick([1, 2, 4, 5]), 3);
  const b = roundTo(a * k, 3);
  const d = isProportional ? roundTo(c * k, 3) : roundTo(c * k + randInt(1, 5), 3);
  return {
    type: "qcm",
    chapter: "Proportionnalité — Quatrième proportionnelle",
    prompt: `Le tableau suivant représente-t-il une situation de proportionnalité ? \\(${a}\\) → \\(${fr(b)}\\), \\(${c}\\) → \\(${fr(d)}\\)`,
    answer: isProportional ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      { type: "calcul", text: `${fr(b)} \\div ${a} = ${fr(roundTo(b / a, 3))}` },
      { type: "calcul", text: `${fr(d)} \\div ${c} = ${fr(roundTo(d / c, 3))}` },
    ],
  };
}

// =========================== Grandeurs produits et grandeurs quotients ===========================

// ---------- 3. Vitesse moyenne ----------
function genVitesseMoyenneNumeric() {
  const vitesse = randInt(5, 120);
  const temps = randInt(1, 10);
  const distance = vitesse * temps;
  return {
    type: "numeric",
    chapter: "Proportionnalité — Grandeurs produits et quotients",
    prompt: `Un mobile parcourt ${distance} km en ${temps} h. Quelle est sa vitesse moyenne, en km/h ?`,
    answer: vitesse,
    steps: [{ type: "calcul", text: `${distance} \\div ${temps} = ${vitesse}` }],
  };
}

// ---------- 4. Distance parcourue ----------
function genDistanceDepuisVitesseTempsNumeric() {
  const vitesse = randInt(5, 120);
  const tempsMin = randInt(6, 90);
  const tempsH = roundTo(tempsMin / 60, 4);
  const distance = roundTo(vitesse * tempsH, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Grandeurs produits et quotients",
    prompt: `Un véhicule roule à ${vitesse} km/h pendant ${tempsMin} minutes. Quelle distance parcourt-il, en km (arrondie au centième) ?`,
    answer: distance,
    tolerance: 0.01,
    steps: [
      { type: "calcul", text: `${tempsMin} \\text{ min} = ${fr(tempsH)} \\text{ h}` },
      { type: "resultat", text: `${vitesse} \\times ${fr(tempsH)} \\approx ${fr(distance)}` },
    ],
  };
}

// ---------- 5. Conversion de vitesse (km/h ↔ m/s) ----------
function genConversionVitesseKmhMsNumeric() {
  const versMs = Math.random() < 0.5;
  if (versMs) {
    const kmh = randInt(10, 200);
    const answer = roundTo(kmh / 3.6, 2);
    return {
      type: "numeric",
      chapter: "Proportionnalité — Grandeurs produits et quotients",
      prompt: `Convertis ${kmh} km/h en m/s (arrondi au centième).`,
      answer,
      tolerance: 0.01,
      steps: [{ type: "calcul", text: `${kmh} \\div 3,6 \\approx ${fr(answer)}` }],
    };
  }
  const ms = randInt(1, 60);
  const answer = roundTo(ms * 3.6, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Grandeurs produits et quotients",
    prompt: `Convertis ${ms} m/s en km/h.`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${ms} \\times 3,6 = ${fr(answer)}` }],
  };
}

// ---------- 6. Débit ----------
function genDebitNumeric() {
  const debit = randInt(2, 50);
  const temps = randInt(2, 20);
  const volume = debit * temps;
  return {
    type: "numeric",
    chapter: "Proportionnalité — Grandeurs produits et quotients",
    prompt: `Un robinet laisse s'écouler ${volume} L en ${temps} minutes. Quel est son débit, en L/min ?`,
    answer: debit,
    steps: [{ type: "calcul", text: `${volume} \\div ${temps} = ${debit}` }],
  };
}

// ---------- 7. Densité de population ----------
function genDensitePopulationNumeric() {
  const superficie = roundTo(randInt(10, 500) + Math.random(), 2);
  const habitants = randInt(1000, 900000);
  const answer = Math.round(habitants / superficie);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Grandeurs produits et quotients",
    prompt: `Une ville de ${fr(superficie)} km² compte ${habitants} habitants. Quelle est sa densité de population, en habitants/km² (arrondie à l'unité) ?`,
    answer,
    tolerance: 1,
    steps: [{ type: "calcul", text: `${habitants} \\div ${fr(superficie)} \\approx ${answer}` }],
  };
}

// ---------- 8. Grandeur produit ou grandeur quotient ? ----------
function genGrandeurProduitOuQuotientQCM() {
  const items = [
    { nom: "Aire (m²)", type: "Grandeur produit" },
    { nom: "Volume (m³)", type: "Grandeur produit" },
    { nom: "Vitesse (km/h)", type: "Grandeur quotient" },
    { nom: "Densité de population (hab/km²)", type: "Grandeur quotient" },
    { nom: "Débit (L/min)", type: "Grandeur quotient" },
    { nom: "Masse volumique (kg/m³)", type: "Grandeur quotient" },
  ];
  const item = pick(items);
  return {
    type: "qcm",
    chapter: "Proportionnalité — Grandeurs produits et quotients",
    prompt: `La grandeur « ${item.nom} » est-elle une grandeur produit ou une grandeur quotient ?`,
    answer: item.type,
    options: ["Grandeur produit", "Grandeur quotient"],
    steps: [{ type: "regle", text: `« ${item.nom} » est une ${item.type.toLowerCase()}.` }],
  };
}

// =========================== Représenter graphiquement la proportionnalité ===========================

// ---------- 9. Des points peuvent-ils être alignés avec l'origine ? ----------
function genPointsAlignesOrigineQCM() {
  const isAligned = Math.random() < 0.5;
  const k = roundTo(randInt(1, 10) / pick([1, 2]), 2);
  const xs = [randInt(1, 5), randInt(6, 10), randInt(11, 15)];
  const ys = isAligned ? xs.map((x) => roundTo(x * k, 2)) : xs.map((x, i) => (i === 2 ? roundTo(x * k + randInt(1, 4), 2) : roundTo(x * k, 2)));
  return {
    type: "qcm",
    chapter: "Proportionnalité — Représentation graphique",
    prompt: `On a placé ci-dessous les points \\(A\\), \\(B\\) et \\(C\\) dans un repère. Ces points peuvent-ils être alignés avec l'origine du repère (situation de proportionnalité) ?`,
    answer: isAligned ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "calcul", text: `On vérifie si y/x est constant : ${xs.map((x, i) => fr(roundTo(ys[i] / x, 3))).join(", ")}.` }],
    graph: {
      xMin: 0,
      xMax: Math.max(...xs) + 2,
      yMin: 0,
      yMax: Math.max(...ys) + 2,
      points: [
        { x: xs[0], y: ys[0], label: "A" },
        { x: xs[1], y: ys[1], label: "B" },
        { x: xs[2], y: ys[2], label: "C" },
      ],
    },
  };
}

// =========================== Agrandissement, réduction ===========================

// ---------- 10. Déterminer le rapport d'agrandissement ou de réduction ----------
function genAgrandissementReductionRapportNumeric() {
  const longueurInitiale = roundTo(randInt(2, 50) / pick([1, 2, 4]), 2);
  const k = roundTo(randInt(2, 40) / 10, 1);
  const longueurFinale = roundTo(longueurInitiale * k, 3);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Agrandissement, réduction",
    prompt: `Une figure a une longueur initiale de ${fr(longueurInitiale)} cm. Après agrandissement ou réduction, cette longueur devient ${fr(longueurFinale)} cm. Quel est le rapport k appliqué ?`,
    answer: k,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `${fr(longueurFinale)} \\div ${fr(longueurInitiale)} = ${fr(k)}` }],
  };
}

// ---------- 11. Nouvelle longueur après agrandissement/réduction ----------
function genLongueurApresAgrandissementNumeric() {
  const longueurInitiale = randInt(2, 50);
  const k = roundTo(randInt(2, 40) / 10, 1);
  const answer = roundTo(longueurInitiale * k, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Agrandissement, réduction",
    prompt: `Une figure de longueur ${longueurInitiale} cm subit un agrandissement (ou une réduction) de rapport ${fr(k)}. Quelle est la nouvelle longueur, en cm ?`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${longueurInitiale} \\times ${fr(k)} = ${fr(answer)}` }],
  };
}

// ---------- 12. Nouvelle aire après agrandissement/réduction ----------
function genAireApresAgrandissementNumeric() {
  const aireInitiale = randInt(2, 100);
  const k = roundTo(randInt(2, 40) / 10, 1);
  const answer = roundTo(aireInitiale * k * k, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Agrandissement, réduction",
    prompt: `Une figure d'aire ${aireInitiale} cm² subit un agrandissement (ou une réduction) de rapport ${fr(k)}. Quelle est la nouvelle aire, en cm² ?`,
    answer,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `${aireInitiale} \\times ${fr(k)}^2 = ${fr(answer)}` }],
  };
}

// ---------- 13. Nouveau volume après agrandissement/réduction ----------
function genVolumeApresAgrandissementNumeric() {
  const volumeInitial = randInt(2, 50);
  const k = roundTo(randInt(2, 30) / 10, 1);
  const answer = roundTo(volumeInitial * k * k * k, 3);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Agrandissement, réduction",
    prompt: `Un solide de volume ${volumeInitial} cm³ subit un agrandissement (ou une réduction) de rapport ${fr(k)}. Quel est le nouveau volume, en cm³ ?`,
    answer,
    tolerance: 0.1,
    steps: [{ type: "calcul", text: `${volumeInitial} \\times ${fr(k)}^3 = ${fr(answer)}` }],
  };
}

// ---------- 14. Agrandissement, réduction ou reproduction ? ----------
function genEstAgrandissementOuReductionQCM() {
  const k = pick([0.2, 0.5, 0.75, 1, 1.5, 2, 3, 5]);
  const answer = k > 1 ? "Agrandissement" : k < 1 ? "Réduction" : "Reproduction";
  return {
    type: "qcm",
    chapter: "Proportionnalité — Agrandissement, réduction",
    prompt: `Le rapport d'une transformation de figure vaut \\(k = ${fr(k)}\\). S'agit-il d'un agrandissement, d'une réduction ou d'une reproduction ?`,
    answer,
    options: ["Agrandissement", "Réduction", "Reproduction"],
    steps: [
      {
        type: "regle",
        text: k > 1 ? "k > 1 : c'est un agrandissement." : k < 1 ? "0 < k < 1 : c'est une réduction." : "k = 1 : c'est une reproduction (les longueurs ne changent pas).",
      },
    ],
  };
}

// =========================== Problèmes ===========================

// ---------- 15. Adapter une recette (proportionnalité en contexte) ----------
function genProblemeRecetteNumeric() {
  const personnesInit = pick([2, 4, 6]);
  const quantiteInit = randInt(50, 300);
  const personnesFinal = personnesInit + pick([2, 4, 6, 8]);
  const answer = roundTo((quantiteInit * personnesFinal) / personnesInit, 1);
  const ingredient = pick(["farine", "sucre", "beurre", "chocolat"]);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Problèmes",
    prompt: `Pour une recette destinée à ${personnesInit} personnes, il faut ${quantiteInit} g de ${ingredient}. Quelle quantité de ${ingredient} (en g) faut-il pour ${personnesFinal} personnes ?`,
    answer,
    tolerance: 0.5,
    steps: [{ type: "calcul", text: `${quantiteInit} \\times ${personnesFinal} \\div ${personnesInit} = ${fr(answer)}` }],
  };
}

// ---------- 16. Échelle d'une maquette (proportionnalité en contexte) ----------
function genProblemeEchelleNumeric() {
  const reel = randInt(10, 100);
  const miniature = randInt(20, 150);
  const autreReel = randInt(5, 80);
  const answer = roundTo((autreReel * miniature) / reel, 1);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Problèmes",
    prompt: `Sur une maquette, une distance réelle de ${reel} km est représentée par ${miniature} cm. Quelle distance en cm représente une distance réelle de ${autreReel} km sur cette même maquette (arrondie au dixième) ?`,
    answer,
    tolerance: 0.1,
    steps: [{ type: "calcul", text: `${miniature} \\times ${autreReel} \\div ${reel} = ${fr(answer)}` }],
  };
}

const GENERATORS = [
  genQuatriemeProportionnelleNumeric,
  genVerifierTableauProportionnaliteQCM,
  genVitesseMoyenneNumeric,
  genDistanceDepuisVitesseTempsNumeric,
  genConversionVitesseKmhMsNumeric,
  genDebitNumeric,
  genDensitePopulationNumeric,
  genGrandeurProduitOuQuotientQCM,
  genPointsAlignesOrigineQCM,
  genAgrandissementReductionRapportNumeric,
  genLongueurApresAgrandissementNumeric,
  genAireApresAgrandissementNumeric,
  genVolumeApresAgrandissementNumeric,
  genEstAgrandissementOuReductionQCM,
  genProblemeRecetteNumeric,
  genProblemeEchelleNumeric,
];

const DIFFICULTY = {
  genVerifierTableauProportionnaliteQCM: "facile",
  genDistanceDepuisVitesseTempsNumeric: "facile",
  genAgrandissementReductionRapportNumeric: "facile",
  genLongueurApresAgrandissementNumeric: "facile",
  genEstAgrandissementOuReductionQCM: "facile",
  genQuatriemeProportionnelleNumeric: "standard",
  genVitesseMoyenneNumeric: "standard",
  genConversionVitesseKmhMsNumeric: "standard",
  genDebitNumeric: "standard",
  genDensitePopulationNumeric: "standard",
  genGrandeurProduitOuQuotientQCM: "standard",
  genPointsAlignesOrigineQCM: "standard",
  genAireApresAgrandissementNumeric: "standard",
  genVolumeApresAgrandissementNumeric: "standard",
  genProblemeRecetteNumeric: "expert",
  genProblemeEchelleNumeric: "expert",
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
    id: "proportionnalite-quatrieme",
    title: "Proportionnalité",
    description: "Quatrième proportionnelle, grandeurs produits et quotients, représentation graphique, agrandissement et réduction de figures.",
    pourquoi: "Reconnaître une situation de proportionnalité, c'est l'une des compétences les plus utilisées au quotidien : recettes de cuisine, pourcentages, échelles de carte, conversions de devises.",
    level: "quatrieme",
    free: false,
    order: 11,
  },
  generate,
};
