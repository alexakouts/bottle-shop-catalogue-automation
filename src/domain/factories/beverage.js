import { randomUUID } from "node:crypto";
import {
  requireString,
  assertEnum,
  assertBeverage,
} from "../../shared/assert.js";
import { BEVERAGE_CATEGORY, BEVERAGE_CATEGORIES } from "../schemas/beverage.js";
import { createBeer } from "./beer.js";

export function createBeverage(input) {
  const id = randomUUID();

  const { brand, alcoholStatus } = assertBeverage(input);

  const category = assertEnum(
    requireString(input.category, "Beverage category"),
    BEVERAGE_CATEGORIES,
    "Beverage category",
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
