import type { categoryRepository } from "../../domain/repositories/category.repository.interface";
import type { CategoryQuizRepository } from "./category.specialized.use-case.interface";
import { CategoryNotFoundException } from "./category.exceptions";
import { normalizeCategoryId } from "./category.helpers";

export class DeleteCategoryAndQuizzesUseCase {
  constructor(
    private readonly categoryRepository: categoryRepository,
    private readonly quizRepository: CategoryQuizRepository,
  ) {}
  async execute(id: string | number): Promise<void> {
    const key = normalizeCategoryId(id);
    const category = await this.categoryRepository.getById(key);
    if (!category) throw new CategoryNotFoundException(key);
    await this.quizRepository.deleteByCategory(category.name);
    await this.categoryRepository.delete(key);
  }
}
