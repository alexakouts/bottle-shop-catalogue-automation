import { test } from "node:test";
import assert from "node:assert/strict";
import { createRedisClient } from "../../src/integrations/redis/client.js";

test("connects to Redis", async () => {
  const url = process.env.REDIS_URL;

  assert.ok(url, "REDIS_URL is required");

  const client = createRedisClient({ url });

  await client.connect();

  try {
    const result = await client.ping();

    assert.equal(result, "PONG");
  } finally {
    await client.quit();
  }
});
