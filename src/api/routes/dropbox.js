import { Router } from "express";
import { assertPresent, assertFunction } from "../../shared/invariant.js";

export function createDropboxRouter({ dropboxController }) {
  assertPresent(dropboxController, "dropboxController");
  assertFunction(
    dropboxController.verifyWebhook,
    "dropboxController.verifyWebhook",
  );
  assertFunction(
    dropboxController.receiveWebhook,
    "dropboxController.receiveWebhook",
  );

  const router = Router();

  router.get("/", dropboxController.verifyWebhook);
  router.post("/", dropboxController.receiveWebhook);

  return router;
}
