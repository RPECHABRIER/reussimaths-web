import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isRealAdmin, EXAM_CHAPTER_BY_LEVEL } from "../lib/access";
import { getAdminPreview, setAdminPreview } from "../lib/adminPreview";
import { supabase } from "../lib/supabaseClient";
import { chapters } from "../chapters/registry";
import { LEVELS } from "../levels";
import { colors, fonts, shadow } from "../theme";
import { authenticatedFetch } from "../lib/api";
import { ArrowRight, BookOpenCheck, Eye, KeyRound, ShieldCheck, Sparkles, Users } from "lucide-react";

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
      <div className="max-w-6xl mx-auto flex flex-col gap-7">
        <div className="rounded-[2rem] p-6 sm:p-8 relative overflow-hidden" style={{ backgroundColor: colors.ink, boxShadow: shadow.raised }}>
          <div className="absolute rounded-full" style={{ width: 260, height: 260, right: -80, top: -130, backgroundColor: `${colors.gold}24` }} />
          <Link to="/compte" className="text-sm font-medium" style={{ color: colors.ink }}>
            <span style={{ color: "rgba(255,255,255,.72)" }}>← Mon compte</span>
          </Link>
          <div className="relative mt-7 flex items-start justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-bold" style={{ color: colors.gold }}>Pilotage sécurisé</p>
          <h1
                className="mt-2"
                style={{ fontFamily: fonts.display, color: "#fff", fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 900, letterSpacing: "-0.04em" }}
          >
            Panneau admin
          </h1>
              <p className="text-sm mt-3 max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,.68)" }}>Prévisualise chaque offre, accorde les accès exceptionnels et suis l’adoption depuis un espace réservé à l’administration.</p>
            </div>
            <div className="hidden sm:flex items-center justify-center rounded-2xl shrink-0" style={{ width: 58, height: 58, backgroundColor: `${colors.gold}20`, border: `1px solid ${colors.gold}45` }}><ShieldCheck size={27} color={colors.gold} /></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 items-start">
          <Link to="/admin/corrections" className="lg:col-span-2 rounded-[1.5rem] p-4 sm:p-5 flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5" style={{ backgroundColor: `${colors.gold}12`, border: `1px solid ${colors.gold}45`, color: colors.ink }}>
            <span className="flex items-center gap-3 min-w-0">
              <span className="rounded-xl flex items-center justify-center shrink-0" style={{ width: 40, height: 40, backgroundColor: colors.card }}><BookOpenCheck size={19} color={colors.gold} /></span>
              <span className="min-w-0"><strong className="block text-sm">Laboratoire des corrections</strong><span className="block text-xs mt-0.5" style={{ color: colors.slate }}>Contrôler les explications pédagogiques sur ordinateur et mobile.</span></span>
            </span>
            <ArrowRight size={18} className="shrink-0" />
          </Link>
          <PreviewSwitcher />
          <GrantAccessTool />
          <div className="lg:col-span-2"><ClassInvitationsTool /></div>
          <div className="lg:col-span-2"><ProductMetrics /></div>
          <div className="lg:col-span-2"><SubscribersDashboard /></div>
        </div>
      </div>
    </div>
  );
}

