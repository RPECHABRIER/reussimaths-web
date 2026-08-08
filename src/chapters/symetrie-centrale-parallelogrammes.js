// ---------------------------------------------------------------------------
// Chapitre : Symétrie centrale, parallélogrammes (5e) — sous abonnement.
//
// Correspond au chapitre 7 du sommaire officiel : définir et utiliser la
// symétrie centrale (conservation des longueurs/aires/angles/alignements/
// parallélisme, centre de symétrie d'une figure usuelle), utiliser les angles
// et les droites parallèles (angles opposés par le sommet, bissectrice,
// alternes-internes, correspondants, cas particulier des perpendiculaires),
// définir, reconnaître et utiliser les propriétés du parallélogramme (cas
// particuliers carré/rectangle/losange, aire = base × hauteur).
// Reprend la tâche intellectuelle des exercices fournis (modules B2
// "Transformations géométriques", B3 "Angles", B5 "Parallélogrammes"), avec
// des nombres, prénoms et contextes différents à chaque génération.
// Voir automatismes-cinquieme.js (thème "symetrie-centrale-parallelogrammes")
// pour la Série 1 (Automatismes).
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

// Figure "cours" : symétrie centrale d'un segment [AB] par rapport à un
// centre O (aucun helper de ce type n'existait déjà dans ce fichier).
function buildSymetrieCentraleFigure() {
  const O = { id: "O", x: 80, y: 60 };
  const A = { id: "A", x: 30, y: 30, dx: -10, dy: -6 };
  const B = { id: "B", x: 30, y: 90, dx: -10, dy: 8 };
  const Ap = { id: "Ap", x: 130, y: 90, label: "A'", dx: 10, dy: 8 };
  const Bp = { id: "Bp", x: 130, y: 30, label: "B'", dx: 10, dy: -6 };
  return {
    points: [O, A, B, Ap, Bp],
    segments: [
      { from: "A", to: "B" },
      { from: "Ap", to: "Bp" },
      { from: "A", to: "O", dashed: true },
      { from: "O", to: "Ap", dashed: true },
      { from: "B", to: "O", dashed: true },
      { from: "O", to: "Bp", dashed: true },
    ],
  };
}

// Figure "cours" : deux droites parallèles coupées par une sécante, avec
// deux angles marqués (correspondants) — aucun helper de ce type n'existait
// déjà dans ce fichier.
function buildParallelesSecanteFigure() {
  const I1 = { id: "I1", x: 70, y: 20, hideLabel: true };
  const Q1 = { id: "Q1", x: 130, y: 20, hideDot: true, hideLabel: true };
  const I2 = { id: "I2", x: 100, y: 90, hideLabel: true };
  const Q2 = { id: "Q2", x: 160, y: 90, hideDot: true, hideLabel: true };
  return {
    points: [I1, Q1, I2, Q2],
    lines: [
      { from: "I1", to: "Q1", extend: 30, label: "d₁" },
      { from: "I2", to: "Q2", extend: 30, label: "d₂" },
      { from: "I1", to: "I2", extend: 25 },
    ],
    freeLabels: [
      { x: I1.x + 16, y: I1.y + 16, text: "a" },
      { x: I2.x + 16, y: I2.y - 14, text: "a" },
    ],
  };
}

function shuffleStatements(items) {
  const order = shuffle(items.map((_, i) => i));
  const options = order.map((i) => items[i].text);
  const answer = order.map((i, newIndex) => (items[i].correct ? newIndex : null)).filter((v) => v !== null);
  return { options, answer };
}

// Parallélogramme ABCD dessiné par cisaillement d'un rectangle : A,B en haut,
// D,C en bas, décalés horizontalement de shiftLen. H est le pied de la
// hauteur issue de D sur la droite (AB), utilisé pour illustrer aire = base × hauteur.
function buildParallelogrammeFigure(base, hauteur, shiftLen, { withHauteur = false, withDiagonales = false } = {}) {
  const scale = Math.min(9, 130 / Math.max(base, hauteur, Math.abs(shiftLen) + base));
  const originX = 30 - Math.min(0, shiftLen) * scale;
  const Apt = { id: "A", x: originX, y: 20 };
  const Bpt = { id: "B", x: originX + base * scale, y: 20 };
  const Dpt = { id: "D", x: originX + shiftLen * scale, y: 20 + hauteur * scale };
  const Cpt = { id: "C", x: Bpt.x + shiftLen * scale, y: 20 + hauteur * scale };
  const points = [Apt, Bpt, Cpt, Dpt];
  const segments = [
    { from: "A", to: "B" },
    { from: "B", to: "C" },
    { from: "C", to: "D" },
    { from: "D", to: "A" },
  ];
  const freeLabels = [
    { x: (Apt.x + Bpt.x) / 2, y: Apt.y - 10, text: `${fr(base)} cm` },
  ];
  const rightAngles = [];
  if (withHauteur) {
    const H = { id: "H", x: Dpt.x, y: Apt.y, hideDot: true, hideLabel: true };
    points.push(H);
    segments.push({ from: "D", to: "H", dashed: true });
    rightAngles.push({ at: "H", from: "D", to: "B" });
    freeLabels.push({ x: Dpt.x - 14, y: (Dpt.y + Apt.y) / 2, text: `${fr(hauteur)} cm` });
  }
  if (withDiagonales) {
    segments.push({ from: "A", to: "C", dashed: true }, { from: "B", to: "D", dashed: true });
  }
  return { points, segments, freeLabels, rightAngles };
}

