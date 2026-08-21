import { SENTINELS } from "./beverage.js";

export const SPIRIT_TYPE = Object.freeze({
  WHISKY: "whisky",
  BOURBON: "bourbon",
  GIN: "gin",
  VODKA: "vodka",
  RUM: "rum",
  TEQUILA: "tequila",
  BRANDY_COGNAC: "brandy-cognac",
  LIQUEUR: "liqueur",
});

export const SPIRIT_TYPES = [
  ...Object.values(SPIRIT_TYPE),
  ...Object.values(SENTINELS),
];

export const WHISKY_STYLE = Object.freeze({
  SINGLE_MALT: "single-malt",
  BLENDED: "blended",
  BLENDED_MALT: "blended-malt",
  SINGLE_GRAIN: "single-grain",
});

export const WHISKY_STYLES = [
  ...Object.values(WHISKY_STYLE),
  ...Object.values(SENTINELS),
];

export const BOURBON_STYLE = Object.freeze({
  STRAIGHT: "straight",
  BOTTLED_IN_BOND: "bottled-in-bond",
  SMALL_BATCH: "small-batch",
  SINGLE_BARREL: "single-barrel",
});

export const BOURBON_STYLES = [
  ...Object.values(BOURBON_STYLE),
  ...Object.values(SENTINELS),
];

export const GIN_STYLE = Object.freeze({
  LONDON_DRY: "london-dry",
  DRY: "dry",
  OLD_TOM: "old-tom",
  NAVY_STRENGTH: "navy-strength",
  FLAVOURED: "flavoured",
});

export const GIN_STYLES = [
  ...Object.values(GIN_STYLE),
  ...Object.values(SENTINELS),
];

export const VODKA_STYLE = Object.freeze({
  UNFLAVOURED: "unflavoured",
  FLAVOURED: "flavoured",
});

export const VODKA_STYLES = [
  ...Object.values(VODKA_STYLE),
  ...Object.values(SENTINELS),
];

export const RUM_STYLE = Object.freeze({
  WHITE: "white",
  GOLD: "gold",
  DARK: "dark",
  SPICED: "spiced",
  AGED: "aged",
});

export const RUM_STYLES = [
  ...Object.values(RUM_STYLE),
  ...Object.values(SENTINELS),
];

export const TEQUILA_STYLE = Object.freeze({
  BLANCO: "blanco",
  JOVEN: "joven",
  REPOSADO: "reposado",
  ANEJO: "anejo",
  EXTRA_ANEJO: "extra-anejo",
});

export const TEQUILA_STYLES = [
  ...Object.values(TEQUILA_STYLE),
  ...Object.values(SENTINELS),
];

export const BRANDY_STYLE = Object.freeze({
  BRANDY: "brandy",
  COGNAC: "cognac",
  ARMAGNAC: "armagnac",
});

export const BRANDY_STYLES = [
  ...Object.values(BRANDY_STYLE),
  ...Object.values(SENTINELS),
];

export const LIQUEUR_STYLE = Object.freeze({
  FRUIT: "fruit",
  HERBAL: "herbal",
  CREAM: "cream",
  COFFEE: "coffee",
  CHOCOLATE: "chocolate",
  NUT: "nut",
  CITRUS: "citrus",
});

export const LIQUEUR_STYLES = [
  ...Object.values(LIQUEUR_STYLE),
  ...Object.values(SENTINELS),
];
