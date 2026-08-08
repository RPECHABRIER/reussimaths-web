// ---------------------------------------------------------------------------
// Chapitre : Triangles (5e) — sous abonnement.
//
// Correspond au chapitre 8 du sommaire officiel : utiliser les angles dans un
// triangle (somme = 180°, angle extérieur, classification), connaître les
// propriétés des médiatrices d'un triangle (équidistance, cercle circonscrit,
// cas particulier du triangle rectangle), utiliser les hauteurs d'un triangle
// (aire, orthocentre), utiliser les médianes d'un triangle (centre de
// gravité, partage de l'aire), synthèse sur les aires de quadrilatères
// (losange, trapèze, figures composées), et un peu de culture mathématique
// (droite d'Euler, cercle des neuf points). Reprend la tâche intellectuelle
// des exercices fournis (module B4 "Triangles"), avec des nombres, prénoms
// et contextes différents à chaque génération.
// Voir automatismes-cinquieme.js pour la Série 1 (Automatismes) — cette
// dernière reste hébergée dans le thème "symetrie-centrale-parallelogrammes"
// pour les angles, un thème dédié "triangles" y est ajouté séparément.
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

// Triangle ABC construit par la loi des sinus à partir de ses trois angles
// (utile pour illustrer angle manquant, classification, hauteurs...).
function buildTriangleFigure(angA, angB, angC, { labels = {}, rightAngleAt, equalSides = [] } = {}) {
  const toRad = (d) => (d * Math.PI) / 180;
  const L = 100;
  const t = (L * Math.sin(toRad(angC))) / Math.sin(toRad(angA));
  const A = { x: t * Math.cos(toRad(angB)), y: -t * Math.sin(toRad(angB)) };
  const B = { x: 0, y: 0 };
  const C = { x: L, y: 0 };
  const centroid = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };
  const inset = (P, frac = 0.24) => ({ x: P.x + (centroid.x - P.x) * frac, y: P.y + (centroid.y - P.y) * frac });
  const points = [
    { id: "A", x: A.x, y: A.y, dy: -8, hideLabel: true },
    { id: "B", x: B.x, y: B.y, dy: 16, hideLabel: true },
    { id: "C", x: C.x, y: C.y, dy: 16, hideLabel: true },
  ];
  const tickCount = { AB: 0, BC: 0, CA: 0 };
  equalSides.forEach((s) => {
    const key = s === "AB" || s === "BA" ? "AB" : s === "BC" || s === "CB" ? "BC" : "CA";
    tickCount[key] = 1;
  });
  const segments = [
    { from: "A", to: "B", ticks: tickCount.AB },
    { from: "B", to: "C", ticks: tickCount.BC },
    { from: "C", to: "A", ticks: tickCount.CA },
  ];
  const freeLabels = [];
  const vertexByKey = { A, B, C };
  Object.entries(labels).forEach(([key, text]) => {
    if (!text) return;
    const pos = inset(vertexByKey[key]);
    freeLabels.push({ x: pos.x, y: pos.y, text });
  });
  const rightAngles = [];
  if (rightAngleAt) {
    const at = rightAngleAt;
    const others = ["A", "B", "C"].filter((k) => k !== at);
    rightAngles.push({ at, from: others[0], to: others[1] });
  }
  return { points, segments, freeLabels, rightAngles };
}

// =========================== Angles dans un triangle ===========================

// ---------- 1. Angle manquant (somme = 180°) ----------
function genAngleManquantTriangleSomme() {
  const angA = randInt(20, 100);
  const angB = randInt(20, 150 - angA);
  const angC = 180 - angA - angB;
  return {
    type: "numeric",
    chapter: "Triangles — Angles",
    prompt: `Dans un triangle ABC, l'angle en A mesure ${angA}° et l'angle en B mesure ${angB}°. Quelle est la mesure de l'angle en C, en degrés ?`,
    figure: buildTriangleFigure(angA, angB, angC, { labels: { A: `${angA}°`, B: `${angB}°` } }),
    answer: angC,
    steps: [{ type: "regle", text: `La somme des angles d'un triangle vaut 180° : \\(180 - ${angA} - ${angB} = ${angC}\\)` }],
  };
}

