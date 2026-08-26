// src/server.js

import { config } from "./config/config.js";
import { createCompositionRoot } from "./composition-root.js";

const { app, redisClient } = createCompositionRoot({
  dropbox: config.dropbox,
  redis: config.redis,
});

await redisClient.connect();

const server = app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

let shuttingDown = false;
const SHUTDOWN_TIMEOUT_MS = 10_000;

async function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  console.log(`${signal} received, shutting down`);

  const timeout = setTimeout(() => {
    console.error("Shutdown timed out, forcing exit");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  server.close(async () => {
    try {
      if (redisClient.isOpen) {
        await redisClient.quit();
      }

      clearTimeout(timeout);
      console.log("Server stopped");
      process.exit(0);
    } catch (err) {
      clearTimeout(timeout);
      console.error("Shutdown failed:", err);
      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
