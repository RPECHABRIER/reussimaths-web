// ---------------------------------------------------------------------------
// Chapitre : Statistiques (4e) — sous abonnement.
//
// Correspond au chapitre 7 du sommaire officiel : calculer une moyenne
// pondérée, calculer et interpréter une médiane, lire et construire des
// diagrammes (en bâtons, circulaire, semi-circulaire), vocabulaire des
// statistiques (population, caractère, effectif, fréquence). Reprend la
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
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const roundTo = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const fr = (n) => String(n).replace(".", ",");

// =========================== Calculer une moyenne pondérée ===========================

// ---------- 1. Moyenne pondérée d'une série de valeurs et d'effectifs ----------
function genMoyennePondereeSimpleNumeric() {
  const n = randInt(3, 5);
  const valeurs = [];
  const effectifs = [];
  let totalEffectif = 0;
  let sommeProduits = 0;
  for (let i = 0; i < n; i++) {
    const v = randInt(0, 20);
    const e = randInt(1, 10);
    valeurs.push(v);
    effectifs.push(e);
    totalEffectif += e;
    sommeProduits += v * e;
  }
  const answer = roundTo(sommeProduits / totalEffectif, 2);
  return {
    type: "numeric",
    chapter: "Statistiques — Moyennes",
    prompt: `Une série statistique a pour valeurs ${valeurs.join(", ")} avec pour effectifs respectifs ${effectifs.join(", ")}. Calcule la moyenne pondérée de cette série (arrondie au centième si nécessaire).`,
    answer,
    tolerance: 0.01,
    steps: [
      {
        type: "calcul",
        text: `\\text{Moyenne} = \\dfrac{${valeurs.map((v, i) => `${v} \\times ${effectifs[i]}`).join(" + ")}}{${totalEffectif}} = \\dfrac{${sommeProduits}}{${totalEffectif}} \\approx ${fr(answer)}`,
      },
    ],
  };
}

// ---------- 2. Moyenne pondérée avec coefficients (notes) ----------
function genMoyennePondereeCoefficientsNumeric() {
  const n = randInt(3, 4);
  const notes = [];
  const coefs = [];
  let sommeCoefs = 0;
  let sommeProduits = 0;
  for (let i = 0; i < n; i++) {
    const note = randInt(5, 20);
    const coef = randInt(1, 4);
    notes.push(note);
    coefs.push(coef);
    sommeCoefs += coef;
    sommeProduits += note * coef;
  }
  const answer = roundTo(sommeProduits / sommeCoefs, 2);
  return {
    type: "numeric",
    chapter: "Statistiques — Moyennes",
    prompt: `Un élève a obtenu les notes suivantes : ${notes.map((n, i) => `${n} (coefficient ${coefs[i]})`).join(", ")}. Calcule sa moyenne pondérée (arrondie au centième).`,
    answer,
    tolerance: 0.01,
    steps: [
      {
        type: "calcul",
        text: `\\text{Moyenne} = \\dfrac{${notes.map((n, i) => `${n} \\times ${coefs[i]}`).join(" + ")}}{${sommeCoefs}} \\approx ${fr(answer)}`,
      },
    ],
  };
}

// ---------- 3. Comparer deux moyennes ----------
function genComparerMoyennesQCM() {
  const genMean = () => {
    const n = randInt(3, 5);
    let sum = 0;
    const vals = [];
    for (let i = 0; i < n; i++) {
      const v = randInt(500, 2500);
      vals.push(v);
      sum += v;
    }
    return { vals, mean: sum / n };
  };
  let A = genMean();
  let B = genMean();
  while (Math.round(A.mean * 100) === Math.round(B.mean * 100)) B = genMean();
  const winner = A.mean > B.mean ? "Entreprise A" : "Entreprise B";
  return {
    type: "qcm",
    chapter: "Statistiques — Moyennes",
    prompt: `L'entreprise A a des salaires de ${A.vals.join(", ")} €. L'entreprise B a des salaires de ${B.vals.join(", ")} €. Quelle entreprise a le salaire moyen le plus élevé ?`,
    answer: winner,
    options: ["Entreprise A", "Entreprise B"],
    steps: [
      { type: "calcul", text: `Moyenne A = ${fr(roundTo(A.mean, 2))} €` },
      { type: "calcul", text: `Moyenne B = ${fr(roundTo(B.mean, 2))} €` },
    ],
  };
}

// =========================== Calculer et interpréter une médiane ===========================

