export class UserQuizResultNotFoundException extends Error {
  constructor(id: string | number) {
    super(`UserQuizResult ${String(id)} not found`);
    this.name = "UserQuizResultNotFoundException";
  }
}
