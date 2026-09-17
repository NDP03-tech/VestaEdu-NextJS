import type { CrudController } from "../controllers/crud.controller";
import type { RequestHandler, Router } from "express";

const express = require("express") as { Router(): Router };

export interface CrudRouteOptions {
  createPath?: string;
  createMiddleware?: RequestHandler[];
  readMiddleware?: RequestHandler[];
  updateMiddleware?: RequestHandler[];
  deleteMiddleware?: RequestHandler[];
}

export function createCrudRouter(
  controller: CrudController,
  options: CrudRouteOptions = {},
) {
  const router = express.Router();
  router.post(
    options.createPath ?? "/create",
    ...(options.createMiddleware ?? []),
    controller.create as unknown as RequestHandler,
  );
  router.get(
    "/",
    ...(options.readMiddleware ?? []),
    controller.getAll as unknown as RequestHandler,
  );
  router.get(
    "/:id",
    ...(options.readMiddleware ?? []),
    controller.getById as unknown as RequestHandler,
  );
  router.put(
    "/:id",
    ...(options.updateMiddleware ?? []),
    controller.update as unknown as RequestHandler,
  );
  router.delete(
    "/:id",
    ...(options.deleteMiddleware ?? []),
    controller.remove as unknown as RequestHandler,
  );
  return router;
}
