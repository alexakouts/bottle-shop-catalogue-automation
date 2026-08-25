// src/integrations/dropbox/client.js

import { Dropbox } from "dropbox";
import { assertPresent } from "../../shared/invariant.js";

export function createDropboxClient({ clientId, clientSecret, refreshToken }) {
  assertPresent(clientId, "clientId");
  assertPresent(clientSecret, "clientSecret");
  assertPresent(refreshToken, "refreshToken");

  const client = new Dropbox({
    clientId,
    clientSecret,
    refreshToken,
  });

  async function listFolder(path) {
    const { result } = await client.filesListFolder({
      path,
      recursive: true,
    });

    return {
      entries: result.entries,
      cursor: result.cursor,
      hasMore: result.has_more,
    };
  }

  async function listFolderContinue(cursor) {
    const { result } = await client.filesListFolderContinue({
      cursor,
    });

    return {
      entries: result.entries,
      cursor: result.cursor,
      hasMore: result.has_more,
    };
  }

  async function downloadFile(path) {
    throw new Error("Not implemented");
  }

  return {
    listFolder,
    listFolderContinue,
    downloadFile,
  };
}
