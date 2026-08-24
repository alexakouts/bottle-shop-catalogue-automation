import { test } from "node:test";
import assert from "node:assert/strict";
import { createAppError } from "../../src/errors/app-error.js";

test("creates an error with the expected shape", () => {
  const err = createAppError("SOME_CODE", "Something went wrong", 400);

  assert.equal(err.message, "Something went wrong");
  assert.equal(err.name, "AppError");
  assert.equal(err.isAppError, true);
  assert.equal(err.code, "SOME_CODE");
  assert.equal(err.statusCode, 400);
  assert.equal(err.details, undefined);
});

test("defaults statusCode to 500 when not a valid integer", () => {
  const err = createAppError("SOME_CODE", "Oops", undefined);

  assert.equal(err.statusCode, 500);
});

test("includes details when provided", () => {
  const err = createAppError("SOME_CODE", "Oops", 400, { field: "abv" });

  assert.deepEqual(err.details, { field: "abv" });
});

test("preserves the original error via cause", () => {
  const original = new Error("original failure");
  const err = createAppError("SOME_CODE", "Wrapped", 500, undefined, original);

  assert.equal(err.cause, original);
});
