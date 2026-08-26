import { test } from "node:test";
import assert from "node:assert/strict";
import { createCompositionRoot } from "../../src/composition-root.js";

const validDropbox = {
  clientId: "fake-client-id",
  clientSecret: "fake-client-secret",
  refreshToken: "fake-refresh-token",
};
const validRedis = { url: "redis://localhost:6379" };

test("assembles an app and a redisClient with no real network required", () => {
  const { app, redisClient } = createCompositionRoot({
    dropbox: validDropbox,
    redis: validRedis,
  });

  assert.ok(app);
  assert.equal(typeof app, "function");
  assert.ok(redisClient);
  assert.equal(typeof redisClient.connect, "function");
});

test("throws when dropbox config is missing", () => {
  assert.throws(
    () => createCompositionRoot({ redis: validRedis }),
    /dropbox is required/,
  );
});

test("throws when redis config is missing", () => {
  assert.throws(
    () => createCompositionRoot({ dropbox: validDropbox }),
    /redis is required/,
  );
});
