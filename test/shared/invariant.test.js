import { test } from "node:test";
import assert from "node:assert/strict";
import { assertPresent, assertFunction } from "../../src/shared/invariant.js";

test("assertPresent does not throw for a defined, non-null value", () => {
  assert.doesNotThrow(() => assertPresent("hello", "value"));
  assert.doesNotThrow(() => assertPresent(0, "value"));
  assert.doesNotThrow(() => assertPresent(false, "value"));
});

test("assertPresent throws an AppError for undefined", () => {
  assert.throws(
    () => assertPresent(undefined, "myField"),
    (err) => {
      assert.equal(err.message, "myField is required");
      assert.equal(err.code, "INVARIANT_FAILED");
      assert.equal(err.statusCode, 500);
      return true;
    },
  );
});

test("assertPresent throws an AppError for null", () => {
  assert.throws(() => assertPresent(null, "myField"), /myField is required/);
});

test("assertFunction does not throw for a function", () => {
  assert.doesNotThrow(() => assertFunction(() => {}, "callback"));
});

test("assertFunction throws an AppError for a non-function", () => {
  assert.throws(
    () => assertFunction("not a function", "callback"),
    (err) => {
      assert.equal(err.message, "callback must be a function");
      assert.deepEqual(err.details, { expected: "function", actual: "string" });
      return true;
    },
  );
});
