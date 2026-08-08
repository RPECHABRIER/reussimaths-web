// ---------------------------------------------------------------------------
// Chapitre : Transformations dans le plan et leurs effets (3e) — sous abonnement.
//
// Correspond au chapitre 12 du manuel de 3e : effets des transformations du
// plan (translation, symétrie axiale, symétrie centrale, rotation,
// homothétie) sur les longueurs, les angles et les aires ; calcul de
// coordonnées de l'image d'un point par translation, symétrie ou rotation de
// centre l'origine ; homothétie de centre O et de coefficient k (relation
// OM' = k × OM, signe de k et alignement, effet sur les longueurs, le
// périmètre et l'aire) ; reconnaître le type de transformation à partir
// d'une description.
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique.
// Voir automatismes-troisieme.js (thème "transformations-plan-troisieme")
// pour les mini-exercices "Calcul mental" associés.
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
const fr = (n) => String(n).replace(".", ",");
const signedTex = (n) => `${n >= 0 ? "+" : ""}${fr(n)}`;

// Figures utilisées uniquement par la carte mentale du Cours (meta.cours.mindMap ci-dessous).
// Repère avec un point M et son image M' par symétrie centrale de centre O (l'origine).
function buildRepereImageFigure() {
  const scale = 24;
  const range = 4;
  const toX = (v) => v * scale;
  const toY = (v) => -v * scale;
  const OX1 = { id: "OX1", x: toX(-range - 0.5), y: toY(0), hideDot: true, hideLabel: true };
  const OX2 = { id: "OX2", x: toX(range + 0.5), y: toY(0), hideDot: true, hideLabel: true };
  const OY1 = { id: "OY1", x: toX(0), y: toY(-range - 0.5), hideDot: true, hideLabel: true };
  const OY2 = { id: "OY2", x: toX(0), y: toY(range + 0.5), hideDot: true, hideLabel: true };
  const O = { id: "O", x: toX(0), y: toY(0), dx: -16, dy: 16 };
  const M = { id: "M", x: toX(3), y: toY(2), dx: 8, dy: -8 };
  const Mp = { id: "Mp", label: "M'", x: toX(-3), y: toY(-2), dx: -20, dy: 14 };
  return {
    points: [OX1, OX2, OY1, OY2, O, M, Mp],
    lines: [
      { from: "OX1", to: "OX2", arrowEnd: true },
      { from: "OY1", to: "OY2", arrowEnd: true },
    ],
    segments: [{ from: "M", to: "Mp", dashed: true }],
  };
}

// Homothétie de centre O, coefficient positif : O, M, M' alignés du même côté.
function buildHomothetieFigure() {
  const O = { id: "O", x: 20, y: 100, dx: -14, dy: 4 };
  const M = { id: "M", x: 120, y: 100, dy: -10 };
  const Mp = { id: "Mp", label: "M'", x: 230, y: 100, dy: -10 };
  return {
    points: [O, M, Mp],
    segments: [
      { from: "O", to: "M" },
      { from: "M", to: "Mp", dashed: true },
    ],
  };
}

// =========================== Coordonnées d'images ===========================

// ---------- 1. Image par translation (coordonnées) ----------
function genImageTranslationCoordNumeric() {
  const x = randInt(-10, 10);
  const y = randInt(-10, 10);
  const a = nonZero(-8, 8);
  const b = nonZero(-8, 8);
  const askX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Transformations — Coordonnées d'images",
    prompt: `Le point M a pour coordonnées (${x} ; ${y}). On applique à M la translation qui envoie l'origine O sur le point de coordonnées (${a} ; ${b}). Donne ${askX ? "l'abscisse" : "l'ordonnée"} du point M', image de M.`,
    answer: askX ? x + a : y + b,
    steps: [
      { type: "regle", text: `\\text{Par une translation, on ajoute les mêmes nombres à toutes les abscisses et à toutes les ordonnées : ici on ajoute } ${a} \\text{ à l'abscisse et } ${b} \\text{ à l'ordonnée.}` },
      { type: "calcul", text: `M'(x + ${a}\\, ;\\ y + ${b}) = (${x + a}\\, ;\\ ${y + b})` },
    ],
  };
}

