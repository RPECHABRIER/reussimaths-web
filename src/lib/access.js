// ---------------------------------------------------------------------------
// Logique centralisée des paliers d'accès (gratuit / Pack Examen / abonnement
// complet / accès admin). Un seul endroit à modifier si les règles changent —
// voir supabase/schema.sql pour les colonnes pack_examen_level /
// pack_examen_bonus_chapters sur `subscriptions`, et src/hooks/useProgress.js
// pour useSubscription (qui charge la ligne `subscriptions` telle quelle,
// colonnes comprises — aucune modif nécessaire là-bas).
//
// Paliers (voir AUTOMATION_LOG.md, décision du 2026-08-03) :
//   - Gratuit        : parcours découverte + Automatismes de chaque niveau
//                       (meta.freemiumDaily, quota quotidien géré par
//                       useDailyQuota) + chapitres meta.free.
//   - Pack Examen     : plan "special_examen". Débloque, pour LE niveau choisi
//                       à la souscription (pack_examen_level) : le chapitre
//                       de préparation à l'examen (voir EXAM_CHAPTER_BY_LEVEL)
//                       + Automatismes en illimité pour ce niveau. Débloque
//                       aussi 2 chapitres bonus au choix, n'importe où dans le
//                       catalogue, fixés une seule fois à la souscription
//                       (pack_examen_bonus_chapters, voir la fonction RPC
//                       set_pack_examen_choices dans schema.sql). Rien
//                       d'autre.
//   - Abonnement      : plan "mensuel". Accès complet à tous les niveaux,
//     complet            sans restriction (voir schema anti-partage :
//                       1 seule session active, src/hooks/useSingleSession.js).
//   - Accès classe    : accès exceptionnel à un niveau, créé uniquement par
//                       l'admin et activé par un code d'invitation.
//   - Admin           : le compte de Romain (ADMIN_EMAIL) bypass tout, sans
//                       abonnement.
//
// Mode prévisualisation admin (voir src/pages/AdminPreview.jsx, route
// /admin) : l'admin peut se faire passer pour un compte gratuit / Pack
// Examen / abonnement complet, purement côté client (voir
// src/lib/adminPreview.js), pour tester l'app à tous les paliers sans créer
// de vrais comptes. isAdminUser() et getEffectiveSubscription() ci-dessous
// sont les deux seuls points d'entrée qui en tiennent compte — tout le reste
// du fichier (canAccessChapter, hasUnlimitedQuota...) continue de raisonner
// normalement sur le `user`/`subscription` qu'on lui donne, sans rien savoir
// de la préviz.
// ---------------------------------------------------------------------------

import { getAdminPreview } from "./adminPreview";

export const ADMIN_EMAIL = "romainpechabrier@gmail.com";

// Chapitre "préparation à l'examen" par niveau, débloqué par le Pack Examen.
// null = pas encore de chapitre de révision dédié pour ce niveau (6e/5e,
// pas d'épreuve officielle) : le Pack Examen n'y débloque alors que les 2
// chapitres bonus au choix.
export const EXAM_CHAPTER_BY_LEVEL = {
  sixieme: null,
  cinquieme: null,
  quatrieme: "exercices-fin-annee-quatrieme",
  troisieme: "dossier-brevet-troisieme",
  seconde: "exercices-fin-annee-seconde",
  "premiere-non-spe": "preparation-eam-premiere-non-spe",
  "premiere-spe": "preparation-bac-premiere-spe",
  "premiere-techno": "preparation-eam-premiere-techno",
  "terminale-spe": "exercices-transversaux-terminale-spe",
  "terminale-techno": null,
};

// Vérifie l'identité RÉELLE (jamais influencée par la préviz) — c'est le
// garde-fou : isAdminUser()/getEffectiveSubscription() ci-dessous ne
// consultent le localStorage de préviz que si isRealAdmin(user) est vrai,
// donc un utilisateur normal qui bidouillerait ce localStorage n'obtient
// jamais rien de plus que son accès réel.
export function isRealAdmin(user) {
  return !!user && user.email === ADMIN_EMAIL;
}

// Préviz active pour l'admin réel ? Renvoie l'objet préviz ({mode, ...}) ou
// null (vue réelle / pas admin).
function activePreviewFor(user) {
  if (!isRealAdmin(user)) return null;
  const preview = getAdminPreview();
  if (!preview || !preview.mode || preview.mode === "admin") return null;
  return preview;
}

// Pendant une préviz "gratuit"/"special_examen"/"mensuel", l'admin doit
// vraiment perdre son statut admin (sinon canAccessChapter/hasUnlimitedQuota
// court-circuiteraient dessus avant même de regarder l'abonnement simulé).
export function isAdminUser(user) {
  if (activePreviewFor(user)) return false;
  return isRealAdmin(user);
}

