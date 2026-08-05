import { colors } from "../theme";

// ---------------------------------------------------------------------------
// Petits utilitaires partagés par les jeux de l'onglet Jeux (voir
// src/pages/Jeux.jsx). Extraits de CourseTables.jsx lors de l'ajout du
// deuxième jeu de course (Estimation express) pour éviter de dupliquer la
// logique de classement / affichage du temps dans chaque jeu.
// ---------------------------------------------------------------------------

export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function formatSeconds(ms) {
  return (ms / 1000).toFixed(1).replace(".", ",");
}

// Formatage "à la française" des grands nombres (espace fine comme séparateur
// de milliers), utilisé par Estimation express pour afficher des calculs
// lisibles (ex. "12 480 + 3 917").
export function formatNumber(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Classement générique à 3 seuils (or / argent / bronze), utilisé par tous
// les jeux "course" — chaque jeu définit ses propres seuils en millisecondes.
export function rankFromTime(ms, thresholds) {
  if (ms <= thresholds.gold) return { place: 1, label: "1er — bravo !", color: colors.gold };
  if (ms <= thresholds.silver) return { place: 2, label: "2e — pas mal !", color: colors.slate };
  if (ms <= thresholds.bronze) return { place: 3, label: "3e — presque !", color: "#a3762a" };
  return { place: null, label: "Perdu — retente ta chance !", color: colors.red };
}
