import { Repository } from "typeorm";
import { UserEntity } from "../../domain/entities";
import { userRepository } from "../../domain/repositories/user.repository.interface";
import { User } from "../persistence/User";
import { UserMapper } from "../mapper/user.mapper";
import { TypeOrmCrudRepository } from "./typeorm-crud.repository";
import { UserQueryRepository } from "../../applications/User Use-case/user.specialized.use-case.interface";
import { UserQuizResult } from "../persistence/UserQuizResult";
import { QuizMapper } from "../mapper/quiz.mapper";

export class UserRepository
  extends TypeOrmCrudRepository<UserEntity, User>
  implements userRepository, UserQueryRepository
{
  constructor(
    repository: Repository<User>,
    private readonly resultRepository: Repository<UserQuizResult>,
  ) {
    super(repository, UserMapper);
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    const row = await this.repository.findOneBy({ email });
    return row ? UserMapper.toDomain(row) : null;
  }

  async getQuizzesForUser(
    userId: string,
  ): Promise<import("../../domain/entities").QuizEntity[]> {
    const rows = await this.resultRepository.find({
      where: { user_id: Number(userId) },
      relations: { quiz: true },
    });
    return rows
      .filter((row) => row.quiz)
      .map((row) => QuizMapper.toDomain(row.quiz));
  }
}
