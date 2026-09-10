export class EventNotFoundException extends Error {
  constructor(id: string | number) {
    super(`Event ${String(id)} not found`);
    this.name = "EventNotFoundException";
  }
}
export class EventInputValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EventInputValidationError";
  }
}
export function asInputValidationError(
  error: unknown,
): EventInputValidationError {
  if (error instanceof EventInputValidationError) return error;
  return new EventInputValidationError(
    error instanceof Error ? error.message : String(error),
  );
}
