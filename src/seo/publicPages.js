import brevetChapter, { SEO_EXAMPLE_GENERATORS as brevetExamples } from "../chapters/dossier-brevet-troisieme.js";
import proportionnaliteChapter, { SEO_EXAMPLE_GENERATORS as proportionnaliteExamples } from "../chapters/proportionnalite-cinquieme.js";
import thalesChapter, { SEO_EXAMPLE_GENERATORS as thalesExamples } from "../chapters/theoreme-thales.js";
import calculLitteralChapter, { SEO_EXAMPLE_GENERATORS as calculLitteralExamples } from "../chapters/calcul-litteral-troisieme.js";
import fonctionsAffinesChapter, { SEO_EXAMPLE_GENERATORS as fonctionsAffinesExamples } from "../chapters/fonctions-affines-troisieme.js";
import probabilitesChapter, { SEO_EXAMPLE_GENERATORS as probabilitesExamples } from "../chapters/probabilites-troisieme.js";
import { SITE_URL } from "./site.js";

export { SITE_URL };

function withSeed(seed, callback) {
  const previousRandom = Math.random;
  let state = seed >>> 0;
  Math.random = () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  try {
    return callback();
  } finally {
    Math.random = previousRandom;
  }
}

function formatAnswer(answer) {
  if (Array.isArray(answer)) return answer.join(", ");
  if (typeof answer === "boolean") return answer ? "Oui" : "Non";
  return String(answer ?? "");
}

