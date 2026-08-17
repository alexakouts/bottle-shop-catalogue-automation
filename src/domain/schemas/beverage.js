export const SENTINELS = ["unknown", "other"];

export const BEVERAGE_CATEGORY = Object.freeze({
  BEER: "beer",
  CIDER: "cider",
  WINE: "wine",
  SPIRITS: "spirits",
  RTD: "rtd",
});

export const BEVERAGE_CATEGORIES = [
  ...Object.values(BEVERAGE_CATEGORY),
  ...SENTINELS,
];

export const ALCOHOL_STATUSES = [
  "alcoholic",
  "low-alcohol",
  "non-alcoholic",
  "alcohol-free",
  "unknown", // no "other" — see taxonomy-conventions.md Section 4
];

export const CONTAINER_TYPES = [
  "bottle",
  "can",
  "cask",
  "carton",
  "pouch",
  ...SENTINELS,
];
