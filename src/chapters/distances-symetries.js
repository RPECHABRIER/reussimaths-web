// ---------------------------------------------------------------------------
// Chapitre : Distances et symétries (6e) — sous abonnement.
//
// Ce chapitre est le plus construction/dessin du manuel (Mémo 1 "distances et
// reports de longueurs", Mémo 2 "cercles et disques", Mémo 3 "médiatrices",
// Mémo 4 "symétrie axiale") : la grande majorité des exercices demandent de
// tracer, construire au compas/à la règle, reproduire une figure ou repasser
// un tracé — des tâches qui n'ont pas de réponse numérique/unique et ne
// peuvent donc pas être corrigées automatiquement avec le format actuel.
//
// Volontairement laissés de côté pour cette raison : la quasi-totalité des
// exercices 1-41 (tracer un segment/une médiatrice/un symétrique, reproduire
// une figure au compas, repasser des tracés), et les problèmes de
// construction/justification 47-55 (construire un point équidistant,
// compléter un plan, situer un pont/une citerne). Ce qui suit reprend
// uniquement les notions de ces mêmes Mémos qui ADMETTENT une réponse
// numérique/qcm/texte unique (propriétés de la médiatrice, de la symétrie,
// des cercles, additivité des longueurs), ainsi qu'une sélection de questions
// "coche les questions/affirmations" des problèmes.
//
// Convention nombres : les valeurs internes (answer, calculs) restent des
// nombres JS (point décimal), mais tout ce qui s'affiche à l'écran passe par
// fr()/frTex() pour utiliser la virgule française — voir fr()/frTex() ci-dessous.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const roundTo = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const randDecimal = (min, max, decimals) => roundTo(min + Math.random() * (max - min), decimals);

// Affichage français : virgule décimale. `fr` pour le texte normal, `frTex`
// pour l'intérieur d'un bloc LaTeX \( ... \) (accolades autour de la virgule
// pour éviter l'espacement supplémentaire que KaTeX ajoute après une virgule).
const fr = (n) => String(n).replace(".", ",");

function shuffleStatements(items) {
  const order = shuffle(items.map((_, i) => i));
  const options = order.map((i) => items[i].text);
  const answer = order.map((i, newIndex) => (items[i].correct ? newIndex : null)).filter((v) => v !== null);
  return { options, answer };
}

// =========================== Mémo 1 : distances et reports ===========================

// ---------- 1. Milieu d'un segment (additivité des longueurs) ----------
function genMilieuSegmentAdditivite() {
  const AM = randDecimal(0.5, 30, pick([0, 1]));
  const askAB = Math.random() < 0.5;
  if (askAB) {
    return {
      type: "numeric",
      chapter: "Distances et symétries — Distances",
      prompt: `M est le milieu du segment [AB]. AM = ${fr(AM)} cm. Quelle est la longueur AB ?`,
      answer: roundTo(AM * 2, 2),
      steps: [{ type: "calcul", text: `AB = 2 \\times AM = 2 \\times ${fr(AM)} = ${fr(roundTo(AM * 2, 2))}` }],
    };
  }
  const AB = roundTo(AM * 2, 2);
  return {
    type: "numeric",
    chapter: "Distances et symétries — Distances",
    prompt: `M est le milieu du segment [AB]. AB = ${fr(AB)} cm. Quelle est la longueur AM ?`,
    answer: AM,
    steps: [{ type: "calcul", text: `AM = AB \\div 2 = ${fr(AB)} \\div 2 = ${fr(AM)}` }],
  };
}

