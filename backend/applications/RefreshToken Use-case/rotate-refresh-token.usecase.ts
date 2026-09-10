import type { RefreshTokenQueryRepository } from "./refresh-token.specialized.use-case.interface";
import type { TokenIssuer } from "../User Use-case/user.specialized.use-case.interface";
export class RotateRefreshTokenUseCase {
  constructor(
    private readonly repository: RefreshTokenQueryRepository,
    private readonly tokens: TokenIssuer,
  ) {}
  async execute(rawToken: string) {
    const stored = await this.repository.getActiveByHash(rawToken);
    if (!stored || !stored.isActive())
      throw new Error("Invalid or expired refresh token");
    stored.revoke();
    await this.repository.update(String(stored.id));
    return {
      accessToken: await this.tokens.issueAccessToken({
        id: stored.userId,
      } as never),
      ...(await this.tokens.createRefreshToken(stored.userId)),
    };
  }
}
