// Dernière barrière de sécurité entre les générateurs aléatoires et l'élève.
// Même lorsqu'une combinaison rare fait coïncider deux distracteurs, le QCM
// affiché reste non ambigu.
export function normalizeExercise(exercise) {
  if (!exercise || exercise.type !== "qcm") return exercise;

  const answer = exercise.answer;
  const candidates = Array.isArray(exercise.options) ? exercise.options : [];
  const options = [];

  for (const option of candidates) {
    if (option == null) continue;
    if (!options.some((existing) => Object.is(existing, option))) options.push(option);
  }

  if (answer != null && !options.some((option) => Object.is(option, answer))) options.unshift(answer);

  if (options.length < 2) options.push("Aucune de ces réponses");

  // Ne change l'objet que si une réparation était nécessaire. Cela évite de
  // rebattre les réponses et conserve l'ordre prévu par chaque générateur.
  const unchanged = candidates.length === options.length
    && candidates.every((option, index) => Object.is(option, options[index]));
  return unchanged ? exercise : { ...exercise, options };
}
