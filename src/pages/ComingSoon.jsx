import { Link } from "react-router-dom";
import { ArrowUp, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useLevelVotes } from "../hooks/useLevelVotes";

export default function ComingSoon({ level }) {
  const { user } = useAuth();
  const { count, hasVoted, vote, loading } = useLevelVotes(level.id, user?.id);

  return (
    <div
      className="min-h-screen w-full p-4 sm:p-8 flex items-center justify-center"
      style={{ background: "#F7F4EC", fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-xs w-full text-center">
        <Link to="/" className="text-sm underline" style={{ color: "#5C6B7A" }}>
          ← Changer de niveau
        </Link>
        <div className="rounded-2xl p-6 mt-6" style={{ backgroundColor: "#ffffff", border: "1px solid #e4dfd0" }}>
          <p style={{ fontFamily: "Fraunces, serif", color: "#1B2A4A", fontSize: "1.4rem", fontWeight: 600 }}>
            {level.label}
          </p>
          <p className="text-sm mt-2 mb-5" style={{ color: "#5C6B7A" }}>
            Bientôt disponible ! Ce niveau n'a pas encore de contenu — vote pour nous aider à savoir quels niveaux
            préparer en priorité.
          </p>
          <button
            onClick={vote}
            disabled={hasVoted || loading}
            className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2"
            style={{
              backgroundColor: hasVoted ? "#4E8B6B22" : "#1B2A4A",
              color: hasVoted ? "#4E8B6B" : "#F7F4EC",
            }}
          >
            {hasVoted ? <Check size={16} /> : <ArrowUp size={16} />}
            {hasVoted ? "Merci pour ton vote !" : "Je veux ce niveau en priorité"}
          </button>
          <p className="text-xs mt-3" style={{ color: "#5C6B7A" }}>
            {count} vote{count > 1 ? "s" : ""} pour ce niveau
          </p>
        </div>
      </div>
    </div>
  );
}
