import {
  BEVERAGE_CATEGORIES,
  ALCOHOL_STATUSES,
  CONTAINER_TYPES,
} from "../domain/schemas/beverage.js";

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

export function requirePattern(value, pattern, name) {
  const asString = requireString(value, name);
  invariant(pattern.test(asString), `${name} must match the expected format`);
  return asString;
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

const PACKAGING_SIZE_PATTERN = /^\d+(\.\d+)?(ml|L)$/;

export function assertBeverage(input) {
  const identity = assertIdentity(input);

  return {
    ...identity,
    category: assertEnum(
      requireString(input.category, "Beverage category"),
      BEVERAGE_CATEGORIES,
      "Beverage category",
    ),
    alcoholStatus: assertEnum(
      requireString(input.alcoholStatus, "Alcohol status"),
      ALCOHOL_STATUSES,
      "Alcohol status",
    ),
    abv: requireNumberInRange(input.abv, 0, 100, "ABV"),
    packagingSize: requirePattern(
      input.packagingSize,
      PACKAGING_SIZE_PATTERN,
      "Packaging size",
    ),
    brand: requireString(input.brand, "Brand"),
    containerType: assertEnum(
      input.containerType,
      CONTAINER_TYPES,
      "Container type",
    ),
  };
}