// ---------- 2. Additivité des longueurs pour des points alignés ----------
function genAdditiviteAlignes() {
  const AC = randDecimal(0.5, 20, pick([0, 1]));
  const CB = randDecimal(0.5, 20, pick([0, 1]));
  const AB = roundTo(AC + CB, 2);
  const askAB = Math.random() < 0.5;
  if (askAB) {
    return {
      type: "numeric",
      chapter: "Distances et symétries — Distances",
      prompt: `Les points A, C et B sont alignés dans cet ordre, avec AC = ${fr(AC)} cm et CB = ${fr(CB)} cm. Quelle est la longueur AB ?`,
      answer: AB,
      steps: [{ type: "calcul", text: `AB = AC + CB = ${fr(AC)} + ${fr(CB)} = ${fr(AB)}` }],
    };
  }
  return {
    type: "numeric",
    chapter: "Distances et symétries — Distances",
    prompt: `Les points A, C et B sont alignés dans cet ordre, avec AB = ${fr(AB)} cm et AC = ${fr(AC)} cm. Quelle est la longueur CB ?`,
    answer: CB,
    steps: [{ type: "calcul", text: `CB = AB - AC = ${fr(AB)} - ${fr(AC)} = ${fr(CB)}` }],
  };
}

// =========================== Mémo 2 : cercles et disques ===========================

// ---------- 3. Rayon / diamètre d'un cercle ----------
function genRayonDiametre() {
  const askDiametre = Math.random() < 0.5;
  if (askDiametre) {
    const r = randDecimal(0.5, 40, pick([0, 1]));
    return {
      type: "numeric",
      chapter: "Distances et symétries — Cercles et disques",
      prompt: `Un cercle a un rayon de ${fr(r)} cm. Quel est son diamètre, en cm ?`,
      answer: roundTo(r * 2, 2),
      steps: [{ type: "calcul", text: `${fr(r)} \\times 2 = ${fr(roundTo(r * 2, 2))}` }],
    };
  }
  const D = randDecimal(1, 80, pick([0, 1]));
  return {
    type: "numeric",
    chapter: "Distances et symétries — Cercles et disques",
    prompt: `Un cercle a un diamètre de ${fr(D)} cm. Quel est son rayon, en cm ?`,
    answer: roundTo(D / 2, 2),
    steps: [{ type: "calcul", text: `${fr(D)} \\div 2 = ${fr(roundTo(D / 2, 2))}` }],
  };
}

// ---------- 4. Position d'un point par rapport à un cercle ----------
function genPositionCercleDisque() {
  const r = randInt(3, 20);
  const relation = pick(["dans", "sur", "hors"]);
  const OP = relation === "dans" ? randInt(1, r - 1) : relation === "sur" ? r : r + randInt(1, 10);
  const options = ["P est dans le disque", "P est sur le cercle", "P est hors du disque"];
  const correct = relation === "dans" ? options[0] : relation === "sur" ? options[1] : options[2];
  return {
    type: "qcm",
    chapter: "Distances et symétries — Cercles et disques",
    prompt: `Le cercle de centre O a pour rayon ${r} cm. Le point P est situé à ${OP} cm de O. Que peut-on dire de la position de P ?`,
    answer: correct,
    options,
    steps: [{ type: "regle", text: `On compare OP = ${OP} cm au rayon ${r} cm.` }],
  };
}

// ---------- 5. Points sur / hors d'un cercle (figure) ----------
function genCerclePointsSurCercle() {
  const r = randInt(20, 45);
  const angles = shuffle([10, 100, 190, 280, 55, 145, 235, 325]).slice(0, 4);
  const distances = shuffle([r, r, roundTo(r * 0.6, 1), roundTo(r * 1.5, 1)]);
  const letters = ["A", "B", "C", "D"];
  const points = [{ id: "O", x: 0, y: 0, dx: -16, dy: 4 }];
  const items = [];
  letters.forEach((L, i) => {
    const ang = (angles[i] * Math.PI) / 180;
    const d = distances[i];
    const x = d * Math.cos(ang);
    const y = d * Math.sin(ang);
    points.push({ id: L, x, y, dy: -8 });
    items.push({ text: `Le point ${L} est sur le cercle.`, correct: Math.abs(d - r) < 0.5 });
  });
  const { options, answer } = shuffleStatements(items);
  const figure = { points, circles: [{ center: "O", radius: r }] };
  return {
    type: "multi",
    chapter: "Distances et symétries — Cercles et disques",
    prompt: `Le cercle ci-dessous a pour centre O. Coche les affirmations vraies.`,
    figure,
    options,
    answer,
    steps: [{ type: "regle", text: `Un point est sur le cercle si sa distance à O est exactement égale au rayon.` }],
  };
}

