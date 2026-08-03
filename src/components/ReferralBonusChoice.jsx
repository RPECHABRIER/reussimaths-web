import { useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { chapters } from "../chapters/registry";
import { colors, fonts } from "../theme";

// Affiché dans Account.jsx dès qu'un utilisateur a parrainé 5 amis
// (referralCount >= 5) et n'a pas encore choisi son chapitre bonus. Le choix
// est définitif — la fonction set_referral_bonus_chapter (voir
// supabase/schema.sql) vérifie le seuil de 5 et refuse tout second appel.
export default function ReferralBonusChoice({ onDone }) {
  // Comme pour le Pack Examen, un chapitre déjà gratuit/freemium n'a aucun
  // intérêt à être "choisi".
  const options = useMemo(
    () =>
      chapters
        .filter((c) => !c.meta.free && !c.meta.freemiumDaily)
        .sort((a, b) => a.meta.title.localeCompare(b.meta.title)),
    []
  );

  const [chapterId, setChapterId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    if (!chapterId) return;
    setError(null);
    setSaving(true);
    const { error: rpcError } = await supabase.rpc("set_referral_bonus_chapter", {
      p_chapter_id: chapterId,
    });
    setSaving(false);
    if (rpcError) {
      console.error("[ReferralBonusChoice] set_referral_bonus_chapter:", rpcError.message);
      setError("Une erreur est survenue, réessaie dans un instant.");
      return;
    }
    onDone();
  };

  return (
    <div className="rounded-2xl p-4 text-left flex flex-col gap-3" style={{ backgroundColor: colors.bg }}>
      <p className="text-xs font-semibold" style={{ color: colors.ink }}>
        Bravo, 5 amis parrainés ! Choisis ton chapitre bonus
      </p>
      <p className="text-xs" style={{ color: colors.slate }}>
        Ce choix est définitif (non modifiable ensuite).
      </p>

      <select
        value={chapterId}
        onChange={(e) => setChapterId(e.target.value)}
        className="text-xs rounded-lg px-2.5 py-2"
        style={{ border: `1px solid ${colors.ink}22`, color: colors.ink, backgroundColor: colors.card }}
      >
        <option value="">— Chapitre à débloquer —</option>
        {options.map((c) => (
          <option key={c.meta.id} value={c.meta.id}>
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
        disabled={!chapterId || saving}
        onClick={submit}
        className="py-2 rounded-full font-semibold text-xs"
        style={{ backgroundColor: colors.ink, color: colors.bg, opacity: chapterId && !saving ? 1 : 0.5 }}
      >
        {saving ? "Enregistrement…" : "Valider mon choix"}
      </button>
    </div>
  );
}
