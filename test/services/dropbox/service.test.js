import { test } from "node:test";
import assert from "node:assert/strict";
import { createDropboxService } from "../../../src/services/dropbox/service.js";

function fakeCursorStore(initial) {
  let cursor = initial;
  return {
    get: async () => cursor,
    set: async (value) => {
      cursor = value;
    },
  };
}

test("uses listFolder when no cursor is stored", async () => {
  let calledListFolder = false;
  const dropboxClient = {
    listFolder: async () => {
      calledListFolder = true;
      return { entries: [], cursor: "cursor-1", hasMore: false };
    },
    listFolderContinue: async () => {
      throw new Error("should not be called");
    },
  };

  const service = createDropboxService({
    dropboxClient,
    cursorStore: fakeCursorStore(undefined),
    processCsv: () => ({ records: [], rejected: [] }),
  });

  await service.handleChange({});

  assert.equal(calledListFolder, true);
});

test("uses listFolderContinue when a cursor is already stored", async () => {
  let calledContinueWith;
  const dropboxClient = {
    listFolder: async () => {
      throw new Error("should not be called");
    },
    listFolderContinue: async (cursor) => {
      calledContinueWith = cursor;
      return { entries: [], cursor: "cursor-2", hasMore: false };
    },
  };

  const service = createDropboxService({
    dropboxClient,
    cursorStore: fakeCursorStore("cursor-1"),
    processCsv: () => ({ records: [], rejected: [] }),
  });

  await service.handleChange({});

  assert.equal(calledContinueWith, "cursor-1");
});

test("processes only .csv entries, skipping others", async () => {
  const dropboxClient = {
    listFolder: async () => ({
      entries: [
        { path_lower: "/ews/catalog.csv" },
        { path_lower: "/ews/readme.txt" },
      ],
      cursor: "cursor-1",
      hasMore: false,
    }),
    downloadFile: async () => "brand,category\nTest,beer",
  };

  const service = createDropboxService({
    dropboxClient,
    cursorStore: fakeCursorStore(undefined),
    processCsv: (text) => ({ records: [text], rejected: [] }),
  });

  const results = await service.handleChange({});

  assert.equal(results.length, 1);
  assert.equal(results[0].file, "/ews/catalog.csv");
});

test("calls processCsv with the downloaded file content", async () => {
  const dropboxClient = {
    listFolder: async () => ({
      entries: [{ path_lower: "/ews/catalog.csv" }],
      cursor: "cursor-1",
      hasMore: false,
    }),
    downloadFile: async () => "brand,category\nTest,beer",
  };

  let receivedText;
  const service = createDropboxService({
    dropboxClient,
    cursorStore: fakeCursorStore(undefined),
    processCsv: (text) => {
      receivedText = text;
      return { records: [], rejected: [] };
    },
  });

  await service.handleChange({});

  assert.equal(receivedText, "brand,category\nTest,beer");
});

test("stores the new cursor returned by the change page", async () => {
  const cursorStore = fakeCursorStore(undefined);
  const dropboxClient = {
    listFolder: async () => ({
      entries: [],
      cursor: "new-cursor",
      hasMore: false,
    }),
  };

  const service = createDropboxService({
    dropboxClient,
    cursorStore,
    processCsv: () => ({ records: [], rejected: [] }),
  });

  await service.handleChange({});

  assert.equal(await cursorStore.get(), "new-cursor");
});

test("returns an empty array when there are no entries", async () => {
  const dropboxClient = {
    listFolder: async () => ({
      entries: [],
      cursor: "cursor-1",
      hasMore: false,
    }),
  };

  const service = createDropboxService({
    dropboxClient,
    cursorStore: fakeCursorStore(undefined),
    processCsv: () => ({ records: [], rejected: [] }),
  });

  const results = await service.handleChange({});

  assert.deepEqual(results, []);
});

test("attaches the resolved retailerId to a successfully processed file", async () => {
  const dropboxClient = {
    listFolder: async () => ({
      entries: [{ path_lower: "/ews/catalog.csv" }],
      cursor: "cursor-1",
      hasMore: false,
    }),
    downloadFile: async () => "brand,category\nTest,beer",
  };

  const service = createDropboxService({
    dropboxClient,
    cursorStore: fakeCursorStore(undefined),
    processCsv: () => ({ records: [], rejected: [] }),
  });

  const results = await service.handleChange({});

  assert.equal(results[0].ok, true);
  assert.equal(results[0].retailerId, "6049cd60-94c4-41f3-b046-202464211697");
});

test("skips a file from an unregistered retailer folder without downloading it", async () => {
  let downloadCalled = false;
  const dropboxClient = {
    listFolder: async () => ({
      entries: [{ path_lower: "/unknown-retailer/catalog.csv" }],
      cursor: "cursor-1",
      hasMore: false,
    }),
    downloadFile: async () => {
      downloadCalled = true;
      return "";
    },
  };

  const service = createDropboxService({
    dropboxClient,
    cursorStore: fakeCursorStore(undefined),
    processCsv: () => ({ records: [], rejected: [] }),
  });

  const results = await service.handleChange({});

  assert.equal(downloadCalled, false);
  assert.equal(results.length, 1);
  assert.equal(results[0].file, "/unknown-retailer/catalog.csv");
  assert.equal(results[0].ok, false);
  assert.equal(results[0].error.code, "UNKNOWN_RETAILER_FOLDER");
  assert.match(results[0].error.message, /No retailer is registered/);
});

test("processes a known-retailer file even when another file in the same batch is unknown", async () => {
  const dropboxClient = {
    listFolder: async () => ({
      entries: [
        { path_lower: "/unknown-retailer/catalog.csv" },
        { path_lower: "/ews/catalog.csv" },
      ],
      cursor: "cursor-1",
      hasMore: false,
    }),
    downloadFile: async () => "brand,category\nTest,beer",
  };

  const service = createDropboxService({
    dropboxClient,
    cursorStore: fakeCursorStore(undefined),
    processCsv: () => ({ records: [], rejected: [] }),
  });

  const results = await service.handleChange({});

  assert.equal(results.length, 2);
  assert.equal(results[0].ok, false);
  assert.equal(results[1].ok, true);
  assert.equal(results[1].retailerId, "6049cd60-94c4-41f3-b046-202464211697");
});

test("processes all pages and stores the final cursor", async () => {
  const cursorStore = fakeCursorStore(undefined);
  let continueCalls = 0;
  const dropboxClient = {
    listFolder: async () => ({
      entries: [{ path_lower: "/ews/first.csv" }],
      cursor: "cursor-1",
      hasMore: true,
    }),
    listFolderContinue: async (cursor) => {
      continueCalls += 1;
      assert.equal(cursor, "cursor-1");
      return {
        entries: [{ path_lower: "/ews/second.csv" }],
        cursor: "cursor-2",
        hasMore: false,
      };
    },
    downloadFile: async () => "csv-content",
  };
  const service = createDropboxService({
    dropboxClient,
    cursorStore,
    processCsv: () => ({ records: [], rejected: [] }),
  });
  const results = await service.handleChange({});
  assert.equal(results.length, 2);
  assert.equal(continueCalls, 1);
  assert.equal(await cursorStore.get(), "cursor-2");
});
