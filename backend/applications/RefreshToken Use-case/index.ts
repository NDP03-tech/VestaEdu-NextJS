import { RefreshTokenEntity } from "../../domain/entities";
import type { refreshTokenRepository } from "../../domain/repositories/refresh-token.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";
export type CreateRefreshTokenInput = Parameters<
  typeof RefreshTokenEntity.create
>[0];
export type UpdateRefreshToken = (entity: RefreshTokenEntity) => void;
export class CreateRefreshTokenUseCase {
  constructor(private readonly repository: refreshTokenRepository) {}
  async execute(input: CreateRefreshTokenInput): Promise<void> {
    await this.repository.create(RefreshTokenEntity.create(input));
  }
}
export class GetRefreshTokenByIdUseCase {
  constructor(private readonly repository: refreshTokenRepository) {}
  async execute(id: EntityId): Promise<RefreshTokenEntity> {
    const key = normalizeEntityId(id, "RefreshToken");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("RefreshToken", id);
    return entity;
  }
}
export { GetRefreshTokenByIdUseCase as GetRefreshTokenUseCase };
export class GetAllRefreshTokensUseCase {
  constructor(private readonly repository: refreshTokenRepository) {}
  async execute(): Promise<RefreshTokenEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}
export { GetAllRefreshTokensUseCase as ListRefreshTokensUseCase };
export class UpdateRefreshTokenUseCase {
  constructor(private readonly repository: refreshTokenRepository) {}
  async execute(id: EntityId, update: UpdateRefreshToken): Promise<void> {
    const key = normalizeEntityId(id, "RefreshToken");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("RefreshToken", id);
    update(entity);
    await this.repository.update(key);
  }
}
export class DeleteRefreshTokenUseCase {
  constructor(private readonly repository: refreshTokenRepository) {}
  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "RefreshToken"));
  }
}
export * from "./refresh-token.specialized.use-case.interface";
export { RevokeRefreshTokenUseCase } from "./revoke-refresh-token.usecase";
export { RevokeAllUserRefreshTokensUseCase } from "./revoke-all-user-refresh-tokens.usecase";
export { RotateRefreshTokenUseCase } from "./rotate-refresh-token.usecase";
