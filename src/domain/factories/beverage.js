import { randomUUID } from "node:crypto";
import {
  requireString,
  assertEnum,
  assertBeverage,
} from "../../shared/assert.js";
import { BEVERAGE_CATEGORY, BEVERAGE_CATEGORIES } from "../schemas/beverage.js";
import { createBeer } from "./beer.js";
import { createWine } from "./wine.js";
import { createSpirits } from "./spirits.js";
import { createRtd } from "./rtd.js";
import { createCider } from "./cider.js";

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

    case BEVERAGE_CATEGORY.WINE:
      classification = createWine({
        type: input.type,
      });
      break;

    case BEVERAGE_CATEGORY.SPIRITS:
      classification = createSpirits({
        spiritType: input.spiritType,
      });
      break;

    case BEVERAGE_CATEGORY.RTD:
      classification = createRtd({
        type: input.type,
      });
      break;

    case BEVERAGE_CATEGORY.CIDER:
      classification = createCider({
        type: input.type,
      });
      break;

    default:
      throw new Error(`Unhandled beverage category: ${category}`);
  }

  return { id, brand, category, alcoholStatus, ...classification };
}
