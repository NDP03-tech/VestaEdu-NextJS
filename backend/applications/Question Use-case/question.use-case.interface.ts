import type { QuestionEntity } from "../../domain/entities";

export type CreateQuestionInput = Parameters<typeof QuestionEntity.create>[0];

export type UpdateQuestion = (entity: QuestionEntity) => void;
