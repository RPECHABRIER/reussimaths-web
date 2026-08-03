import { Link, useParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { getParcoursForLevel } from "../parcours";
import { getLevel } from "../levels";
import { useAuth } from "../hooks/useAuth";
import { useParcoursProgress } from "../hooks/useParcoursProgress";
import { colors, fonts, shadow } from "../theme";

// Choix du niveau de difficulté d'un parcours (/parcours/niveau/:levelId) :
// une carte par palier (débutant/avancé/expert), avec le pourcentage déjà
// réalisé si l'élève est connecté. Voir src/parcours.js pour la définition.
export default function ParcoursSelect() {
  const { levelId } = useParams();
  const level = getLevel(levelId);
  const parcoursList = getParcoursForLevel(levelId);
  const { user } = useAuth();

  if (!level || parcoursList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center" style={{ background: colors.bg }}>
        <p style={{ color: colors.slate }}>Pas encore de parcours pour ce niveau.</p>
        <Link to={`/niveau/${levelId}`} className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Retour au niveau
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-md mx-auto">
        <Link to={`/niveau/${levelId}`} className="text-sm font-medium" style={{ color: colors.ink }}>
          ← {level.label}
        </Link>

        <div className="text-center my-7">
          <Sparkles size={22} color={colors.gold} className="mx-auto mb-2" />
          <h1 style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Parcours {level.label}
          </h1>
          <p className="text-sm mt-1.5" style={{ color: colors.slate }}>
            Choisis ton niveau de difficulté, avance chapitre après chapitre.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {parcoursList.map((p) => (
            <TierCard key={p.id} parcours={p} userId={user?.id} />
          ))}
        </div>

        <div className="text-center mt-6">
          <Link to={`/parcours/niveau/${levelId}/diagnostic`} className="text-sm font-medium" style={{ color: colors.slate }}>
            Pas sûr ? Fais le diagnostic (2 min) →
          </Link>
        </div>
      </div>
    </div>
  );
}

function TierCard({ parcours, userId }) {
  const { completedSteps, loading } = useParcoursProgress(userId, parcours.id);
  const total = parcours.steps.length;
  const percent = total > 0 ? Math.round((completedSteps / total) * 100) : 0;

  return (
    <Link to={`/parcours/${parcours.id}`}>
      <div
        className="rounded-3xl px-5 py-4 transition-transform active:scale-[0.98]"
        style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}
      >
        <div className="flex items-center justify-between">
          <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.1rem", fontWeight: 700 }}>
            {parcours.tierLabel}
          </p>
          {userId && !loading && (
            <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: `${colors.green}18`, color: colors.green }}>
              {percent} %
            </span>
          )}
        </div>
        <p className="text-xs mt-1" style={{ color: colors.slate }}>
          {parcours.description} — {total} chapitre{total > 1 ? "s" : ""}
        </p>
        {userId && !loading && total > 0 && (
          <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.ink}0d` }}>
            <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: colors.green }} />
          </div>
        )}
      </div>
    </Link>
  );
}
