const port = Number(process.env.PORT);

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is required");
}

if (!Number.isInteger(port) || port <= 0) {
  throw new Error("PORT must be a positive integer");
}

const dropboxClientId = process.env.DROPBOX_CLIENT_ID;
const dropboxClientSecret = process.env.DROPBOX_CLIENT_SECRET;
const dropboxRefreshToken = process.env.DROPBOX_REFRESH_TOKEN;

if (!dropboxClientId) {
  throw new Error("DROPBOX_CLIENT_ID is required");
}

if (!dropboxClientSecret) {
  throw new Error("DROPBOX_CLIENT_SECRET is required");
}

if (!dropboxRefreshToken) {
  throw new Error("DROPBOX_REFRESH_TOKEN is required");
}

export const config = Object.freeze({
  port,
  dropbox: Object.freeze({
    clientId: dropboxClientId,
    clientSecret: dropboxClientSecret,
    refreshToken: dropboxRefreshToken,
  }),
});
