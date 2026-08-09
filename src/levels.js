// ---------------------------------------------------------------------------
// Liste des niveaux proposés par RéussiMaths, du collège à la terminale.
// Un niveau "apparaît" avec du contenu dès qu'au moins un chapitre (voir
// src/chapters/*.js) déclare `meta.level` égal à son `id`. Sans chapitre, le
// niveau s'affiche automatiquement en "Bientôt disponible" avec un vote
// (voir src/pages/ComingSoon.jsx) — rien à faire ici pour ça.
//
// `cycle` ("college" | "lycee") sert à répartir les niveaux entre les deux
// pages de choix de l'accueil (voir src/pages/CycleSelect.jsx et
// src/pages/CycleLevels.jsx) — la sélection à plat (LevelSelect.jsx) reste
// disponible mais n'est plus la page d'accueil.
//
// Pour ajouter un niveau : ajoute une entrée ci-dessous, puis crée un ou
// plusieurs chapitres avec `level: "<id>"` dans leurs métadonnées.
// ---------------------------------------------------------------------------

export const LEVELS = [
  { id: "sixieme", label: "6e", order: 1, cycle: "college" },
  { id: "cinquieme", label: "5e", order: 2, cycle: "college" },
  { id: "quatrieme", label: "4e", order: 3, cycle: "college" },
  { id: "troisieme", label: "3e et Préparation DNB", order: 4, cycle: "college" },
  { id: "seconde", label: "2nde", order: 5, cycle: "lycee" },
  { id: "premiere-spe", label: "Première Spé et Préparation au Bac", order: 6, cycle: "lycee" },
  { id: "premiere-non-spe", label: "Première Non Spé et Préparation au Bac", order: 7, cycle: "lycee" },
  { id: "premiere-techno", label: "Première technologique et Préparation au Bac", order: 8, cycle: "lycee" },
  { id: "terminale-spe", label: "Terminale Spé et Préparation au Bac", order: 9, cycle: "lycee" },
  { id: "terminale-techno", label: "Terminale technologique", order: 10, cycle: "lycee" },
];

export const CYCLES = [
  { id: "college", label: "Collège", description: "De la 6e à la 3e, jusqu'au Brevet." },
  { id: "lycee", label: "Lycée", description: "De la 2nde à la Terminale, jusqu'au Bac." },
];

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id);
}

export function getLevelsByCycle(cycleId) {
  return LEVELS.filter((l) => l.cycle === cycleId).sort((a, b) => a.order - b.order);
}
