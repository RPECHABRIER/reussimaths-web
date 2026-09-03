export const PIZZA_PART_COUNTS = [2, 3, 4, 5, 6, 8];

export function assessPizza(question, denominator, numerator) {
  if (denominator === question.denominator) {
    return numerator === question.numerator ? "correct" : "numerator";
  }
  return numerator * question.denominator === question.numerator * denominator
    ? "equivalent" : "denominator";
}

// Equal-area cells; prime counts remain strips even in later rounds.
export function pizzaRectangleGrid(count, layout) {
  const rows = layout === "horizontal" ? count : layout === "grid" && count % 2 === 0 ? 2 : 1;
  return { rows, columns: count / rows };
}
