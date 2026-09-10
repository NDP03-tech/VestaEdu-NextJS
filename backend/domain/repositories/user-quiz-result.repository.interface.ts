import { UserQuizResultEntity } from "../entities";

export interface userQuizResultRepository {
  delete(id: string): Promise<void>;
  create(result: UserQuizResultEntity): Promise<void>;
  getById(id: string): Promise<UserQuizResultEntity | null>;
  getAll(): Promise<UserQuizResultEntity[] | null>;
  update(id: string): Promise<void>;
}
