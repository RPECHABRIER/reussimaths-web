// ---------------------------------------------------------------------------
// Chapitre : Proportionnalité (5e) — sous abonnement.
//
// Correspond au chapitre 10 du sommaire officiel : identifier une situation
// de proportionnalité (tableaux, quotients), calculer et utiliser un
// coefficient de proportionnalité, pourcentages (remise, majoration, taux,
// TVA), échelles (plans, cartes, maquettes), vitesse (distance, durée),
// proportionnalité appliquée au cercle (longueur d'arc, aire d'un secteur
// circulaire), et reconnaissance graphique d'une situation de
// proportionnalité. Reprend la tâche intellectuelle des exercices fournis
// (module D1 "Proportionnalité"), avec des nombres, prénoms et contextes
// différents à chaque génération.
// Voir automatismes-cinquieme.js (thème "proportionnalite-cinquieme") pour
// la Série 1 (Automatismes).
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
const fr = (n) => String(n).replace(".", ",");
const frTex = (n) => String(n).replace(".", "{,}");

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

const piTolerance = (answer) => Math.max(0.05, roundTo(Math.abs(answer) * 0.005, 2));

// =========================== Identifier une situation ===========================

// ---------- 1. Tester une situation de proportionnalité (quotients) ----------
function genTesterProportionnaliteQuotientsQCM() {
  const k = randDecimal(0.5, 5, 2);
  const a1 = randInt(2, 20);
  const a2 = randInt(2, 20);
  const isProp = Math.random() < 0.5;
  const b1 = roundTo(a1 * k, 2);
  const b2 = isProp ? roundTo(a2 * k, 2) : roundTo(a2 * k + nonZero(-3, 3), 2);
  return {
    type: "qcm",
    chapter: "Proportionnalité — Identifier une situation",
    prompt: `Un tableau donne les valeurs suivantes : quand la première grandeur vaut ${a1}, la seconde vaut ${fr(b1)} ; quand la première grandeur vaut ${a2}, la seconde vaut ${fr(b2)}. Ce tableau est-il un tableau de proportionnalité ?`,
    answer: isProp ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      {
        type: "calcul",
        text:
          `On compare les quotients : \\dfrac{${fr(b1)}}{${a1}} = ${fr(roundTo(b1 / a1, 3))}` +
          ` \\text{ et } \\dfrac{${fr(b2)}}{${a2}} = ${fr(roundTo(b2 / a2, 3))}`,
      },
      { type: "resultat", text: isProp ? `Les quotients sont égaux : la situation est proportionnelle.` : `Les quotients sont différents : la situation n'est pas proportionnelle.` },
    ],
  };
}

// ---------- 2. Calculer le coefficient de proportionnalité ----------
function genCalculerCoefficientNumeric() {
  const k = randDecimal(0.25, 8, 2);
  const a = randInt(2, 15);
  const b = roundTo(a * k, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Coefficient",
    prompt: `Dans un tableau de proportionnalité, la valeur ${a} correspond à ${fr(b)}. Quel est le coefficient de proportionnalité (de la première à la deuxième ligne) ?`,
    answer: k,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `Coefficient = ${fr(b)} \\div ${a} = ${fr(k)}` }],
  };
}

