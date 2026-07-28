// ---------------------------------------------------------------------------
// Chapitre : Fonctions (5e) — sous abonnement.
//
// Correspond au chapitre 11 (dernier chapitre) du sommaire officiel :
// vocabulaire "en fonction de", notations (fléchée, fonctionnelle),
// évaluer une fonction définie par une formule, traduire un programme de
// calcul en fonction, décider si une relation de dépendance est
// proportionnelle ou non (tableaux), et utiliser des fonctions dans des
// contextes réels (puissance d'une éolienne, température ressentie,
// distance de freinage, volume d'un cylindre). Reprend la tâche
// intellectuelle des exercices fournis (module D2 "Fonctions"), avec des
// nombres, prénoms et contextes différents à chaque génération.
// Voir automatismes-cinquieme.js (thème "fonctions") pour la Série 1
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
const signedTex = (n) => `${n >= 0 ? "+" : ""}${frTex(n)}`;

const prenoms = [
  "Léa", "Nathan", "Camille", "Yanis", "Chloé", "Rayan", "Manon", "Hugo", "Inès", "Enzo",
  "Sofia", "Tom", "Maya", "Adam", "Lina", "Zoé", "Nolan", "Jade", "Liam", "Mila",
];

const piTolerance = (answer) => Math.max(0.05, roundTo(Math.abs(answer) * 0.005, 2));

// =========================== Vocabulaire et notations ===========================

// ---------- 1. Vocabulaire : "en fonction de" ----------
function genVocabulaireEnFonctionDeQCM() {
  const items = [
    {
      q: "Que signifie l'expression \"une grandeur s'exprime en fonction d'une autre\" ?",
      r: "La valeur de l'une dépend de la valeur de l'autre",
      opts: ["La valeur de l'une dépend de la valeur de l'autre", "Les deux grandeurs sont toujours égales", "Les deux grandeurs sont toujours proportionnelles"],
    },
    {
      q: "Sur un graphique représentant y en fonction de x, quelle grandeur place-t-on en abscisse ?",
      r: "x",
      opts: ["x", "y", "Aucune des deux"],
    },
    {
      q: "Comment appelle-t-on une notation du type f(x) = 2x + 3 ?",
      r: "Une notation fonctionnelle",
      opts: ["Une notation fonctionnelle", "Une notation fléchée", "Un tableau de proportionnalité"],
    },
  ];
  const it = pick(items);
  return {
    type: "qcm",
    chapter: "Fonctions — Vocabulaire",
    prompt: it.q,
    answer: it.r,
    options: shuffle(it.opts),
    steps: [`C'est une définition de base du vocabulaire des fonctions.`],
  };
}

// ---------- 2. Évaluer une fonction affine définie par une formule ----------
function genEvaluerFonctionAffineNumeric() {
  const a = nonZero(-9, 9);
  const b = randInt(-10, 10);
  const x = randInt(-8, 8);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Fonctions — Évaluer une fonction",
    prompt: `On considère la fonction f définie par \\(f(x) = ${a}x ${b >= 0 ? "+" : ""} ${b}\\). Calcule \\(f(${x})\\).`,
    answer,
    steps: [`f(${x}) = ${a} \\times ${x} ${b >= 0 ? "+" : ""} ${b} = ${answer}`],
  };
}

// ---------- 3. Trouver l'antécédent d'un nombre par une fonction affine ----------
function genTrouverAntecedentNumeric() {
  const a = pick([1, 2, 3, 4, 5, -1, -2, -3]);
  const b = randInt(-10, 10);
  const x = randInt(-8, 8);
  const y = a * x + b;
  return {
    type: "numeric",
    chapter: "Fonctions — Image et antécédent",
    prompt: `On considère la fonction f définie par \\(f(x) = ${a}x ${b >= 0 ? "+" : ""} ${b}\\). Quel est l'antécédent de ${y} par la fonction f (c'est-à-dire la valeur de x telle que \\(f(x) = ${y}\\)) ?`,
    answer: x,
    steps: [`${y} = ${a}x ${b >= 0 ? "+" : ""} ${b} \\Rightarrow x = (${y} - (${b})) \\div ${a} = ${x}`],
  };
}

