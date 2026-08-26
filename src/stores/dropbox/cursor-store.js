import { assertPresent } from "../../shared/invariant.js";

const DEFAULT_CURSOR_KEY = "dropbox:cursor";

export function createDropboxCursorStore({
  redisClient,
  key = DEFAULT_CURSOR_KEY,
}) {
  assertPresent(redisClient, "redisClient");
  assertPresent(key, "key");

  async function get() {
    return (await redisClient.get(key)) ?? undefined;
  }

  async function set(value) {
    await redisClient.set(key, value);
  }

  return {
    get,
    set,
  };
}
