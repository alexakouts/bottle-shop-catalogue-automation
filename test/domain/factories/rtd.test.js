import { test } from "node:test";
import assert from "node:assert/strict";
import { createRtd } from "../../../src/domain/factories/rtd.js";
import { RTD_TYPE } from "../../../src/domain/schemas/rtd.js";

// createRtd validates only RTD-specific fields (type).
// All beverage-level fields (id, brand, category, alcoholStatus) are
// validated and assembled by createBeverage — see beverage.test.js.

test("returns type on valid input", () => {
  const rtd = createRtd({ type: RTD_TYPE.SELTZER });

  assert.deepEqual(rtd, { type: RTD_TYPE.SELTZER });
});

test("throws when type is missing", () => {
  assert.throws(() => createRtd({}), /RTD type/);
});

test("throws when type is not a valid enum member", () => {
  assert.throws(() => createRtd({ type: "energy-drink" }), /RTD type/);
});