// ---------- 2. Image par symétrie centrale (coordonnées) ----------
function genImageSymetrieCentraleCoordNumeric() {
  const x0 = randInt(-6, 6);
  const y0 = randInt(-6, 6);
  const x = randInt(-10, 10);
  const y = randInt(-10, 10);
  const askX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Transformations — Coordonnées d'images",
    prompt: `Le point M a pour coordonnées (${x} ; ${y}). On applique à M la symétrie centrale de centre O(${x0} ; ${y0}). Donne ${askX ? "l'abscisse" : "l'ordonnée"} du point M', image de M.`,
    answer: askX ? 2 * x0 - x : 2 * y0 - y,
    steps: [
      { type: "regle", text: `\\text{Dans une symétrie centrale de centre O, O est le milieu du segment } [MM']. \\text{ Les coordonnées de O sont donc la moyenne de celles de M et M', d'où } M' = 2 \\times O - M.` },
      { type: "calcul", text: `M'(2 \\times ${x0} - (${x})\\, ;\\ 2 \\times ${y0} - (${y})) = (${2 * x0 - x}\\, ;\\ ${2 * y0 - y})` },
    ],
  };
}

// ---------- 3. Image par symétrie axiale (axe vertical ou horizontal) ----------
function genImageSymetrieAxialeCoordNumeric() {
  const axeVertical = Math.random() < 0.5;
  const a = randInt(-6, 6);
  const x = randInt(-10, 10);
  const y = randInt(-10, 10);
  const answer = axeVertical ? 2 * a - x : 2 * a - y;
  return {
    type: "numeric",
    chapter: "Transformations — Coordonnées d'images",
    prompt: `Le point M a pour coordonnées (${x} ; ${y}). On applique à M la symétrie d'axe ${axeVertical ? `la droite verticale d'équation x = ${a}` : `la droite horizontale d'équation y = ${a}`}. Donne ${axeVertical ? "l'abscisse" : "l'ordonnée"} du point M', image de M (l'autre coordonnée ne change pas).`,
    answer,
    steps: [
      {
        type: "regle",
        text: `\\text{Par symétrie d'axe la droite } ${axeVertical ? `x = ${a}` : `y = ${a}`}, \\text{ le point et son image sont équidistants de l'axe, de part et d'autre : l'axe passe donc par le milieu du segment reliant le point à son image.}`,
      },
      axeVertical ? { type: "calcul", text: `x' = 2 \\times ${a} - (${x}) = ${answer}` } : { type: "calcul", text: `y' = 2 \\times ${a} - (${y}) = ${answer}` },
    ],
  };
}

// ---------- 4. Image par rotation de centre O et angle 90°/180°/270° ----------
function genImageRotationCoordNumeric() {
  const x = nonZero(-10, 10);
  const y = nonZero(-10, 10);
  const angle = pick([90, 180, 270]);
  let xp, yp;
  if (angle === 90) {
    xp = -y;
    yp = x;
  } else if (angle === 180) {
    xp = -x;
    yp = -y;
  } else {
    xp = y;
    yp = -x;
  }
  const askX = Math.random() < 0.5;
  return {
    type: "numeric",
    chapter: "Transformations — Coordonnées d'images",
    prompt: `Le point M a pour coordonnées (${x} ; ${y}). On applique à M la rotation de centre O (l'origine du repère) et d'angle ${angle}° dans le sens direct (sens contraire des aiguilles d'une montre). Donne ${askX ? "l'abscisse" : "l'ordonnée"} du point M', image de M.`,
    answer: askX ? xp : yp,
    steps: [
      {
        type: "regle",
        text:
          angle === 90
            ? `\\text{Pour une rotation de centre O et d'angle } 90° \\text{ dans le sens direct, les coordonnées se transforment ainsi : } (x\\, ;\\ y) \\rightarrow (-y\\, ;\\ x).`
            : angle === 180
              ? `\\text{Pour une rotation de centre O et d'angle } 180°, \\text{ M' est le symétrique de M par rapport à O : les coordonnées se transforment ainsi : } (x\\, ;\\ y) \\rightarrow (-x\\, ;\\ -y).`
              : `\\text{Pour une rotation de centre O et d'angle } 270° \\text{ dans le sens direct (ou } 90° \\text{ dans le sens indirect), les coordonnées se transforment ainsi : } (x\\, ;\\ y) \\rightarrow (y\\, ;\\ -x).`,
      },
      { type: "calcul", text: `M'(${xp}\\, ;\\ ${yp})` },
    ],
  };
}

// =========================== Homothéties ===========================

