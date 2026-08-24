import { SPIRIT_TYPES } from "../schemas/spirits.js";

import { assertEnum, requireString } from "../../shared/assert.js";

export function createSpirits(input) {
  const type = assertEnum(
    requireString(input.type, "Spirit type"),
    SPIRIT_TYPES,
    "Spirit type",
  );

  return {
    type,
  };
}
