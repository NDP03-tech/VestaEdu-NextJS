import type { AttemptQueryRepository } from "./user-quiz-result.specialized.use-case.interface";

export class GetLatestAttemptUseCase {
  constructor(private readonly repository: AttemptQueryRepository) {}

  async execute(userId: number, quizId: number) {
    return this.repository.getLatest(userId, quizId);
  }
}