// =========================== Mémo 3 : médiatrices ===========================

// ---------- 6. Équidistance sur la médiatrice ----------
function genMediatriceEquidistance() {
  const MA = randDecimal(0.5, 25, pick([0, 1]));
  return {
    type: "numeric",
    chapter: "Distances et symétries — Médiatrice",
    prompt: `Le point M appartient à la médiatrice du segment [AB]. MA = ${fr(MA)} cm. Quelle est la longueur MB ?`,
    answer: MA,
    steps: [{ type: "regle", text: `Tout point de la médiatrice de [AB] est à la même distance de A et de B.` }],
  };
}

// ---------- 7. Médiatrice et triangle isocèle ----------
function genTriangleIsocelesMediatrice() {
  const sommet = pick(["A", "P", "S"]);
  return {
    type: "qcm",
    chapter: "Distances et symétries — Médiatrice",
    prompt: `${sommet}BC est un triangle isocèle en ${sommet}. I est le milieu de [BC]. Quel angle forme la droite (${sommet}I) avec la droite (BC) ?`,
    answer: "90°",
    options: ["90°", "45°", "60°", "Cela dépend du triangle"],
    steps: [
      {
        type: "regle",
        text: `Dans un triangle isocèle, la droite qui joint le sommet principal au milieu du côté opposé est la médiatrice de ce côté : elle lui est perpendiculaire.`,
      },
    ],
  };
}

// ---------- 7bis. Médiatrices d'un triangle : point de concours (cercle circonscrit) ----------
// Contenu officiel 6e (programme cycle 3, BO du 17-4-2025, domaine
// "Triangles") : "savoir que les médiatrices d'un triangle sont
// concourantes" et "connaître ... le cercle circonscrit à un triangle" —
// absent de tous les fichiers 6e existants avant cet ajout.
function genMediatricesConcourantesTriangle() {
  const r = randDecimal(1, 12, pick([0, 1]));
  const sommetInconnu = pick(["A", "B", "C"]);
  const sommetConnu = ["A", "B", "C"].find((s) => s !== sommetInconnu);
  return {
    type: "numeric",
    chapter: "Distances et symétries — Médiatrice",
    prompt: `ABC est un triangle. Ses trois médiatrices se coupent en un même point O, le centre du cercle circonscrit au triangle. On sait que O${sommetConnu} = ${fr(r)} cm. Quelle est la longueur O${sommetInconnu} ?`,
    answer: r,
    steps: [
      { type: "regle", text: `Les médiatrices d'un triangle sont concourantes en un point O, centre du cercle circonscrit au triangle : O est donc équidistant des trois sommets.` },
      { type: "resultat", text: `OA = OB = OC = ${fr(r)} cm, donc O${sommetInconnu} = ${fr(r)} cm.` },
    ],
  };
}

// ---------- 8. Vrai/faux : médiatrice et symétrie ----------
function genVraiFauxSymetrieMediatrice() {
  const pool = [
    { text: "Le point A (sur (d)) est équidistant de F et de F'.", correct: true },
    { text: "(d) est la médiatrice du segment [FF'].", correct: true },
    { text: "F et F' sont symétriques par rapport à (d).", correct: true },
    { text: "(d) coupe [FF'] en son milieu sans lui être perpendiculaire.", correct: false },
  ];
  const chosen = shuffle(pool).slice(0, 3);
  const { options, answer } = shuffleStatements(chosen);
  return {
    type: "multi",
    chapter: "Distances et symétries — Symétrie et médiatrice",
    prompt: `(d) est la médiatrice du segment [FF']. Un point A est situé sur la droite (d). Coche les affirmations vraies.`,
    options,
    answer,
    steps: [
      { type: "regle", text: `Tout point de la médiatrice de [FF'] est équidistant de F et F' ; F et F' sont symétriques par rapport à (d).` },
    ],
  };
}

