import type { CategoryQuizRepository } from "./category.specialized.use-case.interface";

export class GetQuizzesByCategoryUseCase {
  constructor(private readonly repository: CategoryQuizRepository) {}
  async execute(category?: string): Promise<unknown[]> {
    return !category || category === "all"
      ? []
      : this.repository.getByCategory(category);
  }
}
