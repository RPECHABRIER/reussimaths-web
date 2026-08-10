import { AlertCircle, BookOpenCheck, Search, Target } from "lucide-react";
import { buildPedagogicalFeedback } from "../lib/pedagogicalFeedback";
import { colors, fonts } from "../theme";
import Graph from "./Graph";
import MathText from "./MathText";
import StepsList from "./StepsList";
import UnitConversionTable from "./UnitConversionTable";

export default function LearningFeedback({ exercise, response, compact = false }) {
  const feedback = buildPedagogicalFeedback(exercise, response);
  return (
    <div className={`rounded-2xl text-left ${compact ? "p-3" : "p-4"}`} style={{ backgroundColor: `${colors.gold}12`, border: `1px solid ${colors.gold}35` }}>
      <p className="flex items-start gap-2 text-sm font-bold leading-relaxed" style={{ color: colors.ink }}>
        <AlertCircle size={16} color={colors.gold} className="shrink-0 mt-0.5" />
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

      <p className="mt-3 rounded-xl px-3 py-2 text-xs font-semibold leading-relaxed" style={{ backgroundColor: "white", color: colors.ink }}>
        <MathText text={feedback.conclusion} />
      </p>
    </div>
  );
}
