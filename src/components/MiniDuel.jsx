import { useEffect, useRef, useState } from "react";
import { Check, X, Timer, Square, CheckSquare, ArrowRight } from "lucide-react";
import MathText from "./MathText";
import { MAX_NUMERIC_INPUT_LENGTH, NUMERIC_KEYPAD_KEYS } from "../lib/numericKeypad";
import StepsList from "./StepsList";
import LearningFeedback from "./LearningFeedback";
import Figure from "./Figure";
import Graph from "./Graph";
import CalculationModeBadge from "./CalculationModeBadge";
import { matchesText, matchesMulti, parseNumericInput } from "../lib/answerMatch";
import { useAuth } from "../hooks/useAuth";
import { useSkillTracking } from "../hooks/useSkillTracking";
import { useDailyStreak } from "../hooks/useDailyStreak";
import { usePracticeHeartbeat } from "../hooks/usePracticeHeartbeat";
import { colors, fonts, shadow } from "../theme";

const ink = colors.ink;
const paper = colors.card;
const field = "#F5F5F7";
const ring = "rgba(27,42,74,0.08)";
const slate = colors.slate;
const green = colors.green;
const red = colors.red;

function formatDuration(ms) {
  const s = ms / 1000;
  return s < 10 ? `${s.toFixed(1)}s` : `${Math.round(s)}s`;
}

// Mini-série de questions utilisée pour les défis entre amis (voir
// src/pages/Amis.jsx) : `count` questions tirées de `chapter.generate()`,
// score ET temps total renvoyés via onFinish(score, durationMs) — le temps
// sert de départage entre amis en cas d'égalité de score (voir Amis.jsx).
// Volontairement plus sobre que <ChapterRunner /> (pas de mode Jeu, pas de
// sauvegarde de progression) : c'est une mécanique à part, le duel.
//
// themeId (optionnel) : pour un défi sur un chapitre Automatismes (qui
// mélange plusieurs thèmes), transmis à chapter.generate(themeId) pour que
// LES DEUX joueurs soient interrogés sur le même thème plutôt qu'un mélange
// aléatoire indépendant de chaque côté (voir Amis.jsx, describeChallenge).
export default function MiniDuel({ chapter, count, themeId, onFinish }) {
  const { user } = useAuth();
  usePracticeHeartbeat(user?.id);
  const skillTracking = useSkillTracking(user?.id);
  const dailyStreak = useDailyStreak(user?.id);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [exercise, setExercise] = useState(() => chapter.generate(themeId));
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(null);
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - startRef.current), 100);
    return () => clearInterval(id);
  }, []);

  // Compte comme pratique du jour dès le premier duel lancé.
  useEffect(() => {
    dailyStreak.markPracticed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = (correct) => {
    const newScore = score + (correct ? 1 : 0);
    setScore(newScore);
    if (index + 1 >= count) {
      onFinish(newScore, Date.now() - startRef.current);
      return;
    }
    setIndex((i) => i + 1);
    setExercise(chapter.generate(themeId));
    setInput("");
    setSelected(null);
    setSelectedMulti([]);
    setFeedback(null);
    setShowHelp(false);
  };

  // Sur une bonne réponse, on enchaîne automatiquement (rythme du duel). Sur
  // une erreur, on s'arrête pour laisser la méthode (steps) consultable
  // avant de reprendre manuellement (voir bouton "Suivant").
  const registerAnswer = (correct, response) => {
    setFeedback({ correct, response });
    skillTracking.recordAttempt({ skillId: exercise.chapter, chapterId: chapter.meta.id, correct });
    if (correct) setTimeout(() => next(true), 550);
  };

  const submitNumeric = () => {
    if (input.trim() === "" || feedback) return;
    const val = parseNumericInput(input);
    const tolerance = exercise.tolerance ?? 0.001;
    registerAnswer(Number.isFinite(val) && Math.abs(val - exercise.answer) <= tolerance, input);
  };

  const submitQCM = (opt) => {
    if (feedback) return;
    setSelected(opt);
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

  return (
    <div className="rounded-3xl p-5" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs uppercase tracking-wide" style={{ color: slate }}>
          Question {index + 1} / {count}
        </p>
        <p className="text-xs flex items-center gap-1 font-semibold" style={{ color: slate, fontFamily: fonts.mono }}>
          <Timer size={13} /> {formatDuration(elapsed)}
        </p>
      </div>
      <div className="mb-3"><CalculationModeBadge exercise={exercise}/></div>
      <MathText
        as="p"
        text={exercise.prompt}
        className="mb-2 leading-relaxed"
        style={{ fontFamily: fonts.mono, fontSize: "0.95rem", color: ink }}
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
            className="w-full rounded-xl px-3 py-2 mb-2 text-sm"
            style={{ fontFamily: fonts.mono, backgroundColor: field, color: ink, boxShadow: `0 0 0 1px ${ring}` }}
          />
          {!feedback && (
            <button onClick={submitText} className="w-full py-2.5 rounded-full text-sm font-semibold" style={{ backgroundColor: ink, color: paper }}>
              Valider
            </button>
          )}
        </>
      )}

      {exercise.type === "multi" && (
        <>
          <div className="grid grid-cols-1 gap-2 mb-2">
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
                  className="flex items-center gap-2 text-left px-3 py-2 rounded-xl text-sm"
                  style={{ fontFamily: fonts.mono, backgroundColor: bg, boxShadow: `0 0 0 1px ${r}`, color }}
                >
                  {checked ? <CheckSquare size={15} /> : <Square size={15} />}
                  <MathText text={opt} />
                </button>
              );
            })}
          </div>
          {!feedback && (
            <button onClick={submitMulti} className="w-full py-2.5 rounded-full text-sm font-semibold" style={{ backgroundColor: ink, color: paper }}>
              Valider
            </button>
          )}
        </>
      )}

      {exercise.type === "qcm" && (
        <div className="grid grid-cols-1 gap-2">
          {exercise.options.map((opt, i) => {
            const isSelected = selected === opt;
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
                className="text-left px-3 py-2 rounded-xl text-sm"
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
            className="rounded-xl px-3 py-2 mb-2 text-right"
            style={{ fontFamily: fonts.mono, fontSize: "1.05rem", minHeight: "2.4rem", backgroundColor: field, color: ink, boxShadow: `0 0 0 1px ${ring}` }}
          >
            {input || <span style={{ opacity: 0.35 }}>0</span>}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {NUMERIC_KEYPAD_KEYS.map((key) => (
              <button
                key={key}
                disabled={!!feedback}
                onClick={() => {
                  if (key === "+∞" || key === "−∞") setInput(key);
                  else if (key === "±") setInput((v) => (v.startsWith("-") || v.startsWith("−") ? v.slice(1) : v === "" ? "-" : "-" + v));
                  else if (key === "⌫") setInput((v) => v.slice(0, -1));
                  else if (key === ",") setInput((v) => (v.includes(",") || v.includes("/") ? v : v === "" ? "0," : v + ","));
                  else if (key === "/") setInput((v) => (v === "" || v.includes("/") || v.includes(",") ? v : v + "/"));
                  else setInput((v) => (v.length < MAX_NUMERIC_INPUT_LENGTH ? v + key : v));
                }}
                className="py-2 rounded-xl text-sm font-semibold"
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
  );
}
