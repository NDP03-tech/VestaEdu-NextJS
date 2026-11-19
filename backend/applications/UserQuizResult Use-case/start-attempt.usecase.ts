import {
  AttemptCounterEntity,
  UserQuizResultEntity,
} from "../../domain/entities";
import type { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import type {
  AttemptDomainQueries,
  AttemptQueryRepository,
  AttemptCounterQueries,
} from "./user-quiz-result.specialized.use-case.interface";
import { QuizNotPublishedError } from "../Quiz Use-case";
export class StartAttemptUseCase {
  constructor(
    private readonly results: userQuizResultRepository,
    private readonly queries: AttemptQueryRepository,
    private readonly counters: AttemptCounterQueries,
    private readonly quizQueries: Pick<AttemptDomainQueries, "getQuiz">,
  ) {}
  async execute(userId: number, quizId: number): Promise<UserQuizResultEntity> {
    const quiz = await this.quizQueries.getQuiz(quizId);
    if (!quiz) throw new Error(`Quiz ${quizId} not found`);
    if (quiz.status !== "published") {
      throw new QuizNotPublishedError("This quiz is not available to students");
    }

    let counter = await this.counters.getByUserQuiz(userId, quizId);
    if (!counter) {
      counter = AttemptCounterEntity.create({ userId, quizId });
      await this.counters.create(counter);
    }
    counter.increment();
    if (counter.id) await this.counters.update(counter.id, counter);
    const timeLimit = Number(quiz.uiSettings.timeLimit);
    const deadline =
      Number.isFinite(timeLimit) && timeLimit > 0
        ? new Date(Date.now() + timeLimit * 60 * 1000)
        : null;

    const result = UserQuizResultEntity.create({
      userId,
      quizId,
      attemptNumber: counter.count,
      quizVersion: quiz.version,
      deadline,
    });
    await this.results.create(result);
    return result;
  }
}
