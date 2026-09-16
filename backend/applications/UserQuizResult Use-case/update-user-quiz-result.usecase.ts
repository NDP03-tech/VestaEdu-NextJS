import { UserQuizResultEntity } from "../../domain/entities";
import type { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import type { UpdateUserQuizResult } from "./user-quiz-result.use-case.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class UpdateUserQuizResultUseCase {
  constructor(private readonly repository: userQuizResultRepository) {}

  async execute(
    id: EntityId,
    update: UpdateUserQuizResult,
  ): Promise<void> {
    const key = normalizeEntityId(id, "UserQuizResult");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("UserQuizResult", id);
    update(entity);
    await this.repository.update(key);
  }
}
