export class BlogNotFoundException extends Error {
  constructor(id: string | number) {
    super(`Blog ${String(id)} not found`);
    this.name = "BlogNotFoundException";
  }
}

export class BlogInputValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlogInputValidationError";
  }
}

export function asInputValidationError(error: unknown): BlogInputValidationError {
  if (error instanceof BlogInputValidationError) {
    return error;
  }

  return new BlogInputValidationError(
    error instanceof Error ? error.message : String(error),
  );
}