// ---------- 2. Classifier un triangle selon ses angles ----------
function genClassifierTriangleAnglesQCM() {
  const type = pick(["acutangle", "rectangle", "obtusangle"]);
  let angA, angB, angC;
  if (type === "rectangle") {
    angA = 90;
    angB = randInt(20, 70);
    angC = 180 - angA - angB;
  } else if (type === "obtusangle") {
    angA = randInt(95, 150);
    angB = randInt(10, (180 - angA) / 2);
    angC = 180 - angA - angB;
  } else {
    angA = randInt(50, 70);
    angB = randInt(50, 70);
    angC = 180 - angA - angB;
    if (angC <= 0 || angC >= 90) return genClassifierTriangleAnglesQCM();
  }
  const label = type === "acutangle" ? "acutangle (tous les angles sont aigus)" : type === "rectangle" ? "rectangle (un angle droit)" : "obtusangle (un angle obtus)";
  return {
    type: "qcm",
    chapter: "Triangles — Angles",
    prompt: `Un triangle a des angles de ${angA}°, ${angB}° et ${angC}°. Comment qualifie-t-on ce triangle ?`,
    figure: buildTriangleFigure(angA, angB, angC, { rightAngleAt: type === "rectangle" ? "A" : undefined }),
    answer: label,
    options: shuffle(["acutangle (tous les angles sont aigus)", "rectangle (un angle droit)", "obtusangle (un angle obtus)"]),
    steps: [{ type: "regle", text: `On observe la mesure des trois angles pour déterminer le type de triangle.` }],
  };
}

// ---------- 3. Démonstration : angles alternes-internes et somme des angles ----------
function genDemonstrationSommeAnglesQCM() {
  return {
    type: "qcm",
    chapter: "Triangles — Angles",
    prompt: `Pour démontrer que la somme des angles d'un triangle ABC vaut 180°, on trace la parallèle à (BC) passant par A. Quelle propriété utilise-t-on alors pour comparer les angles ?`,
    answer: "Les angles alternes-internes formés par deux droites parallèles et une sécante sont égaux",
    options: shuffle([
      "Les angles alternes-internes formés par deux droites parallèles et une sécante sont égaux",
      "Le théorème de Pythagore",
      "La conservation des aires par symétrie centrale",
    ]),
    steps: [{ type: "regle", text: `En traçant la parallèle à (BC) passant par A, les angles en A deviennent égaux aux angles en B et C grâce aux angles alternes-internes, et leur somme forme un angle plat (180°).` }],
  };
}

// NOTE (audit programme 2026, cycle 4) : un générateur "genAngleExterieurTriangle"
// a été retiré d'ici — recherche exhaustive dans le programme officiel :
// l'expression "angle extérieur" n'apparaît nulle part dans le cycle 4
// (5e/4e/3e).

// ---------- 5. Triangle isocèle : angles à la base égaux ----------
function genTriangleIsoceleAnglesEgaux() {
  const askBase = Math.random() < 0.5;
  if (askBase) {
    const apex = randInt(20, 140);
    const base = roundTo((180 - apex) / 2, 1);
    return {
      type: "numeric",
      chapter: "Triangles — Isocèle",
      prompt: `ABC est un triangle isocèle en A dont l'angle au sommet A mesure ${apex}°. Quelle est la mesure de chacun des deux angles à la base, en degrés ?`,
      figure: buildTriangleFigure(apex, base, base, { equalSides: ["AB", "AC"], labels: { A: `${apex}°` } }),
      answer: base,
      tolerance: 0.1,
      steps: [{ type: "regle", text: `Les angles à la base d'un triangle isocèle sont égaux : \\((180 - ${apex}) \\div 2 = ${base}\\)` }],
    };
  }
  const base = randInt(20, 80);
  const apex = 180 - 2 * base;
  return {
    type: "numeric",
    chapter: "Triangles — Isocèle",
    prompt: `ABC est un triangle isocèle en A dont l'un des angles à la base mesure ${base}°. Quelle est la mesure de l'angle au sommet A, en degrés ?`,
    figure: buildTriangleFigure(apex, base, base, { equalSides: ["AB", "AC"], labels: { B: `${base}°` } }),
    answer: apex,
    steps: [{ type: "calcul", text: `Les deux angles à la base valent ${base}° chacun : \\(180 - 2 \\times ${base} = ${apex}\\)` }],
  };
}

// =========================== Médiatrices et cercle circonscrit ===========================

