import { randomUUID } from "node:crypto";
import { requireString, assertEnum } from "../../shared/assert.js";
import {
  ALCOHOL_STATUSES,
  BEVERAGE_CATEGORY,
  BEVERAGE_CATEGORIES,
} from "../schemas/beverage.js";
import { createBeer } from "./beer.js";

export function createBeverage(input) {
  const id = randomUUID();

  const brand = requireString(input.brand, "Beverage brand");

  const category = assertEnum(
    requireString(input.category, "Beverage category"),
    BEVERAGE_CATEGORIES,
    "Beverage category",
  );

  const alcoholStatus = assertEnum(
    requireString(input.alcoholStatus, "Beverage alcohol status"),
    ALCOHOL_STATUSES,
    "Beverage alcohol status",
  );

  let classification;
  switch (category) {
    case BEVERAGE_CATEGORY.BEER:
      classification = createBeer({
        fermentationType: input.fermentationType,
        style: input.style,
      });
      break;

    // wine next, same shape

    default:
      throw new Error(`Unhandled beverage category: ${category}`);
  }

  return { id, brand, category, alcoholStatus, ...classification };
}
