import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";

export default function Account() {
  const { user, loading, signInWithGoogle, signInWithApple, signOut } = useAuth();
  const { subscription, isActive } = useSubscription(user?.id);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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
          <p style={{ color: "#5C6B7A" }}>Connecté</p>
          <p className="text-sm" style={{ color: "#5C6B7A" }}>
            Abonnement : {isActive ? `actif (${subscription?.plan ?? ""})` : "aucun"}
          </p>
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
