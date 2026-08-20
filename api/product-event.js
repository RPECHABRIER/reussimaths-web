import { createClient } from "@supabase/supabase-js";
import { cleanProductEventProperties, isAcceptedProductEvent } from "./_product-events.js";

const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!["same-origin", "same-site", undefined].includes(req.headers["sec-fetch-site"])) return res.status(403).end();
  if (JSON.stringify(req.body ?? {}).length > 6000) return res.status(413).end();
  const { eventName, anonymousId, pathname, properties, occurredAt } = req.body ?? {};
  if (!isAcceptedProductEvent(eventName, anonymousId)) return res.status(400).end();
  const { error } = await supabaseAdmin.from("product_events").insert({
    event_name: eventName,
    anonymous_id: anonymousId,
    pathname: typeof pathname === "string" ? pathname.slice(0, 240) : null,
    properties: cleanProductEventProperties(properties),
    occurred_at: Number.isFinite(Date.parse(occurredAt)) ? occurredAt : new Date().toISOString(),
  });
  if (error) {
    console.error("[product-event]", error.message);
    return res.status(204).end();
  }
  return res.status(204).end();
}
