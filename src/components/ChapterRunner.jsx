import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, Flame, Trophy, ArrowRight, ArrowLeft, Lock, Square, CheckSquare, Timer, Lightbulb } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useProgress, useSubscription } from "../hooks/useProgress";
import { useDailyQuota } from "../hooks/useDailyQuota";
import { useSkillTracking } from "../hooks/useSkillTracking";
import { useDailyStreak } from "../hooks/useDailyStreak";
import { hasUnlimitedQuota, getEffectiveSubscription } from "../lib/access";
import MathText from "./MathText";
import StepsList from "./StepsList";
import Figure from "./Figure";
import Graph from "./Graph";
import { matchesText, matchesMulti, parseNumericInput } from "../lib/answerMatch";
import { colors, fonts, shadow } from "../theme";

// ---------------------------------------------------------------------------
// Composant générique d'exercice : Découverte/Entraînement/Défi, pavé
// numérique, QCM, aide progressive, score/série. Partagé par TOUS les
// chapitres — un chapitre n'apporte que `chapter.generate()` (voir
// src/chapters/*.js). Ne pas mettre de logique spécifique à un chapitre ici.
//
// Trois modes (triptyque, cf. proposition neurosciences) :
//   - Découverte : la méthode (steps) est visible EN PERMANENCE, avant même
//     de répondre (worked example, réduit la charge cognitive pour aborder
//     une notion) — pas de score/streak sauvegardé, mode d'apprentissage pur.
//   - Entraînement (ex "Classique") : comportement historique, aide sur
//     demande après une erreur ("Voir la méthode").
//   - Défi (ex "Jeu") : chronométré, sans aide (pas de bouton méthode),
//     score/streak/pts affichés, ambiance compétitive.
//
// Chapitres "freemiumDaily" (ex: Automatismes) : un nombre limité de
// questions par jour est offert sans abonnement (voir useDailyQuota), au-delà
// un écran invite à s'abonner. Un abonnement actif rend l'accès illimité.
//
// Props optionnelles pour une étape de Parcours (voir src/parcours.js,
// src/pages/ParcoursStep.jsx) — laissées vides, le composant se comporte
// exactement comme avant (jeu libre sans fin) :
//   - difficulty : "facile" | "standard" | "expert", transmise à
//     chapter.generate(difficulty). Quand elle est fournie (contexte
//     Parcours à palier fixe), la difficulté adaptative continue (voir plus
//     bas) est désactivée pour respecter le palier choisi par l'élève.
//     Absente (chapitre visité librement hors Parcours), la difficulté
//     s'ajuste en continu sur les 3 à 5 dernières réponses.
//   - sessionLength : nombre de questions de la série ; une fois atteint, un
//     écran de fin de série remplace le prochain exercice.
//   - onSessionComplete({ correct, total }) : appelé quand la série est
//     terminée (bouton "Terminer" de l'écran de fin de série).
//   - backTo : cible du lien "Retour", par défaut /niveau/:level.
//   - focusSkill : libellé de compétence (exercise.chapter) sur lequel
//     rester concentré — utilisé par la page /reviser ("pratiquer" une
//     compétence due en répétition espacée, voir ChapterPage.jsx qui lit le
//     paramètre d'URL ?competence=). Tant qu'il est fourni, chaque nouvel
//     exercice est tiré via generateMatchingSkill plutôt qu'au hasard dans
//     tout le chapitre.
// ---------------------------------------------------------------------------

const MODES = [
  { id: "decouverte", label: "Découverte" },
  { id: "entrainement", label: "Entraînement" },
  { id: "defi", label: "Défi" },
];

const DIFFICULTY_TIERS = ["facile", "standard", "expert"];

function formatDuration(ms) {
  const s = ms / 1000;
  return s < 10 ? `${s.toFixed(1)}s` : `${Math.round(s)}s`;
}

