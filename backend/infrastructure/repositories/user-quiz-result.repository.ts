import { Repository } from "typeorm";
import { UserQuizResultEntity } from "../../domain/entities";
import { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import { UserQuizResult } from "../persistence/UserQuizResult";
import { UserQuizResultMapper } from "../mapper/user-quiz-result.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";
import { AttemptQueryRepository } from "../../applications/UserQuizResult Use-case/user-quiz-result.specialized.use-case.interface";

export class UserQuizResultRepository
  extends TypeOrmCrudRepository<UserQuizResultEntity, UserQuizResult>
  implements userQuizResultRepository, AttemptQueryRepository
{
  constructor(repository: Repository<UserQuizResult>) {
    super(repository, UserQuizResultMapper);
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
