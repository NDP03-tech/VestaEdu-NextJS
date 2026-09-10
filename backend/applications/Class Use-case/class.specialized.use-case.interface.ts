import type { ClassEntity } from "../../domain/entities";

export interface ClassMembershipRepository {
  getById(id: string): Promise<ClassEntity | null>;
  addStudent(classId: string, studentId: number): Promise<void>;
  addStudents(classId: string, studentIds: number[]): Promise<void>;
  removeStudent(classId: string, studentId: number): Promise<void>;
  moveStudents(
    fromClassId: string,
    toClassId: string,
    studentIds: number[],
  ): Promise<void>;
  addQuiz(classId: string, quizId: number): Promise<void>;
  getStudentIds(classId: string): Promise<number[]>;
  getQuizIds(classId: string): Promise<number[]>;
}
