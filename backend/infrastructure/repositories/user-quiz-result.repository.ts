import { DataSource, IsNull, Repository } from "typeorm";
import { UserQuizResultEntity } from "../../domain/entities";
import { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import { UserQuizResult } from "../persistence/UserQuizResult";
import { UserQuizResultMapper } from "../mapper/user-quiz-result.mapper";
import { AttemptCounter } from "../persistence/AttemptCounter";
import { AttemptCounterMapper } from "../mapper/attempt-counter.mapper";
import { Quiz } from "../persistence/Quiz";
import { QuizMapper } from "../mapper/quiz.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";
import type {
  AttemptQueryRepository,
  AttemptStartRepository,
  AttemptStartTransaction,
} from "../../applications/UserQuizResult Use-case/user-quiz-result.specialized.use-case.interface";

export class UserQuizResultRepository
  extends TypeOrmCrudRepository<UserQuizResultEntity, UserQuizResult>
  implements
    userQuizResultRepository,
    AttemptQueryRepository,
    AttemptStartRepository
{
  constructor(
    repository: Repository<UserQuizResult>,
    private readonly dataSource: DataSource,
  ) {
    super(repository, UserQuizResultMapper);
  }

  async withUserQuizStartLock<T>(
    userId: number,
    quizId: number,
    operation: (transaction: AttemptStartTransaction) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .insert()
        .into(AttemptCounter)
        .values({ user_id: userId, quiz_id: quizId, count: 0 })
        .orIgnore()
        .execute();

      const counterRow = await manager.findOne(AttemptCounter, {
        where: { user_id: userId, quiz_id: quizId },
        lock: { mode: "pessimistic_write" },
      });
      if (!counterRow) {
        throw new Error(
          `Attempt counter for user ${userId} and quiz ${quizId} could not be locked`,
        );
      }

      const counter = AttemptCounterMapper.toDomain(counterRow);
      const transaction: AttemptStartTransaction = {
        counter,
        getQuiz: async () => {
          const quiz = await manager.findOne(Quiz, {
            where: { id: quizId },
            lock: { mode: "pessimistic_read" },
          });
          return quiz ? QuizMapper.toDomain(quiz) : null;
        },
        getUnsubmittedAttempt: async () => {
          const result = await manager.findOne(UserQuizResult, {
            where: {
              user_id: userId,
              quiz_id: quizId,
              submittedAt: IsNull(),
            },
            order: { createdAt: "DESC" },
            lock: { mode: "pessimistic_write" },
          });
          return result ? UserQuizResultMapper.toDomain(result) : null;
        },
        hasPassedAttempt: async () =>
          (await manager.count(UserQuizResult, {
            where: { user_id: userId, quiz_id: quizId, passed: true },
          })) > 0,
        saveCounter: async () => {
          await manager.save(
            AttemptCounter,
            AttemptCounterMapper.toPersistence(counter),
          );
        },
        createAttempt: async (result) => {
          const persistence = UserQuizResultMapper.toPersistence(result);
          Reflect.deleteProperty(persistence, "id");
          const saved = await manager.save(
            UserQuizResult,
            persistence,
          );
          return UserQuizResultMapper.toDomain(saved);
        },
        updateAttempt: async (result) => {
          await manager.save(
            UserQuizResult,
            UserQuizResultMapper.toPersistence(result),
          );
        },
      };

      return operation(transaction);
    });
  }

  async countAttempts(userId: number, quizId: number): Promise<number> {
    return this.repository.countBy({ user_id: userId, quiz_id: quizId });
  }

  async getByUserQuiz(
    userId: number,
    quizId: number,
  ): Promise<UserQuizResultEntity[]> {
    const rows = await this.repository.find({
      where: { user_id: userId, quiz_id: quizId },
      order: { attemptNumber: "DESC" },
    });
    return rows.map((row) => UserQuizResultMapper.toDomain(row));
  }

  async getLatest(
    userId: number,
    quizId: number,
  ): Promise<UserQuizResultEntity | null> {
    const row = await this.repository.findOne({
      where: { user_id: userId, quiz_id: quizId },
      order: { createdAt: "DESC" },
    });
    return row ? UserQuizResultMapper.toDomain(row) : null;
  }

  async getBest(
    userId: number,
    quizId: number,
  ): Promise<UserQuizResultEntity | null> {
    const row = await this.repository.findOne({
      where: { user_id: userId, quiz_id: quizId },
      order: { score: "DESC", createdAt: "DESC" },
    });
    return row ? UserQuizResultMapper.toDomain(row) : null;
  }

  async getBestByQuiz(quizId: number): Promise<UserQuizResultEntity[]> {
    const rows = await this.repository.find({
      where: { quiz_id: quizId },
      order: { score: "DESC", createdAt: "DESC" },
    });
    return this.bestPerGroup(rows, (row) => row.user_id);
  }

  async getBestByUser(userId: number): Promise<UserQuizResultEntity[]> {
    const rows = await this.repository.find({
      where: { user_id: userId },
      order: { score: "DESC", createdAt: "DESC" },
    });
    return this.bestPerGroup(rows, (row) => row.quiz_id);
  }

  async getStats(userId: number): Promise<Record<string, number>> {
    const rows = await this.repository.findBy({ user_id: userId });
    const totalAttempts = rows.length;
    const passedAttempts = rows.filter((row) => row.passed).length;
    const totalScore = rows.reduce(
      (sum, row) => sum + Number(row.score || 0),
      0,
    );
    return {
      totalAttempts,
      passedAttempts,
      averageScore: totalAttempts ? totalScore / totalAttempts : 0,
    };
  }

  private bestPerGroup(
    rows: UserQuizResult[],
    groupBy: (row: UserQuizResult) => number,
  ): UserQuizResultEntity[] {
    const best = new Map<number, UserQuizResult>();
    for (const row of rows) {
      const key = groupBy(row);
      if (!best.has(key)) best.set(key, row);
    }
    return [...best.values()].map((row) => UserQuizResultMapper.toDomain(row));
  }
}
