export function createDropboxController() {
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
    return res.sendStatus(501);
  }

  return {
    verifyWebhook,
    receiveWebhook,
  };
}
