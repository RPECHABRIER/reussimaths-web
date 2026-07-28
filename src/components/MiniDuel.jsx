import { useEffect, useRef, useState } from "react";
import { Check, X, Timer, Square, CheckSquare } from "lucide-react";
import MathText from "./MathText";
import Figure from "./Figure";
import { matchesText, matchesMulti } from "../lib/answerMatch";
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
export default function MiniDuel({ chapter, count, onFinish }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [exercise, setExercise] = useState(() => chapter.generate());
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(null);
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - startRef.current), 100);
    return () => clearInterval(id);
  }, []);

  const next = (correct) => {
    const newScore = score + (correct ? 1 : 0);
    setScore(newScore);
    if (index + 1 >= count) {
      onFinish(newScore, Date.now() - startRef.current);
      return;
    }
    setIndex((i) => i + 1);
    setExercise(chapter.generate());
    setInput("");
    setSelected(null);
    setSelectedMulti([]);
    setFeedback(null);
  };

  const submitNumeric = () => {
    if (input.trim() === "" || feedback) return;
    const val = parseFloat(input.replace(",", "."));
    const correct = Math.abs(val - exercise.answer) < 0.001;
    setFeedback({ correct });
    setTimeout(() => next(correct), 550);
  };

  const submitQCM = (opt) => {
    if (feedback) return;
    setSelected(opt);
    const correct = opt === exercise.answer;
    setFeedback({ correct });
    setTimeout(() => next(correct), 550);
  };

  const submitText = () => {
    if (input.trim() === "" || feedback) return;
    const correct = matchesText(input, exercise.answer);
    setFeedback({ correct });
    setTimeout(() => next(correct), 550);
  };

  const toggleMulti = (i) => {
    if (feedback) return;
    setSelectedMulti((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };

  const submitMulti = () => {
    if (feedback) return;
    const correct = matchesMulti(selectedMulti, exercise.answer);
    setFeedback({ correct });
    setTimeout(() => next(correct), 550);
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
      <MathText
        as="p"
        text={exercise.prompt}
        className="mb-2 leading-relaxed"
        style={{ fontFamily: fonts.mono, fontSize: "0.95rem", color: ink }}
      />

      {exercise.figure && <Figure spec={exercise.figure} />}

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
            {["7", "8", "9", "4", "5", "6", "1", "2", "3", "±", "0", "⌫"].map((key) => (
              <button
                key={key}
                disabled={!!feedback}
                onClick={() => {
                  if (key === "±") setInput((v) => (v.startsWith("-") ? v.slice(1) : v === "" ? "-" : "-" + v));
                  else if (key === "⌫") setInput((v) => v.slice(0, -1));
                  else setInput((v) => (v.length < 6 ? v + key : v));
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
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm mt-2"
          style={{ backgroundColor: feedback.correct ? `${green}18` : `${red}18`, color: feedback.correct ? green : red }}
        >
          {feedback.correct ? <Check size={16} /> : <X size={16} />}
          <span>{feedback.correct ? "Correct !" : "Pas tout à fait."}</span>
        </div>
      )}
    </div>
  );
}