// ---------- 6. Équidistance par la médiatrice ----------
function genMediatriceEquidistanceNumeric() {
  const dist = randDecimal(2, 20, 1);
  return {
    type: "numeric",
    chapter: "Triangles — Médiatrices",
    prompt: `Le point M appartient à la médiatrice du segment [AB]. Sachant que MA = ${fr(dist)} cm, quelle est la longueur MB, en cm ?`,
    answer: dist,
    tolerance: 0.01,
    steps: [{ type: "regle", text: `Tout point de la médiatrice d'un segment est équidistant de ses deux extrémités : MB = MA = ${fr(dist)} cm.` }],
  };
}

// ---------- 7. Rayon / diamètre du cercle circonscrit ----------
function genCercleCirconscritRayonDiametre() {
  const askDiametre = Math.random() < 0.5;
  const rayon = randDecimal(1.5, 15, 1);
  return {
    type: "numeric",
    chapter: "Triangles — Cercle circonscrit",
    prompt: askDiametre
      ? `Le cercle circonscrit à un triangle ABC a un rayon de ${fr(rayon)} cm. Quel est son diamètre, en cm ?`
      : `Le cercle circonscrit à un triangle ABC a un diamètre de ${fr(roundTo(rayon * 2, 2))} cm. Quel est son rayon, en cm ?`,
    answer: askDiametre ? roundTo(rayon * 2, 2) : rayon,
    tolerance: 0.01,
    steps: [{ type: "calcul", text: askDiametre ? `Diamètre = 2 \\times rayon = 2 \\times ${fr(rayon)} = ${fr(roundTo(rayon * 2, 2))}` : `Rayon = diamètre \\div 2 = ${fr(roundTo(rayon * 2, 2))} \\div 2 = ${fr(rayon)}` }],
  };
}

// NOTE (audit programme 2026, cycle 4) : deux générateurs sur la
// caractérisation d'un triangle rectangle par son cercle circonscrit
// ("genTriangleRectangleHypotenuseDiametre", "genReconnaitreTriangleRectangleViaCercleQCM")
// ont été retirés d'ici — le programme officiel assigne explicitement ce
// point à la Quatrième (« Caractériser un triangle rectangle à l'aide de son
// cercle circonscrit... »). En 5e, l'objectif sur le cercle circonscrit
// reste plus général (voir genCercleCirconscritRayonDiametre ci-dessus).

// =========================== Hauteurs, aires, orthocentre ===========================

// ---------- 10. Aire d'un triangle (base × hauteur ÷ 2) ----------
function genAireTriangleBaseHauteur() {
  const base = randInt(4, 20);
  const hauteur = randInt(3, 16);
  const answer = roundTo((base * hauteur) / 2, 2);
  return {
    type: "numeric",
    chapter: "Triangles — Aire",
    prompt: `Un triangle a une base de ${base} cm et une hauteur relative à cette base de ${hauteur} cm. Quelle est son aire, en cm² ?`,
    answer,
    steps: [{ type: "calcul", text: `Aire = (base \\times hauteur) \\div 2 = (${base} \\times ${hauteur}) \\div 2 = ${fr(answer)}` }],
  };
}

// ---------- 11. Trouver la base ou la hauteur connaissant l'aire ----------
function genAireTriangleTrouverBaseOuHauteur() {
  const base = randInt(4, 20);
  const hauteur = randInt(3, 16);
  const aire = roundTo((base * hauteur) / 2, 2);
  const askHauteur = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Triangles — Aire",
    prompt: askHauteur
      ? `Un triangle a une aire de ${fr(aire)} cm² et une base de ${base} cm. Quelle est la hauteur relative à cette base, en cm ?`
      : `Un triangle a une aire de ${fr(aire)} cm² et une hauteur de ${hauteur} cm. Quelle est la longueur de la base correspondante, en cm ?`,
    answer: askHauteur ? hauteur : base,
    tolerance: 0.01,
    steps: [
      {
        type: "calcul",
        text:
          askHauteur
            ? `Hauteur = (2 \\times Aire) \\div base = (2 \\times ${fr(aire)}) \\div ${base} = ${hauteur}`
            : `Base = (2 \\times Aire) \\div hauteur = (2 \\times ${fr(aire)}) \\div ${hauteur} = ${base}`,
      },
    ],
  };
}

