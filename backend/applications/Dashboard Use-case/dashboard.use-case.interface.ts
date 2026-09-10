export interface DashboardRepository {
  countUsers(): Promise<number>;
  countQuizzes(): Promise<number>;
  countPassedBetween(start: Date, end: Date): Promise<number>;
}
