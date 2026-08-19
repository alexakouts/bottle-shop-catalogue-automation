import { test } from "node:test";
import assert from "node:assert/strict";
import { createBeer } from "../../../src/domain/factories/beer.js";

const validBase = {
  category: "beer",
  gtin: "5000112548167",
  alcoholStatus: "alcoholic",
  abv: 5.5,
  packagingSize: "375ml",
  brand: "Test Brewing Co",
};

test("returns a plain canonical record on valid input", () => {
  const beer = createBeer({
    ...validBase,
    fermentationType: "ale",
    style: "ipa",
  });

  assert.equal(beer.category, "beer");
  assert.equal(beer.gtin, "5000112548167");
  assert.equal(beer.fermentationType, "ale");
  assert.equal(beer.style, "ipa");
});

test("returns a plain canonical record when identified by SKU only", () => {
  const beer = createBeer({
    ...validBase,
    gtin: undefined,
    sku: "BEER-STOUT-01",
    fermentationType: "ale",
    style: "stout",
  });

  assert.equal(beer.sku, "BEER-STOUT-01");
  assert.equal(beer.gtin, undefined);
});

test("throws when neither gtin nor sku is provided", () => {
  assert.throws(
    () =>
      createBeer({
        ...validBase,
        gtin: undefined,
        fermentationType: "ale",
        style: "ipa",
      }),
    /GTIN or a SKU/,
  );
});

test("throws when fermentationType is not a valid enum member", () => {
  assert.throws(
    () =>
      createBeer({
        ...validBase,
        fermentationType: "bock",
        style: "ipa",
      }),
    /Beer fermentation type/,
  );
});

test("throws when style is not a valid enum member", () => {
  assert.throws(
    () =>
      createBeer({
        ...validBase,
        fermentationType: "ale",
        style: "milkshake-ipa",
      }),
    /Beer style/,
  );
});
