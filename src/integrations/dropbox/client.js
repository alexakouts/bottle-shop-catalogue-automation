import { Dropbox } from "dropbox";
import { assertPresent } from "../../shared/invariant.js";
import { createAppError } from "../../errors/app-error.js";

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
    const { result } = await client.filesDownload({ path });
    if (result.fileBinary) {
      return result.fileBinary.toString("utf8");
    }
    throw createAppError(
      "DROPBOX_DOWNLOAD_EMPTY",
      `Dropbox download returned no file content for "${path}"`,
      502,
      { path },
    );
  }

  return {
    listFolder,
    listFolderContinue,
    downloadFile,
  };
}
