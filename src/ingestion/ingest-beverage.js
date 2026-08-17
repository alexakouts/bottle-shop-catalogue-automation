import { createBeverage } from "../domain/factories/beverage.js";

/**
 * Ingestion-layer boundary: wraps the throwing domain router in the
 * non-throwing {ok, record|errors} contract.
 *
 * @param {object} raw
 * @returns {{ok: true, record: object} | {ok: false, errors: string[]}}
 */
export function ingestBeverage(raw) {
    try {
        const record = createBeverage(raw);

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