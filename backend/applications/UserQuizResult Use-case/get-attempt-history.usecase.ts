import type { AttemptQueryRepository } from "./user-quiz-result.specialized.use-case.interface";
export class GetLatestAttemptUseCase {
  constructor(private readonly repository: AttemptQueryRepository) {}
  async execute(userId: number, quizId: number) {
    return this.repository.getLatest(userId, quizId);
  }
}
export class GetAllAttemptsUseCase {
  constructor(private readonly repository: AttemptQueryRepository) {}
  async execute(userId: number, quizId: number) {
    return this.repository.getByUserQuiz(userId, quizId);
  }
}
export class GetBestAttemptUseCase {
  constructor(private readonly repository: AttemptQueryRepository) {}
  async execute(userId: number, quizId: number) {
    return this.repository.getBest(userId, quizId);
  }
}
export class GetBestAttemptsByQuizUseCase {
  constructor(private readonly repository: AttemptQueryRepository) {}
  async execute(quizId: number) {
    return this.repository.getBestByQuiz(quizId);
  }
}
export class GetBestAttemptsByUserUseCase {
  constructor(private readonly repository: AttemptQueryRepository) {}
  async execute(userId: number) {
    return this.repository.getBestByUser(userId);
  }
}
export class GetUserResultsStatsUseCase {
  constructor(private readonly repository: AttemptQueryRepository) {}
  async execute(userId: number) {
    return this.repository.getStats(userId);
  }
}
