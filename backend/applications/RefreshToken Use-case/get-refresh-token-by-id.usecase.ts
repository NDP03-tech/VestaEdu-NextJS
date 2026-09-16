import { RefreshTokenEntity } from "../../domain/entities";
import type { refreshTokenRepository } from "../../domain/repositories/refresh-token.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

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
