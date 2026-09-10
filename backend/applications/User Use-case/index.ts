import { UserEntity } from "../../domain/entities";
import type { userRepository } from "../../domain/repositories/user.repository.interface";
import type { PasswordHasher } from "../../domain/repositories/password-hasher.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";
export type CreateUserInput = Parameters<typeof UserEntity.create>[0];
export type UpdateUser = (entity: UserEntity) => void | Promise<void>;
export class CreateUserUseCase {
  constructor(
    private readonly repository: userRepository,
    private readonly hasher: PasswordHasher,
  ) {}
  async execute(input: CreateUserInput): Promise<void> {
    await this.repository.create(await UserEntity.create(input, this.hasher));
  }
}
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
export class GetAllUsersUseCase {
  constructor(private readonly repository: userRepository) {}
  async execute(): Promise<UserEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}
export { GetAllUsersUseCase as ListUsersUseCase };
export class UpdateUserUseCase {
  constructor(private readonly repository: userRepository) {}
  async execute(id: EntityId, update: UpdateUser): Promise<void> {
    const key = normalizeEntityId(id, "User");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("User", id);
    await update(entity);
    await this.repository.update(key);
  }
}
export class DeleteUserUseCase {
  constructor(private readonly repository: userRepository) {}
  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "User"));
  }
}
export * from "./user.specialized.use-case.interface";
export { LoginUseCase } from "./login.usecase";
export { RegisterUserUseCase } from "./register-user.usecase";
export { CreateAdminUseCase } from "./create-admin.usecase";
export { GetQuizzesForUserUseCase } from "./get-quizzes-for-user.usecase";
