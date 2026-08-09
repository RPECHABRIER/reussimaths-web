const MAX_BODY_BYTES = 12_000;

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
  return res.status(204).end();
}
