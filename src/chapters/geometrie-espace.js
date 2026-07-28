// ---------------------------------------------------------------------------
// Chapitre : Géométrie dans l'espace (5e) — sous abonnement.
//
// Correspond au chapitre 6 du sommaire officiel : patrons et perspective
// cavalière (prismes droits, cylindres de révolution), volumes (pavé droit,
// cube, prisme droit, cylindre de révolution), conversions d'unités de
// volume et de capacité, aire du disque, figures/solides composés, et un peu
// de culture mathématique (solides de Platon, formule d'Euler S - A + F = 2,
// figures impossibles d'Escher). Reprend la tâche intellectuelle des
// exercices fournis (module B6 "Représentation de l'espace"), avec des
// nombres, prénoms et contextes différents à chaque génération.
// Voir automatismes-cinquieme.js (thème "geometrie-espace") pour la Série 1
// (Automatismes).
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

// =========================== Patrons et perspective cavalière ===========================

// ---------- 1. Nombre de faces latérales d'un patron de prisme droit ----------
function genNombreFacesLateralesPrismeNumeric() {
  const polygones = [
    { nom: "triangulaire", n: 3 },
    { nom: "à base carrée", n: 4 },
    { nom: "pentagonale", n: 5 },
    { nom: "hexagonale", n: 6 },
    { nom: "heptagonale", n: 7 },
    { nom: "octogonale", n: 8 },
  ];
  const { nom, n } = pick(polygones);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Patrons",
    prompt: `Un prisme droit a une base ${nom}. Combien de faces latérales rectangulaires comporte son patron ?`,
    answer: n,
    steps: [`Un prisme droit a autant de faces latérales que de côtés a sa base : ${n}.`],
  };
}

// ---------- 2. Propriété de la perspective cavalière ----------
function genPerspectiveCavaliereProprieteQCM() {
  const items = [
    {
      q: "Comment représente-t-on les arêtes cachées dans un dessin en perspective cavalière ?",
      r: "En pointillés",
      opts: ["En pointillés", "En traits épais", "En couleur rouge"],
    },
    {
      q: "Dans un dessin en perspective cavalière, que peut-on dire des arêtes parallèles et de même longueur dans la réalité ?",
      r: "Elles restent représentées par des segments parallèles et de même longueur",
      opts: [
        "Elles restent représentées par des segments parallèles et de même longueur",
        "Elles deviennent perpendiculaires sur le dessin",
        "Leurs longueurs sont toujours divisées par deux",
      ],
    },
    {
      q: "Sur un dessin en perspective cavalière, les longueurs sont-elles toujours conservées ?",
      r: "Non, les longueurs ne sont pas toujours conservées",
      opts: ["Non, les longueurs ne sont pas toujours conservées", "Oui, toutes les longueurs sont conservées", "Seules les longueurs verticales sont conservées"],
    },
  ];
  const it = pick(items);
  return {
    type: "qcm",
    chapter: "Géométrie dans l'espace — Perspective cavalière",
    prompt: it.q,
    answer: it.r,
    options: shuffle(it.opts),
    steps: [`C'est une règle de construction de la perspective cavalière.`],
  };
}

// ---------- 3. Faces, sommets, arêtes d'un prisme droit ----------
function genFacesSommetsAretesPrismeNumeric() {
  const n = randInt(3, 8);
  const mode = pick(["faces", "sommets", "aretes"]);
  const faces = n + 2;
  const sommets = 2 * n;
  const aretes = 3 * n;
  const noms = { 3: "triangulaire", 4: "à base carrée", 5: "pentagonale", 6: "hexagonale", 7: "heptagonale", 8: "octogonale" };
  const answer = mode === "faces" ? faces : mode === "sommets" ? sommets : aretes;
  const label = mode === "faces" ? "faces" : mode === "sommets" ? "sommets" : "arêtes";
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Patrons",
    prompt: `Un prisme droit a une base ${noms[n]} (${n} côtés). Combien de ${label} possède-t-il ?`,
    answer,
    steps: [
      mode === "faces"
        ? `Un prisme droit a 2 bases + autant de faces latérales que de côtés à la base : \\(2 + ${n} = ${faces}\\)`
        : mode === "sommets"
        ? `Chaque base a ${n} sommets : \\(2 \\times ${n} = ${sommets}\\)`
        : `${n} arêtes sur chaque base, plus ${n} arêtes latérales : \\(2 \\times ${n} + ${n} = ${aretes}\\)`,
    ],
  };
}

// =========================== Volumes ===========================

