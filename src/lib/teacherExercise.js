export const TEACHER_EXERCISE_TYPES = ["numeric", "text", "qcm", "multi"];

export function hasTeacherOptions(exercise) {
  return ["qcm", "multi"].includes(exercise.type) && Array.isArray(exercise.options);
}

export function teacherAnswer(exercise) {
  const format = (value) => typeof value === "number" ? String(value).replace(".", ",") : String(value);
  if (exercise.type === "multi") {
    if (!Array.isArray(exercise.answer) || !Array.isArray(exercise.options) ||
      exercise.answer.some((index) => !Number.isInteger(index) || index < 0 || index >= exercise.options.length)) {
      return "Réponse indisponible";
    }
    return exercise.answer.length ? exercise.answer.map((index) => format(exercise.options[index])).join(" · ") : "Aucune proposition";
  }
  if (exercise.answerDisplay != null) return format(exercise.answerDisplay);
  // Les tableaux texte représentent des écritures alternatives acceptées.
  return Array.isArray(exercise.answer) ? exercise.answer.map(format).join(" ou ") : format(exercise.answer);
}
