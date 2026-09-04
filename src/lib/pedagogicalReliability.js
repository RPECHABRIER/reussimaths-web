// Une observation de séance ne démontre jamais une maîtrise durable.
export function observeAnswer(previous = {}, { correct, assisted = false, recoveryPresented = false } = {}) {
  const firstAttempt = !(previous.attempts > 0);
  const usedAssistance = Boolean(previous.assisted || assisted || previous.hadError);
  const autonomous = Boolean(correct && firstAttempt && !usedAssistance);
  return {
    attempts: (previous.attempts ?? 0) + 1,
    correct: Boolean(previous.correct || correct),
    assisted: usedAssistance,
    hadError: Boolean(previous.hadError || !correct),
    autonomous: Boolean(previous.autonomous || autonomous),
    recovered: Boolean(previous.recovered || (recoveryPresented && autonomous)),
  };
}

export function summarizeQuestions(questions) {
  const stats = {};
  for (const question of questions) {
    const s = stats[question.skill] ??= { attempts: 0, correct: 0, autonomousCorrect: 0, assistedCorrect: 0, errors: 0, recovered: 0 };
    s.attempts += 1;
    s.correct += Number(question.correct);
    s.autonomousCorrect += Number(question.autonomous);
    s.assistedCorrect += Number(question.correct && !question.autonomous);
    s.errors += Number(question.hadError);
    s.recovered += Number(question.recovered);
  }
  return stats;
}

export function sessionEvidence(skillStats = {}) {
  const rows = Object.entries(skillStats);
  return {
    autonomous: rows.filter(([,s]) => s.autonomousCorrect > 0).map(([skill]) => skill),
    reinforce: rows.filter(([,s]) => s.errors > 0 || s.assistedCorrect > 0 || s.correct < s.attempts).map(([skill]) => skill),
    recovered: rows.filter(([,s]) => s.recovered > 0).map(([skill]) => skill),
  };
}

export function reviewObservation(review) {
  if (review.recovered === true) return "Après une erreur, une question analogue a été réussie sans aide. Cette réussite immédiate reste à consolider lors d’une autre séance.";
  if (review.correct === true && review.hadError === true) return "Une erreur a été rencontrée, puis la question a été réussie après reprise. Un nouvel essai sans aide reste utile.";
  if (review.correct === true && review.autonomous === true) return "Cette question a été réussie sans aide. Cela ne suffit pas à conclure à une maîtrise durable.";
  if (review.correct === true && review.assisted === true) return "Cette question a été réussie avec aide. La notion reste à consolider.";
  if (review.correct === true) return "Cette question a été réussie. Une explication est disponible pour revoir la méthode.";
  if (review.hadError === true || review.correct === false) return "Une erreur a été rencontrée sur cette question. La méthode est disponible pour la reprendre.";
  return "Une explication est disponible pour cette question. Le résultat et l’aide utilisée ne sont pas renseignés.";
}
