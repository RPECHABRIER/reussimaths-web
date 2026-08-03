import { useParams, Link } from "react-router-dom";
import { getChapter } from "../chapters/registry";
import ChapterRunner from "../components/ChapterRunner";
import AutomatismesRunner from "../components/AutomatismesRunner";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { useReferralBonus } from "../hooks/useReferralBonus";
import { canAccessChapter, getEffectiveSubscription } from "../lib/access";
import { colors, fonts } from "../theme";

export default function ChapterPage() {
  const { id } = useParams();
  const chapter = getChapter(id);
  const { user } = useAuth();
  const { subscription: rawSubscription, loading } = useSubscription(user?.id);
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

  if (locked) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center"
        style={{ background: colors.bg, fontFamily: fonts.body }}
      >
        <p style={{ fontFamily: fonts.display, fontSize: "1.3rem", fontWeight: 800, color: colors.ink, letterSpacing: "-0.01em" }}>
          {chapter.meta.title} est un chapitre sous abonnement
        </p>
        <p className="text-sm" style={{ color: colors.slate }}>
          {chapter.meta.unlockHint ?? "Abonne-toi, ou débloque-le en parrainant 5 amis (voir Mon compte)."}
        </p>
        <Link to="/compte" className="text-sm font-medium" style={{ color: colors.ink }}>
          Gérer mon abonnement
        </Link>
      </div>
    );
  }

  if (chapter.meta.isAutomatismes) {
    return <AutomatismesRunner chapter={chapter} />;
  }

  return <ChapterRunner chapter={chapter} />;
}
