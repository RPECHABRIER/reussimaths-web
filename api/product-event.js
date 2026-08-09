import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");
const ALLOWED_EVENTS = new Set([
  "page_view", "level_selected", "diagnostic_started", "diagnostic_completed",
  "trial_started", "trial_completed", "signup_started", "offer_viewed",
  "checkout_started", "checkout_returned", "payment_activated", "portal_opened",
  "session_completed", "feedback_sent", "study_topics_selected",
]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function cleanProperties(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).slice(0, 12).map(([key, item]) => [
    String(key).slice(0, 60),
    typeof item === "string" ? item.slice(0, 160) : typeof item === "number" || typeof item === "boolean" ? item : null,
  ]));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!["same-origin", "same-site", undefined].includes(req.headers["sec-fetch-site"])) return res.status(403).end();
  if (JSON.stringify(req.body ?? {}).length > 6000) return res.status(413).end();
  const { eventName, anonymousId, pathname, properties, occurredAt } = req.body ?? {};
  if (!ALLOWED_EVENTS.has(eventName) || !UUID.test(anonymousId ?? "")) return res.status(400).end();
  const { error } = await supabaseAdmin.from("product_events").insert({
    event_name: eventName,
    anonymous_id: anonymousId,
    pathname: typeof pathname === "string" ? pathname.slice(0, 240) : null,
    properties: cleanProperties(properties),
    occurred_at: Number.isFinite(Date.parse(occurredAt)) ? occurredAt : new Date().toISOString(),
  });
  if (error) {
    console.error("[product-event]", error.message);
    return res.status(204).end();
  }
  return res.status(204).end();
}
