import type { AttemptQueryRepository } from "./user-quiz-result.specialized.use-case.interface";

export class GetUserResultsStatsUseCase {
  constructor(private readonly repository: AttemptQueryRepository) {}

  async execute(userId: number) {
    return this.repository.getStats(userId);
  }
}