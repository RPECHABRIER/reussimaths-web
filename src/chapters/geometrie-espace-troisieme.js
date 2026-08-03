// ---------------------------------------------------------------------------
// Chapitre : Géométrie dans l'espace (3e) — sous abonnement.
//
// Correspond au chapitre 13 du manuel de 3e : la sphère et la boule (aire
// A = 4πR², volume V = 4/3 πR³, à partir du rayon ou du diamètre, volume
// d'une demi-sphère), la sphère terrestre (latitude, longitude, longueur
// d'un méridien L = πR, rayon et longueur d'un parallèle en fonction de la
// latitude via le cosinus), et sections de solides par un plan (carré ou
// rectangle pour un cube, réduction homothétique de la base pour une
// pyramide, disque de même rayon pour un cylindre, disque de rayon
// inférieur ou égal au rayon pour une sphère).
// Reprend la tâche intellectuelle des exercices du manuel (la correction du
// livre du professeur a servi à déterminer la méthode et à rédiger les
// steps), avec des nombres et contextes différents à chaque génération pour
// éviter toute reproduction à l'identique.
// Voir automatismes-troisieme.js (thème "geometrie-espace-troisieme") pour
// les mini-exercices "Calcul mental" associés.
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
const toRad = (deg) => (deg * Math.PI) / 180;

const villes = ["Arras", "Lima", "Nairobi", "Osaka", "Quito", "Bergen", "Perth", "Kingston", "Dakar", "Riga"];

// =========================== La sphère ===========================

// ---------- 1. Volume d'une sphère depuis le rayon ----------
function genVolumeSphereNumeric() {
  const R = randInt(2, 30);
  const answer = roundTo((4 / 3) * Math.PI * R ** 3, 1);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — La sphère",
    prompt: `Calcule le volume d'une boule de rayon ${R} cm (valeur approchée au dixième, en cm³).`,
    answer,
    tolerance: Math.max(0.5, answer * 0.005),
    steps: [`V = \\dfrac{4}{3} \\times \\pi \\times R^3 = \\dfrac{4}{3} \\times \\pi \\times ${R}^3 \\approx ${fr(answer)}`],
  };
}

// ---------- 2. Aire d'une sphère depuis le rayon ----------
function genAireSphereNumeric() {
  const R = randInt(2, 40);
  const answer = roundTo(4 * Math.PI * R ** 2, 1);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — La sphère",
    prompt: `Calcule l'aire d'une sphère de rayon ${R} cm (valeur approchée au dixième, en cm²).`,
    answer,
    tolerance: Math.max(0.5, answer * 0.005),
    steps: [`A = 4 \\times \\pi \\times R^2 = 4 \\times \\pi \\times ${R}^2 \\approx ${fr(answer)}`],
  };
}

// ---------- 3. Volume d'une sphère depuis le diamètre ----------
function genVolumeSphereDepuisDiametreNumeric() {
  const D = randInt(4, 50);
  const R = D / 2;
  const answer = roundTo((4 / 3) * Math.PI * R ** 3, 1);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — La sphère",
    prompt: `Calcule le volume d'une boule de diamètre ${D} cm (valeur approchée au dixième, en cm³).`,
    answer,
    tolerance: Math.max(0.5, answer * 0.005),
    steps: [`R = ${D} \\div 2 = ${fr(R)}`, `V = \\dfrac{4}{3} \\times \\pi \\times ${fr(R)}^3 \\approx ${fr(answer)}`],
  };
}

// ---------- 4. Aire d'une sphère depuis le diamètre ----------
function genAireSphereDepuisDiametreNumeric() {
  const D = randInt(4, 60);
  const R = D / 2;
  const answer = roundTo(4 * Math.PI * R ** 2, 1);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — La sphère",
    prompt: `Calcule l'aire d'une sphère de diamètre ${D} cm (valeur approchée au dixième, en cm²).`,
    answer,
    tolerance: Math.max(0.5, answer * 0.005),
    steps: [`R = ${D} \\div 2 = ${fr(R)}`, `A = 4 \\times \\pi \\times ${fr(R)}^2 \\approx ${fr(answer)}`],
  };
}

// ---------- 5. Volume d'une demi-sphère (bol) ----------
function genVolumeDemiSphereNumeric() {
  const R = randInt(3, 20);
  const answer = roundTo(0.5 * (4 / 3) * Math.PI * R ** 3, 1);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — La sphère",
    prompt: `Un bol a la forme d'une demi-sphère de rayon ${R} cm. Calcule son volume (valeur approchée au dixième, en cm³).`,
    answer,
    tolerance: Math.max(0.5, answer * 0.005),
    steps: [`V = \\dfrac{1}{2} \\times \\dfrac{4}{3} \\times \\pi \\times ${R}^3 \\approx ${fr(answer)}`],
  };
}

// =========================== La sphère terrestre ===========================

