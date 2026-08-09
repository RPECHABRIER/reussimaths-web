import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { isAdminUser, isFullAccessSubscription, getEffectiveSubscription } from "../lib/access";
import { supabase } from "../lib/supabaseClient";
import { colors, fonts, shadow } from "../theme";
import LoadError from "../components/LoadError";

// ---------------------------------------------------------------------------
// Onglet "Idées d'amélioration" (/idees) — réservé à l'abonnement complet
// (voir RLS "feature_ideas: abonnement complet can submit" dans
// supabase/schema.sql). Un abonné peut SEULEMENT envoyer une idée (pas de
// lecture, ni des siennes ni de celles des autres — pas de policy SELECT
// pour lui) : voir Compte > Romain qui décide s'il veut que les abonnés
// voient aussi leurs anciennes idées. Seul l'admin (Romain, email fixe) voit
// la liste complète des idées soumises.
// ---------------------------------------------------------------------------
export default function Idees() {
  const { user, loading } = useAuth();
  const {
    subscription: rawSubscription,
    loading: subLoading,
    error: subscriptionError,
    reload: reloadSubscription,
  } = useSubscription(user?.id);
  const subscription = getEffectiveSubscription(user, rawSubscription);
  const admin = isAdminUser(user);
  const fullAccess = isFullAccessSubscription(subscription);

  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const [ideas, setIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(admin);

  useEffect(() => {
    if (!admin) return;
    let cancelled = false;
    setIdeasLoading(true);
    supabase
      .from("feature_ideas")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) console.error("[Idees] fetch error:", fetchError.message);
        setIdeas(data ?? []);
        setIdeasLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [admin]);

  const submit = async () => {
    if (!content.trim()) return;
    setError(null);
    setSending(true);
    const { error: insertError } = await supabase.from("feature_ideas").insert({
      user_id: user.id,
      content: content.trim(),
    });
    setSending(false);
    if (insertError) {
      console.error("[Idees] insert error:", insertError.message);
      setError("Une erreur est survenue, réessaie.");
      return;
    }
    setContent("");
    setSent(true);
  };

  if (loading || subLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg, color: colors.slate }}>
        Chargement…
      </div>
    );
  }

  if (subscriptionError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: colors.bg }}>
        <LoadError message="Impossible de vérifier ton accès à cet espace." onRetry={reloadSubscription} />
      </div>
    );
  }

  if (!admin && !fullAccess) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center"
        style={{ background: colors.bg, fontFamily: fonts.body }}
      >
        <p style={{ fontFamily: fonts.display, fontSize: "1.2rem", fontWeight: 800, color: colors.ink }}>
          Réservé à l'abonnement complet
        </p>
        <p className="text-sm" style={{ color: colors.slate }}>
          Cet onglet permet de proposer des idées pour améliorer l'application. Il est réservé aux abonnés complet.
        </p>
        <Link to="/compte" className="text-sm font-medium" style={{ color: colors.ink }}>
          Gérer mon abonnement
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-md mx-auto">
        <Link to="/compte" className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Mon compte
        </Link>

        <div className="text-center my-7">
          <h1 style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Idées d'amélioration
          </h1>
          <p className="text-sm mt-1.5" style={{ color: colors.slate }}>
            {admin ? "Toutes les idées envoyées par les abonnés." : "Une idée pour améliorer Reussimaths ? Dis-nous tout."}
          </p>
        </div>

        {!admin && (
          <div className="rounded-3xl p-5 flex flex-col gap-3" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            {sent ? (
              <p className="text-sm text-center" style={{ color: colors.green }}>
                Merci, ton idée a bien été envoyée !
              </p>
            ) : (
              <>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  placeholder="Décris ton idée ici…"
                  className="text-sm rounded-2xl p-3 resize-none"
                  style={{ border: `1px solid ${colors.ink}22`, color: colors.ink }}
                />
                {error && (
                  <p className="text-xs" style={{ color: colors.red }}>
                    {error}
                  </p>
                )}
                <button
                  disabled={sending || !content.trim()}
                  onClick={submit}
                  className="py-2.5 rounded-full font-semibold text-sm"
                  style={{ backgroundColor: colors.ink, color: colors.bg, opacity: content.trim() ? 1 : 0.5 }}
                >
                  {sending ? "Envoi…" : "Envoyer mon idée"}
                </button>
              </>
            )}
            {sent && (
              <button
                onClick={() => setSent(false)}
                className="py-2 rounded-full text-sm font-medium"
                style={{ color: colors.slate }}
              >
                Envoyer une autre idée
              </button>
            )}
          </div>
        )}

        {admin && (
          <div className="flex flex-col gap-3">
            {ideasLoading ? (
              <p className="text-sm text-center" style={{ color: colors.slate }}>
                Chargement…
              </p>
            ) : ideas.length === 0 ? (
              <p className="text-sm text-center" style={{ color: colors.slate }}>
                Aucune idée envoyée pour l'instant.
              </p>
            ) : (
              ideas.map((idea) => (
                <div key={idea.id} className="rounded-2xl p-4" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
                  <p className="text-sm" style={{ color: colors.ink, whiteSpace: "pre-wrap" }}>
                    {idea.content}
                  </p>
                  <p className="text-xs mt-2" style={{ color: colors.slate }}>
                    {new Date(idea.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
