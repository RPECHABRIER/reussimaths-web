import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Check, ArrowRight, ShieldCheck, Target, RotateCcw, Sparkles, Mail, BookOpenCheck } from "lucide-react";
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
  isClassAccessSubscription,
  getEffectiveSubscription,
  EXAM_CHAPTER_BY_LEVEL,
} from "../lib/access";
import { getAdminPreview } from "../lib/adminPreview";
import { supabase } from "../lib/supabaseClient";
import PackExamenChoice from "../components/PackExamenChoice";
import ReferralBonusChoice from "../components/ReferralBonusChoice";
import ReviserCard from "../components/ReviserCard";
import Mascot from "../components/Mascot";
import { getChapter } from "../chapters/registry";
import { LEVELS } from "../levels";
import { colors, fonts, shadow } from "../theme";
import { authenticatedFetch } from "../lib/api";
import LoadError from "../components/LoadError";
import { markSignupStarted, trackProductEvent } from "../lib/productAnalytics";
import AppHeader from "../components/AppHeader";

const TERMS_VERSION = "2026-08-13";
// Apple demande un compte Developer, un Services ID et un secret renouvelé
// tous les six mois. Le bouton reste donc masqué tant que l'intégration n'est
// pas volontairement réactivée dans les variables publiques Vercel.
const APPLE_AUTH_ENABLED = import.meta.env.VITE_APPLE_AUTH_ENABLED === "true";

