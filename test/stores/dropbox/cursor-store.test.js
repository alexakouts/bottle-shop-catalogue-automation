import { test } from "node:test";
import assert from "node:assert/strict";
import { createDropboxCursorStore } from "../../../src/stores/dropbox/cursor-store.js";

test("returns undefined before any cursor is set", async () => {
  const store = createDropboxCursorStore();

  assert.equal(await store.get(), undefined);
});

test("returns the value set previously", async () => {
  const store = createDropboxCursorStore();

  await store.set("abc-123");

  assert.equal(await store.get(), "abc-123");
});

test("each store instance is independent", async () => {
  const storeA = createDropboxCursorStore();
  const storeB = createDropboxCursorStore();

  await storeA.set("cursor-a");

  assert.equal(await storeA.get(), "cursor-a");
  assert.equal(await storeB.get(), undefined);
});
