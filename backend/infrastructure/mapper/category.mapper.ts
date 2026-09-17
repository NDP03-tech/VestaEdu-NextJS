import { CategoryEntity } from "../../domain/entities";
import { Category } from "../persistence/Category";

export class CategoryMapper {
  static toDomain(orm: Category): CategoryEntity {
    return CategoryEntity.reconstitute({
      id: orm.id,
      name: orm.name,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(category: CategoryEntity): Category {
    const orm = new Category();
    orm.id = category.id;
    orm.name = category.name;
    orm.createdAt = category.createdAt;
    orm.updatedAt = category.updatedAt;
    return orm;
  }
}
