import { useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { getDiagnosticShowcaseExercises } from "../discoveryShowcases";
import { getParcours } from "../parcours";
import { getChapter } from "../chapters/registry";
import ChapterRunner from "../components/ChapterRunner";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { useReferralBonus } from "../hooks/useReferralBonus";
import { useParcoursProgress } from "../hooks/useParcoursProgress";
import { canAccessChapter, getEffectiveSubscription } from "../lib/access";
import { colors, fonts } from "../theme";
import LoadError from "../components/LoadError";
import { getDiscoveryShowcase } from "../discoveryShowcases";
import PaywallAnalytics from "../components/PaywallAnalytics";

// Une étape de parcours (/parcours/:parcoursId/etape/:stepIndex) : le chapitre
// de cette étape, joué en série notée de `parcours.sessionLength` questions à
// la difficulté du parcours (ChapterRunner en "mode session", voir
// src/components/ChapterRunner.jsx). À la fin de la série, la progression est
// enregistrée (useParcoursProgress) et l'élève est renvoyé vers l'étape
// suivante — sauf pour le parcours "Découverte", qui n'a pas de restriction
// d'abonnement même sur des chapitres normalement payants (voir parcours.free).
export default function ParcoursStep() {
  const { parcoursId, stepIndex } = useParams();
  const idx = Number(stepIndex);
  const parcours = getParcours(parcoursId);
  const { user } = useAuth();
  const {
    subscription: rawSubscription,
    loading: subLoading,
    error: subscriptionError,
    reload: reloadSubscription,
  } = useSubscription(user?.id);
  const subscription = getEffectiveSubscription(user, rawSubscription);
  const { chapterId: referralBonusChapterId } = useReferralBonus(user?.id);
  const { recordStep } = useParcoursProgress(user?.id, parcoursId);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trialRun] = useState(() => {
    if (parcours?.kind !== "trial") return 0;
    try { return Number(localStorage.getItem(`reussimaths_trial_runs_${parcours.levelId}`) ?? 0); }
    catch { return 0; }
  });

  if (!parcours || !parcours.steps[idx]) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center" style={{ background: colors.bg }}>
        <p style={{ color: colors.slate }}>Étape introuvable.</p>
        <Link to="/" className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Retour à l'accueil
        </Link>
      </div>
    );
  }

  const step = parcours.steps[idx];
  let chapter = parcours.kind === "trial" ? getDiscoveryShowcase(parcours.levelId) : getChapter(step.chapterId);
  let trialSource = null;
  if (parcours.kind === "trial") {
    try {
      const queryChapterId = searchParams.get("chapter");
      const storedSource = sessionStorage.getItem(`reussimaths_trial_source_${parcours.levelId}`);
      const requestedId = queryChapterId ?? ((trialRun > 0 || storedSource === "diagnostic") ? sessionStorage.getItem(`reussimaths_trial_chapter_${parcours.levelId}`) : null);
      const requestedChapter = getChapter(requestedId);
      const requestedSource = searchParams.get("trial_source") ?? storedSource;
      if (["homepage_direct", "diagnostic", "seo_course"].includes(requestedSource)) trialSource = requestedSource;
      const diagnosticTarget = requestedSource === "diagnostic" && getDiagnosticShowcaseExercises(parcours.levelId)
        .some((question) => question.diagnostic.remediationChapterId === requestedId);
      if (requestedChapter?.meta.level === parcours.levelId || (requestedChapter && diagnosticTarget)) chapter = requestedChapter;
    } catch { /* stockage indisponible : la série vitrine reste utilisable */ }
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
        <p style={{ color: colors.slate }}>Chapitre introuvable.</p>
      </div>
    );
  }

  const freemium = !!chapter.meta.freemiumDaily;
  const locked = !parcours.free && !canAccessChapter(chapter, { user, subscription, referralBonusChapterId });

  if (subLoading && !parcours.free && !chapter.meta.free && !freemium) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg, color: colors.slate }}>
        Chargement…
      </div>
    );
  }


  if (subscriptionError && !parcours.free && !chapter.meta.free && !freemium) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: colors.bg }}>
        <LoadError message="Impossible de vérifier ton accès à ce parcours." onRetry={reloadSubscription} />
      </div>
    );
  }

  if (locked) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center"
        style={{ background: colors.bg, fontFamily: fonts.body }}
      >
        <PaywallAnalytics chapterId={chapter.meta.id} levelId={chapter.meta.level} offerContext="locked_parcours_step" />
        <p style={{ fontFamily: fonts.display, fontSize: "1.3rem", fontWeight: 800, color: colors.ink, letterSpacing: "-0.01em" }}>
          Cette étape est sous abonnement
        </p>
        <p className="text-sm" style={{ color: colors.slate }}>
          {chapter.meta.unlockHint ?? "Abonne-toi pour continuer ce parcours."}
        </p>
        <Link
          to="/compte"
          className="py-2.5 px-6 rounded-full text-sm font-semibold"
          style={{ backgroundColor: colors.ink, color: colors.bg }}
        >
          Voir les offres
        </Link>
        <Link to={`/parcours/${parcours.id}`} className="text-sm font-medium" style={{ color: colors.slate }}>
          ← Retour au parcours
        </Link>
      </div>
    );
  }

  const nextIndex = idx + 1;
  const hasNext = nextIndex < parcours.steps.length;

  return (
    <ChapterRunner
      chapter={chapter}
      difficulty={parcours.difficulty}
      sessionLength={parcours.sessionLength}
      backTo={`/parcours/${parcours.id}`}
      trialSource={trialSource}
      onSessionComplete={async ({ correct, total }) => {
        if (parcours.kind === "trial") {
          try { localStorage.setItem(`reussimaths_trial_runs_${parcours.levelId}`, String(trialRun + 1)); }
          catch { /* stockage indisponible */ }
        }
        await recordStep(step.progressIndex, { correct, total });
        navigate(hasNext ? `/parcours/${parcours.id}/etape/${nextIndex}` : `/parcours/${parcours.id}`);
      }}
    />
  );
}
