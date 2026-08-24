import { assertPresent, assertFunction } from "../../shared/invariant.js";

export function createDropboxController({ dropboxService }) {
  assertPresent(dropboxService, "dropboxService");
  assertFunction(dropboxService.handleChange, "dropboxService.handleChange");

  function verifyWebhook(req, res) {
    const challenge = req.query.challenge;

    if (!challenge) {
      return res.sendStatus(400);
    }

    return res
      .status(200)
      .type("text/plain")
      .set("X-Content-Type-Options", "nosniff")
      .send(challenge);
  }

  function receiveWebhook(req, res) {
    res.sendStatus(200);

    dropboxService.handleChange(req.body).catch((err) => {
      console.error("Error handling Dropbox webhook notification:", err);
    });
  }

  return {
    verifyWebhook,
    receiveWebhook,
  };
}
