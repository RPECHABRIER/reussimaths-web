import { createClient } from "@supabase/supabase-js";

const MAX_BODY_BYTES = 12_000;
const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");

function safeText(value, max = 1200) {
  return typeof value === "string" ? value
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[email masqué]")
    .replace(/\beyJ[A-Za-z0-9_-]{20,}(?:\.[A-Za-z0-9_-]+){1,2}\b/g, "[jeton masqué]")
    .replace(/[\r\n\t]+/g, " ").trim().slice(0, max) : "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });
  const fetchSite = req.headers["sec-fetch-site"];
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "same-site") return res.status(403).json({ error: "Origine refusée" });
  const rawLength = Number(req.headers["content-length"] ?? 0);
  if (rawLength > MAX_BODY_BYTES) return res.status(413).json({ error: "Signalement trop volumineux" });

  const body = typeof req.body === "string" ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : req.body ?? {};
  const event = {
    message: safeText(body.message),
    stack: safeText(body.stack),
    path: safeText(body.path, 300),
    source: safeText(body.source, 80),
    componentStack: safeText(body.componentStack),
    occurredAt: safeText(body.occurredAt, 40),
  };
  if (!event.message) return res.status(400).json({ error: "Signalement invalide" });

  console.error("[client-error]", JSON.stringify(event));
  const { error } = await supabaseAdmin.from("client_errors").insert({
    message: event.message,
    stack: event.stack || null,
    path: event.path || null,
    source: event.source || null,
    component_stack: event.componentStack || null,
    occurred_at: Number.isFinite(Date.parse(event.occurredAt)) ? event.occurredAt : new Date().toISOString(),
  });
  // La migration peut ne pas encore être appliquée lors d'un déploiement :
  // les logs Vercel restent alors le filet de sécurité sans casser le client.
  if (error && error.code !== "42P01") console.error("[client-error-storage]", error.message);
  return res.status(204).end();
}
