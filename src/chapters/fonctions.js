// ---------------------------------------------------------------------------
// Chapitre : Fonctions (5e) — sous abonnement.
//
// Correspond au chapitre 11 (dernier chapitre) du sommaire officiel :
// vocabulaire "en fonction de", évaluer une formule dans un contexte
// concret, traduire un programme de calcul, décider si une relation de
// dépendance est proportionnelle ou non (tableaux), et utiliser des
// formules dans des contextes réels (puissance d'une éolienne, température
// ressentie, distance de freinage, volume d'un cylindre). Reprend la tâche
// intellectuelle des exercices fournis (module D2 "Fonctions"), avec des
// nombres, prénoms et contextes différents à chaque génération.
// Voir automatismes-cinquieme.js (thème "fonctions") pour la Série 1
// (Automatismes).
//
// NOTE (audit programme 2026, cycle 4) : ce chapitre est volontairement
// resté au niveau du programme de 5e — l'expression « en fonction de »,
// une formule ou un tableau de valeurs, TOUJOURS rattachés à un contexte
// concret nommé (le prix, la puissance, la température...). La notation
// fonctionnelle f(x), la notation fléchée f : x ⟼ ..., et le vocabulaire
// « image »/« antécédent » sont des objectifs explicites de Troisième
// (« Des exemples de fonctions sont étudiés en troisième, sans étude
// générale de la notion de fonction ») — retirés/reformulés d'ici.
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

// Contextes concrets réutilisés pour évaluer une formule "en fonction de"
// (voir NOTE en tête de fichier) : toujours une grandeur nommée avec son
// unité, jamais une fonction abstraite f(x).
const CONTEXTES_GRANDEUR_FONCTION = [
  { grandeur: "P", texte: "le prix (en €) d'une course de taxi", variable: "d", varTexte: "la distance parcourue (en km)" },
  { grandeur: "C", texte: "le coût (en €) de location d'un vélo", variable: "t", varTexte: "la durée de location (en heures)" },
  { grandeur: "S", texte: "la somme (en €) épargnée par un enfant", variable: "n", varTexte: "le nombre de semaines écoulées" },
];

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
      q: "Le prix P d'un article dépend de sa masse m. Comment traduit-on cela avec le vocabulaire du programme ?",
      r: "P s'exprime en fonction de m",
      opts: ["P s'exprime en fonction de m", "P est toujours égal à m", "m s'exprime en fonction du temps"],
    },
  ];
  const it = pick(items);
  return {
    type: "qcm",
    chapter: "Fonctions — Vocabulaire",
    prompt: it.q,
    answer: it.r,
    options: shuffle(it.opts),
    steps: [{ type: "regle", text: `C'est une définition de base du vocabulaire des fonctions.` }],
  };
}

// ---------- 2. Évaluer une formule "en fonction de" dans un contexte concret ----------
// NOTE (audit programme 2026) : reformulé pour rester ancré dans un contexte
// concret nommé, sans notation f(x) abstraite (voir NOTE en tête de fichier).
function genEvaluerFonctionAffineNumeric() {
  const ctx = pick(CONTEXTES_GRANDEUR_FONCTION);
  const a = randInt(2, 8);
  const b = randInt(1, 15);
  const x = randInt(1, 12);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Fonctions — Évaluer une formule",
    prompt: `${ctx.grandeur}, ${ctx.texte}, s'exprime en fonction de ${ctx.varTexte} (notée ${ctx.variable}) par la formule \\(${ctx.grandeur} = ${a}${ctx.variable} + ${b}\\). Quelle est la valeur de ${ctx.grandeur} pour ${ctx.variable} = ${x} ?`,
    answer,
    steps: [{ type: "calcul", text: `${ctx.grandeur} = ${a} \\times ${x} + ${b} = ${answer}` }],
  };
}

// NOTE (audit programme 2026, cycle 4) : deux générateurs ont été retirés
// d'ici — "genTrouverAntecedentNumeric" (vocabulaire "antécédent") et
// "genNotationFlecheeNumeric" (notation fléchée f : x ⟼ ...). Le programme
// officiel assigne explicitement le vocabulaire image/antécédent à la
// Troisième ; la recherche d'un nombre de départ à partir d'un résultat
// reste testée en 5e, mais via un programme de calcul concret plutôt qu'une
// fonction abstraite (voir genRetrouverDepartFonctionNumeric plus bas).

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
    steps: [
      { type: "calcul", text: `${x} + ${add} = ${etape1}` },
      { type: "calcul", text: `${etape1} \\times ${mult} = ${answer}` },
    ],
  };
}

