import type { AttemptQueryRepository } from "./user-quiz-result.specialized.use-case.interface";

export class GetBestAttemptUseCase {
  constructor(private readonly repository: AttemptQueryRepository) {}

  async execute(userId: number, quizId: number) {
    return this.repository.getBest(userId, quizId);
  }
}