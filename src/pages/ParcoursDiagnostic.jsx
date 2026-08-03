import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, X, Sparkles, ArrowRight } from "lucide-react";
import { getDiagnosticChapters, recommendTier, TIERS } from "../parcours";
import { getLevel } from "../levels";
import MathText from "../components/MathText";
import Figure from "../components/Figure";
import { matchesText, matchesMulti, parseNumericInput } from "../lib/answerMatch";
import { colors, fonts, shadow } from "../theme";

// Mini-diagnostic de démarrage (/parcours/niveau/:levelId/diagnostic) : une
// poignée de questions réparties sur tout le programme du niveau, à
// difficulté standard, pour suggérer un palier de parcours (débutant /
// avancé / expert). Volontairement léger — pas de pavé numérique ni de mode
// Jeu comme ChapterRunner, juste de quoi répondre vite. Rien n'est enregistré
// en base : c'est une recommandation, pas une série notée (voir
// src/parcours.js, getDiagnosticChapters / recommendTier).
export default function ParcoursDiagnostic() {
  const { levelId } = useParams();
  const level = getLevel(levelId);
  const [chapters] = useState(() => getDiagnosticChapters(levelId));
  const [index, setIndex] = useState(0);
  const [exercise, setExercise] = useState(() => chapters[0]?.generate());
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  if (!level || chapters.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 p-6 text-center" style={{ background: colors.bg }}>
        <p style={{ color: colors.slate }}>Diagnostic indisponible pour ce niveau.</p>
        <Link to={`/parcours/niveau/${levelId}`} className="text-sm font-medium" style={{ color: colors.ink }}>
          ← Retour aux parcours
        </Link>
      </div>
    );
  }

  const total = chapters.length;

  const next = () => {
    const nextIndex = index + 1;
    if (nextIndex >= total) {
      setDone(true);
      return;
    }
    setIndex(nextIndex);
    setExercise(chapters[nextIndex].generate());
    setInput("");
    setSelectedOption(null);
    setSelectedMulti([]);
    setFeedback(null);
  };

  const registerResult = (correct) => {
    if (correct) setCorrectCount((c) => c + 1);
    setFeedback({ correct });
  };

  const submitNumeric = () => {
    if (input.trim() === "" || feedback) return;
    const val = parseNumericInput(input);
    const tolerance = exercise.tolerance ?? 0.001;
    registerResult(Number.isFinite(val) && Math.abs(val - exercise.answer) < tolerance);
  };
  const submitQCM = (option) => {
    if (feedback) return;
    setSelectedOption(option);
    registerResult(option === exercise.answer);
  };
  const submitText = () => {
    if (input.trim() === "" || feedback) return;
    registerResult(matchesText(input, exercise.answer));
  };
  const toggleMulti = (i) => {
    if (feedback) return;
    setSelectedMulti((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };
  const submitMulti = () => {
    if (feedback) return;
    registerResult(matchesMulti(selectedMulti, exercise.answer));
  };

  if (done) {
    const ratio = total > 0 ? correctCount / total : 0;
    const tierId = recommendTier(ratio);
    const tier = TIERS.find((t) => t.id === tierId);
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
        <div className="max-w-md w-full text-center rounded-3xl p-7" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
          <Sparkles size={26} color={colors.gold} className="mx-auto mb-3" />
          <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.01em" }}>
            {correctCount} / {total} bonnes réponses
          </p>
          <p className="text-sm mt-2 mb-1" style={{ color: colors.slate }}>
            On te suggère de commencer par le parcours
          </p>
          <p style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.15rem", fontWeight: 800 }}>
            {tier.label}
          </p>
          <p className="text-xs mt-1 mb-5" style={{ color: colors.slate }}>
            {tier.description}
          </p>
          <div className="flex flex-col gap-2 items-center">
            <Link
              to={`/parcours/${levelId}-${tierId}`}
              className="inline-block py-2.5 px-7 rounded-full text-sm font-semibold"
              style={{ backgroundColor: colors.ink, color: colors.bg }}
            >
              Commencer ce parcours
            </Link>
            <Link to={`/parcours/niveau/${levelId}`} className="text-sm font-medium" style={{ color: colors.slate }}>
              Voir tous les paliers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="w-full max-w-md">
        <Link to={`/parcours/niveau/${levelId}`} className="inline-flex items-center gap-1 text-xs font-semibold mb-4" style={{ color: colors.slate }}>
          ← Passer le diagnostic
        </Link>

        <div className="text-center mb-5">
          <p className="text-xs tracking-widest uppercase mb-1 font-semibold" style={{ color: colors.gold, letterSpacing: "0.12em" }}>
            Diagnostic {level.label}
          </p>
          <h1 style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Question {index + 1} / {total}
          </h1>
          <div className="h-1.5 rounded-full overflow-hidden mt-3" style={{ backgroundColor: `${colors.ink}0d` }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${(index / total) * 100}%`, backgroundColor: colors.gold }} />
          </div>
        </div>

        <div className="rounded-3xl p-6" style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}>
          <p className="text-xs uppercase tracking-wide mb-3" style={{ color: colors.slate }}>
            {exercise.chapter}
          </p>
          <MathText as="p" text={exercise.prompt} className="mb-3 leading-relaxed" style={{ fontFamily: fonts.mono, fontSize: "1.05rem", color: colors.ink }} />

          {exercise.figure && <Figure spec={exercise.figure} />}

          {exercise.type === "text" && (
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!!feedback}
              placeholder="Ta réponse"
              onKeyDown={(e) => e.key === "Enter" && submitText()}
              className="w-full rounded-xl px-3 py-2.5 mb-3 text-sm"
              style={{ fontFamily: fonts.mono, backgroundColor: "#F5F5F7", color: colors.ink, boxShadow: "0 0 0 1px rgba(27,42,74,0.08)" }}
            />
          )}
          {exercise.type === "numeric" && (
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!!feedback}
              inputMode="decimal"
              placeholder="Ta réponse"
              onKeyDown={(e) => e.key === "Enter" && submitNumeric()}
              className="w-full rounded-xl px-3 py-2.5 mb-3 text-sm text-right"
              style={{ fontFamily: fonts.mono, backgroundColor: "#F5F5F7", color: colors.ink, boxShadow: "0 0 0 1px rgba(27,42,74,0.08)" }}
            />
          )}

          {exercise.type === "qcm" && (
            <div className="grid grid-cols-1 gap-2 mb-3">
              {exercise.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrectOpt = feedback && opt === exercise.answer;
                let bg = "#F5F5F7", ring = "rgba(27,42,74,0.08)", color = colors.ink;
                if (feedback && isCorrectOpt) { bg = `${colors.green}1c`; ring = colors.green; color = colors.green; }
                else if (feedback && isSelected && !isCorrectOpt) { bg = `${colors.red}1c`; ring = colors.red; color = colors.red; }
                return (
                  <button
                    key={i}
                    disabled={!!feedback}
                    onClick={() => submitQCM(opt)}
                    className="text-left px-4 py-2.5 rounded-xl text-sm"
                    style={{ fontFamily: fonts.mono, backgroundColor: bg, boxShadow: `0 0 0 1px ${ring}`, color }}
                  >
                    <MathText text={opt} />
                  </button>
                );
              })}
            </div>
          )}

          {exercise.type === "multi" && (
            <div className="grid grid-cols-1 gap-2 mb-3">
              {exercise.options.map((opt, i) => {
                const checked = selectedMulti.includes(i);
                const isCorrectOpt = feedback && exercise.answer.includes(i);
                const isWrongPick = feedback && checked && !exercise.answer.includes(i);
                let bg = "#F5F5F7", ring = "rgba(27,42,74,0.08)", color = colors.ink;
                if (feedback && isCorrectOpt) { bg = `${colors.green}1c`; ring = colors.green; color = colors.green; }
                else if (isWrongPick) { bg = `${colors.red}1c`; ring = colors.red; color = colors.red; }
                return (
                  <button
                    key={i}
                    disabled={!!feedback}
                    onClick={() => toggleMulti(i)}
                    className="text-left px-4 py-2.5 rounded-xl text-sm"
                    style={{ fontFamily: fonts.mono, backgroundColor: bg, boxShadow: `0 0 0 1px ${ring}`, color }}
                  >
                    <MathText text={opt} />
                  </button>
                );
              })}
            </div>
          )}

          {!feedback ? (
            <button
              onClick={
                exercise.type === "numeric" ? submitNumeric : exercise.type === "text" ? submitText : exercise.type === "multi" ? submitMulti : undefined
              }
              disabled={exercise.type === "qcm"}
              className="w-full py-2.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: colors.ink, color: colors.bg, opacity: exercise.type === "qcm" ? 0 : 1, pointerEvents: exercise.type === "qcm" ? "none" : "auto" }}
            >
              Valider
            </button>
          ) : (
            <button
              onClick={next}
              className="w-full py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1"
              style={{ backgroundColor: colors.ink, color: colors.bg }}
            >
              {index + 1 >= total ? "Voir mon résultat" : "Suivant"} <ArrowRight size={14} />
            </button>
          )}

          {feedback && (
            <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm mt-3" style={{ backgroundColor: feedback.correct ? `${colors.green}18` : `${colors.red}18`, color: feedback.correct ? colors.green : colors.red }}>
              {feedback.correct ? <Check size={16} /> : <X size={16} />}
              <span>{feedback.correct ? "Correct !" : "Pas tout à fait."}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
