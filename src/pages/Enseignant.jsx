import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Maximize, ArrowRight, RotateCcw, Settings2, Play, CheckCircle2, RefreshCw, Pencil, X } from "lucide-react";
import { chapters } from "../chapters/registry";
import { LEVELS } from "../levels";
import MathText from "../components/MathText";
import StepsList from "../components/StepsList";
import Figure from "../components/Figure";
import Graph from "../components/Graph";
import { colors, fonts, shadow } from "../theme";

// ---------------------------------------------------------------------------
// Mode Automatismes spécial enseignant (/enseignant) : gratuit, public, sans
// connexion — pensé pour une projection en classe. Réutilise TEL QUEL les
// chapitres Automatismes existants (aucun contenu dupliqué) : l'enseignant
// choisit un niveau, examine plusieurs questions proposées dans chaque thème,
// en sélectionne exactement 5, puis lance
// un diaporama SANS réponse visible (l'enseignant avance à la main avec
// "Suivant") ; à la fin, un écran unique affiche toutes les corrections.
//
// Trois écrans internes (state `view`) : "setup" → "diaporama" → "corrections".
// Pas de score, pas de sauvegarde, pas de compte — usage éphémère en classe.
// ---------------------------------------------------------------------------

function formatAnswer(answer) {
  if (Array.isArray(answer)) return answer.join(" · ");
  return typeof answer === "number" ? String(answer).replace(".", ",") : String(answer);
}

const levelOrder = new Map(LEVELS.map((level, index) => [level.id, index]));
const AUTOMATISMES_CHAPTERS = chapters
  .filter((c) => c.meta.isAutomatismes)
  .sort((a, b) => (levelOrder.get(a.meta.level) ?? 999) - (levelOrder.get(b.meta.level) ?? 999));

function buildThemeProposals(chapter, themeId, count = 3) {
  const proposals = [];
  const prompts = new Set();
  for (let attempt = 0; proposals.length < count && attempt < count * 8; attempt += 1) {
    const exercise = chapter.generate(themeId);
    if (!exercise || prompts.has(exercise.prompt)) continue;
    prompts.add(exercise.prompt);
    proposals.push({ id: `${themeId}-${Date.now()}-${attempt}-${Math.random().toString(36).slice(2, 7)}`, themeId, exercise });
  }
  return proposals;
}

function buildChapterProposals(chapter) {
  return Object.fromEntries(chapter.themes.map((theme) => [theme.id, buildThemeProposals(chapter, theme.id)]));
}

