import type { userRepository } from "../../domain/repositories/user.repository.interface";
import { normalizeEntityId, type EntityId } from "../use-case.helpers";

export class DeleteUserUseCase {
  constructor(private readonly repository: userRepository) {}

  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "User"));
  }
}
