import { Router } from "express";

export function createDropboxRouter({ dropboxController }) {
  const router = Router();

  router.get("/", dropboxController.verifyWebhook);
  router.post("/", dropboxController.receiveWebhook);

  return router;
}
