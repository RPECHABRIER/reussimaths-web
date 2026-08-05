import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isRealAdmin, EXAM_CHAPTER_BY_LEVEL } from "../lib/access";
import { getAdminPreview, setAdminPreview } from "../lib/adminPreview";
import { supabase } from "../lib/supabaseClient";
import { chapters } from "../chapters/registry";
import { LEVELS } from "../levels";
import { colors, fonts, shadow } from "../theme";

// ---------------------------------------------------------------------------
// Panneau admin (/admin, réservé à romainpechabrier@gmail.com) — voir
// supabase/schema.sql (policies "subscriptions: admin can read all" et
// user_login_stats) et src/lib/adminPreview.js.
//
// Deux sections indépendantes :
//   1. Prévisualisation : voir l'app comme un compte gratuit / Pack Examen /
//      abonnement complet SANS créer de vrais comptes (connexion Google/Apple
//      uniquement, impossible de se connecter à la place de quelqu'un).
//      Purement client (localStorage) — voir src/lib/access.js
//      (getEffectiveSubscription, isAdminUser) pour où c'est consommé.
//   2. Tableau de bord abonnés : pseudo, palier, statut, connexions — lecture
//      seule sur les vraies données.
// ---------------------------------------------------------------------------
export default function AdminPreview() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg, color: colors.slate }}>
        Chargement…
      </div>
    );
  }

  if (!isRealAdmin(user)) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center"
        style={{ background: colors.bg, fontFamily: fonts.body }}
      >
        <p style={{ fontFamily: fonts.display, fontSize: "1.2rem", fontWeight: 800, color: colors.ink }}>
          Réservé à l'admin
        </p>
        <Link to="/" className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div>
          <Link to="/compte" className="text-sm font-medium" style={{ color: colors.ink }}>
            ← Mon compte
          </Link>
          <h1
            className="mt-4"
            style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Panneau admin
          </h1>
        </div>

        <PreviewSwitcher />
        <GrantAccessTool />
        <SubscribersDashboard />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Offrir un accès complet gratuit
