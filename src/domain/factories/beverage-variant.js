import { createBeverage } from "./beverage.js";
import { createVariant } from "./variant.js";

export function createBeverageVariant(input) {
  const beverage = createBeverage(input);
  const variant = createVariant(beverage.id, input);

  return { beverage, variant };
}
