import { RefreshTokenEntity } from "../../domain/entities";
import type { refreshTokenRepository } from "../../domain/repositories/refresh-token.repository.interface";

export class GetAllRefreshTokensUseCase {
  constructor(private readonly repository: refreshTokenRepository) {}

  async execute(): Promise<RefreshTokenEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}

export { GetAllRefreshTokensUseCase as ListRefreshTokensUseCase };
