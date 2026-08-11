export function getCalculationMode(exercise) {
  if (exercise?.calculationMode === "mental" || exercise?.calculationMode === "calculator") return exercise.calculationMode;
  const text=`${exercise?.chapter ?? ""} ${exercise?.prompt ?? ""}`.trim();
  if (/sans calculatrice|calcul mental/i.test(text)) return "mental";
  if (/calculatrice|arrondi|au centième|au dixième|valeur approchée|cos\s*\(|sin\s*\(|tan\s*\(|log\s*\(/i.test(text)) return "calculator";
  if (/automatismes/i.test(text)) return "mental";
  if (exercise?.type === "qcm" && !/[+×÷=]\s*\?|calcule/i.test(text)) return "mental";
  // Une opération entière, courte et isolée est un automatisme. Les calculs
  // composés et décimaux restent soumis à une décision explicite.
  if (/^\s*(?:calcule\s*:\s*)?[−-]?\d{1,3}\s*[+−×÷-]\s*[−-]?\d{1,3}\s*(?:=\s*\?)?[.\s]*$/i.test(exercise?.prompt ?? "")) return "mental";
  if (/\b(?:10|25|50)\s*%\s+de\s+\d+\b/i.test(text)) return "mental";
  return "calculator";
}
