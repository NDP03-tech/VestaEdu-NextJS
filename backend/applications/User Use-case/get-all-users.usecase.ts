import { UserEntity } from "../../domain/entities";
import type { userRepository } from "../../domain/repositories/user.repository.interface";

export class GetAllUsersUseCase {
  constructor(private readonly repository: userRepository) {}

  async execute(): Promise<UserEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}

export { GetAllUsersUseCase as ListUsersUseCase };
