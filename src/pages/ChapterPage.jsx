import { useParams, Link } from "react-router-dom";
import { getChapter } from "../chapters/registry";
import ChapterRunner from "../components/ChapterRunner";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { useReferrals } from "../hooks/useReferrals";

export default function ChapterPage() {
  const { id } = useParams();
  const chapter = getChapter(id);
  const { user } = useAuth();
  const { isActive, loading } = useSubscription(user?.id);
  const { count: referralCount } = useReferrals(user?.id);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>
          Chapitre introuvable. <Link to="/">Retour à l'accueil</Link>
        </p>
      </div>
    );
  }

  const freemium = !!chapter.meta.freemiumDaily;
  const referralUnlocked = !!chapter.meta.unlockReferrals && referralCount >= chapter.meta.unlockReferrals;
  const locked = !chapter.meta.free && !freemium && !isActive && !referralUnlocked;

  if (loading && !chapter.meta.free && !freemium) {
    return <div className="min-h-screen flex items-center justify-center">Chargement…</div>;
  }

  if (locked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p style={{ fontFamily: "Fraunces, serif", fontSize: "1.3rem", color: "#1B2A4A" }}>
          {chapter.meta.title} est {chapter.meta.unlockReferrals ? "un chapitre à débloquer" : "un chapitre sous abonnement"}
        </p>
        <p className="text-sm" style={{ color: "#5C6B7A" }}>
          {chapter.meta.unlockReferrals
            ? `Encore ${chapter.meta.unlockReferrals - referralCount} ami(s) à parrainer pour débloquer ce chapitre.`
            : chapter.meta.unlockHint ?? "Abonne-toi pour y accéder."}
        </p>
        <Link to="/compte" className="text-sm underline">
          {chapter.meta.unlockReferrals ? "Voir mon lien de parrainage" : "Gérer mon abonnement"}
        </Link>
      </div>
    );
  }

  return <ChapterRunner chapter={chapter} />;
}
