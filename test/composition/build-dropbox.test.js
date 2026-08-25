import { test } from "node:test";
import assert from "node:assert/strict";
import { buildDropbox } from "../../src/composition/build-dropbox.js";

const validCredentials = {
  clientId: "fake-client-id",
  clientSecret: "fake-client-secret",
  refreshToken: "fake-refresh-token",
};
const validProcessCsv = () => ({ records: [], rejected: [] });

test("assembles a working router with no environment required", () => {
  const router = buildDropbox({
    credentials: validCredentials,
    processCsv: validProcessCsv,
  });

  assert.ok(router);
  assert.equal(typeof router, "function"); // Express routers are callable middleware
});

test("throws when credentials is missing", () => {
  assert.throws(
    () => buildDropbox({ processCsv: validProcessCsv }),
    /credentials is required/,
  );
});

test("throws when credentials.clientId is missing", () => {
  assert.throws(
    () =>
      buildDropbox({
        credentials: { clientSecret: "s", refreshToken: "t" },
        processCsv: validProcessCsv,
      }),
    /credentials\.clientId is required/,
  );
});

test("throws when processCsv is missing", () => {
  assert.throws(
    () => buildDropbox({ credentials: validCredentials }),
    /processCsv must be a function/,
  );
});
