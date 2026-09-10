import type { categoryRepository } from "../../domain/repositories/category.repository.interface";
import { normalizeCategoryId } from "./category.helpers";

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: categoryRepository) {}

  async execute(id: string | number): Promise<void> {
    await this.categoryRepository.delete(normalizeCategoryId(id));
  }
}
