export const SITE_URL = "https://reussimaths-web.vercel.app";

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
];

export function getPublicCourse(levelId, slug) {
  return PUBLIC_COURSES.find((page) => page.levelId === levelId && page.slug === slug);
}

export function coursePath(page) {
  return `/cours/${page.levelId}/${page.slug}`;
}