// =========================== Symétrie centrale ===========================

// ---------- 1. Conservation des longueurs par symétrie centrale ----------
function genSymetriqueConservationLongueur() {
  const longueur = randDecimal(2, 15, 1);
  const [p1, p2] = shuffle(prenoms).slice(0, 2);
  return {
    type: "numeric",
    chapter: "Symétrie centrale — Conservation des longueurs",
    prompt: `Le segment [${p1[0]}${p2[0]}] mesure ${fr(longueur)} cm. On construit son symétrique [${p1[0]}'${p2[0]}'] par rapport à un point O. Quelle est la longueur du segment [${p1[0]}'${p2[0]}'], en cm ?`,
    answer: longueur,
    tolerance: 0.01,
    steps: [{ type: "regle", text: `La symétrie centrale conserve les longueurs : [${p1[0]}'${p2[0]}'] a la même longueur que [${p1[0]}${p2[0]}], soit ${fr(longueur)} cm.` }],
  };
}

// ---------- 2. Conservation des aires par symétrie centrale ----------
function genSymetriqueConservationAire() {
  const aire = randDecimal(3, 80, 1);
  const figure = pick(["triangle", "rectangle", "losange", "polygone"]);
  return {
    type: "numeric",
    chapter: "Symétrie centrale — Conservation des aires",
    prompt: `Un ${figure} F a une aire de ${fr(aire)} cm². Quelle est l'aire de son symétrique F' par rapport à un point O, en cm² ?`,
    answer: aire,
    tolerance: 0.01,
    steps: [{ type: "regle", text: `La symétrie centrale conserve les aires : F' a la même aire que F, soit ${fr(aire)} cm².` }],
  };
}

// ---------- 3. Conservation des angles par symétrie centrale ----------
function genSymetriqueConservationAngle() {
  const angle = randInt(20, 160);
  return {
    type: "numeric",
    chapter: "Symétrie centrale — Conservation des angles",
    prompt: `Un angle mesure ${angle}°. Quelle est la mesure de son symétrique par rapport à un point O, en degrés ?`,
    answer: angle,
    steps: [{ type: "regle", text: `La symétrie centrale conserve les angles : l'angle symétrique mesure aussi ${angle}°.` }],
  };
}

// ---------- 4. Coordonnées du symétrique d'un point par rapport à un centre ----------
function genSymetriqueCoordonneesAbscisseOrdonnee() {
  const xa = randInt(-8, 8);
  const ya = randInt(-8, 8);
  const xo = randInt(-6, 6);
  const yo = randInt(-6, 6);
  const xPrime = 2 * xo - xa;
  const yPrime = 2 * yo - ya;
  const askX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Symétrie centrale — Coordonnées",
    prompt: `On considère le point A(${xa} ; ${ya}) et le point O(${xo} ; ${yo}). O est le milieu de [AA']. Quelle est ${askX ? "l'abscisse" : "l'ordonnée"} du point A' ?`,
    answer: askX ? xPrime : yPrime,
    steps: [
      { type: "regle", text: `O est le milieu de [AA'], donc ${askX ? "x_O = (x_A + x_A') / 2" : "y_O = (y_A + y_A') / 2"}.` },
      { type: "calcul", text: askX ? `x_{A'} = 2 \\times ${xo} - (${xa}) = ${xPrime}` : `y_{A'} = 2 \\times ${yo} - (${ya}) = ${yPrime}` },
    ],
  };
}

// ---------- 5. Nombre de centres de symétrie d'une figure usuelle ----------
function genCentresDeSymetrieFigureUsuelleQCM() {
  const figures = [
    { nom: "un cercle", n: 1 },
    { nom: "un carré", n: 1 },
    { nom: "un rectangle (non carré)", n: 1 },
    { nom: "un losange (non carré)", n: 1 },
    { nom: "un parallélogramme quelconque", n: 1 },
    { nom: "un triangle équilatéral", n: 0 },
    { nom: "un triangle quelconque", n: 0 },
    { nom: "un pentagone régulier", n: 0 },
  ];
  const { nom, n } = pick(figures);
  return {
    type: "qcm",
    chapter: "Symétrie centrale — Centre de symétrie",
    prompt: `Combien de centre(s) de symétrie possède ${nom} ?`,
    answer: `${n}`,
    options: shuffle(["0", "1", "2"]),
    steps: [
      {
        type: "regle",
        text:
          n === 1
            ? `${nom[0].toUpperCase()}${nom.slice(1)} possède un centre de symétrie (le centre de la figure).`
            : `${nom[0].toUpperCase()}${nom.slice(1)} ne possède pas de centre de symétrie.`,
      },
    ],
  };
}

