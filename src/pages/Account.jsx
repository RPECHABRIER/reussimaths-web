import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { useProfile } from "../hooks/useProfile";
import { useReferrals } from "../hooks/useReferrals";
import { isAdminUser, isFullAccessSubscription, isPackExamenSubscription } from "../lib/access";
import PackExamenChoice from "../components/PackExamenChoice";
import { colors, fonts, shadow } from "../theme";

// Note : la redirection vers /pseudo pour un utilisateur sans profil est
// gérée globalement dans App.jsx (fonctionne quelle que soit la page
// d'arrivée après connexion, pas seulement /compte).
export default function Account() {
  const { user, loading, signInWithGoogle, signInWithApple, signOut } = useAuth();
  const { subscription, isActive, reload: reloadSubscription } = useSubscription(user?.id);
  const { profile } = useProfile(user?.id);
  const { count: referralCount } = useReferrals(user?.id);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const admin = isAdminUser(user);
  const fullAccess = isFullAccessSubscription(subscription);
  const packExamen = isPackExamenSubscription(subscription);
  const packExamenNeedsChoice = packExamen && !subscription?.pack_examen_level;

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
          {packExamen && subscription?.plan === "special_examen" && subscription?.current_period_end && (
            <p className="text-xs" style={{ color: colors.slate }}>
              Accès jusqu'au {new Date(subscription.current_period_end).toLocaleDateString("fr-FR")} (offre non
              reconductible)
            </p>
          )}

          {packExamenNeedsChoice && <PackExamenChoice onDone={reloadSubscription} />}

          {packExamen && subscription?.pack_examen_level && (
            <div className="rounded-2xl p-4 text-left" style={{ backgroundColor: colors.bg }}>
              <p className="text-xs font-semibold" style={{ color: colors.ink }}>
                Pack Examen — niveau choisi
              </p>
              <p className="text-xs mt-1" style={{ color: colors.slate }}>
                Ton choix est définitif : abonne-toi en complet pour débloquer tous les niveaux.
              </p>
            </div>
          )}

          {fullAccess && (
            <Link to="/idees" className="text-xs font-medium" style={{ color: colors.gold }}>
              💡 Proposer une idée d'amélioration
            </Link>
          )}

          <div className="flex items-center justify-center gap-4">
            <Link to="/pseudo" className="text-xs font-medium" style={{ color: colors.slate }}>
              Changer de pseudo
            </Link>
            <Link to="/amis" className="text-xs font-medium" style={{ color: colors.slate }}>
              Amis & défis
            </Link>
          </div>

          {referralLink && (
            <div className="rounded-2xl p-4 text-left" style={{ backgroundColor: colors.bg }}>
              <p className="text-xs font-semibold" style={{ color: colors.ink }}>
                Parrainage — {referralCount}/5 amis
              </p>
              <p className="text-xs mt-1" style={{ color: colors.slate }}>
                Invite des amis à utiliser Reussimaths avec ton lien.
              </p>
              <p
                className="text-xs mt-2 px-2.5 py-1.5 rounded-lg break-all"
                style={{ backgroundColor: colors.card, color: colors.ink, fontFamily: fonts.mono }}
              >
                {referralLink}
              </p>
            </div>
          )}

          {!isActive && !admin && (
            <>
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
