import type { refreshTokenRepository } from "../../domain/repositories/refresh-token.repository.interface";
import { normalizeEntityId, type EntityId } from "../use-case.helpers";

export class DeleteRefreshTokenUseCase {
  constructor(private readonly repository: refreshTokenRepository) {}

  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "RefreshToken"));
  }
}
