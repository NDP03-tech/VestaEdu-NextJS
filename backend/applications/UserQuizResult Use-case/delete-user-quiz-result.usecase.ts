import type { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import { normalizeEntityId, type EntityId } from "../use-case.helpers";

export class DeleteUserQuizResultUseCase {
  constructor(private readonly repository: userQuizResultRepository) {}

  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(
      normalizeEntityId(id, "UserQuizResult"),
    );
  }
}
