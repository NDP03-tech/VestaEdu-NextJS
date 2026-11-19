import { QuizEntity } from "../../domain/entities";
import type { quizRepository } from "../../domain/repositories/quiz.repository.interface";
import type { CreateQuizInput } from "./quiz.use-case.interface";

export class CreateQuizUseCase {
  constructor(private readonly repository: quizRepository) {}

  async execute(input: CreateQuizInput = {}): Promise<QuizEntity> {
    return this.repository.createAndReturn(QuizEntity.create(input));
  }
}
