export class QuestionNotFoundException extends Error {
  constructor(id: string | number) {
    super(`Question ${String(id)} not found`);
    this.name = "QuestionNotFoundException";
  }
}
