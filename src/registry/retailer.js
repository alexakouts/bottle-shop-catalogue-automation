import { createAppError } from "../errors/app-error.js";

// Each retailer's id is a fixed, stable identifier generated once
// (e.g. via crypto.randomUUID()) and hardcoded here — never regenerated
// at runtime, since the same folder must always resolve to the same
// retailer, indefinitely.
const RETAILERS = [
  {
    id: "6049cd60-94c4-41f3-b046-202464211697",
    folderKey: "ews",
  },
];

function extractFolderKey(path) {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) {
    throw createAppError(
      "INVALID_RETAILER_PATH",
      `Dropbox file path must contain a retailer folder: "${path}"`,
      422,
      { path },
    );
  }
  return segments[0];
}

export function resolveRetailerId(path) {
  const folderKey = extractFolderKey(path);

  const retailer = RETAILERS.find((r) => r.folderKey === folderKey);

  if (!retailer) {
    throw createAppError(
      "UNKNOWN_RETAILER_FOLDER",
      `No retailer is registered for folder "${folderKey}"`,
      422,
      { folderKey, path },
    );
  }

  return retailer.id;
}