// ---------------------------------------------------------------------------
function GrantAccessTool() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageIsError, setMessageIsError] = useState(false);

  const call = async (action) => {
    if (!email.trim() || loading) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin-grant-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminUserId: user.id, targetEmail: email.trim(), action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessageIsError(true);
        setMessage(data.error ?? "Erreur.");
      } else {
        setMessageIsError(false);
        setMessage(action === "grant" ? `Accès complet offert à ${email.trim()}.` : `Accès offert révoqué pour ${email.trim()}.`);
        setEmail("");
      }
    } catch (err) {
      console.error("[GrantAccessTool]", err);
      setMessageIsError(true);
      setMessage("Erreur réseau, réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl p-5 flex flex-col gap-3" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
      <p style={{ fontFamily: fonts.display, fontSize: "1rem", fontWeight: 700, color: colors.ink }}>
        Offrir un accès complet gratuit
      </p>
      <p className="text-xs" style={{ color: colors.slate }}>
        Donne gratuitement l'accès complet (tous niveaux, comme l'abonnement) à un compte de ton choix, à partir de
        son email. La personne doit déjà avoir créé son compte sur l'app.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@exemple.fr"
        className="text-xs rounded-lg px-2.5 py-2"
        style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.bg }}
      />
      <div className="flex gap-2">
        <button
          onClick={() => call("grant")}
          disabled={loading || !email.trim()}
          className="flex-1 py-2 rounded-full font-semibold text-xs"
          style={{ backgroundColor: colors.gold, color: colors.ink, opacity: loading ? 0.6 : 1 }}
        >
          Offrir l'accès
        </button>
        <button
          onClick={() => call("revoke")}
          disabled={loading || !email.trim()}
          className="flex-1 py-2 rounded-full font-semibold text-xs"
          style={{ backgroundColor: `${colors.red}18`, color: colors.red, opacity: loading ? 0.6 : 1 }}
        >
          Révoquer
        </button>
      </div>
      {message && (
        <p className="text-xs font-medium" style={{ color: messageIsError ? colors.red : colors.green }}>
          {message}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Prévisualisation
// ---------------------------------------------------------------------------
function PreviewSwitcher() {
  const stored = getAdminPreview();
  const [mode, setMode] = useState(stored?.mode ?? "admin");
  const [level, setLevel] = useState(stored?.packExamenLevel ?? "");
  const [bonusA, setBonusA] = useState(stored?.packExamenBonusChapters?.[0] ?? "");
  const [bonusB, setBonusB] = useState(stored?.packExamenBonusChapters?.[1] ?? "");

  const levelsWithContent = useMemo(() => LEVELS.filter((l) => chapters.some((c) => c.meta.level === l.id)), []);

  const bonusOptions = useMemo(() => {
    if (!level) return [];
    const examChapterId = EXAM_CHAPTER_BY_LEVEL[level];
    return chapters
      .filter((c) => c.meta.level === level)
      .filter((c) => !c.meta.free && !c.meta.freemiumDaily)
      .filter((c) => c.meta.id !== examChapterId)
      .sort((a, b) => a.meta.title.localeCompare(b.meta.title));
  }, [level]);

  useEffect(() => {
    setBonusA("");
    setBonusB("");
  }, [level]);

  const activate = () => {
    if (mode === "admin") {
      setAdminPreview(null);
    } else if (mode === "special_examen") {
      setAdminPreview({
        mode,
        packExamenLevel: level || null,
        packExamenBonusChapters: [bonusA, bonusB].filter(Boolean),
      });
    } else {
      setAdminPreview({ mode });
    }
    window.location.reload();
  };

  const currentlyPreviewing = !!stored?.mode && stored.mode !== "admin";

  return (
    <div className="rounded-3xl p-5 flex flex-col gap-3" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
      <p style={{ fontFamily: fonts.display, fontSize: "1rem", fontWeight: 700, color: colors.ink }}>
        Prévisualiser un palier
      </p>
      <p className="text-xs" style={{ color: colors.slate }}>
        Voir l'app comme un compte gratuit / Pack Examen / abonnement complet, sans créer de vrai compte de test.
        {currentlyPreviewing && " Une prévisualisation est actuellement active (bandeau en haut de l'app)."}
      </p>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="text-xs rounded-lg px-2.5 py-2"
        style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.bg }}
      >
        <option value="admin">Vue réelle (admin, accès complet)</option>
        <option value="gratuit">Gratuit</option>
        <option value="special_examen">Pack Examen</option>
        <option value="mensuel">Abonnement complet</option>
      </select>

      {mode === "special_examen" && (
        <>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="text-xs rounded-lg px-2.5 py-2"
            style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.bg }}
          >
            <option value="">— Pas encore choisi (teste l'écran de choix réel) —</option>
            {levelsWithContent.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>

          {level && (
            <>
              <p className="text-xs" style={{ color: colors.slate }}>
                Optionnel : simuler que les 2 chapitres bonus sont déjà choisis.
              </p>
              <select
                value={bonusA}
                onChange={(e) => setBonusA(e.target.value)}
                className="text-xs rounded-lg px-2.5 py-2"
                style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.bg }}
              >
                <option value="">— 1er chapitre bonus (optionnel) —</option>
                {bonusOptions.map((c) => (
                  <option key={c.meta.id} value={c.meta.id} disabled={c.meta.id === bonusB}>
                    {c.meta.title}
                  </option>
                ))}
              </select>
              <select
                value={bonusB}
                onChange={(e) => setBonusB(e.target.value)}
                className="text-xs rounded-lg px-2.5 py-2"
                style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.bg }}
              >
                <option value="">— 2e chapitre bonus (optionnel) —</option>
                {bonusOptions.map((c) => (
                  <option key={c.meta.id} value={c.meta.id} disabled={c.meta.id === bonusA}>
                    {c.meta.title}
                  </option>
                ))}
              </select>
            </>
          )}
        </>
      )}

      <button
        onClick={activate}
        className="py-2 rounded-full font-semibold text-xs"
        style={{ backgroundColor: colors.ink, color: colors.bg }}
      >
        Activer cette vue
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tableau de bord abonnés
// ---------------------------------------------------------------------------
function paletteForSub(sub) {
  // Accès classe (voir supabase/schema.sql, redeem_class_access_code) :
  // indépendant de plan/status, affiché en priorité même si l'élève n'a par
  // ailleurs aucun abonnement Stripe.
  if (sub?.class_access_level) {
    const levelLabel = LEVELS.find((l) => l.id === sub.class_access_level)?.label ?? sub.class_access_level;
    return `Accès classe (${levelLabel})`;
  }
  const isActive = sub?.status === "active" || sub?.status === "trialing";
  if (!isActive) return "Gratuit";
  if (sub?.plan === "mensuel") return sub?.admin_granted ? "Abonnement complet (offert)" : "Abonnement complet";
  if (sub?.plan === "special_examen") return "Pack Examen";
  return "Gratuit";
}

