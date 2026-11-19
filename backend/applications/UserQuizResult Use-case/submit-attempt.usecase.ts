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

export class SubmitAttemptUseCase {
  constructor(
    private readonly results: userQuizResultRepository,
    private readonly queries: AttemptDomainQueries,
  ) {}
  async execute(
    resultId: string | number,
    userId: number,
    answers: RawAttemptAnswer[],
  ): Promise<StudentAttemptResponse> {
    const key = normalizeEntityId(resultId, "UserQuizResult");
    const result = await this.results.getById(key);
    if (!result) throw new Error(`UserQuizResult ${key} not found`);
    if (result.userId !== userId) throw new AttemptOwnershipError();
    const quiz = await this.queries.getQuiz(result.quizId);
    if (!quiz) throw new Error(`Quiz ${result.quizId} not found`);
    const submittedLate =
      quiz.uiSettings.mode === "exam" &&
      isPastAttemptDeadline(result.deadline);
    const questions = await this.queries.getQuestions(result.quizId);
    result.submit(
      questions,
      submittedLate ? result.answers : answers,
      quiz.passingScore,
      submittedLate,
    );
    await this.results.update(key, result);
    return toStudentAttemptResponse(result, quiz, questions);
  }
}
