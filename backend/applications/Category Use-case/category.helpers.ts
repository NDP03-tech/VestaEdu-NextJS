import type {
  CategoryId,
  UpdateCategoryInput,
} from "./category.use-case.interface";

export function normalizeCategoryId(id: CategoryId): string {
  const normalizedId = String(id).trim();
  if (!normalizedId) {
    throw new Error("Category id is required");
  }
  return normalizedId;
}

export function hasUpdateFields(input: UpdateCategoryInput): boolean {
  return input.name !== undefined;
}

export function requireStringField(
  value: string | null | undefined,
  field: string,
): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} must be a non-empty string`);
  }
  return value;
}
