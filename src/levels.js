// ---------------------------------------------------------------------------
// Liste des niveaux proposés par Reussimaths, du collège à la terminale.
// Un niveau "apparaît" avec du contenu dès qu'au moins un chapitre (voir
// src/chapters/*.js) déclare `meta.level` égal à son `id`. Sans chapitre, le
// niveau s'affiche automatiquement en "Bientôt disponible" avec un vote
// (voir src/pages/ComingSoon.jsx) — rien à faire ici pour ça.
//
// Pour ajouter un niveau : ajoute une entrée ci-dessous, puis crée un ou
// plusieurs chapitres avec `level: "<id>"` dans leurs métadonnées.
// ---------------------------------------------------------------------------

export const LEVELS = [
  { id: "sixieme", label: "6e", order: 1 },
  { id: "cinquieme", label: "5e", order: 2 },
  { id: "quatrieme", label: "4e", order: 3 },
  { id: "troisieme", label: "3e et Préparation DNB", order: 4 },
  { id: "seconde", label: "2nde", order: 5 },
  { id: "premiere-spe", label: "Première Spé et Préparation au Bac", order: 6 },
  { id: "premiere-non-spe", label: "Première Non Spé et Préparation au Bac", order: 7 },
  { id: "premiere-techno", label: "Première technologique et Préparation au Bac", order: 8 },
  { id: "terminale-spe", label: "Terminale Spé et Préparation au Bac", order: 9 },
  { id: "terminale-techno", label: "Terminale technologique", order: 10 },
];

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id);
}