function ProductMetrics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const since = new Date(Date.now() - 31 * 86400000).toISOString();
    Promise.all([
      supabase.from("product_events").select("event_name, anonymous_id, occurred_at").gte("occurred_at", since).order("occurred_at"),
      supabase.from("pilot_feedback").select("role, usefulness, ease, would_recommend, comment, created_at").order("created_at", { ascending: false }).limit(20),
      supabase.from("subscriptions").select("plan, status, admin_granted, current_period_end"),
      supabase.from("learning_attempts").select("skill_id,chapter_id,error_code").not("error_code", "is", null).gte("attempted_at", since),
      supabase.from("learning_review_cards").select("payload,reviewed_at").gte("reviewed_at", since),
    ]).then(([eventsResult, feedbackResult, subscriptionsResult, attemptsResult, reviewsResult]) => {
      const reviewsError = reviewsResult.error?.code === "42P01" ? null : reviewsResult.error;
      const firstError = eventsResult.error || feedbackResult.error || subscriptionsResult.error || attemptsResult.error || reviewsError;
      if (firstError) { setError(firstError.message); return; }
      const events = eventsResult.data ?? [];
      const uniqueByEvent = (name) => new Set(events.filter((item) => item.event_name === name).map((item) => item.anonymous_id)).size;
      const firstSeen = new Map(); const daysSeen = new Map();
      events.forEach((item) => {
        const day = item.occurred_at.slice(0, 10);
        if (!firstSeen.has(item.anonymous_id)) firstSeen.set(item.anonymous_id, day);
        if (!daysSeen.has(item.anonymous_id)) daysSeen.set(item.anonymous_id, new Set());
        daysSeen.get(item.anonymous_id).add(day);
      });
      const retention = (target) => {
        let eligible = 0; let retained = 0;
        for (const [id, first] of firstSeen) {
          const age = Math.floor((Date.now() - new Date(`${first}T00:00:00`).getTime()) / 86400000);
          if (age < target) continue;
          eligible += 1;
          const targetTime = new Date(`${first}T00:00:00`).getTime() + target * 86400000;
          if ([...daysSeen.get(id)].some((day) => Math.abs(new Date(`${day}T00:00:00`).getTime() - targetTime) <= 86400000)) retained += 1;
        }
        return eligible ? Math.round(retained / eligible * 100) : null;
      };
      const paid = (subscriptionsResult.data ?? []).filter((item) => item.plan === "mensuel" && !item.admin_granted && ["active", "trialing"].includes(item.status));
      const errorCounts = (attemptsResult.data ?? []).reduce((map, item) => map.set(item.error_code, (map.get(item.error_code) ?? 0) + 1), new Map());
      const fragileSkills = (attemptsResult.data ?? []).reduce((map, item) => map.set(item.skill_id, (map.get(item.skill_id) ?? 0) + 1), new Map());
      const reviewFamilies = (reviewsResult.data ?? []).reduce((map, item) => {
        const family = item.payload?.family ?? "méthode générale";
        map.set(family, (map.get(family) ?? 0) + 1);
        return map;
      }, new Map());
      setData({
        funnel: [
          ["Visiteurs", uniqueByEvent("page_view")], ["Diagnostics", uniqueByEvent("diagnostic_completed")],
          ["Essais terminés", uniqueByEvent("trial_completed")], ["Checkout", uniqueByEvent("checkout_started")],
          ["Paiements activés", uniqueByEvent("payment_activated")],
        ],
        retention7: retention(7), retention30: retention(30), mrr: paid.length * 4.99,
        feedback: feedbackResult.data ?? [],
        errorTypes: [...errorCounts.entries()].sort((a,b) => b[1] - a[1]).slice(0,5),
        fragileSkills: [...fragileSkills.entries()].sort((a,b) => b[1] - a[1]).slice(0,5),
        reviewFamilies: [...reviewFamilies.entries()].sort((a,b) => b[1] - a[1]).slice(0,5),
        reviewCount: reviewsResult.data?.length ?? 0,
      });
    });
  }, []);
  const average = (key) => data?.feedback.length ? (data.feedback.reduce((sum, item) => sum + item[key], 0) / data.feedback.length).toFixed(1) : "—";
  return <div className="rounded-[1.75rem] p-5 sm:p-6" style={{ backgroundColor: colors.card, boxShadow: shadow.soft, border: `1px solid ${colors.hairline}` }}><div className="flex items-center gap-3"><Users size={19} color={colors.gold} /><div><p className="font-black" style={{ color: colors.ink }}>Conversion et valeur produit</p><p className="text-xs" style={{ color: colors.slate }}>30 derniers jours · visiteurs pseudonymes uniques</p></div></div>
    {error && <p className="text-xs mt-4" style={{ color: colors.red }}>{error}</p>}
    {!data && !error && <p className="text-xs mt-4" style={{ color: colors.slate }}>Chargement…</p>}
    {data && <><div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-5">{data.funnel.map(([label,value], index) => { const previous = data.funnel[index - 1]?.[1]; const rate = index > 0 && previous ? Math.round(value / previous * 100) : null; return <div key={label} className="rounded-2xl p-3" style={{ backgroundColor: colors.bg }}><p className="text-xl font-black" style={{ color: colors.ink }}>{value}</p><p className="text-[10px]" style={{ color: colors.slate }}>{label}{rate != null ? ` · ${rate} % de l’étape précédente` : ""}</p></div>; })}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">{[["Rétention J+7",data.retention7 == null ? "—" : `${data.retention7} %`],["Rétention J+30",data.retention30 == null ? "—" : `${data.retention30} %`],["MRR estimé",`${data.mrr.toFixed(2)} €`],["Retours pilote",data.feedback.length]].map(([label,value]) => <div key={label} className="rounded-2xl p-3" style={{ backgroundColor:`${colors.gold}0d` }}><p className="font-black" style={{ color: colors.ink }}>{value}</p><p className="text-[10px]" style={{ color: colors.slate }}>{label}</p></div>)}</div>
      <p className="text-xs mt-4" style={{ color: colors.slate }}>Retours : utilité {average("usefulness")}/5 · simplicité {average("ease")}/5 · recommandation {data.feedback.length ? Math.round(data.feedback.filter((item) => item.would_recommend).length / data.feedback.length * 100) : 0} %</p>
      {data.errorTypes.length > 0 && <p className="text-xs mt-2" style={{ color: colors.slate }}>Erreurs fréquentes : {data.errorTypes.map(([name,count]) => `${name} (${count})`).join(" · ")}</p>}
      <div className="grid md:grid-cols-3 gap-2 mt-3">
        <div className="rounded-2xl p-3" style={{backgroundColor:colors.bg}}><p className="text-lg font-black" style={{color:colors.ink}}>{data.reviewCount}</p><p className="text-[10px]" style={{color:colors.slate}}>fiches pédagogiques revues</p></div>
        <div className="rounded-2xl p-3 md:col-span-2" style={{backgroundColor:colors.bg}}><p className="text-[10px] font-black uppercase tracking-wide" style={{color:colors.gold}}>Notions déclenchant le plus d’erreurs</p><p className="text-xs mt-1" style={{color:colors.slate}}>{data.fragileSkills.length ? data.fragileSkills.map(([name,count])=>`${name} (${count})`).join(" · ") : "Pas encore assez de données."}</p></div>
      </div>
      {data.reviewFamilies.length > 0 && <p className="text-xs mt-2" style={{color:colors.slate}}>Corrections les plus consultées : {data.reviewFamilies.map(([name,count])=>`${name} (${count})`).join(" · ")}</p>}
      <div className="flex flex-col gap-2 mt-3">{data.feedback.filter((item) => item.comment).slice(0,5).map((item,index) => <div key={`${item.created_at}-${index}`} className="rounded-xl p-3 text-xs" style={{ backgroundColor: colors.bg, color: colors.ink }}><strong>{item.role}</strong> — {item.comment}</div>)}</div></>}
  </div>;
}

