import type { QuizQueryRepository } from "./quiz.specialized.use-case.interface";

export class GetQuizzesByCategoryUseCase {
  constructor(private readonly repository: QuizQueryRepository) {}
  async execute(category?: string) {
    return !category || category === "all"
      ? []
      : this.repository.getByCategory(category);
  }
}
