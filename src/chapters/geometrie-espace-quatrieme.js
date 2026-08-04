// ---------------------------------------------------------------------------
// Chapitre : Géométrie dans l'espace (4e) — sous abonnement.
//
// Correspond au chapitre 14 du sommaire officiel : vocabulaire des pyramides
// et cônes de révolution, patrons, calcul du volume d'une pyramide ou d'un
// cône, et repérage dans l'espace (pavé droit muni d'un repère, coordonnées).
// Reprend la tâche intellectuelle des exercices fournis, avec des nombres,
// prénoms et contextes différents à chaque génération. Voir
// automatismes-quatrieme.js pour le thème "Calcul mental" associé.
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
const fr = (n) => String(n).replace(".", ",");

const PRENOMS = ["Léa", "Nathan", "Camille", "Yanis", "Inès", "Malo", "Sofia", "Adam", "Lina", "Théo", "Rania", "Enzo"];

// =========================== Volumes ===========================

// ---------- 1. Volume d'une pyramide ----------
function genVolumePyramideNumeric() {
  const aireBase = randInt(6, 60);
  const hauteur = randInt(3, 15);
  const volume = roundTo((aireBase * hauteur) / 3, 2);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes",
    prompt: `Une pyramide a une base d'aire ${aireBase} cm² et une hauteur de ${hauteur} cm. Calcule son volume, en cm³ (arrondi au centième si nécessaire).`,
    answer: volume,
    tolerance: 0.02,
    steps: [
      { type: "regle", text: `V = \\dfrac{\\text{aire de la base} \\times \\text{hauteur}}{3}` },
      { type: "resultat", text: `V = \\dfrac{${aireBase} \\times ${hauteur}}{3} \\approx ${fr(volume)}\\ cm^3` },
    ],
  };
}

// ---------- 2. Volume d'un cône de révolution ----------
function genVolumeConeNumeric() {
  const rayon = randInt(2, 12);
  const hauteur = randInt(3, 20);
  const volume = roundTo((Math.PI * rayon * rayon * hauteur) / 3, 2);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes",
    prompt: `Un cône de révolution a une base de rayon ${rayon} cm et une hauteur de ${hauteur} cm. Calcule son volume, en cm³ (arrondi au centième).`,
    answer: volume,
    tolerance: 0.5,
    steps: [
      { type: "regle", text: `V = \\dfrac{\\pi \\times \\text{rayon}^2 \\times \\text{hauteur}}{3}` },
      { type: "resultat", text: `V = \\dfrac{\\pi \\times ${rayon}^2 \\times ${hauteur}}{3} \\approx ${fr(volume)}\\ cm^3` },
    ],
  };
}

// ---------- 3. Aire de la base d'un cône ----------
function genAireBaseConeNumeric() {
  const rayon = randInt(2, 15);
  const aire = roundTo(Math.PI * rayon * rayon, 2);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes",
    prompt: `La base d'un cône de révolution est un disque de rayon ${rayon} cm. Calcule l'aire de cette base, en cm² (arrondie au centième).`,
    answer: aire,
    tolerance: 0.5,
    steps: [{ type: "calcul", text: `\\text{Aire} = \\pi \\times \\text{rayon}^2 = \\pi \\times ${rayon}^2 \\approx ${fr(aire)}\\ cm^2` }],
  };
}

// ---------- 4. Génératrice d'un cône (Pythagore) ----------
function genGeneratriceConeNumeric() {
  const rayon = randInt(2, 12);
  const hauteur = randInt(3, 15);
  const generatrice = roundTo(Math.sqrt(rayon * rayon + hauteur * hauteur), 2);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes",
    prompt: `Un cône de révolution a un rayon de base de ${rayon} cm et une hauteur de ${hauteur} cm. Calcule la longueur de sa génératrice, en cm (arrondie au centième), sachant que génératrice² = rayon² + hauteur².`,
    answer: generatrice,
    tolerance: 0.02,
    steps: [
      { type: "calcul", text: `\\text{génératrice}^2 = ${rayon}^2 + ${hauteur}^2 = ${rayon * rayon} + ${hauteur * hauteur} = ${rayon * rayon + hauteur * hauteur}` },
      { type: "resultat", text: `\\text{génératrice} = \\sqrt{${rayon * rayon + hauteur * hauteur}} \\approx ${fr(generatrice)}\\ cm` },
    ],
  };
}

