export function teacherSeriesProperties(levelId, questionCount) {
  return { levelId, questionCount };
}

export function teacherQuestionProperties(levelId, questionIndex, questionCount) {
  return { levelId, questionIndex: questionIndex + 1, questionCount };
}
