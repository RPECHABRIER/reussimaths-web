import { colors, fonts, shadow } from "../theme";

// ---------------------------------------------------------------------------
// Petit clavier numérique tactile réutilisable — pour les jeux où l'on
// demande d'écrire un nombre plutôt que de choisir en QCM (voir
// CourseAdditionsCpCe1.jsx : réponse tapée plutôt qu'un QCM, jugé plus
// adapté aux CP/CE1 pour vraiment travailler le calcul). Volontairement un
// clavier maison plutôt que le clavier natif du téléphone/tablette : plus
// gros, plus fiable (pas de correction automatique ni de bascule
// alphabétique), et cohérent visuellement avec le reste de l'appli.
//
// Props :
//   value      : string — chiffres déjà saisis (affichés par le parent)
//   maxLength  : nombre max de chiffres acceptés (par défaut 2)
//   disabled   : désactive tout le clavier (pendant l'animation de feedback)
//   onDigit(d) : appelé avec le chiffre ("0".."9") tapé
//   onBackspace()
//   onSubmit()
// ---------------------------------------------------------------------------
export default function NumberPad({ value, maxLength = 2, disabled, onDigit, onBackspace, onSubmit }) {
  const ink = colors.ink;
  const gold = colors.gold;
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"];

  return (
    <div className="grid grid-cols-3 gap-2.5 w-full max-w-[300px] mx-auto">
      {keys.map((key) => {
        const isBackspace = key === "⌫";
        const isSubmit = key === "✓";
        const isDigit = !isBackspace && !isSubmit;
        const keyDisabled = disabled || (isDigit && value.length >= maxLength) || (isSubmit && value.length === 0);

        return (
          <button
            key={key}
            disabled={keyDisabled}
            onClick={() => {
              if (isBackspace) onBackspace();
              else if (isSubmit) onSubmit();
              else onDigit(key);
            }}
            className="text-2xl font-bold rounded-2xl py-4"
            style={{
              fontFamily: fonts.mono,
              backgroundColor: isSubmit ? gold : colors.card,
              color: isSubmit ? ink : ink,
              boxShadow: isSubmit ? "none" : shadow.soft,
              opacity: keyDisabled ? 0.4 : 1,
            }}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