function normalizeMath(text) {
  if (typeof text !== "string") return text;
  if (/\\\(|\\\[/.test(text) || !/\\[a-zA-Z]+|[\^_]\{/.test(text)) return text;
  return `\\(${text}\\)`;
}

function buildExamples(generators, seed) {
  return withSeed(seed, () => generators.map((generate) => {
    const exercise = generate();
    const method = (exercise.steps ?? []).map((step) => normalizeMath(step.text)).filter(Boolean).join(" Puis : ");
    return {
      question: exercise.prompt,
      answer: `${method}${method ? " " : ""}Réponse : ${formatAnswer(exercise.answer)}.`,
      sourceGenerator: generate.name,
    };
  }));
}

function selectRules(chapter, titles) {
  const branches = chapter.meta.cours?.mindMap?.branches ?? [];
  return titles.map((title) => {
    const branch = branches.find((candidate) => candidate.title === title);
    if (!branch) throw new Error(`Section pédagogique introuvable : ${chapter.meta.id} / ${title}`);
    return { title: branch.title, text: branch.items.join(" "), formula: branch.formula };
  });
}

function canonicalCourse(config) {
  const rules = config.rules ?? selectRules(config.chapter, config.sections);
  return {
    ...config,
    chapterId: config.chapter.meta.id,
    sourceChapterIds: config.sourceChapterIds ?? [config.chapter.meta.id],
    points: rules.slice(0, 3).map((rule) => rule.title),
    rules,
    exercises: buildExamples(config.exampleGenerators, config.seed),
    canonicalSource: config.chapter.meta.id,
    intent: config.intent,
    chapter: undefined,
    sections: undefined,
    exampleGenerators: undefined,
    seed: undefined,
  };
}

export const PUBLIC_COURSES = [
  {
    levelId: "sixieme",
    levelLabel: "6e",
    slug: "fractions",
    chapterId: "fractions",
    title: "Fractions en 6e : cours et exercices corrigés",
    description: "Comprendre, représenter et comparer les fractions en 6e avec une méthode claire, des exemples et des exercices corrigés.",
    intro: "Une fraction représente un partage en parts égales. Le nombre du bas indique en combien de parts l’unité est découpée ; celui du haut indique combien de parts sont prises.",
    points: ["Lire et représenter une fraction", "Repérer une fraction sur une droite graduée", "Comparer des fractions simples"],
    rules: [
      { title: "Vocabulaire", text: "Dans 3/4, 3 est le numérateur et 4 le dénominateur : on prend 3 parts parmi 4 parts égales." },
      { title: "Même dénominateur", text: "Quand deux fractions ont le même dénominateur, la plus grande est celle qui a le plus grand numérateur." },
    ],
    exercises: [
      { question: "Une tablette est partagée en 8 parts égales. Lina en mange 3. Quelle fraction a-t-elle mangée ?", answer: "3/8" },
      { question: "Compare 5/7 et 3/7.", answer: "5/7 > 3/7, car les dénominateurs sont identiques et 5 > 3." },
      { question: "Quelle fraction correspond à la moitié de 10 parts égales ?", answer: "5/10, qui est égale à 1/2." },
    ],
  },
  {
    levelId: "cinquieme",
    levelLabel: "5e",
    slug: "fractions",
    chapterId: "divisibilite-fractions",
    title: "Fractions en 5e : méthodes et exercices corrigés",
    description: "Réviser les fractions en 5e : simplification, comparaison et calculs expliqués pas à pas, puis exercices corrigés.",
    intro: "En 5e, on utilise les fractions pour représenter des quotients, comparer des nombres et résoudre des problèmes de partage ou de proportion.",
    points: ["Reconnaître des fractions égales", "Simplifier avec un diviseur commun", "Additionner des fractions de même dénominateur"],
    rules: [
      { title: "Fractions égales", text: "Multiplier ou diviser le numérateur et le dénominateur par un même nombre non nul ne change pas la valeur de la fraction." },
      { title: "Addition", text: "Avec le même dénominateur, on additionne les numérateurs et on conserve le dénominateur." },
    ],
    exercises: [
      { question: "Simplifie 12/18.", answer: "12/18 = 2/3 en divisant le numérateur et le dénominateur par 6." },
      { question: "Calcule 2/9 + 4/9.", answer: "6/9, soit 2/3 après simplification." },
      { question: "Les fractions 3/5 et 12/20 sont-elles égales ?", answer: "Oui : 3/5 × 4/4 = 12/20." },
    ],
  },
  {
    levelId: "quatrieme",
    levelLabel: "4e",
    slug: "calcul-litteral",
    chapterId: "calcul-litteral-quatrieme",
    title: "Calcul littéral en 4e : cours et exercices corrigés",
    description: "Développer, réduire et calculer une expression littérale en 4e grâce à des méthodes simples et des exercices corrigés.",
    intro: "Le calcul littéral utilise des lettres pour représenter des nombres. Il permet d’écrire une règle générale, puis de transformer une expression sans changer sa valeur.",
    points: ["Réduire une expression", "Utiliser la distributivité", "Calculer une expression pour une valeur donnée"],
    rules: [
      { title: "Réduire", text: "On regroupe uniquement les termes de même nature : 3x + 5x = 8x, mais 3x + 5 ne se réduit pas." },
      { title: "Distributivité", text: "Pour tous nombres k, a et b : k(a + b) = ka + kb." },
    ],
    exercises: [
      { question: "Réduis 7x + 2x − 4.", answer: "9x − 4." },
      { question: "Développe 3(x + 5).", answer: "3x + 15." },
      { question: "Calcule 2x + 7 pour x = 4.", answer: "2 × 4 + 7 = 15." },
    ],
  },
  {
    levelId: "quatrieme",
    levelLabel: "4e",
    slug: "theoreme-pythagore",
    chapterId: "triangles-rectangles-quatrieme",
    title: "Théorème de Pythagore en 4e : cours et exercices corrigés",
    description: "Appliquer la formule de Pythagore en 4e, calculer une longueur et vérifier si un triangle est rectangle avec des exercices corrigés.",
    intro: "Dans un triangle rectangle, le carré de la longueur de l’hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.",
    points: ["Identifier l’hypoténuse", "Calculer une longueur manquante", "Utiliser la réciproque de Pythagore"],
    rules: [
      { title: "Théorème", text: "Si ABC est rectangle en A, alors BC² = AB² + AC². BC est l’hypoténuse, face à l’angle droit." },
      { title: "Réciproque", text: "Si le carré du plus grand côté égale la somme des carrés des deux autres, alors le triangle est rectangle." },
    ],
    exercises: [
      { question: "Un triangle rectangle a pour côtés de l’angle droit 3 cm et 4 cm. Calcule l’hypoténuse.", answer: "√(3² + 4²) = √25 = 5 cm." },
      { question: "Un triangle de côtés 6, 8 et 10 est-il rectangle ?", answer: "Oui : 10² = 100 et 6² + 8² = 36 + 64 = 100." },
      { question: "ABC est rectangle en A, BC = 13 cm et AB = 5 cm. Calcule AC.", answer: "AC = √(13² − 5²) = √144 = 12 cm." },
    ],
  },
  canonicalCourse({
    levelId: "troisieme",
    levelLabel: "3e",
    slug: "revisions-brevet-maths",
    chapter: brevetChapter,
    sourceChapterIds: ["dossier-brevet-troisieme", "calcul-litteral-troisieme", "fonctions-affines-troisieme", "probabilites-troisieme", "theoreme-thales"],
    intent: "révisions Brevet maths 3e",
    title: "Révisions Brevet maths : exercices corrigés de 3e",
    description: "Révise les notions essentielles du Brevet de maths avec des méthodes claires, des exemples et des exercices corrigés de niveau 3e.",
    h1: "Révisions Brevet maths : méthodes et exercices corrigés",
    intro: "Prépare l’épreuve avec une synthèse active : repère la famille du problème, choisis une méthode, puis confronte ton raisonnement à une correction. Les exemples couvrent les grands réflexes attendus au Brevet sans annoncer systématiquement la méthode à employer.",
    rules: [
      selectRules(calculLitteralChapter, ["Développer"])[0],
      selectRules(fonctionsAffinesChapter, ["Identifier a et b"])[0],
      selectRules(probabilitesChapter, ["Calculer une probabilité"])[0],
      selectRules(thalesChapter, ["La configuration de Thalès"])[0],
    ],
    exampleGenerators: brevetExamples,
    seed: 202608201,
    ctaLabel: "Commencer une série type Brevet",
    relatedLinks: [
      { label: "Calcul littéral en 3e", path: "/cours/troisieme/calcul-litteral" },
      { label: "Fonctions affines en 3e", path: "/cours/troisieme/fonctions-affines" },
      { label: "Probabilités en 3e", path: "/cours/troisieme/probabilites" },
    ],
  }),
  canonicalCourse({
    levelId: "cinquieme",
    levelLabel: "5e",
    slug: "proportionnalite",
    chapter: proportionnaliteChapter,
    intent: "proportionnalité 5e",
    title: "Proportionnalité en 5e : cours et exercices corrigés",
    description: "Comprends la proportionnalité en 5e : coefficient, valeur manquante, pourcentages, échelles et vitesse avec exercices corrigés.",
    h1: "Proportionnalité en 5e : cours, méthodes et exercices",
    intro: "Apprends à reconnaître une situation de proportionnalité avant de calculer. Le coefficient est le fil directeur ; selon les données, un retour à l’unité ou un tableau peut être plus clair qu’un produit en croix.",
    sections: ["Identifier une situation", "Coefficient et valeur manquante", "Pourcentages", "Échelles", "Vitesse"],
    exampleGenerators: proportionnaliteExamples,
    seed: 202608202,
    ctaLabel: "S’entraîner sur la proportionnalité",
    relatedLinks: [
      { label: "Fractions en 5e", path: "/cours/cinquieme/fractions" },
      { label: "Théorème de Thalès en 4e", path: "/cours/quatrieme/theoreme-thales" },
    ],
  }),
  canonicalCourse({
    levelId: "quatrieme",
    levelLabel: "4e",
    slug: "theoreme-thales",
    chapter: thalesChapter,
    intent: "théorème de Thalès 4e",
    title: "Théorème de Thalès en 4e : cours et exercices corrigés",
    description: "Apprends le théorème de Thalès en 4e : configuration, calcul de longueur et réciproque avec exemples et exercices corrigés.",
    h1: "Théorème de Thalès en 4e : méthode et exercices corrigés",
    intro: "Avant tout calcul, vérifie les alignements et le parallélisme. Une fois la configuration reconnue, conserve le même ordre dans les rapports pour calculer une longueur ou démontrer que deux droites sont parallèles.",
    sections: ["La configuration de Thalès", "Calculer une longueur", "Réciproque : prouver un parallélisme", "Problèmes, agrandissement/réduction"],
    exampleGenerators: thalesExamples,
    seed: 202608203,
    ctaLabel: "Faire des exercices de Thalès",
    relatedLinks: [
      { label: "Théorème de Pythagore en 4e", path: "/cours/quatrieme/theoreme-pythagore" },
      { label: "Révisions Brevet maths", path: "/cours/troisieme/revisions-brevet-maths" },
    ],
  }),
  canonicalCourse({
    levelId: "troisieme",
    levelLabel: "3e",
    slug: "calcul-litteral",
    chapter: calculLitteralChapter,
    intent: "calcul littéral 3e",
    title: "Calcul littéral en 3e : développer et factoriser",
    description: "Révise le calcul littéral en 3e : distributivité, identités remarquables, factorisation et programmes de calcul avec corrections.",
    h1: "Calcul littéral en 3e : développer, factoriser et résoudre",
    intro: "Développer transforme un produit en somme ; factoriser effectue le chemin inverse. En 3e, savoir choisir entre ces deux écritures permet de simplifier, démontrer et résoudre des problèmes.",
    sections: ["Développer", "Identités remarquables", "Factoriser", "Programmes de calcul", "Problèmes de périmètre et d'aire"],
    exampleGenerators: calculLitteralExamples,
    seed: 202608204,
    ctaLabel: "S’entraîner en calcul littéral",
    relatedLinks: [
      { label: "Révisions Brevet maths", path: "/cours/troisieme/revisions-brevet-maths" },
      { label: "Fonctions affines en 3e", path: "/cours/troisieme/fonctions-affines" },
      { label: "Programme de maths 3e", path: "/niveau/troisieme" },
    ],
  }),
  canonicalCourse({
    levelId: "troisieme",
    levelLabel: "3e",
    slug: "fonctions-affines",
    chapter: fonctionsAffinesChapter,
    intent: "fonctions affines 3e",
    title: "Fonctions affines en 3e : cours et exercices corrigés",
    description: "Comprends les fonctions affines en 3e : formule ax+b, coefficient directeur, représentation graphique, images et antécédents.",
    h1: "Fonctions affines en 3e : formule, graphique et exercices",
    intro: "Une fonction affine relie une variation régulière à une valeur de départ. Apprends à lire ses coefficients, tester un point et retrouver une formule à partir de données.",
    sections: ["Identifier a et b", "Droites et coefficients", "Déterminer une fonction affine", "Comparer deux tarifs"],
    exampleGenerators: fonctionsAffinesExamples,
    seed: 202608205,
    ctaLabel: "S’entraîner sur les fonctions affines",
    relatedLinks: [
      { label: "Calcul littéral en 3e", path: "/cours/troisieme/calcul-litteral" },
      { label: "Révisions Brevet maths", path: "/cours/troisieme/revisions-brevet-maths" },
      { label: "Programme de maths 3e", path: "/niveau/troisieme" },
    ],
  }),
  canonicalCourse({
    levelId: "troisieme",
    levelLabel: "3e",
    slug: "probabilites",
    chapter: probabilitesChapter,
    intent: "probabilités 3e",
    title: "Probabilités en 3e : cours et exercices corrigés",
    description: "Révise les probabilités en 3e : issues, événements, équiprobabilité, événement contraire et tirage sans remise avec corrections.",
    h1: "Probabilités en 3e : cours, méthodes et exercices corrigés",
    intro: "Décris d’abord l’expérience et ses issues. La formule « cas favorables sur cas possibles » ne s’applique directement que lorsque les issues sont équiprobables ; les corrections ci-dessous rendent cette hypothèse explicite.",
    sections: ["Vocabulaire", "Calculer une probabilité", "Événement contraire, somme des probabilités", "Tirage sans remise"],
    exampleGenerators: probabilitesExamples,
    seed: 202608216,
    ctaLabel: "Faire des exercices de probabilités",
    relatedLinks: [
      { label: "Révisions Brevet maths", path: "/cours/troisieme/revisions-brevet-maths" },
      { label: "Fonctions affines en 3e", path: "/cours/troisieme/fonctions-affines" },
      { label: "Programme de maths 3e", path: "/niveau/troisieme" },
    ],
  }),
];

export function getPublicCourse(levelId, slug) {
  return PUBLIC_COURSES.find((page) => page.levelId === levelId && page.slug === slug);
}

export function coursePath(page) {
  return `/cours/${page.levelId}/${page.slug}`;
}
