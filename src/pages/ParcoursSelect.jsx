import { Link, useParams } from "react-router-dom";
import { ArrowRight, Gauge, Rocket, ShieldCheck, Sparkles, Target } from "lucide-react";
import { getParcoursForLevel } from "../parcours";
import { getLevel } from "../levels";
import { useAuth } from "../hooks/useAuth";
import { useParcoursProgress } from "../hooks/useParcoursProgress";
import { colors, fonts, shadow, cycleColors } from "../theme";

// Choix du niveau de difficulté d'un parcours (/parcours/niveau/:levelId) :
// une carte par palier (débutant/avancé/expert), avec le pourcentage déjà
// réalisé si l'élève est connecté. Voir src/parcours.js pour la définition.
export default function ParcoursSelect() {
  const { levelId } = useParams();
  const level = getLevel(levelId);
  const parcoursList = getParcoursForLevel(levelId);
  const { user } = useAuth();
  const accent = cycleColors[level?.cycle]?.accent ?? colors.gold;

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
      <div className="max-w-5xl mx-auto">
        <Link to={`/niveau/${levelId}`} className="text-sm font-medium" style={{ color: colors.ink }}>
          ← {level.label}
        </Link>

        <div className="text-center my-10 sm:my-14">
          <Sparkles size={25} color={accent} className="mx-auto mb-3" />
          <h1 style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Choisis ton rythme en {level.label}
          </h1>
          <p className="text-sm mt-1.5" style={{ color: colors.slate }}>
            Les trois parcours suivent le même programme. Seul le niveau d’accompagnement et d’exigence change.
          </p>
        </div>

        <Link to={`/parcours/niveau/${levelId}/diagnostic`} className="max-w-2xl mx-auto rounded-3xl p-5 flex items-center gap-4" style={{ display: "flex", backgroundColor: `${accent}10`, border: `1px solid ${accent}35` }}>
          <div className="flex items-center justify-center rounded-2xl shrink-0" style={{ width: 48, height: 48, backgroundColor: colors.card }}><Target size={22} color={accent} /></div>
          <div className="flex-1"><p className="font-black" style={{ color: colors.ink }}>Tu hésites ? Fais le diagnostic</p><p className="text-xs mt-1" style={{ color: colors.slate }}>Quelques questions, sans note, pour recevoir une recommandation.</p></div>
          <ArrowRight size={17} color={accent} />
        </Link>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {parcoursList.map((p, index) => (
            <TierCard key={p.id} parcours={p} userId={user?.id} accent={accent} index={index} />
          ))}
        </div>
        <p className="text-xs text-center mt-6" style={{ color: colors.slate }}>Ton choix n’est jamais définitif : tu peux changer de parcours quand tu veux.</p>
      </div>
    </div>
  );
}

function TierCard({ parcours, userId, accent, index }) {
  const icons = [ShieldCheck, Gauge, Rocket];
  const Icon = icons[index] ?? Gauge;
  const labels = ["Confiance", "Niveau attendu", "Challenge"];
  const { completedSteps, loading } = useParcoursProgress(userId, parcours.id);
  const total = parcours.steps.length;
  const percent = total > 0 ? Math.round((completedSteps / total) * 100) : 0;

  return (
    <Link to={`/parcours/${parcours.id}`}>
      <div
        className="h-full rounded-3xl p-5 transition-transform hover:-translate-y-1 active:scale-[0.98]"
        style={{ backgroundColor: colors.card, boxShadow: index === 1 ? shadow.raised : shadow.soft, borderTop: `3px solid ${index === 1 ? colors.gold : accent}` }}
      >
        <div className="flex items-center justify-center rounded-2xl" style={{ width: 44, height: 44, backgroundColor: `${accent}14` }}><Icon size={21} color={accent} /></div>
        <div className="flex items-center justify-between">
          <p className="mt-4" style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.2rem", fontWeight: 800 }}>
            {parcours.tierLabel}
          </p>
          {userId && !loading && (
            <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: `${colors.green}18`, color: colors.green }}>
              {percent} %
            </span>
          )}
        </div>
        <p className="text-xs uppercase tracking-wide font-bold mt-1" style={{ color: index === 1 ? colors.gold : accent }}>{labels[index]}</p>
        <p className="text-sm mt-3 leading-relaxed" style={{ color: colors.slate }}>
          {parcours.description}
        </p>
        <p className="text-xs mt-4 font-semibold" style={{ color: colors.ink }}>{total} chapitre{total > 1 ? "s" : ""} · séries de 8 questions</p>
        {userId && !loading && total > 0 && (
          <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.ink}0d` }}>
            <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: colors.green }} />
          </div>
        )}
      </div>
    </Link>
  );
}
