export class RefreshTokenNotFoundException extends Error {
  constructor(id: string | number) {
    super(`RefreshToken ${String(id)} not found`);
    this.name = "RefreshTokenNotFoundException";
  }
}
