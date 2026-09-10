import { UserEntity } from "../../domain/entities";
import type { userRepository } from "../../domain/repositories/user.repository.interface";
import type { PasswordHasher } from "../../domain/repositories/password-hasher.interface";
import type { CreateUserInput } from "./user.use-case.interface";

export class RegisterUserUseCase {
  constructor(
    private readonly repository: userRepository,
    private readonly hasher: PasswordHasher,
    private readonly users: {
      getByEmail(email: string): Promise<UserEntity | null>;
    },
  ) {}
  async execute(input: CreateUserInput): Promise<void> {
    if (await this.users.getByEmail(input.email))
      throw new Error("Email already exists");
    await this.repository.create(
      await UserEntity.create({ ...input, role: "student" }, this.hasher),
    );
  }
}