// ---------- 4. Notation fléchée ----------
function genNotationFlecheeNumeric() {
  const a = nonZero(-8, 8);
  const b = randInt(-10, 10);
  const x = randInt(-8, 8);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Fonctions — Notation fléchée",
    prompt: `Une fonction f est définie par la notation fléchée \\(f : x \\longmapsto ${a}x ${b >= 0 ? "+" : ""} ${b}\\). Quelle est l'image de ${x} par cette fonction ?`,
    answer,
    steps: [`${a} \\times ${x} ${b >= 0 ? "+" : ""} ${b} = ${answer}`],
  };
}

// =========================== Programme de calcul et fonction ===========================

// ---------- 5. Programme de calcul traduit en fonction ----------
function genProgrammeCalculFonctionNumeric() {
  const add = randInt(1, 15);
  const mult = randInt(2, 6);
  const x = randInt(-10, 15);
  const etape1 = x + add;
  const answer = etape1 * mult;
  return {
    type: "numeric",
    chapter: "Fonctions — Programme de calcul",
    prompt: `On considère le programme de calcul suivant : choisir un nombre, ajouter ${add}, puis multiplier le résultat par ${mult}. On note f la fonction qui, à un nombre x, associe le résultat de ce programme. Calcule \\(f(${x})\\).`,
    answer,
    steps: [`${x} + ${add} = ${etape1}`, `${etape1} \\times ${mult} = ${answer}`],
  };
}

// ---------- 6. Retrouver le nombre de départ (fonction réciproque simple) ----------
function genRetrouverDepartFonctionNumeric() {
  const mult = randInt(2, 6);
  const sub = randInt(1, 10);
  const x = randInt(2, 20);
  const etape1 = x * mult;
  const resultat = etape1 - sub;
  return {
    type: "numeric",
    chapter: "Fonctions — Programme de calcul",
    prompt: `Une fonction f est définie par le programme : choisir un nombre, le multiplier par ${mult}, puis soustraire ${sub}. Sachant que \\(f(x) = ${resultat}\\), quelle est la valeur de x ?`,
    answer: x,
    steps: [`${resultat} + ${sub} = ${etape1}`, `${etape1} \\div ${mult} = ${x}`],
  };
}

// =========================== Relation de dépendance ===========================

// ---------- 7. Proportionnelle ou non, à partir d'un tableau ----------
function genRelationDependanceProportionnelleQCM() {
  const isProp = Math.random() < 0.5;
  if (isProp) {
    const cote = randInt(2, 6);
    const xs = [1, 2, 3, 4];
    const ys = xs.map((x) => x * cote);
    return {
      type: "qcm",
      chapter: "Fonctions — Relation de dépendance",
      prompt: `On considère des rectangles dont l'un des côtés mesure toujours ${cote} cm. Voici l'aire de ces rectangles en fonction de la longueur du second côté : ${xs.map((x, i) => `${x} cm → ${ys[i]} cm²`).join(" ; ")}. L'aire est-elle proportionnelle à la longueur du second côté ?`,
      answer: "Oui",
      options: ["Oui", "Non"],
      steps: [`Chaque aire s'obtient en multipliant la longueur par ${cote} (un nombre fixe) : c'est une situation de proportionnalité.`],
    };
  }
  const prixNormal = randInt(3, 10);
  const lot = randInt(2, 4);
  const prixPromo = randInt(prixNormal * lot - lot, prixNormal * lot - 1);
  const xs = [1, lot, 2 * lot];
  const ysPromo = xs.map((x) => (x % lot === 0 ? (x / lot) * prixPromo : x * prixNormal));
  return {
    type: "qcm",
    chapter: "Fonctions — Relation de dépendance",
    prompt: `Un article coûte ${prixNormal} € à l'unité, mais il est vendu par lots de ${lot} au prix de ${prixPromo} €. Voici le prix payé en fonction du nombre d'articles achetés (par lots complets) : ${xs.map((x, i) => `${x} → ${ysPromo[i]} €`).join(" ; ")}. Le prix payé est-il proportionnel au nombre d'articles ?`,
    answer: "Non",
    options: ["Oui", "Non"],
    steps: [`Le tarif change selon que l'on achète à l'unité ou par lot : les quotients prix/quantité ne sont pas tous égaux, ce n'est pas une situation de proportionnalité.`],
  };
}

