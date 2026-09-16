import { QuizEntity } from "../../domain/entities";
import type { quizRepository } from "../../domain/repositories/quiz.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class GetQuizByIdUseCase {
  constructor(private readonly repository: quizRepository) {}

  async execute(id: EntityId): Promise<QuizEntity> {
    const key = normalizeEntityId(id, "Quiz");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("Quiz", id);
    return entity;
  }
}

export { GetQuizByIdUseCase as GetQuizUseCase };
