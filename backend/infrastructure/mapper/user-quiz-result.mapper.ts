import { UserQuizResultEntity } from "../../domain/entities";
import { UserQuizResult } from "../persistence/UserQuizResult";

export class UserQuizResultMapper {
  static toDomain(orm: UserQuizResult): UserQuizResultEntity {
    const answers = orm.answers ?? [];

    return UserQuizResultEntity.reconstitute({
      id: orm.id,
      userId: orm.user_id,
      quizId: orm.quiz_id,
      attemptNumber: orm.attemptNumber,
      quizVersion: orm.quiz_version ?? null,
      deadline: orm.deadline ?? null,
      submittedLate: orm.submitted_late ?? false,
      state: orm.state ?? {},
      answers,
      score: orm.score,
      passed: orm.passed,
      needsManualGrading: answers.some(
        (answer) => answer.requiresManualGrading === true,
      ),
      startedAt: orm.startedAt,
      submittedAt: orm.submittedAt,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(result: UserQuizResultEntity): UserQuizResult {
    const orm = new UserQuizResult();
    orm.id = result.id;
    orm.user_id = result.userId;
    orm.quiz_id = result.quizId;
    orm.attemptNumber = result.attemptNumber;
    orm.quiz_version = result.quizVersion;
    orm.deadline = result.deadline;
    orm.submitted_late = result.submittedLate;
    orm.state = result.state;
    orm.answers = result.answers;
    orm.score = result.score;
    orm.passed = result.passed;
    orm.startedAt = result.startedAt;
    orm.submittedAt = result.submittedAt;
    orm.createdAt = result.createdAt;
    orm.updatedAt = result.updatedAt;
    return orm;
  }
}
