import { SENTINELS } from "./beverage.js";

export const BEER_FERMENTATION_TYPE = Object.freeze({
  ALE: "ale",
  LAGER: "lager",
});

export const BEER_FERMENTATION_TYPES = [
  ...Object.values(BEER_FERMENTATION_TYPE),
  SENTINELS.UNKNOWN,
  SENTINELS.OTHER,
];

export const BEER_STYLE = Object.freeze({
  PILSNER: "pilsner",
  PALE_ALE: "pale-ale",
  IPA: "ipa",
  STOUT: "stout",
  PORTER: "porter",
  WHEAT: "wheat",
});

export const BEER_STYLES = [
  ...Object.values(BEER_STYLE),
  SENTINELS.UNKNOWN,
  SENTINELS.OTHER,
];
