import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, Clock3, Lock, Sparkles, Trophy } from "lucide-react";
import { getParcours } from "../parcours";
import { getChapter } from "../chapters/registry";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { useReferralBonus } from "../hooks/useReferralBonus";
import { useParcoursProgress } from "../hooks/useParcoursProgress";
import { canAccessChapter, getEffectiveSubscription } from "../lib/access";
import { colors, fonts, shadow } from "../theme";

// Détail d'un parcours (/parcours/:parcoursId) : la liste de ses étapes avec
// leur statut (terminée / suivante / à venir), le pourcentage global, et un
// bouton "Continuer" qui pointe directement sur la prochaine étape non
// terminée. Chaque étape = un chapitre joué en série notée (voir
// src/pages/ParcoursStep.jsx et src/components/ChapterRunner.jsx, mode
// session).
export default function ParcoursOverview() {
  const { parcoursId } = useParams();
  const parcours = getParcours(parcoursId);
  const { user } = useAuth();
  const { subscription: rawSubscription } = useSubscription(user?.id);
  const subscription = getEffectiveSubscription(user, rawSubscription);
  const { chapterId: referralBonusChapterId } = useReferralBonus(user?.id);
  const { stepByIndex, completedSteps, loading } = useParcoursProgress(user?.id, parcoursId);

  if (!parcours) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center" style={{ background: colors.bg }}>
        <p style={{ color: colors.slate }}>Parcours introuvable.</p>
        <Link to="/" className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Retour à l'accueil
        </Link>
      </div>
    );
  }

  const total = parcours.steps.length;
  const percent = total > 0 ? Math.round((completedSteps / total) * 100) : 0;
  const nextIndex = parcours.steps.findIndex((_, i) => !stepByIndex.get(i)?.completed);
  const nextStepIndex = nextIndex === -1 ? 0 : nextIndex;
  const finished = completedSteps >= total && total > 0;
  const backTo = parcours.kind === "decouverte" ? "/" : parcours.kind === "trial" ? "/niveaux?objectif=essai" : `/parcours/niveau/${parcours.levelId}`;
  const nextStep = parcours.steps[nextStepIndex];
  const nextChapter = nextStep ? getChapter(nextStep.chapterId) : null;
  const nextLocked = !parcours.free && nextChapter && !canAccessChapter(nextChapter, { user, subscription, referralBonusChapterId });
  const primaryTo = nextLocked ? "/compte" : `/parcours/${parcours.id}/etape/${finished ? 0 : nextStepIndex}`;

  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-md mx-auto">
        <Link to={backTo} className="text-sm font-medium" style={{ color: colors.ink }}>
          ← {parcours.kind === "decouverte" ? "Accueil" : parcours.kind === "trial" ? "Changer de niveau" : "Changer de palier"}
        </Link>

        <div className="text-center my-7">
          {finished ? <Trophy size={22} color={colors.gold} className="mx-auto mb-2" /> : <Sparkles size={22} color={colors.gold} className="mx-auto mb-2" />}
          <h1 style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {parcours.title}
          </h1>
          <p className="text-sm mt-1.5" style={{ color: colors.slate }}>
            {parcours.description}
          </p>
        </div>

        {user && !loading && total > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold" style={{ color: colors.slate }}>
                Progression
              </p>
              <p className="text-xs font-semibold" style={{ color: colors.green }}>
                {percent} %
              </p>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.ink}0d` }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: colors.green }} />
            </div>
          </div>
        )}

        {total > 0 && !finished && (
          <div className="rounded-3xl p-5 mb-6" style={{ backgroundColor: colors.card, boxShadow: shadow.raised, borderTop: `3px solid ${colors.gold}` }}>
            <p className="text-[11px] uppercase tracking-widest font-bold" style={{ color: colors.gold }}>Ta prochaine étape</p>
            <p className="mt-2" style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.15rem", fontWeight: 800 }}>{nextStep?.title}</p>
            <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: colors.slate }}>
              <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> Environ {Math.max(4, Math.round(parcours.sessionLength * 0.75))} min</span>
              <span>{parcours.sessionLength} questions</span>
            </div>
            <Link to={primaryTo} className="mt-4 w-full py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2" style={{ backgroundColor: colors.ink, color: colors.bg }}>
              {nextLocked ? "Débloquer le parcours" : completedSteps > 0 ? "Reprendre maintenant" : "Faire ma première série"} <ArrowRight size={15} />
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {parcours.steps.map((step, i) => {
            const chapter = getChapter(step.chapterId);
            const locked = !parcours.free && chapter && !canAccessChapter(chapter, { user, subscription, referralBonusChapterId });
            const done = !!stepByIndex.get(i)?.completed;
            const isNext = i === nextStepIndex && !done;

            const row = (
              <div
                className="rounded-2xl px-4 py-3 flex items-center gap-3 transition-transform active:scale-[0.98]"
                style={{
                  backgroundColor: colors.card,
                  boxShadow: isNext ? shadow.raised : shadow.soft,
                  opacity: locked ? 0.6 : 1,
                  border: isNext ? `1.5px solid ${colors.ink}` : "1.5px solid transparent",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: done ? `${colors.green}18` : `${colors.ink}0d`,
                  }}
                >
                  {done ? <Check size={15} color={colors.green} /> : <span className="text-xs font-bold" style={{ color: colors.slate }}>{i + 1}</span>}
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "0.95rem", fontWeight: 700 }}>
                    {step.title}
                  </p>
                  {step.levelLabel && (
                    <p className="text-xs mt-0.5" style={{ color: colors.slate }}>
                      {step.levelLabel}
                    </p>
                  )}
                </div>
                {locked && <Lock size={16} color={colors.slate} />}
              </div>
            );

            return locked ? (
              <div key={step.chapterId}>{row}</div>
            ) : (
              <Link key={step.chapterId} to={`/parcours/${parcours.id}/etape/${i}`}>
                {row}
              </Link>
            );
          })}
        </div>

        {total > 0 && (
          <div className="text-center mt-8">
            <Link
              to={primaryTo}
              className="inline-block py-2.5 px-7 rounded-full text-sm font-semibold"
              style={{ backgroundColor: colors.ink, color: colors.bg }}
            >
              {finished ? "Recommencer" : nextLocked ? "Voir les offres" : completedSteps > 0 ? "Continuer" : "Commencer"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
