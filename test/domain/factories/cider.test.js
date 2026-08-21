import { test } from "node:test";
import assert from "node:assert/strict";
import { createCider } from "../../../src/domain/factories/cider.js";
import { CIDER_TYPE } from "../../../src/domain/schemas/cider.js";

// createCider validates only cider-specific fields (type).
// All beverage-level fields (id, brand, category, alcoholStatus) are
// validated and assembled by createBeverage — see beverage.test.js.

test("returns type on valid input", () => {
  const cider = createCider({ type: CIDER_TYPE.APPLE });

  assert.deepEqual(cider, { type: CIDER_TYPE.APPLE });
});

test("throws when type is missing", () => {
  assert.throws(() => createCider({}), /Cider type/);
});

test("throws when type is not a valid enum member", () => {
  assert.throws(() => createCider({ type: "perry-blend" }), /Cider type/);
});
