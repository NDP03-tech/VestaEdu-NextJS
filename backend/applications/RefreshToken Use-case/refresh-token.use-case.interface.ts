import type { RefreshTokenEntity } from "../../domain/entities";

export type CreateRefreshTokenInput = Parameters<
  typeof RefreshTokenEntity.create
>[0];

export type UpdateRefreshToken = (entity: RefreshTokenEntity) => void;
