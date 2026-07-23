// ---------------------------------------------------------------------------
// Chapitre : Automatismes — transversal, toujours gratuit.
// Placeholder minimal pour valider le registre avec plusieurs chapitres.
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
    description: "Calcul mental, pourcentages, priorités opératoires — toujours accessible.",
    free: true,
    order: 1,
  },
  generate,
};
