import { test } from "node:test";
import assert from "node:assert/strict";
import { processRows } from "../../src/ingestion/process-rows.js";

// processRows takes already-parsed row objects (as csv-parse would produce:
// every value a string) and coerces known numeric fields before calling
// ingestBeverage. Column set mirrors ingestBeverage's canonical input shape:
// brand, category, alcoholStatus, type, fermentationType, style, gtin, sku,
// abv, liquidVolumeMl, packQuantity, containerType.

const validBeerRow = {
  brand: "Test Brewing Co",
  category: "beer",
  alcoholStatus: "alcoholic",
  fermentationType: "ale",
  style: "ipa",
  gtin: "5000112548167",
  abv: "5.5",
  liquidVolumeMl: "375",
  packQuantity: "6",
  containerType: "can",
};

const validCiderRow = {
  brand: "Angry Orchard",
  category: "cider",
  alcoholStatus: "alcoholic",
  type: "apple",
  gtin: "5000112548212",
  abv: "5.0",
  liquidVolumeMl: "355",
  packQuantity: "6",
  containerType: "bottle",
};

test("returns all rows as records when every row is valid", () => {
  const { records, rejected } = processRows([validBeerRow, validCiderRow]);

  assert.equal(records.length, 2);
  assert.equal(rejected.length, 0);
  assert.equal(records[0].beverage.category, "beer");
  assert.equal(records[1].beverage.category, "cider");
});

test("coerces numeric fields from strings to numbers", () => {
  const { records } = processRows([validBeerRow]);

  assert.equal(records[0].variant.abv, 5.5);
  assert.equal(records[0].variant.liquidVolumeMl, 375);
  assert.equal(records[0].variant.packQuantity, 6);
  assert.equal(typeof records[0].variant.abv, "number");
});

test("does not coerce gtin/sku — they remain strings", () => {
  const { records } = processRows([validBeerRow]);

  assert.equal(typeof records[0].variant.gtin, "string");
});

test("collects a rejected row with its rowNumber and errors, without halting the batch", () => {
  const invalidRow = { ...validBeerRow, fermentationType: "bock" };

  const { records, rejected } = processRows([
    validBeerRow,
    invalidRow,
    validCiderRow,
  ]);

  assert.equal(records.length, 2);
  assert.equal(rejected.length, 1);
  assert.equal(rejected[0].rowNumber, 3);
  assert.ok(Array.isArray(rejected[0].errors));
  assert.match(rejected[0].errors[0], /Beer fermentation type/);
});

test("row numbers account for the header row (first data row is row 2)", () => {
  const { rejected } = processRows([
    { ...validBeerRow, fermentationType: "bock" },
  ]);

  assert.equal(rejected[0].rowNumber, 2);
});

test("returns empty records and rejected for an empty input", () => {
  const { records, rejected } = processRows([]);

  assert.deepEqual(records, []);
  assert.deepEqual(rejected, []);
});
