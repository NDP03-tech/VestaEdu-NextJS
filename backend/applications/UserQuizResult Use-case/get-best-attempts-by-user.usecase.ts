import type { AttemptQueryRepository } from "./user-quiz-result.specialized.use-case.interface";

export class GetBestAttemptsByUserUseCase {
  constructor(private readonly repository: AttemptQueryRepository) {}

  async execute(userId: number) {
    return this.repository.getBestByUser(userId);
  }
}