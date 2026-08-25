// scripts/get-dropbox-refresh-token.js
//
// One-time utility to obtain a Dropbox refresh token for offline access.
//
// Run with:
// node --env-file=.env scripts/get-dropbox-refresh-token.js
//
// This is not part of the running application. Run it when setting up
// Dropbox credentials for an environment, then copy the returned refresh
// token into DROPBOX_REFRESH_TOKEN in .env.
//
// Never commit authorization codes, access tokens, or refresh tokens.

const clientId = process.env.DROPBOX_CLIENT_ID;
const clientSecret = process.env.DROPBOX_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error(
    "DROPBOX_CLIENT_ID and DROPBOX_CLIENT_SECRET must be set in .env",
  );
}

const authUrl = new URL("https://www.dropbox.com/oauth2/authorize");

authUrl.searchParams.set("client_id", clientId);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("token_access_type", "offline");

console.log("1. Open this URL in your browser and approve access:\n");
console.log(authUrl.toString());

console.log(
  "\n2. Copy the authorization code Dropbox displays, then paste it below.\n",
);

const readline = await import("node:readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const code = await rl.question("Authorization code: ");

rl.close();

const body = new URLSearchParams({
  code: code.trim(),
  grant_type: "authorization_code",
});

const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
  "base64",
);

const response = await fetch("https://api.dropboxapi.com/oauth2/token", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${credentials}`,
  },
  body,
});

const data = await response.json();

if (!response.ok) {
  console.error("\nToken exchange failed:", data);
  process.exit(1);
}

if (!data.refresh_token) {
  console.error("\nDropbox did not return a refresh token.");
  process.exit(1);
}

console.log("\nSuccess. Add this to your .env:\n");
console.log(`DROPBOX_REFRESH_TOKEN=${data.refresh_token}`);
