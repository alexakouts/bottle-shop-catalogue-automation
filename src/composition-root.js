import { createApp } from "./app.js";
import { createHealthRouter } from "./api/routes/health.js";
import { buildDropbox } from "./composition/build-dropbox.js";
import { processCsv } from "./ingestion/process-csv.js";

export function createCompositionRoot({ dropboxAccessToken }) {
  const healthRouter = createHealthRouter();

  const dropboxRouter = buildDropbox({
    accessToken: dropboxAccessToken,
    processCsv,
  });

  const routes = [
    {
      path: "/health",
      router: healthRouter,
    },
    {
      path: "/webhooks/dropbox",
      router: dropboxRouter,
    },
  ];

  const app = createApp({ routes });

  return { app };
}
