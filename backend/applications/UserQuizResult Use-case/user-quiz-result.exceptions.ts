export class UserQuizResultNotFoundException extends Error {
  constructor(id: string | number) {
    super(`UserQuizResult ${String(id)} not found`);
    this.name = "UserQuizResultNotFoundException";
  }
}

export class AttemptOwnershipError extends Error {
  readonly statusCode = 403;

  constructor() {
    super("You cannot modify another user's attempt");
    this.name = "AttemptOwnershipError";
  }
}

export class AttemptNotSubmittedError extends Error {
  readonly statusCode = 409;

  constructor() {
    super("An attempt can only be graded after submission");
    this.name = "AttemptNotSubmittedError";
  }
}

export class ManualGradeValidationError extends Error {
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "ManualGradeValidationError";
  }
}

export class AlreadyPassedError extends Error {
  readonly statusCode = 409;
  readonly code = "ALREADY_PASSED";

  constructor() {
    super("You have already passed this exam");
    this.name = "AlreadyPassedError";
  }
}

export class NoAttemptsLeftError extends Error {
  readonly statusCode = 409;
  readonly code = "NO_ATTEMPTS_LEFT";

  constructor() {
    super("No attempts remain for this exam");
    this.name = "NoAttemptsLeftError";
  }
}
