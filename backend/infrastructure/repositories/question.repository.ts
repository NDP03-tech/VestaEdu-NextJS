import { Repository } from "typeorm";
import { QuestionEntity } from "../../domain/entities";
import { questionRepository } from "../../domain/repositories/question.repository.interface";
import { Question } from "../persistence/Question";
import { QuestionMapper } from "../mapper/question.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";
import { QuestionQueryRepository } from "../../applications/Question Use-case/question.specialized.use-case.interface";

export class QuestionRepository
  extends TypeOrmCrudRepository<QuestionEntity, Question>
  implements questionRepository, QuestionQueryRepository
{
  constructor(repository: Repository<Question>) {
    super(repository, QuestionMapper);
  }

  async getByQuizId(quizId: string): Promise<QuestionEntity[]> {
    const rows = await this.repository.find({
      where: { quiz_id: Number(quizId) },
      order: { order: "ASC" },
    });
    return rows.map((row) => QuestionMapper.toDomain(row));
  }
}
