import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Progression + statut d'abonnement d'un utilisateur pour un chapitre donné.
// Tout est scopé par user_id + chapter_id, avec RLS côté Supabase (voir
// supabase/schema.sql) pour qu'un utilisateur ne puisse lire/écrire que ses
// propres lignes.
export function useProgress(userId, chapterId) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId || !chapterId) {
      setProgress(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("chapter_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("chapter_id", chapterId)
      .maybeSingle();
    if (error) console.error("[useProgress] load error:", error.message);
    setProgress(data ?? { score: 0, best_streak: 0 });
    setLoading(false);
  }, [userId, chapterId]);

  useEffect(() => {
    load();
  }, [load]);

  // À appeler après chaque exercice résolu, avec le score/streak à jour.
  const recordResult = useCallback(
    async ({ score, bestStreak }) => {
      if (!userId || !chapterId) return; // pas connecté : pas de sauvegarde, juste le state local du composant
      const { error } = await supabase.from("chapter_progress").upsert(
        {
          user_id: userId,
          chapter_id: chapterId,
          score,
          best_streak: bestStreak,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,chapter_id" }
      );
      if (error) console.error("[useProgress] save error:", error.message);
    },
    [userId, chapterId]
  );

  return { progress, loading, recordResult, reload: load };
}

// Statut d'abonnement (mis à jour côté serveur par le webhook Stripe, voir
// api/stripe-webhook.js — sauf pack_examen_level/pack_examen_bonus_chapters,
// écrits une seule fois par l'abonné Pack Examen lui-même via la fonction RPC
// set_pack_examen_choices, voir src/components/PackExamenChoice.jsx). Le
// front ne fait que le lire.
export function useSubscription(userId) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle();
    if (error) console.error("[useSubscription] load error:", error.message);
    setSubscription(data ?? null);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  // "special_examen" est un paiement unique, non reconductible : sa date de
  // fin (current_period_end, fixée à +3 mois par le webhook) doit être
  // respectée même si le statut est resté "active" en base (voir
  // api/stripe-webhook.js — aucun événement Stripe ne viendra le repasser à
  // "canceled" tout seul, contrairement à un abonnement classique).
  const notExpired = !subscription?.current_period_end || new Date(subscription.current_period_end) > new Date();
  const isActive = (subscription?.status === "active" || subscription?.status === "trialing") && notExpired;
  return { subscription, isActive, loading, reload: load };
}
