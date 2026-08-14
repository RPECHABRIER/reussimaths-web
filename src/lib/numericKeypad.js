export const NUMERIC_KEYPAD_KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "±", "0", ",", "/", "+∞", "−∞", "⌫"];

// Les résultats volumineux (notamment certains volumes en cm³) dépassent
// huit caractères. Cette limite protège l’interface sans empêcher une
// réponse mathématique attendue, y compris avec signe et partie décimale.
export const MAX_NUMERIC_INPUT_LENGTH = 32;

function expandExponentialNotation(value) {
  const raw = String(value);
  if (!/[eE]/.test(raw)) return raw;

  const [coefficient, exponentText] = raw.toLowerCase().split("e");
  const exponent = Number(exponentText);
  const sign = coefficient.startsWith("-") ? "-" : "";
  const unsigned = coefficient.replace(/^[+-]/, "");
  const decimalPosition = unsigned.indexOf(".") === -1 ? unsigned.length : unsigned.indexOf(".");
  const digits = unsigned.replace(".", "");
  const targetPosition = decimalPosition + exponent;

  if (targetPosition <= 0) return `${sign}0.${"0".repeat(-targetPosition)}${digits}`;
  if (targetPosition >= digits.length) return `${sign}${digits}${"0".repeat(targetPosition - digits.length)}`;
  return `${sign}${digits.slice(0, targetPosition)}.${digits.slice(targetPosition)}`;
}

export function canonicalNumericInput(answer) {
  if (answer === Infinity) return "+∞";
  if (answer === -Infinity) return "−∞";
  if (!Number.isFinite(answer)) return null;
  // Élimine les artefacts binaires sans transformer les très petits nombres
  // en notation scientifique, que le pavé élève n'a pas à connaître.
  const stable = Number(answer.toPrecision(12));
  return expandExponentialNotation(stable).replace(".", ",");
}

export function canTypeNumericAnswer(answer) {
  const input = canonicalNumericInput(answer);
  if (!input || input.length > MAX_NUMERIC_INPUT_LENGTH) return false;
  return [...input].every((character) => /[0-9,]/.test(character) || character === "-" || character === "−" || character === "+" || character === "∞");
}
