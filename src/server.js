// src/server.js
import { config } from "./config/config.js";
import { createCompositionRoot } from "./composition-root.js";

const { app, redisClient } = createCompositionRoot({
  dropbox: config.dropbox,
  redis: config.redis,
});

await redisClient.connect();

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
