import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Check, ArrowRight, ShieldCheck, Target, RotateCcw, Sparkles } from "lucide-react";
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

const TERMS_VERSION = "2026-08-09";

// Note : la redirection vers /pseudo pour un utilisateur sans profil est
// gérée globalement dans App.jsx (fonctionne quelle que soit la page
// d'arrivée après connexion, pas seulement /compte).
export default function Account() {
  const { user, loading, signInWithGoogle, signInWithApple, signOut } = useAuth();
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

  const admin = isAdminUser(user);
  const fullAccess = isFullAccessSubscription(subscription);
  const packExamen = isPackExamenSubscription(subscription);
  const classAccess = isClassAccessSubscription(subscription);
  const classAccessLevelLabel = classAccess
    ? LEVELS.find((l) => l.id === subscription.class_access_level)?.label ?? subscription.class_access_level
    : null;
  const packExamenNeedsChoice = packExamen && !subscription?.pack_examen_level;
  // isActive recalculé sur la subscription EFFECTIVE (donc cohérent avec une
  // préviz admin en cours) plutôt que de reprendre isActive du hook, qui
  // porte toujours sur la vraie ligne en base.
  const isActive = fullAccess || packExamen;
  const previewing = isRealAdmin(user) && !!getAdminPreview()?.mode && getAdminPreview()?.mode !== "admin";

  useEffect(() => { trackProductEvent("offer_viewed", { authenticated: !!user }); }, []);

  const referralLink = profile?.referral_code
    ? `${window.location.origin}/?ref=${profile.referral_code}`
    : null;

  const startCheckout = async (plan) => {
    if (!acceptImmediateAccess) {
      setCheckoutError("Confirme d’abord la demande d’accès immédiat et l’acceptation des CGU.");
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
        body: JSON.stringify({ plan, purchaseAttemptId, termsVersion: TERMS_VERSION, immediateAccessAccepted: true }),
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
      <Link to="/" className="inline-flex text-sm font-medium" style={{ color: colors.ink }}>
        ← Accueil
      </Link>

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
                <p className="text-xs uppercase tracking-widest font-bold" style={{ color: colors.gold }}>Accès complet</p>
                <p className="text-3xl font-black mt-1" style={{ color: colors.ink }}>4,99 € <span className="text-sm font-semibold" style={{ color: colors.slate }}>/ mois</span></p>
              </div>
              <Mascot size={62} />
            </div>
            <div className="flex flex-col gap-2.5 mt-5">
              {["Tous les niveaux, de la 6e à la Terminale", "Entraînement et corrections détaillées illimités", "Révisions espacées et bilan hebdomadaire", "Résiliation à tout moment depuis le compte"].map((feature) => (
                <p key={feature} className="flex items-start gap-2 text-sm" style={{ color: colors.ink }}><Check size={16} color={colors.green} className="shrink-0 mt-0.5" />{feature}</p>
              ))}
            </div>
            <div className="rounded-2xl p-4 mt-6" style={{ backgroundColor: colors.bg }}>
              <p className="text-xs font-bold" style={{ color: colors.ink }}>Crée d’abord ton espace personnel</p>
              <p className="text-xs mt-1" style={{ color: colors.slate }}>La connexion sauvegarde la progression et rattache l’abonnement au bon élève.</p>
              <div className="grid sm:grid-cols-2 gap-2 mt-3">
                <button onClick={() => { markSignupStarted("google"); signInWithGoogle(); }} className="py-3 rounded-full text-sm font-bold" style={{ backgroundColor: colors.ink, color: colors.bg }}>Avec Google</button>
                <button onClick={() => { markSignupStarted("apple"); signInWithApple(); }} className="py-3 rounded-full text-sm font-bold" style={{ backgroundColor: colors.ink, color: colors.bg }}>Avec Apple</button>
              </div>
              <p className="flex items-center justify-center gap-1.5 text-[11px] mt-3" style={{ color: colors.slate }}><ShieldCheck size={13} color={colors.green} />L’élève choisit un pseudo ; son nom n’est pas affiché.</p>
            </div>
            <div className="flex items-baseline justify-between gap-3 mt-5 pt-4" style={{ borderTop: `1px solid ${colors.hairline}` }}>
              <div><p className="text-sm font-bold" style={{ color: colors.ink }}>Pack Examen</p><p className="text-xs" style={{ color: colors.slate }}>3 mois · un niveau · sans renouvellement</p></div>
              <p className="text-lg font-black whitespace-nowrap" style={{ color: colors.ink }}>9 €</p>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto text-center rounded-[2rem] p-5 sm:p-8 lg:p-10 my-8" style={{ backgroundColor: colors.card, boxShadow: shadow.raised, border: `1px solid ${colors.hairline}` }}>
          <Mascot size={84} className="mx-auto" />
          <p style={{ fontFamily: fonts.display, fontWeight: 700, color: colors.ink, fontSize: "1.1rem" }}>
            {profile?.pseudo ?? "Connecté"}
          </p>
          <p className="text-sm" style={{ color: colors.slate }}>
            Abonnement : {admin ? "accès complet (admin)" : subscriptionLoading ? "vérification…" : subscriptionError ? "statut indisponible" : isActive ? `actif (${subscription?.plan ?? ""})` : "aucun"}
          </p>

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
                  Ton choix est définitif : abonne-toi en complet pour débloquer tous les niveaux.
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
                  Débloque tout RéussiMaths
                </p>
                <p className="text-xs mt-1" style={{ color: colors.slate }}>
                  Tous les chapitres, tous les niveaux, corrections détaillées illimitées.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                {[
                  { label: "exercices", value: "Illimités" },
                  { label: "niveaux", value: "6e → Tale" },
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
                    Accès complet
                  </p>
                  <p className="text-base font-bold" style={{ color: colors.ink }}>
                    4,99 € <span className="text-xs font-medium" style={{ color: colors.slate }}>/mois</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  {[
                    "Tous les niveaux, tous les chapitres",
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

              <label className="rounded-2xl p-3.5 text-left flex items-start gap-3 cursor-pointer" style={{ backgroundColor: colors.bg, border: `1px solid ${acceptImmediateAccess ? colors.gold : colors.hairline}` }}>
                <input type="checkbox" checked={acceptImmediateAccess} onChange={(event) => { setAcceptImmediateAccess(event.target.checked); setCheckoutError(null); }} className="mt-0.5 shrink-0" style={{ minHeight: 0, accentColor: colors.gold }} />
                <span className="text-[11px] leading-relaxed" style={{ color: colors.slate }}>Je demande l’accès immédiat au contenu numérique et reconnais qu’une fois cet accès commencé, je renonce à mon droit de rétractation. J’accepte les <Link to="/cgu" className="underline font-semibold" style={{ color: colors.ink }}>CGU/CGV</Link>.</span>
              </label>

              <button
                disabled={checkoutLoading || !acceptImmediateAccess}
                onClick={() => startCheckout("mensuel")}
                className="py-3 rounded-full font-bold"
                style={{ backgroundColor: colors.gold, color: colors.ink, opacity: acceptImmediateAccess ? 1 : 0.5 }}
              >
                {checkoutLoading ? "Ouverture du paiement…" : "S'abonner — 4,99 €/mois"}
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
                  {checkoutLoading ? "Ouverture du paiement…" : "Choisir le Pack Examen →"}
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