// ---------- 4. Médiane d'une série à effectif impair ----------
function genMedianeEffectifImpairNumeric() {
  const n = pick([5, 7, 9, 11, 13]);
  const values = Array.from({ length: n }, () => randInt(0, 20)).sort((a, b) => a - b);
  const median = values[(n - 1) / 2];
  return {
    type: "numeric",
    chapter: "Statistiques — Médiane",
    prompt: `Voici une série de valeurs rangées dans l'ordre croissant : ${values.join(" ; ")}. Quelle est la médiane de cette série ?`,
    answer: median,
    steps: [{ type: "regle", text: `L'effectif total est ${n} (impair). La médiane est la valeur centrale : ${median}.` }],
  };
}

// ---------- 5. Médiane d'une série à effectif pair ----------
function genMedianeEffectifPairNumeric() {
  const half = randInt(3, 7);
  const n = half * 2;
  const values = Array.from({ length: n }, () => randInt(0, 20)).sort((a, b) => a - b);
  const v1 = values[half - 1];
  const v2 = values[half];
  const median = roundTo((v1 + v2) / 2, 2);
  return {
    type: "numeric",
    chapter: "Statistiques — Médiane",
    prompt: `Voici une série de valeurs rangées dans l'ordre croissant : ${values.join(" ; ")}. Quelle est la médiane de cette série ?`,
    answer: median,
    tolerance: 0.01,
    steps: [
      {
        type: "regle",
        text: `L'effectif total est ${n} (pair). La médiane est la moyenne des deux valeurs centrales : \\dfrac{${v1} + ${v2}}{2} = ${fr(median)}`,
      },
    ],
  };
}

// ---------- 6. Interpréter une médiane dans un contexte ----------
function genInterpreterMedianeQCM() {
  const contextes = [
    { sujet: "retard (en minutes) des bus d'une ligne", valeur: randInt(2, 15), unite: "min" },
    { sujet: "prix au kg de clémentines dans différents magasins", valeur: roundTo(1 + Math.random() * 3, 2), unite: "€" },
    { sujet: "température relevée chaque jour", valeur: randInt(-5, 20), unite: "°C" },
  ];
  const contexte = pick(contextes);
  const correct = `Au moins la moitié des valeurs sont inférieures ou égales à ${fr(contexte.valeur)} ${contexte.unite}`;
  const wrong1 = `Toutes les valeurs sont égales à ${fr(contexte.valeur)} ${contexte.unite}`;
  const wrong2 = `La valeur ${fr(contexte.valeur)} ${contexte.unite} est la valeur la plus fréquente de la série`;
  return {
    type: "qcm",
    chapter: "Statistiques — Médiane",
    prompt: `La médiane d'une série de ${contexte.sujet} est ${fr(contexte.valeur)} ${contexte.unite}. Que peut-on en conclure ?`,
    answer: correct,
    options: shuffle([correct, wrong1, wrong2]),
    steps: [{ type: "regle", text: `La médiane partage la série en deux groupes de même effectif : au moins la moitié des valeurs lui sont inférieures ou égales.` }],
  };
}

// =========================== Diagrammes (bâtons, circulaire, semi-circulaire) ===========================

// ---------- 7. Calculer l'angle d'un secteur circulaire ----------
function genAngleSecteurCirculaireNumeric() {
  const total = pick([100, 120, 150, 200, 240, 300, 360, 450, 480, 500]);
  const effectif = randInt(Math.floor(total * 0.05), Math.floor(total * 0.6));
  const angle = roundTo((effectif / total) * 360, 1);
  return {
    type: "numeric",
    chapter: "Statistiques — Diagrammes",
    prompt: `Dans un diagramme circulaire représentant ${total} personnes, une catégorie regroupe ${effectif} personnes. Quelle est la mesure de l'angle du secteur correspondant, en degrés (arrondie au dixième) ?`,
    answer: angle,
    tolerance: 0.1,
    steps: [{ type: "calcul", text: `\\dfrac{${effectif}}{${total}} \\times 360 \\approx ${fr(angle)}°` }],
  };
}

// ---------- 8. Retrouver un effectif à partir d'un angle ----------
function genEffectifDepuisAngleNumeric() {
  const total = pick([100, 120, 150, 200, 240, 300, 360, 450, 480, 500]);
  const effectif = randInt(Math.floor(total * 0.05), Math.floor(total * 0.6));
  const angle = roundTo((effectif / total) * 360, 1);
  return {
    type: "numeric",
    chapter: "Statistiques — Diagrammes",
    prompt: `Dans un diagramme circulaire représentant ${total} personnes, un secteur a un angle de ${fr(angle)}°. Combien de personnes ce secteur représente-t-il (arrondi à l'unité) ?`,
    answer: effectif,
    tolerance: 1,
    steps: [{ type: "calcul", text: `\\dfrac{${fr(angle)}}{360} \\times ${total} \\approx ${effectif}` }],
  };
}

