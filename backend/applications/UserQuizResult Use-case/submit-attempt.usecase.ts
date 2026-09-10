import type { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import type {
  AttemptDomainQueries,
  RawAttemptAnswer,
} from "./user-quiz-result.specialized.use-case.interface";
import { normalizeEntityId } from "../use-case.helpers";
export class SubmitAttemptUseCase {
  constructor(
    private readonly results: userQuizResultRepository,
    private readonly queries: AttemptDomainQueries,
  ) {}
  async execute(
    resultId: string | number,
    answers: RawAttemptAnswer[],
  ): Promise<void> {
    const key = normalizeEntityId(resultId, "UserQuizResult");
    const result = await this.results.getById(key);
    if (!result) throw new Error(`UserQuizResult ${key} not found`);
    const quiz = await this.queries.getQuiz(result.quizId);
    if (!quiz) throw new Error(`Quiz ${result.quizId} not found`);
    result.submit(
      await this.queries.getQuestions(result.quizId),
      answers,
      quiz.passingScore,
    );
    await this.results.update(key);
  }
}