// NOTE (audit programme 2026, cycle 4) : un générateur "genOrthocentreDefinitionQCM"
// présentait "orthocentre" comme du vocabulaire à connaître isolément — or ce
// mot n'apparaît nulle part dans le programme officiel (seule la
// concourance des hauteurs est un objectif, sans nommer le point). Le mot
// reste introduit, mais uniquement via le contexte culturel de la droite
// d'Euler (voir genCultureDroiteEulerQCM plus bas), comme le recommande
// l'audit.

// ---------- 13. Particularité des hauteurs dans un triangle rectangle ----------
function genHauteurTriangleRectangleParticulariteQCM() {
  return {
    type: "qcm",
    chapter: "Triangles — Hauteurs",
    prompt: `ABC est un triangle rectangle en A. Avec quels côtés du triangle deux de ses trois hauteurs sont-elles confondues ?`,
    answer: "Les côtés de l'angle droit (les cathètes)",
    options: shuffle(["Les côtés de l'angle droit (les cathètes)", "L'hypoténuse et une cathète", "Les trois médianes"]),
    steps: [{ type: "regle", text: `Dans un triangle rectangle en A, les côtés [AB] et [AC] (les cathètes) sont eux-mêmes deux des trois hauteurs du triangle.` }],
  };
}

// =========================== Médianes, centre de gravité ===========================

// ---------- 14. Médiane et milieu d'un côté ----------
function genMedianeMilieuNumeric() {
  const bc = randDecimal(4, 24, 1);
  return {
    type: "numeric",
    chapter: "Triangles — Médianes",
    prompt: `Dans un triangle ABC, la médiane issue de A coupe [BC] en son milieu M. Sachant que BC = ${fr(bc)} cm, quelle est la longueur BM, en cm ?`,
    answer: roundTo(bc / 2, 2),
    tolerance: 0.01,
    steps: [{ type: "regle", text: `M est le milieu de [BC] : BM = BC \\div 2 = ${fr(bc)} \\div 2 = ${fr(roundTo(bc / 2, 2))}` }],
  };
}

// NOTE (audit programme 2026, cycle 4) : deux générateurs sur le centre de
// gravité ("genCentreDeGraviteRatioNumeric" avec son ratio 2/3, et
// "genCentreDeGraviteDefinitionQCM" présentant le nom comme vocabulaire
// isolé) ont été retirés d'ici — recherche exhaustive dans le programme
// officiel : ni "centre de gravité" ni son ratio 2/3 n'apparaissent nulle
// part dans le cycle 4. Seule la concourance des médianes (sans nommer le
// point ni son ratio) est un objectif de 5e. Le mot "centre de gravité"
// reste introduit, mais uniquement via le contexte culturel de la droite
// d'Euler (genCultureDroiteEulerQCM plus bas).

// ---------- 17. Une médiane partage le triangle en deux aires égales ----------
function genMedianePartageAireMoitieNumeric() {
  const aireTotale = randDecimal(10, 100, 1);
  return {
    type: "numeric",
    chapter: "Triangles — Médianes",
    prompt: `Un triangle ABC a une aire de ${fr(aireTotale)} cm². La médiane issue de A le partage en deux triangles ABM et ACM. Quelle est l'aire du triangle ABM, en cm² ?`,
    answer: roundTo(aireTotale / 2, 2),
    tolerance: 0.02,
    steps: [{ type: "regle", text: `Une médiane partage un triangle en deux triangles de même aire : ${fr(aireTotale)} \\div 2 = ${fr(roundTo(aireTotale / 2, 2))}` }],
  };
}

// =========================== Synthèse : aires de quadrilatères ===========================

// ---------- 18. Aire via les diagonales (losange / cerf-volant) ----------
function genAireDiagonalesPerpendiculairesNumeric() {
  const d1 = randInt(4, 20);
  const d2 = randInt(4, 20);
  const forme = pick(["losange", "cerf-volant"]);
  const answer = roundTo((d1 * d2) / 2, 2);
  return {
    type: "numeric",
    chapter: "Quadrilatères — Aire",
    prompt: `Un ${forme} a des diagonales perpendiculaires de longueurs ${d1} cm et ${d2} cm. Quelle est son aire, en cm² ?`,
    answer,
    steps: [{ type: "calcul", text: `Aire = (d_1 \\times d_2) \\div 2 = (${d1} \\times ${d2}) \\div 2 = ${fr(answer)}` }],
  };
}

