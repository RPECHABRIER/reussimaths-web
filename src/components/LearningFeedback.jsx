import { useEffect } from "react";
import { AlertCircle, BookOpenCheck, CheckCircle2, Search, Target } from "lucide-react";
import { buildPedagogicalFeedback } from "../lib/pedagogicalFeedback";
import { rememberLearningReview } from "../lib/learningReviewHistory";
import { toRemoteLearningReview } from "../lib/learningReviewHistory";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import { colors, fonts } from "../theme";
import Graph from "./Graph";
import MathText from "./MathText";
import StepsList from "./StepsList";
import UnitConversionTable from "./UnitConversionTable";
import FeedbackVisual from "./FeedbackVisual";

export default function LearningFeedback({ exercise, response, compact = false, remember = false, correct = false }) {
  const builtFeedback = buildPedagogicalFeedback(exercise, response);
  const feedback = correct ? { ...builtFeedback, intro: "Oui, cette réponse est correcte. Voici pourquoi la méthode fonctionne et ce qu’il faut retenir." } : builtFeedback;
  const { user } = useAuth();
  useEffect(() => {
    if (!remember) return;
    const review = rememberLearningReview({ exercise, response, feedback });
    const remote = toRemoteLearningReview(review);
    if (user?.id && remote) {
      supabase.from("learning_review_cards").upsert({
        user_id: user.id,
        review_key: remote.reviewKey,
        payload: remote.payload,
        reviewed_at: new Date().toISOString(),
      }, { onConflict: "user_id,review_key" }).then(({ error }) => {
        if (error && error.code !== "42P01") console.error("[LearningFeedback] synchronisation du cahier :", error.message);
      });
    }
  }, [remember, exercise, response, feedback.family, feedback.conclusion, user?.id]);
  return (
    <div
      data-feedback-family={feedback.family}
      className={`learning-feedback-card overflow-hidden rounded-[1.4rem] text-left ${compact ? "p-3 sm:p-4" : "p-4 sm:p-5"}`}
      style={{ backgroundColor: correct ? `${colors.green}0d` : `${colors.gold}12`, border: `1px solid ${correct ? colors.green : colors.gold}35` }}
    >
      <p className="flex items-start gap-2.5 text-[0.95rem] sm:text-base font-bold leading-relaxed" style={{ color: colors.ink }}>
        <AlertCircle size={18} color={correct ? colors.green : colors.gold} className="shrink-0 mt-0.5" />
        <MathText text={feedback.intro} />
      </p>

      <div className="mt-3 grid grid-cols-3 gap-1.5" aria-label="Les trois temps de la correction">
        {["1 Comprendre", "2 Appliquer", "3 Retenir"].map((label, index) => (
          <div key={label} className="rounded-full px-2 py-1.5 text-center text-[9px] sm:text-[10px] font-black uppercase tracking-wide" style={{ background: index === 0 ? `${colors.gold}20` : "rgba(255,255,255,.75)", color: index === 2 ? colors.green : colors.ink }}>{label}</div>
        ))}
      </div>

      <div className="mt-3 grid gap-2.5">
        <section className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2.5 rounded-xl bg-white/70 p-3 sm:p-3.5">
          <Search size={17} className="mt-0.5" color={colors.slate} />
          <div className="min-w-0 text-sm leading-6" style={{ color: colors.slate }}>
            <p className="mb-0.5 font-bold" style={{ color: colors.ink }}>Comprendre</p>
            <MathText text={feedback.meaning} />
          </div>
        </section>

        <section className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2.5 rounded-xl bg-white/70 p-3 sm:p-3.5">
          <Target size={17} color={colors.gold} className="mt-0.5" />
          <div className="min-w-0 text-sm leading-6" style={{ color: colors.slate }}>
            <p className="mb-0.5 font-bold" style={{ color: colors.ink }}>Méthode à retenir</p>
            <MathText text={feedback.rule} />
          </div>
        </section>
      </div>

      {feedback.steps.length > 0 && (
        <section className="mt-3 rounded-xl bg-white/70 p-3 sm:p-3.5">
          <p className="flex items-center gap-2 text-sm font-bold mb-2.5" style={{ color: colors.ink }}>
            <BookOpenCheck size={17} color={colors.green} /> Application à cette question
          </p>
          <StepsList steps={feedback.steps} dark={false} />
        </section>
      )}

      {exercise?.type === "numeric" && Number(exercise.answer) < 0 && (
        <p className="flex items-start gap-2 text-sm mt-3 rounded-xl bg-white/70 p-3 font-semibold leading-relaxed" style={{ color: colors.ink, fontFamily: fonts.mono }}>
          <Target size={16} color={colors.gold} className="shrink-0 mt-0.5" />
          Ici, le résultat recherché est un nombre négatif : pense à utiliser la touche ±.
        </p>
      )}

      {exercise?.feedbackGraph && (
        <div className="learning-feedback-graph mt-4 rounded-xl bg-white pt-3" style={{ border: `1px solid ${colors.gold}35` }}>
          <p className="px-3 text-xs font-bold" style={{ color: colors.ink }}>Le chemin à suivre sur le graphique</p>
          <Graph spec={exercise.feedbackGraph} />
        </div>
      )}

      {exercise?.conversionTable && <UnitConversionTable spec={exercise.conversionTable} />}

      <div className="learning-feedback-visual">
        <FeedbackVisual family={feedback.family} exercise={exercise} />
      </div>

      <div className="mt-3 grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2.5 rounded-xl bg-white p-3 sm:p-3.5" style={{ color: colors.ink }}>
        <CheckCircle2 size={17} color={colors.green} className="mt-0.5" />
        <div className="min-w-0 text-sm font-semibold leading-6">
          <p className="mb-0.5 font-black">Résultat et idée essentielle</p>
          <MathText text={feedback.conclusion} />
        </div>
      </div>
    </div>
  );
}
