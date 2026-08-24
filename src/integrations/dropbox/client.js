// src/integrations/dropbox/client.js

import { Dropbox } from "dropbox";

export function createDropboxClient({ accessToken }) {
  const client = new Dropbox({
    accessToken,
  });

  async function listFolder(path) {
    throw new Error("Not implemented");
  }

  async function listFolderContinue(cursor) {
    throw new Error("Not implemented");
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
