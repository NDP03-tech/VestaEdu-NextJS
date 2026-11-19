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
