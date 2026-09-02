const HAS_DELIMITER = /\\\(|\\\[/;
const HAS_RAW_LATEX = /\\[a-zA-Z]+|[\^_]\{/;
const PLAIN_FRACTION = /(^|[^\d/])([−-]?\d+(?:[.,]\d+)?)\s*\/\s*([−-]?\d+(?:[.,]\d+)?)(?!\s*\/\s*\d)(?=$|[^\d/])/g;

function latexNumber(value) {
  return value.replace("−", "-").replace(",", "{,}");
}

function replaceFractions(text, inMath) {
  return text.replace(PLAIN_FRACTION, (_, prefix, numerator, denominator) => {
    const fraction = `\\dfrac{${latexNumber(numerator)}}{${latexNumber(denominator)}}`;
    return `${prefix}${inMath ? fraction : `\\(${fraction}\\)`}`;
  });
}

function stackFractionsInDelimitedText(text) {
  const delimiterPattern = /(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g;
  return text
    .split(delimiterPattern)
    .map((part) => {
      const inMath = /^(\\\(|\\\[)/.test(part);
      if (!inMath) return replaceFractions(part, false);
      const opening = part.slice(0, 2);
      const closing = part.slice(-2);
      return `${opening}${replaceFractions(part.slice(2, -2), true)}${closing}`;
    })
    .join("");
}

export function withAutoMathFormatting(text) {
  if (typeof text !== "string") return text;
  if (HAS_DELIMITER.test(text)) return stackFractionsInDelimitedText(text);
  if (HAS_RAW_LATEX.test(text)) return `\\(${replaceFractions(text, true)}\\)`;
  return replaceFractions(text, false);
}