// ---------- 3. Trouver une valeur manquante grâce au coefficient ----------
function genTrouverValeurManquanteNumeric() {
  const k = randDecimal(0.5, 6, 2);
  const a1 = randInt(2, 12);
  const a2 = randInt(2, 20);
  const b1 = roundTo(a1 * k, 2);
  const answer = roundTo(a2 * k, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Valeur manquante",
    prompt: `Dans un tableau de proportionnalité, ${a1} correspond à ${fr(b1)}. À combien correspond ${a2} ?`,
    answer,
    tolerance: 0.02,
    steps: [
      { type: "calcul", text: `Coefficient = ${fr(b1)} \\div ${a1} = ${fr(roundTo(b1 / a1, 3))}` },
      { type: "calcul", text: `${a2} \\times ${fr(roundTo(b1 / a1, 3))} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 4. Quatrième proportionnelle (règle de trois) ----------
function genQuatriemeProportionnelleNumeric() {
  const a = randInt(2, 15);
  const b = randInt(2, 30);
  const c = randInt(2, 20);
  const answer = roundTo((b * c) / a, 2);
  const [p1] = shuffle(prenoms);
  const objet = pick(["baguettes de pain", "articles", "billets", "kilogrammes de pommes"]);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Règle de trois",
    prompt: `Pour ${a} ${objet}, ${p1} paie ${fr(b)} €. Combien ${p1} paierait-${p1[0] === "e" ? "elle" : "il"} pour ${c} ${objet} (au prix proportionnel), arrondi au centième ?`,
    answer,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `${fr(b)} \\div ${a} \\times ${c} = ${fr(answer)}` }],
  };
}

// =========================== Pourcentages ===========================

// ---------- 5. Pourcentage d'une quantité ----------
function genPourcentageDuneQuantiteNumeric() {
  const p = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]);
  const total = randInt(20, 500);
  const answer = roundTo((p / 100) * total, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Pourcentages",
    prompt: `Calcule ${p} % de ${total}.`,
    answer,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `${total} \\times \\dfrac{${p}}{100} = ${fr(answer)}` }],
  };
}

// ---------- 6. Prix après une remise ----------
function genPrixApresRemiseNumeric() {
  const prixInitial = randDecimal(10, 300, 2);
  const p = pick([5, 10, 15, 20, 25, 30, 40, 50]);
  const remise = roundTo((p / 100) * prixInitial, 2);
  const answer = roundTo(prixInitial - remise, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Pourcentages",
    prompt: `Un article coûte ${fr(prixInitial)} €. Le commerçant accorde une remise de ${p} %. Quel est le nouveau prix, en € (arrondi au centième) ?`,
    answer,
    tolerance: 0.02,
    steps: [
      { type: "calcul", text: `Remise = ${fr(prixInitial)} \\times \\dfrac{${p}}{100} \\approx ${fr(remise)}` },
      { type: "resultat", text: `Nouveau prix = ${fr(prixInitial)} - ${fr(remise)} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 7. Prix après une majoration (TVA) ----------
function genPrixApresMajorationNumeric() {
  const prixHT = randDecimal(5, 200, 2);
  const taux = pick([5.5, 10, 20]);
  const tva = roundTo((taux / 100) * prixHT, 2);
  const answer = roundTo(prixHT + tva, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Pourcentages",
    prompt: `Un produit a un prix hors taxe (HT) de ${fr(prixHT)} €. Le taux de TVA applicable est de ${fr(taux)} %. Quel est le prix toutes taxes comprises (TTC), en € (arrondi au centième) ?`,
    answer,
    tolerance: 0.02,
    steps: [
      { type: "calcul", text: `TVA = ${fr(prixHT)} \\times \\dfrac{${fr(taux)}}{100} \\approx ${fr(tva)}` },
      { type: "resultat", text: `Prix TTC = ${fr(prixHT)} + ${fr(tva)} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 8. Calculer un taux de pourcentage (réduction) ----------
function genCalculerTauxReductionNumeric() {
  const prixInitial = randInt(20, 300);
  const p = pick([5, 10, 15, 20, 25, 30, 40, 50]);
  const prixFinal = roundTo(prixInitial * (1 - p / 100), 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Pourcentages",
    prompt: `Un article coûtait initialement ${prixInitial} € et coûte maintenant ${fr(prixFinal)} €. Quel est le taux de réduction appliqué, en % ?`,
    answer: p,
    tolerance: 0.5,
    steps: [
      { type: "calcul", text: `Réduction = ${prixInitial} - ${fr(prixFinal)} = ${fr(roundTo(prixInitial - prixFinal, 2))}` },
      { type: "resultat", text: `Taux = (${fr(roundTo(prixInitial - prixFinal, 2))} \\div ${prixInitial}) \\times 100 = ${p} \\%` },
    ],
  };
}

// ---------- 9. Calculer un pourcentage (proportion) ----------
function genCalculerPourcentageProportionNumeric() {
  const total = randInt(50, 800);
  const partie = randInt(1, total - 1);
  const answer = roundTo((partie / total) * 100, 1);
  const objet = pick(["élèves", "habitants", "adhérents", "votants"]);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Pourcentages",
    prompt: `Sur ${total} ${objet}, ${partie} possèdent un vélo. Quel est le pourcentage de ${objet} possédant un vélo (arrondi au dixième) ?`,
    answer,
    tolerance: 0.1,
    steps: [{ type: "calcul", text: `(${partie} \\div ${total}) \\times 100 \\approx ${fr(answer)} \\%` }],
  };
}

// =========================== Échelles ===========================

// ---------- 10. Distance réelle à partir d'une échelle ----------
function genEchelleDistanceReelleNumeric() {
  const echelleN = pick([100, 200, 500, 1000, 2000, 5000, 10000, 25000, 100000]);
  const distanceCarte = randDecimal(0.5, 20, 1);
  const answerCm = roundTo(distanceCarte * echelleN, 1);
  const answerM = roundTo(answerCm / 100, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Échelles",
    prompt: `Sur une carte à l'échelle 1/${echelleN.toLocaleString("fr-FR")}, une distance mesure ${fr(distanceCarte)} cm. Quelle est la distance réelle correspondante, en mètres (arrondie au centième) ?`,
    answer: answerM,
    tolerance: Math.max(0.02, answerM * 0.001),
    steps: [
      { type: "calcul", text: `Distance réelle = ${fr(distanceCarte)} \\times ${echelleN} = ${fr(answerCm)} \\text{ cm}` },
      { type: "resultat", text: `${fr(answerCm)} \\text{ cm} = ${fr(answerM)} \\text{ m}` },
    ],
  };
}

// ---------- 11. Distance sur le plan à partir de l'échelle ----------
function genEchelleDistanceCarteNumeric() {
  const echelleN = pick([50, 100, 200, 500, 1000]);
  const distanceReelleM = randInt(5, 200);
  const distanceReelleCm = distanceReelleM * 100;
  const answer = roundTo(distanceReelleCm / echelleN, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Échelles",
    prompt: `Un plan est réalisé à l'échelle 1/${echelleN}. Une pièce mesure ${distanceReelleM} m de long en réalité. Quelle est sa longueur sur le plan, en cm (arrondie au centième) ?`,
    answer,
    tolerance: 0.02,
    steps: [
      { type: "calcul", text: `${distanceReelleM} \\text{ m} = ${distanceReelleCm} \\text{ cm}` },
      { type: "calcul", text: `${distanceReelleCm} \\div ${echelleN} = ${fr(answer)} \\text{ cm}` },
    ],
  };
}

// ---------- 12. Exprimer une échelle (plan / réalité même unité) ----------
function genExprimerEchelleNumeric() {
  const echelleN = pick([50, 100, 200, 500, 1000, 2000]);
  const distancePlan = randDecimal(0.5, 10, 1);
  const distanceReelleCm = roundTo(distancePlan * echelleN, 1);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Échelles",
    prompt: `Sur un plan, un segment de ${fr(distancePlan)} cm représente une distance réelle de ${fr(distanceReelleCm)} cm. L'échelle de ce plan est de la forme 1/N. Quelle est la valeur de N ?`,
    answer: echelleN,
    tolerance: 1,
    steps: [{ type: "calcul", text: `N = ${fr(distanceReelleCm)} \\div ${fr(distancePlan)} = ${echelleN}` }],
  };
}

// =========================== Vitesse ===========================

// ---------- 13. Distance parcourue (vitesse × temps) ----------
function genVitesseDistanceNumeric() {
  const vitesse = randInt(3, 130);
  const temps = randDecimal(0.5, 5, 1);
  const answer = roundTo(vitesse * temps, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Vitesse",
    prompt: `Un mobile roule à une vitesse constante de ${vitesse} km/h pendant ${fr(temps)} h. Quelle distance parcourt-il, en km ?`,
    answer,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `${vitesse} \\times ${fr(temps)} = ${fr(answer)}` }],
  };
}

// ---------- 14. Temps de parcours (distance ÷ vitesse) ----------
function genVitesseTempsNumeric() {
  const vitesse = randInt(3, 130);
  const temps = randDecimal(0.5, 5, 1);
  const distance = roundTo(vitesse * temps, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Vitesse",
    prompt: `Un mobile roule à une vitesse constante de ${vitesse} km/h et parcourt ${fr(distance)} km. Quelle est la durée du trajet, en heures (arrondie au dixième) ?`,
    answer: temps,
    tolerance: 0.1,
    steps: [{ type: "calcul", text: `${fr(distance)} \\div ${vitesse} \\approx ${fr(temps)}` }],
  };
}

// ---------- 15. Vitesse moyenne (distance ÷ temps) ----------
function genVitesseMoyenneNumeric() {
  const vitesse = randInt(3, 130);
  const temps = randDecimal(0.5, 5, 1);
  const distance = roundTo(vitesse * temps, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Vitesse",
    prompt: `Un mobile parcourt ${fr(distance)} km en ${fr(temps)} h, à vitesse constante. Quelle est sa vitesse moyenne, en km/h ?`,
    answer: vitesse,
    tolerance: 0.2,
    steps: [{ type: "calcul", text: `${fr(distance)} \\div ${fr(temps)} \\approx ${vitesse}` }],
  };
}

// =========================== Proportionnalité et cercle ===========================

// ---------- 16. Longueur d'un arc de cercle (proportionnalité à l'angle) ----------
function genLongueurArcCercleNumeric() {
  const r = randInt(2, 20);
  const angle = pick([30, 45, 60, 90, 120, 180, 270]);
  const perimetre = roundTo(2 * Math.PI * r, 4);
  const answer = roundTo((angle / 360) * perimetre, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Longueur d'arc",
    prompt: `On considère un cercle de rayon ${r} cm. Quelle est la longueur de l'arc correspondant à un angle au centre de ${angle}°, en cm (arrondie au centième) ?`,
    answer,
    tolerance: piTolerance(answer),
    steps: [
      { type: "calcul", text: `Périmètre du cercle \\approx ${fr(perimetre)} \\text{ cm}` },
      { type: "calcul", text: `Longueur de l'arc = \\dfrac{${angle}}{360} \\times ${fr(perimetre)} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 17. Aire d'un secteur circulaire (proportionnalité à l'angle) ----------
function genAireSecteurCirculaireNumeric() {
  const r = randInt(2, 20);
  const angle = pick([30, 45, 60, 90, 120, 180, 270]);
  const aireDisque = roundTo(Math.PI * r * r, 4);
  const answer = roundTo((angle / 360) * aireDisque, 2);
  return {
    type: "numeric",
    chapter: "Proportionnalité — Aire d'un secteur circulaire",
    prompt: `On considère un disque de rayon ${r} cm. Quelle est l'aire du secteur angulaire correspondant à un angle au centre de ${angle}°, en cm² (arrondie au centième) ?`,
    answer,
    tolerance: piTolerance(answer),
    steps: [
      { type: "calcul", text: `Aire du disque \\approx ${fr(aireDisque)} \\text{ cm}^2` },
      { type: "calcul", text: `Aire du secteur = \\dfrac{${angle}}{360} \\times ${fr(aireDisque)} \\approx ${fr(answer)}` },
    ],
  };
}

// =========================== Reconnaître graphiquement ===========================

// ---------- 18. Caractéristique graphique d'une situation de proportionnalité ----------
function genGraphiqueProportionnaliteQCM() {
  const items = [
    {
      q: "Quelle est la caractéristique d'un graphique représentant une situation de proportionnalité ?",
      r: "Les points sont alignés sur une droite passant par l'origine du repère",
    },
    {
      q: "Un graphique représente deux grandeurs. Les points sont alignés mais la droite ne passe pas par l'origine du repère. La situation est-elle proportionnelle ?",
      r: "Non",
    },
  ];
  const mode = pick(["definition", "test"]);
  if (mode === "definition") {
    return {
      type: "qcm",
      chapter: "Proportionnalité — Reconnaître graphiquement",
      prompt: items[0].q,
      answer: items[0].r,
      options: shuffle([items[0].r, "Les points forment une courbe quelconque", "Les points sont alignés sur une droite qui ne passe pas forcément par l'origine"]),
      steps: [{ type: "regle", text: `Deux grandeurs proportionnelles sont représentées par des points alignés sur une droite passant par l'origine du repère.` }],
    };
  }
  return {
    type: "qcm",
    chapter: "Proportionnalité — Reconnaître graphiquement",
    prompt: items[1].q,
    answer: items[1].r,
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: `Une droite qui ne passe pas par l'origine ne peut pas représenter une situation de proportionnalité.` }],
  };
}

// ---------- 19. Situation non proportionnelle : tarif avec abonnement ----------
function genTarifAvecAbonnementNonProportionnelQCM() {
  const abonnement = randInt(5, 20);
  const prixParUnite = randInt(1, 10);
  const n = randInt(2, 10);
  const prixSansAbo = n * prixParUnite;
  const prixAvecAbo = abonnement + n * prixParUnite;
  return {
    type: "qcm",
    chapter: "Proportionnalité — Identifier une situation",
    prompt: `Un cinéma propose un tarif avec abonnement : ${abonnement} € d'abonnement, puis ${prixParUnite} € par séance. Pour ${n} séances, le prix total est de ${prixAvecAbo} €. Ce tarif est-il proportionnel au nombre de séances ?`,
    answer: "Non",
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: `Sans l'abonnement fixe, le prix serait de ${prixSansAbo} € : la présence d'un montant fixe (l'abonnement) empêche la proportionnalité.` }],
  };
}

// ---------- 20. Agrandissement/réduction d'une figure (coefficient) ----------
function genAgrandissementReductionFigureNumeric() {
  const longueur = randInt(3, 15);
  const largeur = randInt(2, 12);
  const k = pick([0.5, 1.5, 2, 2.5, 3]);
  const answerL = roundTo(longueur * k, 2);
  const answerl = roundTo(largeur * k, 2);
  const askLongueur = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Proportionnalité — Agrandissement, réduction",
    prompt: `Un rectangle de longueur ${longueur} cm et de largeur ${largeur} cm est agrandi avec un coefficient ${fr(k)}. Quelle est la nouvelle ${askLongueur ? "longueur" : "largeur"}, en cm ?`,
    answer: askLongueur ? answerL : answerl,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: askLongueur ? `${longueur} \\times ${fr(k)} = ${fr(answerL)}` : `${largeur} \\times ${fr(k)} = ${fr(answerl)}` }],
  };
}

