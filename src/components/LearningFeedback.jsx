import { useEffect } from "react";
import { AlertCircle, BookOpenCheck, Search, Target } from "lucide-react";
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
    <div data-feedback-family={feedback.family} className={`rounded-2xl text-left ${compact ? "p-3" : "p-4"}`} style={{ backgroundColor: correct ? `${colors.green}0d` : `${colors.gold}12`, border: `1px solid ${correct ? colors.green : colors.gold}35` }}>
      <p className="flex items-start gap-2 text-sm font-bold leading-relaxed" style={{ color: colors.ink }}>
        <AlertCircle size={16} color={correct ? colors.green : colors.gold} className="shrink-0 mt-0.5" />
        <MathText text={feedback.intro} />
      </p>

      <p className="flex items-start gap-2 text-xs mt-3 leading-relaxed" style={{ color: colors.slate }}>
        <Search size={14} className="shrink-0 mt-0.5" />
        <span><strong style={{ color: colors.ink }}>Comprendre :</strong> <MathText text={feedback.meaning} /></span>
      </p>

      <p className="flex items-start gap-2 text-xs mt-3 leading-relaxed" style={{ color: colors.slate }}>
        <Target size={14} color={colors.gold} className="shrink-0 mt-0.5" />
        <span><strong style={{ color: colors.ink }}>Méthode à retenir :</strong> <MathText text={feedback.rule} /></span>
      </p>

      {feedback.steps.length > 0 && (
        <div className="mt-3">
          <p className="flex items-center gap-2 text-xs font-bold mb-1" style={{ color: colors.ink }}>
            <BookOpenCheck size={14} color={colors.green} /> Application à cette question
          </p>
          <StepsList steps={feedback.steps} dark={false} />
        </div>
      )}

      {exercise?.type === "numeric" && Number(exercise.answer) < 0 && (
        <p className="flex items-start gap-2 text-xs mt-3 font-semibold" style={{ color: colors.ink, fontFamily: fonts.mono }}>
          <Target size={14} color={colors.gold} className="shrink-0 mt-0.5" />
          Ici, le résultat recherché est un nombre négatif : pense à utiliser la touche ±.
        </p>
      )}

      {exercise?.feedbackGraph && (
        <div className="mt-4 rounded-xl bg-white pt-3" style={{ border: `1px solid ${colors.gold}35` }}>
          <p className="px-3 text-xs font-bold" style={{ color: colors.ink }}>Le chemin à suivre sur le graphique</p>
          <Graph spec={exercise.feedbackGraph} />
        </div>
      )}

      {exercise?.conversionTable && <UnitConversionTable spec={exercise.conversionTable} />}

      <FeedbackVisual family={feedback.family} />

      <p className="mt-3 rounded-xl px-3 py-2 text-xs font-semibold leading-relaxed" style={{ backgroundColor: "white", color: colors.ink }}>
        <MathText text={feedback.conclusion} />
      </p>
    </div>
  );
}
