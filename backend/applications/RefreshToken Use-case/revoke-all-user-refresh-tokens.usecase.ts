import type { RefreshTokenQueryRepository } from "./refresh-token.specialized.use-case.interface";
export class RevokeAllUserRefreshTokensUseCase {
  constructor(private readonly repository: RefreshTokenQueryRepository) {}
  async execute(userId: string | number): Promise<void> {
    await this.repository.revokeAllForUser(String(userId));
  }
}
