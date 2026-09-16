import { QuestionEntity } from "../../domain/entities";
import type { questionRepository } from "../../domain/repositories/question.repository.interface";
import type { UpdateQuestion } from "./question.use-case.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class UpdateQuestionUseCase {
  constructor(private readonly repository: questionRepository) {}

  async execute(id: EntityId, update: UpdateQuestion): Promise<void> {
    const key = normalizeEntityId(id, "Question");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("Question", id);
    update(entity);
    await this.repository.update(key);
  }
}
