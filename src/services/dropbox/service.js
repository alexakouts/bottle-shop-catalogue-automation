// src/services/dropbox/service.js

import { resolveRetailerId } from "../../registry/retailer.js";

export function createDropboxService({
  dropboxClient,
  cursorStore,
  processCsv,
}) {
  async function handleChange() {
    const cursor = await cursorStore.get();

    let changePage = cursor
      ? await dropboxClient.listFolderContinue(cursor)
      : await dropboxClient.listFolder("");

    const results = [];

    while (true) {
      for (const entry of changePage.entries) {
        if (!entry.path_lower?.endsWith(".csv")) {
          continue;
        }

        let retailerId;
        try {
          retailerId = resolveRetailerId(entry.path_lower);
        } catch (err) {
          results.push({
            file: entry.path_lower,
            ok: false,
            error: {
              code: err.code,
              message: err.message,
            },
          });
          continue;
        }

        const csvText = await dropboxClient.downloadFile(entry.path_lower);

        console.log(
          `Dropbox file received: ${entry.path_lower} (${Buffer.byteLength(csvText, "utf8")} bytes)`,
        );
        const result = processCsv(csvText);

        results.push({
          file: entry.path_lower,
          retailerId,
          ok: true,
          result,
        });
      }

      if (!changePage.hasMore) {
        break;
      }

      changePage = await dropboxClient.listFolderContinue(changePage.cursor);
    }

    await cursorStore.set(changePage.cursor);

    return results;
  }

  return {
    handleChange,
  };
}
