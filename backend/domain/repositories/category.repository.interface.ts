import { CategoryEntity } from "../entities";

export interface categoryRepository {
  delete(id: string): Promise<void>;
  create(category: CategoryEntity): Promise<void>;
  getById(id: string): Promise<CategoryEntity | null>;
  getAll(): Promise<CategoryEntity[] | null>;
  update(id: string): Promise<void>;
}
