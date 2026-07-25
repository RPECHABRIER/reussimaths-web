import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { useProfile } from "../hooks/useProfile";
import { useReferrals } from "../hooks/useReferrals";

// Note : la redirection vers /pseudo pour un utilisateur sans profil est
// gérée globalement dans App.jsx (fonctionne quelle que soit la page
// d'arrivée après connexion, pas seulement /compte).
export default function Account() {
  const { user, loading, signInWithGoogle, signInWithApple, signOut } = useAuth();
  const { subscription, isActive } = useSubscription(user?.id);
  const { profile } = useProfile(user?.id);
  const { count: referralCount } = useReferrals(user?.id);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement…</div>;

  return (
    <div className="min-h-screen w-full p-6 flex flex-col items-center justify-center gap-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <Link to="/" className="text-sm underline self-start" style={{ color: "#5C6B7A" }}>
        ← Accueil
      </Link>

      {!user ? (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <p className="text-center text-sm" style={{ color: "#5C6B7A" }}>
            Connexion simplifiée, aucun nom réel n'est affiché dans l'app : tu choisis un pseudo après connexion.
          </p>
          <button onClick={signInWithGoogle} className="py-2 rounded-lg font-semibold" style={{ backgroundColor: "#1B2A4A", color: "#F7F4EC" }}>
            Continuer avec Google
          </button>
          <button onClick={signInWithApple} className="py-2 rounded-lg font-semibold" style={{ backgroundColor: "#1B2A4A", color: "#F7F4EC" }}>
            Continuer avec Apple
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full max-w-xs text-center">
          <p style={{ color: "#5C6B7A" }}>Connecté{profile?.pseudo ? ` — ${profile.pseudo}` : ""}</p>
          <p className="text-sm" style={{ color: "#5C6B7A" }}>
            Abonnement : {isActive ? `actif (${subscription?.plan ?? ""})` : "aucun"}
          </p>
          {isActive && subscription?.plan === "special_examen" && subscription?.current_period_end && (
            <p className="text-xs" style={{ color: "#5C6B7A" }}>
              Accès jusqu'au {new Date(subscription.current_period_end).toLocaleDateString("fr-FR")} (offre non
              reconductible)
            </p>
          )}
          <Link to="/pseudo" className="text-xs underline" style={{ color: "#5C6B7A" }}>
            Changer de pseudo
          </Link>

          {referralLink && (
            <div className="rounded-lg p-3 text-left" style={{ backgroundColor: "#F7F4EC", border: "1px solid #e4dfd0" }}>
              <p className="text-xs font-semibold" style={{ color: "#1B2A4A" }}>
                Parrainage — {referralCount}/5 amis
              </p>
              <p className="text-xs mt-1" style={{ color: "#5C6B7A" }}>
                Invite 5 amis pour débloquer le chapitre Probabilités, sans abonnement.
              </p>
              <p
                className="text-xs mt-2 px-2 py-1.5 rounded break-all"
                style={{ backgroundColor: "#ffffff", border: "1px solid #d5cfbc", color: "#1B2A4A", fontFamily: "Space Mono, monospace" }}
              >
                {referralLink}
              </p>
            </div>
          )}

          {!isActive && (
            <>
              <button
                disabled={checkoutLoading}
                onClick={() => startCheckout("mensuel")}
                className="py-2 rounded-lg font-semibold"
                style={{ backgroundColor: "#D9A441", color: "#1B2A4A" }}
              >
                S'abonner — 4,99 €/mois
              </button>
              <button
                disabled={checkoutLoading}
                onClick={() => startCheckout("special_examen")}
                className="py-2 rounded-lg text-sm underline"
                style={{ color: "#5C6B7A" }}
              >
                Offre spéciale examen (3 mois — 9 €)
              </button>
            </>
          )}
          <button onClick={signOut} className="py-2 rounded-lg text-sm underline mt-2" style={{ color: "#5C6B7A" }}>
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
