import { Router } from "express";

export function createDropboxRouter() {
  const router = Router();

  // Dropbox webhook verification.
  router.get("/", (req, res) => {
    res.sendStatus(501);
  });

  // Dropbox change notification.
  router.post("/", (req, res) => {
    res.sendStatus(501);
  });

  return router;
}
