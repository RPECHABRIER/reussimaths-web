export function getCalculationMode(exercise) {
  if (exercise?.calculationMode === "mental" || exercise?.calculationMode === "calculator") return exercise.calculationMode;
  const text=`${exercise?.chapter ?? ""} ${exercise?.prompt ?? ""}`.trim();
  if (/sans calculatrice|calcul mental/i.test(text)) return "mental";
  if (/calculatrice|arrondi|au centième|au dixième|valeur approchée|cos\s*\(|sin\s*\(|tan\s*\(|log\s*\(/i.test(text)) return "calculator";
  if (/automatismes/i.test(text)) return "mental";
  if (exercise?.type === "qcm" && !/[+×÷=]\s*\?|calcule/i.test(text)) return "mental";
  if (/^-?\d+(?:[,.]\d+)?\s*[+−-]\s*-?\d+(?:[,.]\d+)?\s*=\s*\?$/.test(exercise?.prompt ?? "")) return "mental";
  if (/\b(?:10|25|50)\s*%\s+de\s+\d+\b/i.test(text)) return "mental";
  return "calculator";
}
