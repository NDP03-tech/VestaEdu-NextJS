import { UserEntity } from "../entities";

export interface userRepository {
  delete(id: string | number): Promise<void>;
  create(user: UserEntity): Promise<void>;
  getById(id: string | number): Promise<UserEntity | null>;
  getAll(): Promise<UserEntity[] | null>;
  update(id: string | number, user: UserEntity): Promise<void>;
}
