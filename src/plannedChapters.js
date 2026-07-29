// ---------------------------------------------------------------------------
// Chapitres PRÉVUS pour un niveau, mais pas encore écrits (pas de générateur
// d'exercices — voir src/chapters/*.js pour le contenu réel). Sert uniquement
// à afficher le sommaire complet d'un niveau sur /niveau/:levelId, avec les
// chapitres à venir en gris ("Bientôt").
//
// Dès qu'un chapitre réel est créé avec le même `id` dans src/chapters/*.js,
// il "remplace" automatiquement son entrée ici (voir Niveau.jsx) : rien à
// supprimer manuellement quand on écrit le contenu.
// ---------------------------------------------------------------------------

export const PLANNED_CHAPTERS = {
  sixieme: [
    { id: "nombres-decimaux", title: "Nombres décimaux", order: 1 },
    { id: "operations-decimaux", title: "Opérations sur les décimaux", order: 2 },
    { id: "fractions", title: "Fractions", order: 3 },
    { id: "grandeurs-mesures", title: "Grandeurs et mesures", order: 4 },
    { id: "distances-symetries", title: "Distances et symétries", order: 5 },
    { id: "angles", title: "Angles", order: 6 },
    { id: "configurations-geometriques", title: "Configurations géométriques", order: 7 },
    { id: "organisation-gestion-donnees", title: "Organisation et gestion de données", order: 8 },
    { id: "proportionnalite", title: "Proportionnalité", order: 9 },
  ],
  // Sommaire officiel du manuel de 5e (chapitres 1 à 11, hors "Algorithmique
  // et tableur" et "C'est logique !" qui ne font pas partie du programme
  // évalué au même titre, ainsi que les corrigés). Les ids "-cinquieme"
  // évitent une collision avec les chapitres 6e de même thème (ex:
  // proportionnalite existe déjà pour la 6e) — voir Niveau.jsx pour la
  // logique de remplacement planned -> réel. order = ordre d'affichage
  // interne (décalé de +1 par rapport au numéro du sommaire pour laisser la
  // place à "Automatismes" en position 1) — voir chaque fichier de chapitre
  // pour son meta.order réel.
  cinquieme: [
    { id: "operations-sur-les-nombres", title: "Opérations sur les nombres", order: 2 },
    { id: "divisibilite-fractions", title: "Divisibilité, fractions", order: 3 },
    { id: "puissances", title: "Puissances d'un nombre, carré et cube", order: 4 },
    { id: "calcul-litteral", title: "Calcul littéral", order: 5 },
    { id: "nombres-relatifs", title: "Nombres relatifs", order: 6 },
    { id: "geometrie-espace", title: "Géométrie dans l'espace", order: 7 },
    { id: "symetrie-centrale-parallelogrammes", title: "Symétrie centrale, parallélogrammes", order: 8 },
    { id: "triangles", title: "Triangles", order: 9 },
    { id: "statistiques-probabilites", title: "Statistiques, probabilités", order: 10 },
    { id: "proportionnalite-cinquieme", title: "Proportionnalité", order: 11 },
    { id: "fonctions", title: "Fonctions", order: 12 },
  ],
  // Sommaire officiel du manuel de 4e (chapitres 1 à 14, hors corrigés).
  // Les ids "-quatrieme" évitent toute collision avec des chapitres 5e/6e de
  // même thème. order = décalé de +1 par rapport au numéro du sommaire pour
  // laisser la place à "Automatismes" en position 1 (voir chaque fichier de
  // chapitre pour son meta.order réel). "Exercices de fin d'année" (issu du
  // fichier "Exercices transversaux" du manuel) est ajouté à la toute fin,
  // hors numérotation officielle.
  quatrieme: [
    { id: "nombres-relatifs-quatrieme", title: "Nombres relatifs", order: 2 },
    { id: "addition-soustraction-rationnels", title: "Addition et soustraction de nombres rationnels", order: 3 },
    { id: "multiplication-division-rationnels", title: "Multiplication et division de nombres rationnels", order: 4 },
    { id: "puissances-quatrieme", title: "Puissances", order: 5 },
    { id: "calcul-litteral-quatrieme", title: "Calcul littéral", order: 6 },
    { id: "resolution-equations", title: "Résolution d'équations", order: 7 },
    { id: "statistiques-quatrieme", title: "Statistiques", order: 8 },
    { id: "probabilites-quatrieme", title: "Probabilités", order: 9 },
    { id: "notion-fonctions", title: "Notion de fonctions", order: 10 },
    { id: "proportionnalite-quatrieme", title: "Proportionnalité", order: 11 },
    { id: "theoreme-thales", title: "Théorème de Thalès", order: 12 },
    { id: "triangles-rectangles-quatrieme", title: "Propriétés des triangles rectangles", order: 13 },
    { id: "geometrie-plane", title: "Géométrie plane", order: 14 },
    { id: "geometrie-espace-quatrieme", title: "Géométrie dans l'espace", order: 15 },
    { id: "exercices-fin-annee-quatrieme", title: "Exercices de fin d'année", order: 16 },
  ],
  // Sommaire officiel du manuel de 3e (chapitres 1 à 14, hors corrigés), plus
  // le "Dossier Brevet" (chapitre 15 du manuel), conservé tel quel car les
  // élèves de 3e passent réellement le Brevet. Les ids "-troisieme" évitent
  // toute collision avec des chapitres d'autres niveaux. order = décalé de +1
  // par rapport au numéro du sommaire pour laisser la place à "Automatismes"
  // en position 1 (voir chaque fichier de chapitre pour son meta.order réel).
  troisieme: [
    { id: "nombres-entiers-troisieme", title: "Nombres entiers", order: 2 },
    { id: "calcul-numerique-troisieme", title: "Calcul numérique", order: 3 },
    { id: "calcul-litteral-troisieme", title: "Calcul littéral", order: 4 },
    { id: "equations-troisieme", title: "Équations", order: 5 },
    { id: "notion-fonction-troisieme", title: "Notion de fonction", order: 6 },
    { id: "fonctions-affines-troisieme", title: "Fonctions affines", order: 7 },
    { id: "proportionnalite-troisieme", title: "Situations de proportionnalité", order: 8 },
    { id: "statistiques-troisieme", title: "Statistiques", order: 9 },
    { id: "probabilites-troisieme", title: "Probabilités", order: 10 },
    { id: "thales-triangles-semblables-troisieme", title: "Théorème de Thalès et triangles semblables", order: 11 },
    { id: "trigonometrie-triangle-rectangle-troisieme", title: "Trigonométrie dans le triangle rectangle", order: 12 },
    { id: "transformations-plan-troisieme", title: "Transformations dans le plan et leurs effets", order: 13 },
    { id: "geometrie-espace-troisieme", title: "Géométrie dans l'espace", order: 14 },
    { id: "mesures-grandeurs-troisieme", title: "Mesures et grandeurs", order: 15 },
    { id: "dossier-brevet-troisieme", title: "Préparation au Brevet", order: 16 },
  ],
  // Sommaire officiel du manuel de 2nde (chapitres 0 à 11, hors corrigés et
  // hors "Cahier d'algorithmique et de programmation" qui n'a pas de
  // corrigé PDF disponible). Les ids "-seconde" évitent toute collision avec
  // des chapitres d'autres niveaux. order = décalé de +2 par rapport au
  // numéro du sommaire (qui commence à 0) pour laisser la place à
  // "Automatismes" en position 1 (voir chaque fichier de chapitre pour son
  // meta.order réel). "Exercices de fin d'année" (issu du fichier
  // "Exercices transversaux" du manuel) est ajouté à la toute fin, hors
  // numérotation officielle.
  seconde: [
    { id: "nombres-calculs-seconde", title: "Nombres et calculs", order: 2 },
    { id: "generalites-fonctions-seconde", title: "Généralités sur les fonctions", order: 3 },
    { id: "variations-fonctions-seconde", title: "Variations de fonctions", order: 4 },
    { id: "fonctions-affines-seconde", title: "Fonctions affines", order: 5 },
    { id: "fonctions-reference-seconde", title: "Fonctions de référence", order: 6 },
    { id: "reperage-configurations-seconde", title: "Repérage et configurations dans le plan", order: 7 },
    { id: "vecteurs-seconde", title: "Notion de vecteur", order: 8 },
    { id: "colinearite-vecteurs-seconde", title: "Colinéarité de vecteurs", order: 9 },
    { id: "equations-droites-seconde", title: "Équations de droites", order: 10 },
    { id: "informations-chiffrees-seconde", title: "Informations chiffrées", order: 11 },
    { id: "statistiques-descriptives-seconde", title: "Statistiques descriptives", order: 12 },
    { id: "probabilites-echantillonnage-seconde", title: "Probabilités et échantillonnage", order: 13 },
    { id: "exercices-fin-annee-seconde", title: "Exercices de fin d'année", order: 14 },
  ],
  // Sommaire officiel du manuel de Première (enseignement mathématique,
  // tronc commun / non spé), source "da-enseignement-mathematique-1ere-2022"
  // (chapitres 1 à 6, hors corrigés), plus les "Exercices rituels" du manuel
  // regroupés en fin de niveau. Les ids "-premiere-non-spe" évitent toute
  // collision avec les chapitres de Première Spécialité (à venir). order =
  // décalé de +2 par rapport au numéro du sommaire pour laisser la place à
  // "Automatismes" en position 1 (voir chaque fichier de chapitre pour son
  // meta.order réel).
  "premiere-non-spe": [
    { id: "analyse-information-chiffree-premiere-non-spe", title: "Analyse de l'information chiffrée", order: 2 },
    { id: "statistique-probabilites-premiere-non-spe", title: "De la statistique aux probabilités", order: 3 },
    { id: "croissance-lineaire-premiere-non-spe", title: "Croissance linéaire", order: 4 },
    { id: "croissance-exponentielle-premiere-non-spe", title: "Croissance exponentielle", order: 5 },
    { id: "variations-instantanees-premiere-non-spe", title: "Variations instantanées", order: 6 },
    { id: "variations-globales-premiere-non-spe", title: "Variations globales", order: 7 },
    { id: "exercices-rituels-premiere-non-spe", title: "Exercices rituels", order: 8 },
  ],
  // Sommaire officiel du manuel de Terminale (enseignement de spécialité
  // mathématiques), source "mathematiques-terminale-2020" (chapitres 1 à 14,
  // hors corrigés), plus les "Exercices transversaux" du manuel regroupés en
  // fin de niveau. Les ids "-terminale-spe" évitent toute collision avec les
  // chapitres d'autres niveaux. order = décalé de +2 par rapport au numéro
  // du sommaire pour laisser la place à "Automatismes" en position 1 (voir
  // chaque fichier de chapitre pour son meta.order réel).
  "terminale-spe": [
    { id: "combinatoire-denombrement-terminale-spe", title: "Combinatoire et dénombrement", order: 2 },
    { id: "vecteurs-droites-plans-espace-terminale-spe", title: "Vecteurs, droites et plans de l'espace", order: 3 },
    { id: "orthogonalite-distances-espace-terminale-spe", title: "Orthogonalité et distances dans l'espace", order: 4 },
    { id: "suites-terminale-spe", title: "Suites", order: 5 },
    { id: "limites-fonctions-terminale-spe", title: "Limites de fonctions", order: 6 },
    { id: "continuite-terminale-spe", title: "Continuité", order: 7 },
    { id: "complements-derivation-terminale-spe", title: "Compléments sur la dérivation", order: 8 },
    { id: "logarithme-neperien-terminale-spe", title: "Logarithme népérien", order: 9 },
    { id: "fonctions-trigonometriques-terminale-spe", title: "Fonctions trigonométriques", order: 10 },
    { id: "primitives-equations-differentielles-terminale-spe", title: "Primitives, équations différentielles", order: 11 },
    { id: "calcul-integral-terminale-spe", title: "Calcul intégral", order: 12 },
    { id: "loi-binomiale-terminale-spe", title: "Loi binomiale", order: 13 },
    { id: "sommes-variables-aleatoires-terminale-spe", title: "Sommes de variables aléatoires", order: 14 },
    { id: "loi-grands-nombres-terminale-spe", title: "Loi des grands nombres", order: 15 },
    { id: "exercices-transversaux-terminale-spe", title: "Exercices transversaux", order: 16 },
  ],
};

export function getPlannedChapters(levelId) {
  return PLANNED_CHAPTERS[levelId] ?? [];
}
