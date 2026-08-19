import { BEVERAGE_CATEGORY } from "../schemas/beverage.js";
import { BEER_FERMENTATION_TYPES, BEER_STYLES } from "../schemas/beer.js";

import {
  assertEnum,
  requireString,
  assertBeverage,
} from "../../shared/assert.js";

export function createBeer(input) {
  const base = assertBeverage(input);

  const fermentationType = assertEnum(
    requireString(input.fermentationType, "Beer fermentation type"),
    BEER_FERMENTATION_TYPES,
    "Beer fermentation type",
  );

  const style = assertEnum(
    requireString(input.style, "Beer style"),
    BEER_STYLES,
    "Beer style",
  );

  return {
    ...(base.gtin !== undefined && { gtin: base.gtin }),
    ...(base.sku !== undefined && { sku: base.sku }),
    category: BEVERAGE_CATEGORY.BEER,
    fermentationType,
    style,
  };
}
