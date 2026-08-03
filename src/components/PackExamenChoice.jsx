import { useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { chapters } from "../chapters/registry";
import { LEVELS } from "../levels";
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
  // Les 2 chapitres bonus n'ont d'intérêt que sur du contenu normalement sous
  // abonnement (pas la peine de "choisir" un chapitre déjà gratuit).
  const bonusOptions = useMemo(
    () =>
      chapters
        .filter((c) => !c.meta.free && !c.meta.freemiumDaily)
        .sort((a, b) => a.meta.title.localeCompare(b.meta.title)),
    []
  );

  const [level, setLevel] = useState("");
  const [bonusA, setBonusA] = useState("");
  const [bonusB, setBonusB] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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
        className="text-xs rounded-lg px-2.5 py-2"
        style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.card }}
      >
        <option value="">— 1er chapitre bonus —</option>
        {bonusOptions.map((c) => (
          <option key={c.meta.id} value={c.meta.id} disabled={c.meta.id === bonusB}>
            {c.meta.title}
          </option>
        ))}
      </select>

      <select
        value={bonusB}
        onChange={(e) => setBonusB(e.target.value)}
        className="text-xs rounded-lg px-2.5 py-2"
        style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.card }}
      >
        <option value="">— 2e chapitre bonus —</option>
        {bonusOptions.map((c) => (
          <option key={c.meta.id} value={c.meta.id} disabled={c.meta.id === bonusA}>
            {c.meta.title}
          </option>
        ))}
      </select>

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
