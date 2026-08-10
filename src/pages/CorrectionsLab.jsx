import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import LearningFeedback from "../components/LearningFeedback";
import MathText from "../components/MathText";
import { useAuth } from "../hooks/useAuth";
import { isRealAdmin } from "../lib/access";
import { colors, fonts } from "../theme";

const SAMPLES = [
  ["Nombres relatifs", { type: "numeric", chapter: "Nombres relatifs — Additionner deux relatifs de signes contraires", prompt: "Calcule : \\(-7+12\\)", answer: 5, steps: ["Les signes sont opposés : 12 est le plus « fort ».", "\\(12-7=5\\) : le résultat est positif."] }, "-19"],
  ["Fractions", { type: "numeric", chapter: "Fractions — Addition", prompt: "Calcule : \\(\\frac{2}{3}+\\frac{1}{4}\\)", answer: "11/12", steps: ["\\(\\frac{2}{3}=\\frac{8}{12}\\) et \\(\\frac{1}{4}=\\frac{3}{12}\\)", "\\(\\frac{8}{12}+\\frac{3}{12}=\\frac{11}{12}\\)"] }, "3/7"],
  ["Équation", { type: "numeric", chapter: "Équations — Résoudre", prompt: "Résous : \\(4x-7=13\\)", answer: 5, steps: ["On ajoute 7 dans les deux membres : \\(4x=20\\).", "On divise les deux membres par 4 : \\(x=5\\)."] }, "1,5"],
  ["Pourcentage", { type: "numeric", chapter: "Pourcentages — Évolution", prompt: "Augmente 80 € de 20 %.", answer: 96, steps: ["10 % de 80 vaut 8 ; 20 % vaut donc 16.", "\\(80+16=96\\)"] }, "100"],
  ["Pythagore", { type: "numeric", chapter: "Théorème de Pythagore — Hypoténuse", prompt: "ABC est rectangle en A, AB = 6 cm et AC = 8 cm. Calcule BC.", answer: 10, steps: ["\\(BC^2=AB^2+AC^2\\)", "\\(BC^2=36+64=100\\)", "\\(BC=\\sqrt{100}=10\\text{ cm}\\)"] }, "14"],
  ["Image et antécédent", { type: "numeric", chapter: "Fonctions — Image et antécédent", prompt: "Pour \\(f(x)=3x-2\\), calcule l’image de 4.", answer: 10, steps: ["\\(f(4)=3\\times4-2\\)", "\\(f(4)=10\\)"] }, "2"],
  ["Probabilité", { type: "numeric", chapter: "Probabilités — Issues favorables", prompt: "Un sac contient 3 boules rouges et 2 bleues. Probabilité d’obtenir rouge ?", answer: "3/5", steps: ["Il y a 3 issues favorables et 5 issues possibles.", "\\(P(rouge)=\\frac{3}{5}\\)"] }, "3/2"],
  ["Lecture graphique", { type: "numeric", chapter: "Fonctions — Antécédent graphique", prompt: "Lis l’antécédent de 2.", answer: 3, steps: ["On part de 2 sur l’axe des ordonnées, puis on rejoint la courbe.", "On descend vers l’axe des abscisses : on lit 3."], feedbackGraph: { xMin: -4, xMax: 5, yMin: -3, yMax: 5, lines: [{ a: 1, b: -1, label: "f" }], points: [{ x: 3, y: 2, label: "(3 ; 2)" }], readingPaths: [{ y: 2, xs: [3] }] } }, "2"],
  ["Distributivité", { type: "text", chapter: "Calcul littéral — Développer", prompt: "Développe : \\(3(x+4)\\)", answer: "3x+12", steps: ["\\(3(x+4)=3\\times x+3\\times4\\)", "\\(3x+12\\)"] }, "3x+4"],
  ["Puissances", { type: "numeric", chapter: "Puissances — Parenthèses", prompt: "Calcule : \\((-3)^2\\)", answer: 9, steps: ["\\((-3)^2=(-3)\\times(-3)\\)", "Le produit de deux nombres négatifs est positif : \\(9\\)."] }, "-9"],
  ["Proportionnalité", { type: "numeric", chapter: "Proportionnalité — Retour à l’unité", prompt: "4 cahiers coûtent 10 €. Prix de 6 cahiers ?", answer: 15, steps: ["Retour à l’unité : \\(10\\div4=2{,}50\\) €.", "\\(6\\times2{,}50=15\\) €."] }, "12"],
  ["Longueurs", { type: "numeric", chapter: "Grandeurs et mesures — Unités de longueur", prompt: "Convertis 2,4 m en cm.", answer: 240, conversionTable: { kind: "length", value: 2.4, fromUnit: "m", toUnit: "cm", answer: 240 }, steps: ["\\(1\\text{ m}=100\\text{ cm}\\)", "\\(2{,}4\\times100=240\\)"] }, "2400"],
  ["Aires", { type: "numeric", chapter: "Grandeurs et mesures — Unités d'aire", prompt: "Convertis 2,4 m² en cm².", answer: 24000, conversionTable: { kind: "area", value: 2.4, fromUnit: "m²", toUnit: "cm²", answer: 24000 }, steps: ["\\(1\\text{ m}^2=10 000\\text{ cm}^2\\)", "\\(2{,}4\\times10 000=24 000\\)"] }, "240"],
  ["Volumes", { type: "numeric", chapter: "Géométrie dans l'espace — Conversions", prompt: "Convertis 2,4 m³ en cm³.", answer: 2400000, conversionTable: { kind: "volume", value: 2.4, fromUnit: "m³", toUnit: "cm³", answer: 2400000 }, steps: ["\\(1\\text{ m}^3=1 000 000\\text{ cm}^3\\)", "\\(2{,}4\\times1 000 000=2 400 000\\)"] }, "24000"],
  ["Arrondi", { type: "numeric", chapter: "Nombres décimaux — Arrondir", prompt: "Arrondis 3,146 au centième.", answer: 3.15, steps: ["Le chiffre des centièmes est 4 ; le chiffre suivant est 6.", "Comme 6 est supérieur à 5, le chiffre 4 devient 5."] }, "3,14"],
  ["Unité d’aire", { type: "text", chapter: "Géométrie — Aire", prompt: "Quelle unité convient pour une aire mesurée en centimètres ?", answer: "cm²", steps: ["Une aire mesure une surface : l’unité est élevée au carré.", "On écrit donc cm²."] }, "cm"],
  ["Moyenne pondérée", { type: "numeric", chapter: "Statistiques — Moyenne et effectifs", prompt: "Calcule la moyenne de valeurs associées à des effectifs.", answer: 12, steps: ["On multiplie chaque valeur par son effectif.", "On additionne ces produits puis on divise par l’effectif total."] }, "10"],
  ["Produit de relatifs", { type: "numeric", chapter: "Nombres relatifs — Produit", prompt: "Calcule : \\((-4)\\times(-3)\\)", answer: 12, steps: ["Le produit de deux nombres négatifs est positif.", "\\(4\\times3=12\\)"] }, "-12"],
  ["Fraction irréductible", { type: "text", chapter: "Fractions — Simplifier", prompt: "Donne \\(\\frac{8}{12}\\) sous forme irréductible.", answer: "2/3", steps: ["8 et 12 sont divisibles par 4.", "\\(\\frac{8}{12}=\\frac{2}{3}\\)"] }, "4/6"],
  ["QCM multiple", { type: "multi", chapter: "Raisonnement — Plusieurs réponses", prompt: "Sélectionne toutes les affirmations vraies.", answer: [0, 2], steps: ["Teste chaque affirmation indépendamment.", "Conserve seulement celles qui sont vraies à elles seules."] }, [0]],
];

