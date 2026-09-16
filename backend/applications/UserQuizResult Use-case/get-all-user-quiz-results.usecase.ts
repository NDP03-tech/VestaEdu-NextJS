import { UserQuizResultEntity } from "../../domain/entities";
import type { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";

export class GetAllUserQuizResultsUseCase {
  constructor(private readonly repository: userQuizResultRepository) {}

  async execute(): Promise<UserQuizResultEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}

export {
  GetAllUserQuizResultsUseCase as ListUserQuizResultsUseCase,
};
