export class CourseNotFoundException extends Error {
  constructor(id: string | number) {
    super(`Course ${String(id)} not found`);
    this.name = "CourseNotFoundException";
  }
}

export class CourseInputValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CourseInputValidationError";
  }
}

export function asInputValidationError(
  error: unknown,
): CourseInputValidationError {
  if (error instanceof CourseInputValidationError) return error;
  return new CourseInputValidationError(
    error instanceof Error ? error.message : String(error),
  );
}
