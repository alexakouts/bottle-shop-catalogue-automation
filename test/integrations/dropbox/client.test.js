import { test } from "node:test";
import assert from "node:assert/strict";
import { createDropboxClient } from "../../../src/integrations/dropbox/client.js";

test("throws when clientId is missing", () => {
  assert.throws(
    () =>
      createDropboxClient({ clientSecret: "secret", refreshToken: "token" }),
    (err) => {
      assert.equal(err.message, "clientId is required");
      assert.equal(err.code, "INVARIANT_FAILED");
      return true;
    },
  );
});

test("throws when clientSecret is missing", () => {
  assert.throws(
    () => createDropboxClient({ clientId: "id", refreshToken: "token" }),
    /clientSecret is required/,
  );
});

test("throws when refreshToken is missing", () => {
  assert.throws(
    () => createDropboxClient({ clientId: "id", clientSecret: "secret" }),
    /refreshToken is required/,
  );
});

test("returns listFolder, listFolderContinue, and downloadFile when credentials are provided", () => {
  const client = createDropboxClient({
    clientId: "id",
    clientSecret: "secret",
    refreshToken: "token",
  });

  assert.equal(typeof client.listFolder, "function");
  assert.equal(typeof client.listFolderContinue, "function");
  assert.equal(typeof client.downloadFile, "function");
});
