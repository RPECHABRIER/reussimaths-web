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
      className="space-y-2 rounded-xl p-0 list-none"
      style={{
        color: dark ? "#cdd8ec" : "#5b6472",
        fontFamily: fonts.mono,
        fontSize: "0.9rem",
      }}
    >
      {steps.map((step, i) => {
        const isTagged = step && typeof step === "object" && "text" in step;
        const type = isTagged ? STEP_TYPES[step.type] : null;
        const text = isTagged ? step.text : step;
        return (
          <li
            key={i}
            className="grid grid-cols-[1.65rem_minmax(0,1fr)] gap-2.5 rounded-lg p-2.5 sm:p-3 leading-6"
            style={{ backgroundColor: dark ? "#0d1729" : "#F5F5F7" }}
          >
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-black"
              style={{ color: type?.color ?? (dark ? "#cdd8ec" : "#5b6472"), backgroundColor: type ? `${type.color}22` : dark ? "#263653" : "#E5E7EB" }}
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              {type && (
                <span
                  className="mb-1 block w-fit rounded px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide"
                  style={{ color: type.color, backgroundColor: `${type.color}22` }}
                >
                  {type.label}
                </span>
              )}
              <MathText text={text} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
