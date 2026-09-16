import type { courseRegistrationRepository } from "../../domain/repositories/course-registration.repository.interface";
import { normalizeEntityId, type EntityId } from "../use-case.helpers";

export class DeleteCourseRegistrationUseCase {
  constructor(private readonly repository: courseRegistrationRepository) {}

  async execute(id: EntityId): Promise<void> {
    await this.repository.delete(
      normalizeEntityId(id, "CourseRegistration"),
    );
  }
}
