import { CourseRegistrationEntity } from "../../domain/entities";
import type { courseRegistrationRepository } from "../../domain/repositories/course-registration.repository.interface";
import type { UpdateCourseRegistration } from "./course-registration.use-case.interface";
import {
  normalizeEntityId,
  notFound,
  type EntityId,
} from "../use-case.helpers";

export class UpdateCourseRegistrationUseCase {
  constructor(private readonly repository: courseRegistrationRepository) {}

  async execute(
    id: EntityId,
    update: UpdateCourseRegistration,
  ): Promise<void> {
    const key = normalizeEntityId(id, "CourseRegistration");
    const entity = await this.repository.getById(key);
    if (!entity) throw notFound("CourseRegistration", id);
    update(entity);
    await this.repository.update(key);
  }
}
