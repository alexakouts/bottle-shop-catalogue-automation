import { SPIRIT_TYPES } from "../schemas/spirits.js";

import { assertEnum, requireString } from "../../shared/assert.js";

export function createSpirits(input) {
  const spiritType = assertEnum(
    requireString(input.spiritType, "Spirit type"),
    SPIRIT_TYPES,
    "Spirit type",
  );

  return {
    spiritType,
  };
}
