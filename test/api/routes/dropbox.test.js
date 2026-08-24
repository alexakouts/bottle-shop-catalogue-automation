import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../../src/app.js";
import { createDropboxRouter } from "../../../src/api/routes/dropbox.js";
import { createDropboxController } from "../../../src/api/controllers/dropbox.js";

function buildApp({ dropboxService } = {}) {
  const controller = createDropboxController({
    dropboxService: dropboxService ?? { handleChange: async () => [] },
  });
  return createApp({
    routes: [
      {
        path: "/webhooks/dropbox",
        router: createDropboxRouter({ dropboxController: controller }),
      },
    ],
  });
}

test("throws an AppError when dropboxService is missing", () => {
  assert.throws(
    () => createDropboxController({}),
    (err) => {
      assert.equal(err.message, "dropboxService is required");
      assert.equal(err.code, "INVARIANT_FAILED");
      assert.equal(err.statusCode, 500);
      assert.equal(err.isAppError, true);
      return true;
    },
  );
});

test("throws an AppError when dropboxService has no handleChange function", () => {
  assert.throws(
    () => createDropboxController({ dropboxService: {} }),
    (err) => {
      assert.equal(
        err.message,
        "dropboxService.handleChange must be a function",
      );
      assert.equal(err.code, "INVARIANT_FAILED");
      return true;
    },
  );
});

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

test("POST /webhooks/dropbox responds 200 immediately without waiting for processing", async () => {
  let handleChangeCalled = false;
  const dropboxService = {
    handleChange: async () => {
      handleChangeCalled = true;
      return [];
    },
  };
  const app = buildApp({ dropboxService });

  const response = await request(app).post("/webhooks/dropbox").send({});

  assert.equal(response.status, 200);
  assert.equal(handleChangeCalled, true);
});

test("POST /webhooks/dropbox still responds 200 even if handleChange rejects", async () => {
  const dropboxService = {
    handleChange: async () => {
      throw new Error("Dropbox API failure");
    },
  };
  const app = buildApp({ dropboxService });

  const originalConsoleError = console.error;
  console.error = () => {}; // suppress expected error log for this test only

  try {
    const response = await request(app).post("/webhooks/dropbox").send({});
    assert.equal(response.status, 200);
  } finally {
    console.error = originalConsoleError; // always restore, even if the assertion fails
  }
});
