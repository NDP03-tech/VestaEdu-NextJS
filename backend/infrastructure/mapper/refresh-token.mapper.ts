import { RefreshTokenEntity } from "../../domain/entities";
import { RefreshToken } from "../persistence/RefreshToken";

export class RefreshTokenMapper {
  static toDomain(orm: RefreshToken): RefreshTokenEntity {
    return RefreshTokenEntity.reconstitute({
      id: orm.id,
      userId: orm.userId,
      tokenHash: orm.tokenHash,
      expiresAt: orm.expiresAt,
      revokedAt: orm.revokedAt,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(token: RefreshTokenEntity): RefreshToken {
    const orm = new RefreshToken();
    orm.id = token.id;
    orm.userId = token.userId;
    orm.tokenHash = token.tokenHash;
    orm.expiresAt = token.expiresAt;
    orm.revokedAt = token.revokedAt;
    orm.createdAt = token.createdAt;
    orm.updatedAt = token.updatedAt;
    return orm;
  }
}
