// ---------------------------------------------------------------------------
// Chapitre : Automatismes — freemium (questions gratuites limitées par jour,
// illimité avec abonnement). Placeholder minimal pour valider le registre.
// À enrichir avec de vrais générateurs (calcul mental, pourcentages, etc.)
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generate() {
  const a = randInt(2, 20);
  const b = randInt(2, 20);
  return {
    type: "numeric",
    chapter: "Automatismes — Calcul mental",
    prompt: `Calculer : \\(${a} \\times ${b}\\)`,
    answer: a * b,
    steps: [`\\(${a} \\times ${b} = ${a * b}\\)`],
  };
}

export default {
  meta: {
    id: "automatismes",
    title: "Automatismes",
    description: "Calcul mental, pourcentages, priorités opératoires.",
    level: "premiere-spe",
    freemiumDaily: 5, // 5 questions gratuites par jour, illimité avec abonnement
    order: 1,
  },
  generate,
};
