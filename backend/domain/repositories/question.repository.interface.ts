import { QuestionEntity } from "../entities";

export interface questionRepository {
  delete(id: string | number): Promise<void>;
  create(question: QuestionEntity): Promise<void>;
  getById(id: string | number): Promise<QuestionEntity | null>;
  getAll(): Promise<QuestionEntity[] | null>;
  update(id: string | number, question: QuestionEntity): Promise<void>;
}
