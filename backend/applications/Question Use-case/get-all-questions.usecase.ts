import { QuestionEntity } from "../../domain/entities";
import type { questionRepository } from "../../domain/repositories/question.repository.interface";

export class GetAllQuestionsUseCase {
  constructor(private readonly repository: questionRepository) {}

  async execute(): Promise<QuestionEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}

export { GetAllQuestionsUseCase as ListQuestionsUseCase };
