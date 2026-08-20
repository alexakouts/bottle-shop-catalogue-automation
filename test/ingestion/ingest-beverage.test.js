import test from "node:test";
import assert from "node:assert/strict";

import { ingestBeverage } from "../../src/ingestion/ingest-beverage.js";

// ingestBeverage wraps createBeverage in the non-throwing {ok, record|errors}
// contract. It only produces a Beverage — identity (gtin/sku), abv, volume,
// pack quantity, and containerType belong to Variant, not covered here yet.

test("returns a successful result for a valid beverage", () => {
  const result = ingestBeverage({
    category: "beer",
    fermentationType: "ale",
    style: "stout",
    alcoholStatus: "alcoholic",
    brand: "Test Brewing Co",
  });

  assert.equal(result.ok, true);
  assert.equal(result.record.category, "beer");
  assert.equal(result.record.brand, "Test Brewing Co");
  assert.ok(
    typeof result.record.id === "string" && result.record.id.length > 0,
  );
});

test("returns errors for an invalid beverage without throwing", () => {
  const result = ingestBeverage({
    category: "beer",
    fermentationType: "invalid",
    style: "stout",
    alcoholStatus: "alcoholic",
    brand: "Test Brewing Co",
  });

  assert.equal(result.ok, false);
  assert.ok(Array.isArray(result.errors));
  assert.equal(result.errors.length, 1);
});
