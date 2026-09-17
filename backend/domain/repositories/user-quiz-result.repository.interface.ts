import { UserQuizResultEntity } from "../entities";

export interface userQuizResultRepository {
  delete(id: string | number): Promise<void>;
  create(result: UserQuizResultEntity): Promise<void>;
  getById(id: string | number): Promise<UserQuizResultEntity | null>;
  getAll(): Promise<UserQuizResultEntity[] | null>;
  update(id: string | number, result: UserQuizResultEntity): Promise<void>;
}
