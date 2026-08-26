import { createClient } from "redis";
import { assertPresent } from "../../shared/invariant.js";

export function createRedisClient({ url }) {
  assertPresent(url, "url");

  const client = createClient({
    url,
  });

  client.on("error", (err) => {
    console.error("Redis client error:", err);
  });

  return client;
}
