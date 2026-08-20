export const SENTINELS = Object.freeze({
  UNKNOWN: "unknown",
  OTHER: "other",
});

export const BEVERAGE_CATEGORY = Object.freeze({
  BEER: "beer",
  CIDER: "cider",
  WINE: "wine",
  SPIRITS: "spirits",
  RTD: "rtd",
});

export const BEVERAGE_CATEGORIES = [
  ...Object.values(BEVERAGE_CATEGORY),
  ...Object.values(SENTINELS),
];

export const ALCOHOL_STATUSES = [
  "alcoholic",
  "low-alcohol",
  "non-alcoholic",
  "alcohol-free",
  SENTINELS.UNKNOWN,
];
