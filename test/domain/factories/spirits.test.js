import { test } from "node:test";
import assert from "node:assert/strict";
import { createSpirits } from "../../../src/domain/factories/spirits.js";
import { SPIRIT_TYPE } from "../../../src/domain/schemas/spirits.js";

// createSpirits validates only spirits-specific fields (type).
// All beverage-level fields (id, brand, category, alcoholStatus) are
// validated and assembled by createBeverage — see beverage.test.js.

test("returns type on valid input", () => {
  const spirits = createSpirits({ type: SPIRIT_TYPE.WHISKY });

  assert.deepEqual(spirits, { type: SPIRIT_TYPE.WHISKY });
});

test("throws when type is missing", () => {
  assert.throws(() => createSpirits({}), /Spirit type/);
});

test("throws when type is not a valid enum member", () => {
  assert.throws(() => createSpirits({ type: "moonshine" }), /Spirit type/);
});