// =========================== Mémo 4 : symétrie axiale ===========================

// ---------- 9. La symétrie conserve les longueurs ----------
function genProprieteSymetrieLongueur() {
  const AB = randDecimal(0.5, 30, pick([0, 1]));
  return {
    type: "numeric",
    chapter: "Distances et symétries — Symétrie axiale",
    prompt: `Le segment [A'B'] est le symétrique du segment [AB] par rapport à une droite (d). AB = ${fr(AB)} cm. Quelle est la longueur A'B' ?`,
    answer: AB,
    steps: [{ type: "regle", text: `Deux segments symétriques ont toujours la même longueur.` }],
  };
}

// ---------- 10. La symétrie conserve les angles ----------
function genProprieteSymetrieAngle() {
  const angle = randInt(10, 170);
  return {
    type: "numeric",
    chapter: "Distances et symétries — Symétrie axiale",
    prompt: `L'angle A'B'C' est le symétrique de l'angle ABC par rapport à une droite (d). L'angle ABC mesure ${angle}°. Quelle est la mesure de l'angle A'B'C' ?`,
    answer: angle,
    steps: [{ type: "regle", text: `Deux angles symétriques ont toujours la même mesure.` }],
  };
}

// ---------- 11. Symétrique réciproque d'un point ----------
function genSymetriqueReciproque() {
  const [p1, p2] = shuffle(["A", "B", "C", "D", "E", "F", "G", "H"]).slice(0, 2);
  return {
    type: "text",
    chapter: "Distances et symétries — Symétrie axiale",
    prompt: `Le point ${p1} est le symétrique du point ${p2} par rapport à la droite (d). Quel est le symétrique du point ${p2} par rapport à (d) ?`,
    answer: [p1],
    steps: [
      { type: "regle", text: `La symétrie axiale est réciproque : si ${p1} est le symétrique de ${p2}, alors ${p2} est le symétrique de ${p1}.` },
    ],
  };
}

// ---------- 12. Lire un codage de segments égaux (figure) ----------
function genFigureCodageSegmentsEgaux() {
  const O = { id: "O", x: 0, y: 0 };
  const LA = 45;
  const LB = 30;
  const anglesA = [20, 160];
  const anglesB = [80, 260];
  const labelsA = ["P", "Q"];
  const labelsB = ["R", "S"];
  const points = [O];
  const segments = [];
  anglesA.forEach((ang, i) => {
    const rad = (ang * Math.PI) / 180;
    points.push({ id: labelsA[i], x: LA * Math.cos(rad), y: LA * Math.sin(rad), dy: -8 });
    segments.push({ from: "O", to: labelsA[i], ticks: 1 });
  });
  anglesB.forEach((ang, i) => {
    const rad = (ang * Math.PI) / 180;
    points.push({ id: labelsB[i], x: LB * Math.cos(rad), y: LB * Math.sin(rad), dy: -8 });
    segments.push({ from: "O", to: labelsB[i], ticks: 2 });
  });
  const figure = { points, segments };
  const refIsA = Math.random() < 0.5;
  const refLabel = refIsA ? labelsA[0] : labelsB[0];
  const correctLabel = refIsA ? labelsA[1] : labelsB[1];
  const decoy = refIsA ? labelsB : labelsA;
  const options = shuffle([correctLabel, ...decoy]).map((l) => `[O${l}]`);
  return {
    type: "qcm",
    chapter: "Distances et symétries — Codage",
    prompt: `D'après le codage de la figure (les segments marqués du même nombre de traits ont la même longueur), quel segment a la même longueur que [O${refLabel}] ?`,
    figure,
    answer: `[O${correctLabel}]`,
    options,
    steps: [{ type: "regle", text: `[O${refLabel}] et [O${correctLabel}] portent le même nombre de marques : ils ont la même longueur.` }],
  };
}