// ---------- 9. Convertir un angle de diagramme circulaire en pourcentage ----------
function genPourcentageDepuisAngleNumeric() {
  const pourcentage = randInt(5, 80);
  const angle = roundTo(pourcentage * 3.6, 1);
  return {
    type: "numeric",
    chapter: "Statistiques — Diagrammes",
    prompt: `Un secteur d'un diagramme circulaire a un angle de ${fr(angle)}°. Quel pourcentage cela représente-t-il ?`,
    answer: pourcentage,
    tolerance: 0.5,
    steps: [{ type: "calcul", text: `${fr(angle)} \\div 3,6 = ${pourcentage}\\%` }],
  };
}

// ---------- 10. Trouver l'angle manquant d'un diagramme circulaire ou semi-circulaire ----------
function genAngleManquantCercleNumeric() {
  const isSemiCirculaire = Math.random() < 0.5;
  const totalAngle = isSemiCirculaire ? 180 : 360;
  const n = randInt(2, 4);
  const angles = [];
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const a = randInt(10, Math.floor(totalAngle / (n + 1)));
    angles.push(a);
    sum += a;
  }
  const manquant = totalAngle - sum;
  return {
    type: "numeric",
    chapter: "Statistiques — Diagrammes",
    prompt: `Dans un diagramme ${isSemiCirculaire ? "semi-circulaire" : "circulaire"}, les secteurs connus ont pour mesures ${angles.map((a) => `${a}°`).join(", ")}. Sachant que la somme totale des angles vaut ${totalAngle}°, quelle est la mesure du dernier secteur, en degrés ?`,
    answer: manquant,
    steps: [{ type: "calcul", text: `${totalAngle} - (${angles.join(" + ")}) = ${manquant}` }],
  };
}

// =========================== Vocabulaire des statistiques ===========================

// ---------- 11. Population étudiée ou caractère étudié ? ----------
function genCaracterePopulationQCM() {
  const contextes = [
    { population: "les élèves d'une classe", caractere: "la note obtenue au contrôle" },
    { population: "les habitants d'une ville", caractere: "l'âge" },
    { population: "les clients d'un magasin", caractere: "le montant de leurs achats" },
    { population: "les joueurs d'une équipe", caractere: "le nombre de buts marqués" },
  ];
  const ctx = pick(contextes);
  const askPopulation = Math.random() < 0.5;
  const correct = askPopulation ? ctx.population : ctx.caractere;
  const wrong = askPopulation ? ctx.caractere : ctx.population;
  return {
    type: "qcm",
    chapter: "Statistiques — Vocabulaire",
    prompt: `Dans une étude statistique sur ${ctx.population}, on étudie ${ctx.caractere}. Quel est ${askPopulation ? "la population étudiée" : "le caractère étudié"} ?`,
    answer: correct,
    options: [correct, wrong],
    steps: [
      {
        type: "regle",
        text: `La population est l'ensemble des individus étudiés (${ctx.population}), le caractère est la donnée observée (${ctx.caractere}).`,
      },
    ],
  };
}

// ---------- 12. Effectif total d'un tableau ----------
function genEffectifTotalTableauNumeric() {
  const n = randInt(4, 7);
  const effectifs = Array.from({ length: n }, () => randInt(1, 15));
  const total = effectifs.reduce((a, b) => a + b, 0);
  return {
    type: "numeric",
    chapter: "Statistiques — Vocabulaire",
    prompt: `Un tableau d'effectifs donne les valeurs suivantes : ${effectifs.join(", ")}. Quel est l'effectif total ?`,
    answer: total,
    steps: [{ type: "calcul", text: `${effectifs.join(" + ")} = ${total}` }],
  };
}

// ---------- 13. Fréquence d'une catégorie ----------
function genFrequenceNumeric() {
  const total = pick([20, 25, 40, 50, 80, 100, 120, 200]);
  const effectif = randInt(1, total - 1);
  const answer = roundTo(effectif / total, 4);
  return {
    type: "numeric",
    chapter: "Statistiques — Vocabulaire",
    prompt: `Dans une série de ${total} valeurs, une catégorie a un effectif de ${effectif}. Quelle est la fréquence de cette catégorie, en écriture décimale (arrondie au centième) ?`,
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `${effectif} \\div ${total} \\approx ${fr(answer)}` }],
  };
}

