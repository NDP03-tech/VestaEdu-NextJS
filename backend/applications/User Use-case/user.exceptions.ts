export class UserNotFoundException extends Error {
  constructor(id: string | number) {
    super(`User ${String(id)} not found`);
    this.name = "UserNotFoundException";
  }
}
