import { QuizEntity } from "../../domain/entities";
import type { quizRepository } from "../../domain/repositories/quiz.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";
export type CreateQuizInput = Parameters<typeof QuizEntity.create>[0];
export type UpdateQuiz = (entity: QuizEntity) => void;
export class CreateQuizUseCase {
  constructor(private readonly repository: quizRepository) {}
  async execute(input: CreateQuizInput = {}): Promise<void> {
    await this.repository.create(QuizEntity.create(input));
  }
}
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
export class GetAllQuizzesUseCase {
  constructor(private readonly repository: quizRepository) {}
  async execute(): Promise<QuizEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}
export { GetAllQuizzesUseCase as ListQuizzesUseCase };
export class UpdateQuizUseCase {
  constructor(private readonly repository: quizRepository) {}
  async execute(id: EntityId, update: UpdateQuiz): Promise<void> {
    const key = normalizeEntityId(id, "Quiz");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("Quiz", id);
    update(entity);
    await this.repository.update(key);
  }
}
export class DeleteQuizUseCase {
  constructor(private readonly repository: quizRepository) {}
  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "Quiz"));
  }
}
export * from "./quiz.specialized.use-case.interface";
export { GetQuizzesByCategoryUseCase } from "./get-quizzes-by-category.usecase";
export { DeleteQuizWithQuestionsUseCase } from "./delete-quiz-with-questions.usecase";