// ---------- 19. Aire d'un trapèze ----------
// NOTE (audit programme 2026) : le trapèze n'est mentionné en 5e que comme
// figure à reconnaître (« Reconnaitre en justifiant un quadrilatère... un
// trapèze »), jamais avec une formule d'aire à connaître — repositionné en
// "expert" (dépassement) plutôt que "facile", et non retiré (contenu
// mathématiquement correct, juste pas central en 5e).
function genAireTrapezeNumeric() {
  const grandeBase = randInt(6, 24);
  const petiteBase = randInt(2, grandeBase - 1);
  const hauteur = randInt(3, 14);
  const answer = roundTo(((grandeBase + petiteBase) * hauteur) / 2, 2);
  return {
    type: "numeric",
    chapter: "Quadrilatères — Aire",
    prompt: `Un trapèze a une grande base de ${grandeBase} cm, une petite base de ${petiteBase} cm et une hauteur de ${hauteur} cm. Quelle est son aire, en cm² ?`,
    answer,
    steps: [{ type: "calcul", text: `Aire = ((grande base + petite base) \\times hauteur) \\div 2 = ((${grandeBase} + ${petiteBase}) \\times ${hauteur}) \\div 2 = ${fr(answer)}` }],
  };
}

// ---------- 20. Figure composée : rectangle + triangle ----------
function genFigureComposeeRectangleTriangleNumeric() {
  const L = randInt(6, 20);
  const l = randInt(3, 12);
  const hTriangle = randInt(3, 12);
  const aireRectangle = L * l;
  const aireTriangle = roundTo((L * hTriangle) / 2, 2);
  const answer = roundTo(aireRectangle + aireTriangle, 2);
  const prenom = pick(prenoms);
  return {
    type: "numeric",
    chapter: "Quadrilatères — Figures composées",
    prompt: `${prenom} dessine une figure composée d'un rectangle de ${L} cm sur ${l} cm, surmonté d'un triangle de même base (${L} cm) et de hauteur ${hTriangle} cm. Quelle est l'aire totale de la figure, en cm² ?`,
    answer,
    steps: [
      { type: "calcul", text: `Aire du rectangle = ${L} \\times ${l} = ${aireRectangle}` },
      { type: "calcul", text: `Aire du triangle = (${L} \\times ${hTriangle}) \\div 2 = ${fr(aireTriangle)}` },
      { type: "resultat", text: `Aire totale = ${aireRectangle} + ${fr(aireTriangle)} = ${fr(answer)}` },
    ],
  };
}

// =========================== Culture mathématique ===========================

// ---------- 21. Culture : droite d'Euler ----------
function genCultureDroiteEulerQCM() {
  return {
    type: "qcm",
    chapter: "Triangles — Culture mathématique",
    prompt: `Dans un triangle non équilatéral, l'orthocentre, le centre de gravité et le centre du cercle circonscrit sont toujours alignés sur une même droite. Comment appelle-t-on cette droite ?`,
    answer: "La droite d'Euler",
    options: shuffle(["La droite d'Euler", "La droite de Thalès", "La droite des milieux"]),
    steps: [{ type: "donnee", text: `Ce résultat, découvert par le mathématicien suisse Leonhard Euler au XVIIIe siècle, porte le nom de droite d'Euler.` }],
  };
}

// ---------- 22. Culture : cercle des neuf points ----------
function genCultureCercleNeufPointsQCM() {
  return {
    type: "qcm",
    chapter: "Triangles — Culture mathématique",
    prompt: `Le "cercle des neuf points" d'un triangle passe notamment par les milieux des trois côtés et par les pieds des trois hauteurs. Combien de points remarquables ce cercle traverse-t-il en tout, comme son nom l'indique ?`,
    answer: "9",
    options: shuffle(["9", "6", "12"]),
    steps: [{ type: "donnee", text: `Ce cercle, aussi appelé cercle de Feuerbach, passe par neuf points remarquables du triangle : les milieux des côtés, les pieds des hauteurs, et les milieux des segments joignant l'orthocentre à chaque sommet.` }],
  };
}

