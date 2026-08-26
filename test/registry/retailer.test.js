import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveRetailerId } from "../../src/registry/retailer.js";

const KNOWN_RETAILER_ID = "6049cd60-94c4-41f3-b046-202464211697";

test("resolves the retailerId for a known folder", () => {
  assert.equal(resolveRetailerId("/ews/catalog.csv"), KNOWN_RETAILER_ID);
});

test("resolves the retailerId regardless of nesting depth under the folder", () => {
  assert.equal(
    resolveRetailerId("/ews/archive/old-catalog.csv"),
    KNOWN_RETAILER_ID,
  );
});

test("throws an AppError for an unregistered folder", () => {
  assert.throws(
    () => resolveRetailerId("/unknown-retailer/catalog.csv"),
    (err) => {
      assert.match(
        err.message,
        /No retailer is registered for folder "unknown-retailer"/,
      );
      assert.equal(err.code, "UNKNOWN_RETAILER_FOLDER");
      assert.equal(err.statusCode, 422);
      assert.deepEqual(err.details, {
        folderKey: "unknown-retailer",
        path: "/unknown-retailer/catalog.csv",
      });
      return true;
    },
  );
});

test("throws a distinct AppError for an empty path", () => {
  assert.throws(
    () => resolveRetailerId(""),
    (err) => {
      assert.match(err.message, /must contain a retailer folder/);
      assert.equal(err.code, "INVALID_RETAILER_PATH");
      assert.equal(err.statusCode, 422);
      return true;
    },
  );
});

test("throws a distinct AppError for a root-only path", () => {
  assert.throws(
    () => resolveRetailerId("/"),
    (err) => {
      assert.equal(err.code, "INVALID_RETAILER_PATH");
      return true;
    },
  );
});

test("throws INVALID_RETAILER_PATH (not UNKNOWN_RETAILER_FOLDER) for a file with no retailer folder", () => {
  assert.throws(
    () => resolveRetailerId("/catalog.csv"),
    (err) => {
      assert.equal(err.code, "INVALID_RETAILER_PATH");
      return true;
    },
  );
});
