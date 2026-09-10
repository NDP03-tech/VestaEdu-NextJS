import type { UserEntity } from "../../domain/entities";
import type { UserAuthDependencies } from "./user.specialized.use-case.interface";

export interface LoginInput {
  email: string;
  password: string;
}
export interface LoginOutput {
  accessToken: string;
  rawRefreshToken: string;
  user: ReturnType<UserEntity["toPublicJSON"]>;
}

export class LoginUseCase {
  constructor(private readonly dependencies: UserAuthDependencies) {}
  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.dependencies.users.getByEmail(input.email);
    if (
      !user ||
      !(await user.verifyPassword(input.password, this.dependencies.hasher))
    )
      throw new Error("Invalid credentials");
    const accessToken = await this.dependencies.tokens.issueAccessToken(user);
    const refresh = await this.dependencies.tokens.createRefreshToken(user.id);
    return {
      accessToken,
      rawRefreshToken: refresh.rawToken,
      user: user.toPublicJSON(),
    };
  }
}
