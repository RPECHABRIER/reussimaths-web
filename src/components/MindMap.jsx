import MathText from "./MathText";
import Figure from "./Figure";
import { colors, fonts, shadow } from "../theme";

// ---------------------------------------------------------------------------
// Carte mentale d'un chapitre — voir le nouvel onglet "Cours" dans
// ChapterRunner.jsx (CoursPanel.jsx assemble ce composant avec les vidéos
// éventuelles). Volontairement PAS un vrai diagramme radial en SVG : sur
// mobile, un diagramme radial devient illisible sans zoomer/déplacer la vue,
// ce qui va à l'encontre de la clarté recherchée. On garde l'esprit "carte
// mentale" (un thème central, des branches) avec une mise en page qui reste
// lisible à toutes les tailles d'écran : une pastille centrale (le titre du
// chapitre), puis des cartes de branche en grille responsive (`auto-fit`) —
// une seule colonne sur téléphone, plusieurs sur tablette/desktop.
//
// Forme des données (voir meta.cours.mindMap dans src/chapters/*.js) :
//   {
//     title: "Nombres décimaux",                 // nœud central
//     branches: [
//       {
//         title: "Écriture décimale",             // titre de la branche
//         items: ["Point clé 1", "Point clé 2"],  // texte libre, LaTeX \( \) accepté (MathText)
//         formula: "\\(12,45 = 12 + \\dfrac{4}{10} + \\dfrac{5}{100}\\)", // optionnel, mis en avant
//         figure: { points: [...], segments: [...], ... },              // optionnel,
//                  // même format que le champ `figure` d'un exercice (voir
//                  // Figure.jsx) — pour les chapitres de géométrie, une
//                  // branche qui introduit un objet (médiatrice, angle,
//                  // symétrie...) gagne presque toujours à être illustrée.
//       },
//       ...
//     ],
//   }
//
// Chaque chaîne de texte passe par MathText, donc les formules LaTeX au fil
// du texte (délimiteurs \( \)) sont automatiquement rendues.
// ---------------------------------------------------------------------------

// Palette limitée aux couleurs déjà définies dans le thème (cohérence
// visuelle avec le reste de l'appli) — on tourne dessus pour distinguer les
// branches sans introduire de nouvelles couleurs.
const BRANCH_COLORS = [colors.gold, colors.green, colors.red, colors.slate];

export default function MindMap({ mindMap }) {
  if (!mindMap) return null;

  return (
    <div>
      <div className="flex justify-center mb-5">
        <span
          className="inline-block rounded-2xl px-5 py-3 text-center font-extrabold"
          style={{ backgroundColor: colors.ink, color: colors.bg, fontFamily: fonts.display, fontSize: "1.1rem" }}
        >
          <MathText text={mindMap.title} />
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 14,
        }}
      >
        {mindMap.branches.map((branch, i) => {
          const color = BRANCH_COLORS[i % BRANCH_COLORS.length];
          return (
            <div
              key={i}
              className="rounded-3xl p-4"
              style={{
                backgroundColor: colors.card,
                boxShadow: shadow.soft,
                borderTop: `3px solid ${color}`,
              }}
            >
              <p className="font-bold mb-2" style={{ color, fontFamily: fonts.display, fontSize: "0.95rem" }}>
                <MathText text={branch.title} />
              </p>
              {branch.figure && <Figure spec={branch.figure} />}
              <ul className="flex flex-col gap-1.5">
                {branch.items.map((item, j) => (
                  <li key={j} className="text-sm leading-snug flex gap-1.5" style={{ color: colors.ink }}>
                    <span style={{ color, flexShrink: 0 }}>•</span>
                    <MathText text={item} />
                  </li>
                ))}
              </ul>
              {branch.formula && (
                <div
                  className="mt-3 rounded-xl px-3 py-2 text-center text-sm"
                  style={{ backgroundColor: `${color}14`, color: colors.ink, maxWidth: "100%", overflowX: "auto" }}
                >
                  <MathText text={branch.formula} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
