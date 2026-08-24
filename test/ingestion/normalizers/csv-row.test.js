import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeCsvRow } from "../../../src/ingestion/normalizers/csv-row.js";

test("converts empty string fields to undefined", () => {
  const result = normalizeCsvRow({ brand: "Test Co", type: "", sku: "" });

  assert.equal(result.brand, "Test Co");
  assert.equal(result.type, undefined);
  assert.equal(result.sku, undefined);
});

test("coerces numeric fields from strings to numbers", () => {
  const result = normalizeCsvRow({
    abv: "5.5",
    liquidVolumeMl: "375",
    packQuantity: "6",
  });

  assert.equal(result.abv, 5.5);
  assert.equal(result.liquidVolumeMl, 375);
  assert.equal(result.packQuantity, 6);
  assert.equal(typeof result.abv, "number");
});

test("leaves an empty numeric field as undefined rather than NaN", () => {
  const result = normalizeCsvRow({ abv: "" });

  assert.equal(result.abv, undefined);
});

test("does not coerce non-numeric fields like gtin", () => {
  const result = normalizeCsvRow({ gtin: "5000112548167" });

  assert.equal(result.gtin, "5000112548167");
  assert.equal(typeof result.gtin, "string");
});
