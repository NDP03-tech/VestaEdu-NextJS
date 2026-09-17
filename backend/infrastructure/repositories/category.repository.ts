import { Repository } from "typeorm";
import { CategoryEntity } from "../../domain/entities";
import { categoryRepository } from "../../domain/repositories/category.repository.interface";
import { Category } from "../persistence/Category";
import { CategoryMapper } from "../mapper/category.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";
import { CategoryQuizRepository } from "../../applications/Category Use-case/category.specialized.use-case.interface";
import { Quiz } from "../persistence/Quiz";

export class CategoryRepository
  extends TypeOrmCrudRepository<CategoryEntity, Category>
  implements categoryRepository, CategoryQuizRepository
{
  constructor(
    repository: Repository<Category>,
    private readonly quizRepository: Repository<Quiz>,
  ) {
    super(repository, CategoryMapper);
  }

  async getByCategory(category: string): Promise<unknown[]> {
    return this.quizRepository.findBy({ category });
  }

  async deleteByCategory(category: string): Promise<void> {
    await this.quizRepository.delete({ category });
  }
}
