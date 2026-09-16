import { RefreshTokenEntity } from "../../domain/entities";
import type { refreshTokenRepository } from "../../domain/repositories/refresh-token.repository.interface";
import type { CreateRefreshTokenInput } from "./refresh-token.use-case.interface";

export class CreateRefreshTokenUseCase {
  constructor(private readonly repository: refreshTokenRepository) {}

  async execute(input: CreateRefreshTokenInput): Promise<void> {
    await this.repository.create(RefreshTokenEntity.create(input));
  }
}