export default function Enseignant() {
  const [view, setView] = useState("setup");
  const [levelId, setLevelId] = useState("");
  const [proposals, setProposals] = useState({});
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ prompt: "", answer: "" });
  const [exercises, setExercises] = useState([]);
  const [index, setIndex] = useState(0);

  const chapter = useMemo(() => AUTOMATISMES_CHAPTERS.find((c) => c.meta.level === levelId) ?? null, [levelId]);
  const total = selectedQuestions.length;

  const selectLevel = (id) => {
    setLevelId(id);
    const selectedChapter = AUTOMATISMES_CHAPTERS.find((item) => item.meta.level === id);
    setProposals(selectedChapter ? buildChapterProposals(selectedChapter) : {});
    setSelectedQuestions([]);
    setEditingId(null);
  };

  const toggleQuestion = (proposal) => {
    setSelectedQuestions((current) => {
      if (current.some((item) => item.id === proposal.id)) return current.filter((item) => item.id !== proposal.id);
      if (current.length >= 5) return current;
      return [...current, proposal];
    });
  };

  const refreshTheme = (themeId) => {
    if (!chapter) return;
    const removedIds = new Set((proposals[themeId] ?? []).map((item) => item.id));
    setSelectedQuestions((current) => current.filter((item) => !removedIds.has(item.id)));
    setProposals((current) => ({ ...current, [themeId]: buildThemeProposals(chapter, themeId) }));
  };

  const startEditing = (proposal) => {
    setEditingId(proposal.id);
    setEditDraft({ prompt: proposal.exercise.prompt, answer: formatAnswer(proposal.exercise.answer) });
  };

  const saveCustomization = (proposal) => {
    const prompt = editDraft.prompt.trim();
    const rawAnswer = editDraft.answer.trim();
    if (!prompt || !rawAnswer) return;
    const parsed = Number(rawAnswer.replace(",", "."));
    const answer = typeof proposal.exercise.answer === "number" && Number.isFinite(parsed) ? parsed : rawAnswer;
    const updated = {
      ...proposal,
      exercise: {
        ...proposal.exercise,
        prompt,
        answer,
        steps: [{ type: "resultat", text: `Réponse attendue : ${formatAnswer(answer)}` }],
        teacherCustomized: true,
      },
    };
    setProposals((current) => ({ ...current, [proposal.themeId]: (current[proposal.themeId] ?? []).map((item) => item.id === proposal.id ? updated : item) }));
    setSelectedQuestions((current) => current.map((item) => item.id === proposal.id ? updated : item));
    setEditingId(null);
  };

  const launch = () => {
    if (!chapter || total !== 5) return;
    setExercises(selectedQuestions.map((item) => item.exercise));
    setIndex(0);
    setView("diaporama");
  };

  const launchDemo = () => {
    const demoChapter = AUTOMATISMES_CHAPTERS[0];
    if (!demoChapter) return;
    const demoThemes = demoChapter.themes.slice(0, 5);
    const demoExercises = demoThemes.map((theme) => demoChapter.generate(theme.id));
    setLevelId(demoChapter.meta.level);
    setProposals(buildChapterProposals(demoChapter));
    setSelectedQuestions([]);
    setExercises(demoExercises);
    setIndex(0);
    setView("diaporama");
  };

  const next = () => {
    if (index < exercises.length - 1) setIndex((i) => i + 1);
    else setView("corrections");
  };

  const restartSameParams = () => {
    launch();
  };

  const backToSetup = () => {
    setView("setup");
    setExercises([]);
    setIndex(0);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  };

  useEffect(() => {
    if (view !== "diaporama") return undefined;
    const handleKey = (event) => {
      if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
        event.preventDefault();
        next();
      }
      if (event.key.toLowerCase() === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [view, index, exercises.length]);

  const ink = colors.ink;
  const paper = colors.bg;
  const slate = colors.slate;
  const gold = colors.gold;

  // -------------------------------------------------------------- SETUP ---
  if (view === "setup") {
    return (
      <div className="min-h-screen w-full p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-semibold mb-4" style={{ color: slate }}>
            <ArrowLeft size={14} /> Accueil
          </Link>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start py-5 lg:py-10">
            <section className="lg:sticky lg:top-8">
              <p className="text-xs tracking-widest uppercase font-bold" style={{ color: gold, letterSpacing: "0.12em" }}>Gratuit · sans compte</p>
              <h1 className="mt-3" style={{ fontFamily: fonts.display, color: ink, fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.03, fontWeight: 900, letterSpacing: "-0.04em" }}>
                Votre rituel de maths, prêt à projeter.
              </h1>
              <p className="text-base mt-5 max-w-lg leading-relaxed" style={{ color: slate }}>
                Composez 5 automatismes en moins d’une minute. Les questions s’affichent sans réponse, puis toutes les corrections détaillées arrivent ensemble.
              </p>
              <div className="grid grid-cols-3 gap-2 mt-7">
                {["Choisissez", "Projetez", "Corrigez"].map((label, i) => (
                  <div key={label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
                    <p className="text-lg font-black" style={{ color: gold }}>{i + 1}</p>
                    <p className="text-xs font-semibold mt-1" style={{ color: ink }}>{label}</p>
                  </div>
                ))}
              </div>
              <button type="button" onClick={launchDemo} className="w-full sm:w-auto mt-5 py-3.5 px-6 rounded-full font-bold flex items-center justify-center gap-2" style={{ backgroundColor: ink, color: paper, boxShadow: shadow.raised }}>
                <Play size={16} /> Lancer la démo en un clic
              </button>
              <p className="text-xs mt-3" style={{ color: slate }}>Aucune préparation et aucun compte élève nécessaires.</p>

              <div className="mt-7">
                <Link to="/niveaux?objectif=essai" className="py-3 px-4 rounded-2xl flex items-center justify-between gap-3" style={{ backgroundColor: colors.card, color: ink, border: `1px solid ${colors.hairline}` }}>
                  <div><p className="text-sm font-semibold">Voir l’expérience élève</p><p className="text-xs mt-0.5" style={{ color: slate }}>Choix du niveau, diagnostic puis série gratuite</p></div>
                  <CheckCircle2 size={18} color={gold} />
                </Link>
              </div>
            </section>

            <section className="rounded-[2rem] p-5 sm:p-7" style={{ backgroundColor: colors.card, boxShadow: shadow.raised, border: `1px solid ${colors.hairline}` }}>
              <div className="flex items-start justify-between gap-3 mb-6">
                <div><p className="text-xs uppercase tracking-widest font-bold" style={{ color: gold }}>Créer une séance</p><h2 className="text-2xl font-black mt-1" style={{ color: ink }}>Choisissez vos 5 questions</h2></div>
                <p aria-live="polite" className="text-sm font-black px-3 py-1.5 rounded-full" style={{ color: total === 5 ? colors.green : gold, backgroundColor: total === 5 ? `${colors.green}18` : `${gold}18` }}>{total} / 5</p>
              </div>

            <label htmlFor="teacher-level" className="block text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: slate }}>
              1. Niveau
            </label>
            <select
              id="teacher-level"
              value={levelId}
              onChange={(e) => selectLevel(e.target.value)}
              className="w-full text-sm rounded-xl px-3 py-2.5"
              style={{ border: `1px solid ${colors.hairline}`, color: ink, backgroundColor: colors.bg }}
            >
              <option value="">— Choisir un niveau —</option>
              {AUTOMATISMES_CHAPTERS.map((c) => {
                const level = LEVELS.find((l) => l.id === c.meta.level);
                return (
                  <option key={c.meta.level} value={c.meta.level}>
                    {level?.label ?? c.meta.level}
                  </option>
                );
              })}
            </select>
              <div className="my-5" style={{ height: 1, backgroundColor: colors.hairline }} />

          {chapter && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: slate }}>
                  2. Sélectionnez précisément les questions
                </p>
              </div>
              <p className="text-xs mb-4" style={{color:slate}}>Trois propositions sont affichées par thème. Cochez celles qui correspondent exactement à votre séance ; leur ordre de sélection sera conservé.</p>
              <div className="flex flex-col gap-4">
                {chapter.themes.map((t) => {
                  return (
                    <div key={t.id} className="rounded-2xl p-3" style={{ backgroundColor: colors.bg }}>
                      <div className="flex items-center justify-between gap-3"><p className="text-sm font-black" style={{ color: ink }}>{t.title}</p><button type="button" onClick={()=>refreshTheme(t.id)} className="inline-flex items-center gap-1 text-[10px] font-bold" style={{color:gold}}><RefreshCw size={12}/> Autres questions</button></div>
                      <div className="mt-2 grid gap-2">
                        {(proposals[t.id] ?? []).map((proposal) => {
                          const selectedIndex = selectedQuestions.findIndex((item)=>item.id===proposal.id);
                          const selected = selectedIndex >= 0;
                          const editable = ["numeric", "text"].includes(proposal.exercise.type) && !proposal.exercise.figure && !proposal.exercise.graph && !Array.isArray(proposal.exercise.answer);
                          return <div key={proposal.id} className="rounded-xl p-3" style={{backgroundColor:selected?`${colors.green}12`:colors.card,border:`1px solid ${selected?colors.green:colors.hairline}`,opacity:!selected&&total>=5?.55:1}}>{editingId===proposal.id?<div><label className="block text-[10px] font-bold" style={{color:slate}}>Énoncé personnalisé<textarea rows={3} value={editDraft.prompt} onChange={(event)=>setEditDraft((current)=>({...current,prompt:event.target.value}))} className="mt-1 w-full rounded-lg border bg-white p-2 text-xs" style={{borderColor:colors.hairline,color:ink}}/></label><label className="block mt-2 text-[10px] font-bold" style={{color:slate}}>Réponse attendue<input value={editDraft.answer} onChange={(event)=>setEditDraft((current)=>({...current,answer:event.target.value}))} className="mt-1 w-full rounded-lg border bg-white p-2 text-xs" style={{borderColor:colors.hairline,color:ink}}/></label><p className="mt-2 text-[10px]" style={{color:slate}}>Après modification, la correction affiche cette réponse attendue afin de ne pas conserver des calculs liés aux anciennes valeurs.</p><div className="mt-2 flex gap-2"><button type="button" onClick={()=>saveCustomization(proposal)} className="rounded-full px-3 py-1.5 text-[10px] font-black" style={{backgroundColor:gold,color:ink}}>Enregistrer</button><button type="button" onClick={()=>setEditingId(null)} className="inline-flex items-center gap-1 px-2 text-[10px] font-bold" style={{color:slate}}><X size={11}/> Annuler</button></div></div>:<div className="flex items-start gap-2"><button type="button" onClick={()=>toggleQuestion(proposal)} disabled={!selected&&total>=5} className="min-w-0 flex-1 text-left flex items-start gap-3"><span className="shrink-0 flex items-center justify-center rounded-full text-[10px] font-black" style={{width:24,height:24,backgroundColor:selected?colors.green:`${ink}0d`,color:selected?"white":slate}}>{selected?selectedIndex+1:"+"}</span><span className="min-w-0"><MathText as="span" text={proposal.exercise.prompt} className="text-xs leading-relaxed" style={{color:ink}}/>{proposal.exercise.teacherCustomized&&<span className="block mt-1 text-[9px] font-black uppercase tracking-wide" style={{color:gold}}>Question personnalisée</span>}</span></button>{editable&&<button type="button" onClick={()=>startEditing(proposal)} className="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold" style={{backgroundColor:colors.bg,color:slate}}><Pencil size={10}/> Modifier</button>}</div>}</div>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

              <button
            type="button"
            disabled={total !== 5}
            onClick={launch}
            className="w-full mt-5 py-3.5 rounded-full font-bold flex items-center justify-center gap-2"
            style={{ backgroundColor: total === 5 ? gold : colors.hairline, color: total === 5 ? ink : slate, opacity: total === 5 ? 1 : 0.75, display: chapter ? undefined : "none" }}
          >
            <Play size={16} /> Lancer le diaporama
          </button>
              {!chapter && <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: colors.bg }}><p className="text-sm font-semibold" style={{ color: ink }}>Choisissez un niveau pour afficher les propositions.</p><p className="text-xs mt-1" style={{ color: slate }}>Vous pourrez examiner puis sélectionner exactement cinq questions.</p></div>}
            </section>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------- DIAPORAMA ---
  if (view === "diaporama") {
    const exercise = exercises[index];
    const isLast = index === exercises.length - 1;
    return (
      <div className="min-h-screen w-full flex flex-col p-4 sm:p-10" style={{ background: paper, fontFamily: fonts.body }}>
        <div className="flex items-center justify-between max-w-3xl w-full mx-auto mb-8">
          <button onClick={backToSetup} className="text-xs font-semibold flex items-center gap-1" style={{ color: slate }}>
            <Settings2 size={14} /> Quitter
          </button>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: gold, letterSpacing: "0.1em" }}>
            Question {index + 1} / {exercises.length}
          </p>
          <button onClick={toggleFullscreen} className="text-xs font-semibold flex items-center gap-1" style={{ color: slate }}>
            <Maximize size={14} /> Plein écran
          </button>
        </div>

        <div className="max-w-3xl w-full mx-auto h-1.5 rounded-full overflow-hidden -mt-5 mb-5" style={{ backgroundColor: `${ink}0d` }}><div className="h-full rounded-full transition-all" style={{ width: `${((index + 1) / exercises.length) * 100}%`, backgroundColor: gold }} /></div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto text-center">
          <p className="text-sm uppercase tracking-wide font-semibold mb-4" style={{ color: slate }}>
            {exercise.chapter}
          </p>
          <MathText
            as="p"
            text={exercise.prompt}
            style={{ fontFamily: fonts.display, color: ink, fontSize: "clamp(1.5rem, 4vw, 2.4rem)", fontWeight: 700, lineHeight: 1.35 }}
          />

          {exercise.figure && (
            <div className="mt-6">
              <Figure spec={exercise.figure} />
            </div>
          )}
          {exercise.graph && (
            <div className="mt-6">
              <Graph spec={exercise.graph} />
            </div>
          )}

          {exercise.type === "qcm" && Array.isArray(exercise.options) && (
            <div className="grid sm:grid-cols-2 gap-3 mt-8 w-full max-w-2xl">
              {exercise.options.map((opt, i) => (
                <div
                  key={i}
                  className="rounded-2xl px-5 py-4 text-lg flex items-center justify-center min-h-16"
                  style={{ backgroundColor: colors.card, boxShadow: shadow.soft, color: ink }}
                >
                  <MathText text={typeof opt === "string" ? opt : String(opt)} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-3xl w-full mx-auto mt-8">
          <button
            onClick={next}
            className="w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2"
            style={{ backgroundColor: gold, color: ink }}
          >
            {isLast ? "Voir les corrections" : "Suivant"}
            <ArrowRight size={20} />
          </button>
          <p className="hidden sm:block text-center text-[11px] mt-3" style={{ color: slate }}>Flèche droite, Entrée ou Espace pour avancer · F pour le plein écran</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------- CORRECTIONS --
  return (
    <div className="min-h-screen w-full p-4 sm:p-10" style={{ background: paper, fontFamily: fonts.body }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-7">
          <p className="text-xs tracking-widest uppercase mb-1 font-semibold" style={{ color: gold, letterSpacing: "0.12em" }}>
            Correction collective
          </p>
          <h1 style={{ fontFamily: fonts.display, color: ink, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Les 5 réponses
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          {exercises.map((ex, i) => (
            <div key={i} className="rounded-3xl p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
              <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: slate }}>
                Question {i + 1} — {ex.chapter}
              </p>
              <MathText as="p" text={ex.prompt} className="mb-3" style={{ fontFamily: fonts.mono, fontSize: "1.05rem", color: ink }} />
              {ex.figure && <Figure spec={ex.figure} />}
              {ex.graph && <Graph spec={ex.graph} />}
              <div className="rounded-xl px-4 py-2.5 mb-2 mt-2" style={{ backgroundColor: `${colors.green}14` }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: colors.green }}>
                  Réponse
                </p>
                <MathText text={formatAnswer(ex.answer)} style={{ color: ink, fontWeight: 700 }} />
              </div>
              {Array.isArray(ex.steps) && ex.steps.length > 0 && <StepsList steps={ex.steps} dark={false} />}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5 mt-6">
          <button
            onClick={restartSameParams}
            className="w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2"
            style={{ backgroundColor: gold, color: ink }}
          >
            <RotateCcw size={16} /> Rejouer ces 5 questions
          </button>
          <button onClick={backToSetup} className="w-full py-2.5 rounded-full text-sm font-medium" style={{ color: slate }}>
            Modifier les réglages
          </button>
        </div>
      </div>
    </div>
  );
}
