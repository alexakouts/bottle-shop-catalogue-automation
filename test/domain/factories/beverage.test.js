import { test } from "node:test";
import assert from "node:assert/strict";
import { createBeverage } from "../../../src/domain/factories/beverage.js";

// createBeverage owns: id generation, brand/alcoholStatus (via assertBeverage),
// category validation/dispatch, and merging in category-specific fields
// from the relevant factory (createBeer, createWine, ...).
//
// Identity (gtin/sku), abv, liquidVolumeMl, packQuantity, and containerType
// no longer live here — see variant.test.js.

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validBeerInput = {
  brand: "Test Brewing Co",
  category: "beer",
  alcoholStatus: "alcoholic",
  fermentationType: "ale",
  style: "ipa",
};

test("returns a beverage record with a generated id and merged beer fields", () => {
  const beer = createBeverage(validBeerInput);

  assert.match(beer.id, UUID_PATTERN);
  assert.equal(beer.brand, "Test Brewing Co");
  assert.equal(beer.category, "beer");
  assert.equal(beer.alcoholStatus, "alcoholic");
  assert.equal(beer.fermentationType, "ale");
  assert.equal(beer.style, "ipa");
});

test("generates a different id on each call", () => {
  const first = createBeverage(validBeerInput);
  const second = createBeverage(validBeerInput);

  assert.notEqual(first.id, second.id);
});

test("throws when brand is missing", () => {
  assert.throws(
    () => createBeverage({ ...validBeerInput, brand: undefined }),
    /Brand/,
  );
});

test("throws when alcoholStatus is not a valid enum member", () => {
  assert.throws(
    () =>
      createBeverage({
        ...validBeerInput,
        alcoholStatus: "extremely-alcoholic",
      }),
    /Alcohol status/,
  );
});

test("throws when category is not a valid enum member", () => {
  assert.throws(
    () => createBeverage({ ...validBeerInput, category: "soda" }),
    /Beverage category/,
  );
});

test("throws when category is a sentinel value (no factory can exist for it)", () => {
  assert.throws(
    () => createBeverage({ ...validBeerInput, category: "unknown" }),
    /Unhandled beverage category: unknown/,
  );
});

test("throws when category-specific fields are invalid, via the dispatched factory", () => {
  assert.throws(
    () => createBeverage({ ...validBeerInput, fermentationType: "bock" }),
    /Beer fermentation type/,
  );
});

test("routes a wine input to createWine", () => {
  const wine = createBeverage({
    brand: "Test Vineyard Co",
    category: "wine",
    alcoholStatus: "alcoholic",
    type: "red",
  });

  assert.equal(wine.category, "wine");
  assert.equal(wine.type, "red");
});

test("routes a spirits input to createSpirits", () => {
  const spirits = createBeverage({
    brand: "Glenfiddich",
    category: "spirits",
    alcoholStatus: "alcoholic",
    spiritType: "whisky",
  });

  assert.equal(spirits.category, "spirits");
  assert.equal(spirits.spiritType, "whisky");
});

test("routes an rtd input to createRtd", () => {
  const rtd = createBeverage({
    brand: "White Claw",
    category: "rtd",
    alcoholStatus: "alcoholic",
    type: "seltzer",
  });

  assert.equal(rtd.category, "rtd");
  assert.equal(rtd.type, "seltzer");
});

test("routes a cider input to createCider", () => {
  const cider = createBeverage({
    brand: "Angry Orchard",
    category: "cider",
    alcoholStatus: "alcoholic",
    type: "apple",
  });

  assert.equal(cider.category, "cider");
  assert.equal(cider.type, "apple");
});
