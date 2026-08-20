import { test } from "node:test";
import assert from "node:assert/strict";
import { createVariant } from "../../../src/domain/factories/variant.js";

// createVariant represents the sellable unit — a specific size/ABV
// combination of a parent Beverage. It owns: its own generated id,
// the beverageId foreign key, identity (gtin/sku, at least one
// required), abv, liquidVolumeMl, packQuantity (required), and
// containerType (optional — a valid sellable SKU can exist without
// a known container type).

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const BEVERAGE_ID = "bev-test-id";

const validInput = {
  gtin: "5000112548167",
  abv: 40,
  liquidVolumeMl: 700,
  packQuantity: 1,
  containerType: "bottle",
};

test("returns a complete variant record on valid input", () => {
  const variant = createVariant(BEVERAGE_ID, validInput);

  assert.match(variant.id, UUID_PATTERN);
  assert.equal(variant.beverageId, BEVERAGE_ID);
  assert.equal(variant.gtin, "5000112548167");
  assert.equal(variant.abv, 40);
  assert.equal(variant.liquidVolumeMl, 700);
  assert.equal(variant.packQuantity, 1);
  assert.equal(variant.containerType, "bottle");
});

test("generates a different id on each call", () => {
  const first = createVariant(BEVERAGE_ID, validInput);
  const second = createVariant(BEVERAGE_ID, validInput);

  assert.notEqual(first.id, second.id);
});

test("supports identification by SKU only", () => {
  const variant = createVariant(BEVERAGE_ID, {
    ...validInput,
    gtin: undefined,
    sku: "GLEN-700-40",
  });

  assert.equal(variant.sku, "GLEN-700-40");
  assert.equal(variant.gtin, undefined);
});

test("omits containerType when not provided", () => {
  const variant = createVariant(BEVERAGE_ID, {
    ...validInput,
    containerType: undefined,
  });

  assert.equal(variant.containerType, undefined);
  assert.equal(variant.liquidVolumeMl, 700);
});

test("throws when beverageId is missing", () => {
  assert.throws(() => createVariant(undefined, validInput), /Beverage id/);
});

test("throws when neither gtin nor sku is provided", () => {
  assert.throws(
    () => createVariant(BEVERAGE_ID, { ...validInput, gtin: undefined }),
    /GTIN or a SKU/,
  );
});

test("throws when abv is out of range", () => {
  assert.throws(
    () => createVariant(BEVERAGE_ID, { ...validInput, abv: 150 }),
    /ABV/,
  );
});

test("throws when liquidVolumeMl is zero", () => {
  assert.throws(
    () => createVariant(BEVERAGE_ID, { ...validInput, liquidVolumeMl: 0 }),
    /Liquid volume/,
  );
});

test("throws when liquidVolumeMl is negative", () => {
  assert.throws(
    () => createVariant(BEVERAGE_ID, { ...validInput, liquidVolumeMl: -5 }),
    /Liquid volume/,
  );
});

test("allows a non-integer liquidVolumeMl", () => {
  const variant = createVariant(BEVERAGE_ID, {
    ...validInput,
    liquidVolumeMl: 700.5,
  });

  assert.equal(variant.liquidVolumeMl, 700.5);
});

test("throws when packQuantity is missing", () => {
  assert.throws(
    () =>
      createVariant(BEVERAGE_ID, { ...validInput, packQuantity: undefined }),
    /Pack quantity/,
  );
});

test("throws when packQuantity is not an integer", () => {
  assert.throws(
    () => createVariant(BEVERAGE_ID, { ...validInput, packQuantity: 1.5 }),
    /Pack quantity/,
  );
});

test("throws when packQuantity is zero", () => {
  assert.throws(
    () => createVariant(BEVERAGE_ID, { ...validInput, packQuantity: 0 }),
    /Pack quantity/,
  );
});

test("throws when containerType is not a valid enum member", () => {
  assert.throws(
    () => createVariant(BEVERAGE_ID, { ...validInput, containerType: "flask" }),
    /Container type/,
  );
});
