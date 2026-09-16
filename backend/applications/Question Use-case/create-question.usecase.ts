import { QuestionEntity } from "../../domain/entities";
import type { questionRepository } from "../../domain/repositories/question.repository.interface";
import type { CreateQuestionInput } from "./question.use-case.interface";

export class CreateQuestionUseCase {
  constructor(private readonly repository: questionRepository) {}

  async execute(input: CreateQuestionInput): Promise<void> {
    await this.repository.create(QuestionEntity.create(input));
  }
}
