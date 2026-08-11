export function getCalculationMode(exercise) {
  if (exercise?.calculationMode === "mental" || exercise?.calculationMode === "calculator") return exercise.calculationMode;
  const text=`${exercise?.chapter ?? ""} ${exercise?.prompt ?? ""}`.trim();
  if (/sans calculatrice|calcul mental/i.test(text)) return "mental";
  if (/calculatrice|calcule[^.?!]*(?:arrondi|valeur approchée)/i.test(text)) return "calculator";
  // Une opération entière, courte et isolée est un automatisme. Les calculs
  // composés et décimaux restent soumis à une décision explicite.
  const simpleIntegerCalculation=(exercise?.prompt??"")
    .replace(/\\(?:left|right)/g, "")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\[()[\]]/g, "")
    .trim();
  if (/^(?:calcule\s*:\s*)?\(?[−-]?\d{1,3}\)?\s*[+−×÷-]\s*\(?[−-]?\d{1,3}\)?\s*(?:=\s*\?)?[.\s]*$/i.test(simpleIntegerCalculation)) return "mental";
  // Dans tous les autres cas, aucune consigne n'est imposée : l'utilisateur
  // choisit librement d'utiliser ou non sa calculatrice.
  return null;
}
