// Vercel serverless function (Node.js runtime) — POST /api/admin-grant-access
// Permet à Romain (et uniquement lui) d'offrir — ou de retirer — l'accès
// complet gratuit à un compte de son choix, à partir de son email. Voir
// src/pages/AdminPreview.jsx (bouton "Offrir un accès complet gratuit") et
// supabase/schema.sql (colonne subscriptions.admin_granted).
//
// body: { targetEmail, action: "grant" | "revoke" }
//
// Sécurité : l'identité admin est dérivée du Bearer token Supabase puis
// revérifiée ICI, côté serveur — on ne fait JAMAIS confiance au contrôle client
// (isRealAdmin côté React peut être contourné par n'importe qui qui
// modifierait le JS dans son navigateur). Cet endpoint a le pouvoir d'offrir
// un accès complet à n'importe quel compte, donc cette vérification est
// impérative.
//
// Variables d'environnement nécessaires : SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY (mêmes que stripe-webhook.js).

import { createClient } from "@supabase/supabase-js";
import { requireSupabaseUser } from "./_auth.js";

const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");

// Dupliqué depuis src/lib/access.js (ADMIN_EMAIL) plutôt qu'importé : les
// fonctions api/ de ce projet restent volontairement indépendantes du code
// src/ (voir les autres fichiers api/), pour ne pas dépendre du bundler côté
// serveur.
const ADMIN_EMAIL = "romainpechabrier@gmail.com";

async function findUserByEmail(email) {
  const target = email.trim().toLowerCase();
  let page = 1;
  const perPage = 200;
  // L'API admin Supabase ne propose pas de recherche directe "par email" sur
  // toutes les versions du SDK — on parcourt donc les pages de listUsers en
  // comparant l'email (largement suffisant pour le nombre de comptes de cette
  // app).
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users ?? [];
    const found = users.find((u) => u.email?.toLowerCase() === target);
    if (found) return found;
    if (users.length < perPage) return null; // dernière page atteinte, personne trouvé
    page += 1;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const caller = await requireSupabaseUser(req, res, supabaseAdmin);
  if (!caller) return;

  const { targetEmail, action } = req.body ?? {};
  if (!targetEmail || !["grant", "revoke"].includes(action)) {
    res.status(400).json({ error: "targetEmail et action (grant | revoke) requis" });
    return;
  }

  try {
    if (caller.email?.toLowerCase() !== ADMIN_EMAIL) {
      res.status(403).json({ error: "Non autorisé" });
      return;
    }

    const targetUser = await findUserByEmail(targetEmail);
    if (!targetUser) {
      res.status(404).json({
        error: "Aucun compte trouvé avec cet email. La personne doit d'abord créer son compte sur l'app (connexion Google/Apple).",
      });
      return;
    }

    if (action === "grant") {
      const { error } = await supabaseAdmin.from("subscriptions").upsert({
        user_id: targetUser.id,
        plan: "mensuel",
        status: "active",
        admin_granted: true,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      res.status(200).json({ ok: true, action: "granted" });
      return;
    }

    // action === "revoke" : uniquement sur un compte marqué admin_granted —
    // ne touche jamais à un vrai abonnement Stripe payant par erreur.
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("subscriptions")
      .select("admin_granted")
      .eq("user_id", targetUser.id)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (!existing?.admin_granted) {
      res.status(400).json({ error: "Ce compte n'a pas d'accès offert par cet outil : rien à révoquer ici." });
      return;
    }

    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update({ plan: null, status: "canceled", admin_granted: false, updated_at: new Date().toISOString() })
      .eq("user_id", targetUser.id);
    if (error) throw error;
    res.status(200).json({ ok: true, action: "revoked" });
  } catch (err) {
    console.error("[admin-grant-access]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
