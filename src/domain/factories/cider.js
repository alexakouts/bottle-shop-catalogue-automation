import { assertEnum, requireString } from "../../shared/assert.js";
import { CIDER_TYPES } from "../schemas/cider.js";

export function createCider(input) {
  const type = assertEnum(
    requireString(input.type, "Cider type"),
    CIDER_TYPES,
    "Cider type",
  );

  return { type };
}
