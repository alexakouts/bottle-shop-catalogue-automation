import { createBeverageVariant } from "../domain/factories/beverage-variant.js";

/**
 * Ingestion-layer boundary: wraps the throwing domain composition factory
 * in the non-throwing {ok, record|errors} contract.
 *
 * @param {object} raw
 * @returns {{ok: true, record: object} | {ok: false, errors: string[]}}
 */
export function ingestBeverage(raw) {
  try {
    const record = createBeverageVariant(raw);

    return {
      ok: true,
      record,
    };
  } catch (err) {
    return {
      ok: false,
      errors: [err.message],
    };
  }
}
