import { useEffect, useRef } from "react";
import renderMathInElement from "katex/dist/contrib/auto-render.js";

// ---------------------------------------------------------------------------
// Rend un texte contenant des passages LaTeX en jolie notation mathématique.
// Convention utilisée partout dans les chapitres : \( ... \) pour du LaTeX en
// ligne, \[ ... \] pour du LaTeX en bloc (rarement utile ici). Le reste du
// texte (français normal) n'est pas touché.
//
// Exemple : <MathText text="Résoudre \(x^2 - 4 = 0\)." />
// ---------------------------------------------------------------------------
export default function MathText({ text, as: Tag = "span", className, style }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      renderMathInElement(ref.current, { throwOnError: false });
    }
  }, [text]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {text}
    </Tag>
  );
}
