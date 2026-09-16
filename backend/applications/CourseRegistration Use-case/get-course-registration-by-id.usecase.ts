import { CourseRegistrationEntity } from "../../domain/entities";
import type { courseRegistrationRepository } from "../../domain/repositories/course-registration.repository.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class GetCourseRegistrationByIdUseCase {
  constructor(private readonly repository: courseRegistrationRepository) {}

  async execute(id: EntityId): Promise<CourseRegistrationEntity> {
    const key = normalizeEntityId(id, "CourseRegistration");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("CourseRegistration", id);
    return entity;
  }
}

export {
  GetCourseRegistrationByIdUseCase as GetCourseRegistrationUseCase,
};
