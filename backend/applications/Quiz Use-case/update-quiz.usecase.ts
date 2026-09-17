import { QuizEntity } from "../../domain/entities";
import type { quizRepository } from "../../domain/repositories/quiz.repository.interface";
import type { UpdateQuiz } from "./quiz.use-case.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class UpdateQuizUseCase {
  constructor(private readonly repository: quizRepository) {}

  async execute(id: EntityId, update: UpdateQuiz): Promise<void> {
    const key = normalizeEntityId(id, "Quiz");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("Quiz", id);
    update(entity);
    await this.repository.update(key, entity);
  }
}