// =========================== Problèmes et transversaux ===========================

// ---------- 13. Coche les questions auxquelles on peut répondre ----------
function genProblemeCocheQuestionsDistances() {
  const r = randInt(3, 15);
  const items = [
    { text: `Quelle est la longueur d'un rayon de ce cercle ?`, correct: true },
    { text: `Quelle est la longueur d'un diamètre de ce cercle ?`, correct: true },
    { text: `Quel est le centre exact d'un cercle inconnu ailleurs sur la figure ?`, correct: false },
  ];
  const { options, answer } = shuffleStatements(items);
  return {
    type: "multi",
    chapter: "Distances et symétries — Problèmes",
    prompt: `Un cercle de centre O a pour rayon ${r} cm. Coche les questions auxquelles tu pourrais répondre avec cette seule information.`,
    options,
    answer,
    steps: [{ type: "regle", text: `Connaître le rayon permet de déduire le diamètre, mais pas des informations sur d'autres figures.` }],
  };
}

// ---------- 14. Comparer des longueurs ----------
const LONGUEUR_FACTEURS = { mm: 1, cm: 10, dm: 100, m: 1000, dam: 10000, hm: 100000, km: 1000000 };
function randomLongueurExpr() {
  const unit = pick(["mm", "cm", "dm", "m", "dam", "km"]);
  const value = randInt(1, 500);
  return { text: `${value} ${unit}`, base: value * LONGUEUR_FACTEURS[unit] };
}
function genComparerLongueursQCM() {
  let e1, e2;
  do {
    e1 = randomLongueurExpr();
    e2 = randomLongueurExpr();
  } while (e1.base === e2.base);
  const correct = e1.base > e2.base ? e1.text : e2.text;
  return {
    type: "qcm",
    chapter: "Distances et symétries — Comparer des longueurs",
    prompt: `Quelle est la longueur la plus grande ?`,
    answer: correct,
    options: [e1.text, e2.text],
    steps: [{ type: "calcul", text: `${e1.text} = ${e1.base} mm ; ${e2.text} = ${e2.base} mm` }],
  };
}

// ---------- 15. Convertir des contenances ----------
const UNITES_CONTENANCE = ["hL", "daL", "L", "dL", "cL", "mL"];
function genConvertirContenances() {
  const i = randInt(0, UNITES_CONTENANCE.length - 2);
  const j = randInt(i + 1, UNITES_CONTENANCE.length - 1);
  const facteur = 10 ** (j - i);
  const value = randDecimal(0.5, 90, pick([0, 1, 2]));
  const result = roundTo(value * facteur, 6);
  return {
    type: "numeric",
    chapter: "Distances et symétries — Convertir des contenances",
    prompt: `Convertis ${fr(value)} ${UNITES_CONTENANCE[i]} en ${UNITES_CONTENANCE[j]}.`,
    answer: result,
    steps: [
      { type: "regle", text: `1 ${UNITES_CONTENANCE[i]} = ${facteur} ${UNITES_CONTENANCE[j]}` },
      { type: "resultat", text: `${fr(value)} \\times ${facteur} = ${fr(result)}` },
    ],
  };
}

