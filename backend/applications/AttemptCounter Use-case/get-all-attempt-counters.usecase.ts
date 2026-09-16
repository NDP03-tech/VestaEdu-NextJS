import { AttemptCounterEntity } from "../../domain/entities";
import type { attemptCounterRepository } from "../../domain/repositories/attempt-counter.repository.interface";

export class GetAllAttemptCountersUseCase {
  constructor(private readonly repository: attemptCounterRepository) {}

  async execute(): Promise<AttemptCounterEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}

export { GetAllAttemptCountersUseCase as ListAttemptCountersUseCase };
