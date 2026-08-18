import { test } from "node:test";
import assert from "node:assert/strict";
import { createBeer } from "../../../src/domain/factories/beer.js";

// Domain-level factory: THROWS on invalid input, returns a plain record
// (no {ok, record} wrapper) on success — this is a pure domain function,
// not the ingestion boundary. See ingestion/ingest-beverage.test.js for
// the {ok, errors} contract tests.

const validBase = {
  id: "beer-001",
  category: "beer",
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
  assert.equal(beer.fermentationType, "ale");
  assert.equal(beer.style, "ipa");
});

test("throws when id is missing", () => {
  assert.throws(
    () =>
      createBeer({
        ...validBase,
        id: undefined,
        fermentationType: "ale",
        style: "ipa",
      }),
    /Beverage id/,
  );
});

test("throws when fermentationType is not a valid enum member", () => {
  assert.throws(
    () =>
      createBeer({
        ...validBase,
        id: "beer-002",
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
        id: "beer-003",
        fermentationType: "ale",
        style: "milkshake-ipa",
      }),
    /Beer style/,
  );
});
