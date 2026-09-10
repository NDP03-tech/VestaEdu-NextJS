import type { RefreshTokenEntity } from "../../domain/entities";

export interface RefreshTokenQueryRepository {
  getActiveByHash(tokenHash: string): Promise<RefreshTokenEntity | null>;
  getByHash(tokenHash: string): Promise<RefreshTokenEntity | null>;
  revokeByHash(tokenHash: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
  update(id: string): Promise<void>;
}
