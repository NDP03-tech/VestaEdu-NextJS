import { CourseRegistrationEntity } from "../entities";

export interface courseRegistrationRepository {
  delete(id: string): Promise<void>;
  create(registration: CourseRegistrationEntity): Promise<void>;
  getById(id: string): Promise<CourseRegistrationEntity | null>;
  getAll(): Promise<CourseRegistrationEntity[] | null>;
  update(id: string): Promise<void>;
}
