// src/composition-root.js

import { createApp } from "./app.js";
import { createHealthRouter } from "./api/routes/health.js";
import { buildDropbox } from "./composition/build-dropbox.js";
import { createRedisClient } from "./integrations/redis/client.js";
import { processCsv } from "./ingestion/process-csv.js";

import { assertPresent } from "./shared/invariant.js";

export function createCompositionRoot({ dropbox, redis }) {
  assertPresent(dropbox, "dropbox");
  assertPresent(redis, "redis");

  const redisClient = createRedisClient({
    url: redis.url,
  });

  const healthRouter = createHealthRouter();

  const dropboxRouter = buildDropbox({
    credentials: dropbox,
    redisClient,
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

  return {
    app,
    redisClient,
  };
}
