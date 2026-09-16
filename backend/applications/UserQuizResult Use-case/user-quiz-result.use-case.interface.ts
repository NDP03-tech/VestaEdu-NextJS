import type { UserQuizResultEntity } from "../../domain/entities";

export type CreateUserQuizResultInput = Parameters<
  typeof UserQuizResultEntity.create
>[0];

export type UpdateUserQuizResult = (entity: UserQuizResultEntity) => void;