// ---------- 6. Reconnaître les figures possédant un centre de symétrie (choix multiples) ----------
function genFiguresAvecCentreDeSymetrieMulti() {
  const items = [
    { text: "Un cercle", correct: true },
    { text: "Un carré", correct: true },
    { text: "Un rectangle", correct: true },
    { text: "Un losange", correct: true },
    { text: "Un parallélogramme", correct: true },
    { text: "Un triangle équilatéral", correct: false },
    { text: "Un pentagone régulier", correct: false },
  ];
  const chosen = shuffle(items).slice(0, 6);
  const { options, answer } = shuffleStatements(chosen);
  return {
    type: "multi",
    chapter: "Symétrie centrale — Centre de symétrie",
    prompt: `Parmi les figures suivantes, coche celles qui possèdent un centre de symétrie.`,
    options,
    answer,
    steps: [{ type: "regle", text: `Un cercle, un carré, un rectangle, un losange et un parallélogramme ont un centre de symétrie. Ce n'est pas le cas des polygones réguliers à nombre impair de côtés (triangle équilatéral, pentagone régulier...).` }],
  };
}

// =========================== Angles et droites parallèles ===========================

// ---------- 7. Angles opposés par le sommet ----------
function genAnglesOpposesParSommetNumeric() {
  const angle = randInt(15, 165);
  return {
    type: "numeric",
    chapter: "Angles — Opposés par le sommet",
    prompt: `Deux droites se coupent en un point O, formant quatre angles. L'un de ces angles mesure ${angle}°. Quelle est la mesure de l'angle opposé par le sommet, en degrés ?`,
    answer: angle,
    steps: [{ type: "regle", text: `Deux angles opposés par le sommet ont toujours la même mesure : ${angle}°.` }],
  };
}

// ---------- 8. Angles adjacents supplémentaires (sur une droite) ----------
function genAnglesAdjacentsSupplementairesNumeric() {
  const angle = randInt(15, 165);
  const answer = 180 - angle;
  return {
    type: "numeric",
    chapter: "Angles — Adjacents et supplémentaires",
    prompt: `Les points A, O et B sont alignés. Un angle \\(\\widehat{AOC}\\) mesure ${angle}°. Quelle est la mesure de l'angle \\(\\widehat{COB}\\), en degrés ?`,
    answer,
    steps: [{ type: "regle", text: `\\(\\widehat{AOC}\\) et \\(\\widehat{COB}\\) sont supplémentaires (leur somme fait 180°, car A, O, B sont alignés) : \\(180 - ${angle} = ${answer}\\)` }],
  };
}

// ---------- 9. Bissectrice : moitié ou double d'un angle ----------
function genBissectriceMoitieNumeric() {
  const askMoitie = Math.random() < 0.5;
  if (askMoitie) {
    const total = randInt(2, 90) * 2;
    return {
      type: "numeric",
      chapter: "Angles — Bissectrice",
      prompt: `La demi-droite [Oz) est la bissectrice de l'angle \\(\\widehat{xOy}\\), qui mesure ${total}°. Quelle est la mesure de l'angle \\(\\widehat{xOz}\\), en degrés ?`,
      answer: total / 2,
      steps: [{ type: "regle", text: `La bissectrice partage l'angle en deux angles égaux : \\(${total} \\div 2 = ${total / 2}\\)` }],
    };
  }
  const moitie = randInt(5, 85);
  return {
    type: "numeric",
    chapter: "Angles — Bissectrice",
    prompt: `La demi-droite [Oz) est la bissectrice de l'angle \\(\\widehat{xOy}\\). Sachant que \\(\\widehat{xOz}\\) mesure ${moitie}°, quelle est la mesure de l'angle \\(\\widehat{xOy}\\), en degrés ?`,
    answer: moitie * 2,
    steps: [{ type: "calcul", text: `\\(\\widehat{xOy} = 2 \\times \\widehat{xOz} = 2 \\times ${moitie} = ${moitie * 2}\\)` }],
  };
}

// ---------- 10. Angles alternes-internes (droites parallèles + sécante) ----------
function genAnglesAlternesInternesNumeric() {
  const angle = randInt(15, 165);
  return {
    type: "numeric",
    chapter: "Angles — Droites parallèles",
    prompt: `Les droites (d₁) et (d₂) sont parallèles et coupées par une sécante (Δ). L'un des angles alternes-internes mesure ${angle}°. Quelle est la mesure de l'autre angle alterne-interne, en degrés ?`,
    answer: angle,
    steps: [{ type: "regle", text: `Si deux droites sont parallèles, les angles alternes-internes formés avec une sécante ont la même mesure : ${angle}°.` }],
  };
}

// ---------- 11. Angles correspondants (droites parallèles + sécante) ----------
function genAnglesCorrespondantsNumeric() {
  const angle = randInt(15, 165);
  return {
    type: "numeric",
    chapter: "Angles — Droites parallèles",
    prompt: `Les droites (d₁) et (d₂) sont parallèles et coupées par une sécante (Δ). L'un des angles correspondants mesure ${angle}°. Quelle est la mesure de l'autre angle correspondant, en degrés ?`,
    answer: angle,
    steps: [{ type: "regle", text: `Si deux droites sont parallèles, les angles correspondants formés avec une sécante ont la même mesure : ${angle}°.` }],
  };
}

