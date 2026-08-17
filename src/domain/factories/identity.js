import { requireString, requireNumericString } from "../../shared/assert.js";

export function createIdentity({ id, gtin, externalIds }) {
  const trimmedId = requireString(id, "Identity id");
  const trimmedGtin = requireNumericString(gtin, "GTIN");

  return {
    id: trimmedId,
    gtin: trimmedGtin,
    externalIds,
  };
}
