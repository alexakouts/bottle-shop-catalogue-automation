import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../../src/app.js";
import { createHealthRouter } from "../../../src/api/routes/health.js";

function buildApp() {
    return createApp({
        routes: [{ path: "/health", router: createHealthRouter() }],
    });
}

test("GET /health returns 200 with status ok", async () => {
    const app = buildApp();

    const response = await request(app).get("/health");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { status: "ok" });
});