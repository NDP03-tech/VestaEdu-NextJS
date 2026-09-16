import type { QuizEntity } from "../../domain/entities";

export type CreateQuizInput = Parameters<typeof QuizEntity.create>[0];

export type UpdateQuiz = (entity: QuizEntity) => void;
