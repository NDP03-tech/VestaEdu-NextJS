import { CourseRegistrationEntity } from "../../domain/entities";
import type { courseRegistrationRepository } from "../../domain/repositories/course-registration.repository.interface";
import type { CreateCourseRegistrationInput } from "./course-registration.use-case.interface";

export class CreateCourseRegistrationUseCase {
  constructor(private readonly repository: courseRegistrationRepository) {}

  async execute(input: CreateCourseRegistrationInput): Promise<void> {
    await this.repository.create(CourseRegistrationEntity.create(input));
  }
}
