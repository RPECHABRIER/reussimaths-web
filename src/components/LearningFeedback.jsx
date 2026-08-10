import { AlertCircle, Search, Target } from "lucide-react";
import { classifyLearningError } from "../lib/learningError";
import { colors, fonts } from "../theme";

const EXPLANATIONS = {
  sign_error: {
    title: "Le calcul semble juste, mais le signe est inversé.",
    check: "Repère si le résultat doit être à gauche de 0, représenter une perte ou provenir d’un nombre négatif.",
  },
  place_value_error: {
    title: "La valeur est proche, mais la virgule ou le rang d’un chiffre semble décalé.",
    check: "Compare l’ordre de grandeur attendu, puis recompte les déplacements de la virgule.",
  },
  rounding_error: {
    title: "Tu es très proche : c’est probablement un problème d’arrondi.",
    check: "Garde les chiffres pendant le calcul et arrondis seulement à la toute fin, au rang demandé.",
  },
  invalid_format: {
    title: "La réponse n’a pas été reconnue comme un nombre.",
    check: "Utilise uniquement les chiffres, la virgule, la barre de fraction et la touche ± si le nombre est négatif.",
  },
  calculation_error: {
    title: "Une étape du calcul ou le choix de l’opération est à reprendre.",
    check: "Écris d’abord ce que tu cherches, choisis la règle correspondante, puis vérifie chaque étape séparément.",
  },
  choice_confusion: {
    title: "La proposition choisie ne respecte pas encore toutes les informations de l’énoncé.",
    check: "Élimine chaque choix avec une propriété précise, puis relis la question avant de décider.",
  },
  incomplete_reasoning: {
    title: "Il manque probablement un choix juste, ou un choix incorrect a été conservé.",
    check: "Teste chaque proposition indépendamment : elle doit être vraie à elle seule pour être cochée.",
  },
  vocabulary_or_reasoning: {
    title: "Le mot attendu ou la propriété utilisée n’est pas encore assez précis.",
    check: "Reprends les mots mathématiques de l’énoncé et vérifie qu’ils désignent exactement l’objet demandé.",
  },
  unknown: {
    title: "Ta réponse ne convient pas encore.",
    check: "Repars des données utiles, puis compare chaque étape avec la méthode proposée.",
  },
};

export default function LearningFeedback({ exercise, response, compact = false }) {
  const code = classifyLearningError(exercise, response);
  const explanation = EXPLANATIONS[code] ?? EXPLANATIONS.unknown;
  return (
    <div className={`rounded-2xl text-left ${compact ? "p-3" : "p-4"}`} style={{ backgroundColor: `${colors.gold}12`, border: `1px solid ${colors.gold}35` }}>
      <p className="flex items-start gap-2 text-sm font-bold" style={{ color: colors.ink }}>
        <AlertCircle size={16} color={colors.gold} className="shrink-0 mt-0.5" />
        {explanation.title}
      </p>
      <p className="flex items-start gap-2 text-xs mt-2 leading-relaxed" style={{ color: colors.slate }}>
        <Search size={14} className="shrink-0 mt-0.5" />
        <span><strong style={{ color: colors.ink }}>À vérifier :</strong> {explanation.check}</span>
      </p>
      {exercise?.type === "numeric" && Number(exercise.answer) < 0 && (
        <p className="flex items-start gap-2 text-xs mt-2 font-semibold" style={{ color: colors.ink, fontFamily: fonts.mono }}>
          <Target size={14} color={colors.gold} className="shrink-0 mt-0.5" />
          Ici, le résultat recherché est un nombre négatif : pense à utiliser la touche ±.
        </p>
      )}
    </div>
  );
}