// ---------- 4. Volume d'un pavé droit ----------
function genVolumePaveDroitNumeric() {
  const L = randInt(2, 20);
  const l = randInt(2, 15);
  const h = randInt(2, 15);
  const answer = L * l * h;
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes",
    prompt: `Un pavé droit a pour dimensions ${L} cm, ${l} cm et ${h} cm. Quel est son volume, en cm³ ?`,
    answer,
    steps: [`${L} \\times ${l} \\times ${h} = ${answer}`],
  };
}

// ---------- 5. Volume d'un cube ----------
function genVolumeCubeNumeric() {
  const c = randInt(2, 15);
  const answer = c ** 3;
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes",
    prompt: `Un cube a une arête de ${c} cm. Quel est son volume, en cm³ ?`,
    answer,
    steps: [`${c} \\times ${c} \\times ${c} = ${answer}`],
  };
}

// ---------- 6. Volume d'un prisme droit à base triangulaire ----------
function genVolumePrismeDroitBaseTriangleNumeric() {
  const base = randInt(4, 16);
  const hauteurTriangle = randInt(3, 12);
  const hauteurPrisme = randInt(3, 20);
  const aireBase = roundTo((base * hauteurTriangle) / 2, 2);
  const answer = roundTo(aireBase * hauteurPrisme, 2);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes",
    prompt: `Un prisme droit a une base triangulaire de base ${base} cm et de hauteur ${hauteurTriangle} cm, et une hauteur (longueur du prisme) de ${hauteurPrisme} cm. Quel est son volume, en cm³ ?`,
    answer,
    steps: [`Aire de la base = (${base} \\times ${hauteurTriangle}) \\div 2 = ${fr(aireBase)}`, `Volume = ${fr(aireBase)} \\times ${hauteurPrisme} = ${fr(answer)}`],
  };
}

// ---------- 7. Volume d'un cylindre de révolution ----------
function genVolumeCylindreRevolutionNumeric() {
  const r = randInt(2, 12);
  const h = randInt(3, 20);
  const answer = roundTo(Math.PI * r * r * h, 2);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes",
    prompt: `Un cylindre de révolution a un rayon de base de ${r} cm et une hauteur de ${h} cm. Quel est son volume, en cm³, arrondi au centième ?`,
    answer,
    tolerance: piTolerance(answer),
    steps: [`\\pi \\times ${r}^2 \\times ${h} \\approx ${fr(answer)}`],
  };
}

// ---------- 8. Trouver une dimension manquante d'un pavé connaissant le volume ----------
function genTrouverHauteurPaveNumeric() {
  const L = randInt(2, 20);
  const l = randInt(2, 15);
  const h = randInt(2, 15);
  const volume = L * l * h;
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes",
    prompt: `Un pavé droit a un volume de ${volume} cm³. Sa longueur est ${L} cm et sa largeur est ${l} cm. Quelle est sa hauteur, en cm ?`,
    answer: h,
    steps: [`Hauteur = Volume \\div (Longueur \\times largeur) = ${volume} \\div (${L} \\times ${l}) = ${h}`],
  };
}

// ---------- 9. Conversion d'unités de volume ----------
function genConversionUnitesVolumeNumeric() {
  const unites = ["mm³", "cm³", "dm³", "m³"];
  const iFrom = randInt(0, 2);
  const iTo = iFrom + 1;
  const diff = iTo - iFrom;
  const valeur = randDecimal(0.1, 900, 2);
  const isVersGrand = true; // on convertit toujours vers l'unité immédiatement supérieure (facteur 1000)
  const answer = roundTo(valeur / 1000 ** diff, 6);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Conversions",
    prompt: `Convertis ${fr(valeur)} ${unites[iFrom]} en ${unites[iTo]}.`,
    answer,
    tolerance: Math.max(0.000001, roundTo(Math.abs(answer) * 0.001, 6)),
    steps: [`Pour passer de ${unites[iFrom]} à ${unites[iTo]}, on divise par 1000 : ${fr(valeur)} \\div 1000 = ${fr(answer)}`],
  };
}

// ---------- 10. Correspondance volume / capacité ----------
function genConversionVolumeCapaciteNumeric() {
  const mode = pick(["dm3-vers-L", "L-vers-dm3", "cm3-vers-mL", "mL-vers-cm3"]);
  const v = randDecimal(0.5, 500, 2);
  if (mode === "dm3-vers-L") {
    return {
      type: "numeric",
      chapter: "Géométrie dans l'espace — Volumes et capacités",
      prompt: `Convertis ${fr(v)} dm³ en litres (L).`,
      answer: v,
      tolerance: 0.01,
      steps: [`1 dm³ = 1 L, donc ${fr(v)} dm³ = ${fr(v)} L`],
    };
  }
  if (mode === "L-vers-dm3") {
    return {
      type: "numeric",
      chapter: "Géométrie dans l'espace — Volumes et capacités",
      prompt: `Convertis ${fr(v)} L en dm³.`,
      answer: v,
      tolerance: 0.01,
      steps: [`1 L = 1 dm³, donc ${fr(v)} L = ${fr(v)} dm³`],
    };
  }
  if (mode === "cm3-vers-mL") {
    return {
      type: "numeric",
      chapter: "Géométrie dans l'espace — Volumes et capacités",
      prompt: `Convertis ${fr(v)} cm³ en millilitres (mL).`,
      answer: v,
      tolerance: 0.01,
      steps: [`1 cm³ = 1 mL, donc ${fr(v)} cm³ = ${fr(v)} mL`],
    };
  }
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes et capacités",
    prompt: `Convertis ${fr(v)} mL en cm³.`,
    answer: v,
    tolerance: 0.01,
    steps: [`1 mL = 1 cm³, donc ${fr(v)} mL = ${fr(v)} cm³`],
  };
}

