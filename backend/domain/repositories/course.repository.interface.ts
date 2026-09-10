import { CourseEntity } from "../entities";

export interface courseRepository {
  delete(id: string): Promise<void>;
  create(course: CourseEntity): Promise<void>;
  getById(id: string): Promise<CourseEntity | null>;
  getAll(): Promise<CourseEntity[] | null>;
  update(id: string): Promise<void>;
}
