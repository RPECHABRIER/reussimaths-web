// ---------------------------------------------------------------------------
// Chapitre : Suites numériques — sous abonnement.
// Placeholder minimal pour valider le registre avec un chapitre verrouillé.
// ---------------------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generate() {
  const u0 = randInt(1, 10);
  const r = randInt(2, 5);
  return {
    type: "numeric",
    chapter: "Suites — Arithmétique",
    prompt: `Une suite arithmétique a pour premier terme \\(u_0 = ${u0}\\) et pour raison \\(r = ${r}\\). Calculer \\(u_3\\).`,
    answer: u0 + 3 * r,
    steps: [`\\(u_3 = u_0 + 3r\\)`, `\\(u_3 = ${u0} + 3 \\times ${r} = ${u0 + 3 * r}\\)`],
  };
}

export default {
  meta: {
    id: "suites",
    title: "Suites numériques",
    description: "Suites arithmétiques et géométriques, sens de variation, limites.",
    level: "premiere-spe",
    free: false,
    order: 3,
    unlockHint: "Débloqué avec l'abonnement Reussimaths.",
  },
  generate,
};
