const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error("PORT must be a positive integer");
}

const dropboxAccessToken = process.env.DROPBOX_ACCESS_TOKEN;

if (!dropboxAccessToken) {
  throw new Error("DROPBOX_ACCESS_TOKEN is required");
}

export const config = Object.freeze({
  port,
  dropbox: Object.freeze({
    accessToken: dropboxAccessToken,
  }),
});
