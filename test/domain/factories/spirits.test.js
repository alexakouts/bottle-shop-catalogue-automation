import { test } from "node:test";
import assert from "node:assert/strict";
import { createSpirits } from "../../../src/domain/factories/spirits.js";

// createSpirits validates only spirits-specific fields (spiritType).
// All beverage-level fields (id, brand, category, alcoholStatus) are
// validated and assembled by createBeverage — see beverage.test.js.

test("returns spiritType on valid input", () => {
    const spirits = createSpirits({ spiritType: "whisky" });

    assert.deepEqual(spirits, { spiritType: "whisky" });
});

test("throws when spiritType is missing", () => {
    assert.throws(
        () => createSpirits({}),
        /Spirit type/,
    );
});

test("throws when spiritType is not a valid enum member", () => {
    assert.throws(
        () => createSpirits({ spiritType: "moonshine" }),
        /Spirit type/,
    );
});