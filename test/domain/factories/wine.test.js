import { test } from "node:test";
import assert from "node:assert/strict";
import { createWine } from "../../../src/domain/factories/wine.js";

const validBase = {
  category: "wine",
  sku: "WINE-RED-01",
  alcoholStatus: "alcoholic",
  abv: 13.5,
  packagingSize: "750ml",
  brand: "Test Vineyard Co",
};

test("returns a plain canonical record on valid input", () => {
  const wine = createWine({
    ...validBase,
    type: "red",
  });

  assert.equal(wine.category, "wine");
  assert.equal(wine.sku, "WINE-RED-01");
  assert.equal(wine.type, "red");
});

test("throws when neither gtin nor sku is provided", () => {
  assert.throws(
    () =>
      createWine({
        ...validBase,
        sku: undefined,
        type: "red",
      }),
    /GTIN or a SKU/,
  );
});

test("throws when type is not a valid enum member", () => {
  assert.throws(
    () =>
      createWine({
        ...validBase,
        type: "mulled",
      }),
    /Wine type/,
  );
});
