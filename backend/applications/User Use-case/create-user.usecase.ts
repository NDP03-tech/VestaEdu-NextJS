import { UserEntity } from "../../domain/entities";
import type { userRepository } from "../../domain/repositories/user.repository.interface";
import type { PasswordHasher } from "../../domain/repositories/password-hasher.interface";
import type { CreateUserInput } from "./user.use-case.interface";

export class CreateUserUseCase {
  constructor(
    private readonly repository: userRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserInput): Promise<void> {
    await this.repository.create(await UserEntity.create(input, this.hasher));
  }
}
