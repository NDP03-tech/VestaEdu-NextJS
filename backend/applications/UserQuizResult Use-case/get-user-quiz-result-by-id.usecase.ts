import { UserQuizResultEntity } from "../../domain/entities";
import type { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class GetUserQuizResultByIdUseCase {
  constructor(private readonly repository: userQuizResultRepository) {}

  async execute(id: EntityId): Promise<UserQuizResultEntity> {
    const key = normalizeEntityId(id, "UserQuizResult");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("UserQuizResult", id);
    return entity;
  }
}

export {
  GetUserQuizResultByIdUseCase as GetUserQuizResultUseCase,
};
