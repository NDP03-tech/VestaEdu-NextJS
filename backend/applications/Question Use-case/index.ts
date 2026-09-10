import { QuestionEntity } from "../../domain/entities";
import type { questionRepository } from "../../domain/repositories/question.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";
export type CreateQuestionInput = Parameters<typeof QuestionEntity.create>[0];
export type UpdateQuestion = (entity: QuestionEntity) => void;
export class CreateQuestionUseCase {
  constructor(private readonly repository: questionRepository) {}
  async execute(input: CreateQuestionInput): Promise<void> {
    await this.repository.create(QuestionEntity.create(input));
  }
}
export class GetQuestionByIdUseCase {
  constructor(private readonly repository: questionRepository) {}
  async execute(id: EntityId): Promise<QuestionEntity> {
    const key = normalizeEntityId(id, "Question");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("Question", id);
    return entity;
  }
}
export { GetQuestionByIdUseCase as GetQuestionUseCase };
export class GetAllQuestionsUseCase {
  constructor(private readonly repository: questionRepository) {}
  async execute(): Promise<QuestionEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}
export { GetAllQuestionsUseCase as ListQuestionsUseCase };
export class UpdateQuestionUseCase {
  constructor(private readonly repository: questionRepository) {}
  async execute(id: EntityId, update: UpdateQuestion): Promise<void> {
    const key = normalizeEntityId(id, "Question");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("Question", id);
    update(entity);
    await this.repository.update(key);
  }
}
export class DeleteQuestionUseCase {
  constructor(private readonly repository: questionRepository) {}
  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(normalizeEntityId(id, "Question"));
  }
}
export * from "./question.specialized.use-case.interface";
export { GetQuestionsByQuizIdUseCase } from "./get-questions-by-quiz-id.usecase";
