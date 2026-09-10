import { CategoryEntity } from "../../domain/entities";
import type { categoryRepository } from "../../domain/repositories/category.repository.interface";
import type { CreateCategoryInput } from "./category.use-case.interface";
import {
  asInputValidationError,
  CategoryInputValidationError,
} from "./category.exceptions";

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: categoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<void> {
    if (!input || typeof input !== "object") {
      throw new CategoryInputValidationError(
        "Category input must be an object",
      );
    }

    try {
      await this.categoryRepository.create(CategoryEntity.create(input));
    } catch (error) {
      throw asInputValidationError(error);
    }
  }
}