// ---------- 12. Tester si deux droites sont parallèles à partir d'angles ----------
function genDroitesParallelesTestAnglesQCM() {
  const same = Math.random() < 0.5;
  const angle1 = randInt(20, 160);
  const angle2 = same ? angle1 : angle1 + nonZero(-30, 30);
  const critere = pick(["alternes-internes", "correspondants"]);
  return {
    type: "qcm",
    chapter: "Angles — Tester le parallélisme",
    prompt: `Une sécante coupe deux droites (d₁) et (d₂). Les angles ${critere} ainsi formés mesurent ${angle1}° et ${angle2}°. Les droites (d₁) et (d₂) sont-elles parallèles ?`,
    answer: angle1 === angle2 ? "Oui" : "Non",
    options: ["Oui", "Non"],
    steps: [
      {
        type: "regle",
        text:
          angle1 === angle2
            ? `Les deux angles ${critere} sont égaux (${angle1}° = ${angle2}°) : les droites sont parallèles.`
            : `Les deux angles ${critere} ne sont pas égaux (${angle1}° ≠ ${angle2}°) : les droites ne sont pas parallèles.`,
      },
    ],
  };
}

// ---------- 13. Deux droites perpendiculaires à une même troisième droite ----------
function genPerpendiculairesMemeDroiteParallelesQCM() {
  return {
    type: "qcm",
    chapter: "Angles — Droites parallèles",
    prompt: `Les droites (d₁) et (d₂) sont toutes les deux perpendiculaires à une même droite (d₃). Les droites (d₁) et (d₂) sont-elles nécessairement parallèles ?`,
    answer: "Oui",
    options: ["Oui", "Non"],
    steps: [{ type: "regle", text: `Si deux droites sont perpendiculaires à une même troisième droite, alors elles sont parallèles entre elles.` }],
  };
}

// ---------- 14. Culture : Euclide et les parallèles ----------
function genCultureEuclideQCM() {
  const items = [
    {
      prompt: "Dans quel ouvrage antique la démonstration des propriétés des angles formés par des parallèles a-t-elle été rédigée pour la première fois de façon rigoureuse ?",
      answer: "Les Éléments d'Euclide",
      options: ["Les Éléments d'Euclide", "L'Almageste de Ptolémée", "La République de Platon"],
      step: "Les Éléments d'Euclide (vers 300 av. J.-C.) est l'un des textes fondateurs de la géométrie, avec des propositions consacrées aux droites parallèles.",
    },
    {
      prompt: "Dans les Éléments d'Euclide, quelle notion permet de démontrer que la somme des angles d'un triangle vaut 180° ?",
      answer: "Les angles alternes-internes formés par des parallèles",
      options: ["Les angles alternes-internes formés par des parallèles", "Le théorème de Pythagore", "Le calcul d'une aire"],
      step: "En traçant la parallèle à un côté du triangle passant par le sommet opposé, on utilise les angles alternes-internes pour montrer que la somme des trois angles fait un angle plat (180°).",
    },
    {
      prompt: "Quel mathématicien grec de l'Antiquité est l'auteur des Éléments, ouvrage de référence en géométrie pendant plus de 2000 ans ?",
      answer: "Euclide",
      options: ["Euclide", "Pythagore", "Archimède"],
      step: "Euclide, mathématicien grec ayant vécu vers 300 av. J.-C. à Alexandrie, est l'auteur des Éléments.",
    },
  ];
  const it = pick(items);
  return {
    type: "qcm",
    chapter: "Angles — Culture mathématique",
    prompt: it.prompt,
    answer: it.answer,
    options: shuffle(it.options),
    steps: [{ type: "donnee", text: it.step }],
  };
}

// =========================== Parallélogrammes ===========================

// ---------- 15. Côtés opposés égaux dans un parallélogramme ----------
function genParallelogrammeCotesOpposesEgauxNumeric() {
  const AB = randDecimal(2, 18, 1);
  const AD = randDecimal(2, 18, 1);
  const askCD = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Parallélogramme — Propriétés",
    prompt: `ABCD est un parallélogramme avec AB = ${fr(AB)} cm et AD = ${fr(AD)} cm. Quelle est la longueur ${askCD ? "CD" : "BC"}, en cm ?`,
    answer: askCD ? AB : AD,
    steps: [{ type: "regle", text: `Dans un parallélogramme, les côtés opposés sont égaux : CD = AB${askCD ? "" : ""} et BC = AD.` }],
  };
}

// ---------- 16. Diagonales qui se coupent en leur milieu ----------
function genParallelogrammeDiagonalesMilieuNumeric() {
  const AC = randDecimal(4, 24, 1);
  const askDemi = Math.random() < 0.5;
  const O = "O";
  if (askDemi) {
    return {
      type: "numeric",
      chapter: "Parallélogramme — Diagonales",
      prompt: `ABCD est un parallélogramme dont les diagonales se coupent en ${O}. Sachant que AC = ${fr(AC)} cm, quelle est la longueur A${O}, en cm ?`,
      answer: roundTo(AC / 2, 2),
      tolerance: 0.01,
      steps: [{ type: "regle", text: `${O} est le milieu de [AC], donc A${O} = AC ÷ 2 = ${fr(roundTo(AC / 2, 2))} cm.` }],
    };
  }
  const AO = randDecimal(2, 12, 1);
  return {
    type: "numeric",
    chapter: "Parallélogramme — Diagonales",
    prompt: `ABCD est un parallélogramme dont les diagonales se coupent en ${O}. Sachant que A${O} = ${fr(AO)} cm, quelle est la longueur de la diagonale AC, en cm ?`,
    answer: roundTo(AO * 2, 2),
    tolerance: 0.01,
    steps: [{ type: "regle", text: `${O} est le milieu de [AC], donc AC = 2 × A${O} = ${fr(roundTo(AO * 2, 2))} cm.` }],
  };
}