// ---------- 6. Retrouver le nombre de départ d'un programme de calcul ----------
// NOTE (audit programme 2026) : reformulé sans notation "f(x) = ..." (voir
// NOTE en tête de fichier) — on reste sur le programme de calcul concret.
function genRetrouverDepartFonctionNumeric() {
  const mult = randInt(2, 6);
  const sub = randInt(1, 10);
  const x = randInt(2, 20);
  const etape1 = x * mult;
  const resultat = etape1 - sub;
  return {
    type: "numeric",
    chapter: "Fonctions — Programme de calcul",
    prompt: `On applique à un nombre le programme de calcul suivant : le multiplier par ${mult}, puis soustraire ${sub}. Sachant que le résultat obtenu est ${resultat}, quel était le nombre de départ ?`,
    answer: x,
    steps: [
      { type: "calcul", text: `${resultat} + ${sub} = ${etape1}` },
      { type: "calcul", text: `${etape1} \\div ${mult} = ${x}` },
    ],
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
      steps: [{ type: "regle", text: `Chaque aire s'obtient en multipliant la longueur par ${cote} (un nombre fixe) : c'est une situation de proportionnalité.` }],
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
    steps: [{ type: "regle", text: `Le tarif change selon que l'on achète à l'unité ou par lot : les quotients prix/quantité ne sont pas tous égaux, ce n'est pas une situation de proportionnalité.` }],
  };
}

// ---------- 8. Compléter un tableau de valeurs à partir d'une formule ----------
// NOTE (audit programme 2026) : reformulé dans un contexte concret nommé
// (voir NOTE en tête de fichier) — "produire un tableau de valeurs" est un
// objectif explicite de 5e, mais toujours rattaché à une grandeur nommée.
function genCompleterTableauValeursNumeric() {
  const ctx = pick(CONTEXTES_GRANDEUR_FONCTION);
  const a = randInt(2, 8);
  const b = randInt(1, 15);
  const x = randInt(1, 12);
  const answer = a * x + b;
  return {
    type: "numeric",
    chapter: "Fonctions — Tableau de valeurs",
    prompt: `On construit un tableau de valeurs pour ${ctx.grandeur} = ${a}${ctx.variable} + ${b}, où ${ctx.grandeur} (${ctx.texte}) s'exprime en fonction de ${ctx.varTexte} (notée ${ctx.variable}). Quelle valeur inscrire dans le tableau pour ${ctx.variable} = ${x} ?`,
    answer,
    steps: [{ type: "calcul", text: `${a} \\times ${x} + ${b} = ${answer}` }],
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
    steps: [{ type: "calcul", text: `P = 0,25 \\times ${D}^2 = ${fr(answer)}` }],
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
    steps: [
      { type: "calcul", text: `D^2 = ${fr(roundTo(puissance, 2))} \\div 0,25 = ${roundTo(puissance / 0.25, 2)}` },
      { type: "regle", text: `On cherche ensuite le nombre qui, multiplié par lui-même, donne ${roundTo(puissance / 0.25, 2)}.` },
      { type: "resultat", text: `D = ${D}` },
    ],
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
    steps: [{ type: "calcul", text: `T_r = 1,38 \\times ${T} - 8,77 \\approx ${fr(answer)}` }],
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
    steps: [
      { type: "regle", text: `75 % de plus, c'est multiplier par \\(1 + 0,75 = 1,75\\).` },
      { type: "calcul", text: `${fr(distanceSeche)} \\times 1,75 = ${fr(answer)}` },
    ],
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
    steps: [{ type: "calcul", text: `V = \\pi \\times ${r}^2 \\times ${h} \\approx ${fr(answer)}` }],
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
    steps: [{ type: "calcul", text: `A(${c}) = ${c} \\times ${c} = ${answer}` }],
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
    steps: [{ type: "regle", text: `Si la taille était proportionnelle à l'âge, tous les quotients taille ÷ âge seraient égaux, ce qui n'est pas le cas ici (par exemple ${y1} \\div ${x1} \\ne ${y2} \\div ${x2}).` }],
  };
}

const GENERATORS = [
  genVocabulaireEnFonctionDeQCM,
  genEvaluerFonctionAffineNumeric,
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

const DIFFICULTY = {
  genVocabulaireEnFonctionDeQCM: "facile",
  genEvaluerFonctionAffineNumeric: "facile",
  genCompleterTableauValeursNumeric: "facile",
  genAireCarreFonctionCoteNumeric: "facile",
  genProgrammeCalculFonctionNumeric: "standard",
  genRetrouverDepartFonctionNumeric: "standard",
  genRelationDependanceProportionnelleQCM: "standard",
  genPuissanceEolienneNumeric: "standard",
  genDiametreEolienneNumeric: "standard",
  genTemperatureRessentieNumeric: "standard",
  genVolumeCylindreFonctionHauteurNumeric: "standard",
  genLireTableauFonctionCroissanceQCM: "standard",
  genDistanceFreinageNumeric: "expert",
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
    id: "fonctions",
    title: "Fonctions",
    description: "Vocabulaire « en fonction de », évaluer une formule dans un contexte concret, programme de calcul, relation de dépendance proportionnelle ou non, formules en contexte réel.",
    pourquoi: "Comprendre la notion de fonction, c'est apprendre à décrire comment une quantité dépend d'une autre — la base de toute modélisation scientifique.",
    level: "cinquieme",
    free: false,
    order: 12,
  },
  generate,
};
