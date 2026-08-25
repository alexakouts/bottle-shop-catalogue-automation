// src/services/dropbox/service.js

export function createDropboxService({
  dropboxClient,
  cursorStore,
  processCsv,
}) {
  async function handleChange(notification) {
    const cursor = await cursorStore.get();

    const changePage = cursor
      ? await dropboxClient.listFolderContinue(cursor)
      : await dropboxClient.listFolder("");

    const results = [];

    for (const entry of changePage.entries) {
      if (!entry.path_lower?.endsWith(".csv")) {
        continue;
      }

      const csvText = await dropboxClient.downloadFile(entry.path_lower);
      const result = processCsv(csvText);

      results.push({
        file: entry.path_lower,
        result,
      });
    }

    await cursorStore.set(changePage.cursor);

    return results;
  }

  return {
    handleChange,
  };
}