// ---------- 5. Comparer le volume d'une pyramide et d'un cône ----------
function genComparerVolumesQCM() {
  const airePyramide = randInt(10, 40);
  const hauteurPyramide = randInt(4, 12);
  const rayonCone = randInt(2, 8);
  const hauteurCone = randInt(4, 15);
  const volPyramide = (airePyramide * hauteurPyramide) / 3;
  const volCone = (Math.PI * rayonCone * rayonCone * hauteurCone) / 3;
  const reponse = volPyramide > volCone ? "La pyramide" : volCone > volPyramide ? "Le cône" : "Les deux volumes sont égaux";
  return {
    type: "qcm",
    chapter: "Géométrie dans l'espace — Volumes",
    prompt: `Une pyramide a une base d'aire ${airePyramide} cm² et une hauteur de ${hauteurPyramide} cm. Un cône a une base de rayon ${rayonCone} cm et une hauteur de ${hauteurCone} cm. Quel solide a le plus grand volume ?`,
    answer: reponse,
    options: ["La pyramide", "Le cône", "Les deux volumes sont égaux"],
    steps: [
      { type: "calcul", text: `V_{pyramide} = \\dfrac{${airePyramide} \\times ${hauteurPyramide}}{3} \\approx ${fr(roundTo(volPyramide, 2))}\\ cm^3` },
      { type: "calcul", text: `V_{cône} = \\dfrac{\\pi \\times ${rayonCone}^2 \\times ${hauteurCone}}{3} \\approx ${fr(roundTo(volCone, 2))}\\ cm^3` },
    ],
  };
}

// ---------- 6. Problème contextualisé (volume d'un cône, comptage d'objets) ----------
function genProblemeVolumeConeContextualiseNumeric() {
  const prenom = pick(PRENOMS);
  const rayon = roundTo(0.5 + Math.random() * 1.5, 1);
  const hauteur = roundTo(2 + Math.random() * 3, 1);
  const masseVolumique = randInt(2, 8);
  const masseSachet = pick([100, 150, 200, 250, 300]);
  const volumeUnite = (Math.PI * rayon * rayon * hauteur) / 3;
  const masseUnite = volumeUnite * masseVolumique;
  const nombre = Math.floor(masseSachet / masseUnite);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Volumes",
    prompt: `${prenom} vend des bonbons en forme de cône de révolution, de hauteur ${fr(hauteur)} cm et dont le rayon de la base mesure ${fr(rayon)} cm. La masse volumique d'un bonbon est de ${masseVolumique} g/cm³. Combien de bonbons ${prenom} peut-il mettre au maximum dans un sachet de ${masseSachet} g ?`,
    answer: nombre,
    steps: [
      { type: "calcul", text: `\\text{Volume d'un bonbon} \\approx \\dfrac{\\pi \\times ${fr(rayon)}^2 \\times ${fr(hauteur)}}{3} \\approx ${fr(roundTo(volumeUnite, 2))}\\ cm^3` },
      { type: "calcul", text: `\\text{Masse d'un bonbon} \\approx ${fr(roundTo(volumeUnite, 2))} \\times ${masseVolumique} \\approx ${fr(roundTo(masseUnite, 2))}\\ g` },
      { type: "resultat", text: `${masseSachet} \\div ${fr(roundTo(masseUnite, 2))} \\approx ${fr(roundTo(masseSachet / masseUnite, 2))}\\ \\text{donc au maximum } ${nombre}\\ \\text{bonbons}` },
    ],
  };
}

// =========================== Vocabulaire et patrons ===========================

// ---------- 7. Vocabulaire du cône ----------
function genVocabulaireConeQCM() {
  const cas = pick([
    { desc: "le segment qui relie le sommet du cône à un point du cercle de base", reponse: "La génératrice" },
    { desc: "le segment perpendiculaire à la base, reliant le sommet du cône au centre du disque de base", reponse: "La hauteur" },
    { desc: "le segment reliant le centre du disque de base à un point du cercle de base", reponse: "Le rayon" },
  ]);
  return {
    type: "qcm",
    chapter: "Géométrie dans l'espace — Vocabulaire",
    prompt: `Dans un cône de révolution, comment appelle-t-on ${cas.desc} ?`,
    answer: cas.reponse,
    options: ["La génératrice", "La hauteur", "Le rayon"],
    steps: [{ type: "regle", text: `Le cône de révolution a pour éléments : le rayon (base), la hauteur (sommet-centre) et la génératrice (sommet-cercle de base).` }],
  };
}

