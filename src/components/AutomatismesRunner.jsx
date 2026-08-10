import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, Timer, ArrowLeft, ArrowRight, Trophy, Lock, Square, CheckSquare, Shuffle } from "lucide-react";
import MathText from "./MathText";
import StepsList from "./StepsList";
import LearningFeedback from "./LearningFeedback";
import Figure from "./Figure";
import Graph from "./Graph";
import { matchesText, matchesMulti, parseNumericInput } from "../lib/answerMatch";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useProgress";
import { useDailyQuota } from "../hooks/useDailyQuota";
import { useSkillTracking } from "../hooks/useSkillTracking";
import { useDailyStreak } from "../hooks/useDailyStreak";
import { usePracticeHeartbeat } from "../hooks/usePracticeHeartbeat";
import { hasUnlimitedQuota, getEffectiveSubscription } from "../lib/access";
import { useAutomatismesBestTime } from "../hooks/useAutomatismesBestTime";
import { colors, fonts, shadow } from "../theme";

const QUESTIONS_PER_SERIES = 5;

function formatDuration(ms) {
  const s = ms / 1000;
  return s < 10 ? `${s.toFixed(1)}s` : `${Math.round(s)}s`;
}

// ---------------------------------------------------------------------------
// Écran dédié au chapitre "Automatismes" (remplace <ChapterRunner /> pour ce
// chapitre précis, voir ChapterPage.jsx qui teste chapter.meta.isAutomatismes).
// Mécanique différente du reste de l'app : au lieu du mode classique/jeu à
// questions infinies, l'entraînement se fait par séries chronométrées de 5
// questions, sur un thème choisi (un chapitre du manuel) ou un "Mélange" de
// tous les chapitres (voir chapter.themes et chapter.generate(themeId), tous
// deux définis dans src/chapters/automatismes-sixieme.js).
//
// Les abonnés voient leur record (meilleur score, puis meilleur temps à score
// égal) sauvegardé par thème (voir useAutomatismesBestTime / table Supabase
// automatismes_best_times) et peuvent essayer de le battre à la série
// suivante. Les non-abonnés ont un quota quotidien (chapter.meta.freemiumDaily,
// 5 questions = exactement une série) et ne voient pas de record sauvegardé.
// ---------------------------------------------------------------------------
export default function AutomatismesRunner({ chapter }) {
  const { user } = useAuth();
  usePracticeHeartbeat(user?.id);
  const { subscription: rawSubscription } = useSubscription(user?.id);
  const subscription = getEffectiveSubscription(user, rawSubscription);
  const unlimited = hasUnlimitedQuota(chapter, { user, subscription });
  const dailyLimit = chapter.meta.freemiumDaily ?? QUESTIONS_PER_SERIES;
  const quota = useDailyQuota(chapter.meta.id, dailyLimit);
  const quotaApplies = !unlimited;
  const quotaExhausted = quotaApplies && quota.exhausted;
  const skillTracking = useSkillTracking(user?.id);
  const dailyStreak = useDailyStreak(user?.id);

  const [phase, setPhase] = useState("themes"); // themes | running | results
  const [themeId, setThemeId] = useState(null);
  const { best, saveIfBetter } = useAutomatismesBestTime(unlimited ? user?.id : null, themeId);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [exercise, setExercise] = useState(null);
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState(null); // { score, timeMs }
  const [justImproved, setJustImproved] = useState(false);
  const startRef = useRef(0);

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => setElapsed(Date.now() - startRef.current), 100);
    return () => clearInterval(id);
  }, [phase]);

  // Sauvegarde automatique du record (abonnés uniquement) dès qu'on arrive
  // sur l'écran de résultat, une seule fois par série.
  useEffect(() => {
    if (phase !== "results" || !result || !unlimited || !user) return;
    let cancelled = false;
    saveIfBetter(result.score, result.timeMs).then(({ saved }) => {
      if (!cancelled) setJustImproved(saved);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, result]);

  const startSeries = (id) => {
    if (quotaExhausted) return;
    setThemeId(id);
    setJustImproved(false);
    setResult(null);
    setIndex(0);
    setScore(0);
    setExercise(chapter.generate(id));
    setInput("");
    setSelectedOption(null);
    setSelectedMulti([]);
    setFeedback(null);
    setShowHelp(false);
    setElapsed(0);
    startRef.current = Date.now();
    setPhase("running");
    dailyStreak.markPracticed();
  };

  const next = (correct) => {
    if (quotaApplies) quota.consume();
    const newScore = score + (correct ? 1 : 0);
    setScore(newScore);
    if (index + 1 >= QUESTIONS_PER_SERIES) {
      setResult({ score: newScore, timeMs: Date.now() - startRef.current });
      setPhase("results");
      return;
    }
    setIndex((i) => i + 1);
    setExercise(chapter.generate(themeId));
    setInput("");
    setSelectedOption(null);
    setSelectedMulti([]);
    setFeedback(null);
    setShowHelp(false);
  };

  // Sur une bonne réponse, on enchaîne automatiquement (rythme d'une série
  // chronométrée). Sur une erreur, on s'arrête : la méthode (steps) doit
  // rester consultable avant de passer à la suite (voir bouton "Suivant"
  // manuel plus bas), ce qui n'était pas possible avec l'ancien
  // enchaînement automatique après 500 ms quelle que soit la réponse.
  const registerAnswer = (correct, response) => {
    setFeedback({ correct, response });
    skillTracking.recordAttempt({ skillId: exercise.chapter, chapterId: chapter.meta.id, correct });
    if (correct) setTimeout(() => next(true), 500);
  };

  const submitNumeric = () => {
    if (input.trim() === "" || feedback) return;
    const val = parseNumericInput(input);
    const tolerance = exercise.tolerance ?? 0.001;
    registerAnswer(Number.isFinite(val) && Math.abs(val - exercise.answer) < tolerance, input);
  };

  const submitQCM = (opt) => {
    if (feedback) return;
    setSelectedOption(opt);
    registerAnswer(opt === exercise.answer, opt);
  };

  const submitText = () => {
    if (input.trim() === "" || feedback) return;
    registerAnswer(matchesText(input, exercise.answer), input);
  };

  const toggleMulti = (i) => {
    if (feedback) return;
    setSelectedMulti((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };

  const submitMulti = () => {
    if (feedback) return;
    registerAnswer(matchesMulti(selectedMulti, exercise.answer), selectedMulti);
  };

  const ink = colors.ink;
  const paper = colors.bg;
  const slate = colors.slate;
  const green = colors.green;
  const red = colors.red;
  const gold = colors.gold;
  const field = "#F5F5F7";
  const ring = "rgba(27,42,74,0.08)";

  const backLink = (
    <Link
      to={`/niveau/${chapter.meta.level}`}
      className="inline-flex items-center gap-1 text-xs font-semibold mb-4"
      style={{ color: slate }}
    >
      <ArrowLeft size={14} /> Retour aux chapitres
    </Link>
  );

  // --- écran "quota épuisé" (non-abonné, série gratuite du jour déjà faite) ---
  if (quotaExhausted && phase === "themes") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
        <div className="max-w-md w-full">
          {backLink}
          <div className="text-center rounded-3xl p-7" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            <Lock size={22} color={slate} className="mx-auto mb-3" />
            <p style={{ fontFamily: fonts.display, color: ink, fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.01em" }}>
              Série gratuite du jour déjà faite
            </p>
            <p className="text-sm mt-2 mb-5" style={{ color: slate }}>
              Une série gratuite de {QUESTIONS_PER_SERIES} questions par jour sur « {chapter.meta.title} ». Reviens demain, ou
              abonne-toi pour un accès illimité et conserver ton meilleur temps.
            </p>
            <Link to="/compte" className="inline-block py-2.5 px-6 rounded-full text-sm font-semibold" style={{ backgroundColor: ink, color: paper }}>
              Voir les abonnements
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- écran de choix de thème ---
  if (phase === "themes") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
        <div className="w-full max-w-md">
          {backLink}
          <div className="text-center mb-6">
            <p className="text-xs tracking-widest uppercase mb-1 font-semibold" style={{ color: gold, letterSpacing: "0.12em" }}>
              {chapter.meta.title}
            </p>
            <h1 style={{ fontFamily: fonts.display, color: ink, fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Choisis un thème
            </h1>
            <p className="text-sm mt-2" style={{ color: slate }}>
              Une série chronométrée de {QUESTIONS_PER_SERIES} questions.
              {quotaApplies && ` ${quota.remaining > 0 ? "1 série gratuite" : "Série épuisée"} aujourd'hui.`}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => startSeries("mix")}
              className="rounded-3xl px-5 py-4 flex items-center gap-3 text-left transition-transform active:scale-[0.98]"
              style={{ backgroundColor: ink, boxShadow: shadow.soft }}
            >
              <Shuffle size={18} color={gold} />
              <div>
                <p style={{ fontFamily: fonts.display, color: "#FFFFFF", fontSize: "1rem", fontWeight: 800 }}>Mélange</p>
                <p className="text-xs" style={{ color: "#B9C2D6" }}>Un peu de tous les chapitres</p>
              </div>
            </button>

            {chapter.themes.map((t) => (
              <button
                key={t.id}
                onClick={() => startSeries(t.id)}
                className="rounded-3xl px-5 py-4 flex items-center justify-between text-left transition-transform active:scale-[0.98]"
                style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}
              >
                <p style={{ fontFamily: fonts.display, color: ink, fontSize: "0.98rem", fontWeight: 700 }}>{t.title}</p>
                <ArrowRight size={16} color={slate} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- écran de résultat de fin de série ---
  if (phase === "results" && result) {
    const themeTitle = themeId === "mix" ? "Mélange" : chapter.themes.find((t) => t.id === themeId)?.title ?? themeId;
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
        <div className="w-full max-w-md">
          {backLink}
          <div className="text-center rounded-3xl p-7" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
            <Trophy size={26} color={gold} className="mx-auto mb-3" />
            <p style={{ fontFamily: fonts.display, color: ink, fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.01em" }}>
              {result.score} / {QUESTIONS_PER_SERIES} — {formatDuration(result.timeMs)}
            </p>
            <p className="text-xs mt-1 uppercase tracking-wide" style={{ color: slate }}>{themeTitle}</p>

            {unlimited ? (
              <p className="text-sm mt-4" style={{ color: justImproved ? green : slate }}>
                {justImproved
                  ? "Nouveau record enregistré !"
                  : best
                  ? `Ton record sur ce thème : ${best.best_score} / ${QUESTIONS_PER_SERIES} en ${formatDuration(best.best_time_ms)}.`
                  : "Ton temps a été enregistré comme premier record."}
              </p>
            ) : (
              <p className="text-sm mt-4" style={{ color: slate }}>
                Abonne-toi pour conserver ton meilleur temps sur chaque thème et essayer de le battre.
              </p>
            )}

            <div className="flex flex-col gap-2 mt-5">
              {!(quotaApplies && quota.exhausted) && (
                <button
                  onClick={() => startSeries(themeId)}
                  className="w-full py-2.5 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: ink, color: paper }}
                >
                  Rejouer ce thème
                </button>
              )}
              <button
                onClick={() => setPhase("themes")}
                className="w-full py-2.5 rounded-full text-sm font-semibold"
                style={{ backgroundColor: field, color: ink, boxShadow: `0 0 0 1px ${ring}` }}
              >
                Changer de thème
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- écran d'une question en cours de série ---
  if (!exercise) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8" style={{ background: paper, fontFamily: fonts.body }}>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <Link to={`/niveau/${chapter.meta.level}`} className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: slate }}>
            <ArrowLeft size={14} /> Quitter
          </Link>
          <p className="text-xs flex items-center gap-1 font-semibold" style={{ color: slate, fontFamily: fonts.mono }}>
            <Timer size={13} /> {formatDuration(elapsed)}
          </p>
        </div>

        <div className="rounded-3xl p-6" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
          <p className="text-xs uppercase tracking-wide mb-3" style={{ color: slate }}>
            Question {index + 1} / {QUESTIONS_PER_SERIES}
          </p>
          <MathText
            as="p"
            text={exercise.prompt}
            className="mb-3 leading-relaxed"
            style={{ fontFamily: fonts.mono, fontSize: "1.05rem", color: ink }}
          />

          {exercise.figure && <Figure spec={exercise.figure} />}
          {exercise.graph && <Graph spec={exercise.graph} />}

          {exercise.type === "text" && (
            <>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!!feedback}
                placeholder="Ta réponse"
                onKeyDown={(e) => e.key === "Enter" && submitText()}
                className="w-full rounded-xl px-3 py-2.5 mb-3 text-sm"
                style={{ fontFamily: fonts.mono, backgroundColor: field, color: ink, boxShadow: `0 0 0 1px ${ring}` }}
              />
              {!feedback && (
                <button onClick={submitText} className="w-full py-2.5 rounded-full text-sm font-semibold mb-3" style={{ backgroundColor: ink, color: paper }}>
                  Valider
                </button>
              )}
            </>
          )}

          {exercise.type === "multi" && (
            <>
              <div className="grid grid-cols-1 gap-2 mb-3">
                {exercise.options.map((opt, i) => {
                  const checked = selectedMulti.includes(i);
                  const isCorrectOpt = feedback && exercise.answer.includes(i);
                  const isWrongPick = feedback && checked && !exercise.answer.includes(i);
                  let bg = field;
                  let r = ring;
                  let color = ink;
                  if (feedback && isCorrectOpt) {
                    bg = `${green}1c`;
                    r = green;
                    color = green;
                  } else if (isWrongPick) {
                    bg = `${red}1c`;
                    r = red;
                    color = red;
                  }
                  return (
                    <button
                      key={i}
                      disabled={!!feedback}
                      onClick={() => toggleMulti(i)}
                      className="flex items-center gap-2 text-left px-4 py-2.5 rounded-xl text-sm"
                      style={{ fontFamily: fonts.mono, backgroundColor: bg, boxShadow: `0 0 0 1px ${r}`, color }}
                    >
                      {checked ? <CheckSquare size={16} /> : <Square size={16} />}
                      <MathText text={opt} />
                    </button>
                  );
                })}
              </div>
              {!feedback && (
                <button onClick={submitMulti} className="w-full py-2.5 rounded-full text-sm font-semibold mb-3" style={{ backgroundColor: ink, color: paper }}>
                  Valider
                </button>
              )}
            </>
          )}

          {exercise.type === "qcm" && (
            <div className="grid grid-cols-1 gap-2 mb-3">
              {exercise.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrectOpt = feedback && opt === exercise.answer;
                let bg = field;
                let r = ring;
                let color = ink;
                if (feedback && isCorrectOpt) {
                  bg = `${green}1c`;
                  r = green;
                  color = green;
                } else if (feedback && isSelected && !isCorrectOpt) {
                  bg = `${red}1c`;
                  r = red;
                  color = red;
                }
                return (
                  <button
                    key={i}
                    disabled={!!feedback}
                    onClick={() => submitQCM(opt)}
                    className="text-left px-4 py-2.5 rounded-xl text-sm"
                    style={{ fontFamily: fonts.mono, backgroundColor: bg, boxShadow: `0 0 0 1px ${r}`, color }}
                  >
                    <MathText text={opt} />
                  </button>
                );
              })}
            </div>
          )}

          {exercise.type === "numeric" && (
            <>
              <div
                className="rounded-xl px-3 py-2 mb-3 text-right"
                style={{ fontFamily: fonts.mono, fontSize: "1.2rem", minHeight: "2.75rem", backgroundColor: field, color: ink, boxShadow: `0 0 0 1px ${ring}` }}
              >
                {input || <span style={{ opacity: 0.35 }}>0</span>}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {["7", "8", "9", "4", "5", "6", "1", "2", "3", "±", "0", ",", "/", "⌫"].map((key) => (
                  <button
                    key={key}
                    disabled={!!feedback}
                    onClick={() => {
                      if (key === "±") setInput((v) => (v.startsWith("-") ? v.slice(1) : v === "" ? "-" : "-" + v));
                      else if (key === "⌫") setInput((v) => v.slice(0, -1));
                      else if (key === ",") setInput((v) => (v.includes(",") || v.includes("/") ? v : v === "" ? "0," : v + ","));
                      else if (key === "/") setInput((v) => (v === "" || v.includes("/") || v.includes(",") ? v : v + "/"));
                      else setInput((v) => (v.length < 8 ? v + key : v));
                    }}
                    className="py-2.5 rounded-xl text-base font-semibold"
                    style={{ fontFamily: fonts.mono, backgroundColor: field, color: ink, boxShadow: `0 0 0 1px ${ring}` }}
                  >
                    {key}
                  </button>
                ))}
              </div>
              {!feedback && (
                <button onClick={submitNumeric} className="w-full py-2.5 rounded-full text-sm font-semibold" style={{ backgroundColor: ink, color: paper }}>
                  Valider
                </button>
              )}
            </>
          )}

          {feedback && (
            <div className="mt-2">
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
                style={{ backgroundColor: feedback.correct ? `${green}18` : `${red}18`, color: feedback.correct ? green : red }}
              >
                {feedback.correct ? <Check size={16} /> : <X size={16} />}
                <span>{feedback.correct ? "Correct !" : "Pas tout à fait."}</span>
              </div>

              {!feedback.correct && (
                <>
                <div className="mt-2"><LearningFeedback exercise={exercise} response={feedback.response} compact /></div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setShowHelp((s) => !s)}
                    className="flex-1 py-2 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "transparent", color: ink, boxShadow: `0 0 0 1px ${ring}` }}
                  >
                    {showHelp ? "Masquer la méthode" : "Voir la méthode"}
                  </button>
                  <button
                    onClick={() => next(false)}
                    className="flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1"
                    style={{ backgroundColor: ink, color: paper }}
                  >
                    Suivant <ArrowRight size={13} />
                  </button>
                </div>
                </>
              )}

              {!feedback.correct && showHelp && (
                <div className="mt-2">
                  <StepsList steps={exercise.steps} dark={false} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
