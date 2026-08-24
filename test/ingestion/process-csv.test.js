import { test } from "node:test";
import assert from "node:assert/strict";
import { processCsv } from "../../src/ingestion/process-csv.js";

// processCsv = parseCsv(csvText) piped into processRows. Column set
// mirrors ingestBeverage's canonical input shape.

const HEADER =
  "brand,category,alcoholStatus,type,fermentationType,style,gtin,sku,abv,liquidVolumeMl,packQuantity,containerType";

test("parses and ingests a valid multi-row CSV", () => {
  const csv = [
    HEADER,
    "Test Brewing Co,beer,alcoholic,,ale,ipa,5000112548167,,5.5,375,6,can",
    "Angry Orchard,cider,alcoholic,apple,,,5000112548212,,5.0,355,6,bottle",
  ].join("\n");

  const { records, rejected } = processCsv(csv);

  assert.equal(records.length, 2);
  assert.equal(rejected.length, 0);
  assert.equal(records[0].beverage.brand, "Test Brewing Co");
  assert.equal(records[1].beverage.brand, "Angry Orchard");
});

test("reports a rejected row with the correct rowNumber alongside successful rows", () => {
  const csv = [
    HEADER,
    "Test Brewing Co,beer,alcoholic,,ale,ipa,5000112548167,,5.5,375,6,can",
    "Bad Row Co,beer,alcoholic,,invalid,ipa,5000112548999,,5.5,375,6,can",
  ].join("\n");

  const { records, rejected } = processCsv(csv);

  assert.equal(records.length, 1);
  assert.equal(rejected.length, 1);
  assert.equal(rejected[0].rowNumber, 3);
});

test("supports identification by SKU instead of GTIN", () => {
  const csv = [
    HEADER,
    "Test Brewing Co,beer,alcoholic,,ale,ipa,,BEER-IPA-01,5.5,375,6,can",
  ].join("\n");

  const { records, rejected } = processCsv(csv);

  assert.equal(rejected.length, 0);
  assert.equal(records[0].variant.sku, "BEER-IPA-01");
});
