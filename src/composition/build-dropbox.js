import { createDropboxRouter } from "../api/routes/dropbox.js";
import { createDropboxController } from "../api/controllers/dropbox.js";
import { createDropboxService } from "../services/dropbox/service.js";
import { createDropboxClient } from "../integrations/dropbox/client.js";

export function buildDropbox({ accessToken, processCsv }) {
  const dropboxClient = createDropboxClient({ accessToken });

  const dropboxService = createDropboxService({
    dropboxClient,
    processCsv,
  });

  const dropboxController = createDropboxController({
    dropboxService,
  });

  return createDropboxRouter({
    dropboxController,
  });
}
