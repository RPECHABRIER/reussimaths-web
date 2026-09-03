import test from "node:test";
import assert from "node:assert/strict";
import { PIZZA_PART_COUNTS, assessPizza, pizzaRectangleGrid } from "../src/lib/pizzaFractions.js";

test("la validation distingue découpage, coloriage et équivalence", () => {
  const target = { numerator: 2, denominator: 3 };
  assert.equal(assessPizza(target, 3, 2), "correct");
  assert.equal(assessPizza(target, 5, 2), "denominator");
  assert.equal(assessPizza(target, 3, 1), "numerator");
  assert.equal(assessPizza(target, 3, 0), "numerator");
  assert.equal(assessPizza(target, 3, 3), "numerator");
  assert.equal(assessPizza(target, 6, 4), "equivalent");
  assert.equal(assessPizza(target, 2, 2), "denominator");
});

test("toutes les fractions proposées reconnaissent les quantités équivalentes", () => {
  for (const denominator of PIZZA_PART_COUNTS) {
    for (let numerator = 1; numerator < denominator; numerator++) {
      for (const chosen of PIZZA_PART_COUNTS) {
        for (let colored = 0; colored <= chosen; colored++) {
          const result = assessPizza({ numerator, denominator }, chosen, colored);
          if (result === "correct" || result === "equivalent") {
            assert.ok(Math.abs(colored / chosen - numerator / denominator) < 1e-12);
          } else {
            assert.notEqual(colored / chosen, numerator / denominator);
          }
        }
      }
    }
  }
});

test("les rectangles contiennent exactement le nombre choisi de parts égales", () => {
  for (const count of PIZZA_PART_COUNTS) {
    for (const layout of ["vertical", "horizontal", "grid"]) {
      const { rows, columns } = pizzaRectangleGrid(count, layout);
      assert.ok(Number.isInteger(rows) && Number.isInteger(columns));
      assert.equal(rows * columns, count);
      assert.equal((250 / columns) * (150 / rows) * count, 250 * 150);
    }
  }
  assert.deepEqual(pizzaRectangleGrid(6, "grid"), { rows: 2, columns: 3 });
  assert.deepEqual(pizzaRectangleGrid(5, "grid"), { rows: 1, columns: 5 });
});
