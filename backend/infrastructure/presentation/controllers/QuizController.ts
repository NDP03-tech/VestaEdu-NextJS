import { CrudController, type CrudControllerUseCases } from "./crud.controller";
import type {
  HttpRequest,
  HttpResponse,
  NextFunction,
} from "./crud.controller";
import type { SaveQuizContentsUseCase } from "../../../applications/Quiz Use-case";

export class QuizController extends CrudController {
  constructor(
    useCases: CrudControllerUseCases,
    private readonly saveQuizContents: SaveQuizContentsUseCase,
  ) {
    super(useCases);
  }

  saveContents = async (
    request: HttpRequest,
    response: HttpResponse,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.saveQuizContents.execute(
        request.params.quizId ?? "",
        request.body,
      );
      response.status(200).json({
        data: {
          quiz: result.quiz.toJSON(),
          questions: result.questions.map((question) => question.toJSON()),
        },
      });
    } catch (error) {
      const candidate =
        typeof error === "object" && error !== null
          ? (error as { statusCode?: number; name?: string })
          : {};
      const statusCode =
        candidate.statusCode ??
        (candidate.name?.includes("NotFound")
          ? 404
          : candidate.name?.includes("Input")
            ? 400
            : 500);
      if (statusCode === 500) {
        next(error);
        return;
      }
      response.status(statusCode).json({
        message: error instanceof Error ? error.message : "Request failed",
      });
    }
  };
}