// ---------- 5. Coefficient d'une homothétie depuis OM et OM' ----------
function genCoefficientHomothetieNumeric() {
  const OM = randInt(2, 12);
  const k = pick([2, 3, 4, 0.5, 1.5, 2.5, -2, -0.5]);
  const OMprime = roundTo(Math.abs(OM * k), 2);
  return {
    type: "numeric",
    chapter: "Transformations — Homothéties",
    prompt: `M' est l'image de M par une homothétie de centre O. On donne OM = ${OM} cm et OM' = ${fr(OMprime)} cm, avec O, M et M' alignés ${k > 0 ? "dans cet ordre (O, M, M')" : "mais M' du côté opposé de O par rapport à M"}. Donne la valeur absolue du coefficient de cette homothétie (un nombre positif).`,
    answer: Math.abs(k),
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `|k| = \\dfrac{OM'}{OM} = \\dfrac{${fr(OMprime)}}{${OM}} = ${fr(Math.abs(k))}` }],
  };
}

// ---------- 6. Calculer OM' connaissant OM et k ----------
function genOMPrimeHomothetieNumeric() {
  const OM = randInt(2, 15);
  const k = pick([2, 3, 4, 0.5, 0.25, 1.5, 2.5]);
  const answer = roundTo(OM * k, 2);
  return {
    type: "numeric",
    chapter: "Transformations — Homothéties",
    prompt: `M' est l'image de M par une homothétie de centre O et de coefficient ${fr(k)}. On donne OM = ${OM} cm. Calcule OM'.`,
    answer,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `OM' = ${fr(k)} \\times ${OM} = ${fr(answer)}` }],
  };
}

// ---------- 7. Longueur d'une figure après homothétie ----------
function genLongueurHomothetieNumeric() {
  const longueur = randInt(2, 20);
  const k = pick([2, 3, 4, 0.5, 0.25, 1.5]);
  const answer = roundTo(longueur * k, 2);
  return {
    type: "numeric",
    chapter: "Transformations — Homothéties",
    prompt: `Un segment de ${longueur} cm a pour image, par une homothétie de coefficient ${fr(k)}, un segment de quelle longueur (en cm) ?`,
    answer,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `${longueur} \\times ${fr(k)} = ${fr(answer)}` }],
  };
}

// ---------- 8. Périmètre après homothétie ----------
function genPerimetreHomothetieNumeric() {
  const perimetre = randInt(10, 60);
  const k = pick([2, 3, 0.5, 1.5, 4]);
  const answer = roundTo(perimetre * k, 2);
  return {
    type: "numeric",
    chapter: "Transformations — Homothéties",
    prompt: `Un polygone a un périmètre de ${perimetre} cm. Son image par une homothétie de coefficient ${fr(k)} a quel périmètre (en cm) ?`,
    answer,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `${perimetre} \\times ${fr(k)} = ${fr(answer)}` }],
  };
}

// ---------- 9. Aire après homothétie (coefficient au carré) ----------
function genAireHomothetieNumeric() {
  const aire = randInt(4, 40);
  const k = pick([2, 3, 0.5, 1.5, 4]);
  const answer = roundTo(aire * k * k, 2);
  return {
    type: "numeric",
    chapter: "Transformations — Homothéties",
    prompt: `Une figure a une aire de ${aire} cm². Son image par une homothétie de coefficient ${fr(k)} a quelle aire (en cm²) ?`,
    answer,
    tolerance: 0.05,
    steps: [{ type: "calcul", text: `${aire} \\times ${fr(k)}^2 = ${fr(answer)}` }],
  };
}

// ---------- 10. Alignement selon le signe du coefficient ----------
function genOrdreAlignementHomothetieQCM() {
  const kPositif = Math.random() < 0.5;
  const options = ["O, M et M' sont alignés dans cet ordre", "M', O et M sont alignés dans cet ordre"];
  return {
    type: "qcm",
    chapter: "Transformations — Homothéties",
    prompt: `M' est l'image de M par une homothétie de centre O et de coefficient ${kPositif ? "positif" : "négatif"}. Quel est l'ordre des points alignés O, M et M' ?`,
    answer: kPositif ? options[0] : options[1],
    options,
    steps: [
      {
        type: "regle",
        text: kPositif
          ? `Un coefficient positif place M' du même côté de O que M : O, M et M' sont alignés dans cet ordre (ou O entre les deux si |k|<1, mais toujours du même côté).`
          : `Un coefficient négatif place M' du côté opposé de O par rapport à M : O est entre M et M'.`,
      },
    ],
  };
}

