import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpenCheck, Check, CircleHelp, History } from "lucide-react";
import { getChaptersByLevel } from "../chapters/registry";
import { getLevel } from "../levels";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import { getStudyProgramme, setStudyProgramme, STUDY_STATUSES } from "../lib/studyProgramme";
import { trackProductEvent } from "../lib/productAnalytics";
import { colors, fonts, shadow, cycleColors } from "../theme";

export default function ClassProgramme() {
  const { levelId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const trial = searchParams.get("objectif") === "essai";
  const level = getLevel(levelId);
  const chapters = useMemo(
    () => getChaptersByLevel(levelId).filter((chapter) => !chapter.meta.free && !chapter.meta.freemiumDaily),
    [levelId],
  );
  const [selections, setSelections] = useState(() => getStudyProgramme(levelId));
  const [syncing, setSyncing] = useState(false);
  const accent = cycleColors[level?.cycle]?.accent ?? colors.gold;

  useEffect(() => {
    if (!user?.id || !levelId) return;
    let cancelled = false;
    supabase
      .from("student_study_topics")
      .select("chapter_id,status")
      .eq("user_id", user.id)
      .eq("level_id", levelId)
      .then(({ data, error }) => {
        if (cancelled || error || !data?.length) return;
        const remote = Object.fromEntries(data.map((row) => [row.chapter_id, row.status]));
        setSelections(remote);
        setStudyProgramme(levelId, remote);
      });
    return () => { cancelled = true; };
  }, [user?.id, levelId]);

  if (!level || chapters.length === 0) {
    return <div className="min-h-screen flex items-center justify-center p-6" style={{ background: colors.bg, color: colors.slate }}>Programme indisponible.</div>;
  }

  const setStatus = (chapterId, status) => {
    setSelections((previous) => {
      const next = { ...previous };
      if (next[chapterId] === status) delete next[chapterId];
      else next[chapterId] = status;
      return next;
    });
  };

  const continueToDiagnostic = async (unknown = false) => {
    const chosen = unknown ? {} : selections;
    setStudyProgramme(levelId, chosen);
    trackProductEvent("study_topics_selected", { levelId, count: Object.keys(chosen).length, unknown, trial });
    if (user?.id) {
      setSyncing(true);
      const rows = Object.entries(chosen).map(([chapterId, status]) => ({ user_id: user.id, level_id: levelId, chapter_id: chapterId, status }));
      const { error: deleteError } = await supabase.from("student_study_topics").delete().eq("user_id", user.id).eq("level_id", levelId);
      if (!deleteError && rows.length) await supabase.from("student_study_topics").insert(rows);
      setSyncing(false);
    }
    navigate(`/parcours/niveau/${levelId}/diagnostic${trial ? "?objectif=essai" : ""}`);
  };

  const count = Object.keys(selections).length;
  return (
    <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-3xl mx-auto">
        <Link to={trial ? "/niveaux?objectif=essai" : `/niveau/${levelId}`} className="text-xs font-semibold" style={{ color: colors.slate }}>← Changer de niveau</Link>
        <header className="text-center mt-7 mb-7">
          <div className="mx-auto flex items-center justify-center rounded-2xl" style={{ width: 56, height: 56, backgroundColor: `${accent}18` }}><BookOpenCheck size={27} color={accent} /></div>
          <p className="text-xs uppercase tracking-widest font-bold mt-4" style={{ color: accent }}>Programme de {level.label}</p>
          <h1 className="mt-2" style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "clamp(1.9rem, 6vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.05 }}>Où en es-tu en classe ?</h1>
          <p className="text-sm sm:text-base mt-3 max-w-xl mx-auto" style={{ color: colors.slate }}>Indique ce que tu travailles actuellement et ce que ta classe a déjà étudié. Nous vérifierons aussi les prérequis utiles de l’année précédente.</p>
        </header>

        <div className="grid gap-3">
          {chapters.map((chapter) => {
            const status = selections[chapter.meta.id];
            return (
              <div key={chapter.meta.id} className="rounded-2xl p-4 sm:flex sm:items-center sm:justify-between gap-4" style={{ backgroundColor: colors.card, boxShadow: shadow.soft, border: `1px solid ${status ? `${accent}55` : colors.hairline}` }}>
                <div className="min-w-0"><p className="font-bold" style={{ color: colors.ink }}>{chapter.meta.title}</p>{chapter.meta.description && <p className="text-xs mt-1 line-clamp-2" style={{ color: colors.slate }}>{chapter.meta.description}</p>}</div>
                <div className="grid grid-cols-2 gap-2 mt-3 sm:mt-0 shrink-0">
                  <button type="button" onClick={() => setStatus(chapter.meta.id, STUDY_STATUSES.CURRENT)} className="px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5" style={{ backgroundColor: status === STUDY_STATUSES.CURRENT ? accent : colors.bg, color: status === STUDY_STATUSES.CURRENT ? colors.bg : colors.ink }}><BookOpenCheck size={14} /> En cours</button>
                  <button type="button" onClick={() => setStatus(chapter.meta.id, STUDY_STATUSES.COMPLETED)} className="px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5" style={{ backgroundColor: status === STUDY_STATUSES.COMPLETED ? colors.green : colors.bg, color: status === STUDY_STATUSES.COMPLETED ? colors.bg : colors.ink }}><Check size={14} /> Déjà vu</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-3 mt-6 rounded-3xl p-4 sm:p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.raised, border: `1px solid ${colors.hairline}` }}>
          <button disabled={count === 0 || syncing} onClick={() => continueToDiagnostic(false)} className="w-full py-3.5 rounded-full font-bold flex items-center justify-center gap-2" style={{ backgroundColor: colors.ink, color: colors.bg, opacity: count ? 1 : 0.45 }}>{syncing ? "Enregistrement…" : `Continuer avec ${count} chapitre${count > 1 ? "s" : ""}`} <ArrowRight size={16} /></button>
          <button disabled={syncing} onClick={() => continueToDiagnostic(true)} className="w-full mt-2 py-2 text-xs font-semibold inline-flex items-center justify-center gap-1.5" style={{ color: colors.slate }}><CircleHelp size={14} /> Je ne sais pas encore — tester mes acquis précédents</button>
          <p className="text-[11px] text-center mt-1 flex items-center justify-center gap-1" style={{ color: colors.slate }}><History size={12} /> Tu pourras modifier ces choix à tout moment.</p>
        </div>
      </div>
    </div>
  );
}
