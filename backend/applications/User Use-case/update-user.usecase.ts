import { UserEntity } from "../../domain/entities";
import type { userRepository } from "../../domain/repositories/user.repository.interface";
import type { UpdateUser } from "./user.use-case.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class UpdateUserUseCase {
  constructor(private readonly repository: userRepository) {}

  async execute(id: EntityId, update: UpdateUser): Promise<void> {
    const key = normalizeEntityId(id, "User");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("User", id);
    await update(entity);
    await this.repository.update(key, entity);
  }
}
