import {
  isQuizStatus,
  QuizEntity,
  type QuizUiSettings,
} from "../../domain/entities";
import { Quiz } from "../persistence/Quiz";

export class QuizMapper {
  static toDomain(orm: Quiz): QuizEntity {
    const uiSettings: QuizUiSettings = orm.uiSettings
      ? {
          ...orm.uiSettings,
          shuffle: orm.uiSettings.shuffle as QuizUiSettings["shuffle"],
          maxAttempts:
            typeof orm.uiSettings.maxAttempts === "number" ||
            orm.uiSettings.maxAttempts === "Unlimited"
              ? orm.uiSettings.maxAttempts
              : "Unlimited",
        }
      : QuizEntity.defaultUiSettings;

    return QuizEntity.reconstitute({
      id: orm.id,
      title: orm.title ?? "",
      category: orm.category ?? "",
      visibleTo: orm.visibleTo,
      uiSettings,
      passingScore: orm.passingScore,
      status: isQuizStatus(orm.status) ? orm.status : "published",
      version: orm.version,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(quiz: QuizEntity): Quiz {
    const orm = new Quiz();
    orm.id = quiz.id;
    orm.title = quiz.title;
    orm.category = quiz.category;
    orm.visibleTo = quiz.visibleTo;
    orm.passingScore = quiz.passingScore;
    orm.status = quiz.status;
    orm.version = quiz.version;
    orm.uiSettings = quiz.uiSettings;
    orm.createdAt = quiz.createdAt;
    orm.updatedAt = quiz.updatedAt;
    return orm;
  }
}
