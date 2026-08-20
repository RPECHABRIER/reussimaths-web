import { useParams, useSearchParams, Link } from "react-router-dom";
import { getChapter } from "../chapters/registry";
import ChapterRunner from "../components/ChapterRunner";
import AutomatismesRunner from "../components/AutomatismesRunner";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { useReferralBonus } from "../hooks/useReferralBonus";
import { canAccessChapter, getEffectiveSubscription } from "../lib/access";
import { colors, fonts } from "../theme";
import LoadError from "../components/LoadError";
import PaywallAnalytics from "../components/PaywallAnalytics";

export default function ChapterPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  // Venu de la page /reviser : reste concentré sur cette compétence précise
  // (voir ChapterRunner, prop focusSkill) plutôt qu'un tirage au hasard dans
  // tout le chapitre.
  const focusSkill = searchParams.get("competence") || undefined;
  const focusError = searchParams.get("erreur") || undefined;
  const chapter = getChapter(id);
  const { user } = useAuth();
  const { subscription: rawSubscription, loading, error: subscriptionError, reload: reloadSubscription } = useSubscription(user?.id);
  const subscription = getEffectiveSubscription(user, rawSubscription);
  const { chapterId: referralBonusChapterId } = useReferralBonus(user?.id);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
        <p style={{ color: colors.slate }}>
          Chapitre introuvable. <Link to="/" style={{ color: colors.ink }}>Retour à l'accueil</Link>
        </p>
      </div>
    );
  }

  const freemium = !!chapter.meta.freemiumDaily;
  const locked = !canAccessChapter(chapter, { user, subscription, referralBonusChapterId });

  if (loading && !chapter.meta.free && !freemium) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg, color: colors.slate }}>
        Chargement…
      </div>
    );
  }

  if (subscriptionError && !chapter.meta.free && !freemium) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: colors.bg }}>
        <LoadError message="Impossible de vérifier ton accès à ce chapitre." onRetry={reloadSubscription} />
      </div>
    );
  }

  if (locked) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center"
        style={{ background: colors.bg, fontFamily: fonts.body }}
      >
        <PaywallAnalytics chapterId={chapter.meta.id} levelId={chapter.meta.level} offerContext="locked_chapter" />
        <p style={{ fontFamily: fonts.display, fontSize: "1.3rem", fontWeight: 800, color: colors.ink, letterSpacing: "-0.01em" }}>
          {chapter.meta.title} est un chapitre sous abonnement
        </p>
        <p className="text-sm" style={{ color: colors.slate }}>
          {chapter.meta.unlockHint ?? "Abonne-toi, ou débloque-le en parrainant 5 amis (voir Mon compte)."}
        </p>
        <Link
          to="/compte"
          className="py-2.5 px-6 rounded-full text-sm font-semibold"
          style={{ backgroundColor: colors.ink, color: colors.bg }}
        >
          Voir les offres
        </Link>
        <Link to={`/niveau/${chapter.meta.level}`} className="text-sm font-medium" style={{ color: colors.slate }}>
          ← Continuer gratuitement
        </Link>
      </div>
    );
  }

  if (chapter.meta.isAutomatismes) {
    return <AutomatismesRunner chapter={chapter} />;
  }

  return <ChapterRunner chapter={chapter} focusSkill={focusSkill} focusError={focusError} />;
}