// ---------- 6. Lire des coordonnées géographiques ----------
function genLireCoordonneesGeographiquesQCM() {
  const ville = pick(villes);
  const latDeg = randInt(5, 60);
  const latDir = pick(["N", "S"]);
  const lonDeg = randInt(5, 90);
  const lonDir = pick(["E", "O"]);
  const bonneReponse = `${latDeg}° ${latDir} ; ${lonDeg}° ${lonDir}`;
  const mauvaise1 = `${lonDeg}° ${lonDir} ; ${latDeg}° ${latDir}`;
  const mauvaise2 = `${latDeg}° ${latDir === "N" ? "S" : "N"} ; ${lonDeg}° ${lonDir}`;
  return {
    type: "qcm",
    chapter: "Géométrie dans l'espace — La sphère terrestre",
    prompt: `La ville de ${ville} a pour latitude ${latDeg}° ${latDir} et pour longitude ${lonDeg}° ${lonDir}. Quelles sont ses coordonnées géographiques, sous la forme (latitude ; longitude) ?`,
    answer: bonneReponse,
    options: shuffle([bonneReponse, mauvaise1, mauvaise2]),
    steps: [`Les coordonnées géographiques s'écrivent (latitude ; longitude) : (${bonneReponse}).`],
  };
}

// ---------- 7. Distinguer latitude et longitude ----------
function genDistinguerLatitudeLongitudeQCM() {
  const askLatitude = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Géométrie dans l'espace — La sphère terrestre",
    prompt: askLatitude
      ? `Quelle coordonnée géographique mesure la position d'un point au nord ou au sud de l'équateur ?`
      : `Quelle coordonnée géographique mesure la position d'un point à l'est ou à l'ouest du méridien de référence ?`,
    answer: askLatitude ? "Latitude" : "Longitude",
    options: ["Latitude", "Longitude"],
    steps: [askLatitude ? `La latitude se mesure par rapport à l'équateur (Nord/Sud).` : `La longitude se mesure par rapport au méridien de référence (Est/Ouest).`],
  };
}

// ---------- 8. Longueur d'un méridien ----------
function genLongueurMeridienNumeric() {
  const R = pick([6371, 3390, 1737, 6052]);
  const answer = roundTo(Math.PI * R, 0);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — La sphère terrestre",
    prompt: `Une planète (ou un astre) sphérique a un rayon de ${R} km. Un méridien est un demi grand cercle. Calcule la longueur d'un méridien (valeur approchée au km près).`,
    answer,
    tolerance: 5,
    steps: [`L = \\pi \\times R = \\pi \\times ${R} \\approx ${answer}\\text{ km}`],
  };
}

// ---------- 9. Rayon d'un parallèle depuis la latitude ----------
function genRayonParalleleNumeric() {
  const R = 6371;
  const latitude = randInt(10, 70);
  const answer = roundTo(R * Math.cos(toRad(latitude)), 0);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — La sphère terrestre",
    prompt: `La Terre a un rayon de ${R} km. Calcule le rayon du parallèle situé à la latitude ${latitude}° (valeur approchée au km près).`,
    answer,
    tolerance: 5,
    steps: [`r = R \\times \\cos(${latitude}°) = ${R} \\times \\cos(${latitude}°) \\approx ${answer}\\text{ km}`],
  };
}

// ---------- 10. Longueur d'un parallèle depuis la latitude ----------
function genLongueurParalleleNumeric() {
  const R = 6371;
  const latitude = randInt(10, 70);
  const rayonParallele = R * Math.cos(toRad(latitude));
  const answer = roundTo(2 * Math.PI * rayonParallele, 0);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — La sphère terrestre",
    prompt: `La Terre a un rayon de ${R} km. Calcule la longueur du parallèle situé à la latitude ${latitude}° (valeur approchée au km près).`,
    answer,
    tolerance: 10,
    steps: [`r = ${R} \\times \\cos(${latitude}°) \\approx ${fr(roundTo(rayonParallele, 0))}\\text{ km}`, `L = 2 \\times \\pi \\times r \\approx ${answer}\\text{ km}`],
  };
}

// =========================== Sections de solides ===========================

// ---------- 11. Section d'un cube par un plan ----------
function genSectionCubeQCM() {
  const parallele = pick(["à une face", "à une arête (mais pas à une face)"]);
  const answer = parallele === "à une face" ? "Un carré identique à la face" : "Un rectangle";
  return {
    type: "qcm",
    chapter: "Géométrie dans l'espace — Sections de solides",
    prompt: `On coupe un cube par un plan parallèle ${parallele}. Quelle est la forme de la section obtenue ?`,
    answer,
    options: ["Un carré identique à la face", "Un rectangle", "Un disque"],
    steps: [
      parallele === "à une face"
        ? `Un plan parallèle à une face d'un cube donne une section carrée, de même dimensions que la face.`
        : `Un plan parallèle à une arête (mais pas à une face) donne une section rectangulaire.`,
    ],
  };
}

