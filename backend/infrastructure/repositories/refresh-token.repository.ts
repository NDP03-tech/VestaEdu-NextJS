import { Repository } from "typeorm";
import { RefreshTokenEntity } from "../../domain/entities";
import { refreshTokenRepository } from "../../domain/repositories/refresh-token.repository.interface";
import { RefreshToken } from "../persistence/RefreshToken";
import { RefreshTokenMapper } from "../mapper/refresh-token.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";
import { RefreshTokenQueryRepository } from "../../applications/RefreshToken Use-case/refresh-token.specialized.use-case.interface";

export class RefreshTokenRepository
  extends TypeOrmCrudRepository<RefreshTokenEntity, RefreshToken>
  implements refreshTokenRepository, RefreshTokenQueryRepository
{
  constructor(repository: Repository<RefreshToken>) {
    super(repository, RefreshTokenMapper);
  }

  async getActiveByHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
    const token = await this.getByHash(tokenHash);
    return token && token.isActive() ? token : null;
  }

  async getByHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
    const orm = await this.repository.findOneBy({ tokenHash });
    return orm ? RefreshTokenMapper.toDomain(orm) : null;
  }

  async revokeByHash(tokenHash: string): Promise<void> {
    const token = await this.getByHash(tokenHash);
    if (token) {
      token.revoke();
      await this.update(token.id, token);
    }
  }

  async revokeAllForUser(userId: string | number): Promise<void> {
    const rows = await this.repository.findBy({ userId: Number(userId) });
    for (const row of rows) {
      const token = RefreshTokenMapper.toDomain(row);
      token.revoke();
      await this.update(token.id, token);
    }
  }
}