// ---------- 17. Angles opposés égaux dans un parallélogramme ----------
function genParallelogrammeAnglesOpposesEgauxNumeric() {
  const angle = randInt(30, 150);
  return {
    type: "numeric",
    chapter: "Parallélogramme — Angles",
    prompt: `ABCD est un parallélogramme. L'angle \\(\\widehat{ABC}\\) mesure ${angle}°. Quelle est la mesure de l'angle \\(\\widehat{ADC}\\), en degrés ?`,
    answer: angle,
    steps: [{ type: "regle", text: `Dans un parallélogramme, les angles opposés sont égaux : \\(\\widehat{ADC} = \\widehat{ABC} = ${angle}°\\)` }],
  };
}

// ---------- 18. Angles consécutifs supplémentaires dans un parallélogramme ----------
function genParallelogrammeAnglesConsecutifsSupplementairesNumeric() {
  const angle = randInt(30, 150);
  const answer = 180 - angle;
  return {
    type: "numeric",
    chapter: "Parallélogramme — Angles",
    prompt: `ABCD est un parallélogramme. L'angle \\(\\widehat{ABC}\\) mesure ${angle}°. Quelle est la mesure de l'angle \\(\\widehat{BCD}\\), en degrés ?`,
    answer,
    steps: [{ type: "regle", text: `Dans un parallélogramme, deux angles consécutifs sont supplémentaires (leur somme fait 180°, car les côtés (AB) et (DC) sont parallèles) : \\(180 - ${angle} = ${answer}\\)` }],
  };
}

// ---------- 19. Reconnaître un parallélogramme à partir d'un critère ----------
function genReconnaitreParallelogrammeCritereQCM() {
  const items = [
    { texte: "ABCD est un quadrilatère dont les diagonales [AC] et [BD] se coupent en leur milieu", reponse: "Oui" },
    { texte: "ABCD est un quadrilatère tel que (AB) est parallèle à (DC) et AB = DC", reponse: "Oui" },
    { texte: "ABCD est un quadrilatère dont les côtés opposés sont deux à deux de même longueur (AB = DC et BC = AD)", reponse: "Oui" },
    { texte: "ABCD est un quadrilatère qui possède un centre de symétrie", reponse: "Oui" },
    { texte: "ABCD est un quadrilatère tel que AB = DC, mais sans autre information sur le parallélisme des côtés", reponse: "Non" },
    { texte: "ABCD est un quadrilatère dont les diagonales [AC] et [BD] ont la même longueur", reponse: "Non" },
  ];
  const it = pick(items);
  return {
    type: "qcm",
    chapter: "Parallélogramme — Reconnaître",
    prompt: `${it.texte}. Peut-on affirmer que ABCD est un parallélogramme ?`,
    answer: it.reponse,
    options: ["Oui", "Non"],
    steps: [
      {
        type: "regle",
        text:
          it.reponse === "Oui"
            ? `Cette propriété est un critère suffisant pour affirmer que ABCD est un parallélogramme.`
            : `Cette seule information ne suffit pas : on ne peut pas conclure que ABCD est un parallélogramme.`,
      },
    ],
  };
}

// ---------- 20. Identifier le cas particulier (carré, rectangle, losange) ----------
function genCasParticulierParallelogrammeQCM() {
  const cas = [
    { desc: "un parallélogramme dont les quatre côtés sont égaux", reponse: "Un losange" },
    { desc: "un parallélogramme dont les quatre angles sont droits", reponse: "Un rectangle" },
    { desc: "un parallélogramme dont les quatre côtés sont égaux et les quatre angles sont droits", reponse: "Un carré" },
    { desc: "un parallélogramme dont les diagonales sont perpendiculaires", reponse: "Un losange" },
    { desc: "un parallélogramme dont les diagonales ont la même longueur", reponse: "Un rectangle" },
  ];
  const it = pick(cas);
  const options = ["Un losange", "Un rectangle", "Un carré"];
  return {
    type: "qcm",
    chapter: "Parallélogramme — Cas particuliers",
    prompt: `ABCD est ${it.desc}. De quel quadrilatère particulier s'agit-il ?`,
    answer: it.reponse,
    options,
    steps: [{ type: "regle", text: `On reconnaît ici la définition/propriété caractéristique : c'est ${it.reponse.toLowerCase()}.` }],
  };
}

// ---------- 21. Aire d'un parallélogramme (base × hauteur) ----------
function genAireParallelogrammeBaseHauteur() {
  const base = randInt(4, 16);
  const hauteur = randInt(3, 12);
  const shift = roundTo(base * 0.35, 1);
  const answer = base * hauteur;
  return {
    type: "numeric",
    chapter: "Parallélogramme — Aire",
    prompt: `Un parallélogramme a pour base ${base} cm et pour hauteur relative à cette base ${hauteur} cm. Quelle est son aire, en cm² ?`,
    figure: buildParallelogrammeFigure(base, hauteur, shift, { withHauteur: true }),
    answer,
    steps: [{ type: "calcul", text: `Aire = base × hauteur = ${base} \\times ${hauteur} = ${answer}` }],
  };
}

