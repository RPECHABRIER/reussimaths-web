import { useCallback, useState } from "react";
import { Check, X, Flame, Trophy, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useProgress } from "../hooks/useProgress";
import MathText from "./MathText";

// ---------------------------------------------------------------------------
// Composant générique d'exercice : Classique/Jeu, pavé numérique, QCM, aide
// progressive, score/série. Partagé par TOUS les chapitres — un chapitre
// n'apporte que `chapter.generate()` (voir src/chapters/*.js). Ne pas mettre
// de logique spécifique à un chapitre ici.
// ---------------------------------------------------------------------------
export default function ChapterRunner({ chapter }) {
  const { user } = useAuth();
  const { recordResult } = useProgress(user?.id, chapter.meta.id);

  const [mode, setMode] = useState("classique");
  const [exercise, setExercise] = useState(() => chapter.generate());
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  const newExercise = useCallback(() => {
    setExercise(chapter.generate());
    setInput("");
    setSelectedOption(null);
    setFeedback(null);
    setShowHelp(false);
  }, [chapter]);

  const retry = () => {
    setInput("");
    setSelectedOption(null);
    setFeedback(null);
    setShowHelp(false);
  };

  const registerResult = (correct) => {
    setFeedback({ correct });
    if (correct) {
      const newStreak = streak + 1;
      const bonus = newStreak % 5 === 0 ? 20 : 0;
      const newScore = score + 10 + bonus;
      setScore(newScore);
      setStreak(newStreak);
      setBest((b) => {
        const nb = Math.max(b, newStreak);
        recordResult({ score: newScore, bestStreak: nb });
        return nb;
      });
    } else {
      setStreak(0);
    }
  };

  const submitNumeric = () => {
    if (input.trim() === "" || feedback) return;
    const val = parseFloat(input.replace(",", "."));
    registerResult(Math.abs(val - exercise.answer) < 0.001);
  };

  const submitQCM = (option) => {
    if (feedback) return;
    setSelectedOption(option);
    registerResult(option === exercise.answer);
  };

  const isJeu = mode === "jeu";
  const ink = "#1B2A4A";
  const paper = "#F7F4EC";
  const gold = "#D9A441";
  const slate = "#5C6B7A";
  const green = "#4E8B6B";
  const red = "#C1543C";

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{
        background: isJeu ? `radial-gradient(circle at 50% 0%, #253a63 0%, #101a30 70%)` : `${paper}`,
        backgroundImage: !isJeu
          ? `linear-gradient(#e4dfd0 1px, transparent 1px), linear-gradient(90deg, #e4dfd0 1px, transparent 1px)`
          : undefined,
        backgroundSize: !isJeu ? "24px 24px" : undefined,
        transition: "background 0.5s ease",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <p
            className="text-xs tracking-widest uppercase mb-1"
            style={{ color: isJeu ? "#8b9ec4" : slate, letterSpacing: "0.15em" }}
          >
            {chapter.meta.free ? "Chapitre gratuit" : "Chapitre abonnement"} — {chapter.meta.title}
          </p>
          <h1
            style={{
              fontFamily: "Fraunces, serif",
              color: isJeu ? "#F7F4EC" : ink,
              fontSize: "1.75rem",
              fontWeight: 600,
            }}
          >
            {chapter.meta.title}
          </h1>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setMode(isJeu ? "classique" : "jeu")}
            className="relative flex items-center rounded-full p-1 text-xs font-semibold"
            style={{
              width: "220px",
              backgroundColor: isJeu ? "#0d1729" : "#e9e4d6",
              border: `1px solid ${isJeu ? "#3a4d76" : "#d5cfbc"}`,
            }}
          >
            <span
              className="absolute top-1 bottom-1 rounded-full transition-all duration-300"
              style={{
                width: "50%",
                left: isJeu ? "50%" : "2%",
                backgroundColor: isJeu ? gold : ink,
                boxShadow: isJeu ? `0 0 12px ${gold}88` : "none",
              }}
            />
            <span className="relative z-10 flex-1 text-center py-1.5" style={{ color: !isJeu ? paper : slate }}>
              Classique
            </span>
            <span className="relative z-10 flex-1 text-center py-1.5" style={{ color: isJeu ? ink : "#7c8db0" }}>
              Jeu
            </span>
          </button>
        </div>

        {isJeu && (
          <div className="flex justify-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-sm" style={{ color: gold }}>
              <Trophy size={16} />
              <span style={{ fontFamily: "Space Mono, monospace" }}>{score} pts</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "#e8845a" }}>
              <Flame size={16} />
              <span style={{ fontFamily: "Space Mono, monospace" }}>{streak} d'affilée</span>
            </div>
          </div>
        )}

        <div
          className="rounded-2xl p-6 transition-all duration-500"
          style={{
            backgroundColor: isJeu ? "#16233f" : "#ffffff",
            border: isJeu ? `1px solid ${gold}55` : `1px solid #e4dfd0`,
            boxShadow: isJeu ? `0 0 30px -5px ${gold}33, inset 0 0 0 1px #ffffff08` : "0 4px 20px -8px rgba(27,42,74,0.15)",
          }}
        >
          <p className="text-xs uppercase tracking-wide mb-3" style={{ color: isJeu ? "#8b9ec4" : slate }}>
            {exercise.chapter}
          </p>
          <MathText
            as="p"
            text={exercise.prompt}
            className="mb-5 leading-relaxed"
            style={{ fontFamily: "Space Mono, monospace", fontSize: "1.05rem", color: isJeu ? "#F7F4EC" : ink }}
          />

          {exercise.type === "qcm" && (
            <div className="grid grid-cols-1 gap-2 mb-3">
              {exercise.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrectOpt = feedback && opt === exercise.answer;
                let bg = isJeu ? "#0d1729" : "#F7F4EC";
                let border = isJeu ? "#3a4d76" : "#d5cfbc";
                let color = isJeu ? "#F7F4EC" : ink;
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
                    className="text-left px-4 py-2.5 rounded-lg text-sm"
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
                className="rounded-lg px-3 py-2 mb-3 text-right"
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "1.2rem",
                  minHeight: "2.75rem",
                  backgroundColor: isJeu ? "#0d1729" : "#F7F4EC",
                  color: isJeu ? "#F7F4EC" : ink,
                  border: `1px solid ${isJeu ? "#3a4d76" : "#d5cfbc"}`,
                }}
              >
                {input || <span style={{ opacity: 0.35 }}>0</span>}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {["7", "8", "9", "4", "5", "6", "1", "2", "3", "±", "0", "⌫"].map((key) => (
                  <button
                    key={key}
                    disabled={!!feedback}
                    onClick={() => {
                      if (key === "±") setInput((v) => (v.startsWith("-") ? v.slice(1) : v === "" ? "-" : "-" + v));
                      else if (key === "⌫") setInput((v) => v.slice(0, -1));
                      else setInput((v) => (v.length < 6 ? v + key : v));
                    }}
                    className="py-2.5 rounded-lg text-base font-semibold"
                    style={{
                      fontFamily: "Space Mono, monospace",
                      backgroundColor: isJeu ? "#0d1729" : "#F7F4EC",
                      color: isJeu ? "#F7F4EC" : ink,
                      border: `1px solid ${isJeu ? "#3a4d76" : "#d5cfbc"}`,
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mb-3">
                {!feedback ? (
                  <button
                    onClick={submitNumeric}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold"
                    style={{ backgroundColor: isJeu ? gold : ink, color: isJeu ? ink : paper }}
                  >
                    Valider
                  </button>
                ) : (
                  <button
                    onClick={newExercise}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
                    style={{ backgroundColor: isJeu ? gold : ink, color: isJeu ? ink : paper }}
                  >
                    Suivant <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </>
          )}

          {exercise.type === "qcm" && feedback && (
            <button
              onClick={newExercise}
              className="w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 mb-3"
              style={{ backgroundColor: isJeu ? gold : ink, color: isJeu ? ink : paper }}
            >
              Suivant <ArrowRight size={14} />
            </button>
          )}

          {feedback && (
            <div className="mt-2">
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                style={{ backgroundColor: feedback.correct ? `${green}18` : `${red}18`, color: feedback.correct ? green : red }}
              >
                {feedback.correct ? <Check size={16} /> : <X size={16} />}
                <span>{feedback.correct ? "Correct !" : "Pas tout à fait."}</span>
              </div>

              {!feedback.correct && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={retry}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold"
                    style={{ backgroundColor: "transparent", color: isJeu ? "#F7F4EC" : ink, border: `1px solid ${isJeu ? "#3a4d76" : "#d5cfbc"}` }}
                  >
                    Réessayer
                  </button>
                  <button
                    onClick={() => setShowHelp((s) => !s)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold"
                    style={{ backgroundColor: "transparent", color: isJeu ? gold : ink, border: `1px solid ${isJeu ? gold : ink}` }}
                  >
                    {showHelp ? "Masquer la méthode" : "Voir la méthode"}
                  </button>
                </div>
              )}

              {!feedback.correct && showHelp && (
                <ol
                  className="mt-2 space-y-1.5 text-sm rounded-lg px-4 py-3 list-decimal list-outside ml-4"
                  style={{
                    backgroundColor: isJeu ? "#0d1729" : "#F7F4EC",
                    color: isJeu ? "#cdd8ec" : slate,
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.85rem",
                  }}
                >
                  {exercise.steps.map((step, i) => (
                    <li key={i}>
                      <MathText text={step} />
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>

        {isJeu && best > 0 && (
          <p className="text-center text-xs mt-3" style={{ color: "#6c7fa3" }}>
            Meilleure série : {best}
          </p>
        )}

        {!user && (
          <p className="text-center text-xs mt-3" style={{ color: isJeu ? "#6c7fa3" : slate }}>
            Connecte-toi pour sauvegarder ta progression sur ce chapitre.
          </p>
        )}
      </div>
    </div>
  );
}
