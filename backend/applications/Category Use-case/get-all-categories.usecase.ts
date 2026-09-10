import { CategoryEntity } from "../../domain/entities";
import type { categoryRepository } from "../../domain/repositories/category.repository.interface";

export class GetAllCategoriesUseCase {
  constructor(private readonly categoryRepository: categoryRepository) {}

  async execute(): Promise<CategoryEntity[]> {
    return (await this.categoryRepository.getAll()) ?? [];
  }
}

export { GetAllCategoriesUseCase as ListCategoriesUseCase };
