import type { RefreshTokenQueryRepository } from "./refresh-token.specialized.use-case.interface";
export class RevokeRefreshTokenUseCase {
  constructor(private readonly repository: RefreshTokenQueryRepository) {}
  async execute(tokenHash: string): Promise<void> {
    await this.repository.revokeByHash(tokenHash);
  }
}
