import { CourseRegistrationEntity } from "../entities";

export interface courseRegistrationRepository {
  delete(id: string | number): Promise<void>;
  create(registration: CourseRegistrationEntity): Promise<void>;
  getById(id: string | number): Promise<CourseRegistrationEntity | null>;
  getAll(): Promise<CourseRegistrationEntity[] | null>;
  update(
    id: string | number,
    registration: CourseRegistrationEntity,
  ): Promise<void>;
}
