import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { chapters } from "../chapters/registry";
import { LEVELS } from "../levels";
import { EXAM_CHAPTER_BY_LEVEL } from "../lib/access";
import { colors, fonts } from "../theme";

// Affiché une seule fois à un abonné Pack Examen tant qu'il n'a pas encore
// choisi son niveau + ses 2 chapitres bonus (subscription.pack_examen_level
// est alors null, voir Account.jsx). Le choix est définitif — la fonction
// set_pack_examen_choices (voir supabase/schema.sql) refuse tout second
// appel une fois pack_examen_level renseigné.
export default function PackExamenChoice({ onDone }) {
  // Seuls les niveaux avec du vrai contenu (pas de choix possible sur
  // Première/Terminale technologique, pas encore de chapitres).
  const levelsWithContent = useMemo(
    () => LEVELS.filter((l) => chapters.some((c) => c.meta.level === l.id)),
    []
  );

  const [level, setLevel] = useState("");
  const [bonusA, setBonusA] = useState("");
  const [bonusB, setBonusB] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Les 2 chapitres bonus ne doivent proposer QUE le niveau choisi (pas
  // l'ensemble du catalogue) — sinon le Pack Examen finirait par donner accès
  // à des niveaux entiers non payés. On exclut aussi le chapitre gratuit et
  // le chapitre d'examen du niveau (déjà débloqué par le Pack Examen, pas la
  // peine de "choisir" un chapitre déjà accessible).
  const bonusOptions = useMemo(() => {
    if (!level) return [];
    const examChapterId = EXAM_CHAPTER_BY_LEVEL[level];
    return chapters
      .filter((c) => c.meta.level === level)
      .filter((c) => !c.meta.free && !c.meta.freemiumDaily)
      .filter((c) => c.meta.id !== examChapterId)
      .sort((a, b) => a.meta.title.localeCompare(b.meta.title));
  }, [level]);

  // Si le niveau change, les chapitres bonus déjà sélectionnés ne sont plus
  // forcément valides (autre niveau) — on repart de zéro.
  useEffect(() => {
    setBonusA("");
    setBonusB("");
  }, [level]);

  const canSubmit = !!level && !!bonusA && !!bonusB && bonusA !== bonusB;

  const submit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSaving(true);
    const { error: rpcError } = await supabase.rpc("set_pack_examen_choices", {
      p_level: level,
      p_bonus_chapters: [bonusA, bonusB],
    });
    setSaving(false);
    if (rpcError) {
      console.error("[PackExamenChoice] set_pack_examen_choices:", rpcError.message);
      setError("Une erreur est survenue, réessaie dans un instant.");
      return;
    }
    onDone();
  };

  return (
    <div className="rounded-2xl p-4 text-left flex flex-col gap-3" style={{ backgroundColor: colors.bg }}>
      <p className="text-xs font-semibold" style={{ color: colors.ink }}>
        Choisis ton niveau + 2 chapitres bonus
      </p>
      <p className="text-xs" style={{ color: colors.slate }}>
        Pour le niveau que tu choisis, le Pack Examen débloque : le chapitre de préparation à l'examen (Brevet, EAM ou
        Bac selon le niveau), les Automatismes en illimité, et 2 chapitres bonus de ce même niveau.
      </p>
      <p className="text-xs" style={{ color: colors.slate }}>
        Ce choix est définitif (non modifiable ensuite) : abonne-toi en complet pour tout débloquer.
      </p>

      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="text-xs rounded-lg px-2.5 py-2"
        style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.card }}
      >
        <option value="">— Niveau souhaité —</option>
        {levelsWithContent.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
          </option>
        ))}
      </select>

      <select
        value={bonusA}
        onChange={(e) => setBonusA(e.target.value)}
        disabled={!level}
        className="text-xs rounded-lg px-2.5 py-2"
        style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.card, opacity: level ? 1 : 0.5 }}
      >
        <option value="">— 1er chapitre bonus ({levelsWithContent.find((l) => l.id === level)?.label ?? "choisis d'abord un niveau"}) —</option>
        {bonusOptions.map((c) => (
          <option key={c.meta.id} value={c.meta.id} disabled={c.meta.id === bonusB}>
            {c.meta.title}
          </option>
        ))}
      </select>

      <select
        value={bonusB}
        onChange={(e) => setBonusB(e.target.value)}
        disabled={!level}
        className="text-xs rounded-lg px-2.5 py-2"
        style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.card, opacity: level ? 1 : 0.5 }}
      >
        <option value="">— 2e chapitre bonus ({levelsWithContent.find((l) => l.id === level)?.label ?? "choisis d'abord un niveau"}) —</option>
        {bonusOptions.map((c) => (
          <option key={c.meta.id} value={c.meta.id} disabled={c.meta.id === bonusA}>
            {c.meta.title}
          </option>
        ))}
      </select>

      {level && bonusOptions.length === 0 && (
        <p className="text-xs" style={{ color: colors.slate }}>
          Ce niveau n'a pas encore de chapitre bonus disponible.
        </p>
      )}

      {error && (
        <p className="text-xs" style={{ color: colors.red }}>
          {error}
        </p>
      )}

      <button
        disabled={!canSubmit || saving}
        onClick={submit}
        className="py-2 rounded-full font-semibold text-xs"
        style={{ backgroundColor: colors.ink, color: colors.bg, opacity: canSubmit && !saving ? 1 : 0.5 }}
      >
        {saving ? "Enregistrement…" : "Valider mon choix"}
      </button>
    </div>
  );
}