const GENERATORS = [
  genAngleManquantTriangleSomme,
  genClassifierTriangleAnglesQCM,
  genDemonstrationSommeAnglesQCM,
  genTriangleIsoceleAnglesEgaux,
  genMediatriceEquidistanceNumeric,
  genCercleCirconscritRayonDiametre,
  genAireTriangleBaseHauteur,
  genAireTriangleTrouverBaseOuHauteur,
  genHauteurTriangleRectangleParticulariteQCM,
  genMedianeMilieuNumeric,
  genMedianePartageAireMoitieNumeric,
  genAireDiagonalesPerpendiculairesNumeric,
  genAireTrapezeNumeric,
  genFigureComposeeRectangleTriangleNumeric,
  genCultureDroiteEulerQCM,
  genCultureCercleNeufPointsQCM,
];

const DIFFICULTY = {
  genAngleManquantTriangleSomme: "facile",
  genClassifierTriangleAnglesQCM: "facile",
  genTriangleIsoceleAnglesEgaux: "facile",
  genAireTriangleBaseHauteur: "facile",
  genMedianeMilieuNumeric: "facile",
  genCultureDroiteEulerQCM: "facile",
  genCultureCercleNeufPointsQCM: "facile",
  genMediatriceEquidistanceNumeric: "standard",
  genCercleCirconscritRayonDiametre: "standard",
  genAireTriangleTrouverBaseOuHauteur: "standard",
  genHauteurTriangleRectangleParticulariteQCM: "standard",
  genMedianePartageAireMoitieNumeric: "standard",
  genAireDiagonalesPerpendiculairesNumeric: "standard",
  genDemonstrationSommeAnglesQCM: "expert",
  genFigureComposeeRectangleTriangleNumeric: "expert",
  genAireTrapezeNumeric: "expert",
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
    id: "triangles",
    title: "Triangles",
    description: "Angles dans un triangle, médiatrices et cercle circonscrit, hauteurs, médianes, aires de quadrilatères, culture mathématique (droite d'Euler).",
    pourquoi: "Médiatrices, hauteurs et médianes permettent de construire des triangles précis et de comprendre leurs points remarquables.",
    level: "cinquieme",
    free: false,
    order: 9,
    cours: {
      mindMap: {
        title: "Triangles",
        branches: [
          {
            title: "Angles dans un triangle",
            items: [
              "La somme des trois angles d'un triangle vaut toujours 180°.",
              "Classification : acutangle (3 angles aigus), rectangle (1 angle droit), obtusangle (1 angle obtus).",
            ],
            formula: "\\(\\widehat{A} + \\widehat{B} + \\widehat{C} = 180°\\)",
            figure: buildTriangleFigure(70, 60, 50, { labels: { A: "70°", B: "60°", C: "50°" } }),
          },
          {
            title: "Triangle isocèle et rectangle",
            items: [
              "Dans un triangle isocèle, les deux angles à la base (opposés aux côtés égaux) sont égaux.",
              "Dans un triangle rectangle, deux des trois hauteurs sont confondues avec les côtés de l'angle droit.",
            ],
            formula: "\\(\\text{angle à la base} = (180° - \\text{angle au sommet}) \\div 2\\)",
            figure: buildTriangleFigure(40, 70, 70, { equalSides: ["AB", "AC"], labels: { A: "40°" } }),
          },
          {
            title: "Médiatrices, hauteurs, médianes",
            items: [
              "Tout point de la médiatrice d'un segment est équidistant de ses deux extrémités.",
              "Une médiane relie un sommet au milieu du côté opposé, et partage le triangle en deux triangles de même aire.",
              "Les trois médiatrices (comme les trois hauteurs, comme les trois médianes) d'un triangle sont concourantes.",
              "Piège classique : ne pas confondre médiatrice (perpendiculaire à un côté en son milieu, ne passe pas forcément par le sommet opposé), hauteur (passe par le sommet, perpendiculaire au côté opposé) et médiane (passe par le sommet et le milieu du côté opposé).",
            ],
            figure: buildTriangleFigure(90, 50, 40, { rightAngleAt: "A" }),
          },
          {
            title: "Aire d'un triangle",
            items: [
              "Aire = (base × hauteur) ÷ 2.",
              "Piège classique : la hauteur doit être perpendiculaire à la base choisie, pas un côté oblique quelconque.",
            ],
            formula: "\\(\\mathcal{A} = \\dfrac{base \\times hauteur}{2}\\)",
            figure: buildTriangleFigure(50, 90, 40, { rightAngleAt: "B" }),
          },
        ],
      },
    },
  },
  generate,
};
