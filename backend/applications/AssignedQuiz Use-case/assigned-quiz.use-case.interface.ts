import type { QuizEntity } from "../../domain/entities";
export interface AssignedQuizRepository {
  getClassesByStudent(userId: number): Promise<number[]>;
  getQuizzesByClassIds(classIds: number[]): Promise<QuizEntity[]>;
}
