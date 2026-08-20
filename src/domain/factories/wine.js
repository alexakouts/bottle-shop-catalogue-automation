// domain/factories/wine.js
import { WINE_TYPES } from "../schemas/wine.js";

import { assertEnum, requireString } from "../../shared/assert.js";

export function createWine(input) {
  const type = assertEnum(
    requireString(input.type, "Wine type"),
    WINE_TYPES,
    "Wine type",
  );

  return {
    type,
  };
}