// =========================== Propriétés des transformations ===========================

// ---------- 11. Propriétés conservées par une transformation ----------
function genProprietesConserveesQCM() {
  const transfo = pick(["une translation", "une symétrie axiale", "une symétrie centrale", "une rotation", "une homothétie de coefficient différent de 1 et -1"]);
  const conserveLongueurs = transfo !== "une homothétie de coefficient différent de 1 et -1";
  const answer = conserveLongueurs ? "Oui" : "Non";
  return {
    type: "qcm",
    chapter: "Transformations — Propriétés",
    prompt: `${transfo.charAt(0).toUpperCase() + transfo.slice(1)} conserve-t-elle les longueurs (la figure image a-t-elle les mêmes longueurs que la figure de départ) ?`,
    answer,
    options: ["Oui", "Non"],
    steps: [
      {
        type: "regle",
        text: conserveLongueurs
          ? `Les translations, symétries (axiales ou centrales) et rotations sont des transformations qui conservent les longueurs et les angles.`
          : `Une homothétie de coefficient k (avec |k| différent de 1) multiplie toutes les longueurs par |k| : elle ne conserve donc pas les longueurs (sauf si |k| = 1).`,
      },
    ],
  };
}

// ---------- 12. Angles conservés par toute transformation usuelle ----------
function genAngleConserveTransformationQCM() {
  const angle = randInt(20, 150);
  const transfo = pick(["une translation", "une symétrie axiale", "une symétrie centrale", "une rotation", "une homothétie"]);
  return {
    type: "numeric",
    chapter: "Transformations — Propriétés",
    prompt: `Un angle mesure ${angle}°. Quelle est la mesure de son image par ${transfo} ?`,
    answer: angle,
    steps: [{ type: "regle", text: `Toutes les transformations usuelles (translation, symétrie, rotation, homothétie) conservent les angles : l'image mesure aussi ${angle}°.` }],
  };
}

// ---------- 13. Identifier le type de transformation ----------
function genIdentifierTransformationQCM() {
  const cas = pick([
    { description: "Chaque point de la figure se déplace de la même distance, dans la même direction et le même sens.", reponse: "Translation" },
    { description: "Chaque point et son image sont symétriques par rapport à une droite fixe.", reponse: "Symétrie axiale" },
    { description: "Chaque point et son image sont symétriques par rapport à un point fixe (qui est le milieu de chaque segment reliant un point à son image).", reponse: "Symétrie centrale" },
    { description: "Chaque point tourne autour d'un point fixe, d'un même angle.", reponse: "Rotation" },
    { description: "La figure image est un agrandissement ou une réduction de la figure de départ, tous les points étant alignés avec un point fixe et leur image.", reponse: "Homothétie" },
  ]);
  const options = shuffle(["Translation", "Symétrie axiale", "Symétrie centrale", "Rotation", "Homothétie"]);
  return {
    type: "qcm",
    chapter: "Transformations — Propriétés",
    prompt: `Quelle transformation correspond à la description suivante : « ${cas.description} » ?`,
    answer: cas.reponse,
    options,
    steps: [{ type: "resultat", text: `Il s'agit d'une ${cas.reponse.toLowerCase()}.` }],
  };
}

// ---------- 14. Image du milieu d'un segment ----------
function genImageMilieuSegmentQCM() {
  const [p1, p2] = shuffle(["A", "B", "C", "D"]).slice(0, 2);
  return {
    type: "text",
    chapter: "Transformations — Propriétés",
    prompt: `I est le milieu du segment [${p1}${p2}]. Une transformation envoie ${p1} sur ${p1}' et ${p2} sur ${p2}'. Quelle est l'image de I par cette transformation ? Réponds par « milieu de [${p1}'${p2}'] ».`,
    answer: `milieu de [${p1}'${p2}']`,
    steps: [{ type: "regle", text: `Toutes les transformations usuelles conservent le milieu d'un segment : l'image de I est le milieu de [${p1}'${p2}'].` }],
  };
}

// ---------- 15. Rapport entre aire image et aire de départ pour une homothétie ----------
function genRapportAireHomothetieNumeric() {
  const k = pick([2, 3, 4, 0.5, 5]);
  const answer = roundTo(k * k, 2);
  return {
    type: "numeric",
    chapter: "Transformations — Homothéties",
    prompt: `Une homothétie a pour coefficient ${fr(k)}. Par combien l'aire d'une figure est-elle multipliée après cette homothétie ?`,
    answer,
    tolerance: 0.02,
    steps: [{ type: "calcul", text: `\\text{Rapport des aires} = k^2 = ${fr(k)}^2 = ${fr(answer)}` }],
  };
}

