import { SENTINELS } from "./beverage.js";

export const RTD_TYPE = Object.freeze({
  PREMIXED_SPIRIT: "premixed-spirit",
  COCKTAIL: "cocktail",
  SELTZER: "seltzer",
  COOLER: "cooler",
});

export const RTD_TYPES = [
  ...Object.values(RTD_TYPE),
  ...Object.values(SENTINELS),
];
