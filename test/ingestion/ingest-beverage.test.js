import test from "node:test";
import assert from "node:assert/strict";

import { ingestBeverage } from "../../src/ingestion/ingest-beverage.js";

test("returns a successful result for a valid beverage", () => {
  const result = ingestBeverage({
    category: "beer",
    gtin: "5000112548167",
    fermentationType: "ale",
    style: "stout",
    alcoholStatus: "alcoholic",
    abv: 5.5,
    packagingSize: "375ml",
    brand: "Test Brewing Co",
  });

  assert.equal(result.ok, true);
  assert.equal(result.record.gtin, "5000112548167");
  assert.equal(result.record.category, "beer");
});

test("returns errors for an invalid beverage without throwing", () => {
  const result = ingestBeverage({
    category: "beer",
    gtin: "5000112548167",
    fermentationType: "invalid",
    style: "stout",
    alcoholStatus: "alcoholic",
    abv: 5.5,
    packagingSize: "375ml",
    brand: "Test Brewing Co",
  });

  assert.equal(result.ok, false);
  assert.ok(Array.isArray(result.errors));
  assert.equal(result.errors.length, 1);
});
