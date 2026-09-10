import { QuizEntity } from "../entities";

export interface quizRepository {
  delete(id: string): Promise<void>;
  create(quiz: QuizEntity): Promise<void>;
  getById(id: string): Promise<QuizEntity | null>;
  getAll(): Promise<QuizEntity[] | null>;
  update(id: string): Promise<void>;
}
