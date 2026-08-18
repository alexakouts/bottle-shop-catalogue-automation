import { test } from "node:test";
import assert from "node:assert/strict";
import { createBeverage } from "../../../src/domain/factories/beverage.js";

// Router-level factory: validates `category`, then dispatches to the
// matching category-specific factory (createBeer, createWine, ...).
// Category-specific field validation is covered in beer.test.js /
// wine.test.js — these tests only cover routing + this file's own
// error paths.

test("routes a beer input to createBeer and returns its record", () => {
  const beer = createBeverage({
    id: "beer-001",
    category: "beer",
    alcoholStatus: "alcoholic",
    abv: 5.5,
    packagingSize: "375ml",
    brand: "Test Brewing Co",
    fermentationType: "ale",
    style: "ipa",
  });

  assert.equal(beer.category, "beer");
  assert.equal(beer.fermentationType, "ale");
  assert.equal(beer.style, "ipa");
});

test("routes a wine input to createWine and returns its record", () => {
  const wine = createBeverage({
    id: "wine-001",
    category: "wine",
    alcoholStatus: "alcoholic",
    abv: 13.5,
    packagingSize: "750ml",
    brand: "Test Vineyard Co",
    type: "red",
  });

  assert.equal(wine.category, "wine");
  assert.equal(wine.type, "red");
});

test("throws when category is not a valid enum member", () => {
  assert.throws(
    () => createBeverage({ id: "bev-001", category: "soda" }),
    /Beverage category/,
  );
});

test("throws when category is the unknown sentinel", () => {
  assert.throws(
    () => createBeverage({ id: "bev-002", category: "unknown" }),
    /Cannot construct category-specific beverage for category: unknown/,
  );
});

test("throws when category is the other sentinel", () => {
  assert.throws(
    () => createBeverage({ id: "bev-003", category: "other" }),
    /Cannot construct category-specific beverage for category: other/,
  );
});

test("throws when category is schema-valid but has no wired factory", () => {
  assert.throws(
    () => createBeverage({ id: "bev-004", category: "cider" }),
    /Unhandled beverage category: cider/,
  );
});