// =========================== Aire du disque et figures composées ===========================

// ---------- 11. Aire d'un disque ----------
function genAireDisqueNumeric() {
  const r = randInt(2, 20);
  const donneRayon = Math.random() < 0.5;
  const answer = roundTo(Math.PI * r * r, 2);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Aire du disque",
    prompt: donneRayon
      ? `Un disque a un rayon de ${r} cm. Quelle est son aire, en cm², arrondie au centième ?`
      : `Un disque a un diamètre de ${2 * r} cm. Quelle est son aire, en cm², arrondie au centième ?`,
    answer,
    tolerance: piTolerance(answer),
    steps: [`\\pi \\times ${r}^2 \\approx ${fr(answer)}`],
  };
}

// ---------- 12. Volume d'un pavé troué par un cylindre ----------
function genVolumePaveTroueParCylindreNumeric() {
  const L = randInt(6, 20);
  const l = randInt(4, 15);
  const h = randInt(3, 10);
  const r = randInt(1, Math.floor(Math.min(l, L) / 2) - 1 || 1);
  const volumePave = L * l * h;
  const volumeCylindre = roundTo(Math.PI * r * r * h, 2);
  const answer = roundTo(volumePave - volumeCylindre, 2);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes composés",
    prompt: `Un pavé droit de dimensions ${L} cm × ${l} cm × ${h} cm est troué de part en part par un cylindre de rayon ${r} cm (l'axe du trou est parallèle à la hauteur ${h} cm). Quel est le volume du solide restant, en cm³, arrondi au centième ?`,
    answer,
    tolerance: piTolerance(answer),
    steps: [
      `Volume du pavé = ${L} \\times ${l} \\times ${h} = ${volumePave}`,
      `Volume du cylindre retiré \\approx \\pi \\times ${r}^2 \\times ${h} \\approx ${fr(volumeCylindre)}`,
      `Volume restant \\approx ${volumePave} - ${fr(volumeCylindre)} \\approx ${fr(answer)}`,
    ],
  };
}

// ---------- 13. Volume d'un solide composé (pavé + demi-cylindre) ----------
function genVolumeComposePaveDemiCylindreNumeric() {
  const L = randInt(30, 90);
  const l = randInt(20, 50);
  const h = randInt(15, 40);
  const r = roundTo(l / 2, 1);
  const volumePave = L * l * h;
  const volumeDemiCylindre = roundTo((Math.PI * r * r * L) / 2, 2);
  const answer = roundTo(volumePave + volumeDemiCylindre, 2);
  const objet = pick(["coffre", "abri de jardin", "silo"]);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes composés",
    prompt: `Un ${objet} est composé d'un pavé droit de dimensions ${L} cm × ${l} cm × ${h} cm, surmonté d'un demi-cylindre de même longueur ${L} cm et de rayon ${fr(r)} cm. Quel est le volume total du ${objet}, en cm³, arrondi au centième ?`,
    answer,
    tolerance: piTolerance(answer),
    steps: [
      `Volume du pavé = ${L} \\times ${l} \\times ${h} = ${volumePave}`,
      `Volume du demi-cylindre \\approx (\\pi \\times ${fr(r)}^2 \\times ${L}) \\div 2 \\approx ${fr(volumeDemiCylindre)}`,
      `Volume total \\approx ${volumePave} + ${fr(volumeDemiCylindre)} \\approx ${fr(answer)}`,
    ],
  };
}

// ---------- 14. Combien de bouteilles pour une capacité donnée ----------
function genCapaciteBouteillesMinimumNumeric() {
  const capaciteBouteille = pick([0.33, 0.5, 1, 1.5, 2]);
  const volumeTotalL = randInt(20, 2000);
  const answer = Math.ceil(volumeTotalL / capaciteBouteille);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes et capacités",
    prompt: `On veut mettre en bouteilles ${volumeTotalL} L d'eau, en utilisant des bouteilles de ${fr(capaciteBouteille)} L. Quel est le nombre minimum de bouteilles nécessaires ?`,
    answer,
    steps: [`${volumeTotalL} \\div ${fr(capaciteBouteille)} = ${roundTo(volumeTotalL / capaciteBouteille, 3)}`, `On arrondit à l'entier supérieur : ${answer} bouteilles.`],
  };
}

