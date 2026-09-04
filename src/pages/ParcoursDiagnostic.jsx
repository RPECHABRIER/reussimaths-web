import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Check, X, Sparkles, ArrowRight, Clock3, Target, ShieldCheck, RotateCcw } from "lucide-react";
import { getDiagnosticChapters, getPreviousLevelId, recommendTier, TIERS } from "../parcours";
import { getLevel } from "../levels";
import { setDiagnosticProfile } from "../lib/diagnosticProfile";
import { createDiagnosticResult, summarizeDiagnostic } from "../lib/diagnosticResults";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import MathText from "../components/MathText";
import Figure from "../components/Figure";
import LearningFeedback from "../components/LearningFeedback";
import Mascot from "../components/Mascot";
import CalculationModeBadge from "../components/CalculationModeBadge";
import { MAX_NUMERIC_INPUT_LENGTH, NUMERIC_KEYPAD_KEYS } from "../lib/numericKeypad";
import { matchesText, matchesMulti, parseNumericInput } from "../lib/answerMatch";
import { colors, fonts, shadow, cycleColors } from "../theme";
import { trackProductEvent } from "../lib/productAnalytics";

// Mini-diagnostic de démarrage (/parcours/niveau/:levelId/diagnostic) : une
// poignée de questions réparties sur tout le programme du niveau, à
// difficulté standard, pour suggérer un palier de parcours (débutant /
// avancé / expert). Volontairement léger — pas de pavé numérique ni de mode
// Jeu comme ChapterRunner, juste de quoi répondre vite. Les résultats sont
// conservés pour orienter la suite, sans constituer une note scolaire (voir
// src/parcours.js, getDiagnosticChapters / recommendTier).
export default function ParcoursDiagnostic() {
  const { levelId } = useParams();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const trial = searchParams.get("objectif") === "essai";
  const level = getLevel(levelId);
  const previousLevel = getLevel(getPreviousLevelId(levelId));
  const [chapters] = useState(() => getDiagnosticChapters(levelId));
  const [index, setIndex] = useState(0);
  const [exercise, setExercise] = useState(() => chapters[0]?.generate());
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!done) return;
    setDiagnosticProfile(levelId, results);
    if (user?.id) {
      const storedResults = results.map((result) => ({ ...result }));
      supabase.from("student_diagnostic_profiles").upsert({
        user_id: user.id,
        level_id: levelId,
        results: storedResults,
        completed_at: new Date().toISOString(),
      }, { onConflict: "user_id,level_id" }).then(({ error }) => {
        if (error) console.error("[ParcoursDiagnostic] sauvegarde :", error.message);
      });
    }
  }, [done, levelId, results, user?.id]);

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
  const cycleColor = cycleColors[level.cycle]?.accent ?? colors.gold;

  if (!started) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
        <div className="max-w-2xl w-full rounded-[2rem] p-6 sm:p-9" style={{ backgroundColor: colors.card, boxShadow: shadow.raised, borderTop: `3px solid ${cycleColor}` }}>
          <Link to={`/parcours/niveau/${levelId}/programme${trial ? "?objectif=essai" : ""}`} className="text-xs font-semibold" style={{ color: colors.slate }}>← Modifier les chapitres étudiés</Link>
          <div className="mt-7 text-center">
            <div className="relative mx-auto w-fit"><Mascot size={76} motion="float" /><span className="absolute -right-2 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"><Target size={17} color={cycleColor} /></span></div>
            <p className="text-xs uppercase tracking-widest font-bold mt-5" style={{ color: cycleColor }}>Diagnostic {level.label}</p>
            <h1 className="mt-2" style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05 }}>Trouve ton bon point de départ</h1>
            <p className="text-base mt-4 max-w-lg mx-auto leading-relaxed" style={{ color: colors.slate }}>
              {previousLevel
                ? `Nous vérifions cinq repères de ${previousLevel.label} pour choisir une notion à reprendre avant de poursuivre en ${level.label}.`
                : "Nous vérifions les acquis fondamentaux de l’école primaire et les premiers repères utiles pour la 6e."}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-7">
            {[
              { icon: Clock3, value: `${total} questions`, label: "Environ 2 minutes" },
              { icon: ShieldCheck, value: "Sans note", label: "Aucun résultat scolaire" },
              { icon: RotateCcw, value: "Modifiable", label: "Tu gardes le choix" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={value} className="rounded-2xl p-3 sm:p-4 text-center" style={{ backgroundColor: colors.bg }}><Icon size={18} color={cycleColor} className="mx-auto" /><p className="text-xs sm:text-sm font-black mt-2" style={{ color: colors.ink }}>{value}</p><p className="text-[10px] sm:text-xs mt-1 leading-snug" style={{ color: colors.slate }}>{label}</p></div>
            ))}
          </div>
          <button onClick={() => { setStarted(true); trackProductEvent("diagnostic_started", { levelId, trial }); }} className="w-full mt-6 py-3.5 rounded-full font-bold flex items-center justify-center gap-2" style={{ backgroundColor: colors.ink, color: colors.bg }}>Commencer le diagnostic <ArrowRight size={16} /></button>
        </div>
      </div>
    );
  }

  const next = () => {
    const nextIndex = index + 1;
    if (nextIndex >= total) {
      trackProductEvent("diagnostic_completed", { levelId, correct: correctCount, total, tier: recommendTier(total ? correctCount / total : 0), trial });
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

  const registerResult = (correct, response) => {
    if (correct) setCorrectCount((c) => c + 1);
    setResults((previous) => [...previous, createDiagnosticResult(exercise, correct)]);
    setFeedback({ correct, response });
  };

  const submitNumeric = () => {
    if (input.trim() === "" || feedback) return;
    const val = parseNumericInput(input);
    const tolerance = exercise.tolerance ?? 0.001;
    registerResult(Number.isFinite(val) && Math.abs(val - exercise.answer) <= tolerance, input);
  };
  const submitQCM = (option) => {
    if (feedback) return;
    setSelectedOption(option);
    registerResult(option === exercise.answer, option);
  };
  const submitText = () => {
    if (input.trim() === "" || feedback) return;
    registerResult(matchesText(input, exercise.answer), input);
  };
  const toggleMulti = (i) => {
    if (feedback) return;
    setSelectedMulti((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  };
  const submitMulti = () => {
    if (feedback) return;
    registerResult(matchesMulti(selectedMulti, exercise.answer), selectedMulti);
  };

  if (done) {
    const ratio = total > 0 ? correctCount / total : 0;
    const tierId = recommendTier(ratio);
    const tier = TIERS.find((t) => t.id === tierId);
    const { priorities, strengths, remediationChapterId } = summarizeDiagnostic(results);
    const confidence = total >= 6 && Math.abs(ratio - 0.4) > 0.1 && Math.abs(ratio - 0.75) > 0.1 ? "bonne" : "indicative";
    if (trial) {
      const targetedChapterId = remediationChapterId;
      if (targetedChapterId) sessionStorage.setItem(`reussimaths_trial_chapter_${levelId}`, targetedChapterId);
      sessionStorage.setItem(`reussimaths_trial_source_${levelId}`, "diagnostic");
    }
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
        <div className="max-w-lg w-full text-center rounded-[2rem] p-7 sm:p-9" style={{ backgroundColor: colors.card, boxShadow: shadow.raised, borderTop: `3px solid ${cycleColor}` }}>
          <div className="mx-auto flex items-center justify-center rounded-2xl" style={{ width: 56, height: 56, backgroundColor: `${cycleColor}18` }}><Sparkles size={27} color={cycleColor} /></div>
          <p className="text-xs uppercase tracking-widest font-bold mt-5" style={{ color: cycleColor }}>Notre recommandation</p>
          <p className="mt-2" style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.03em" }}>Parcours {tier.label}</p>
          <p className="text-sm mt-2" style={{ color: colors.slate }}>{correctCount} réponse{correctCount > 1 ? "s" : ""} correcte{correctCount > 1 ? "s" : ""} sur {total}. {tier.description}</p>
          <p className="text-[11px] mt-2" style={{ color: colors.slate }}>Confiance {confidence} : ce diagnostic court oriente le départ, puis les prochaines séances affineront la recommandation.</p>
          <div className="grid sm:grid-cols-2 gap-2 mt-5 text-left">
            <div className="rounded-2xl p-3" style={{ backgroundColor: `${colors.green}10` }}><p className="text-xs font-black" style={{ color: colors.green }}>Points d’appui</p><p className="text-xs mt-1" style={{ color: colors.slate }}>{strengths.length ? strengths.map((item) => item.chapterTitle).join(" · ") : "Ils seront précisés pendant la première série."}</p></div>
            <div className="rounded-2xl p-3" style={{ backgroundColor: `${colors.gold}12` }}><p className="text-xs font-black" style={{ color: colors.gold }}>Priorités possibles</p><p className="text-xs mt-1" style={{ color: colors.slate }}>{priorities.length ? priorities.map((item) => item.chapterTitle).join(" · ") : "Aucune fragilité nette dans ce court échantillon."}</p></div>
          </div>
          <div className="rounded-2xl p-4 text-left mt-5" style={{ backgroundColor: colors.bg }}><p className="text-xs font-bold" style={{ color: colors.ink }}>Ce résultat est un conseil, pas une étiquette.</p><p className="text-xs mt-1" style={{ color: colors.slate }}>Tu peux changer de palier à tout moment si le rythme te paraît trop facile ou trop exigeant.</p></div>
          <div className="flex flex-col gap-2 items-center">
            <Link
              to={trial ? `/parcours/essai-${levelId}/etape/0?chapter=${encodeURIComponent(remediationChapterId ?? "")}&trial_source=diagnostic` : `/parcours/${levelId}-${tierId}`}
              className="w-full mt-5 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2"
              style={{ backgroundColor: colors.ink, color: colors.bg }}
            >
              {trial ? "Faire ma série gratuite" : "Commencer ce parcours"} <ArrowRight size={15} />
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
        <Link to={`/parcours/niveau/${levelId}/programme${trial ? "?objectif=essai" : ""}`} className="inline-flex items-center gap-1 text-xs font-semibold mb-4" style={{ color: colors.slate }}>
          ← Modifier les chapitres étudiés
        </Link>

        <div className="text-center mb-5">
          <p className="text-xs tracking-widest uppercase mb-1 font-semibold" style={{ color: colors.gold, letterSpacing: "0.12em" }}>
            Diagnostic {level.label}
          </p>
          <h1 style={{ fontFamily: fonts.display, color: colors.ink, fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Question {index + 1} / {total}
          </h1>
          <div className="h-1.5 rounded-full overflow-hidden mt-3" style={{ backgroundColor: `${colors.ink}0d` }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${((index + 1) / total) * 100}%`, backgroundColor: cycleColor }} />
          </div>
        </div>

        <div className="rounded-[2rem] p-5 sm:p-7" style={{ backgroundColor: colors.card, boxShadow: shadow.raised }}>
          <p className="text-xs uppercase tracking-wide font-bold mb-3" style={{ color: cycleColor }}>
            {exercise.chapter}
          </p>
          <div className="mb-3"><CalculationModeBadge exercise={exercise}/></div>
          <MathText as="p" text={exercise.prompt} className="mb-5 leading-relaxed" style={{ fontFamily: fonts.mono, fontSize: "clamp(1.08rem, 3vw, 1.25rem)", fontWeight: 650, color: colors.ink }} />

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
            <>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!!feedback}
                inputMode="text"
                aria-label="Réponse numérique"
                placeholder="Ta réponse"
                onKeyDown={(e) => e.key === "Enter" && submitNumeric()}
                className="w-full rounded-xl px-3 py-2.5 mb-3 text-sm text-right"
                style={{ fontFamily: fonts.mono, backgroundColor: "#F5F5F7", color: colors.ink, boxShadow: "0 0 0 1px rgba(27,42,74,0.08)" }}
              />
              <div className="grid grid-cols-3 gap-2 mb-3" aria-label="Pavé numérique avec signe moins">
                {NUMERIC_KEYPAD_KEYS.map((key) => (
                  <button
                    type="button"
                    key={key}
                    disabled={!!feedback}
                    aria-label={key === "±" ? "Ajouter ou retirer le signe moins" : key === "⌫" ? "Effacer" : undefined}
                    onClick={() => {
                      if (key === "+∞" || key === "−∞") setInput(key);
                      else if (key === "±") setInput((value) => (value.startsWith("-") || value.startsWith("−") ? value.slice(1) : value === "" ? "-" : `-${value}`));
                      else if (key === "⌫") setInput((value) => value.slice(0, -1));
                      else if (key === ",") setInput((value) => (value.includes(",") || value.includes("/") ? value : value === "" ? "0," : `${value},`));
                      else if (key === "/") setInput((value) => (value === "" || value.includes("/") || value.includes(",") ? value : `${value}/`));
                      else setInput((value) => (value.length < MAX_NUMERIC_INPUT_LENGTH ? `${value}${key}` : value));
                    }}
                    className="py-2 rounded-xl text-sm font-semibold"
                    style={{ fontFamily: fonts.mono, backgroundColor: "#F5F5F7", color: colors.ink, boxShadow: "0 0 0 1px rgba(27,42,74,0.08)" }}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </>
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
          ) : null}

          {feedback && (
            <>
              <div className="feedback-moment grid grid-cols-[44px_1fr] items-center gap-3 rounded-2xl px-3 py-2 text-sm mt-3" style={{ backgroundColor: feedback.correct ? `${colors.green}18` : `${colors.red}13`, color: feedback.correct ? colors.green : colors.red }}>
                <Mascot size={42} motion={feedback.correct ? "celebrate" : "encourage"} />
                <span className="font-semibold flex items-center gap-2">{feedback.correct ? <Check size={16} /> : <X size={16} />}{feedback.correct ? "Bien joué !" : "Pas tout à fait — comprends l’erreur avant de continuer."}</span>
              </div>
              {(!feedback.correct || trial) && <div className="mt-2"><LearningFeedback exercise={exercise} response={feedback.response} compact remember correct={feedback.correct} autonomous={feedback.correct} assisted={false} hadError={!feedback.correct} levelId={levelId} /></div>}
              <button
                onClick={next}
                className="w-full mt-3 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1"
                style={{ backgroundColor: colors.ink, color: colors.bg }}
              >
                {index + 1 >= total ? "Voir mon résultat" : "J’ai compris, question suivante"} <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
