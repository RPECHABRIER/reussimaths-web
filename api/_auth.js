export async function requireSupabaseUser(req, res, supabaseAdmin) {
  const header = req.headers.authorization ?? req.headers.Authorization ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header);

  if (!match) {
    res.status(401).json({ error: "Authentification requise" });
    return null;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(match[1]);
  if (error || !data?.user) {
    res.status(401).json({ error: "Session invalide ou expirée" });
    return null;
  }

  return data.user;
}
