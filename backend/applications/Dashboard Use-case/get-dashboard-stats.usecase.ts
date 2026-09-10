import type { DashboardRepository } from "./dashboard.use-case.interface";
export class GetDashboardStatsUseCase {
  constructor(private readonly repository: DashboardRepository) {}
  async execute(now = new Date()) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return {
      totalUsers: await this.repository.countUsers(),
      totalQuizzes: await this.repository.countQuizzes(),
      passedToday: await this.repository.countPassedBetween(start, end),
    };
  }
}
