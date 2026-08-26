import { test } from "node:test";
import assert from "node:assert/strict";
import { createDropboxCursorStore } from "../../../src/stores/dropbox/cursor-store.js";

function fakeRedisClient(initial) {
  const data = new Map(initial ? Object.entries(initial) : []);
  return {
    get: async (key) => data.get(key) ?? null,
    set: async (key, value) => {
      data.set(key, value);
    },
  };
}

test("throws when redisClient is missing", () => {
  assert.throws(() => createDropboxCursorStore({}), /redisClient is required/);
});

test("returns undefined before any cursor is set", async () => {
  const store = createDropboxCursorStore({ redisClient: fakeRedisClient() });

  assert.equal(await store.get(), undefined);
});

test("returns the value set previously", async () => {
  const redisClient = fakeRedisClient();
  const store = createDropboxCursorStore({ redisClient });

  await store.set("abc-123");

  assert.equal(await store.get(), "abc-123");
});

test("reads a cursor that was already present in redis", async () => {
  const redisClient = fakeRedisClient({ "dropbox:cursor": "existing-cursor" });
  const store = createDropboxCursorStore({ redisClient });

  assert.equal(await store.get(), "existing-cursor");
});

test("stores under the default dropbox:cursor key when no key is given", async () => {
  const redisClient = fakeRedisClient();
  const store = createDropboxCursorStore({ redisClient });

  await store.set("xyz");

  assert.equal(await redisClient.get("dropbox:cursor"), "xyz");
});

test("stores under a custom key when one is provided", async () => {
  const redisClient = fakeRedisClient();
  const store = createDropboxCursorStore({
    redisClient,
    key: "dropbox:cursor:catalogue-ingestion",
  });

  await store.set("custom-value");

  assert.equal(
    await redisClient.get("dropbox:cursor:catalogue-ingestion"),
    "custom-value",
  );
  assert.equal(await redisClient.get("dropbox:cursor"), null);
});
