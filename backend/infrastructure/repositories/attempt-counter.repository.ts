import { Repository } from "typeorm";
import { AttemptCounterEntity } from "../../domain/entities";
import { attemptCounterRepository } from "../../domain/repositories/attempt-counter.repository.interface";
import { AttemptCounter } from "../persistence/AttemptCounter";
import { AttemptCounterMapper } from "../mapper/attempt-counter.mapper";
import { AttemptCounterQueries } from "../../applications/UserQuizResult Use-case/user-quiz-result.specialized.use-case.interface";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";

export class AttemptCounterRepository
  extends TypeOrmCrudRepository<AttemptCounterEntity, AttemptCounter>
  implements attemptCounterRepository, AttemptCounterQueries
{
  constructor(repository: Repository<AttemptCounter>) {
    super(repository, AttemptCounterMapper);
  }

  async getByUserQuiz(
    userId: number,
    quizId: number,
  ): Promise<AttemptCounterEntity | null> {
    const orm = await this.repository.findOneBy({
      user_id: userId,
      quiz_id: quizId,
    });
    return orm ? AttemptCounterMapper.toDomain(orm) : null;
  }
}
