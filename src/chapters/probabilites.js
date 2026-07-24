// ---------------------------------------------------------------------------
// Chapitre : Probabilités (Première Spécialité) — débloqué par parrainage
// (meta.unlockReferrals), pas par abonnement. Placeholder minimal, à enrichir
// avec de vrais générateurs (probabilités conditionnelles, arbres, etc.)
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generate() {
  const total = randInt(20, 40);
  const favorable = randInt(1, total - 1);
  const pct = Math.round((favorable / total) * 100);
  return {
    type: "numeric",
    chapter: "Probabilités — Probabilité simple",
    prompt: `Une urne contient \\(${total}\\) boules, dont \\(${favorable}\\) rouges. On tire une boule au hasard. Quelle est la probabilité de tirer une boule rouge ? (donner le résultat en % arrondi à l'entier)`,
    answer: pct,
    steps: [
      `\\(P(\\text{rouge}) = \\dfrac{\\text{nombre de boules rouges}}{\\text{nombre total de boules}}\\)`,
      `\\(P(\\text{rouge}) = \\dfrac{${favorable}}{${total}} \\approx ${pct}\\%\\)`,
    ],
  };
}

export default {
  meta: {
    id: "probabilites",
    title: "Probabilités",
    description: "Probabilités simples, conditionnelles, arbre pondéré.",
    level: "premiere-spe",
    unlockReferrals: 5, // débloqué quand 5 amis parrainés utilisent l'app
    order: 4,
    unlockHint: "Débloqué en invitant 5 amis qui utilisent Reussimaths (voir ton compte pour ton lien de parrainage).",
  },
  generate,
};
