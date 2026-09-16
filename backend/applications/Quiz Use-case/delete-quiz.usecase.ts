import type { quizRepository } from "../../domain/repositories/quiz.repository.interface";
import { normalizeEntityId, type EntityId } from "../use-case.helpers";

export class DeleteQuizUseCase {
  constructor(private readonly repository: quizRepository) {}

  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "Quiz"));
  }
}