// ---------- 8. Compléter un tableau de valeurs à partir d'une formule ----------
function genCompleterTableauValeursNumeric() {
  const a = nonZero(-6, 6);
  const b = randInt(-8, 8);
  const x = randInt(-10, 10);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Fonctions — Tableau de valeurs",
    prompt: `Une fonction f vérifie \\(f(x) = ${a}x ${b >= 0 ? "+" : ""} ${b}\\). Complète le tableau de valeurs : quelle est la valeur de \\(f(${x})\\) ?`,
    answer,
    steps: [`${a} \\times ${x} ${b >= 0 ? "+" : ""} ${b} = ${answer}`],
  };
}

// =========================== Fonctions en contexte réel ===========================

// ---------- 9. Puissance électrique d'une éolienne (P = 0,25 × D²) ----------
function genPuissanceEolienneNumeric() {
  const D = randInt(2, 40);
  const answer = roundTo(0.25 * D * D, 2);
  return {
    type: "numeric",
    chapter: "Fonctions — Contexte : éolienne",
    prompt: `La puissance électrique P (en kW) d'une éolienne soumise à un vent donné dépend du diamètre D (en m) de son rotor, selon la formule \\(P = 0,25 \\times D^2\\). Quelle est la puissance délivrée par une éolienne de diamètre ${D} m, en kW ?`,
    answer,
    tolerance: 0.02,
    steps: [`P = 0,25 \\times ${D}^2 = ${fr(answer)}`],
  };
}

// ---------- 10. Diamètre d'une éolienne connaissant la puissance ----------
function genDiametreEolienneNumeric() {
  const D = pick([2, 4, 6, 8, 10, 12, 14, 16, 20]);
  const puissance = 0.25 * D * D;
  return {
    type: "numeric",
    chapter: "Fonctions — Contexte : éolienne",
    prompt: `La puissance électrique P (en kW) d'une éolienne vérifie \\(P = 0,25 \\times D^2\\), où D est le diamètre du rotor (en m). Pour qu'une éolienne délivre une puissance de ${fr(roundTo(puissance, 2))} kW, quel doit être le diamètre D de son rotor, en m ?`,
    answer: D,
    steps: [`D^2 = ${fr(roundTo(puissance, 2))} \\div 0,25 = ${roundTo(puissance / 0.25, 2)}`, `D = ${D}`],
  };
}

// ---------- 11. Température ressentie (Tr = 1,38 × T − 8,77) ----------
function genTemperatureRessentieNumeric() {
  const T = randInt(-5, 30);
  const answer = roundTo(1.38 * T - 8.77, 2);
  return {
    type: "numeric",
    chapter: "Fonctions — Contexte : température ressentie",
    prompt: `Par un vent de 60 km/h, la température ressentie \\(T_r\\) (en °C) en fonction de la température ambiante T (en °C) vérifie \\(T_r = 1,38 \\times T - 8,77\\). Quelle est la température ressentie pour une température ambiante de ${T}°C (arrondie au centième) ?`,
    answer,
    tolerance: 0.02,
    steps: [`T_r = 1,38 \\times ${T} - 8,77 \\approx ${fr(answer)}`],
  };
}

// ---------- 12. Distance de freinage (proportionnalité route mouillée / sèche) ----------
function genDistanceFreinageNumeric() {
  const distanceSeche = randDecimal(2, 30, 1);
  const answer = roundTo(distanceSeche * 1.75, 2);
  return {
    type: "numeric",
    chapter: "Fonctions — Contexte : distance de freinage",
    prompt: `Sur route mouillée, la distance de freinage est 75 % plus grande que sur route sèche. Pour une distance de freinage de ${fr(distanceSeche)} m sur route sèche, quelle est la distance de freinage sur route mouillée, en m (arrondie au centième) ?`,
    answer,
    tolerance: 0.02,
    steps: [`${fr(distanceSeche)} \\times 1,75 = ${fr(answer)}`],
  };
}