function buildPreviewSubscription(preview) {
  if (preview.mode === "gratuit") return null;
  if (preview.mode === "special_examen") {
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 3);
    return {
      plan: "special_examen",
      status: "active",
      current_period_end: periodEnd.toISOString(),
      pack_examen_level: preview.packExamenLevel ?? null,
      pack_examen_bonus_chapters: preview.packExamenBonusChapters ?? [],
    };
  }
  if (preview.mode === "mensuel") {
    // current_period_end simulé (+1 mois) pour que la préviz reste fidèle à
    // un vrai abonnement Stripe — sinon la carte de résiliation
    // (Account.jsx, qui a besoin d'une date à afficher) resterait masquée
    // pendant la préviz alors qu'elle apparaît bien pour un vrai abonné.
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    return { plan: "mensuel", status: "active", current_period_end: periodEnd.toISOString() };
  }
  return null;
}

// À appeler juste après useSubscription() dans toute page qui vérifie
// l'accès, et à utiliser ensuite PARTOUT à la place de la ligne brute
// (canAccessChapter, hasUnlimitedQuota, isFullAccessSubscription,
// isPackExamenSubscription...). Ne change rien si l'utilisateur réel n'est
// pas l'admin, ou si aucune préviz n'est active.
export function getEffectiveSubscription(user, subscription) {
  const preview = activePreviewFor(user);
  return preview ? buildPreviewSubscription(preview) : subscription;
}

function planIsCurrentlyValid(subscription) {
  if (!subscription) return false;
  // "special_examen" est un paiement unique à durée fixe (current_period_end,
  // +3 mois) qui ne repasse jamais à "canceled" tout seul côté Stripe — voir
  // api/stripe-webhook.js. "mensuel" n'a pas cette contrainte (le statut
  // Stripe suffit).
  const notExpired = !subscription.current_period_end || new Date(subscription.current_period_end) > new Date();
  return (subscription.status === "active" || subscription.status === "trialing") && notExpired;
}

export function isFullAccessSubscription(subscription) {
  return subscription?.plan === "mensuel" && planIsCurrentlyValid(subscription);
}

export function isPackExamenSubscription(subscription) {
  return subscription?.plan === "special_examen" && planIsCurrentlyValid(subscription);
}

export function isClassAccessSubscription(subscription) {
  return !!subscription?.class_access_level
    && !!subscription?.class_access_expires_at
    && new Date(subscription.class_access_expires_at) > new Date();
}

// Un chapitre est-il accessible pour cet utilisateur ? ctx = { user,
// subscription, referralBonusChapterId }. Tous les points d'accès (Niveau,
// ChapterPage, ParcoursOverview, ParcoursStep, Amis) doivent passer par cette
// fonction plutôt que de recalculer la règle localement.
//
// referralBonusChapterId : le chapitre choisi via la récompense de parrainage
// (5 amis parrainés -> 1 chapitre au choix, fixé une fois — voir
// src/hooks/useReferralBonus.js et src/components/ReferralBonusChoice.jsx).
// Remplace l'ancien mécanisme meta.unlockReferrals (chapitre fixe imposé,
// abandonné avec la suppression de probabilites.js).
export function canAccessChapter(chapter, ctx = {}) {
  if (!chapter) return false;
  const { user, subscription, referralBonusChapterId } = ctx;

  if (chapter.meta.free) return true;
  if (chapter.meta.freemiumDaily) return true; // ouvert à tous, quota séparé (useDailyQuota) — pas un verrou d'accès
  if (isAdminUser(user)) return true;
  if (isFullAccessSubscription(subscription)) return true;
  if (isClassAccessSubscription(subscription) && chapter.meta.level === subscription.class_access_level) return true;
  if (referralBonusChapterId && chapter.meta.id === referralBonusChapterId) return true;

  if (isPackExamenSubscription(subscription)) {
    const examChapterId = EXAM_CHAPTER_BY_LEVEL[subscription.pack_examen_level];
    if (examChapterId && chapter.meta.id === examChapterId) return true;
    if (subscription.pack_examen_bonus_chapters?.includes(chapter.meta.id)) return true;
  }

  return false;
}

// Le quota quotidien (Automatismes) doit sauter pour : l'admin, l'abonnement
// complet, et le Pack Examen mais UNIQUEMENT pour le niveau qu'il a choisi
// (pas les Automatismes des autres niveaux, qui restent limités comme pour un
// utilisateur gratuit).
export function hasUnlimitedQuota(chapter, ctx = {}) {
  const { user, subscription } = ctx;
  if (isAdminUser(user)) return true;
  if (isFullAccessSubscription(subscription)) return true;
  if (isPackExamenSubscription(subscription) && subscription?.pack_examen_level === chapter?.meta?.level) return true;
  if (isClassAccessSubscription(subscription) && subscription.class_access_level === chapter?.meta?.level) return true;
  return false;
}
