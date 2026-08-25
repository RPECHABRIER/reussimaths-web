export function generateAdditionQuestion(previous, { maxSum = null, maxTerm = 20 } = {}) {
  let a;
  let b;
  do {
    if (maxSum) {
      a = 1 + Math.floor(Math.random() * (maxSum - 1));
      b = 1 + Math.floor(Math.random() * (maxSum - a));
    } else {
      a = 1 + Math.floor(Math.random() * maxTerm);
      b = 1 + Math.floor(Math.random() * maxTerm);
    }
  } while (previous && a === previous.a && b === previous.b);
  return { a, b, sum: a + b };
}

export const MEMORY_PAIR_LEVELS = [6, 10, 15];
