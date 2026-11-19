import type { QuizEntity } from "../../domain/entities";

export type CreateQuizInput = Parameters<typeof QuizEntity.create>[0];

export type UpdateQuiz = (entity: QuizEntity) => void;
export interface QuizUpdateInput {
  title?: string | null;
  category?: string | null;
  visibleTo?: string;
  status?: "draft" | "published" | "archived";
  uiSettings?: Partial<QuizEntity["uiSettings"]>;
  passingScore?: number;
  version: number;
}
