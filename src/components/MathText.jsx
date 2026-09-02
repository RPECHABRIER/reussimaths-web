import { useEffect, useRef } from "react";
import renderMathInElement from "katex/dist/contrib/auto-render.js";
import { withAutoMathFormatting } from "../lib/mathFormatting";

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
//
// Les quotients numériques écrits sous la forme 3/4 sont eux aussi convertis
// à l'affichage en \dfrac{3}{4}. Les valeurs attendues restent inchangées :
// l'élève peut toujours saisir 3/4, seule la présentation est normalisée.
// ---------------------------------------------------------------------------
export default function MathText({ text, as: Tag = "span", className, style }) {
  const ref = useRef(null);
  const displayText = withAutoMathFormatting(text);
  const containsShortVector = typeof text === "string" && /\\overrightarrow\{[A-Za-z]{1,3}\}/.test(text);

  useEffect(() => {
    if (ref.current) {
      renderMathInElement(ref.current, { throwOnError: false });
    }
  }, [displayText]);

  return (
    <Tag ref={ref} className={[className, containsShortVector ? "math-text-short-vector" : ""].filter(Boolean).join(" ")} style={style}>
      {displayText}
    </Tag>
  );
}
