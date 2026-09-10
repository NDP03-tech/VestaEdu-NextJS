export class ClassNotFoundException extends Error {
  constructor(id: string | number) {
    super(`Class ${String(id)} not found`);
    this.name = "ClassNotFoundException";
  }
}
export class ClassInputValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClassInputValidationError";
  }
}
export function asInputValidationError(
  error: unknown,
): ClassInputValidationError {
  if (error instanceof ClassInputValidationError) return error;
  return new ClassInputValidationError(
    error instanceof Error ? error.message : String(error),
  );
}
