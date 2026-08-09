import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Maximize, ArrowRight, RotateCcw, Settings2, Play, CheckCircle2 } from "lucide-react";
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
// choisit un niveau, répartit 5 questions entre les thèmes de ce niveau
// (ex : 2 en multiplication, 1 en géométrie, 2 en pourcentages), puis lance
// un diaporama SANS réponse visible (l'enseignant avance à la main avec
// "Suivant") ; à la fin, un écran unique affiche toutes les corrections.
//
// Trois écrans internes (state `view`) : "setup" → "diaporama" → "corrections".
// Pas de score, pas de sauvegarde, pas de compte — usage éphémère en classe.
// ---------------------------------------------------------------------------

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function formatAnswer(answer) {
  if (Array.isArray(answer)) return answer.join(" · ");
  return typeof answer === "number" ? String(answer).replace(".", ",") : String(answer);
}

const levelOrder = new Map(LEVELS.map((level, index) => [level.id, index]));
const AUTOMATISMES_CHAPTERS = chapters
  .filter((c) => c.meta.isAutomatismes)
  .sort((a, b) => (levelOrder.get(a.meta.level) ?? 999) - (levelOrder.get(b.meta.level) ?? 999));

export default function Enseignant() {
  const [view, setView] = useState("setup");
  const [levelId, setLevelId] = useState("");
  const [counts, setCounts] = useState({}); // { [themeId]: nombre de questions }
  const [exercises, setExercises] = useState([]);
  const [index, setIndex] = useState(0);

  const chapter = useMemo(() => AUTOMATISMES_CHAPTERS.find((c) => c.meta.level === levelId) ?? null, [levelId]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const selectLevel = (id) => {
    setLevelId(id);
    setCounts({});
  };

  const adjustCount = (themeId, delta) => {
    setCounts((prev) => {
      const current = prev[themeId] ?? 0;
      const next = Math.max(0, Math.min(5, current + delta));
      if (next === 0) {
        const { [themeId]: _drop, ...rest } = prev;
        return rest;
      }
      return { ...prev, [themeId]: next };
    });
  };

  const launch = () => {
    if (!chapter || total !== 5) return;
    const drawn = Object.entries(counts).flatMap(([themeId, n]) => Array.from({ length: n }, () => chapter.generate(themeId)));
    setExercises(shuffle(drawn));
    setIndex(0);
    setView("diaporama");
  };

  const launchDemo = () => {
    const demoChapter = AUTOMATISMES_CHAPTERS[0];
    if (!demoChapter) return;
    const demoThemes = demoChapter.themes.slice(0, 5);
    const demoExercises = demoThemes.map((theme) => demoChapter.generate(theme.id));
    setLevelId(demoChapter.meta.level);
    setCounts(Object.fromEntries(demoThemes.map((theme) => [theme.id, 1])));
    setExercises(shuffle(demoExercises));
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
                <div><p className="text-xs uppercase tracking-widest font-bold" style={{ color: gold }}>Créer une séance</p><h2 className="text-2xl font-black mt-1" style={{ color: ink }}>5 questions, vos thèmes</h2></div>
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
                  2. Répartis 5 questions par thème
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                {chapter.themes.map((t) => {
                  const count = counts[t.id] ?? 0;
                  return (
                    <div key={t.id} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2" style={{ backgroundColor: colors.bg }}>
                      <p className="text-sm flex-1 min-w-0 truncate" style={{ color: ink }}>
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          aria-label={`Retirer une question pour ${t.title}`}
                          onClick={() => adjustCount(t.id, -1)}
                          disabled={count === 0}
                          className="flex items-center justify-center rounded-full"
                          style={{ width: 30, height: 30, backgroundColor: colors.card, color: ink, opacity: count === 0 ? 0.35 : 1 }}
                        >
                          <Minus size={14} />
                        </button>
                        <p className="text-sm font-bold w-4 text-center" style={{ color: ink }}>
                          {count}
                        </p>
                        <button
                          aria-label={`Ajouter une question pour ${t.title}`}
                          onClick={() => adjustCount(t.id, 1)}
                          disabled={total >= 5}
                          className="flex items-center justify-center rounded-full"
                          style={{ width: 30, height: 30, backgroundColor: colors.card, color: ink, opacity: total >= 5 ? 0.35 : 1 }}
                        >
                          <Plus size={14} />
                        </button>
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
              {!chapter && <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: colors.bg }}><p className="text-sm font-semibold" style={{ color: ink }}>Choisissez un niveau pour afficher ses thèmes.</p><p className="text-xs mt-1" style={{ color: slate }}>Vous pourrez répartir exactement cinq questions.</p></div>}
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
            <RotateCcw size={16} /> Nouveau diaporama (mêmes réglages)
          </button>
          <button onClick={backToSetup} className="w-full py-2.5 rounded-full text-sm font-medium" style={{ color: slate }}>
            Modifier les réglages
          </button>
        </div>
      </div>
    </div>
  );
}
