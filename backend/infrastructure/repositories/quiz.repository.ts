import { Repository } from "typeorm";
import { QuizEntity } from "../../domain/entities";
import { quizRepository } from "../../domain/repositories/quiz.repository.interface";
import { Quiz } from "../persistence/Quiz";
import { QuizMapper } from "../mapper/quiz.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";
import { QuizQueryRepository } from "../../applications/Quiz Use-case/quiz.specialized.use-case.interface";
import { Question } from "../persistence/Question";

export class QuizRepository
  extends TypeOrmCrudRepository<QuizEntity, Quiz>
  implements quizRepository, QuizQueryRepository
{
  constructor(
    repository: Repository<Quiz>,
    private readonly questionRepository: Repository<Question>,
  ) {
    super(repository, QuizMapper);
  }

  async getByCategory(category: string): Promise<QuizEntity[]> {
    const rows = await this.repository.findBy({ category });
    return rows.map((row) => QuizMapper.toDomain(row));
  }

  async deleteQuestionsByQuizId(quizId: string): Promise<void> {
    await this.questionRepository.delete({ quiz_id: Number(quizId) });
  }
}
