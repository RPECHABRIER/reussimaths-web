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
};

export function getPlannedChapters(levelId) {
  return PLANNED_CHAPTERS[levelId] ?? [];
}
