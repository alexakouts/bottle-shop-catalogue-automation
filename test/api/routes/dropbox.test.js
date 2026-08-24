import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../../src/app.js";
import { createDropboxRouter } from "../../../src/api/routes/dropbox.js";

function buildApp() {
  return createApp({
    routes: [{ path: "/webhooks/dropbox", router: createDropboxRouter() }],
  });
}

test("GET /webhooks/dropbox returns 501 (not yet implemented)", async () => {
  const app = buildApp();

  const response = await request(app).get("/webhooks/dropbox");

  assert.equal(response.status, 501);
});

test("POST /webhooks/dropbox returns 501 (not yet implemented)", async () => {
  const app = buildApp();

  const response = await request(app).post("/webhooks/dropbox");

  assert.equal(response.status, 501);
});
