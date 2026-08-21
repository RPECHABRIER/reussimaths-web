export const RECOMMENDED_STARTING_CHAPTERS = Object.freeze({
  sixieme: {
    chapterId: "nombres-decimaux",
    description: "Reprends les nombres, les écritures décimales et les comparaisons utiles dès la rentrée.",
  },
  cinquieme: {
    chapterId: "operations-sur-les-nombres",
    description: "Consolide les opérations et les priorités de calcul avant d'aller plus loin.",
  },
  quatrieme: {
    chapterId: "addition-soustraction-rationnels",
    description: "Vérifie les signes et les calculs avec des nombres positifs et négatifs.",
  },
  troisieme: {
    chapterId: "calcul-litteral-troisieme",
    description: "Réactive les bases du calcul littéral indispensables pour l'année et le Brevet.",
  },
  seconde: {
    chapterId: "nombres-calculs-seconde",
    description: "Fais le point sur les nombres, les intervalles et les calculs attendus au lycée.",
  },
  "premiere-spe": {
    chapterId: "second-degre",
    description: "Commence par une notion centrale de Première : expressions, équations et fonctions du second degré.",
  },
  "premiere-non-spe": {
    chapterId: "analyse-information-chiffree-premiere-non-spe",
    description: "Revois pourcentages, évolutions et lecture de données avec des situations concrètes.",
  },
  "premiere-techno": {
    chapterId: "reviser-les-bases-premiere-techno",
    description: "Vérifie les pourcentages et les évolutions avant les nouveaux chapitres de Première.",
  },
  "terminale-spe": {
    chapterId: "suites-terminale-spe",
    description: "Reprends les suites, un point d'entrée essentiel du programme de Terminale spécialité.",
  },
  "terminale-techno": {
    chapterId: "reviser-les-bases-terminale-techno",
    description: "Consolide les évolutions et les automatismes nécessaires pour bien démarrer la Terminale.",
  },
});

export function getRecommendedStartingChapter(levelId, chapters) {
  const recommendation = RECOMMENDED_STARTING_CHAPTERS[levelId];
  if (!recommendation) return null;
  const chapter = chapters.find((candidate) => candidate.meta.id === recommendation.chapterId);
  return chapter ? { ...recommendation, chapter } : null;
}
