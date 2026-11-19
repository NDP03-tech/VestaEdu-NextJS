import type { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import type {
  AttemptDomainQueries,
  RawAttemptAnswer,
} from "./user-quiz-result.specialized.use-case.interface";
import { normalizeEntityId } from "../use-case.helpers";
import { AttemptOwnershipError } from "./user-quiz-result.exceptions";
import { isPastAttemptDeadline } from "./attempt-deadline.helpers";
import {
  toStudentAttemptResponse,
  type StudentAttemptResponse,
} from "./student-attempt-response";

export class TempSaveAttemptUseCase {
  constructor(
    private readonly repository: userQuizResultRepository,
    private readonly queries: AttemptDomainQueries,
  ) {}
  async execute(
    resultId: string | number,
    userId: number,
    answers: RawAttemptAnswer[],
    state?: Record<string, unknown>,
  ): Promise<StudentAttemptResponse> {
    const key = normalizeEntityId(resultId, "UserQuizResult");
    const result = await this.repository.getById(key);
    if (!result) throw new Error(`UserQuizResult ${key} not found`);
    if (result.userId !== userId) throw new AttemptOwnershipError();

    if (isPastAttemptDeadline(result.deadline)) {
      const quiz = await this.queries.getQuiz(result.quizId);
      if (!quiz) throw new Error(`Quiz ${result.quizId} not found`);
      if (quiz.uiSettings.mode === "exam") {
        const questions = await this.queries.getQuestions(result.quizId);
        result.submit(
          questions,
          result.answers,
          quiz.passingScore,
          true,
        );
        await this.repository.update(key, result);
        return toStudentAttemptResponse(result, quiz, questions);
      }
    }

    result.tempSave(answers, state);
    await this.repository.update(key, result);
    return toStudentAttemptResponse(result);
  }
}
