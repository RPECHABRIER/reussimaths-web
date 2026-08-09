// Vercel serverless function — POST /api/notify-challenge
// Envoie un email à l'ami défié pour le prévenir, via Gmail SMTP (compte
// dédié au site) + Nodemailer. Appelée en best-effort depuis
// src/hooks/useChallenges.js juste après la création d'un défi (voir
// createChallenge) : un échec ici ne doit jamais bloquer la création du défi
// elle-même, qui est déjà enregistrée en base à ce stade.
//
// Variables d'environnement nécessaires (à définir dans Vercel, PAS dans le
// bundle client) :
//   GMAIL_USER          : l'adresse Gmail dédiée au site (ex: contact@...)
//   GMAIL_APP_PASSWORD  : le "mot de passe d'application" généré dans les
//                         paramètres de sécurité de ce compte Gmail (16
//                         caractères, PAS le mot de passe normal du compte).
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY : déjà utilisées par
//                         api/stripe-webhook.js — nécessaires ici pour lire
//                         l'email et le pseudo des deux utilisateurs (RLS
//                         empêche un client normal de lire l'email d'un
//                         autre compte, donc on passe par le service role,
//                         jamais exposé au navigateur).
//   PUBLIC_APP_URL      : déjà utilisée par create-checkout-session.js, sert
//                         ici à construire le lien vers /amis dans l'email.

import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseUser } from "./_auth.js";

const supabaseAdmin = createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");

function buildTransport() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const caller = await requireSupabaseUser(req, res, supabaseAdmin);
  if (!caller) return;

  const { challengeId } = req.body ?? {};
  if (!challengeId) {
    res.status(400).json({ error: "challengeId requis" });
    return;
  }

  try {
    const { data: challenge, error: challengeError } = await supabaseAdmin
      .from("challenges")
      .select("id, from_user, to_user, chapter_id, notified_at")
      .eq("id", challengeId)
      .eq("from_user", caller.id)
      .maybeSingle();

    if (challengeError || !challenge) {
      res.status(403).json({ error: "Défi introuvable ou non autorisé" });
      return;
    }
    if (challenge.notified_at) {
      res.status(200).json({ sent: false, reason: "already_sent" });
      return;
    }

    const { data: claimed } = await supabaseAdmin
      .from("challenges")
      .update({ notified_at: new Date().toISOString() })
      .eq("id", challenge.id)
      .is("notified_at", null)
      .select("id")
      .maybeSingle();
    if (!claimed) {
      res.status(200).json({ sent: false, reason: "already_sent" });
      return;
    }

    const [{ data: toUser, error: toUserError }, { data: fromProfile }] = await Promise.all([
      supabaseAdmin.auth.admin.getUserById(challenge.to_user),
      supabaseAdmin.from("profiles").select("pseudo").eq("user_id", caller.id).maybeSingle(),
    ]);

    if (toUserError || !toUser?.user?.email) {
      console.error("[notify-challenge] destinataire introuvable:", toUserError?.message);
      res.status(200).json({ sent: false, reason: "no_email" }); // pas d'email connu : rien à faire, mais pas une vraie erreur
      return;
    }

    const fromPseudo = fromProfile?.pseudo ?? "Un ami";
    const safeFromPseudo = escapeHtml(fromPseudo);
    const appUrl = process.env.PUBLIC_APP_URL ?? "https://reussimaths.fr";
    const sujet = challenge.chapter_id ? ` sur le chapitre ${challenge.chapter_id}` : "";

    const transport = buildTransport();
    await transport.sendMail({
      from: `RéussiMaths <${process.env.GMAIL_USER}>`,
      to: toUser.user.email,
      subject: `${fromPseudo} te défie${sujet} !`,
      text: `${fromPseudo} vient de te lancer un défi${sujet} sur RéussiMaths.\n\nRelève le défi ici : ${appUrl}/amis\n\n— L'équipe RéussiMaths`,
      html: `
        <p>${safeFromPseudo} vient de te lancer un défi${sujet} sur RéussiMaths.</p>
        <p><a href="${appUrl}/amis">Relever le défi</a></p>
        <p style="color:#6E7787;font-size:12px;">— L'équipe RéussiMaths</p>
      `,
    });

    res.status(200).json({ sent: true });
  } catch (err) {
    console.error("[notify-challenge]", err);
    // On répond quand même 200 : c'est une notification, pas une action
    // critique — pas la peine de faire remonter une erreur bloquante côté client.
    res.status(200).json({ sent: false, reason: "send_error" });
  }
}