// Codes d'invitation exceptionnels : cet outil n'est rendu que dans la page
// admin et l'API vérifie à nouveau l'adresse de l'administrateur côté serveur.
function ClassInvitationsTool() {
  const [level, setLevel] = useState("sixieme");
  const [label, setLabel] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState(35);
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [codes, setCodes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadCodes = async () => {
    try {
      const response = await authenticatedFetch("/api/admin-class-codes");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Impossible de charger les invitations.");
      setCodes(data.codes ?? []);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => { loadCodes(); }, []);

  const createCode = async () => {
    setLoading(true); setError(null); setMessage(null);
    try {
      const response = await authenticatedFetch("/api/admin-class-codes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", level, label, maxRedemptions, expiresInDays }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Impossible de créer l'invitation.");
      setMessage(`Invitation créée : ${data.code}`); setLabel(""); await loadCodes();
    } catch (createError) { setError(createError.message); }
    finally { setLoading(false); }
  };

  const deactivate = async (code) => {
    if (!window.confirm(`Désactiver le code ${code} ?`)) return;
    setLoading(true); setError(null);
    try {
      const response = await authenticatedFetch("/api/admin-class-codes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deactivate", code }),
      });
      if (!response.ok) throw new Error("Impossible de désactiver l'invitation.");
      await loadCodes();
    } catch (deactivateError) { setError(deactivateError.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="rounded-[1.75rem] p-5 sm:p-6 flex flex-col gap-4" style={{ backgroundColor: colors.card, boxShadow: shadow.soft, border: `1px solid ${colors.hairline}` }}>
      <div className="flex items-start gap-3"><div className="rounded-xl flex items-center justify-center shrink-0" style={{ width: 40, height: 40, backgroundColor: `${colors.gold}18` }}><KeyRound size={19} color={colors.gold} /></div><div><p style={{ fontFamily: fonts.display, fontSize: "1.05rem", fontWeight: 800, color: colors.ink }}>Invitations classe</p><p className="text-xs mt-1" style={{ color: colors.slate }}>Accès exceptionnels créés uniquement par l’administration, invisibles dans l’espace enseignant public.</p></div></div>
      <select value={level} onChange={(event) => setLevel(event.target.value)} className="text-xs rounded-lg px-2.5 py-2" style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.bg }}>
        {LEVELS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <input value={label} onChange={(event) => setLabel(event.target.value)} maxLength={100} placeholder="Classe ou destinataire" className="text-xs rounded-lg px-2.5 py-2" style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.bg }} />
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs" style={{ color: colors.slate }}>Utilisateurs maximum<input type="number" min="1" max="500" value={maxRedemptions} onChange={(event) => setMaxRedemptions(Number(event.target.value))} className="mt-1 w-full rounded-lg px-2.5 py-2" style={{ border: `1px solid ${colors.ink}22`, color: colors.ink }} /></label>
        <label className="text-xs" style={{ color: colors.slate }}>Durée choisie (jours)<input type="number" min="1" max="365" value={expiresInDays} onChange={(event) => setExpiresInDays(Number(event.target.value))} className="mt-1 w-full rounded-lg px-2.5 py-2" style={{ border: `1px solid ${colors.ink}22`, color: colors.ink }} /></label>
      </div>
      <button onClick={createCode} disabled={loading} className="py-2.5 rounded-full font-semibold text-xs" style={{ backgroundColor: colors.gold, color: colors.ink, opacity: loading ? 0.6 : 1 }}>{loading ? "Traitement…" : "Créer une invitation"}</button>
      {message && <p className="text-xs font-semibold" style={{ color: colors.green }}>{message}</p>}
      {error && <p role="alert" className="text-xs font-semibold" style={{ color: colors.red }}>{error}</p>}
      {codes?.map((item) => {
        const expired = item.expires_at && new Date(item.expires_at) <= new Date();
        return <div key={item.code} className="rounded-2xl p-3 flex items-start justify-between gap-3" style={{ backgroundColor: colors.bg, opacity: item.active && !expired ? 1 : 0.55 }}><div><p className="text-sm font-bold" style={{ color: colors.ink, fontFamily: fonts.mono }}>{item.code}</p><p className="text-xs" style={{ color: colors.slate }}>{item.label || "Sans libellé"} · {item.redemption_count}/{item.max_redemptions ?? "∞"}</p></div><div className="flex flex-col items-end gap-1"><button onClick={() => navigator.clipboard.writeText(item.code)} className="text-xs font-semibold" style={{ color: colors.gold }}>Copier</button>{item.active && !expired && <button onClick={() => deactivate(item.code)} className="text-xs" style={{ color: colors.red }}>Désactiver</button>}</div></div>;
      })}
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
      const res = await authenticatedFetch("/api/admin-grant-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: email.trim(), action }),
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
    <div className="rounded-[1.75rem] p-5 sm:p-6 flex flex-col gap-3 h-full" style={{ backgroundColor: colors.card, boxShadow: shadow.soft, border: `1px solid ${colors.hairline}` }}>
      <div className="flex items-center gap-3"><div className="rounded-xl flex items-center justify-center" style={{ width: 40, height: 40, backgroundColor: `${colors.green}16` }}><Sparkles size={19} color={colors.green} /></div><p style={{ fontFamily: fonts.display, fontSize: "1.05rem", fontWeight: 800, color: colors.ink }}>Offrir un accès complet</p></div>
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
    <div className="rounded-[1.75rem] p-5 sm:p-6 flex flex-col gap-3 h-full" style={{ backgroundColor: colors.card, boxShadow: shadow.soft, border: `1px solid ${colors.hairline}` }}>
      <div className="flex items-center gap-3"><div className="rounded-xl flex items-center justify-center" style={{ width: 40, height: 40, backgroundColor: `${colors.gold}18` }}><Eye size={19} color={colors.gold} /></div><p style={{ fontFamily: fonts.display, fontSize: "1.05rem", fontWeight: 800, color: colors.ink }}>Prévisualiser une offre</p></div>
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
  if (sub?.class_access_level && sub?.class_access_expires_at && new Date(sub.class_access_expires_at) > new Date()) {
    const levelLabel = LEVELS.find((item) => item.id === sub.class_access_level)?.label ?? sub.class_access_level;
    return `Invitation classe (${levelLabel})`;
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
      supabase.from("subscriptions").select("user_id, plan, status, current_period_end, class_access_level, class_access_expires_at, admin_granted"),
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
          class_access_expires_at: sub?.class_access_expires_at ?? null,
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
    <div className="rounded-[1.75rem] p-5 sm:p-6 flex flex-col gap-4" style={{ backgroundColor: colors.card, boxShadow: shadow.soft, border: `1px solid ${colors.hairline}` }}>
      <div className="flex items-center gap-3"><div className="rounded-xl flex items-center justify-center" style={{ width: 40, height: 40, backgroundColor: `${colors.ink}0c` }}><Users size={19} color={colors.ink} /></div><div><p style={{ fontFamily: fonts.display, fontSize: "1.05rem", fontWeight: 800, color: colors.ink }}>Utilisateurs</p><p className="text-xs mt-0.5" style={{ color: colors.slate }}>Adoption, accès et activité récente.</p></div></div>

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