// Répétition espacée COURT TERME (à l'intérieur d'une même séance) : quand un
// générateur ne permet de filtrer que par difficulté, on tire des exercices
// jusqu'à retomber sur le même libellé de compétence (exercise.chapter), en
// se limitant à un nombre d'essais raisonnable, avec repli sur un tirage non
// filtré si la compétence ne revient pas assez vite (générateurs à faible
// diversité par étiquette).
function generateMatchingSkill(chapter, difficulty, skillLabel) {
  for (let i = 0; i < 15; i++) {
    const ex = chapter.generate(difficulty);
    if (ex.chapter === skillLabel) return ex;
  }
  return chapter.generate(difficulty);
}

export default function ChapterRunner({ chapter, difficulty, sessionLength, onSessionComplete, backTo, focusSkill }) {
  const { user } = useAuth();
  const { recordResult } = useProgress(user?.id, chapter.meta.id);
  const { subscription: rawSubscription } = useSubscription(user?.id);
  const subscription = getEffectiveSubscription(user, rawSubscription);
  const skillTracking = useSkillTracking(user?.id);
  const dailyStreak = useDailyStreak(user?.id);
  const dailyLimit = chapter.meta.freemiumDaily;
  const quota = useDailyQuota(chapter.meta.id, dailyLimit ?? 5);
  const quotaApplies = !!dailyLimit && !hasUnlimitedQuota(chapter, { user, subscription });
  const quotaExhausted = quotaApplies && quota.exhausted;
  const isSession = Number.isFinite(sessionLength) && sessionLength > 0;

  // Palier fixe (Parcours) vs difficulté adaptative en continu (chapitre
  // visité librement) — voir commentaire d'en-tête.
  const adaptive = !difficulty;
  const [autoDifficulty, setAutoDifficulty] = useState("standard");
  const [recentResults, setRecentResults] = useState([]);
  const effectiveDifficulty = difficulty ?? autoDifficulty;

  const [mode, setMode] = useState(() => (isSession ? "entrainement" : "decouverte"));
  const [exercise, setExercise] = useState(() =>
    focusSkill ? generateMatchingSkill(chapter, effectiveDifficulty, focusSkill) : chapter.generate(effectiveDifficulty)
  );
  const [redrillQueue, setRedrillQueue] = useState([]); // [{ skill, in }] — voir queueRedrill
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const defiStartRef = useRef(Date.now());

  const isDefi = mode === "defi";
  const isDecouverte = mode === "decouverte";

  // Streak quotidien de pratique : dès qu'on ouvre un chapitre pour s'y
  // exercer, ça compte comme la pratique du jour (voir useDailyStreak, no-op
  // si déjà comptabilisé aujourd'hui ou si non connecté).
  useEffect(() => {
    dailyStreak.markPracticed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chronomètre du mode Défi, remis à zéro à chaque entrée dans ce mode.
  useEffect(() => {
    if (mode !== "defi") return;
    defiStartRef.current = Date.now();
    setElapsed(0);
    const id = setInterval(() => setElapsed(Date.now() - defiStartRef.current), 100);
    return () => clearInterval(id);
  }, [mode]);

  // Difficulté adaptative en continu : sur la fenêtre glissante des 3 à 5
  // dernières réponses (pas un réglage figé), on monte d'un palier si la
  // réussite est nette (≥ 80 %) et on descend si elle est faible (≤ 20 %),
  // puis on vide la fenêtre pour éviter les oscillations. Désactivé dès
  // qu'une difficulté fixe est imposée (étape de Parcours).
  const adjustDifficulty = useCallback(
    (correct) => {
      if (!adaptive) return;
      setRecentResults((prev) => {
        const next = [...prev, correct].slice(-5);
        if (next.length >= 3) {
          const ratio = next.filter(Boolean).length / next.length;
          setAutoDifficulty((cur) => {
            const idx = DIFFICULTY_TIERS.indexOf(cur);
            if (ratio >= 0.8 && idx < DIFFICULTY_TIERS.length - 1) return DIFFICULTY_TIERS[idx + 1];
            if (ratio <= 0.2 && idx > 0) return DIFFICULTY_TIERS[idx - 1];
            return cur;
          });
          return [];
        }
        return next;
      });
    },
    [adaptive]
  );

  // Rejouer une variante de la compétence ratée un peu plus tard (2 ou 3
  // questions après, pas immédiatement) plutôt que de ne jamais y revenir
  // dans la séance — voir newExercise qui consulte cette file.
  const queueRedrill = useCallback((skillLabel) => {
    setRedrillQueue((prev) => {
      if (prev.some((r) => r.skill === skillLabel)) return prev;
      const inN = 2 + Math.floor(Math.random() * 2); // 2 ou 3 questions plus tard
      return [...prev, { skill: skillLabel, in: inN }];
    });
  }, []);

  const newExercise = useCallback(() => {
    if (isSession && answeredCount >= sessionLength) {
      setSessionDone(true);
      return;
    }
    const decremented = redrillQueue.map((r) => ({ ...r, in: r.in - 1 }));
    const dueIndex = decremented.findIndex((r) => r.in <= 0);
    let nextEx;
    if (dueIndex >= 0) {
      nextEx = generateMatchingSkill(chapter, effectiveDifficulty, decremented[dueIndex].skill);
      setRedrillQueue(decremented.filter((_, i) => i !== dueIndex));
    } else if (focusSkill) {
      nextEx = generateMatchingSkill(chapter, effectiveDifficulty, focusSkill);
      setRedrillQueue(decremented);
    } else {
      nextEx = chapter.generate(effectiveDifficulty);
      setRedrillQueue(decremented);
    }
    setExercise(nextEx);
    setInput("");
    setSelectedOption(null);
    setSelectedMulti([]);
    setFeedback(null);
    setShowHelp(false);
  }, [chapter, effectiveDifficulty, isSession, answeredCount, sessionLength, redrillQueue, focusSkill]);

  const retry = () => {
    setInput("");
    setSelectedOption(null);
    setSelectedMulti([]);
    setFeedback(null);
    setShowHelp(false);
  };

  const registerResult = (correct) => {
    setFeedback({ correct });
    if (quotaApplies) quota.consume();
    if (isSession) {
      setAnsweredCount((c) => c + 1);
      if (correct) setCorrectCount((c) => c + 1);
    }
    adjustDifficulty(correct);
    if (!correct) queueRedrill(exercise.chapter);
    skillTracking.recordAttempt({ skillId: exercise.chapter, chapterId: chapter.meta.id, correct });
    if (correct) {
      const newStreak = streak + 1;
      const bonus = newStreak % 5 === 0 ? 20 : 0;
      const newScore = score + 10 + bonus;
      setScore(newScore);
      setStreak(newStreak);
      setBest((b) => {
        const nb = Math.max(b, newStreak);
        // Pas de sauvegarde de score en mode Découverte : la méthode étant
        // visible en permanence, ce n'est pas une mesure fiable de maîtrise.
        if (!isDecouverte) recordResult({ score: newScore, bestStreak: nb });
        return nb;
      });
    } else {
      setStreak(0);
    }
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

  const ink = colors.ink;
  const paper = colors.bg;
  const gold = colors.gold;
  const slate = colors.slate;
  const green = colors.green;
  const red = colors.red;

  if (quotaExhausted) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
        style={{ background: paper, fontFamily: fonts.body }}
      >
        <div
          className="max-w-md w-full text-center rounded-3xl p-7"
          style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}
        >
          <Lock size={22} color={slate} className="mx-auto mb-3" />
          <p style={{ fontFamily: fonts.display, color: ink, fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.01em" }}>
            Questions gratuites épuisées pour aujourd'hui
          </p>
          <p className="text-sm mt-2 mb-5" style={{ color: slate }}>
            Tu as utilisé tes {dailyLimit} questions gratuites du jour sur « {chapter.meta.title} ». Reviens demain,
            ou abonne-toi pour un accès illimité à tous les chapitres.
          </p>
          <div className="flex flex-col gap-2 items-center">
            <Link
              to="/compte"
              className="inline-block py-2.5 px-6 rounded-full text-sm font-semibold"
              style={{ backgroundColor: ink, color: paper }}
            >
              Voir les abonnements
            </Link>
            <Link to={backTo ?? `/niveau/${chapter.meta.level}`} className="text-sm font-medium" style={{ color: slate }}>
              ← Retour aux chapitres
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (sessionDone) {
    const ratio = sessionLength > 0 ? correctCount / sessionLength : 0;
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
        style={{ background: paper, fontFamily: fonts.body }}
      >
        <div
          className="max-w-md w-full text-center rounded-3xl p-7"
          style={{ backgroundColor: colors.card, boxShadow: shadow.soft }}
        >
          <Trophy size={26} color={gold} className="mx-auto mb-3" />
          <p style={{ fontFamily: fonts.display, color: ink, fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.01em" }}>
            Série terminée !
          </p>
          <p className="text-sm mt-2 mb-5" style={{ color: slate }}>
            {correctCount} bonne{correctCount > 1 ? "s" : ""} réponse{correctCount > 1 ? "s" : ""} sur {sessionLength} (
            {Math.round(ratio * 100)} %)
          </p>
          <button
            onClick={() => onSessionComplete && onSessionComplete({ correct: correctCount, total: sessionLength })}
            className="inline-block py-2.5 px-6 rounded-full text-sm font-semibold"
            style={{ backgroundColor: ink, color: paper }}
          >
            Terminer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{
        background: isDefi ? `radial-gradient(circle at 50% 0%, #223258 0%, #0d1729 70%)` : paper,
        transition: "background 0.5s ease",
        fontFamily: fonts.body,
      }}
    >
      <div className="w-full max-w-md">
        <Link
          to={backTo ?? `/niveau/${chapter.meta.level}`}
          className="inline-flex items-center gap-1 text-xs font-semibold mb-4"
          style={{ color: isDefi ? "#8b9ec4" : slate }}
        >
          <ArrowLeft size={14} /> Retour aux chapitres
        </Link>
        <div className="text-center mb-6">
          <p
            className="text-xs tracking-widest uppercase mb-1 font-semibold"
            style={{ color: isDefi ? "#8b9ec4" : gold, letterSpacing: "0.12em" }}
          >
            {quotaApplies ? "Gratuit — accès limité" : chapter.meta.free ? "Chapitre gratuit" : "Chapitre abonnement"} —{" "}
            {chapter.meta.title}
          </p>
          {quotaApplies && (
            <p className="text-xs mt-1" style={{ color: isDefi ? "#8b9ec4" : slate }}>
              {quota.remaining} question{quota.remaining > 1 ? "s" : ""} gratuite{quota.remaining > 1 ? "s" : ""}{" "}
              restante{quota.remaining > 1 ? "s" : ""} aujourd'hui
            </p>
          )}
          <h1
            style={{
              fontFamily: fonts.display,
              color: isDefi ? "#FFFFFF" : ink,
              fontSize: "1.85rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            {chapter.meta.title}
          </h1>
          {chapter.meta.pourquoi && (
            <p className="text-sm mt-2 max-w-sm mx-auto leading-snug" style={{ color: isDefi ? "#b9c2d6" : slate }}>
              {chapter.meta.pourquoi}
            </p>
          )}
        </div>

        <div className="flex justify-center mb-6">
          <div
            className="relative flex items-center rounded-full p-1 text-xs font-semibold"
            style={{
              width: "290px",
              backgroundColor: isDefi ? "#0d1729" : "#EAEAEE",
              boxShadow: isDefi ? "0 0 0 1px #3a4d76" : "0 0 0 1px rgba(27,42,74,0.06)",
            }}
          >
            <span
              className="absolute top-1 bottom-1 rounded-full transition-all duration-300"
              style={{
                width: `${100 / 3}%`,
                left: `${(MODES.findIndex((m) => m.id === mode) * 100) / 3}%`,
                backgroundColor: isDefi ? gold : ink,
                boxShadow: isDefi ? `0 0 12px ${gold}88` : "0 1px 2px rgba(16,24,40,0.15)",
              }}
            />
            {MODES.map((m) => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className="relative z-10 flex-1 text-center py-1.5"
                  style={{ color: active ? (isDefi ? ink : paper) : isDefi ? "#9AA3B2" : "#8890A0" }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {isDefi && (
          <div className="flex justify-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-sm" style={{ color: gold }}>
              <Trophy size={16} />
              <span style={{ fontFamily: fonts.mono }}>{score} pts</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "#e8845a" }}>
              <Flame size={16} />
              <span style={{ fontFamily: fonts.mono }}>{streak} d'affilée</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm" style={{ color: "#8b9ec4" }}>
              <Timer size={16} />
              <span style={{ fontFamily: fonts.mono }}>{formatDuration(elapsed)}</span>
            </div>
          </div>
        )}

        <div
          className="rounded-3xl p-6 transition-all duration-500"
          style={{
            backgroundColor: isDefi ? "#16233f" : colors.card,
            boxShadow: isDefi ? `0 0 40px -8px ${gold}2e, inset 0 0 0 1px #ffffff0d` : shadow.soft,
          }}
        >
          <p className="text-xs uppercase tracking-wide mb-3" style={{ color: isDefi ? "#8b9ec4" : slate }}>
            {exercise.chapter}
          </p>
          <MathText
            as="p"
            text={exercise.prompt}
            className="mb-3 leading-relaxed"
            style={{ fontFamily: fonts.mono, fontSize: "1.05rem", color: isDefi ? "#FFFFFF" : ink }}
          />

          {exercise.figure && <Figure spec={exercise.figure} />}
          {exercise.graph && <Graph spec={exercise.graph} />}

          {isDecouverte && exercise.steps && (
            <div className="mb-3">
              <p
                className="text-xs uppercase tracking-wide mb-1.5 font-semibold flex items-center gap-1"
                style={{ color: gold }}
              >
                <Lightbulb size={13} /> Méthode
              </p>
              <StepsList steps={exercise.steps} dark={false} />
            </div>
          )}

          {exercise.type === "text" && (
            <>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!!feedback}
                placeholder="Ta réponse"
                onKeyDown={(e) => e.key === "Enter" && submitText()}
                className="w-full rounded-xl px-3 py-2.5 mb-3 text-sm"
                style={{
                  fontFamily: fonts.mono,
                  backgroundColor: isDefi ? "#0d1729" : "#F5F5F7",
                  color: isDefi ? "#FFFFFF" : ink,
                  boxShadow: isDefi ? "0 0 0 1px #3a4d76" : "0 0 0 1px rgba(27,42,74,0.08)",
                }}
              />
              {!feedback ? (
                <button
                  onClick={submitText}
                  className="w-full py-2.5 rounded-full text-sm font-semibold mb-3"
                  style={{ backgroundColor: isDefi ? gold : ink, color: isDefi ? ink : paper }}
                >
                  Valider
                </button>
              ) : (
                <button
                  onClick={newExercise}
                  className="w-full py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1 mb-3"
                  style={{ backgroundColor: isDefi ? gold : ink, color: isDefi ? ink : paper }}
                >
                  Suivant <ArrowRight size={14} />
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
                  let bg = isDefi ? "#0d1729" : "#F5F5F7";
                  let ring = isDefi ? "#3a4d76" : "rgba(27,42,74,0.08)";
                  let color = isDefi ? "#FFFFFF" : ink;
                  if (feedback && isCorrectOpt) {
                    bg = `${green}1c`;
                    ring = green;
                    color = green;
                  } else if (isWrongPick) {
                    bg = `${red}1c`;
                    ring = red;
                    color = red;
                  }
                  return (
                    <button
                      key={i}
                      disabled={!!feedback}
                      onClick={() => toggleMulti(i)}
                      className="flex items-center gap-2 text-left px-4 py-2.5 rounded-xl text-sm"
                      style={{ fontFamily: fonts.mono, backgroundColor: bg, boxShadow: `0 0 0 1px ${ring}`, color }}
                    >
                      {checked ? <CheckSquare size={16} /> : <Square size={16} />}
                      <MathText text={opt} />
                    </button>
                  );
                })}
              </div>
              {!feedback ? (
                <button
                  onClick={submitMulti}
                  className="w-full py-2.5 rounded-full text-sm font-semibold mb-3"
                  style={{ backgroundColor: isDefi ? gold : ink, color: isDefi ? ink : paper }}
                >
                  Valider
                </button>
              ) : (
                <button
                  onClick={newExercise}
                  className="w-full py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1 mb-3"
                  style={{ backgroundColor: isDefi ? gold : ink, color: isDefi ? ink : paper }}
                >
                  Suivant <ArrowRight size={14} />
                </button>
              )}
            </>
          )}

          {exercise.type === "qcm" && (
            <div className="grid grid-cols-1 gap-2 mb-3">
              {exercise.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrectOpt = feedback && opt === exercise.answer;
                let bg = isDefi ? "#0d1729" : "#F5F5F7";
                let ring = isDefi ? "#3a4d76" : "rgba(27,42,74,0.08)";
                let color = isDefi ? "#FFFFFF" : ink;
                if (feedback && isCorrectOpt) {
                  bg = `${green}1c`;
                  ring = green;
                  color = green;
                } else if (feedback && isSelected && !isCorrectOpt) {
                  bg = `${red}1c`;
                  ring = red;
                  color = red;
                }
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

          {exercise.type === "numeric" && (
            <>
              <div
                className="rounded-xl px-3 py-2 mb-3 text-right"
                style={{
                  fontFamily: fonts.mono,
                  fontSize: "1.2rem",
                  minHeight: "2.75rem",
                  backgroundColor: isDefi ? "#0d1729" : "#F5F5F7",
                  color: isDefi ? "#FFFFFF" : ink,
                  boxShadow: isDefi ? "0 0 0 1px #3a4d76" : "0 0 0 1px rgba(27,42,74,0.08)",
                }}
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
                    style={{
                      fontFamily: fonts.mono,
                      backgroundColor: isDefi ? "#0d1729" : "#F5F5F7",
                      color: isDefi ? "#FFFFFF" : ink,
                      boxShadow: isDefi ? "0 0 0 1px #3a4d76" : "0 0 0 1px rgba(27,42,74,0.08)",
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
                    className="flex-1 py-2.5 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: isDefi ? gold : ink, color: isDefi ? ink : paper }}
                  >
                    Valider
                  </button>
                ) : (
                  <button
                    onClick={newExercise}
                    className="flex-1 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1"
                    style={{ backgroundColor: isDefi ? gold : ink, color: isDefi ? ink : paper }}
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
              className="w-full py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1 mb-3"
              style={{ backgroundColor: isDefi ? gold : ink, color: isDefi ? ink : paper }}
            >
              Suivant <ArrowRight size={14} />
            </button>
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
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={retry}
                    className="flex-1 py-2 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "transparent", color: isDefi ? "#FFFFFF" : ink, boxShadow: `0 0 0 1px ${isDefi ? "#3a4d76" : "rgba(27,42,74,0.14)"}` }}
                  >
                    Réessayer
                  </button>
                  {!isDefi && !isDecouverte && (
                    <button
                      onClick={() => setShowHelp((s) => !s)}
                      className="flex-1 py-2 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: "transparent", color: ink, boxShadow: `0 0 0 1px ${ink}` }}
                    >
                      {showHelp ? "Masquer la méthode" : "Voir la méthode"}
                    </button>
                  )}
                </div>
              )}

              {!feedback.correct && showHelp && !isDefi && !isDecouverte && (
                <div className="mt-2">
                  <StepsList steps={exercise.steps} dark={false} />
                </div>
              )}
            </div>
          )}
        </div>

        {isDefi && best > 0 && (
          <p className="text-center text-xs mt-3" style={{ color: "#6c7fa3" }}>
            Meilleure série : {best}
          </p>
        )}

        {!user && (
          <p className="text-center text-xs mt-3" style={{ color: isDefi ? "#6c7fa3" : slate }}>
            Connecte-toi pour sauvegarder ta progression sur ce chapitre.
          </p>
        )}
      </div>
    </div>
  );
}
