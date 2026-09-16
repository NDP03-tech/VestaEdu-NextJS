import type { AttemptQueryRepository } from "./user-quiz-result.specialized.use-case.interface";

export class GetBestAttemptsByQuizUseCase {
  constructor(private readonly repository: AttemptQueryRepository) {}

  async execute(quizId: number) {
    return this.repository.getBestByQuiz(quizId);
  }
}