// Note : la redirection vers /pseudo pour un utilisateur sans profil est
// gérée globalement dans App.jsx (fonctionne quelle que soit la page
// d'arrivée après connexion, pas seulement /compte).
export default function Account() {
  const { user, loading, passwordRecovery, signInWithGoogle, signInWithApple, signUpWithEmail, signInWithEmail, sendPasswordReset, updatePassword, signOut } = useAuth();
  const {
    subscription: rawSubscription,
    loading: subscriptionLoading,
    error: subscriptionError,
    reload: reloadSubscription,
  } = useSubscription(user?.id);
  const subscription = getEffectiveSubscription(user, rawSubscription);
  const { profile } = useProfile(user?.id);
  const { count: referralCount } = useReferrals(user?.id);
  const { chapterId: referralBonusChapterId, reload: reloadReferralBonus } = useReferralBonus(user?.id);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [showInvitationCodeForm, setShowInvitationCodeForm] = useState(false);
  const [invitationCode, setInvitationCode] = useState("");
  const [invitationCodeLoading, setInvitationCodeLoading] = useState(false);
  const [invitationCodeError, setInvitationCodeError] = useState(null);
  const [acceptImmediateAccess, setAcceptImmediateAccess] = useState(false);
  const [checkoutReturn, setCheckoutReturn] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [emailMode, setEmailMode] = useState("signup");
  const [emailAddress, setEmailAddress] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailAuthLoading, setEmailAuthLoading] = useState(false);
  const [emailAuthMessage, setEmailAuthMessage] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState(null);
  const [subscriptionRepairing, setSubscriptionRepairing] = useState(false);
  const [monthlyLevel, setMonthlyLevel] = useState("");
  const [levelChangeLoading, setLevelChangeLoading] = useState(false);
  const [levelChangeMessage, setLevelChangeMessage] = useState(null);
  const subscriptionRepairAttempted = useRef(false);

  const admin = isAdminUser(user);
  const fullAccess = isFullAccessSubscription(subscription);
  const packExamen = isPackExamenSubscription(subscription);
  const classAccess = isClassAccessSubscription(subscription);
  const classAccessLevelLabel = classAccess
    ? LEVELS.find((l) => l.id === subscription.class_access_level)?.label ?? subscription.class_access_level
    : null;
  const packExamenNeedsChoice = packExamen && !subscription?.pack_examen_level;
  const monthlyLevelLabel = fullAccess
    ? LEVELS.find((level) => level.id === subscription?.subscription_level)?.label ?? null
    : null;
  // isActive recalculé sur la subscription EFFECTIVE (donc cohérent avec une
  // préviz admin en cours) plutôt que de reprendre isActive du hook, qui
  // porte toujours sur la vraie ligne en base.
  const isActive = fullAccess || packExamen;
  const previewing = isRealAdmin(user) && !!getAdminPreview()?.mode && getAdminPreview()?.mode !== "admin";

  useEffect(() => { trackProductEvent("offer_viewed", { authenticated: !!user }); }, []);

  useEffect(() => {
    if (!user || subscriptionLoading || subscriptionError || rawSubscription || subscriptionRepairing || subscriptionRepairAttempted.current) return;
    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);
    subscriptionRepairAttempted.current = true;
    setSubscriptionRepairing(true);
    authenticatedFetch("/api/checkout-status?reconcile=1", { signal: controller.signal })
      .then((response) => response.json().then((data) => ({ response, data })))
      .then(({ response, data }) => {
        if (!cancelled && response.ok && data.activated) reloadSubscription();
      })
      .catch(() => {})
      .finally(() => {
        window.clearTimeout(timeoutId);
        if (!cancelled) setSubscriptionRepairing(false);
      });
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  // Ne pas dépendre de `subscriptionRepairing` ici : le passage à `true`
  // relancerait l'effet, exécuterait son cleanup et empêcherait le `finally`
  // de remettre l'état à `false`. La page resterait alors indéfiniment sur
  // « Abonnement : vérification… » pour un compte sans abonnement.
  }, [user?.id, subscriptionLoading, subscriptionError, rawSubscription, reloadSubscription]);

  const referralLink = profile?.referral_code
    ? `${window.location.origin}/?ref=${profile.referral_code}`
    : null;

  const startCheckout = async (plan) => {
    if (!acceptImmediateAccess) {
      setCheckoutError("Confirme d’abord la demande d’accès immédiat et l’acceptation des CGU.");
      return;
    }
    if (plan === "mensuel" && !monthlyLevel) {
      setCheckoutError("Choisis d’abord le niveau scolaire de l’élève.");
      return;
    }
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const purchaseAttemptId = crypto.randomUUID();
      trackProductEvent("checkout_started", { plan });
      const res = await authenticatedFetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, level: plan === "mensuel" ? monthlyLevel : undefined, purchaseAttemptId, termsVersion: TERMS_VERSION, immediateAccessAccepted: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Impossible d'ouvrir le paiement.");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleMonthlyLevelChange = async (event) => {
    const nextLevel = event.target.value;
    if (!nextLevel || nextLevel === subscription?.subscription_level) return;
    setLevelChangeLoading(true);
    setLevelChangeMessage(null);
    try {
      const { error } = await supabase.rpc("change_monthly_subscription_level", { p_level: nextLevel });
      if (error) throw error;
      await reloadSubscription();
      setLevelChangeMessage({ type: "success", text: "Le niveau actif a bien été modifié." });
    } catch (error) {
      const limited = /30 jours/i.test(error?.message ?? "");
      setLevelChangeMessage({ type: "error", text: limited ? "Le niveau ne peut être changé qu’une fois tous les 30 jours après la période de correction initiale." : "Impossible de modifier le niveau pour le moment." });
    } finally {
      setLevelChangeLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    const sessionId = params.get("session_id");
    if (checkout === "cancel") {
      setCheckoutReturn({ type: "cancel", message: "Paiement interrompu : rien n’a été débité et aucun accès n’a été créé." });
      trackProductEvent("checkout_returned", { result: "cancel" });
      return;
    }
    if (checkout !== "success" || !sessionId) return;
    let cancelled = false;
    setCheckoutReturn({ type: "pending", message: "Paiement reçu. Nous activons ton accès…" });
    trackProductEvent("checkout_returned", { result: "success" });
    const verify = async () => {
      for (let attempt = 0; attempt < 8 && !cancelled; attempt += 1) {
        try {
          const response = await authenticatedFetch(`/api/checkout-status?session_id=${encodeURIComponent(sessionId)}`);
          const data = await response.json();
          if (response.ok && data.activated) {
            reloadSubscription();
            setCheckoutReturn({ type: "success", message: "Ton accès est actif. Tu peux commencer ta première séance." });
            trackProductEvent("payment_activated", { plan: data.plan });
            window.history.replaceState({}, "", "/compte");
            return;
          }
        } catch {
          // nouvelle tentative : le webhook peut arriver quelques secondes après Checkout
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      if (!cancelled) setCheckoutReturn({ type: "pending", message: "Le paiement est confirmé, mais l’activation prend plus de temps que prévu. Recharge cette page dans un instant ; aucun nouveau paiement n’est nécessaire." });
    };
    verify();
    return () => { cancelled = true; };
  }, [user?.id, reloadSubscription]);

  const openCustomerPortal = async () => {
    setPortalLoading(true);
    setCancelError(null);
    try {
      const response = await authenticatedFetch("/api/create-customer-portal", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossible d'ouvrir l'espace de facturation.");
      trackProductEvent("portal_opened");
      window.location.href = data.url;
    } catch (error) {
      setCancelError(error.message);
      setPortalLoading(false);
    }
  };

  // Résiliation en libre-service (voir api/cancel-subscription.js) : ne
  // concerne que le plan "mensuel", laisse l'accès actif jusqu'à la fin de
  // la période déjà payée (cancel_at_period_end côté Stripe, pas une
  // annulation immédiate).
  const handleCancelAction = async (action) => {
    setCancelLoading(true);
    setCancelError(null);
    try {
      const res = await authenticatedFetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
      setConfirmingCancel(false);
      reloadSubscription();
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleRedeemInvitationCode = async (event) => {
    event.preventDefault();
    setInvitationCodeLoading(true);
    setInvitationCodeError(null);
    try {
      const { error } = await supabase.rpc("redeem_class_access_code", { p_code: invitationCode.trim() });
      if (error) throw error;
      setInvitationCode("");
      setShowInvitationCodeForm(false);
      reloadSubscription();
    } catch {
      setInvitationCodeError("Code invalide, expiré ou arrivé à sa limite d'utilisateurs.");
    } finally {
      setInvitationCodeLoading(false);
    }
  };

  const handleEmailAuth = async (event) => {
    event.preventDefault();
    const email = emailAddress.trim().toLowerCase();
    setEmailAuthMessage(null);
    if (!email || emailPassword.length < 8) {
      setEmailAuthMessage({ type: "error", text: "Saisis une adresse e-mail valide et un mot de passe d’au moins 8 caractères." });
      return;
    }
    setEmailAuthLoading(true);
    try {
      if (emailMode === "signup") {
        markSignupStarted("email");
        const { data, error } = await signUpWithEmail(email, emailPassword);
        if (error) throw error;
        if (!data.session) {
          setEmailPassword("");
          setEmailAuthMessage({ type: "success", text: "Compte créé. Consulte ta boîte e-mail pour confirmer ton adresse, puis reviens te connecter." });
        }
      } else {
        const { error } = await signInWithEmail(email, emailPassword);
        if (error) throw error;
      }
    } catch (authError) {
      const knownMessage = authError.message?.toLowerCase().includes("invalid login")
        ? "Adresse e-mail ou mot de passe incorrect."
        : authError.message?.toLowerCase().includes("already registered")
          ? "Un compte existe déjà avec cette adresse. Choisis « Se connecter » ci-dessous."
          : "Impossible de poursuivre pour le moment. Vérifie les informations puis réessaie.";
      setEmailAuthMessage({ type: "error", text: knownMessage });
    } finally {
      setEmailAuthLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = emailAddress.trim().toLowerCase();
    setEmailAuthMessage(null);
    if (!email) {
      setEmailAuthMessage({ type: "error", text: "Saisis d’abord ton adresse e-mail." });
      return;
    }
    setEmailAuthLoading(true);
    const { error } = await sendPasswordReset(email);
    setEmailAuthLoading(false);
    setEmailAuthMessage(error
      ? { type: "error", text: "Impossible d’envoyer le lien pour le moment. Réessaie dans quelques instants." }
      : { type: "success", text: "Si un compte correspond à cette adresse, un lien de réinitialisation vient d’être envoyé." });
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    setPasswordUpdateMessage(null);
    if (newPassword.length < 8) {
      setPasswordUpdateMessage({ type: "error", text: "Le nouveau mot de passe doit contenir au moins 8 caractères." });
      return;
    }
    setPasswordUpdateLoading(true);
    const { error } = await updatePassword(newPassword);
    setPasswordUpdateLoading(false);
    if (error) {
      setPasswordUpdateMessage({ type: "error", text: "Le mot de passe n’a pas pu être modifié. Demande un nouveau lien." });
      return;
    }
    setNewPassword("");
    setPasswordUpdateMessage({ type: "success", text: "Ton mot de passe a été modifié." });
    window.history.replaceState({}, "", "/compte");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg, color: colors.slate }}>
        Chargement…
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-6xl mx-auto">
      <AppHeader account={false} />

      {!user ? (
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-14 items-center py-10 lg:py-20">
          <section>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${colors.gold}18`, color: colors.gold }}>
              <Sparkles size={13} /> Un parcours clair, pas des exercices au hasard
            </div>
            <h1 className="mt-5" style={{ fontFamily: fonts.display, fontWeight: 900, color: colors.ink, fontSize: "clamp(2.35rem, 5vw, 4rem)", lineHeight: 1.04, letterSpacing: "-0.04em" }}>
              Des progrès visibles, semaine après semaine.
            </h1>
            <p className="text-base sm:text-lg mt-5 max-w-xl leading-relaxed" style={{ color: colors.slate }}>
              RéussiMaths repère les notions fragiles, propose la bonne série et programme les révisions. L’élève sait quoi faire ; le parent sait ce qui avance.
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-7">
              {[
                { icon: Target, title: "Ciblé", text: "Selon le niveau réel" },
                { icon: RotateCcw, title: "Mémorisé", text: "Révisions au bon moment" },
                { icon: BarChart3, title: "Mesuré", text: "Bilan de progression" },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl p-3 sm:p-4" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
                  <Icon size={18} color={colors.gold} />
                  <p className="text-sm font-black mt-2" style={{ color: colors.ink }}>{title}</p>
                  <p className="text-[10px] sm:text-xs mt-0.5 leading-snug" style={{ color: colors.slate }}>{text}</p>
                </div>
              ))}
            </div>
            <Link to="/niveaux?objectif=essai" className="inline-flex items-center gap-2 mt-6 text-sm font-bold" style={{ color: colors.ink }}>
              Essayer à son niveau avant de choisir <ArrowRight size={15} />
            </Link>
          </section>

          <section className="rounded-[2rem] p-5 sm:p-7" style={{ backgroundColor: colors.card, boxShadow: shadow.raised, border: `1px solid ${colors.hairline}` }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold" style={{ color: colors.gold }}>Un niveau complet</p>
                <p className="text-3xl font-black mt-1" style={{ color: colors.ink }}>4,99 € <span className="text-sm font-semibold" style={{ color: colors.slate }}>/ mois</span></p>
              </div>
              <Mascot size={62} />
            </div>
            <div className="flex flex-col gap-2.5 mt-5">
              {["Un niveau scolaire choisi pour chaque élève", "Entraînement et corrections détaillées illimités", "Révisions espacées et bilan hebdomadaire", "Résiliation à tout moment depuis le compte"].map((feature) => (
                <p key={feature} className="flex items-start gap-2 text-sm" style={{ color: colors.ink }}><Check size={16} color={colors.green} className="shrink-0 mt-0.5" />{feature}</p>
              ))}
            </div>
            <div className="rounded-2xl p-4 mt-6" style={{ backgroundColor: colors.bg }}>
              <p className="text-xs font-bold" style={{ color: colors.ink }}>Crée d’abord ton espace personnel</p>
              <p className="text-xs mt-1" style={{ color: colors.slate }}>La connexion sauvegarde la progression et rattache l’abonnement au bon élève.</p>
              <div className={`grid ${APPLE_AUTH_ENABLED ? "sm:grid-cols-2" : "grid-cols-1"} gap-2 mt-3`}>
                <button onClick={() => { markSignupStarted("google"); signInWithGoogle(); }} className="py-3 rounded-full text-sm font-bold" style={{ backgroundColor: colors.ink, color: colors.bg }}>Avec Google</button>
                {APPLE_AUTH_ENABLED && <button onClick={() => { markSignupStarted("apple"); signInWithApple(); }} className="py-3 rounded-full text-sm font-bold" style={{ backgroundColor: colors.ink, color: colors.bg }}>Avec Apple</button>}
              </div>
              <div className="flex items-center gap-3 my-4"><span className="h-px flex-1" style={{ backgroundColor: colors.hairline }} /><span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: colors.slate }}>ou par e-mail</span><span className="h-px flex-1" style={{ backgroundColor: colors.hairline }} /></div>
              <form onSubmit={handleEmailAuth} className="flex flex-col gap-2.5">
                <label className="text-[11px] font-bold" style={{ color: colors.ink }} htmlFor="account-email">Adresse e-mail</label>
                <input id="account-email" type="email" required autoComplete="email" value={emailAddress} onChange={(event) => setEmailAddress(event.target.value)} placeholder="prenom@exemple.fr" className="rounded-xl px-3 py-2.5 text-sm" style={{ color: colors.ink, backgroundColor: colors.card, border: `1px solid ${colors.hairline}` }} />
                <label className="text-[11px] font-bold" style={{ color: colors.ink }} htmlFor="account-password">Mot de passe</label>
                <input id="account-password" type="password" required minLength={8} autoComplete={emailMode === "signup" ? "new-password" : "current-password"} value={emailPassword} onChange={(event) => setEmailPassword(event.target.value)} placeholder="8 caractères minimum" className="rounded-xl px-3 py-2.5 text-sm" style={{ color: colors.ink, backgroundColor: colors.card, border: `1px solid ${colors.hairline}` }} />
                <button type="submit" disabled={emailAuthLoading} className="inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold" style={{ backgroundColor: colors.gold, color: colors.ink, opacity: emailAuthLoading ? 0.65 : 1 }}><Mail size={15} />{emailAuthLoading ? "Patiente…" : emailMode === "signup" ? "Créer mon compte avec mon e-mail" : "Se connecter avec mon e-mail"}</button>
                {emailAuthMessage && <p role="status" className="text-xs leading-relaxed" style={{ color: emailAuthMessage.type === "error" ? colors.red : colors.green }}>{emailAuthMessage.text}</p>}
                <button type="button" onClick={() => { setEmailMode((mode) => mode === "signup" ? "signin" : "signup"); setEmailAuthMessage(null); }} className="text-xs font-semibold underline" style={{ color: colors.slate }}>{emailMode === "signup" ? "J’ai déjà un compte : me connecter" : "Je n’ai pas encore de compte : m’inscrire"}</button>
                {emailMode === "signin" && <button type="button" disabled={emailAuthLoading} onClick={handleForgotPassword} className="text-xs font-semibold underline" style={{ color: colors.slate }}>Mot de passe oublié ?</button>}
              </form>
              <p className="flex items-center justify-center gap-1.5 text-[11px] mt-3" style={{ color: colors.slate }}><ShieldCheck size={13} color={colors.green} />L’élève choisit un pseudo ; son nom n’est pas affiché.</p>
            </div>
            <div className="flex items-baseline justify-between gap-3 mt-5 pt-4" style={{ borderTop: `1px solid ${colors.hairline}` }}>
              <div><p className="text-sm font-bold" style={{ color: colors.ink }}>Pack Examen</p><p className="text-xs" style={{ color: colors.slate }}>3 mois · un niveau · sans renouvellement</p></div>
              <p className="text-lg font-black whitespace-nowrap" style={{ color: colors.ink }}>9 €</p>
            </div>
          </section>
        </div>
      ) : (
        <div className="premium-card flex flex-col gap-4 w-full max-w-3xl mx-auto overflow-hidden text-center rounded-[2rem] p-5 sm:p-8 lg:p-10 my-5 sm:my-8" style={{ backgroundColor: colors.card }}>
          {(passwordRecovery || new URLSearchParams(window.location.search).get("recovery") === "1") && (
            <form onSubmit={handlePasswordUpdate} className="rounded-2xl p-4 text-left flex flex-col gap-3" style={{ backgroundColor: `${colors.gold}12`, border: `1px solid ${colors.gold}35` }}>
              <div><p className="text-sm font-black" style={{ color: colors.ink }}>Choisir un nouveau mot de passe</p><p className="text-xs mt-1" style={{ color: colors.slate }}>Utilise au moins 8 caractères et évite un mot de passe déjà employé ailleurs.</p></div>
              <input type="password" required minLength={8} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Nouveau mot de passe" className="rounded-xl px-3 py-2.5 text-sm" style={{ color: colors.ink, backgroundColor: colors.card, border: `1px solid ${colors.hairline}` }} />
              <button type="submit" disabled={passwordUpdateLoading} className="py-2.5 rounded-full text-sm font-bold" style={{ backgroundColor: colors.gold, color: colors.ink }}>{passwordUpdateLoading ? "Modification…" : "Enregistrer le nouveau mot de passe"}</button>
              {passwordUpdateMessage && <p role="status" className="text-xs" style={{ color: passwordUpdateMessage.type === "error" ? colors.red : colors.green }}>{passwordUpdateMessage.text}</p>}
            </form>
          )}
          <section className="page-hero -mx-5 -mt-5 mb-1 flex flex-col items-center gap-4 px-5 py-7 text-left sm:-mx-8 sm:-mt-8 sm:flex-row sm:px-8 lg:-mx-10 lg:-mt-10 lg:px-10" style={{background:`linear-gradient(135deg, ${colors.ink}, #253A66)`,color:colors.card}}>
            <Mascot size={76} className="shrink-0" style={{boxShadow:"0 12px 30px -16px rgba(0,0,0,.55)"}} />
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest" style={{background:isActive?"rgba(63,166,107,.18)":"rgba(255,255,255,.1)",color:isActive?"#78E1A4":colors.gold}}><ShieldCheck size={12}/>{subscriptionLoading?"Vérification de l’accès":subscriptionError?"Accès à vérifier":isActive?"Accès actif":"Espace gratuit"}</span>
              <h1 className="mt-2 truncate text-2xl font-black" style={{fontFamily:fonts.display}}>{profile?.pseudo ?? "Mon espace"}</h1>
              <p className="mt-1 text-xs leading-relaxed" style={{color:"rgba(255,255,255,.7)"}}>Abonnement : {admin ? "accès complet (admin)" : subscriptionLoading ? "vérification…" : subscriptionError ? "statut indisponible" : isActive ? `${subscription?.plan === "mensuel" ? "mensuel" : "Pack Examen"}${monthlyLevelLabel ? ` · ${monthlyLevelLabel}` : ""}` : "aucun"}</p>
            </div>
            {monthlyLevelLabel && <Link to={`/niveau/${subscription.subscription_level}`} className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black" style={{background:colors.gold,color:colors.ink}}>Continuer en {monthlyLevelLabel}<ArrowRight size={14}/></Link>}
          </section>

          {subscriptionError && (
            <LoadError message="Le statut de ton abonnement n'a pas pu être vérifié." onRetry={reloadSubscription} />
          )}

          {checkoutReturn && (
            <div className="rounded-2xl p-4 text-left" style={{ backgroundColor: checkoutReturn.type === "success" ? `${colors.green}12` : `${colors.gold}12`, color: colors.ink }}>
              <p className="text-sm font-bold">{checkoutReturn.type === "success" ? "Accès activé" : checkoutReturn.type === "cancel" ? "Paiement annulé" : "Activation en cours"}</p>
              <p className="text-xs mt-1" style={{ color: colors.slate }}>{checkoutReturn.message}</p>
            </div>
          )}

          {isActive && !admin && (
            <button onClick={openCustomerPortal} disabled={portalLoading} className="text-xs font-medium" style={{ color: colors.slate }}>
              {portalLoading ? "Ouverture…" : "Factures et moyen de paiement"}
            </button>
          )}

          {classAccess && (
            <p className="text-xs" style={{ color: colors.gold }}>
              Accès sur invitation — {classAccessLevelLabel}
            </p>
          )}

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

          {fullAccess && !admin && subscription?.plan === "mensuel" && subscription?.current_period_end && (
            <div className="rounded-2xl p-4 text-left" style={{ backgroundColor: colors.bg }}>
              <label className="text-xs font-semibold" style={{ color: colors.ink }} htmlFor="active-monthly-level">Niveau actif</label>
              <select id="active-monthly-level" value={subscription.subscription_level ?? ""} onChange={handleMonthlyLevelChange} disabled={levelChangeLoading} className="mt-1 mb-2 w-full rounded-xl px-3 py-2 text-sm" style={{ color: colors.ink, backgroundColor: colors.card, border: `1px solid ${colors.hairline}` }}>
                {!subscription.subscription_level && <option value="">Choisir un niveau</option>}
                {LEVELS.map((level) => <option key={level.id} value={level.id}>{level.label}</option>)}
              </select>
              <p className="text-[11px] mb-3" style={{ color: colors.slate }}>Correction libre pendant 24 h après le choix initial, puis un changement possible tous les 30 jours. Les progrès déjà réalisés restent conservés.</p>
              {levelChangeMessage && <p className="text-xs mb-3" style={{ color: levelChangeMessage.type === "error" ? colors.red : colors.green }}>{levelChangeMessage.text}</p>}
              {!subscription.cancel_at_period_end ? (
                <>
                  <p className="text-xs" style={{ color: colors.slate }}>
                    Renouvellement automatique le {new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}.
                  </p>
                  {!confirmingCancel ? (
                    <button
                      onClick={() => setConfirmingCancel(true)}
                      className="text-xs font-medium mt-2"
                      style={{ color: colors.red }}
                    >
                      Résilier mon abonnement
                    </button>
                  ) : (
                    <div className="mt-2 flex flex-col gap-2">
                      <p className="text-xs" style={{ color: colors.ink }}>
                        Tu garderas l'accès jusqu'au{" "}
                        {new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}, sans reconduction
                        ensuite. Confirmer la résiliation ?
                      </p>
                      <div className="flex gap-2">
                        <button
                          disabled={cancelLoading}
                          onClick={() => handleCancelAction("cancel")}
                          className="text-xs font-semibold py-1.5 px-3 rounded-full"
                          style={{ backgroundColor: colors.red, color: "#fff" }}
                        >
                          {cancelLoading ? "…" : "Confirmer"}
                        </button>
                        <button
                          disabled={cancelLoading}
                          onClick={() => setConfirmingCancel(false)}
                          className="text-xs font-medium py-1.5 px-3 rounded-full"
                          style={{ color: colors.slate }}
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="text-xs" style={{ color: colors.slate }}>
                    Résiliation prévue — accès jusqu'au{" "}
                    {new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}, sans renouvellement.
                  </p>
                  <button
                    disabled={cancelLoading}
                    onClick={() => handleCancelAction("reactivate")}
                    className="text-xs font-medium mt-2"
                    style={{ color: colors.gold }}
                  >
                    {cancelLoading ? "…" : "Annuler la résiliation"}
                  </button>
                </>
              )}
              {cancelError && (
                <p className="text-xs mt-2" style={{ color: colors.red }}>
                  {cancelError}
                </p>
              )}
            </div>
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
                  Ton choix est définitif pour ce Pack Examen.
                </p>
              </div>
            );
          })()}

          {!classAccess && (
            <div className="rounded-2xl p-4 text-left" style={{ backgroundColor: colors.bg }}>
              {!showInvitationCodeForm ? (
                <button onClick={() => setShowInvitationCodeForm(true)} className="text-xs font-medium" style={{ color: colors.slate }}>
                  J’ai reçu un code d’invitation
                </button>
              ) : (
                <form onSubmit={handleRedeemInvitationCode} className="flex flex-col gap-2">
                  <p className="text-xs" style={{ color: colors.slate }}>Saisis ici uniquement un code transmis dans le cadre d’un accès autorisé par RéussiMaths.</p>
                  <div className="flex gap-2">
                    <input type="text" value={invitationCode} onChange={(event) => setInvitationCode(event.target.value)} placeholder="Code d’invitation" className="flex-1 text-sm rounded-lg px-3 py-2" style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.card }} />
                    <button type="submit" disabled={invitationCodeLoading || !invitationCode.trim()} className="text-xs font-semibold py-2 px-3 rounded-full" style={{ backgroundColor: colors.gold, color: colors.ink }}>
                      {invitationCodeLoading ? "…" : "Valider"}
                    </button>
                  </div>
                  {invitationCodeError && <p className="text-xs" style={{ color: colors.red }}>{invitationCodeError}</p>}
                </form>
              )}
            </div>
          )}

          {fullAccess && (
            <Link to="/idees" className="text-xs font-medium" style={{ color: colors.gold }}>
              💡 Proposer une idée d'amélioration
            </Link>
          )}

          <ReviserCard />

          {fullAccess && subscription?.subscription_level && <div className="grid grid-cols-2 gap-2"><Link to={`/niveau/${subscription.subscription_level}`} className="interactive-card rounded-2xl p-3 text-left" style={{background:`${colors.green}10`,border:`1px solid ${colors.green}25`}}><BookOpenCheck size={17} color={colors.green}/><p className="mt-2 text-xs font-black" style={{color:colors.ink}}>Mon niveau</p><p className="mt-0.5 text-[10px]" style={{color:colors.slate}}>Reprendre le parcours</p></Link><Link to="/" className="interactive-card rounded-2xl p-3 text-left" style={{background:`${colors.gold}10`,border:`1px solid ${colors.gold}25`}}><Target size={17} color={colors.gold}/><p className="mt-2 text-xs font-black" style={{color:colors.ink}}>Aujourd’hui</p><p className="mt-0.5 text-[10px]" style={{color:colors.slate}}>Voir la priorité du jour</p></Link></div>}

          <Link to="/retour-pilote" className="rounded-2xl p-3 text-sm font-bold" style={{ backgroundColor: `${colors.green}10`, color: colors.green }}>
            Donner mon retour sur RéussiMaths
          </Link>

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
                  {fullAccess ? `Parrainage — ${referralCount} ami${referralCount > 1 ? "s" : ""}` : `Parrainage — ${referralCount}/5 amis`}
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

          {!isActive && !admin && !subscriptionLoading && !subscriptionError && (
            <div className="flex flex-col gap-4 -mx-6 px-6 pt-2" style={{ borderTop: `1px solid ${colors.hairline}` }}>
              <div>
                <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.15rem", fontWeight: 800 }}>
                  Débloque le niveau de l’élève
                </p>
                <p className="text-xs mt-1" style={{ color: colors.slate }}>
                  Tous les chapitres d’un niveau choisi, avec corrections détaillées illimitées.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                {[
                  { label: "exercices", value: "Illimités" },
                  { label: "niveau", value: "Au choix" },
                  { label: "programme", value: "2026" },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center gap-3">
                    {i > 0 && <div style={{ width: 1, height: 24, backgroundColor: colors.hairline }} />}
                    <div className="text-center">
                      <p className="text-sm font-bold" style={{ color: colors.ink }}>
                        {s.value}
                      </p>
                      <p className="text-[10px]" style={{ color: colors.slate }}>
                        {s.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative rounded-2xl p-4 text-left" style={{ backgroundColor: colors.card, border: `2px solid ${colors.gold}` }}>
                <span
                  className="absolute -top-2.5 left-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: colors.gold, color: colors.ink }}
                >
                  Le plus choisi
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-sm font-bold" style={{ color: colors.ink }}>
                    Un niveau complet
                  </p>
                  <p className="text-base font-bold" style={{ color: colors.ink }}>
                    4,99 € <span className="text-xs font-medium" style={{ color: colors.slate }}>/mois</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  {[
                    "Tous les chapitres du niveau choisi",
                    "Bilan hebdomadaire pour suivre les progrès",
                    "Résiliable en un clic, sans engagement",
                  ].map((f) => (
                    <p key={f} className="text-xs flex items-center gap-1.5" style={{ color: colors.slate }}>
                      <Check size={12} color={colors.green} className="flex-shrink-0" />
                      {f}
                    </p>
                  ))}
                </div>
              </div>

              <label className="rounded-2xl p-3.5 text-left flex flex-col gap-2" style={{ backgroundColor: colors.bg, border: `1px solid ${monthlyLevel ? colors.gold : colors.hairline}` }}>
                <span className="text-xs font-bold" style={{ color: colors.ink }}>Niveau scolaire de l’élève</span>
                <select value={monthlyLevel} onChange={(event) => { setMonthlyLevel(event.target.value); setCheckoutError(null); }} className="rounded-xl px-3 py-2.5 text-sm" style={{ color: colors.ink, backgroundColor: colors.card, border: `1px solid ${colors.hairline}` }}>
                  <option value="">Choisir le niveau</option>
                  {LEVELS.map((level) => <option key={level.id} value={level.id}>{level.label}</option>)}
                </select>
                <span className="text-[11px]" style={{ color: colors.slate }}>Ce niveau organise les exercices, les révisions et le bilan de progression de ce compte élève.</span>
              </label>

              <label className="rounded-2xl p-3.5 text-left flex items-start gap-3 cursor-pointer" style={{ backgroundColor: colors.bg, border: `1px solid ${acceptImmediateAccess ? colors.gold : colors.hairline}` }}>
                <input type="checkbox" checked={acceptImmediateAccess} onChange={(event) => { setAcceptImmediateAccess(event.target.checked); setCheckoutError(null); }} className="mt-0.5 shrink-0" style={{ minHeight: 0, accentColor: colors.gold }} />
                <span className="text-[11px] leading-relaxed" style={{ color: colors.slate }}>Je demande l’accès immédiat au contenu numérique et reconnais qu’une fois cet accès commencé, je renonce à mon droit de rétractation. J’accepte les <Link to="/cgu" className="underline font-semibold" style={{ color: colors.ink }}>CGU/CGV</Link>.</span>
              </label>

              <button
                disabled={checkoutLoading || !acceptImmediateAccess || !monthlyLevel}
                onClick={() => startCheckout("mensuel")}
                className="py-3 rounded-full font-bold"
                style={{ backgroundColor: colors.gold, color: colors.ink, opacity: acceptImmediateAccess && monthlyLevel ? 1 : 0.5 }}
              >
                {checkoutLoading ? "Ouverture du paiement…" : "S'abonner avec obligation de paiement — 4,99 €/mois"}
              </button>
              {checkoutError && (
                <p className="text-xs text-center -mt-2" style={{ color: colors.red }}>
                  {checkoutError}
                </p>
              )}
              <p className="text-[11px] text-center -mt-2" style={{ color: colors.slate }}>
                Renouvellement mensuel. Résiliation possible à tout moment depuis cette page.
              </p>

              <div className="rounded-2xl p-3.5 text-left" style={{ backgroundColor: colors.bg, border: `1px solid ${colors.hairline}` }}>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs font-semibold" style={{ color: colors.ink }}>
                    Pack Examen
                  </p>
                  <p className="text-sm font-bold" style={{ color: colors.ink }}>
                    9 € <span className="text-[10px] font-medium" style={{ color: colors.slate }}>paiement unique</span>
                  </p>
                </div>
                <p className="text-xs mt-0.5" style={{ color: colors.slate }}>
                  Pour UN niveau au choix : préparation à l'examen (Brevet, épreuve anticipée ou Bac), Automatismes illimités et 2
                  chapitres bonus. Offre non reconductible.
                </p>
                <button
                  disabled={checkoutLoading || !acceptImmediateAccess}
                  onClick={() => startCheckout("special_examen")}
                  className="text-xs font-semibold mt-2"
                  style={{ color: colors.gold, opacity: acceptImmediateAccess ? 1 : 0.45 }}
                >
                  {checkoutLoading ? "Ouverture du paiement…" : "Acheter le Pack Examen — 9 € →"}
                </button>
              </div>
            </div>
          )}
          <button onClick={signOut} className="py-2 rounded-full text-sm font-medium mt-2" style={{ color: colors.slate }}>
            Se déconnecter
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
