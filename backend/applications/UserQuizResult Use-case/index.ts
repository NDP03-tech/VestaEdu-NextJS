import { UserQuizResultEntity } from "../../domain/entities";
import type { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";
export type CreateUserQuizResultInput = Parameters<
  typeof UserQuizResultEntity.create
>[0];
export type UpdateUserQuizResult = (entity: UserQuizResultEntity) => void;
export class CreateUserQuizResultUseCase {
  constructor(private readonly repository: userQuizResultRepository) {}
  async execute(input: CreateUserQuizResultInput): Promise<void> {
    await this.repository.create(UserQuizResultEntity.create(input));
  }
}
export class GetUserQuizResultByIdUseCase {
  constructor(private readonly repository: userQuizResultRepository) {}
  async execute(id: EntityId): Promise<UserQuizResultEntity> {
    const key = normalizeEntityId(id, "UserQuizResult");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("UserQuizResult", id);
    return entity;
  }
}
export { GetUserQuizResultByIdUseCase as GetUserQuizResultUseCase };
export class GetAllUserQuizResultsUseCase {
  constructor(private readonly repository: userQuizResultRepository) {}
  async execute(): Promise<UserQuizResultEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}
export { GetAllUserQuizResultsUseCase as ListUserQuizResultsUseCase };
export class UpdateUserQuizResultUseCase {
  constructor(private readonly repository: userQuizResultRepository) {}
  async execute(id: EntityId, update: UpdateUserQuizResult): Promise<void> {
    const key = normalizeEntityId(id, "UserQuizResult");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("UserQuizResult", id);
    update(entity);
    await this.repository.update(key);
  }
}
export class DeleteUserQuizResultUseCase {
  constructor(private readonly repository: userQuizResultRepository) {}
  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "UserQuizResult"));
  }
}
export * from "./user-quiz-result.specialized.use-case.interface";
export { StartAttemptUseCase } from "./start-attempt.usecase";
export { TempSaveAttemptUseCase } from "./temp-save-attempt.usecase";
export { SubmitAttemptUseCase } from "./submit-attempt.usecase";
export {
  GetLatestAttemptUseCase,
  GetAllAttemptsUseCase,
  GetBestAttemptUseCase,
  GetBestAttemptsByQuizUseCase,
  GetBestAttemptsByUserUseCase,
  GetUserResultsStatsUseCase,
} from "./get-attempt-history.usecase";
