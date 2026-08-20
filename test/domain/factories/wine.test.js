import { test } from "node:test";
import assert from "node:assert/strict";
import { createWine } from "../../../src/domain/factories/wine.js";

// createWine validates only wine-specific fields (type).
// All beverage-level fields (id, brand, category, alcoholStatus) are
// validated and assembled by createBeverage — see beverage.test.js.

test("returns type on valid input", () => {
  const wine = createWine({ type: "red" });

  assert.deepEqual(wine, { type: "red" });
});

test("throws when type is missing", () => {
  assert.throws(() => createWine({}), /Wine type/);
});

test("throws when type is not a valid enum member", () => {
  assert.throws(() => createWine({ type: "mulled" }), /Wine type/);
});
