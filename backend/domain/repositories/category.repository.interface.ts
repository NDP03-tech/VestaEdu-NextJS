import { CategoryEntity } from "../entities";

export interface categoryRepository {
  delete(id: string | number): Promise<void>;
  create(category: CategoryEntity): Promise<void>;
  getById(id: string | number): Promise<CategoryEntity | null>;
  getAll(): Promise<CategoryEntity[] | null>;
  update(id: string | number, category: CategoryEntity): Promise<void>;
}
