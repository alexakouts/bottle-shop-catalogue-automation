// domain/factories/wine.js
import { BEVERAGE_CATEGORY } from "../schemas/beverage.js";
import { WINE_TYPES } from "../schemas/wine.js";

import { assertEnum, requireString } from "../../shared/assert.js";

export function createWine(input) {
  const type = assertEnum(
    requireString(input.type, "Wine type"),
    WINE_TYPES,
    "Wine type",
  );

  return {
    category: BEVERAGE_CATEGORY.WINE,
    type,
  };
}
