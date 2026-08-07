// ---------------------------------------------------------------------------
// Outil partagé pour afficher un vrai tableau dans un prompt/step d'exercice
// (ex. tableau de proportionnalité), à la place du bricolage historique qui
// consistait à juxtaposer plusieurs blocs \( ... \) séparés par un "\\\\"
// flottant dans du texte brut. Ce bricolage ne produisait AUCUN retour à la
// ligne réel : "\\" (double antislash) n'a de sens que DANS un environnement
// LaTeX comme \begin{array}...\end{array} ou \begin{cases}...\end{cases} —
// utilisé hors d'un tel environnement (en plein texte), KaTeX ne le
// reconnaît pas et l'affiche tel quel, ou le tout reste sur une seule ligne
// trop large qui peut déborder du cadre de la carte d'exercice.
//
// texTable() construit un unique bloc LaTeX \[ \begin{array}{...} ... \]
// avec bordures et colonnes alignées, que KaTeX sait nativement rendre en
// vrai tableau, quel que soit le nombre de lignes/colonnes.
//
// Convention : chaque ligne du tableau est un tableau de cellules. La
// PREMIÈRE cellule de chaque ligne est traitée comme un libellé de grandeur
// (rendue en texte via \text{...}, ex. "Masse (en kg)") ; les cellules
// suivantes sont des valeurs numériques ou symboles, rendues telles quelles
// en mode mathématique (ex. 4, "12,5", "?").
//
// ⚠️ Ne JAMAIS mettre le symbole "€" dans une cellule ou un libellé : KaTeX
// n'a pas de métriques de caractère pour "€" (testé et confirmé — voir
// AUTOMATION_LOG.md) et son rendu n'est pas fiable. Écrire "euros" en toutes
// lettres à la place.
//
// Exemple d'utilisation :
//   texTable([
//     ["Masse (en kg)", 4, 20, 2],
//     ["Prix (en euros)", 10, 50, "?"],
//   ])
// -> une chaîne prête à insérer directement dans un prompt (elle contient
//    déjà ses propres délimiteurs \[ \], ne pas la ré-envelopper).
//
// Le résultat est un tableau en mode "display" (bloc, centré, sur ses
// propres lignes) plutôt qu'en ligne — c'est volontaire, un tableau à
// plusieurs colonnes ne doit jamais essayer de tenir dans le flux d'une
// phrase.
// ---------------------------------------------------------------------------

export function texTable(rows) {
  if (!rows || rows.length === 0) return "";
  const nCols = rows[0].length;
  const colSpec = `|l|${"c|".repeat(Math.max(0, nCols - 1))}`;
  const renderedRows = rows.map((row) =>
    row.map((cell, i) => (i === 0 ? `\\text{${cell}}` : `${cell}`)).join(" & ")
  );
  const body = `\\hline ${renderedRows.join(" \\\\ \\hline ")} \\\\ \\hline`;
  return `\\[\\begin{array}{${colSpec}} ${body} \\end{array}\\]`;
}
