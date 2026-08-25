import { createApp } from "./app.js";
import { createHealthRouter } from "./api/routes/health.js";
import { buildDropbox } from "./composition/build-dropbox.js";
import { processCsv } from "./ingestion/process-csv.js";

export function createCompositionRoot({ dropbox }) {
  const healthRouter = createHealthRouter();
  const dropboxRouter = buildDropbox({
    credentials: dropbox,
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