// ---------- 8. Nombre de faces / sommets / arêtes d'une pyramide ----------
function genElementsPyramideNumeric() {
  const n = randInt(3, 8);
  const quantite = pick(["faces", "sommets", "arêtes"]);
  let reponse;
  if (quantite === "faces") reponse = n + 1;
  else if (quantite === "sommets") reponse = n + 1;
  else reponse = 2 * n;
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Vocabulaire",
    prompt: `Une pyramide a une base qui est un polygone à ${n} côtés. Combien cette pyramide a-t-elle de ${quantite} ?`,
    answer: reponse,
    steps: [
      {
        type: "regle",
        text:
          quantite === "faces"
            ? `\\text{Une pyramide à base } ${n}\\text{-gonale a } ${n}\\ \\text{faces latérales} + 1\\ \\text{base} = ${reponse}\\ \\text{faces}.`
            : quantite === "sommets"
            ? `\\text{Une pyramide à base } ${n}\\text{-gonale a } ${n}\\ \\text{sommets de la base} + 1\\ \\text{sommet principal} = ${reponse}\\ \\text{sommets}.`
            : `\\text{Une pyramide à base } ${n}\\text{-gonale a } ${n}\\ \\text{arêtes de base} + ${n}\\ \\text{arêtes latérales} = ${reponse}\\ \\text{arêtes}.`,
      },
    ],
  };
}

// ---------- 9. Patron d'un cône : longueur de l'arc ----------
function genPatronConeArcNumeric() {
  const rayon = randInt(2, 10);
  const arc = roundTo(2 * Math.PI * rayon, 2);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Patrons",
    prompt: `Sur le patron d'un cône de révolution, le disque de base a pour rayon ${rayon} cm. Quelle doit être la longueur de l'arc de cercle qui s'enroule autour de ce disque, en cm (arrondie au centième) ?`,
    answer: arc,
    tolerance: 0.1,
    steps: [
      { type: "regle", text: `\\text{L'arc doit avoir la même longueur que le périmètre du cercle de base.}` },
      { type: "resultat", text: `\\text{Périmètre} = 2 \\times \\pi \\times ${rayon} \\approx ${fr(arc)}\\ cm` },
    ],
  };
}

// ---------- 10. Patron d'un cône : angle du secteur ----------
function genPatronConeAngleNumeric() {
  const rayon = randInt(2, 8);
  const generatrice = rayon + randInt(2, 10);
  const angle = roundTo((360 * rayon) / generatrice, 1);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Patrons",
    prompt: `Le patron d'un cône de révolution est un secteur de disque de rayon (génératrice) ${generatrice} cm, relié à un disque de base de rayon ${rayon} cm. Calcule la mesure de l'angle au sommet du secteur, en degrés (arrondie au dixième).`,
    answer: angle,
    tolerance: 0.5,
    steps: [
      { type: "regle", text: `\\text{L'arc du secteur a pour longueur } 2\\pi \\times ${rayon}, \\text{ et le cercle complet de rayon } ${generatrice}\\ \\text{a pour périmètre } 2\\pi \\times ${generatrice}.` },
      { type: "resultat", text: `\\text{angle} = 360 \\times \\dfrac{${rayon}}{${generatrice}} \\approx ${fr(angle)}°` },
    ],
  };
}

// =========================== Repérage dans l'espace ===========================

// ---------- 11. Coordonnées d'un sommet d'un pavé droit ----------
function genCoordonneesSommetPaveNumeric() {
  const L = randInt(2, 10);
  const l = randInt(2, 10);
  const h = randInt(2, 10);
  const sommets = {
    A: [0, 0, 0],
    B: [L, 0, 0],
    C: [L, l, 0],
    D: [0, l, 0],
    E: [0, 0, h],
    F: [L, 0, h],
    G: [L, l, h],
    H: [0, l, h],
  };
  const noms = Object.keys(sommets);
  const nom = pick(noms);
  const coords = sommets[nom];
  const indexInfo = [
    { label: "abscisse", index: 0 },
    { label: "ordonnée", index: 1 },
    { label: "altitude", index: 2 },
  ];
  const info = pick(indexInfo);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Repérage",
    prompt: `ABCDEFGH est un pavé droit tel que AB = ${L} cm, AD = ${l} cm et AE = ${h} cm, muni du repère d'origine A (axes (AB), (AD), (AE)). Quelle est ${info.label === "abscisse" ? "l'" : "l'"}${info.label} du point ${nom} ?`,
    answer: coords[info.index],
    steps: [
      { type: "donnee", text: `\\text{Les coordonnées du point } ${nom} \\text{ sont } (${coords.join(" ; ")}).` },
      { type: "resultat", text: `\\text{Son ${info.label} vaut donc } ${coords[info.index]}.` },
    ],
  };
}

