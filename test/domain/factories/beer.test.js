import { test } from "node:test";
import assert from "node:assert/strict";
import { createBeer } from "../../../src/domain/factories/beer.js";

// createBeer validates only beer-specific fields (fermentationType, style).
// All beverage-level fields (id, brand, category, alcoholStatus) are
// validated and assembled by createBeverage — see beverage.test.js.
// Identity, ABV, volume, pack quantity, and containerType now live on
// Variant — see variant.test.js.

test("returns fermentationType and style on valid input", () => {
  const beer = createBeer({
    fermentationType: "ale",
    style: "ipa",
  });

  assert.deepEqual(beer, {
    fermentationType: "ale",
    style: "ipa",
  });
});

test("throws when fermentationType is missing", () => {
  assert.throws(() => createBeer({ style: "ipa" }), /Beer fermentation type/);
});

test("throws when fermentationType is not a valid enum member", () => {
  assert.throws(
    () => createBeer({ fermentationType: "bock", style: "ipa" }),
    /Beer fermentation type/,
  );
});

test("throws when style is missing", () => {
  assert.throws(() => createBeer({ fermentationType: "ale" }), /Beer style/);
});

test("throws when style is not a valid enum member", () => {
  assert.throws(
    () => createBeer({ fermentationType: "ale", style: "milkshake-ipa" }),
    /Beer style/,
  );
});
