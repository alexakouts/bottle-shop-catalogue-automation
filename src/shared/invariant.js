import { createAppError } from "../errors/app-error.js";

function fail(message, details) {
  if (details === undefined) {
    throw createAppError("INVARIANT_FAILED", message, 500);
  }
  throw createAppError("INVARIANT_FAILED", message, 500, details);
}

export function assertPresent(value, name = "value") {
  if (value === undefined || value === null) {
    fail(name + " is required", { name });
  }
}

export function assertFunction(value, name = "function") {
  if (typeof value !== "function") {
    fail(name + " must be a function", {
      expected: "function",
      actual: typeof value,
    });
  }
}
