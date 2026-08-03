import { Link, useParams } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";
import { getChaptersByLevel } from "../chapters/registry";
import { getLevel } from "../levels";
import { getPlannedChapters } from "../plannedChapters";
import { getParcoursForLevel } from "../parcours";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { useReferrals } from "../hooks/useReferrals";
import { colors, fonts, shadow } from "../theme";
import ComingSoon from "./ComingSoon";

// Liste des chapitres d'un niveau donné (/niveau/:levelId), en mélangeant les
// chapitres réels (avec du contenu, voir chapters/registry.js) et les
// chapitres PRÉVUS mais pas encore écrits (voir plannedChapters.js), affichés
// en gris avec un badge "Bientôt" pour montrer le sommaire complet du niveau.
// Si le niveau n'a NI contenu réel NI sommaire prévu, affiche la page
// "Bientôt disponible" + vote (niveau pas encore commencé).
export default function Niveau() {
  const { levelId } = useParams();
  const level = getLevel(levelId);
  const realChapters = getChaptersByLevel(levelId);
  const parcoursList = getParcoursForLevel(levelId);
  const realIds = new Set(realChapters.map((c) => c.meta.id));
  const plannedChapters = getPlannedChapters(levelId).filter((p) => !realIds.has(p.id));
  const { user } = useAuth();
  const { isActive } = useSubscription(user?.id);
  const { count: referralCount } = useReferrals(user?.id);

  if (!level) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center" style={{ background: colors.bg }}>
        <p style={{ color: colors.slate }}>Niveau introuvable.</p>
        <Link to="/" className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (realChapters.length === 0 && plannedChapters.length === 0) {
    return <ComingSoon level={level} />;
  }

  const rows = [
    ...realChapters.map((c) => ({ kind: "real", chapter: c, order: c.meta.order ?? 999 })),
    ...plannedChapters.map((p) => ({ kind: "planned", chapter: p, order: p.order ?? 999 })),
  ].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-md mx-auto">
        <Link to={level.cycle ? `/${level.cycle}` : "/"} className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Changer de niveau
        </Link>

        <div className="text-center my-7">
          <h1 style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {level.label}
          </h1>
        </div>

        {parcoursList.length > 0 && (
          <Link to={`/parcours/niveau/${levelId}`}>
            <div
              className="rounded-3xl px-5 py-4 flex items-center gap-3 mb-5 transition-transform active:scale-[0.98]"
              style={{ backgroundColor: colors.card, boxShadow: shadow.raised }}
            >
              <div
                className="flex items-center justify-center rounded-2xl flex-shrink-0"
                style={{ width: 44, height: 44, backgroundColor: `${colors.gold}18` }}
              >
                <Sparkles size={20} color={colors.gold} />
              </div>
              <div>
                <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1rem", fontWeight: 700 }}>
                  Suivre un parcours
                </p>
                <p className="text-xs mt-0.5" style={{ color: colors.slate }}>
                  Débutant, avancé, expert — avec ta progression en %
                </p>
              </div>
            </div>
          </Link>
        )}

        <div className="flex flex-col gap-3">
          {rows.map((row) => {
            if (row.kind === "planned") {
              const p = row.chapter;
              return (
                <div
                  key={p.id}
                  className="rounded-3xl px-5 py-4 flex items-center justify-between"
                  style={{ backgroundColor: colors.card, boxShadow: shadow.soft, opacity: 0.65 }}
                >
                  <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.05rem", fontWeight: 700 }}>
                    {p.title}
                  </p>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{ backgroundColor: `${colors.slate}14`, color: colors.slate }}
                  >
                    Bientôt
                  </span>
                </div>
              );
            }

            const chapter = row.chapter;
            const freemium = !!chapter.meta.freemiumDaily;
            const referralUnlocked = !!chapter.meta.unlockReferrals && referralCount >= chapter.meta.unlockReferrals;
            const locked = !chapter.meta.free && !freemium && !isActive && !referralUnlocked;
            const content = (
              <div
                className="rounded-3xl px-5 py-4 flex items-center justify-between transition-transform active:scale-[0.98]"
                style={{ backgroundColor: colors.card, boxShadow: shadow.soft, opacity: locked ? 0.6 : 1 }}
              >
                <div>
                  <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.05rem", fontWeight: 700 }}>
                    {chapter.meta.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: colors.slate }}>
                    {locked
                      ? chapter.meta.unlockReferrals
                        ? `${chapter.meta.unlockReferrals - referralCount} ami(s) à parrainer pour débloquer`
                        : chapter.meta.unlockHint ?? "Chapitre sous abonnement"
                      : freemium
                      ? `${chapter.meta.description} — ${chapter.meta.freemiumDaily} questions gratuites/jour`
                      : chapter.meta.description}
                  </p>
                </div>
                {locked && <Lock size={18} color={colors.slate} />}
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
          <Link to="/compte" className="text-sm font-medium" style={{ color: colors.ink }}>
            {user ? "Mon compte" : "Se connecter"}
          </Link>
        </div>
      </div>
    </div>
  );
}
