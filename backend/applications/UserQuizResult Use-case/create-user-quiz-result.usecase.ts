import { UserQuizResultEntity } from "../../domain/entities";
import type { userQuizResultRepository } from "../../domain/repositories/user-quiz-result.repository.interface";
import type { CreateUserQuizResultInput } from "./user-quiz-result.use-case.interface";

export class CreateUserQuizResultUseCase {
  constructor(private readonly repository: userQuizResultRepository) {}

  async execute(input: CreateUserQuizResultInput): Promise<void> {
    await this.repository.create(UserQuizResultEntity.create(input));
  }
}
