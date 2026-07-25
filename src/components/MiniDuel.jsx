import { useState } from "react";
import { Check, X } from "lucide-react";
import MathText from "./MathText";

const ink = "#1B2A4A";
const paper = "#F7F4EC";
const slate = "#5C6B7A";
const green = "#4E8B6B";
const red = "#C1543C";

// Mini-série de questions utilisée pour les défis entre amis (voir
// src/pages/Amis.jsx) : `count` questions tirées de `chapter.generate()`,
// score final renvoyé via onFinish(score). Volontairement plus sobre que
// <ChapterRunner /> (pas de mode Jeu, pas de sauvegarde de progression) :
// c'est une mécanique à part, le duel, pas une session de révision normale.
export default function MiniDuel({ chapter, count, onFinish }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [exercise, setExercise] = useState(() => chapter.generate());
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const next = (correct) => {
    const newScore = score + (correct ? 1 : 0);
    setScore(newScore);
    if (index + 1 >= count) {
      onFinish(newScore);
      return;
    }
    setIndex((i) => i + 1);
    setExercise(chapter.generate());
    setInput("");
    setSelected(null);
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

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "#ffffff", border: "1px solid #e4dfd0" }}>
      <p className="text-xs uppercase tracking-wide mb-2" style={{ color: slate }}>
        Question {index + 1} / {count}
      </p>
      <MathText
        as="p"
        text={exercise.prompt}
        className="mb-3 leading-relaxed"
        style={{ fontFamily: "Space Mono, monospace", fontSize: "0.95rem", color: ink }}
      />

      {exercise.type === "qcm" && (
        <div className="grid grid-cols-1 gap-2">
          {exercise.options.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrectOpt = feedback && opt === exercise.answer;
            let bg = paper;
            let border = "#d5cfbc";
            let color = ink;
            if (feedback && isCorrectOpt) {
              bg = `${green}22`;
              border = green;
              color = green;
            } else if (feedback && isSelected && !isCorrectOpt) {
              bg = `${red}22`;
              border = red;
              color = red;
            }
            return (
              <button
                key={i}
                disabled={!!feedback}
                onClick={() => submitQCM(opt)}
                className="text-left px-3 py-2 rounded-lg text-sm"
                style={{ fontFamily: "Space Mono, monospace", backgroundColor: bg, border: `1px solid ${border}`, color }}
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
            className="rounded-lg px-3 py-2 mb-2 text-right"
            style={{ fontFamily: "Space Mono, monospace", fontSize: "1.05rem", minHeight: "2.4rem", backgroundColor: paper, color: ink, border: "1px solid #d5cfbc" }}
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
                className="py-2 rounded-lg text-sm font-semibold"
                style={{ fontFamily: "Space Mono, monospace", backgroundColor: paper, color: ink, border: "1px solid #d5cfbc" }}
              >
                {key}
              </button>
            ))}
          </div>
          {!feedback && (
            <button onClick={submitNumeric} className="w-full py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: ink, color: paper }}>
              Valider
            </button>
          )}
        </>
      )}

      {feedback && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm mt-2"
          style={{ backgroundColor: feedback.correct ? `${green}18` : `${red}18`, color: feedback.correct ? green : red }}
        >
          {feedback.correct ? <Check size={16} /> : <X size={16} />}
          <span>{feedback.correct ? "Correct !" : "Pas tout à fait."}</span>
        </div>
      )}
    </div>
  );
}
