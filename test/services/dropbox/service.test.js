import { test } from "node:test";
import assert from "node:assert/strict";
import { createDropboxService } from "../../../src/services/dropbox/service.js";

function fakeClient({ changes = [], files = {} } = {}) {
  return {
    listChanges: async () => changes,
    downloadFile: async (path) => files[path],
  };
}

test("processes only .csv files, skipping others", async () => {
  const client = fakeClient({
    changes: [
      { path: "/retailer-a/catalog.csv" },
      { path: "/retailer-a/readme.txt" },
    ],
    files: { "/retailer-a/catalog.csv": "brand,category\nTest,beer" },
  });
  const processCsv = (text) => ({ records: [text], rejected: [] });

  const service = createDropboxService({ dropboxClient: client, processCsv });
  const results = await service.handleChange({});

  assert.equal(results.length, 1);
  assert.equal(results[0].file, "/retailer-a/catalog.csv");
});

test("calls processCsv with the downloaded file content", async () => {
  const client = fakeClient({
    changes: [{ path: "/retailer-a/catalog.csv" }],
    files: { "/retailer-a/catalog.csv": "brand,category\nTest,beer" },
  });

  let receivedText;
  const processCsv = (text) => {
    receivedText = text;
    return { records: [], rejected: [] };
  };

  const service = createDropboxService({ dropboxClient: client, processCsv });
  await service.handleChange({});

  assert.equal(receivedText, "brand,category\nTest,beer");
});

test("returns an empty array when there are no changes", async () => {
  const client = fakeClient({ changes: [] });
  const processCsv = () => ({ records: [], rejected: [] });

  const service = createDropboxService({ dropboxClient: client, processCsv });
  const results = await service.handleChange({});

  assert.deepEqual(results, []);
});

test("matches .csv extension case-insensitively", async () => {
  const client = fakeClient({
    changes: [{ path: "/retailer-a/CATALOG.CSV" }],
    files: { "/retailer-a/CATALOG.CSV": "data" },
  });
  const processCsv = () => ({ records: [], rejected: [] });

  const service = createDropboxService({ dropboxClient: client, processCsv });
  const results = await service.handleChange({});

  assert.equal(results.length, 1);
});
