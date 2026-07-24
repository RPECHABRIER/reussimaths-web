import { Link, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { getChaptersByLevel } from "../chapters/registry";
import { getLevel } from "../levels";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { useReferrals } from "../hooks/useReferrals";
import ComingSoon from "./ComingSoon";

// Liste des chapitres d'un niveau donné (/niveau/:levelId). Si le niveau
// n'a encore aucun chapitre, affiche la page "Bientôt disponible" + vote.
export default function Niveau() {
  const { levelId } = useParams();
  const level = getLevel(levelId);
  const chapters = getChaptersByLevel(levelId);
  const { user } = useAuth();
  const { isActive } = useSubscription(user?.id);
  const { count: referralCount } = useReferrals(user?.id);

  if (!level) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center">
        <p style={{ color: "#5C6B7A" }}>Niveau introuvable.</p>
        <Link to="/" className="text-sm underline" style={{ color: "#5C6B7A" }}>
          ← Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (chapters.length === 0) {
    return <ComingSoon level={level} />;
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: "#F7F4EC", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-md mx-auto">
        <Link to="/" className="text-sm underline" style={{ color: "#5C6B7A" }}>
          ← Changer de niveau
        </Link>

        <div className="text-center my-6">
          <h1 style={{ fontFamily: "Fraunces, serif", color: "#1B2A4A", fontSize: "1.75rem", fontWeight: 600 }}>
            {level.label}
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          {chapters.map((chapter) => {
            const freemium = !!chapter.meta.freemiumDaily;
            const referralUnlocked = !!chapter.meta.unlockReferrals && referralCount >= chapter.meta.unlockReferrals;
            const locked = !chapter.meta.free && !freemium && !isActive && !referralUnlocked;
            const content = (
              <div
                className="rounded-2xl p-4 flex items-center justify-between"
                style={{ backgroundColor: "#ffffff", border: "1px solid #e4dfd0", opacity: locked ? 0.6 : 1 }}
              >
                <div>
                  <p style={{ fontFamily: "Fraunces, serif", color: "#1B2A4A", fontSize: "1.1rem", fontWeight: 600 }}>
                    {chapter.meta.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#5C6B7A" }}>
                    {locked
                      ? chapter.meta.unlockReferrals
                        ? `${chapter.meta.unlockReferrals - referralCount} ami(s) à parrainer pour débloquer`
                        : chapter.meta.unlockHint ?? "Chapitre sous abonnement"
                      : freemium
                      ? `${chapter.meta.description} — ${chapter.meta.freemiumDaily} questions gratuites/jour`
                      : chapter.meta.description}
                  </p>
                </div>
                {locked && <Lock size={18} color="#5C6B7A" />}
              </div>
            );
            return locked ? (
              <div key={chapter.meta.id}>{content}</div>
            ) : (
              <Link key={chapter.meta.id} to={`/chapitre/${chapter.meta.id}`}>
                {content}
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link to="/compte" className="text-sm underline" style={{ color: "#5C6B7A" }}>
            {user ? "Mon compte" : "Se connecter"}
          </Link>
        </div>
      </div>
    </div>
  );
}
