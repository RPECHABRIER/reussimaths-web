// ---------------------------------------------------------------------------
// Mode "prévisualisation" admin (voir src/pages/AdminPreview.jsx, route
// /admin) : permet à l'admin (romainpechabrier@gmail.com) de voir l'app
// comme un compte gratuit / Pack Examen / abonnement complet, SANS créer de
// vrais comptes de test (la connexion se fait uniquement via Google/Apple,
// impossible de se connecter à la place de quelqu'un). Purement une
// simulation côté client, stockée en localStorage — ne touche JAMAIS aux
// vraies données en base (ni `subscriptions`, ni aucune autre table).
//
// IMPORTANT (sécurité) : ce fichier ne fait que lire/écrire le localStorage,
// sans aucune vérification d'identité. C'est volontaire et sans risque :
// src/lib/access.js (isAdminUser, getEffectiveSubscription) ne consulte
// JAMAIS ce module sans avoir d'abord vérifié que l'utilisateur RÉELLEMENT
// connecté est l'admin (isRealAdmin). Un utilisateur normal qui bidouillerait
// ce localStorage dans sa console ne gagne donc rien : ces fonctions
// exportées d'ici ne sont utiles qu'à travers ce garde-fou.
const STORAGE_KEY = "reussimaths_admin_preview";

// preview = null (vue réelle) ou :
// { mode: "gratuit" | "special_examen" | "mensuel",
//   packExamenLevel?: string,
//   packExamenBonusChapters?: string[] }
export function getAdminPreview() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminPreview(preview) {
  try {
    if (preview) localStorage.setItem(STORAGE_KEY, JSON.stringify(preview));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // stockage indisponible (mode privé strict, quota...) : tant pis, la
    // préviz ne persistera pas au rechargement, pas bloquant.
  }
}
