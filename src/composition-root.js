import { createApp } from "./app.js";
import { createHealthRouter } from "./api/routes/health.js";
import { createDropboxRouter } from "./api/routes/dropbox.js";
import { createDropboxController } from "./api/controllers/dropbox.js";

export function createCompositionRoot() {
  const dropboxController = createDropboxController();

  const healthRouter = createHealthRouter();
  const dropBoxRouter = createDropboxRouter({ dropboxController });

  const routes = [
    {
      path: "/health",
      router: healthRouter,
    },
    {
      path: "/webhooks/dropbox",
      router: dropBoxRouter,
    },
  ];

  const app = createApp({ routes });

  return { app };
}
