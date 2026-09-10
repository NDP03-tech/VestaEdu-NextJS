export class AttemptCounterNotFoundException extends Error {
  constructor(id: string | number) {
    super(`AttemptCounter ${String(id)} not found`);
    this.name = "AttemptCounterNotFoundException";
  }
}
