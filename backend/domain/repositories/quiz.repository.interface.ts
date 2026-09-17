import { QuizEntity } from "../entities";

export interface quizRepository {
  delete(id: string | number): Promise<void>;
  create(quiz: QuizEntity): Promise<void>;
  getById(id: string | number): Promise<QuizEntity | null>;
  getAll(): Promise<QuizEntity[] | null>;
  update(id: string | number, quiz: QuizEntity): Promise<void>;
}
