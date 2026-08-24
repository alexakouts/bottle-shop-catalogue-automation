// src/services/dropbox/service.js

export function createDropboxService({ dropboxClient, processCsv }) {
  async function handleChange(notification) {
    const changes = await dropboxClient.listChanges(notification);

    const results = [];

    for (const change of changes) {
      if (!change.path?.toLowerCase().endsWith(".csv")) {
        continue;
      }

      const csvText = await dropboxClient.downloadFile(change.path);
      const result = processCsv(csvText);

      results.push({
        file: change.path,
        result,
      });
    }

    return results;
  }

  return {
    handleChange,
  };
}
