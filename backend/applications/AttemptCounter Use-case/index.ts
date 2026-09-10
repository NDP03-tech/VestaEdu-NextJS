import { AttemptCounterEntity } from "../../domain/entities";
import type { attemptCounterRepository } from "../../domain/repositories/attempt-counter.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";
export type CreateAttemptCounterInput = Parameters<
  typeof AttemptCounterEntity.create
>[0];
export type UpdateAttemptCounter = (entity: AttemptCounterEntity) => void;
export class CreateAttemptCounterUseCase {
  constructor(private readonly repository: attemptCounterRepository) {}
  async execute(input: CreateAttemptCounterInput): Promise<void> {
    await this.repository.create(AttemptCounterEntity.create(input));
  }
}
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
export class GetAllAttemptCountersUseCase {
  constructor(private readonly repository: attemptCounterRepository) {}
  async execute(): Promise<AttemptCounterEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}
export { GetAllAttemptCountersUseCase as ListAttemptCountersUseCase };
export class UpdateAttemptCounterUseCase {
  constructor(private readonly repository: attemptCounterRepository) {}
  async execute(id: EntityId, update: UpdateAttemptCounter): Promise<void> {
    const key = normalizeEntityId(id, "AttemptCounter");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("AttemptCounter", id);
    update(entity);
    await this.repository.update(key);
  }
}
export class DeleteAttemptCounterUseCase {
  constructor(private readonly repository: attemptCounterRepository) {}
  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "AttemptCounter"));
  }
}
