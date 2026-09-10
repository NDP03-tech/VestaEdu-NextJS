import { QuestionEntity } from "../entities";

export interface questionRepository {
  delete(id: string): Promise<void>;
  create(question: QuestionEntity): Promise<void>;
  getById(id: string): Promise<QuestionEntity | null>;
  getAll(): Promise<QuestionEntity[] | null>;
  update(id: string): Promise<void>;
}
