import type { userRepository } from "../../domain/repositories/user.repository.interface";
import type { PasswordHasher } from "../../domain/repositories/password-hasher.interface";
import type { CreateUserInput } from "./user.use-case.interface";
import { CreateUserUseCase } from "./create-user.usecase";

export class CreateAdminUseCase {
  constructor(
    private readonly repository: userRepository,
    private readonly hasher: PasswordHasher,
  ) {}
  async execute(input: Omit<CreateUserInput, "role">): Promise<void> {
    await new CreateUserUseCase(this.repository, this.hasher).execute({
      ...input,
      role: "admin",
    });
  }
}
