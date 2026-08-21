import { SENTINELS } from "./beverage.js";

export const CIDER_TYPE = Object.freeze({
  APPLE: "apple",
  PEAR: "pear",
  FRUIT: "fruit",
});

export const CIDER_TYPES = [
  ...Object.values(CIDER_TYPE),
  ...Object.values(SENTINELS),
];
