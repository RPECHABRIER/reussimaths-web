import { useEffect, useRef } from "react";
import renderMathInElement from "katex/dist/contrib/auto-render.js";

// ---------------------------------------------------------------------------
// Rend un texte contenant des passages LaTeX en jolie notation mathématique.
// Convention utilisée partout dans les chapitres : \( ... \) pour du LaTeX en
// ligne, \[ ... \] pour du LaTeX en bloc (rarement utile ici). Le reste du
// texte (français normal) n'est pas touché.
//
// Exemple : <MathText text="Résoudre \(x^2 - 4 = 0\)." />
//
// Filet de sécurité : beaucoup de `steps` (aide/correction) générés dans les
// chapitres sont des lignes 100% mathématiques (français inclus, via
// \text{...}) mais oublient l'enrobage \( \) — sans lui, KaTeX ignore
// totalement la chaîne et affiche le code LaTeX brut tel quel. Plutôt que de
// corriger chaque générateur individuellement, on détecte ici une chaîne qui
// contient de la syntaxe LaTeX (\commande, ^{ ou _{) mais aucun délimiteur,
// et on l'enrobe automatiquement de \( \) avant le rendu.
// ---------------------------------------------------------------------------
const HAS_DELIMITER = /\\\(|\\\[/;
const HAS_RAW_LATEX = /\\[a-zA-Z]+|[\^_]\{/;

function withAutoDelimiters(text) {
  if (typeof text !== "string") return text;
  if (HAS_DELIMITER.test(text)) return text;
  if (HAS_RAW_LATEX.test(text)) return `\\(${text}\\)`;
  return text;
}

export default function MathText({ text, as: Tag = "span", className, style }) {
  const ref = useRef(null);
  const displayText = withAutoDelimiters(text);

  useEffect(() => {
    if (ref.current) {
      renderMathInElement(ref.current, { throwOnError: false });
    }
  }, [displayText]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {displayText}
    </Tag>
  );
}
