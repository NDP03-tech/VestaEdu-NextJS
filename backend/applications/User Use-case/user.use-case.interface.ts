import type { UserEntity } from "../../domain/entities";

export type CreateUserInput = Parameters<typeof UserEntity.create>[0];

export type UpdateUser = (entity: UserEntity) => void | Promise<void>;