const GENERATORS = [
  genImageTranslationCoordNumeric,
  genImageSymetrieCentraleCoordNumeric,
  genImageSymetrieAxialeCoordNumeric,
  genImageRotationCoordNumeric,
  genCoefficientHomothetieNumeric,
  genOMPrimeHomothetieNumeric,
  genLongueurHomothetieNumeric,
  genPerimetreHomothetieNumeric,
  genAireHomothetieNumeric,
  genOrdreAlignementHomothetieQCM,
  genProprietesConserveesQCM,
  genAngleConserveTransformationQCM,
  genIdentifierTransformationQCM,
  genImageMilieuSegmentQCM,
  genRapportAireHomothetieNumeric,
];

const DIFFICULTY = {
  genImageTranslationCoordNumeric: "facile",
  genImageSymetrieCentraleCoordNumeric: "facile",
  genImageSymetrieAxialeCoordNumeric: "facile",
  genCoefficientHomothetieNumeric: "facile",
  genProprietesConserveesQCM: "facile",
  genAngleConserveTransformationQCM: "facile",
  genImageRotationCoordNumeric: "standard",
  genOMPrimeHomothetieNumeric: "standard",
  genLongueurHomothetieNumeric: "standard",
  genPerimetreHomothetieNumeric: "standard",
  genAireHomothetieNumeric: "standard",
  genOrdreAlignementHomothetieQCM: "standard",
  genIdentifierTransformationQCM: "standard",
  genImageMilieuSegmentQCM: "standard",
  genRapportAireHomothetieNumeric: "expert",
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
    id: "transformations-plan-troisieme",
    title: "Transformations dans le plan et leurs effets",
    description: "Coordonnées d'images par translation, symétrie et rotation, homothétie (coefficient, effet sur longueurs/périmètre/aire), et propriétés conservées par les transformations usuelles.",
    pourquoi: "Translations, symétries, rotations et homothéties décrivent tous les mouvements et agrandissements qu'on retrouve en dessin, en architecture et dans les jeux vidéo.",
    level: "troisieme",
    free: false,
    order: 13,
    cours: {
      mindMap: {
        title: "Transformations dans le plan et leurs effets",
        branches: [
          {
            title: "Coordonnées d'une image",
            items: [
              "Translation : on ajoute les mêmes nombres à toutes les abscisses et à toutes les ordonnées.",
              "Symétrie centrale de centre O : \\(M' = 2O - M\\) (O est le milieu de [MM']).",
              "Symétrie d'axe vertical/horizontal : une seule coordonnée change, l'axe est le milieu entre M et son image.",
              "Rotation de centre O (sens direct) : \\(90° : (x;y) \\rightarrow (-y;x)\\) ; \\(180° : (x;y) \\rightarrow (-x;-y)\\) ; \\(270° : (x;y) \\rightarrow (y;-x)\\).",
              "Piège classique : le sens direct est le sens contraire des aiguilles d'une montre (sens trigonométrique).",
            ],
            figure: buildRepereImageFigure(),
          },
          {
            title: "Homothétie : coefficient",
            items: [
              "\\(OM' = |k| \\times OM\\), avec O, M, M' toujours alignés.",
              "Coefficient positif : M' du même côté de O que M. Coefficient négatif : O est entre M et M'.",
            ],
            formula: "\\(OM' = |k| \\times OM\\)",
            figure: buildHomothetieFigure(),
          },
          {
            title: "Homothétie : périmètre et aire",
            items: [
              "Une homothétie de coefficient k multiplie les longueurs et le périmètre par |k|, et l'aire par \\(k^2\\).",
              "Piège classique : multiplier l'aire par k au lieu de \\(k^2\\).",
            ],
          },
          {
            title: "Propriétés conservées",
            items: [
              "Translation, symétries et rotation conservent longueurs, angles et aires.",
              "Une homothétie conserve les angles, mais multiplie les longueurs par |k| (donc ne les conserve que si |k| = 1).",
              "Toute transformation usuelle conserve le milieu d'un segment.",
            ],
          },
        ],
      },
    },
  },
  generate,
};