// ---------- 16. Résoudre un problème de durée ----------
function genProblemeDureeSimple() {
  const type = pick(["duree", "arrivee"]);
  if (type === "duree") {
    const h1 = randInt(6, 18);
    const m1 = pick([0, 10, 15, 20, 30, 40, 45, 50]);
    const dureeMin = randInt(15, 180);
    const totalMin = h1 * 60 + m1 + dureeMin;
    const h2 = Math.floor(totalMin / 60) % 24;
    const m2 = totalMin % 60;
    return {
      type: "numeric",
      chapter: "Distances et symétries — Durées",
      prompt: `Paul part à ${h1} h ${String(m1).padStart(2, "0")} et rentre à ${h2} h ${String(m2).padStart(2, "0")}. Combien de temps est-il parti, en minutes ?`,
      answer: dureeMin,
      steps: [{ type: "calcul", text: `${h2 * 60 + m2} - ${h1 * 60 + m1} = ${dureeMin}` }],
    };
  }
  const h1 = randInt(6, 20);
  const m1 = pick([0, 10, 15, 20, 30, 40, 45, 50]);
  const hSup = randInt(0, 2);
  const mSup = pick([0, 10, 15, 20, 30, 40, 45, 50]);
  const dureeMin = hSup * 60 + mSup;
  const totalMin = h1 * 60 + m1 + dureeMin;
  const h2 = Math.floor(totalMin / 60) % 24;
  const m2 = totalMin % 60;
  const accepted =
    m2 === 0
      ? [`${h2}h`, `${h2}h00`, `${h2}:00`]
      : [`${h2}h${String(m2).padStart(2, "0")}`, `${h2}h ${String(m2).padStart(2, "0")}`, `${h2}:${String(m2).padStart(2, "0")}`];
  return {
    type: "text",
    chapter: "Distances et symétries — Durées",
    prompt: `Paul part à ${h1} h ${String(m1).padStart(2, "0")} et revient ${hSup} h ${String(mSup).padStart(2, "0")} plus tard. À quelle heure rentre-t-il ? (réponds au format 14h30)`,
    answer: accepted,
    steps: [{ type: "calcul", text: `${h1 * 60 + m1} + ${dureeMin} = ${totalMin} min → ${h2} h ${String(m2).padStart(2, "0")}` }],
  };
}

const GENERATORS = [
  genMilieuSegmentAdditivite,
  genAdditiviteAlignes,
  genRayonDiametre,
  genPositionCercleDisque,
  genCerclePointsSurCercle,
  genMediatriceEquidistance,
  genTriangleIsocelesMediatrice,
  genMediatricesConcourantesTriangle,
  genVraiFauxSymetrieMediatrice,
  genProprieteSymetrieLongueur,
  genProprieteSymetrieAngle,
  genSymetriqueReciproque,
  genFigureCodageSegmentsEgaux,
  genProblemeCocheQuestionsDistances,
  genComparerLongueursQCM,
  genConvertirContenances,
  genProblemeDureeSimple,
];

const DIFFICULTY = {
  genRayonDiametre: "facile",
  genPositionCercleDisque: "facile",
  genCerclePointsSurCercle: "facile",
  genProprieteSymetrieLongueur: "facile",
  genProprieteSymetrieAngle: "facile",
  genComparerLongueursQCM: "facile",
  genConvertirContenances: "facile",
  genMilieuSegmentAdditivite: "standard",
  genAdditiviteAlignes: "standard",
  genMediatriceEquidistance: "standard",
  genMediatricesConcourantesTriangle: "standard",
  genTriangleIsocelesMediatrice: "standard",
  genVraiFauxSymetrieMediatrice: "standard",
  genSymetriqueReciproque: "standard",
  genFigureCodageSegmentsEgaux: "standard",
  genProblemeCocheQuestionsDistances: "expert",
  genProblemeDureeSimple: "expert",
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
    id: "distances-symetries",
    title: "Distances et symétries",
    description: "Cercles, médiatrices, symétrie axiale, distances et longueurs.",
    pourquoi: "Mesurer une distance ou repérer un axe de symétrie, c'est ce qui permet de construire des objets précis et de reconnaître les régularités du monde qui nous entoure.",
    level: "sixieme",
    free: false,
    order: 6,
  },
  generate,
};