// ---------- 12. Milieu d'un segment dans l'espace ----------
function genMilieuSegmentEspaceNumeric() {
  const P1 = [randInt(0, 10), randInt(0, 10), randInt(0, 10)];
  const P2 = [randInt(0, 10), randInt(0, 10), randInt(0, 10)];
  const milieu = P1.map((v, i) => roundTo((v + P2[i]) / 2, 2));
  const indexInfo = [
    { label: "abscisse", index: 0 },
    { label: "ordonnée", index: 1 },
    { label: "altitude", index: 2 },
  ];
  const info = pick(indexInfo);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Repérage",
    prompt: `Dans un repère de l'espace, on donne les points R(${P1.join(" ; ")}) et S(${P2.join(" ; ")}). Soit M le milieu du segment [RS]. Quelle est ${info.label === "abscisse" ? "l'" : "l'"}${info.label} du point M ?`,
    answer: milieu[info.index],
    tolerance: 0.01,
    steps: [
      { type: "regle", text: `\\text{Le milieu M a pour coordonnées la moyenne des coordonnées de R et de S.}` },
      { type: "resultat", text: `${info.label} = \\dfrac{${P1[info.index]} + ${P2[info.index]}}{2} = ${fr(milieu[info.index])}` },
    ],
  };
}

// ---------- 13. Comment repère-t-on un point dans l'espace ? (QCM conceptuel) ----------
function genOrdreCoordonneesQCM() {
  return {
    type: "qcm",
    chapter: "Géométrie dans l'espace — Repérage",
    prompt: `Dans un repère de l'espace muni d'un pavé droit, un point est repéré par un triplet de nombres donné dans quel ordre ?`,
    answer: "(abscisse ; ordonnée ; altitude)",
    options: ["(abscisse ; ordonnée ; altitude)", "(longueur ; largeur ; hauteur)", "(ordonnée ; abscisse ; altitude)"],
    steps: [{ type: "regle", text: `Un point de l'espace est repéré par trois nombres : son abscisse, son ordonnée et son altitude, dans cet ordre.` }],
  };
}

// ---------- 14. Symétrique d'un point par rapport à un autre (dans l'espace) ----------
function genSymetriquePointEspaceNumeric() {
  const K = [randInt(0, 10), randInt(0, 10), randInt(0, 10)];
  const L = [randInt(0, 10), randInt(0, 10), randInt(0, 10)];
  // O est le symétrique de K par rapport à L : L est le milieu de [KO], donc O = 2L - K.
  const O = K.map((v, i) => 2 * L[i] - v);
  const indexInfo = [
    { label: "abscisse", index: 0 },
    { label: "ordonnée", index: 1 },
    { label: "altitude", index: 2 },
  ];
  const info = pick(indexInfo);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Repérage",
    prompt: `Dans un repère de l'espace, on donne les points K(${K.join(" ; ")}) et L(${L.join(" ; ")}). Soit O le symétrique du point K par rapport au point L. Quelle est ${info.label === "abscisse" ? "l'" : "l'"}${info.label} du point O ?`,
    answer: O[info.index],
    steps: [
      { type: "regle", text: `\\text{L étant le milieu de [KO], on a } ${info.label}(O) = 2 \\times ${info.label}(L) - ${info.label}(K).` },
      { type: "resultat", text: `${info.label}(O) = 2 \\times ${L[info.index]} - ${K[info.index]} = ${O[info.index]}` },
    ],
  };
}

const GENERATORS = [
  genVolumePyramideNumeric,
  genVolumeConeNumeric,
  genAireBaseConeNumeric,
  genGeneratriceConeNumeric,
  genComparerVolumesQCM,
  genProblemeVolumeConeContextualiseNumeric,
  genVocabulaireConeQCM,
  genElementsPyramideNumeric,
  genPatronConeArcNumeric,
  genPatronConeAngleNumeric,
  genCoordonneesSommetPaveNumeric,
  genMilieuSegmentEspaceNumeric,
  genOrdreCoordonneesQCM,
  genSymetriquePointEspaceNumeric,
];

const DIFFICULTY = {
  genVolumePyramideNumeric: "facile",
  genVolumeConeNumeric: "facile",
  genVocabulaireConeQCM: "facile",
  genElementsPyramideNumeric: "facile",
  genOrdreCoordonneesQCM: "facile",
  genAireBaseConeNumeric: "standard",
  genGeneratriceConeNumeric: "standard",
  genComparerVolumesQCM: "standard",
  genCoordonneesSommetPaveNumeric: "standard",
  genMilieuSegmentEspaceNumeric: "standard",
  genSymetriquePointEspaceNumeric: "standard",
  genProblemeVolumeConeContextualiseNumeric: "expert",
  genPatronConeArcNumeric: "expert",
  genPatronConeAngleNumeric: "expert",
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
    id: "geometrie-espace-quatrieme",
    title: "Géométrie dans l'espace",
    description: "Pyramides et cônes de révolution (vocabulaire, patrons, volumes), repérage dans l'espace.",
    pourquoi: "Calculer le volume d'une pyramide ou d'un cône, c'est ce qui sert à estimer une quantité de matière, d'eau ou d'espace dans la vie réelle.",
    level: "quatrieme",
    free: false,
    order: 15,
  },
  generate,
};
