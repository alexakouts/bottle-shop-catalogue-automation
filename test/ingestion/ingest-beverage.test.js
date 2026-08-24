import test from "node:test";
import assert from "node:assert/strict";

import { ingestBeverage } from "../../src/ingestion/ingest-beverage.js";

// ingestBeverage wraps createBeverageVariant in the non-throwing
// {ok, record|errors} contract. record holds { beverage, variant },
// the composed result of linking a new Beverage to its first Variant.

test("returns a successful result for a valid beverage + variant", () => {
  const result = ingestBeverage({
    brand: "Test Brewing Co",
    category: "beer",
    alcoholStatus: "alcoholic",
    fermentationType: "ale",
    style: "stout",
    gtin: "5000112548167",
    abv: 5.5,
    liquidVolumeMl: 375,
    packQuantity: 6,
    containerType: "can",
  });

  assert.equal(result.ok, true);
  assert.equal(result.record.beverage.category, "beer");
  assert.equal(result.record.beverage.brand, "Test Brewing Co");
  assert.equal(result.record.variant.gtin, "5000112548167");
  assert.equal(result.record.variant.beverageId, result.record.beverage.id);
});

test("returns errors for invalid beverage-level fields without throwing", () => {
  const result = ingestBeverage({
    brand: "Test Brewing Co",
    category: "beer",
    alcoholStatus: "alcoholic",
    fermentationType: "invalid",
    style: "stout",
    gtin: "5000112548167",
    abv: 5.5,
    liquidVolumeMl: 375,
    packQuantity: 6,
  });

  assert.equal(result.ok, false);
  assert.ok(Array.isArray(result.errors));
  assert.equal(result.errors.length, 1);
});

test("returns errors for invalid variant-level fields without throwing", () => {
  const result = ingestBeverage({
    brand: "Test Brewing Co",
    category: "beer",
    alcoholStatus: "alcoholic",
    fermentationType: "ale",
    style: "stout",
    gtin: "5000112548167",
    abv: 500,
    liquidVolumeMl: 375,
    packQuantity: 6,
  });

  assert.equal(result.ok, false);
  assert.ok(Array.isArray(result.errors));
  assert.equal(result.errors.length, 1);
});
