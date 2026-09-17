import { CategoryEntity } from "../../domain/entities";
import type { categoryRepository } from "../../domain/repositories/category.repository.interface";
import type { UpdateCategoryInput } from "./category.use-case.interface";
import {
  asInputValidationError,
  CategoryInputValidationError,
  CategoryNotFoundException,
} from "./category.exceptions";
import {
  hasUpdateFields,
  normalizeCategoryId,
  requireStringField,
} from "./category.helpers";

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: categoryRepository) {}

  async execute(
    id: string | number,
    input: UpdateCategoryInput,
  ): Promise<void> {
    const normalizedId = normalizeCategoryId(id);
    if (!input || typeof input !== "object" || !hasUpdateFields(input)) {
      throw new CategoryInputValidationError(
        "At least one category field must be provided",
      );
    }

    const category = await this.categoryRepository.getById(normalizedId);
    if (!category) throw new CategoryNotFoundException(normalizedId);

    try {
      if (input.name !== undefined)
        category.updateName(requireStringField(input.name, "name"));
    } catch (error) {
      throw asInputValidationError(error);
    }

    await this.categoryRepository.update(normalizedId, category);
  }
}
