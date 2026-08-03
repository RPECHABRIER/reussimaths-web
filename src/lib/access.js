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
//   - Admin           : le compte de Romain (ADMIN_EMAIL) bypass tout, sans
//                       abonnement.
// ---------------------------------------------------------------------------

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
  "premiere-non-spe": "exercices-rituels-premiere-non-spe",
  "premiere-spe": "preparation-bac-premiere-spe",
  "terminale-spe": "exercices-transversaux-terminale-spe",
};

export function isAdminUser(user) {
  return !!user && user.email === ADMIN_EMAIL;
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

// Un chapitre est-il accessible pour cet utilisateur ? ctx = { user,
// subscription, referralCount }. Tous les points d'accès (Niveau, ChapterPage,
// ParcoursOverview, ParcoursStep, Amis) doivent passer par cette fonction
// plutôt que de recalculer la règle localement.
export function canAccessChapter(chapter, ctx = {}) {
  if (!chapter) return false;
  const { user, subscription, referralCount = 0 } = ctx;

  if (chapter.meta.free) return true;
  if (chapter.meta.freemiumDaily) return true; // ouvert à tous, quota séparé (useDailyQuota) — pas un verrou d'accès
  if (isAdminUser(user)) return true;
  if (isFullAccessSubscription(subscription)) return true;
  if (chapter.meta.unlockReferrals && referralCount >= chapter.meta.unlockReferrals) return true;

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
  return false;
}
