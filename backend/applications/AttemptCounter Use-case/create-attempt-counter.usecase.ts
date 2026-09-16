import { AttemptCounterEntity } from "../../domain/entities";
import type { attemptCounterRepository } from "../../domain/repositories/attempt-counter.repository.interface";
import type { CreateAttemptCounterInput } from "./attempt-counter.use-case.interface";

export class CreateAttemptCounterUseCase {
  constructor(private readonly repository: attemptCounterRepository) {}

  async execute(input: CreateAttemptCounterInput): Promise<void> {
    await this.repository.create(AttemptCounterEntity.create(input));
  }
}
