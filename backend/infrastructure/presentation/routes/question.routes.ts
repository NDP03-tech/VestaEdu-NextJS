import express, { type RequestHandler } from "express";
import type { QuestionController } from "../controllers/QuestionController";

export function createQuestionRouter(
  controller: Pick<QuestionController, "getByQuizId">,
  authenticateToken: RequestHandler,
  authorizeRoles: (...roles: string[]) => RequestHandler,
) {
  const router = express.Router();
  router.get(
    "/by-quiz/:quizId",
    authenticateToken,
    authorizeRoles("admin", "teacher", "student"),
    controller.getByQuizId as unknown as RequestHandler,
  );
  return router;
}
