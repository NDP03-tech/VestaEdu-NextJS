import { CategoryEntity } from "../../domain/entities";
import type { categoryRepository } from "../../domain/repositories/category.repository.interface";
import { CategoryNotFoundException } from "./category.exceptions";
import { normalizeCategoryId } from "./category.helpers";

export class GetCategoryByIdUseCase {
  constructor(private readonly categoryRepository: categoryRepository) {}

  async execute(id: string | number): Promise<CategoryEntity> {
    const normalizedId = normalizeCategoryId(id);
    const category = await this.categoryRepository.getById(normalizedId);
    if (!category) throw new CategoryNotFoundException(normalizedId);
    return category;
  }
}

export { GetCategoryByIdUseCase as GetCategoryUseCase };
