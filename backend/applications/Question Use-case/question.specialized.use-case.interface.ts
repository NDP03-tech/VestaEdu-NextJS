import type { QuestionEntity } from "../../domain/entities";

export interface QuestionQueryRepository {
  getByQuizId(quizId: string): Promise<QuestionEntity[]>;
}
