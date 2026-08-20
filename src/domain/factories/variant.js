import { randomUUID } from "node:crypto";
import {
  requireString,
  assertEnum,
  requireNumberInRange,
  requirePositiveInteger,
  requirePositiveNumber,
  assertIdentity,
} from "../../shared/assert.js";
import {
  CONTAINER_TYPES,
  ALCOHOL_BY_VOLUME_LIMITS,
} from "../schemas/variant.js";

export function createVariant(beverageId, input) {
  const id = randomUUID();

  const parentBeverageId = requireString(beverageId, "Beverage id");

  const identity = assertIdentity(input);

  const abv = requireNumberInRange(
    input.abv,
    ALCOHOL_BY_VOLUME_LIMITS.MIN,
    ALCOHOL_BY_VOLUME_LIMITS.MAX,
    "ABV",
  );

  const liquidVolumeMl = requirePositiveNumber(
    input.liquidVolumeMl,
    "Liquid volume (mL)",
  );

  const packQuantity = requirePositiveInteger(
    input.packQuantity,
    "Pack quantity",
  );

  const containerType = assertEnum(
    input.containerType,
    CONTAINER_TYPES,
    "Container type",
  );

  return {
    id,
    beverageId: parentBeverageId,
    ...identity,
    abv,
    liquidVolumeMl,
    packQuantity,
    containerType,
  };
}
