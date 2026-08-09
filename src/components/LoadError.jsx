import { RotateCcw } from "lucide-react";
import { colors, fonts, shadow } from "../theme";

export default function LoadError({ message = "Impossible de charger ces informations pour le moment.", onRetry }) {
  return (
    <div
      role="alert"
      className="w-full max-w-sm mx-auto text-center rounded-3xl p-6"
      style={{ backgroundColor: colors.card, boxShadow: shadow.soft, fontFamily: fonts.body }}
    >
      <p className="text-sm" style={{ color: colors.ink }}>{message}</p>
      <p className="text-xs mt-1" style={{ color: colors.slate }}>Vérifie ta connexion, puis réessaie.</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 mt-4 py-2.5 px-5 rounded-full text-sm font-semibold"
          style={{ backgroundColor: colors.ink, color: colors.bg }}
        >
          <RotateCcw size={14} /> Réessayer
        </button>
      )}
    </div>
  );
}
