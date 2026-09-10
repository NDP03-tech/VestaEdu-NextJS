import type { UserEntity, QuizEntity } from "../../domain/entities";
import type { PasswordHasher } from "../../domain/repositories/password-hasher.interface";

export interface UserQueryRepository {
  getByEmail(email: string): Promise<UserEntity | null>;
  getQuizzesForUser(userId: string): Promise<QuizEntity[]>;
}

export interface TokenIssuer {
  issueAccessToken(user: UserEntity): Promise<string> | string;
  createRefreshToken(
    userId: number,
  ): Promise<{ rawToken: string; tokenHash: string; expiresAt: Date }>;
}

export interface UserAuthDependencies {
  users: UserQueryRepository;
  hasher: PasswordHasher;
  tokens: TokenIssuer;
}
