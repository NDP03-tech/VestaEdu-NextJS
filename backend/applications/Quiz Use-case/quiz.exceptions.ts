export class QuizNotFoundException extends Error {
  constructor(id: string | number) {
    super(`Quiz ${String(id)} not found`);
    this.name = "QuizNotFoundException";
  }
}
