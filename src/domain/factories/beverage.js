import { createBeer } from "./beer.js";

import {
  BEVERAGE_CATEGORY,
  BEVERAGE_CATEGORIES,
  SENTINELS,
} from "../schemas/beverage.js";
import { assertEnum, requireString } from "../../shared/assert.js";

export function createBeverage(input) {
  const category = assertEnum(
    requireString(input.category, "Beverage category"),
    BEVERAGE_CATEGORIES,
    "Beverage category",
  );

  switch (category) {
    case BEVERAGE_CATEGORY.BEER:
      return createBeer(input);

    // TODO: wire up as factories exist
    // case BEVERAGE_CATEGORY.CIDER:
    //   return createCider(input);
    // case BEVERAGE_CATEGORY.WINE:
    //   return createWine(input);
    // case BEVERAGE_CATEGORY.SPIRITS:
    //   return createSpirits(input);
    // case BEVERAGE_CATEGORY.RTD:
    //   return createRtd(input);

    case SENTINELS.UNKNOWN:
    case SENTINELS.OTHER:
      throw new Error(
        `Cannot construct category-specific beverage for category: ${category}`,
      );

    default:
      throw new Error(`Unhandled beverage category: ${category}`);
  }
}
