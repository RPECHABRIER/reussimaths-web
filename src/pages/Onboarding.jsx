import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";

// Écran "choisis ton pseudo", affiché une seule fois après la première
// connexion (voir la redirection dans src/pages/Account.jsx). Le pseudo est
// l'identité publique affichée dans l'app (jamais le nom réel/l'email).
export default function Onboarding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) navigate("/compte");
  }, [loading, user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = pseudo.trim();
    if (trimmed.length < 3) {
      setError("Choisis un pseudo d'au moins 3 caractères.");
      return;
    }
    setSaving(true);
    setError(null);
    const { error: err } = await supabase
      .from("profiles")
      .upsert({ user_id: user.id, pseudo: trimmed }, { onConflict: "user_id" });
    if (err) {
      setSaving(false);
      setError("Ce pseudo est peut-être déjà pris, essaie un autre.");
      return;
    }

    // Parrainage : si arrivé via un lien /?ref=<code>, enregistre le parrain
    // (une seule fois — la clé est supprimée du navigateur juste après).
    const refCode = localStorage.getItem("reussimaths_ref_code");
    if (refCode) {
      const { data: referrer } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("referral_code", refCode)
        .maybeSingle();
      if (referrer && referrer.user_id !== user.id) {
        await supabase.from("referrals").insert({ referrer_id: referrer.user_id, referred_id: user.id });
      }
      localStorage.removeItem("reussimaths_ref_code");
    }

    setSaving(false);
    navigate("/");
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Chargement…</div>;
  }

  return (
    <div
      className="min-h-screen w-full p-6 flex flex-col items-center justify-center gap-4"
      style={{ fontFamily: "Inter, sans-serif", background: "#F7F4EC" }}
    >
      <div className="max-w-xs w-full text-center">
        <h1 style={{ fontFamily: "Fraunces, serif", color: "#1B2A4A", fontSize: "1.6rem", fontWeight: 600 }}>
          Choisis ton pseudo
        </h1>
        <p className="text-sm mt-2 mb-5" style={{ color: "#5C6B7A" }}>
          Ce pseudo sera visible par tes amis lors des défis. Aucun nom réel n'est affiché dans l'app.
        </p>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            maxLength={20}
            placeholder="Ex : MathWizard42"
            className="rounded-lg px-4 py-2.5 text-center"
            style={{ border: "1px solid #d5cfbc", backgroundColor: "#ffffff", color: "#1B2A4A" }}
          />
          {error && (
            <p className="text-xs" style={{ color: "#C1543C" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="py-2.5 rounded-lg font-semibold"
            style={{ backgroundColor: "#1B2A4A", color: "#F7F4EC" }}
          >
            {saving ? "Enregistrement…" : "Valider"}
          </button>
        </form>
      </div>
    </div>
  );
}