// ---------- 13. Volume d'un cylindre en fonction de sa hauteur (rayon fixé) ----------
function genVolumeCylindreFonctionHauteurNumeric() {
  const r = randInt(2, 8);
  const h = randInt(2, 20);
  const answer = roundTo(Math.PI * r * r * h, 2);
  return {
    type: "numeric",
    chapter: "Fonctions — Contexte : volume d'un cylindre",
    prompt: `On considère des cylindres de rayon fixé à ${r} cm. Le volume V (en cm³) d'un tel cylindre s'exprime en fonction de sa hauteur h (en cm) par la formule \\(V = \\pi \\times ${r}^2 \\times h\\). Quel est le volume d'un cylindre de rayon ${r} cm et de hauteur ${h} cm, en cm³ (arrondi au centième) ?`,
    answer,
    tolerance: piTolerance(answer),
    steps: [`V = \\pi \\times ${r}^2 \\times ${h} \\approx ${fr(answer)}`],
  };
}

// ---------- 14. Aire d'un carré en fonction du côté ----------
function genAireCarreFonctionCoteNumeric() {
  const c = randInt(2, 15);
  const answer = c * c;
  return {
    type: "numeric",
    chapter: "Fonctions — Contexte : aire d'un carré",
    prompt: `L'aire A d'un carré s'exprime en fonction de la longueur c de son côté par la formule \\(A(c) = c \\times c\\). Quelle est l'aire d'un carré de côté ${c} cm, en cm² ?`,
    answer,
    steps: [`A(${c}) = ${c} \\times ${c} = ${answer}`],
  };
}

// ---------- 15. Lire un tableau représentant une fonction (âge / taille, croissance non affine) ----------
function genLireTableauFonctionCroissanceQCM() {
  const table = [
    [2, 80],
    [5, 100],
    [10, 125],
    [12, 150],
  ];
  const [x1, y1] = pick(table);
  const [x2, y2] = table.find(([x]) => x !== x1) ?? table[0];
  return {
    type: "qcm",
    chapter: "Fonctions — Relation de dépendance",
    prompt: `Le tableau suivant donne la taille (en cm) d'un enfant en fonction de son âge (en années) : ${table.map(([x, y]) => `${x} ans → ${y} cm`).join(" ; ")}. La taille est-elle proportionnelle à l'âge ?`,
    answer: "Non",
    options: ["Oui", "Non"],
    steps: [`Si la taille était proportionnelle à l'âge, tous les quotients taille ÷ âge seraient égaux, ce qui n'est pas le cas ici (par exemple ${y1} \\div ${x1} \\ne ${y2} \\div ${x2}).`],
  };
}

const GENERATORS = [
  genVocabulaireEnFonctionDeQCM,
  genEvaluerFonctionAffineNumeric,
  genTrouverAntecedentNumeric,
  genNotationFlecheeNumeric,
  genProgrammeCalculFonctionNumeric,
  genRetrouverDepartFonctionNumeric,
  genRelationDependanceProportionnelleQCM,
  genCompleterTableauValeursNumeric,
  genPuissanceEolienneNumeric,
  genDiametreEolienneNumeric,
  genTemperatureRessentieNumeric,
  genDistanceFreinageNumeric,
  genVolumeCylindreFonctionHauteurNumeric,
  genAireCarreFonctionCoteNumeric,
  genLireTableauFonctionCroissanceQCM,
];

function generate() {
  return pick(GENERATORS)();
}

export default {
  meta: {
    id: "fonctions",
    title: "Fonctions",
    description: "Vocabulaire (en fonction de, notations fléchée et fonctionnelle), évaluer une fonction, image et antécédent, programme de calcul, relation de dépendance proportionnelle ou non, fonctions en contexte réel.",
    level: "cinquieme",
    free: false,
    order: 12,
  },
  generate,
};
