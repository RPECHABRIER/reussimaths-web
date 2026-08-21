export const ALLOWED_PRODUCT_EVENTS = new Set([
  "page_view", "level_selected", "diagnostic_started", "diagnostic_completed",
  "trial_started", "trial_completed", "signup_started", "offer_viewed",
  "checkout_started", "checkout_returned", "payment_activated", "portal_opened",
  "session_completed", "feedback_sent", "study_topics_selected",
  "account_cta_clicked", "signup_completed", "adaptive_next_selected",
  "adaptive_next_outcome", "recovery_opportunity", "recovery_success", "exercise_started",
  "exercise_completed", "paywall_viewed", "subscription_activated",
  "pack_examen_activated",
]);

export const PRODUCT_EVENT_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isAcceptedProductEvent(eventName, anonymousId) {
  return ALLOWED_PRODUCT_EVENTS.has(eventName) && PRODUCT_EVENT_UUID.test(anonymousId ?? "");
}

export function cleanProductEventProperties(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).slice(0, 12).map(([key, item]) => [
    String(key).slice(0, 60),
    typeof item === "string" ? item.slice(0, 160) : typeof item === "number" || typeof item === "boolean" ? item : null,
  ]));
}
