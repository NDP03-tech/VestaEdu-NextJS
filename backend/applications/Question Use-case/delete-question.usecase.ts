import type { questionRepository } from "../../domain/repositories/question.repository.interface";
import { normalizeEntityId, type EntityId } from "../use-case.helpers";

export class DeleteQuestionUseCase {
  constructor(private readonly repository: questionRepository) {}

  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "Question"));
  }
}