function SubscribersDashboard() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      supabase.from("profiles").select("user_id, pseudo, created_at"),
      supabase.from("subscriptions").select("user_id, plan, status, current_period_end, class_access_level, admin_granted"),
      supabase.from("user_login_stats").select("user_id, login_count, last_login_at"),
    ]).then(([profilesRes, subsRes, statsRes]) => {
      if (cancelled) return;
      const firstError = profilesRes.error || subsRes.error || statsRes.error;
      if (firstError) {
        console.error("[AdminPreview] chargement du tableau de bord :", firstError.message);
        setError("Impossible de charger le tableau de bord.");
        return;
      }
      const subsByUser = new Map((subsRes.data ?? []).map((s) => [s.user_id, s]));
      const statsByUser = new Map((statsRes.data ?? []).map((s) => [s.user_id, s]));
      const merged = (profilesRes.data ?? []).map((p) => {
        const sub = subsByUser.get(p.user_id);
        const stats = statsByUser.get(p.user_id);
        return {
          user_id: p.user_id,
          pseudo: p.pseudo,
          created_at: p.created_at,
          palier: paletteForSub(sub),
          plan: sub?.plan ?? null,
          status: sub?.status ?? "none",
          current_period_end: sub?.current_period_end ?? null,
          class_access_level: sub?.class_access_level ?? null,
          login_count: stats?.login_count ?? 0,
          last_login_at: stats?.last_login_at ?? null,
        };
      });
      merged.sort((a, b) => (b.login_count ?? 0) - (a.login_count ?? 0));
      setRows(merged);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    if (!rows) return null;
    return rows.reduce(
      (acc, r) => {
        acc.total += 1;
        acc[r.palier] = (acc[r.palier] ?? 0) + 1;
        return acc;
      },
      { total: 0 }
    );
  }, [rows]);

  return (
    <div className="rounded-3xl p-5 flex flex-col gap-3" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
      <p style={{ fontFamily: fonts.display, fontSize: "1rem", fontWeight: 700, color: colors.ink }}>
        Utilisateurs
      </p>

      {error && (
        <p className="text-xs" style={{ color: colors.red }}>
          {error}
        </p>
      )}

      {!rows && !error && (
        <p className="text-xs" style={{ color: colors.slate }}>
          Chargement…
        </p>
      )}

      {counts && (
        <p className="text-xs" style={{ color: colors.slate }}>
          {counts.total} compte(s) —{" "}
          {Object.entries(counts)
            .filter(([key]) => key !== "total")
            .map(([key, n]) => `${n} ${key.toLowerCase()}`)
            .join(", ")}
          .
        </p>
      )}

      {rows && rows.length > 0 && (
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-xs" style={{ color: colors.ink }}>
            <thead>
              <tr style={{ color: colors.slate }}>
                <th className="text-left font-medium px-5 py-1.5">Pseudo</th>
                <th className="text-left font-medium px-2 py-1.5">Palier</th>
                <th className="text-left font-medium px-2 py-1.5">Connexions</th>
                <th className="text-left font-medium px-2 py-1.5">Dernière connexion</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.user_id} style={{ borderTop: `1px solid ${colors.hairline ?? colors.ink + "14"}` }}>
                  <td className="px-5 py-1.5">{r.pseudo}</td>
                  <td className="px-2 py-1.5">{r.palier}</td>
                  <td className="px-2 py-1.5">{r.login_count}</td>
                  <td className="px-2 py-1.5">
                    {r.last_login_at ? new Date(r.last_login_at).toLocaleString("fr-FR") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows && rows.length === 0 && (
        <p className="text-xs" style={{ color: colors.slate }}>
          Aucun compte pour l'instant.
        </p>
      )}
    </div>
  );
}
