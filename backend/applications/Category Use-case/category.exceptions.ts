export class CategoryNotFoundException extends Error {
  constructor(id: string | number) {
    super(`Category ${String(id)} not found`);
    this.name = "CategoryNotFoundException";
  }
}

export class CategoryInputValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryInputValidationError";
  }
}

export function asInputValidationError(
  error: unknown,
): CategoryInputValidationError {
  if (error instanceof CategoryInputValidationError) return error;
  return new CategoryInputValidationError(
    error instanceof Error ? error.message : String(error),
  );
}
