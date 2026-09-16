import type { AttemptCounterEntity } from "../../domain/entities";

export type CreateAttemptCounterInput = Parameters<
  typeof AttemptCounterEntity.create
>[0];

export type UpdateAttemptCounter = (entity: AttemptCounterEntity) => void;
