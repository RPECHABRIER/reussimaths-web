const STORAGE_KEY = "reussimaths_anonymous_id";
const SIGNUP_PENDING_KEY = "reussimaths_signup_pending";

function anonymousId() {
  try {
    let value = localStorage.getItem(STORAGE_KEY);
    if (!value) {
      value = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, value);
    }
    return value;
  } catch {
    return null;
  }
}

// Mesure produit minimale : aucun nom, email, réponse saisie ou paramètre
// d'URL. L'échec de la mesure ne doit jamais gêner l'apprentissage.
export function trackProductEvent(eventName, properties = {}) {
  const payload = JSON.stringify({
    eventName,
    anonymousId: anonymousId(),
    pathname: window.location.pathname,
    properties,
    occurredAt: new Date().toISOString(),
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/product-event", new Blob([payload], { type: "application/json" }));
      return;
    }
    fetch("/api/product-event", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
  } catch {
    // best effort
  }
}

export function markSignupStarted(provider) {
  try { localStorage.setItem(SIGNUP_PENDING_KEY, provider); } catch { /* stockage indisponible */ }
  trackProductEvent("signup_started", { provider });
}

export function trackCompletedSignup() {
  try {
    const provider=localStorage.getItem(SIGNUP_PENDING_KEY);
    if(!provider)return;
    localStorage.removeItem(SIGNUP_PENDING_KEY);
    trackProductEvent("signup_completed", { provider });
  } catch { /* mesure facultative */ }
}
