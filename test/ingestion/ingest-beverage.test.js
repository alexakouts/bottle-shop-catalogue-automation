import test from "node:test";
import assert from "node:assert/strict";

import { ingestBeverage} from "../../src/ingestion/ingest-beverage.js";

test("returns a successful result for a valid beverage", () => {
    const result = ingestBeverage({
        id: "beer-001",
        category: "beer",
        fermentationType: "ale",
        style: "stout",
    });

    assert.equal(result.ok, true);
    assert.equal(result.record.id, "beer-001");
    assert.equal(result.record.category, "beer");
});

test("returns errors for an invalid beverage without throwing", () => {
    const result = ingestBeverage({
        id: "beer-001",
        category: "beer",
        fermentationType: "invalid",
        style: "stout",
    });

    assert.equal(result.ok, false);
    assert.ok(Array.isArray(result.errors));
    assert.equal(result.errors.length, 1);
});