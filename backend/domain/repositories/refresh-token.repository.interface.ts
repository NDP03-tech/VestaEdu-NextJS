import { RefreshTokenEntity } from "../entities";

export interface refreshTokenRepository {
  delete(id: string): Promise<void>;
  create(refreshToken: RefreshTokenEntity): Promise<void>;
  getById(id: string): Promise<RefreshTokenEntity | null>;
  getAll(): Promise<RefreshTokenEntity[] | null>;
  update(id: string): Promise<void>;
}
