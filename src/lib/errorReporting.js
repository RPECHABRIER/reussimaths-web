const ENDPOINT = "/api/client-error";
const MAX_TEXT = 1200;

function clean(value, fallback = "Erreur inconnue") {
  const text = String(value ?? fallback)
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[email masqué]")
    .replace(/\beyJ[A-Za-z0-9_-]{20,}(?:\.[A-Za-z0-9_-]+){1,2}\b/g, "[jeton masqué]")
    .replace(/[\r\n\t]+/g, " ")
    .trim();
  return text.slice(0, MAX_TEXT) || fallback;
}

export function reportClientError(error, context = {}) {
  try {
    const payload = JSON.stringify({
      message: clean(error?.message ?? error),
      stack: clean(error?.stack, "Indisponible"),
      path: clean(window.location.pathname, "/").slice(0, 300),
      source: clean(context.source, "react").slice(0, 80),
      componentStack: clean(context.componentStack, "Indisponible"),
      occurredAt: new Date().toISOString(),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: "application/json" }));
      return;
    }
    fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
  } catch {
    // La télémétrie ne doit jamais provoquer une seconde erreur visible.
  }
}

export function installGlobalErrorReporting() {
  window.addEventListener("error", (event) => reportClientError(event.error ?? event.message, { source: "window.error" }));
  window.addEventListener("unhandledrejection", (event) => reportClientError(event.reason, { source: "unhandledrejection" }));
}
