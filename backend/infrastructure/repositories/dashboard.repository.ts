import { Repository } from "typeorm";
import type { DashboardRepository } from "../../applications/Dashboard Use-case/dashboard.use-case.interface";
import { User } from "../persistence/User";
import { Quiz } from "../persistence/Quiz";
import { UserQuizResult } from "../persistence/UserQuizResult";

export class DashboardTypeOrmRepository implements DashboardRepository {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly quizRepository: Repository<Quiz>,
    private readonly resultRepository: Repository<UserQuizResult>,
  ) {}

  countUsers(): Promise<number> {
    return this.userRepository.count();
  }

  countQuizzes(): Promise<number> {
    return this.quizRepository.count();
  }

  countPassedBetween(start: Date, end: Date): Promise<number> {
    return this.resultRepository
      .createQueryBuilder("result")
      .where("result.passed = :passed", { passed: true })
      .andWhere("result.submittedAt BETWEEN :start AND :end", { start, end })
      .getCount();
  }
}
