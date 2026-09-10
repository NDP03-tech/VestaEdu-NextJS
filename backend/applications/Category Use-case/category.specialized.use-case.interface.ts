import type { CategoryEntity } from "../../domain/entities";

export interface CategoryQuizRepository {
  getByCategory(category: string): Promise<unknown[]>;
  deleteByCategory(category: string): Promise<void>;
}