// ---------- 22. Trouver la hauteur connaissant l'aire et la base ----------
function genAireParallelogrammeTrouverHauteur() {
  const base = randInt(4, 16);
  const hauteur = randInt(3, 12);
  const aire = base * hauteur;
  const shift = roundTo(base * 0.35, 1);
  return {
    type: "numeric",
    chapter: "Parallélogramme — Aire",
    prompt: `Un parallélogramme a une aire de ${aire} cm² et une base de ${base} cm. Quelle est la hauteur relative à cette base, en cm ?`,
    figure: buildParallelogrammeFigure(base, hauteur, shift, { withHauteur: true }),
    answer: hauteur,
    steps: [{ type: "calcul", text: `Hauteur = Aire ÷ base = ${aire} \\div ${base} = ${hauteur}` }],
  };
}

// ---------- 23. Périmètre d'un parallélogramme ----------
function genPerimetreParallelogramme() {
  const AB = randDecimal(2, 20, 1);
  const AD = randDecimal(2, 20, 1);
  const answer = roundTo(2 * (AB + AD), 2);
  const shift = roundTo(AB * 0.35, 1);
  return {
    type: "numeric",
    chapter: "Parallélogramme — Périmètre",
    prompt: `ABCD est un parallélogramme avec AB = ${fr(AB)} cm et AD = ${fr(AD)} cm. Quel est son périmètre, en cm ?`,
    figure: buildParallelogrammeFigure(AB, AD, shift, { withDiagonales: false }),
    answer,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: `Périmètre = 2 \\times (AB + AD) = 2 \\times (${fr(AB)} + ${fr(AD)}) = ${fr(answer)}` }],
  };
}

// ---------- 24. Reconnaître un rectangle/losange à partir des diagonales ----------
function genReconnaitreCasParticulierViaDiagonalesQCM() {
  const items = [
    { texte: "ABCD est un parallélogramme dont les diagonales [AC] et [BD] sont égales (AC = BD)", reponse: "Un rectangle" },
    { texte: "ABCD est un parallélogramme dont les diagonales [AC] et [BD] sont perpendiculaires", reponse: "Un losange" },
    { texte: "ABCD est un parallélogramme dont les diagonales [AC] et [BD] sont à la fois égales et perpendiculaires", reponse: "Un carré" },
  ];
  const it = pick(items);
  return {
    type: "qcm",
    chapter: "Parallélogramme — Cas particuliers",
    prompt: `${it.texte}. Quelle est la nature précise de ABCD ?`,
    answer: it.reponse,
    options: ["Un rectangle", "Un losange", "Un carré"],
    steps: [
      {
        type: "regle",
        text:
          it.reponse === "Un rectangle"
            ? `Un parallélogramme dont les diagonales sont égales est un rectangle.`
            : it.reponse === "Un losange"
            ? `Un parallélogramme dont les diagonales sont perpendiculaires est un losange.`
            : `Un parallélogramme dont les diagonales sont égales et perpendiculaires est un carré (à la fois rectangle et losange).`,
      },
    ],
  };
}

// ---------- 25. Petite démonstration : quelle propriété utiliser pour un losange ----------
function genDemonstrationLosangeCotesEgauxQCM() {
  const [p1, p2, p3, p4] = shuffle(["C", "H", "A", "T", "G", "R", "I", "S", "N", "U"]).slice(0, 4);
  const nom = `${p1}${p2}${p3}${p4}`;
  return {
    type: "qcm",
    chapter: "Parallélogramme — Petites démonstrations",
    prompt: `Le quadrilatère ${nom} est un parallélogramme tel que deux côtés consécutifs ont la même longueur (${p1}${p4} = ${p4}${p3}). Quelle propriété permet de démontrer que ${nom} est un losange ?`,
    answer: "Un parallélogramme qui a deux côtés consécutifs de même longueur est un losange",
    options: shuffle([
      "Un parallélogramme qui a deux côtés consécutifs de même longueur est un losange",
      "Un parallélogramme qui a un angle droit est un losange",
      "Un parallélogramme dont les diagonales sont égales est un losange",
    ]),
    steps: [{ type: "regle", text: `C'est un critère de reconnaissance du losange : un parallélogramme ayant deux côtés consécutifs égaux est un losange (car alors tous ses côtés sont égaux).` }],
  };
}

// ---------- 26. Petite démonstration : quelle propriété utiliser pour un rectangle ----------
function genDemonstrationRectangleAngleDroitQCM() {
  const [p1, p2, p3, p4] = shuffle(["G", "R", "I", "S", "C", "H", "A", "T"]).slice(0, 4);
  const nom = `${p1}${p2}${p3}${p4}`;
  return {
    type: "qcm",
    chapter: "Parallélogramme — Petites démonstrations",
    prompt: `Le quadrilatère ${nom} est un parallélogramme dont l'un des angles est droit. Quelle propriété permet de démontrer que ${nom} est un rectangle ?`,
    answer: "Un parallélogramme qui a un angle droit est un rectangle",
    options: shuffle([
      "Un parallélogramme qui a un angle droit est un rectangle",
      "Un parallélogramme qui a deux côtés consécutifs égaux est un rectangle",
      "Un parallélogramme qui a un centre de symétrie est un rectangle",
    ]),
    steps: [{ type: "regle", text: `C'est un critère de reconnaissance du rectangle : un parallélogramme ayant un angle droit est un rectangle (car ses quatre angles sont alors droits).` }],
  };
}

