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
