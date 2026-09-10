import {
  AttemptCounterEntity,
  UserQuizResultEntity,
} from "../../domain/entities";
import type { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import type {
  AttemptQueryRepository,
  AttemptCounterQueries,
} from "./user-quiz-result.specialized.use-case.interface";
export class StartAttemptUseCase {
  constructor(
    private readonly results: userQuizResultRepository,
    private readonly queries: AttemptQueryRepository,
    private readonly counters: AttemptCounterQueries,
  ) {}
  async execute(userId: number, quizId: number): Promise<UserQuizResultEntity> {
    let counter = await this.counters.getByUserQuiz(userId, quizId);
    if (!counter) {
      counter = AttemptCounterEntity.create({ userId, quizId });
      await this.counters.create(counter);
    }
    counter.increment();
    if (counter.id) await this.counters.update(String(counter.id));
    const result = UserQuizResultEntity.create({
      userId,
      quizId,
      attemptNumber: counter.count,
    });
    await this.results.create(result);
    return result;
  }
}
