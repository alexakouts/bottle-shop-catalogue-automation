import { BEVERAGE_CATEGORY } from "../schemas/beverage.js";
import { BEER_FERMENTATION_TYPES, BEER_STYLES } from "../schemas/beer.js";

import { assertEnum, requireString } from "../../shared/assert.js";

export function createBeer(input) {
  const id = requireString(input.id, "Beer id");

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
    id,
    category: BEVERAGE_CATEGORY.BEER,
    fermentationType,
    style,
  };
}
