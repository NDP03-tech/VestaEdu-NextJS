import { CourseEntity } from "../entities";

export interface courseRepository {
  delete(id: string | number): Promise<void>;
  create(course: CourseEntity): Promise<void>;
  getById(id: string | number): Promise<CourseEntity | null>;
  getAll(): Promise<CourseEntity[] | null>;
  update(id: string | number, course: CourseEntity): Promise<void>;
}
