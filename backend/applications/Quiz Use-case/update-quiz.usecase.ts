import { QuizEntity } from "../../domain/entities";
import type { quizRepository } from "../../domain/repositories/quiz.repository.interface";
import type {
  QuizUpdateInput,
  UpdateQuiz,
} from "./quiz.use-case.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";
import { InputValidationError } from "./save-quiz-contents.usecase";
import { isQuizStatus } from "../../domain/entities";

export class UpdateQuizUseCase {
  constructor(private readonly repository: quizRepository) {}

  async execute(
    id: EntityId,
    update: UpdateQuiz | QuizUpdateInput,
  ): Promise<QuizEntity> {
    const key = normalizeEntityId(id, "Quiz");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("Quiz", id);
    if (typeof update === "function") {
      update(entity);
      entity.bumpVersion();
      await this.repository.update(key, entity);
      return entity;
    } else if (typeof update === "object" && update !== null) {
      try {
        const expectedVersion = Number(update.version);
        if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 1) {
          throw new InputValidationError("version is required");
        }
        if (Object.prototype.hasOwnProperty.call(update, "title")) {
          entity.rename(String(update.title ?? ""));
        }
        if (Object.prototype.hasOwnProperty.call(update, "category")) {
          entity.setCategory(update.category ?? null);
        }
        if (Object.prototype.hasOwnProperty.call(update, "visibleTo")) {
          entity.setVisibility(String(update.visibleTo));
        }
        if (Object.prototype.hasOwnProperty.call(update, "status")) {
          if (!isQuizStatus(update.status)) {
            throw new InputValidationError(
              "status must be draft, published, or archived",
            );
          }
          entity.setStatus(update.status);
        }
        if (update.uiSettings) entity.updateUiSettings(update.uiSettings);
        if (Object.prototype.hasOwnProperty.call(update, "passingScore")) {
          entity.setPassingScore(Number(update.passingScore));
        }
      } catch (error) {
        if (error instanceof InputValidationError) throw error;
        throw new InputValidationError(
          error instanceof Error ? error.message : "Invalid quiz data",
        );
      }
    } else {
      throw new InputValidationError("Quiz update must be an object");
    }
    return this.repository.updateIfVersionMatches(
      key,
      entity,
      Number(update.version),
    );
  }
}
