// La question affichée est la seule source des résultats du diagnostic.
export function createDiagnosticResult(exercise, correct) {
  const metadata = exercise?.diagnostic;
  if (!metadata?.id || !metadata.skillId || metadata.skill !== exercise.chapter) {
    throw new Error("Question de diagnostic sans identité pédagogique cohérente");
  }
  return {
    questionId: metadata.id,
    levelId: metadata.levelId,
    skillId: metadata.skillId,
    skill: metadata.skill,
    sourceChapterId: metadata.sourceChapterId,
    chapterId: metadata.sourceChapterId ?? metadata.remediationChapterId,
    chapterTitle: metadata.skill,
    remediationChapterId: metadata.remediationChapterId,
    correct: Boolean(correct),
  };
}

export function summarizeDiagnostic(results) {
  return {
    priorities: results.filter((item) => !item.correct).slice(0, 3),
    strengths: results.filter((item) => item.correct).slice(0, 3),
    remediationChapterId: (results.find((item) => !item.correct) ?? results[0])?.remediationChapterId ?? null,
  };
}
