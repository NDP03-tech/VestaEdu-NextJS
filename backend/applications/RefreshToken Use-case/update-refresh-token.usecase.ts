import { RefreshTokenEntity } from "../../domain/entities";
import type { refreshTokenRepository } from "../../domain/repositories/refresh-token.repository.interface";
import type { UpdateRefreshToken } from "./refresh-token.use-case.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class UpdateRefreshTokenUseCase {
  constructor(private readonly repository: refreshTokenRepository) {}

  async execute(id: EntityId, update: UpdateRefreshToken): Promise<void> {
    const key = normalizeEntityId(id, "RefreshToken");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("RefreshToken", id);
    update(entity);
    await this.repository.update(key, entity);
  }
}
