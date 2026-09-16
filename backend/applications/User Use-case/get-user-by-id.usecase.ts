import { UserEntity } from "../../domain/entities";
import type { userRepository } from "../../domain/repositories/user.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class GetUserByIdUseCase {
  constructor(private readonly repository: userRepository) {}

  async execute(id: EntityId): Promise<UserEntity> {
    const key = normalizeEntityId(id, "User");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("User", id);
    return entity;
  }
}

export { GetUserByIdUseCase as GetUserUseCase };
