import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Check } from "lucide-react";
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
  const [checkoutError, setCheckoutError] = useState(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [showClassCodeForm, setShowClassCodeForm] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [classCodeLoading, setClassCodeLoading] = useState(false);
  const [classCodeError, setClassCodeError] = useState(null);

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

  const referralLink = profile?.referral_code
    ? `${window.location.origin}/?ref=${profile.referral_code}`
    : null;

  const startCheckout = async (plan) => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await authenticatedFetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
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

  // Code d'accès classe (voir supabase/schema.sql, redeem_class_access_code)
  // : accès gratuit et complet à un niveau, distribué par un professeur à
  // ses élèves. Fonction RPC SECURITY DEFINER, pas de ligne Stripe derrière.
  const handleRedeemClassCode = async (e) => {
    e.preventDefault();
    setClassCodeLoading(true);
    setClassCodeError(null);
    try {
      const { error } = await supabase.rpc("redeem_class_access_code", { p_code: classCode.trim() });
      if (error) throw error;
      setClassCode("");
      setShowClassCodeForm(false);
      reloadSubscription();
    } catch (err) {
      setClassCodeError(err.message?.includes("Code invalide") ? "Code invalide." : "Une erreur est survenue.");
    } finally {
      setClassCodeLoading(false);
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
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <div className="text-center px-3">
            <p style={{ fontFamily: fonts.display, fontWeight: 800, color: colors.ink, fontSize: "1.35rem" }}>
              Commence gratuitement, progresse à ton rythme
            </p>
            <p className="text-sm mt-1" style={{ color: colors.slate }}>
              Connecte-toi pour sauvegarder ta progression. Tu pourras ensuite choisir de rester en accès gratuit ou de
              débloquer davantage d'entraînement.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl p-6" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
          <Mascot size={72} className="mx-auto" />
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

          <div className="grid gap-3">
            <div className="rounded-2xl p-4 text-left" style={{ backgroundColor: colors.card, border: `2px solid ${colors.gold}` }}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-bold" style={{ color: colors.ink }}>Accès complet</p>
                <p className="text-base font-bold whitespace-nowrap" style={{ color: colors.ink }}>
                  4,99 € <span className="text-xs font-medium" style={{ color: colors.slate }}>/mois</span>
                </p>
              </div>
              <p className="text-xs mt-1" style={{ color: colors.slate }}>
                Tous les niveaux et chapitres, entraînement illimité et bilan de progression. Renouvellement mensuel,
                résiliable à tout moment.
              </p>
            </div>
            <div className="rounded-2xl p-4 text-left" style={{ backgroundColor: colors.card, border: `1px solid ${colors.hairline}` }}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-bold" style={{ color: colors.ink }}>Pack Examen</p>
                <p className="text-base font-bold whitespace-nowrap" style={{ color: colors.ink }}>9 €</p>
              </div>
              <p className="text-xs mt-1" style={{ color: colors.slate }}>
                Paiement unique pour 3 mois sur un niveau : préparation à l'examen, Automatismes illimités et 2 chapitres
                bonus. Sans renouvellement automatique.
              </p>
            </div>
          </div>
          <p className="text-[11px] text-center px-3" style={{ color: colors.slate }}>
            La connexion est nécessaire avant le paiement pour rattacher l'accès au bon compte.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full max-w-xs text-center rounded-3xl p-6" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
          <Mascot size={84} className="mx-auto" />
          <p style={{ fontFamily: fonts.display, fontWeight: 700, color: colors.ink, fontSize: "1.1rem" }}>
            {profile?.pseudo ?? "Connecté"}
          </p>
          <p className="text-sm" style={{ color: colors.slate }}>
            Abonnement : {admin ? "accès complet (admin)" : isActive ? `actif (${subscription?.plan ?? ""})` : "aucun"}
          </p>

          {classAccess && (
            <p className="text-xs" style={{ color: colors.gold }}>
              Accès classe — {classAccessLevelLabel} (offert par ton professeur)
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
              {!showClassCodeForm ? (
                <button
                  onClick={() => setShowClassCodeForm(true)}
                  className="text-xs font-medium"
                  style={{ color: colors.slate }}
                >
                  Code d'accès professeur
                </button>
              ) : (
                <form onSubmit={handleRedeemClassCode} className="flex flex-col gap-2">
                  <p className="text-xs" style={{ color: colors.slate }}>
                    Ton professeur t'a donné un code ? Il débloque gratuitement tout un niveau.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={classCode}
                      onChange={(e) => setClassCode(e.target.value)}
                      placeholder="Code d'accès"
                      className="flex-1 text-sm rounded-lg px-3 py-2"
                      style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.card }}
                    />
                    <button
                      type="submit"
                      disabled={classCodeLoading || !classCode.trim()}
                      className="text-xs font-semibold py-2 px-3 rounded-full"
                      style={{ backgroundColor: colors.gold, color: colors.ink }}
                    >
                      {classCodeLoading ? "…" : "Valider"}
                    </button>
                  </div>
                  {classCodeError && (
                    <p className="text-xs" style={{ color: colors.red }}>
                      {classCodeError}
                    </p>
                  )}
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

          {!isActive && !admin && (
            <div className="flex flex-col gap-4 -mx-6 px-6 pt-2" style={{ borderTop: `1px solid ${colors.hairline}` }}>
              <div>
                <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.15rem", fontWeight: 800 }}>
                  Débloque tout Reussimaths
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

              <button
                disabled={checkoutLoading}
                onClick={() => startCheckout("mensuel")}
                className="py-3 rounded-full font-bold"
                style={{ backgroundColor: colors.gold, color: colors.ink }}
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
                  Pour UN niveau au choix : préparation à l'examen (Brevet, EAM ou Bac), Automatismes illimités et 2
                  chapitres bonus. Offre non reconductible.
                </p>
                <button
                  disabled={checkoutLoading}
                  onClick={() => startCheckout("special_examen")}
                  className="text-xs font-semibold mt-2"
                  style={{ color: colors.gold }}
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
  );
}
