import type {
  AttemptDomainQueries,
  AttemptQueryRepository,
} from "./user-quiz-result.specialized.use-case.interface";
import { isPastAttemptDeadline } from "./attempt-deadline.helpers";

export class GetLatestAttemptUseCase {
  constructor(
    private readonly repository: AttemptQueryRepository,
    private readonly queries: AttemptDomainQueries,
  ) {}

  async execute(userId: number, quizId: number) {
    const result = await this.repository.getLatest(userId, quizId);
    if (
      !result ||
      result.isSubmitted() ||
      !isPastAttemptDeadline(result.deadline)
    ) {
      return result;
    }

    const quiz = await this.queries.getQuiz(result.quizId);
    if (!quiz) throw new Error(`Quiz ${result.quizId} not found`);
    if (quiz.uiSettings.mode !== "exam") return result;

    result.submit(
      await this.queries.getQuestions(result.quizId),
      result.answers,
      quiz.passingScore,
      true,
    );
    await this.repository.update(result.id, result);
    return result;
  }
}