export const PREVIOUS_LEVEL = {
  cinquieme: "sixieme",
  quatrieme: "cinquieme",
  troisieme: "quatrieme",
  seconde: "troisieme",
  "premiere-spe": "seconde",
  "premiere-non-spe": "seconde",
  "premiere-techno": "seconde",
  "terminale-spe": "premiere-spe",
  "terminale-techno": "premiere-techno",
};

// Socles ordonnés : les notions dont la fragilité risque le plus d'entraver
// l'année suivante. Les correspondances thématiques affinent ensuite cette
// base selon les chapitres déclarés par l'élève.
export const LEVEL_FOUNDATIONS = {
  cinquieme: ["nombres-decimaux", "operations-decimaux", "fractions", "proportionnalite", "grandeurs-mesures", "angles"],
  quatrieme: ["operations-sur-les-nombres", "divisibilite-fractions", "nombres-relatifs", "calcul-litteral", "proportionnalite-cinquieme", "triangles"],
  troisieme: ["addition-soustraction-rationnels", "multiplication-division-rationnels", "calcul-litteral-quatrieme", "resolution-equations", "proportionnalite-quatrieme", "triangles-rectangles-quatrieme"],
  seconde: ["calcul-numerique-troisieme", "calcul-litteral-troisieme", "equations-troisieme", "notion-fonction-troisieme", "fonctions-affines-troisieme", "proportionnalite-troisieme"],
  "premiere-spe": ["nombres-calculs-seconde", "generalites-fonctions-seconde", "variations-fonctions-seconde", "fonctions-affines-seconde", "vecteurs-seconde", "probabilites-echantillonnage-seconde"],
  "premiere-non-spe": ["informations-chiffrees-seconde", "statistiques-descriptives-seconde", "probabilites-echantillonnage-seconde", "fonctions-affines-seconde", "variations-fonctions-seconde", "nombres-calculs-seconde"],
  "premiere-techno": ["informations-chiffrees-seconde", "statistiques-descriptives-seconde", "probabilites-echantillonnage-seconde", "fonctions-affines-seconde", "variations-fonctions-seconde", "nombres-calculs-seconde"],
  "terminale-spe": ["derivation-premiere-spe", "suites-numeriques-premiere-spe", "fonction-exponentielle-premiere-spe", "probabilites-conditionnelles-premiere-spe", "vecteurs-produit-scalaire-premiere-spe", "trigonometrie-premiere-spe"],
  "terminale-techno": ["derivation-premiere-techno", "suites-numeriques-premiere-techno", "fonctions-second-degre-premiere-techno", "probabilites-conditionnelles-premiere-techno", "variables-aleatoires-premiere-techno", "statistiques-deux-variables-premiere-techno"],
};

const DOMAIN_WORDS = {
  numeric: ["nombre", "calcul", "fraction", "rationnel", "puissance", "entier", "décimal"],
  algebra: ["littéral", "équation", "second degré", "quadratique"],
  functions: ["fonction", "variation", "dérivation", "exponent", "logarith", "suite"],
  proportionality: ["proportion", "pourcentage", "information chiffrée", "croissance"],
  data: ["statistique", "probabilité", "variable aléatoire", "échantillonnage", "dénombrement"],
  geometry: ["géométr", "triangle", "angle", "théorème", "symétr", "repérage", "vecteur", "droite", "trigonométr", "distance", "colinéar"],
  measures: ["mesure", "grandeur", "espace", "aire", "volume"],
  algorithmics: ["algorith", "python"],
};

function normalize(value) {
  return value.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function domains(chapter) {
  const text = normalize(`${chapter.meta.id} ${chapter.meta.title}`);
  return Object.entries(DOMAIN_WORDS)
    .filter(([, words]) => words.some((word) => text.includes(normalize(word))))
    .map(([domain]) => domain);
}

export function getPreviousLevelId(levelId) {
  return PREVIOUS_LEVEL[levelId] ?? null;
}

export function selectPrerequisiteChapters(levelId, selectedCurrent, previousChapters, limit = 6) {
  const selectedDomains = new Set(selectedCurrent.flatMap(domains));
  const foundations = LEVEL_FOUNDATIONS[levelId] ?? [];
  const scored = previousChapters.map((chapter) => ({
    chapter,
    score: domains(chapter).filter((domain) => selectedDomains.has(domain)).length * 10
      + Math.max(0, foundations.length - foundations.indexOf(chapter.meta.id)),
  }));
  scored.sort((a, b) => b.score - a.score || (a.chapter.meta.order ?? 999) - (b.chapter.meta.order ?? 999));
  return scored.slice(0, limit).map(({ chapter }) => chapter);
}

export const CM2_REMEDIATION = {
  "cm2-numeration-decimale": "nombres-decimaux",
  "cm2-operations": "operations-decimaux",
  "cm2-fractions": "fractions",
  "cm2-proportionnalite": "proportionnalite",
  "cm2-grandeurs": "grandeurs-mesures",
  "cm2-geometrie": "angles",
};
