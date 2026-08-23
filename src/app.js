// src/app.js
import express from "express";

export function createApp({ routes }) {
  const app = express();

  app.use(express.json());

  for (const { path, router } of routes) {
    app.use(path, router);
  }

  return app;
}