import { UserEntity } from "../entities";

export interface userRepository {
  delete(id: string): Promise<void>;
  create(user: UserEntity): Promise<void>;
  getById(id: string): Promise<UserEntity | null>;
  getAll(): Promise<UserEntity[] | null>;
  update(id: string): Promise<void>;
}