// ---------- 27. Petite démonstration : triangles formés par les diagonales d'un rectangle ----------
function genDemonstrationTriangleIsocelesDiagonalesRectangleQCM() {
  return {
    type: "qcm",
    chapter: "Parallélogramme — Petites démonstrations",
    prompt: `ABCD est un rectangle de centre O (intersection des diagonales [AC] et [BD]). Quelle est la nature des triangles AOD, BOA et COB ?`,
    answer: "Des triangles isocèles en O",
    options: shuffle(["Des triangles isocèles en O", "Des triangles rectangles en O", "Des triangles équilatéraux"]),
    steps: [{ type: "regle", text: `Dans un rectangle, les diagonales ont la même longueur et se coupent en leur milieu O : OA = OB = OC = OD, donc les triangles AOD, BOA et COB sont isocèles en O.` }],
  };
}

// ---------- 28. Aire composée : parallélogramme + demi-disques sur les côtés ----------
function genAireParallelogrammeDemiDisquesComposeeNumeric() {
  const AB = randInt(4, 12);
  const AD = randInt(4, 12);
  const hauteur = randInt(2, Math.min(AB, AD) - 1 || 2);
  const shift = roundTo(AB * 0.3, 1);
  const aireParallelogramme = AB * hauteur;
  const aireDisqueAB = roundTo(Math.PI * (AB / 2) ** 2, 2);
  const aireDisqueAD = roundTo(Math.PI * (AD / 2) ** 2, 2);
  const answer = roundTo(aireParallelogramme + aireDisqueAB + aireDisqueAD, 2);
  const tolerance = Math.max(0.05, roundTo(answer * 0.005, 2));
  return {
    type: "numeric",
    chapter: "Parallélogramme — Aire composée",
    prompt: `ABCD est un parallélogramme avec AB = ${AB} cm, AD = ${AD} cm, et une hauteur relative à AB de ${hauteur} cm. Des demi-disques sont construits sur chacun des quatre côtés vers l'extérieur (les demi-disques de côtés opposés se recomposent en un disque complet). Quelle est l'aire totale de la figure (parallélogramme + demi-disques), en cm², arrondie au centième ?`,
    figure: buildParallelogrammeFigure(AB, hauteur, shift, { withHauteur: true }),
    answer,
    tolerance,
    steps: [
      { type: "calcul", text: `Aire du parallélogramme = ${AB} \\times ${hauteur} = ${aireParallelogramme}` },
      { type: "calcul", text: `Les deux demi-disques de diamètre AB (= ${AB} cm) forment un disque d'aire \\approx ${fr(aireDisqueAB)}` },
      { type: "calcul", text: `Les deux demi-disques de diamètre AD (= ${AD} cm) forment un disque d'aire \\approx ${fr(aireDisqueAD)}` },
      { type: "resultat", text: `Aire totale \\approx ${aireParallelogramme} + ${fr(aireDisqueAB)} + ${fr(aireDisqueAD)} \\approx ${fr(answer)}` },
    ],
  };
}

// ---------- 29. Estimation d'une aire par recouvrement (façon carte à l'échelle) ----------
function genEstimationAireRecouvrementParallelogrammeNumeric() {
  const baseKm = randInt(10, 30);
  const hauteurKm = randInt(10, 30);
  const nbParallelogrammes = randInt(15, 60);
  const answer = baseKm * hauteurKm * nbParallelogrammes;
  const territoire = pick(["un département", "une région", "un territoire"]);
  return {
    type: "numeric",
    chapter: "Parallélogramme — Estimation d'aire",
    prompt: `Sur une carte à l'échelle, un parallélogramme représente une base de ${baseKm} km et une hauteur de ${hauteurKm} km. On peut recouvrir entièrement ${territoire} avec environ ${nbParallelogrammes} de ces parallélogrammes. Quelle est l'aire approximative de ${territoire}, en km² ?`,
    answer,
    steps: [
      { type: "calcul", text: `Aire d'un parallélogramme = ${baseKm} \\times ${hauteurKm} = ${baseKm * hauteurKm} \\ km^2` },
      { type: "calcul", text: `Aire totale \\approx ${baseKm * hauteurKm} \\times ${nbParallelogrammes} = ${answer}` },
    ],
  };
}

const GENERATORS = [
  genSymetriqueConservationLongueur,
  genSymetriqueConservationAire,
  genSymetriqueConservationAngle,
  genSymetriqueCoordonneesAbscisseOrdonnee,
  genCentresDeSymetrieFigureUsuelleQCM,
  genFiguresAvecCentreDeSymetrieMulti,
  genAnglesOpposesParSommetNumeric,
  genAnglesAdjacentsSupplementairesNumeric,
  genBissectriceMoitieNumeric,
  genAnglesAlternesInternesNumeric,
  genAnglesCorrespondantsNumeric,
  genDroitesParallelesTestAnglesQCM,
  genPerpendiculairesMemeDroiteParallelesQCM,
  genCultureEuclideQCM,
  genParallelogrammeCotesOpposesEgauxNumeric,
  genParallelogrammeDiagonalesMilieuNumeric,
  genParallelogrammeAnglesOpposesEgauxNumeric,
  genParallelogrammeAnglesConsecutifsSupplementairesNumeric,
  genReconnaitreParallelogrammeCritereQCM,
  genCasParticulierParallelogrammeQCM,
  genAireParallelogrammeBaseHauteur,
  genAireParallelogrammeTrouverHauteur,
  genPerimetreParallelogramme,
  genReconnaitreCasParticulierViaDiagonalesQCM,
  genDemonstrationLosangeCotesEgauxQCM,
  genDemonstrationRectangleAngleDroitQCM,
  genDemonstrationTriangleIsocelesDiagonalesRectangleQCM,
  genAireParallelogrammeDemiDisquesComposeeNumeric,
  genEstimationAireRecouvrementParallelogrammeNumeric,
];

