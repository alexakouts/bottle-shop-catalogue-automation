import { requireString, assertEnum } from "../../shared/assert.js";
import { BEER_FERMENTATION_TYPES, BEER_STYLES } from "../schemas/beer.js";

export function createBeer(input) {
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
    fermentationType,
    style,
  };
}