// =========================== Culture : Platon, Euler, Escher ===========================

// ---------- 15. Solides de Platon : nombre de faces ----------
function genCultureSolidesPlatonFacesQCM() {
  const solides = [
    { nom: "un tétraèdre", faces: 4 },
    { nom: "un cube (hexaèdre)", faces: 6 },
    { nom: "un octaèdre", faces: 8 },
    { nom: "un dodécaèdre", faces: 12 },
    { nom: "un icosaèdre", faces: 20 },
  ];
  const { nom, faces } = pick(solides);
  return {
    type: "qcm",
    chapter: "Géométrie dans l'espace — Culture mathématique",
    prompt: `Combien de faces possède ${nom}, l'un des cinq solides de Platon ?`,
    answer: `${faces}`,
    options: shuffle([`${faces}`, `${faces === 4 ? 6 : 4}`, `${faces === 20 ? 12 : 20}`]),
    steps: [`${nom[0].toUpperCase()}${nom.slice(1)} possède ${faces} faces.`],
  };
}

// ---------- 16. Formule d'Euler (S - A + F = 2) ----------
function genCultureFormuleEulerNumeric() {
  const solides = [
    { nom: "le tétraèdre", F: 4, S: 4 },
    { nom: "le cube", F: 6, S: 8 },
    { nom: "l'octaèdre", F: 8, S: 6 },
    { nom: "le dodécaèdre", F: 12, S: 20 },
    { nom: "l'icosaèdre", F: 20, S: 12 },
  ];
  const { nom, F, S } = pick(solides);
  const A = S + F - 2;
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Culture mathématique",
    prompt: `Pour ${nom}, on compte ${F} faces et ${S} sommets. En utilisant la formule d'Euler S - A + F = 2 (S = nombre de sommets, A = nombre d'arêtes, F = nombre de faces), quel est le nombre d'arêtes A ?`,
    answer: A,
    steps: [`S - A + F = 2 \\Rightarrow A = S + F - 2 = ${S} + ${F} - 2 = ${A}`],
  };
}

// ---------- 17. Culture : M. C. Escher ----------
function genCultureEscherQCM() {
  const items = [
    {
      q: "L'artiste néerlandais M. C. Escher est notamment connu pour ses œuvres représentant :",
      r: "Des constructions impossibles et des pavages qui se transforment progressivement",
      opts: [
        "Des constructions impossibles et des pavages qui se transforment progressivement",
        "Des portraits réalistes de personnalités politiques",
        "Des paysages marins impressionnistes",
      ],
    },
    {
      q: "Quelle est la nationalité du graveur et dessinateur M. C. Escher (1898-1972), connu pour ses figures impossibles ?",
      r: "Néerlandaise",
      opts: ["Néerlandaise", "Italienne", "Allemande"],
    },
  ];
  const it = pick(items);
  return {
    type: "qcm",
    chapter: "Géométrie dans l'espace — Culture mathématique",
    prompt: it.q,
    answer: it.r,
    options: shuffle(it.opts),
    steps: [`M. C. Escher (1898-1972) est un artiste néerlandais dont les œuvres explorent des figures impossibles comme le triangle de Penrose ou le cube impossible.`],
  };
}

const GENERATORS = [
  genNombreFacesLateralesPrismeNumeric,
  genPerspectiveCavaliereProprieteQCM,
  genFacesSommetsAretesPrismeNumeric,
  genVolumePaveDroitNumeric,
  genVolumeCubeNumeric,
  genVolumePrismeDroitBaseTriangleNumeric,
  genVolumeCylindreRevolutionNumeric,
  genTrouverHauteurPaveNumeric,
  genConversionUnitesVolumeNumeric,
  genConversionVolumeCapaciteNumeric,
  genAireDisqueNumeric,
  genVolumePaveTroueParCylindreNumeric,
  genVolumeComposePaveDemiCylindreNumeric,
  genCapaciteBouteillesMinimumNumeric,
  genCultureSolidesPlatonFacesQCM,
  genCultureFormuleEulerNumeric,
  genCultureEscherQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "geometrie-espace",
    title: "Géométrie dans l'espace",
    description: "Patrons et perspective cavalière, volumes (pavé, cube, prisme, cylindre), conversions volume/capacité, aire du disque, figures composées, culture mathématique.",
    level: "cinquieme",
    free: false,
    order: 7,
  },
  generate,
};
