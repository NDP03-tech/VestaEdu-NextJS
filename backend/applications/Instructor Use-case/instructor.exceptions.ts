export class InstructorNotFoundException extends Error {
  constructor(id: string | number) {
    super(`Instructor ${String(id)} not found`);
    this.name = "InstructorNotFoundException";
  }
}
export class InstructorInputValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InstructorInputValidationError";
  }
}
export function asInputValidationError(
  error: unknown,
): InstructorInputValidationError {
  if (error instanceof InstructorInputValidationError) return error;
  return new InstructorInputValidationError(
    error instanceof Error ? error.message : String(error),
  );
}
