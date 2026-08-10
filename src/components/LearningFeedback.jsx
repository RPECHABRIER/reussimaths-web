import { AlertCircle, Search, Target } from "lucide-react";
import { classifyLearningError } from "../lib/learningError";
import { colors, fonts } from "../theme";
import Graph from "./Graph";

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

const NOTION_GUIDANCE = [
  [/fraction|rationnel/i, "Représente les quantités avec le même dénominateur avant de comparer ou de calculer, puis simplifie seulement à la fin."],
  [/relatif|nombre négatif|signe/i, "Sur une droite graduée, commence par situer les nombres par rapport à 0 ; dans un calcul, sépare le signe de la valeur absolue."],
  [/équation|inconnue/i, "Effectue la même opération dans les deux membres et vérifie la solution en la remplaçant dans l’équation de départ."],
  [/proportion|pourcentage|taux/i, "Identifie d’abord la grandeur de référence et vérifie qu’un même coefficient relie bien les deux grandeurs."],
  [/fonction|image|antécédent/i, "Distingue bien l’entrée x et la sortie f(x) : une image se calcule, un antécédent se recherche."],
  [/puissance/i, "Repère séparément la base, l’exposant et le signe éventuel avant d’appliquer une règle sur les puissances."],
  [/angle|triangle|cercle|symétr|géométr|périmètre|aire|volume/i, "Reporte les données sur la figure, nomme la propriété utilisée et contrôle l’unité du résultat."],
  [/statistique|probabilit|moyenne|médiane/i, "Identifie l’effectif total et ce que représente chaque valeur avant d’appliquer la formule ou de lire le graphique."],
];

function notionGuidance(exercise) {
  const label = `${exercise?.chapter ?? ""} ${exercise?.prompt ?? ""}`;
  return NOTION_GUIDANCE.find(([pattern]) => pattern.test(label))?.[1] ?? "Relie chaque donnée de l’énoncé à une étape de la méthode, sans faire plusieurs transformations mentalement en même temps.";
}

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
      <p className="flex items-start gap-2 text-xs mt-2 leading-relaxed" style={{ color: colors.slate }}>
        <Target size={14} color={colors.gold} className="shrink-0 mt-0.5" />
        <span><strong style={{ color: colors.ink }}>Pour cette notion :</strong> {notionGuidance(exercise)}</span>
      </p>
      {exercise?.type === "numeric" && Number(exercise.answer) < 0 && (
        <p className="flex items-start gap-2 text-xs mt-2 font-semibold" style={{ color: colors.ink, fontFamily: fonts.mono }}>
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
    </div>
  );
}
