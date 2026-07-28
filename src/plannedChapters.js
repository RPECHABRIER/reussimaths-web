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
};

export function getPlannedChapters(levelId) {
  return PLANNED_CHAPTERS[levelId] ?? [];
}
