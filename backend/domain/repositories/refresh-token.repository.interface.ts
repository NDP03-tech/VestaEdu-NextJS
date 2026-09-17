import { RefreshTokenEntity } from "../entities";

export interface refreshTokenRepository {
  delete(id: string | number): Promise<void>;
  create(refreshToken: RefreshTokenEntity): Promise<void>;
  getById(id: string | number): Promise<RefreshTokenEntity | null>;
  getAll(): Promise<RefreshTokenEntity[] | null>;
  update(id: string | number, token: RefreshTokenEntity): Promise<void>;
}
