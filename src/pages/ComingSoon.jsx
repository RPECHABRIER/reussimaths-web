import { Link } from "react-router-dom";
import { ArrowUp, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useLevelVotes } from "../hooks/useLevelVotes";
import { colors, fonts, shadow } from "../theme";

export default function ComingSoon({ level }) {
  const { user } = useAuth();
  const { count, hasVoted, vote, loading } = useLevelVotes(level.id, user?.id);

  return (
    <div
      className="min-h-screen w-full p-4 sm:p-8 flex items-center justify-center"
      style={{ background: colors.bg, fontFamily: fonts.body }}
    >
      <div className="max-w-xs w-full text-center">
        <Link to="/" className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Changer de niveau
        </Link>
        <div className="rounded-3xl p-7 mt-6" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
          <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {level.label}
          </p>
          <p className="text-sm mt-2 mb-5" style={{ color: colors.slate }}>
            Bientôt disponible ! Ce niveau n'a pas encore de contenu — vote pour nous aider à savoir quels niveaux
            préparer en priorité.
          </p>
          <button
            onClick={vote}
            disabled={hasVoted || loading}
            className="w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            style={{
              backgroundColor: hasVoted ? `${colors.green}18` : colors.ink,
              color: hasVoted ? colors.green : colors.card,
            }}
          >
            {hasVoted ? <Check size={16} /> : <ArrowUp size={16} />}
            {hasVoted ? "Merci pour ton vote !" : "Je veux ce niveau en priorité"}
          </button>
          <p className="text-xs mt-3" style={{ color: colors.slate }}>
            {count} vote{count > 1 ? "s" : ""} pour ce niveau
          </p>
        </div>
      </div>
    </div>
  );
}
