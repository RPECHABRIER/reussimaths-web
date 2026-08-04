import MathText from "./MathText";
import { fonts } from "../theme";

// ---------------------------------------------------------------------------
// Rendu partagé des étapes de correction ("steps"), utilisé par ChapterRunner,
// AutomatismesRunner, MiniDuel et le panneau "Méthode" du mode Découverte.
//
// Dual coding (cf. dossier Neurosciences) : chaque étape peut être soit une
// simple chaîne (rétro-compatible avec les ~150 chapitres existants, pas
// encore retouchés), soit un objet { type, text } où `type` appartient à
// STEP_TYPES ci-dessous, pour un code couleur cohérent dans toute l'app
// (donnée / règle / calcul / résultat). Un step non tagué (chaîne simple)
// s'affiche exactement comme avant, sans étiquette de couleur.
// ---------------------------------------------------------------------------
export const STEP_TYPES = {
  donnee: { label: "Donnée", color: "#6b7fb3" },
  regle: { label: "Règle", color: "#a3762a" },
  calcul: { label: "Calcul", color: "#3f7a5c" },
  resultat: { label: "Résultat", color: "#b3452f" },
};

export default function StepsList({ steps, dark }) {
  if (!Array.isArray(steps) || steps.length === 0) return null;
  return (
    <ol
      className="space-y-1.5 text-sm rounded-xl px-4 py-3 list-decimal list-outside ml-4"
      style={{
        backgroundColor: dark ? "#0d1729" : "#F5F5F7",
        color: dark ? "#cdd8ec" : "#5b6472",
        fontFamily: fonts.mono,
        fontSize: "0.85rem",
      }}
    >
      {steps.map((step, i) => {
        const isTagged = step && typeof step === "object" && "text" in step;
        const type = isTagged ? STEP_TYPES[step.type] : null;
        const text = isTagged ? step.text : step;
        return (
          <li key={i} className="leading-relaxed">
            {type && (
              <span
                className="inline-block text-[0.62rem] font-bold uppercase tracking-wide mr-1.5 px-1.5 py-0.5 rounded align-middle"
                style={{ color: type.color, backgroundColor: `${type.color}22` }}
              >
                {type.label}
              </span>
            )}
            <MathText text={text} />
          </li>
        );
      })}
    </ol>
  );
}
