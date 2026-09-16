import { QuizEntity } from "../../domain/entities";
import type { quizRepository } from "../../domain/repositories/quiz.repository.interface";

export class GetAllQuizzesUseCase {
  constructor(private readonly repository: quizRepository) {}

  async execute(): Promise<QuizEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}

export { GetAllQuizzesUseCase as ListQuizzesUseCase };