// ---------- 14. Identifier la catégorie d'effectif extrême ----------
function genCategorieExtremeQCM() {
  const nCategories = randInt(3, 5);
  const categories = ["A", "B", "C", "D", "E"].slice(0, nCategories);
  const usedVals = new Set();
  const effectifs = categories.map(() => {
    let v;
    do {
      v = randInt(1, 50);
    } while (usedVals.has(v));
    usedVals.add(v);
    return v;
  });
  const askMax = Math.random() < 0.5;
  const target = askMax ? Math.max(...effectifs) : Math.min(...effectifs);
  const targetCat = categories[effectifs.indexOf(target)];
  return {
    type: "qcm",
    chapter: "Statistiques — Vocabulaire",
    prompt: `Voici un tableau d'effectifs : ${categories.map((c, i) => `${c} : ${effectifs[i]}`).join(", ")}. Quelle catégorie a l'effectif le ${askMax ? "plus grand" : "plus petit"} ?`,
    answer: targetCat,
    options: categories,
    steps: [
      {
        type: "regle",
        text: `Les effectifs sont ${categories.map((c, i) => `${c} = ${effectifs[i]}`).join(", ")}. Le ${askMax ? "plus grand" : "plus petit"} est ${target} (catégorie ${targetCat}).`,
      },
    ],
  };
}

// =========================== Problèmes ===========================

// ---------- 15. Dépense totale d'un sous-groupe (moyenne pondérée en contexte) ----------
function genMoyennePondereeSousGroupesNumeric() {
  const totalPersonnes = pick([100, 120, 150, 200, 240, 300]);
  const pourcentageParticipants = randInt(20, 70);
  const depenseMoyenne = randInt(50, 400);
  const nbParticipants = Math.round((pourcentageParticipants / 100) * totalPersonnes);
  const totalDepense = nbParticipants * depenseMoyenne;
  return {
    type: "numeric",
    chapter: "Statistiques — Problèmes",
    prompt: `On interroge ${totalPersonnes} personnes. ${pourcentageParticipants} % d'entre elles comptent faire des achats, chacune dépensant en moyenne ${depenseMoyenne} €. Quel est le montant total des dépenses de ces personnes ?`,
    answer: totalDepense,
    steps: [
      { type: "calcul", text: `${pourcentageParticipants}/100 \\times ${totalPersonnes} = ${nbParticipants}\\ \\text{personnes}` },
      { type: "resultat", text: `${nbParticipants} \\times ${depenseMoyenne} = ${totalDepense}` },
    ],
  };
}

const GENERATORS = [
  genMoyennePondereeSimpleNumeric,
  genMoyennePondereeCoefficientsNumeric,
  genComparerMoyennesQCM,
  genMedianeEffectifImpairNumeric,
  genMedianeEffectifPairNumeric,
  genInterpreterMedianeQCM,
  genAngleSecteurCirculaireNumeric,
  genEffectifDepuisAngleNumeric,
  genPourcentageDepuisAngleNumeric,
  genAngleManquantCercleNumeric,
  genCaracterePopulationQCM,
  genEffectifTotalTableauNumeric,
  genFrequenceNumeric,
  genCategorieExtremeQCM,
  genMoyennePondereeSousGroupesNumeric,
];

const DIFFICULTY = {
  genMoyennePondereeSimpleNumeric: "facile",
  genMedianeEffectifImpairNumeric: "facile",
  genCaracterePopulationQCM: "facile",
  genEffectifTotalTableauNumeric: "facile",
  genFrequenceNumeric: "facile",
  genCategorieExtremeQCM: "facile",
  genMoyennePondereeCoefficientsNumeric: "standard",
  genComparerMoyennesQCM: "standard",
  genMedianeEffectifPairNumeric: "standard",
  genInterpreterMedianeQCM: "standard",
  genAngleSecteurCirculaireNumeric: "standard",
  genEffectifDepuisAngleNumeric: "standard",
  genPourcentageDepuisAngleNumeric: "standard",
  genAngleManquantCercleNumeric: "standard",
  genMoyennePondereeSousGroupesNumeric: "expert",
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
    id: "statistiques-quatrieme",
    title: "Statistiques",
    description: "Calculer une moyenne pondérée, calculer et interpréter une médiane, lire et construire des diagrammes, vocabulaire des statistiques.",
    pourquoi: "Moyenne, médiane et diagrammes permettent de résumer et comparer des séries de données réelles.",
    level: "quatrieme",
    free: false,
    order: 8,
  },
  generate,
};
