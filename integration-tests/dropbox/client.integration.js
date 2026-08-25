import { test } from "node:test";
import assert from "node:assert/strict";
import { createDropboxClient } from "../../src/integrations/dropbox/client.js";

test("lists the Dropbox app folder", async () => {
  const clientId = process.env.DROPBOX_CLIENT_ID;
  const clientSecret = process.env.DROPBOX_CLIENT_SECRET;
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;

  assert.ok(clientId, "DROPBOX_CLIENT_ID is required");
  assert.ok(clientSecret, "DROPBOX_CLIENT_SECRET is required");
  assert.ok(refreshToken, "DROPBOX_REFRESH_TOKEN is required");

  const client = createDropboxClient({
    clientId,
    clientSecret,
    refreshToken,
  });

  const result = await client.listFolder("");

  assert.ok(Array.isArray(result.entries));
  assert.equal(typeof result.cursor, "string");
  assert.equal(typeof result.hasMore, "boolean");

  console.log(
    "Dropbox entries:",
    result.entries.map((entry) => entry.path_lower),
  );
});
