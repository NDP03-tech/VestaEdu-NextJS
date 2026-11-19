import express, { type RequestHandler } from "express";
import type { QuizController } from "../controllers/QuizController";

export function createQuizContentsRouter(
  controller: Pick<QuizController, "saveContents">,
  authenticateToken: RequestHandler,
  authorizeRoles: (...roles: string[]) => RequestHandler,
) {
  const router = express.Router();
  router.put(
    "/:quizId/contents",
    authenticateToken,
    authorizeRoles("admin", "teacher"),
    controller.saveContents as unknown as RequestHandler,
  );
  return router;
}