const GENERATORS = [
  genTesterProportionnaliteQuotientsQCM,
  genCalculerCoefficientNumeric,
  genTrouverValeurManquanteNumeric,
  genQuatriemeProportionnelleNumeric,
  genPourcentageDuneQuantiteNumeric,
  genPrixApresRemiseNumeric,
  genPrixApresMajorationNumeric,
  genCalculerTauxReductionNumeric,
  genCalculerPourcentageProportionNumeric,
  genEchelleDistanceReelleNumeric,
  genEchelleDistanceCarteNumeric,
  genExprimerEchelleNumeric,
  genVitesseDistanceNumeric,
  genVitesseTempsNumeric,
  genVitesseMoyenneNumeric,
  genLongueurArcCercleNumeric,
  genAireSecteurCirculaireNumeric,
  genGraphiqueProportionnaliteQCM,
  genTarifAvecAbonnementNonProportionnelQCM,
  genAgrandissementReductionFigureNumeric,
];

const DIFFICULTY = {
  genCalculerCoefficientNumeric: "facile",
  genTrouverValeurManquanteNumeric: "facile",
  genPourcentageDuneQuantiteNumeric: "facile",
  genExprimerEchelleNumeric: "facile",
  genTesterProportionnaliteQuotientsQCM: "standard",
  genQuatriemeProportionnelleNumeric: "standard",
  genPrixApresRemiseNumeric: "standard",
  genPrixApresMajorationNumeric: "standard",
  genCalculerTauxReductionNumeric: "standard",
  genCalculerPourcentageProportionNumeric: "standard",
  genEchelleDistanceReelleNumeric: "standard",
  genEchelleDistanceCarteNumeric: "standard",
  genVitesseDistanceNumeric: "standard",
  genVitesseTempsNumeric: "standard",
  genVitesseMoyenneNumeric: "standard",
  genGraphiqueProportionnaliteQCM: "standard",
  genAgrandissementReductionFigureNumeric: "standard",
  genLongueurArcCercleNumeric: "expert",
  genAireSecteurCirculaireNumeric: "expert",
  genTarifAvecAbonnementNonProportionnelQCM: "expert",
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
    id: "proportionnalite-cinquieme",
    title: "Proportionnalité",
    description: "Identifier une situation, coefficient de proportionnalité, pourcentages, échelles, vitesse, longueur d'arc et aire d'un secteur circulaire, reconnaissance graphique.",
    pourquoi: "Reconnaître une situation de proportionnalité, c'est l'une des compétences les plus utilisées au quotidien : recettes de cuisine, pourcentages, échelles de carte, conversions de devises.",
    level: "cinquieme",
    free: false,
    order: 11,
  },
  generate,
};
