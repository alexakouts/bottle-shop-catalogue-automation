import test from "node:test";
import assert from "node:assert/strict";

import { createIdentity } from "../../../src/domain/catalogue/identity.js";

test("creates a valid identity", () => {
    const identity = createIdentity({
        id: "product-001",
        gtin: "9312345678901",
        externalIds: ["supplier-123"],
    });

    assert.deepEqual(identity, {
        id: "product-001",
        gtin: "9312345678901",
        externalIds: ["supplier-123"],
    });
});

test("throws when id is missing", () => {
    assert.throws(
        () =>
            createIdentity({
                gtin: "9312345678901",
                externalIds: ["supplier-123"],
            }),
        /Identity id/,
    );
});

test("throws when gtin contains non-numeric characters", () => {
    assert.throws(
        () =>
            createIdentity({
                id: "product-001",
                gtin: "93123ABC78901",
                externalIds: ["supplier-123"],
            }),
        /GTIN must contain only digits/,
    );
});

test("throws when gtin is not a string", () => {
    assert.throws(
        () =>
            createIdentity({
                id: "product-001",
                gtin: 9312345678901,
                externalIds: ["supplier-123"],
            }),
        /GTIN must be a string/,
    );
});

test("trims surrounding whitespace from identity fields", () => {
    const identity = createIdentity({
        id: "  product-001  ",
        gtin: "  9312345678901  ",
        externalIds: ["supplier-123"],
    });

    assert.equal(identity.id, "product-001");
    assert.equal(identity.gtin, "9312345678901");
});