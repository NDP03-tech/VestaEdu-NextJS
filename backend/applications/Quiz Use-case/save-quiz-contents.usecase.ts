import type { QuizEntity } from "../../domain/entities";
import type { QuestionEntity } from "../../domain/entities/question.entity";

export interface SaveQuizContentsInput {
  quiz: Record<string, unknown>;
  questions: Record<string, unknown>[];
  deletedQuestionIds: number[];
}

export interface SaveQuizContentsRepository {
  saveContents(
    quizId: number,
    input: SaveQuizContentsInput,
  ): Promise<{ quiz: QuizEntity; questions: QuestionEntity[] }>;
}

export class InputValidationError extends Error {
  readonly statusCode = 400;
}

export class QuizVersionConflictError extends Error {
  readonly statusCode = 409;
}

export class QuizNotPublishedError extends Error {
  readonly statusCode = 404;
}

export class SaveQuizContentsUseCase {
  constructor(private readonly repository: SaveQuizContentsRepository) {}

  execute(
    quizId: string | number,
    input: unknown,
  ): Promise<{ quiz: QuizEntity; questions: QuestionEntity[] }> {
    const id = Number(quizId);
    if (!Number.isSafeInteger(id) || id < 1) {
      throw new InputValidationError("quizId must be a positive integer");
    }

    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      throw new InputValidationError("Request body must be an object");
    }

    const body = input as Record<string, unknown>;
    if (
      typeof body.quiz !== "object" ||
      body.quiz === null ||
      Array.isArray(body.quiz)
    ) {
      throw new InputValidationError("quiz must be an object");
    }
    const quizVersion = Number(
      (body.quiz as Record<string, unknown>).version,
    );
    if (!Number.isSafeInteger(quizVersion) || quizVersion < 1) {
      throw new InputValidationError("quiz.version is required");
    }
    if (
      !Array.isArray(body.questions) ||
      !body.questions.every(
        (question) =>
          typeof question === "object" &&
          question !== null &&
          !Array.isArray(question),
      )
    ) {
      throw new InputValidationError("questions must be an array of objects");
    }

    const deletedQuestionIds = body.deletedQuestionIds ?? [];
    if (
      !Array.isArray(deletedQuestionIds) ||
      !deletedQuestionIds.every(
        (questionId) =>
          Number.isSafeInteger(Number(questionId)) && Number(questionId) > 0,
      )
    ) {
      throw new InputValidationError(
        "deletedQuestionIds must contain positive integers",
      );
    }

    return this.repository.saveContents(id, {
      quiz: body.quiz as Record<string, unknown>,
      questions: body.questions as Record<string, unknown>[],
      deletedQuestionIds: [...new Set(deletedQuestionIds.map(Number))],
    });
  }
}
