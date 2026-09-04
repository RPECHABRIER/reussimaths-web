// Sélection conservatrice : la ressemblance textuelle seule ne diagnostique
// pas la cause d'une erreur. Les familles non reconnues restent générales.
function normalized(text = '') {
  return String(text).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, digits => '^{' + [...digits].map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(d)).join('') + '}').normalize('NFKC').replace(/\{,\}/g, ',').replace(/[−–]/g, '-').replace(/\s+/g, ' ').trim();
}
export function structuralTemplate(text = '') {
  // Conserver signes, opérations et exposants ; distinguer 0 et 1, qui
  // changent souvent la transformation demandée (coefficient, puissance…).
  return normalized(text).replace(/\^\{?\d+\}?|\d+(?:[.,]\d+)?/g, token => {
    if (token.startsWith('^')) return token;
    const n = Number(token.replace(',', '.'));
    return n === 0 || n === 1 ? token : '#';
  });
}
function decimalObstacle(exercise) {
  if (!/compar/i.test(exercise.chapter ?? '') || !/décim/i.test(exercise.chapter ?? '')) return null;
  const tokens = normalized(exercise.prompt).match(/\d+(?:[.,]\d+)?/g);
  if (tokens?.length !== 2) return null;
  const [a,b] = tokens.map(t => Number(t.replace(',', '.')));
  const fractions = tokens.map(t => t.split(/[.,]/)[1] ?? '');
  const sameInteger = Math.floor(a) === Math.floor(b);
  const lengthsDiffer = fractions[0].length !== fractions[1].length;
  const lexicalTrap = sameInteger && lengthsDiffer && Math.sign(a-b) !== Math.sign(Number(fractions[0])-Number(fractions[1]));
  return `decimal:${sameInteger}:${lengthsDiffer}:${lexicalTrap}:${a === b}:${fractions.every(Boolean)}`;
}
function signature(exercise) {
  const decimal = decimalObstacle(exercise);
  if (decimal) return decimal;
  if (!/relatif|rationnel|équation|proportionnal|thalès|probabil|fonction|dériv/i.test(exercise.chapter ?? '')) return null;
  const steps = exercise.steps ?? [];
  const rule = steps.find(s => s?.type === 'regle');
  const numbers = normalized(exercise.prompt).match(/-?\s*\d+(?:[.,]\d+)?/g) ?? [];
  // Pour les opérations signées, conserver aussi le rapport des valeurs
  // absolues : deux signes opposés ne suffisent pas à conserver l'obstacle.
  const signRelation = /relatif|rationnel/i.test(exercise.chapter ?? '') && numbers.length === 2
    ? Math.sign(Math.abs(Number(numbers[0].replace(/\s/g,'').replace(',','.'))) - Math.abs(Number(numbers[1].replace(/\s/g,'').replace(',','.')))) : '';
  return `${structuralTemplate(exercise.prompt)}|${structuralTemplate(rule?.text ?? '')}|${signRelation}`;
}
export function analogueMatch(current, candidate) {
  if (!candidate || candidate.chapter !== current?.chapter || candidate.type !== current?.type || candidate.prompt === current?.prompt) return null;
  const a = signature(current), b = signature(candidate);
  if (a && a === b) return 'obstacle';
  // Aucun repli général pour un obstacle décimal connu : il serait trop
  // facile de remplacer la valeur positionnelle par la partie entière.
  if (decimalObstacle(current)) return null;
  return 'skill';
}
export function generateSimilarExercise(chapter, difficulty, current) {
  let general = null;
  const candidates = Array.isArray(chapter.showcaseExercises) ? [current?.similarExercise] : null;
  for (let i=0; i<(candidates ? candidates.length : 250); i++) {
    const candidate = candidates ? candidates[i] : chapter.generate(difficulty);
    const scope = analogueMatch(current, candidate);
    if (!scope) continue;
    const result = { ...candidate, recoveryCheck: { scope } };
    if (scope === 'obstacle') return result;
    general ??= result;
  }
  return general;
}
