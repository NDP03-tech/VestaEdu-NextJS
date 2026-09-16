import { AttemptCounterEntity } from "../../domain/entities";
import type { attemptCounterRepository } from "../../domain/repositories/attempt-counter.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class GetAttemptCounterByIdUseCase {
  constructor(private readonly repository: attemptCounterRepository) {}

  async execute(id: EntityId): Promise<AttemptCounterEntity> {
    const key = normalizeEntityId(id, "AttemptCounter");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("AttemptCounter", id);
    return entity;
  }
}

export { GetAttemptCounterByIdUseCase as GetAttemptCounterUseCase };
