// schemas/wine.js
import { SENTINELS } from "./beverage.js";

export const WINE_TYPE = Object.freeze({
  RED: "red",
  WHITE: "white",
  ROSE: "rosé",
  SPARKLING: "sparkling",
  DESSERT: "dessert",
  FORTIFIED: "fortified",
});

export const WINE_TYPES = [
  ...Object.values(WINE_TYPE),
  ...Object.values(SENTINELS),
];
