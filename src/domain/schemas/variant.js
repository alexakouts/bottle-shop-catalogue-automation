import { SENTINELS } from "./beverage.js";

export const CONTAINER_TYPES = [
  "bottle",
  "can",
  "cask",
  "carton",
  "pouch",
  ...Object.values(SENTINELS),
];

export const ALCOHOL_BY_VOLUME_LIMITS = Object.freeze({
  MIN: 0,
  MAX: 100,
});
