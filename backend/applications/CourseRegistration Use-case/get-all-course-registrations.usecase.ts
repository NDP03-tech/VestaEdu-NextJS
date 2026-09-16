import { CourseRegistrationEntity } from "../../domain/entities";
import type { courseRegistrationRepository } from "../../domain/repositories/course-registration.repository.interface";

export class GetAllCourseRegistrationsUseCase {
  constructor(private readonly repository: courseRegistrationRepository) {}

  async execute(): Promise<CourseRegistrationEntity[]> {
    return (await this.repository.getAll()) ?? [];
  }
}

export {
  GetAllCourseRegistrationsUseCase as ListCourseRegistrationsUseCase,
};