const DIFFICULTY = {
  genSymetriqueConservationLongueur: "facile",
  genSymetriqueConservationAire: "facile",
  genSymetriqueConservationAngle: "facile",
  genCentresDeSymetrieFigureUsuelleQCM: "facile",
  genAnglesOpposesParSommetNumeric: "facile",
  genAnglesAdjacentsSupplementairesNumeric: "facile",
  genCultureEuclideQCM: "facile",
  genParallelogrammeCotesOpposesEgauxNumeric: "facile",
  genParallelogrammeDiagonalesMilieuNumeric: "facile",
  genParallelogrammeAnglesOpposesEgauxNumeric: "facile",
  genAireParallelogrammeBaseHauteur: "facile",
  genPerimetreParallelogramme: "facile",
  genSymetriqueCoordonneesAbscisseOrdonnee: "standard",
  genFiguresAvecCentreDeSymetrieMulti: "standard",
  genBissectriceMoitieNumeric: "standard",
  genAnglesAlternesInternesNumeric: "standard",
  genAnglesCorrespondantsNumeric: "standard",
  genDroitesParallelesTestAnglesQCM: "standard",
  genPerpendiculairesMemeDroiteParallelesQCM: "standard",
  genParallelogrammeAnglesConsecutifsSupplementairesNumeric: "standard",
  genReconnaitreParallelogrammeCritereQCM: "standard",
  genCasParticulierParallelogrammeQCM: "standard",
  genAireParallelogrammeTrouverHauteur: "standard",
  genReconnaitreCasParticulierViaDiagonalesQCM: "standard",
  genDemonstrationLosangeCotesEgauxQCM: "expert",
  genDemonstrationRectangleAngleDroitQCM: "expert",
  genDemonstrationTriangleIsocelesDiagonalesRectangleQCM: "expert",
  genAireParallelogrammeDemiDisquesComposeeNumeric: "expert",
  genEstimationAireRecouvrementParallelogrammeNumeric: "expert",
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
    id: "symetrie-centrale-parallelogrammes",
    title: "Symétrie centrale, parallélogrammes",
    description: "Symétrie centrale (conservation des longueurs, aires, angles), angles et droites parallèles, propriétés et reconnaissance du parallélogramme (dont les cas particuliers via les diagonales), petites démonstrations, aire.",
    pourquoi: "La symétrie centrale et les parallélogrammes sont à la base de nombreux motifs et constructions géométriques du quotidien.",
    level: "cinquieme",
    free: false,
    order: 8,
    cours: {
      mindMap: {
        title: "Symétrie centrale, parallélogrammes",
        branches: [
          {
            title: "Symétrie centrale",
            items: [
              "La symétrie centrale conserve les longueurs, les aires et les angles.",
              "O est le centre : A et son symétrique A' sont alignés avec O, avec OA = OA'.",
              "Piège classique : contrairement à la symétrie axiale, la figure n'est pas « retournée », elle est tournée de 180° autour de O.",
              "Une figure a un centre de symétrie si elle se superpose à elle-même par symétrie centrale : c'est le cas du cercle, du carré, du rectangle, du losange et du parallélogramme (mais pas du triangle équilatéral ni du pentagone régulier).",
            ],
            figure: buildSymetrieCentraleFigure(),
          },
          {
            title: "Angles et droites parallèles",
            items: [
              "Deux angles opposés par le sommet ont toujours la même mesure.",
              "Deux droites sont parallèles si, et seulement si, les angles alternes-internes (ou correspondants) formés avec une sécante sont égaux.",
              "Deux angles adjacents sur une droite sont supplémentaires (leur somme fait 180°).",
              "Deux droites perpendiculaires à une même troisième droite sont parallèles entre elles.",
            ],
            figure: buildParallelesSecanteFigure(),
          },
          {
            title: "Propriétés du parallélogramme",
            items: [
              "Côtés opposés égaux deux à deux : AB = CD et BC = AD.",
              "Les diagonales se coupent en leur milieu.",
              "Angles opposés égaux ; deux angles consécutifs supplémentaires.",
              "Piège classique : « diagonales égales » ou « diagonales perpendiculaires » ne suffisent pas seules pour un quadrilatère quelconque — il faut déjà savoir que c'est un parallélogramme (sinon ce n'est pas forcément un rectangle ou un losange).",
            ],
            figure: buildParallelogrammeFigure(10, 6, 3, { withDiagonales: true }),
          },
          {
            title: "Aire du parallélogramme",
            items: [
              "Aire = base × hauteur (hauteur relative à cette base).",
              "Piège classique : la hauteur doit être perpendiculaire à la base choisie, pas un côté oblique.",
            ],
            formula: "\\(\\mathcal{A} = base \\times hauteur\\)",
            figure: buildParallelogrammeFigure(10, 6, 3, { withHauteur: true }),
          },
        ],
      },
    },
  },
  generate,
};
