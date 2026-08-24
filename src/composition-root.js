import { createApp } from "./app.js";
import { createHealthRouter } from "./api/routes/health.js";
import { createDropboxRouter } from "./api/routes/dropbox.js";

export function createCompositionRoot() {
  const routes = [
    {
      path: "/health",
      router: createHealthRouter(),
    },
    {
      path: "/webhooks/dropbox",
      router: createDropboxRouter(),
    },
  ];

  const app = createApp({ routes });

  return { app };
}
