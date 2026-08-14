export const DISCOVERY_QUESTIONS_PER_LEVEL = 5;

export function getDiscoveryLevelReadiness(audits, levelId, required = DISCOVERY_QUESTIONS_PER_LEVEL) {
  const prefix = `Découverte ${levelId} — question `;
  const rows = Object.entries(audits ?? {}).filter(([sampleKey]) => sampleKey.startsWith(prefix));
  const approved = rows.filter(([, audit]) => Number(audit?.qualityScore) >= 9
    && audit?.status === "validée"
    && audit?.checks?.length >= 8);
  return {
    levelId,
    approved: approved.length,
    required,
    ready: approved.length >= required,
    approvedKeys: approved.map(([sampleKey]) => sampleKey),
  };
}

export function filterApprovedDiscoveryExercises(exercises, audits, levelId) {
  const readiness = getDiscoveryLevelReadiness(audits, levelId);
  if (!readiness.ready) return exercises;
  const approved = new Set(readiness.approvedKeys);
  return exercises.filter((_, index) => approved.has(`Découverte ${levelId} — question ${index + 1}`));
}

