import type { QuizEntity } from "../../domain/entities";

export interface QuizQueryRepository {
  getByCategory(category: string): Promise<QuizEntity[]>;
  deleteQuestionsByQuizId(quizId: string): Promise<void>;
}