export default function CorrectionsLab() {
  const { user, loading } = useAuth();
  const [index, setIndex] = useState(0);
  const allowed = import.meta.env.DEV || isRealAdmin(user);
  if (loading) return null;
  if (!allowed) return <main className="min-h-screen p-8" style={{ background: colors.bg, color: colors.ink }}>Accès réservé à l’administration.</main>;
  const [title, exercise, response] = SAMPLES[index];
  return (
    <main className="min-h-screen px-4 py-6 sm:px-8" style={{ background: colors.bg, fontFamily: fonts.body }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/admin" className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: colors.slate }}><ArrowLeft size={14} /> Administration</Link>
        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: colors.gold }}>Laboratoire pédagogique</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black" style={{ color: colors.ink, fontFamily: fonts.display }}>Contrôler les corrections</h1>
        <label className="block mt-5 text-xs font-bold" style={{ color: colors.slate }}>
          Exemple à examiner
          <select value={index} onChange={(event) => setIndex(Number(event.target.value))} className="mt-2 w-full rounded-xl border bg-white px-3 py-3 text-sm" style={{ borderColor: colors.hairline, color: colors.ink }}>
            {SAMPLES.map(([sampleTitle], sampleIndex) => <option key={sampleTitle} value={sampleIndex}>{sampleIndex + 1}. {sampleTitle}</option>)}
          </select>
        </label>
        <section className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold" style={{ color: colors.slate }}>Erreur simulée : {title}</p>
          <MathText as="p" text={exercise.prompt} className="mt-2 text-sm font-semibold" style={{ color: colors.ink }} />
          <p className="mt-1 text-xs" style={{ color: colors.red }}>Réponse donnée : {Array.isArray(response) ? response.join(", ") : response}</p>
          <div className="mt-4"><LearningFeedback exercise={exercise} response={response} /></div>
        </section>
      </div>
    </main>
  );
}
