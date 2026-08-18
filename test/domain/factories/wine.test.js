import { test } from "node:test";
import assert from "node:assert/strict";
import { createWine } from "../../../src/domain/factories/wine.js";

// Domain-level factory: THROWS on invalid input, returns a plain record
// (no {ok, record} wrapper) on success — this is a pure domain function,
// not the ingestion boundary.

const validBase = {
  id: "wine-001",
  category: "wine",
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
  assert.equal(wine.type, "red");
});

test("throws when id is missing", () => {
  assert.throws(
    () =>
      createWine({
        ...validBase,
        id: undefined,
        type: "red",
      }),
    /Beverage id/,
  );
});

test("throws when type is not a valid enum member", () => {
  assert.throws(
    () =>
      createWine({
        ...validBase,
        id: "wine-002",
        type: "mulled",
      }),
    /Wine type/,
  );
});
