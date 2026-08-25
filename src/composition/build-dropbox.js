import { createDropboxRouter } from "../api/routes/dropbox.js";
import { createDropboxController } from "../api/controllers/dropbox.js";
import { createDropboxService } from "../services/dropbox/service.js";
import { createDropboxClient } from "../integrations/dropbox/client.js";
import { createDropboxCursorStore } from "../stores/dropbox/cursor-store.js";
import { assertPresent, assertFunction } from "../shared/invariant.js";

export function buildDropbox({ credentials, processCsv }) {
  assertPresent(credentials, "credentials");
  assertPresent(credentials.clientId, "credentials.clientId");
  assertPresent(credentials.clientSecret, "credentials.clientSecret");
  assertPresent(credentials.refreshToken, "credentials.refreshToken");
  assertFunction(processCsv, "processCsv");

  const dropboxClient = createDropboxClient({
    clientId: credentials.clientId,
    clientSecret: credentials.clientSecret,
    refreshToken: credentials.refreshToken,
  });

  const cursorStore = createDropboxCursorStore();

  const dropboxService = createDropboxService({
    dropboxClient,
    cursorStore,
    processCsv,
  });

  const dropboxController = createDropboxController({
    dropboxService,
  });

  return createDropboxRouter({
    dropboxController,
  });
}
