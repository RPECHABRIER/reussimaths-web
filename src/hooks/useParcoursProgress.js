import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Progression d'un utilisateur sur un parcours donné : une ligne par étape
// terminée (voir supabase/schema.sql, table parcours_progress). Même logique
// que useProgress.js (chapter_progress) : scopé user_id + parcours_id, RLS
// côté Supabase, pas connecté => pas de sauvegarde (juste le state local du
// composant appelant).
export function useParcoursProgress(userId, parcoursId) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId || !parcoursId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("parcours_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("parcours_id", parcoursId)
      .order("step_index", { ascending: true });
    if (error) console.error("[useParcoursProgress] load error:", error.message);
    setRows(data ?? []);
    setLoading(false);
  }, [userId, parcoursId]);

  useEffect(() => {
    load();
  }, [load]);

  // À appeler quand l'élève termine une étape (série notée).
  const recordStep = useCallback(
    async (stepIndex, { correct, total }) => {
      if (!userId || !parcoursId) return;
      const { error } = await supabase.from("parcours_progress").upsert(
        {
          user_id: userId,
          parcours_id: parcoursId,
          step_index: stepIndex,
          completed: true,
          score: correct,
          total,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,parcours_id,step_index" }
      );
      if (error) console.error("[useParcoursProgress] save error:", error.message);
      await load();
    },
    [userId, parcoursId, load]
  );

  const completedSteps = rows.filter((r) => r.completed).length;
  const stepByIndex = new Map(rows.map((r) => [r.step_index, r]));

  return { rows, stepByIndex, completedSteps, loading, recordStep, reload: load };
}
