import { ALCOHOL_STATUSES } from "../domain/schemas/beverage.js";

export function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function requireStringType(value, name) {
  invariant(typeof value === "string", `${name} must be a string`);
  return value;
}

export function requireNonEmpty(value, name) {
  const trimmed = value.trim();
  invariant(trimmed.length > 0, `${name} is required`);
  return trimmed;
}

export function requireString(value, name) {
  const asString = requireStringType(value, name);
  return requireNonEmpty(asString, name);
}

export function requireNumericString(value, name) {
  const trimmed = requireString(value, name);
  invariant(/^\d+$/.test(trimmed), `${name} must contain only digits`);
  return trimmed;
}

export function requireNumberInRange(value, min, max, name) {
  invariant(
    typeof value === "number" && !Number.isNaN(value),
    `${name} must be a number`,
  );
  invariant(
    value >= min && value <= max,
    `${name} must be between ${min} and ${max}`,
  );
  return value;
}

export function requirePositiveInteger(value, name) {
  invariant(
    typeof value === "number" && Number.isInteger(value),
    `${name} must be an integer`,
  );
  invariant(value > 0, `${name} must be greater than zero`);
  return value;
}

export function requirePositiveNumber(value, name) {
  invariant(
    typeof value === "number" && Number.isFinite(value),
    `${name} must be a finite number`,
  );
  invariant(value > 0, `${name} must be greater than zero`);
  return value;
}

export function assertEnum(value, allowed, name) {
  if (value === undefined) return value;
  invariant(
    allowed.includes(value),
    `${name} must be one of [${allowed.join(", ")}], got "${value}"`,
  );
  return value;
}

export function assertIdentity(input) {
  const hasGtin = input.gtin !== undefined;
  const hasSku = input.sku !== undefined;

  invariant(hasGtin || hasSku, "Identity requires at least a GTIN or a SKU");

  return {
    ...(hasGtin && { gtin: requireNumericString(input.gtin, "GTIN") }),
    ...(hasSku && { sku: requireString(input.sku, "SKU") }),
  };
}

export function assertBeverage(input) {
  const brand = requireString(input.brand, "Brand");

  const alcoholStatus = assertEnum(
    requireString(input.alcoholStatus, "Alcohol status"),
    ALCOHOL_STATUSES,
    "Alcohol status",
  );

  return {
    brand,
    alcoholStatus,
  };
}
