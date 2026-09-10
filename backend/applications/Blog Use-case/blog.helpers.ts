import { BlogInputValidationError } from "./blog.exceptions";
import type { BlogId, UpdateBlogInput } from "./blog.use-case.interface";

export function normalizeBlogId(id: BlogId): string {
  const rawValue = typeof id === "number" ? String(id) : id;
  const trimmed = rawValue.trim();

  if (!/^\d+$/.test(trimmed)) {
    throw new BlogInputValidationError(`Invalid blog id: ${id}`);
  }

  return trimmed;
}

export function hasUpdateFields(input: UpdateBlogInput): boolean {
  return Object.keys(input).length > 0;
}

export function requireStringField(
  value: string | null | undefined,
  fieldName: string,
): string {
  if (value === null) {
    throw new BlogInputValidationError(`${fieldName} cannot be empty`);
  }

  if (typeof value !== "string") {
    throw new BlogInputValidationError(`${fieldName} must be a string`);
  }

  return value;
}
