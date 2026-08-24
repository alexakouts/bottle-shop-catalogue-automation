import { test } from "node:test";
import assert from "node:assert/strict";
import { buildDropbox } from "../../src/composition/build-dropbox.js";

test("assembles a working router with no environment required", () => {
  const router = buildDropbox({
    accessToken: "fake-token",
    processCsv: () => ({ records: [], rejected: [] }),
  });

  assert.ok(router);
  assert.equal(typeof router, "function"); // Express routers are callable middleware
});
