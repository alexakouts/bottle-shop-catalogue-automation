import {
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

export function requireNumberFromNumericString(value, name) {
  const numericStr = requireNumericString(value, name);
  return parseInt(numericStr, 10);
}

// Support decimals if you change your regex later, or use floats for ABV percent
export function requireFloatFromNumericString(value, name) {
  // If your ABV input contains decimals (e.g. "4.5"), update requireNumericString's
  // regex pattern to: /^\d+(\.\d+)?$/ to support optional decimal points.
  const trimmed = requireString(value, name);
  invariant(
    /^\d+(\.\d+)?$/.test(trimmed),
    `${name} must be a valid numeric format`,
  );
  return parseFloat(trimmed);
}

export function assertBeverage(input) {
  invariant(
    input && typeof input === "object",
    "Beverage input must be an object",
  );

  // 1. Leverage your existing identity rule block (Extracts SKU/GTIN)
  const identity = assertIdentity(input);

  // 2. Validate core beverage enums using your assertEnum utility
  const category = assertEnum(
    requireString(input.category, "Beverage category"),
    BEVERAGE_CATEGORIES,
    "Beverage category",
  );

  const alcoholStatus = assertEnum(
    requireString(input.alcoholStatus, "Alcohol status"),
    ALCOHOL_STATUSES,
    "Alcohol status",
  );

  const containerType = assertEnum(
    requireString(input.containerType, "Container type"),
    CONTAINER_TYPES,
    "Container type",
  );

  // 3. Extract your physical footprint variables as clean numbers
  // This removes the old regex string requirement completely
  const liquidVolumeMl = requireNumberFromNumericString(
    input.liquidVolumeMl,
    "Liquid volume (mL)",
  );
  const grossWeightGrams = requireNumberFromNumericString(
    input.grossWeightGrams,
    "Gross weight (g)",
  );

  // 4. Extract ABV and verify legal boundaries using requireNumberInRange
  const rawAbv = requireFloatFromNumericString(input.abv, "ABV");
  const abv = requireNumberInRange(rawAbv, 0, 100, "ABV");

  return {
    ...identity,
    category,
    alcoholStatus,
    containerType,
    liquidVolumeMl,
    grossWeightGrams,
    abv,
  };
}
