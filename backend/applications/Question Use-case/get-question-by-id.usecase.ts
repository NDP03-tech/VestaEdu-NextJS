import { QuestionEntity } from "../../domain/entities";
import type { questionRepository } from "../../domain/repositories/question.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class GetQuestionByIdUseCase {
  constructor(private readonly repository: questionRepository) {}

  async execute(id: EntityId): Promise<QuestionEntity> {
    const key = normalizeEntityId(id, "Question");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("Question", id);
    return entity;
  }
}

export { GetQuestionByIdUseCase as GetQuestionUseCase };
