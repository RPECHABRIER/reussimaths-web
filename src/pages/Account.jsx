import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { useProfile } from "../hooks/useProfile";
import { useReferrals } from "../hooks/useReferrals";
import { useReferralBonus } from "../hooks/useReferralBonus";
import {
  isAdminUser,
  isRealAdmin,
  isFullAccessSubscription,
  isPackExamenSubscription,
  getEffectiveSubscription,
  EXAM_CHAPTER_BY_LEVEL,
} from "../lib/access";
import { getAdminPreview } from "../lib/adminPreview";
import PackExamenChoice from "../components/PackExamenChoice";
import ReferralBonusChoice from "../components/ReferralBonusChoice";
import ReviserCard from "../components/ReviserCard";
import { getChapter } from "../chapters/registry";
import { LEVELS } from "../levels";
import { colors, fonts, shadow } from "../theme";

// Note : la redirection vers /pseudo pour un utilisateur sans profil est
// gérée globalement dans App.jsx (fonctionne quelle que soit la page
// d'arrivée après connexion, pas seulement /compte).
export default function Account() {
  const { user, loading, signInWithGoogle, signInWithApple, signOut } = useAuth();
  const { subscription: rawSubscription, reload: reloadSubscription } = useSubscription(user?.id);
  const subscription = getEffectiveSubscription(user, rawSubscription);
  const { profile } = useProfile(user?.id);
  const { count: referralCount } = useReferrals(user?.id);
  const { chapterId: referralBonusChapterId, reload: reloadReferralBonus } = useReferralBonus(user?.id);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const admin = isAdminUser(user);
  const fullAccess = isFullAccessSubscription(subscription);
  const packExamen = isPackExamenSubscription(subscription);
  const packExamenNeedsChoice = packExamen && !subscription?.pack_examen_level;
  // isActive recalculé sur la subscription EFFECTIVE (donc cohérent avec une
  // préviz admin en cours) plutôt que de reprendre isActive du hook, qui
  // porte toujours sur la vraie ligne en base.
  const isActive = fullAccess || packExamen;
  const previewing = isRealAdmin(user) && !!getAdminPreview()?.mode && getAdminPreview()?.mode !== "admin";

  const referralLink = profile?.referral_code
    ? `${window.location.origin}/?ref=${profile.referral_code}`
    : null;

  const startCheckout = async (plan) => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plan }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg, color: colors.slate }}>
        Chargement…
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 flex flex-col items-center justify-center gap-4" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <Link to="/" className="text-sm font-medium self-start" style={{ color: colors.ink }}>
        ← Accueil
      </Link>

      {!user ? (
        <div className="flex flex-col gap-3 w-full max-w-xs rounded-3xl p-6" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
          <p className="text-center text-sm" style={{ color: colors.slate }}>
            Connexion simplifiée, aucun nom réel n'est affiché dans l'app : tu choisis un pseudo après connexion.
          </p>
          <button onClick={signInWithGoogle} className="py-2.5 rounded-full font-semibold" style={{ backgroundColor: colors.ink, color: colors.bg }}>
            Continuer avec Google
          </button>
          <button onClick={signInWithApple} className="py-2.5 rounded-full font-semibold" style={{ backgroundColor: colors.ink, color: colors.bg }}>
            Continuer avec Apple
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full max-w-xs text-center rounded-3xl p-6" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
          <p style={{ fontFamily: fonts.display, fontWeight: 700, color: colors.ink, fontSize: "1.1rem" }}>
            {profile?.pseudo ?? "Connecté"}
          </p>
          <p className="text-sm" style={{ color: colors.slate }}>
            Abonnement : {admin ? "accès complet (admin)" : isActive ? `actif (${subscription?.plan ?? ""})` : "aucun"}
          </p>

          {isRealAdmin(user) && (
            <Link
              to="/admin"
              className="text-xs font-medium py-1.5 rounded-full"
              style={{ color: previewing ? colors.gold : colors.slate }}
            >
              {previewing ? "⚠ Prévisualisation active — gérer" : "Panneau admin"}
            </Link>
          )}

          {packExamen && subscription?.plan === "special_examen" && subscription?.current_period_end && (
            <p className="text-xs" style={{ color: colors.slate }}>
              Accès jusqu'au {new Date(subscription.current_period_end).toLocaleDateString("fr-FR")} (offre non
              reconductible)
            </p>
          )}

          {packExamenNeedsChoice && <PackExamenChoice onDone={reloadSubscription} />}

          {packExamen && subscription?.pack_examen_level && (() => {
            const levelLabel = LEVELS.find((l) => l.id === subscription.pack_examen_level)?.label ?? subscription.pack_examen_level;
            const examChapterId = EXAM_CHAPTER_BY_LEVEL[subscription.pack_examen_level];
            const examChapter = examChapterId ? getChapter(examChapterId) : null;
            const bonusChapters = (subscription.pack_examen_bonus_chapters ?? [])
              .map((id) => getChapter(id))
              .filter(Boolean);
            return (
              <div className="rounded-2xl p-4 text-left" style={{ backgroundColor: colors.bg }}>
                <p className="text-xs font-semibold" style={{ color: colors.ink }}>
                  Pack Examen — {levelLabel}
                </p>
                <p className="text-xs mt-1" style={{ color: colors.slate }}>
                  Ce que ça débloque, pour ce niveau uniquement :
                </p>
                <ul className="text-xs mt-1.5 flex flex-col gap-0.5" style={{ color: colors.slate }}>
                  {examChapter && <li>• {examChapter.meta.title} (préparation à l'examen)</li>}
                  <li>• Automatismes en illimité</li>
                  {bonusChapters.map((c) => (
                    <li key={c.meta.id}>• {c.meta.title} (bonus)</li>
                  ))}
                </ul>
                <p className="text-xs mt-2" style={{ color: colors.slate }}>
                  Ton choix est définitif : abonne-toi en complet pour débloquer tous les niveaux.
                </p>
              </div>
            );
          })()}

          {fullAccess && (
            <Link to="/idees" className="text-xs font-medium" style={{ color: colors.gold }}>
              💡 Proposer une idée d'amélioration
            </Link>
          )}

          <ReviserCard />

          <Link to="/bilan">
            <div
              className="rounded-3xl px-5 py-4 flex items-center gap-3 transition-transform active:scale-[0.98]"
              style={{ backgroundColor: `${colors.gold}12`, border: `1px solid ${colors.gold}33` }}
            >
              <div
                className="flex items-center justify-center rounded-2xl flex-shrink-0"
                style={{ width: 44, height: 44, backgroundColor: `${colors.gold}22` }}
              >
                <BarChart3 size={20} color={colors.gold} />
              </div>
              <div className="min-w-0 text-left">
                <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1rem", fontWeight: 700 }}>
                  Bilan de la semaine
                </p>
                <p className="text-xs mt-0.5" style={{ color: colors.slate }}>
                  Temps passé, réussite, priorités — utile pour les parents
                </p>
              </div>
            </div>
          </Link>

          <div className="flex items-center justify-center gap-4">
            <Link to="/pseudo" className="text-xs font-medium" style={{ color: colors.slate }}>
              Changer de pseudo
            </Link>
            <Link to="/amis" className="text-xs font-medium" style={{ color: colors.slate }}>
              Amis & défis
            </Link>
          </div>

          {referralLink && (
            <div className="rounded-2xl p-4 text-left flex flex-col gap-3" style={{ backgroundColor: colors.bg }}>
              <div>
                <p className="text-xs font-semibold" style={{ color: colors.ink }}>
                  Parrainage — {referralCount}/5 amis
                </p>
                <p className="text-xs mt-1" style={{ color: colors.slate }}>
                  {fullAccess
                    ? "Si un ami que tu parraines s'abonne, tu reçois un mois gratuit."
                    : referralBonusChapterId
                    ? "Chapitre bonus débloqué grâce à tes 5 filleuls."
                    : "Parraine 5 amis pour débloquer un chapitre supplémentaire au choix."}
                </p>
                <p
                  className="text-xs mt-2 px-2.5 py-1.5 rounded-lg break-all"
                  style={{ backgroundColor: colors.card, color: colors.ink, fontFamily: fonts.mono }}
                >
                  {referralLink}
                </p>
              </div>

              {!fullAccess && !admin && referralCount >= 5 && !referralBonusChapterId && (
                <ReferralBonusChoice onDone={reloadReferralBonus} />
              )}
            </div>
          )}

          {!isActive && !admin && (
            <>
              <div className="rounded-2xl p-3.5 text-left flex flex-col gap-2" style={{ backgroundColor: colors.bg }}>
                <div>
                  <p className="text-xs font-semibold" style={{ color: colors.ink }}>
                    Abonnement complet — 4,99 €/mois
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: colors.slate }}>
                    Accès à tous les niveaux et tous les chapitres, sans restriction.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: colors.ink }}>
                    Pack Examen — 9 € / 3 mois
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: colors.slate }}>
                    Pour UN niveau au choix (à choisir après l'achat) : le chapitre de préparation à l'examen (Brevet,
                    EAM ou Bac selon le niveau), les Automatismes en illimité, et 2 chapitres bonus au choix. N'inclut
                    pas les autres niveaux. Offre non reconductible.
                  </p>
                </div>
              </div>
              <button
                disabled={checkoutLoading}
                onClick={() => startCheckout("mensuel")}
                className="py-2.5 rounded-full font-semibold"
                style={{ backgroundColor: colors.gold, color: colors.ink }}
              >
                S'abonner — 4,99 €/mois
              </button>
              <button
                disabled={checkoutLoading}
                onClick={() => startCheckout("special_examen")}
                className="py-2 rounded-full text-sm font-medium"
                style={{ color: colors.slate }}
              >
                Offre spéciale examen (3 mois — 9 €)
              </button>
            </>
          )}
          <button onClick={signOut} className="py-2 rounded-full text-sm font-medium mt-2" style={{ color: colors.slate }}>
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
