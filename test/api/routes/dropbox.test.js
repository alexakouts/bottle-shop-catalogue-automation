import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../../src/app.js";
import { createDropboxRouter } from "../../../src/api/routes/dropbox.js";
import { createDropboxController } from "../../../src/api/controllers/dropbox.js";

function buildApp() {
  const dropboxController = createDropboxController();
  return createApp({
    routes: [
      {
        path: "/webhooks/dropbox",
        router: createDropboxRouter({ dropboxController }),
      },
    ],
  });
}

test("GET /webhooks/dropbox echoes the challenge with 200 when provided", async () => {
  const app = buildApp();

  const response = await request(app).get("/webhooks/dropbox?challenge=abc123");

  assert.equal(response.status, 200);
  assert.equal(response.text, "abc123");
  assert.equal(response.headers["content-type"], "text/plain; charset=utf-8");
  assert.equal(response.headers["x-content-type-options"], "nosniff");
});

test("GET /webhooks/dropbox returns 400 when challenge is missing", async () => {
  const app = buildApp();

  const response = await request(app).get("/webhooks/dropbox");

  assert.equal(response.status, 400);
});

test("POST /webhooks/dropbox returns 501 (not yet implemented)", async () => {
  const app = buildApp();

  const response = await request(app).post("/webhooks/dropbox");

  assert.equal(response.status, 501);
});
