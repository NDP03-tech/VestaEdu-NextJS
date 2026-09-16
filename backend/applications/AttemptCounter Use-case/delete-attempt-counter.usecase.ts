import type { attemptCounterRepository } from "../../domain/repositories/attempt-counter.repository.interface";
import { normalizeEntityId, type EntityId } from "../use-case.helpers";

export class DeleteAttemptCounterUseCase {
  constructor(private readonly repository: attemptCounterRepository) {}

  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "AttemptCounter"));
  }
}
