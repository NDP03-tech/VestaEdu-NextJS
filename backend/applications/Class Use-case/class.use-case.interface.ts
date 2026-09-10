import type { ClassEntity } from "../../domain/entities";
export type ClassId = string | number;
export type CreateClassInput = Parameters<typeof ClassEntity.create>[0];
export interface UpdateClassInput {
  name?: string;
  description?: string;
  teacherId?: number | null;
  addStudentIds?: number[];
  removeStudentIds?: number[];
}
