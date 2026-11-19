import { CrudController, type CrudControllerUseCases } from "./crud.controller";
import type { QuestionEntity } from "../../../domain/entities/question.entity";
import type { QuizEntity } from "../../../domain/entities";
import type {
  HttpRequest,
  HttpResponse,
  NextFunction,
} from "./crud.controller";
import {
  toStudentQuestionDto,
  toTeacherQuestionDto,
} from "../dto/question-response.dto";

interface GetQuestionsByQuizId {
  execute(quizId: string): Promise<QuestionEntity[]>;
}

interface GetQuizById {
  execute(quizId: string): Promise<QuizEntity | null>;
}

export class QuestionController extends CrudController {
  constructor(
    useCases: CrudControllerUseCases,
    private readonly getQuestionsByQuizId: GetQuestionsByQuizId,
    private readonly getQuizById: GetQuizById,
  ) {
    super(useCases);
  }

  getByQuizId = async (
    request: HttpRequest,
    response: HttpResponse,
    next: NextFunction,
  ): Promise<void> => {
    const quizId = request.params.quizId ?? "";
    if (!/^[1-9]\d*$/.test(quizId)) {
      response.status(400).json({ message: "quizId must be a positive integer" });
      return;
    }

    try {
      const role = (request.user as { role?: string } | undefined)?.role;
      response.setHeader?.(
        "Cache-Control",
        role === "student" ? "private, max-age=30" : "no-store",
      );
      response.setHeader?.("Vary", "Authorization");
      if (role === "student") {
        const quiz = await this.getQuizById.execute(quizId);
        if (!quiz || quiz.status !== "published") {
          response.status(404).json({ message: "Quiz not found" });
          return;
        }
      }

      const questions = await this.getQuestionsByQuizId.execute(quizId);
      const data = questions.map((question) =>
        role === "admin" || role === "teacher"
          ? toTeacherQuestionDto(question)
          : toStudentQuestionDto(question),
      );
      response.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };
}
