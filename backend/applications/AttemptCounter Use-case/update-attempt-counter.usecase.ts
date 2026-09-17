import { AttemptCounterEntity } from "../../domain/entities";
import type { attemptCounterRepository } from "../../domain/repositories/attempt-counter.repository.interface";
import type { UpdateAttemptCounter } from "./attempt-counter.use-case.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class UpdateAttemptCounterUseCase {
  constructor(private readonly repository: attemptCounterRepository) {}

  async execute(id: EntityId, update: UpdateAttemptCounter): Promise<void> {
    const key = normalizeEntityId(id, "AttemptCounter");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("AttemptCounter", id);
    update(entity);
    await this.repository.update(key, entity);
  }
}
