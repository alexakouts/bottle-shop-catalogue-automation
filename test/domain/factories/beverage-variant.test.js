import { test } from "node:test";
import assert from "node:assert/strict";
import { createBeverageVariant } from "../../../src/domain/factories/beverage-variant.js";
import { createVariant } from "../../../src/domain/factories/variant.js";

// createBeverageVariant composes createBeverage + createVariant from a
// single flat input (the shape a single feed row naturally takes).
// Beverage and Variant remain distinct entities, linked via
// variant.beverageId === beverage.id.

const validInput = {
  brand: "Test Brewing Co",
  category: "beer",
  alcoholStatus: "alcoholic",
  fermentationType: "ale",
  style: "ipa",
  gtin: "5000112548167",
  abv: 5.5,
  liquidVolumeMl: 375,
  packQuantity: 6,
  containerType: "can",
};

test("returns a distinct beverage and variant, correctly linked", () => {
  const { beverage, variant } = createBeverageVariant(validInput);

  assert.equal(beverage.category, "beer");
  assert.equal(beverage.brand, "Test Brewing Co");
  assert.equal(variant.gtin, "5000112548167");
  assert.equal(variant.abv, 5.5);
  assert.equal(variant.beverageId, beverage.id);
});

test("beverage and variant each have their own distinct id", () => {
  const { beverage, variant } = createBeverageVariant(validInput);

  assert.notEqual(beverage.id, variant.id);
});

test("a second variant can be linked to the same beverage afterward", () => {
  const { beverage, variant: firstVariant } = createBeverageVariant(validInput);

  const secondVariant = createVariant(beverage.id, {
    sku: "TESTBREW-CASE",
    abv: 5.5,
    liquidVolumeMl: 375,
    packQuantity: 24,
    containerType: "can",
  });

  assert.equal(firstVariant.beverageId, beverage.id);
  assert.equal(secondVariant.beverageId, beverage.id);
  assert.notEqual(firstVariant.id, secondVariant.id);
});

test("throws when beverage-level fields are invalid", () => {
  assert.throws(
    () => createBeverageVariant({ ...validInput, brand: undefined }),
    /Brand/,
  );
});

test("throws when category-specific fields are invalid", () => {
  assert.throws(
    () => createBeverageVariant({ ...validInput, fermentationType: "bock" }),
    /Beer fermentation type/,
  );
});

test("throws when variant-level fields are invalid", () => {
  assert.throws(
    () => createBeverageVariant({ ...validInput, abv: 500 }),
    /ABV/,
  );
});

test("throws when neither gtin nor sku is provided", () => {
  assert.throws(
    () => createBeverageVariant({ ...validInput, gtin: undefined }),
    /GTIN or a SKU/,
  );
});