// ---------- 12. Section d'une pyramide par un plan parallèle à la base ----------
function genSectionPyramideFormeQCM() {
  return {
    type: "qcm",
    chapter: "Géométrie dans l'espace — Sections de solides",
    prompt: `On coupe une pyramide par un plan parallèle à sa base. Quelle est la nature de la section obtenue, par rapport à la base ?`,
    answer: "Une réduction de la base",
    options: ["Une réduction de la base", "Un agrandissement de la base", "Une figure identique à la base"],
    steps: [`La section est une réduction de la base (une figure semblable, plus petite, obtenue par une sorte d'homothétie de centre le sommet de la pyramide).`],
  };
}

// ---------- 13. Section d'un cylindre par un plan parallèle à la base ----------
function genSectionCylindreQCM() {
  return {
    type: "qcm",
    chapter: "Géométrie dans l'espace — Sections de solides",
    prompt: `On coupe un cylindre de révolution par un plan parallèle à sa base. Quelle est la forme de la section obtenue ?`,
    answer: "Un disque de même rayon que la base",
    options: ["Un disque de même rayon que la base", "Un rectangle", "Une ellipse"],
    steps: [`Un plan parallèle à la base d'un cylindre donne un disque de même rayon que la base.`],
  };
}

// ---------- 14. Section d'une sphère par un plan ----------
function genSectionSphereQCM() {
  const parPasseCentre = Math.random() < 0.5;
  return {
    type: "qcm",
    chapter: "Géométrie dans l'espace — Sections de solides",
    prompt: parPasseCentre
      ? `On coupe une sphère de rayon R par un plan qui passe par son centre. Quel est le rayon du disque obtenu ?`
      : `On coupe une sphère de rayon R par un plan qui ne passe pas par son centre. Que peut-on dire du rayon du disque obtenu, par rapport à R ?`,
    answer: parPasseCentre ? "Il est égal à R" : "Il est strictement inférieur à R",
    options: ["Il est égal à R", "Il est strictement inférieur à R", "Il est strictement supérieur à R"],
    steps: [
      parPasseCentre
        ? `Un plan passant par le centre d'une sphère donne un disque de rayon égal à R (c'est un « grand cercle »).`
        : `Un plan ne passant pas par le centre d'une sphère donne toujours un disque de rayon strictement inférieur à R.`,
    ],
  };
}

// ---------- 15. Longueur du côté de la section d'une pyramide (réduction) ----------
function genSectionPyramideLongueurNumeric() {
  const coteBase = randInt(6, 24);
  const hauteurTotale = randInt(8, 20);
  const hauteurCoupe = randInt(2, hauteurTotale - 1);
  const k = roundTo(hauteurCoupe / hauteurTotale, 3);
  const answer = roundTo(coteBase * k, 2);
  return {
    type: "numeric",
    chapter: "Géométrie dans l'espace — Sections de solides",
    prompt: `Une pyramide à base carrée a une hauteur de ${hauteurTotale} cm et un côté de base de ${coteBase} cm. On la coupe par un plan parallèle à la base, à une hauteur de ${hauteurCoupe} cm à partir du sommet. Calcule la longueur du côté du carré obtenu par cette section (arrondie au centième).`,
    answer,
    tolerance: 0.05,
    steps: [`\\text{Coefficient de réduction} = \\dfrac{${hauteurCoupe}}{${hauteurTotale}} \\approx ${fr(k)}`, `\\text{Côté de la section} = ${coteBase} \\times ${fr(k)} \\approx ${fr(answer)}`],
  };
}

const GENERATORS = [
  genVolumeSphereNumeric,
  genAireSphereNumeric,
  genVolumeSphereDepuisDiametreNumeric,
  genAireSphereDepuisDiametreNumeric,
  genVolumeDemiSphereNumeric,
  genLireCoordonneesGeographiquesQCM,
  genDistinguerLatitudeLongitudeQCM,
  genLongueurMeridienNumeric,
  genRayonParalleleNumeric,
  genLongueurParalleleNumeric,
  genSectionCubeQCM,
  genSectionPyramideFormeQCM,
  genSectionCylindreQCM,
  genSectionSphereQCM,
  genSectionPyramideLongueurNumeric,
];

const DIFFICULTY = {
  genVolumeSphereNumeric: "facile",
  genAireSphereNumeric: "facile",
  genLireCoordonneesGeographiquesQCM: "facile",
  genDistinguerLatitudeLongitudeQCM: "facile",
  genSectionCubeQCM: "facile",
  genSectionCylindreQCM: "facile",
  genVolumeSphereDepuisDiametreNumeric: "standard",
  genAireSphereDepuisDiametreNumeric: "standard",
  genVolumeDemiSphereNumeric: "standard",
  genLongueurMeridienNumeric: "standard",
  genSectionPyramideFormeQCM: "standard",
  genSectionSphereQCM: "standard",
  genRayonParalleleNumeric: "expert",
  genLongueurParalleleNumeric: "expert",
  genSectionPyramideLongueurNumeric: "expert",
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
    id: "geometrie-espace-troisieme",
    title: "Géométrie dans l'espace",
    description: "Sphère et boule (aire, volume), sphère terrestre (latitude, longitude, méridiens, parallèles), et sections de solides (cube, pyramide, cylindre, sphère) par un plan.",
    level: "troisieme",
    free: false,
    order: 14,
  },
  generate,
};
