import { assertEnum, requireString } from "../../shared/assert.js";
import { RTD_TYPES } from "../schemas/rtd.js";

export function createRtd(input) {
  const type = assertEnum(
    requireString(input.type, "RTD type"),
    RTD_TYPES,
    "RTD type",
  );

  return { type };
}
