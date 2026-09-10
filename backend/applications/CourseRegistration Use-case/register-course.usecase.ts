import { CourseRegistrationEntity } from "../../domain/entities";
import type { courseRegistrationRepository } from "../../domain/repositories/course-registration.repository.interface";
import type { CourseRegistrationQueryRepository } from "./course-registration.specialized.use-case.interface";
export type RegisterCourseInput = Parameters<
  typeof CourseRegistrationEntity.create
>[0];
export class RegisterCourseUseCase {
  constructor(
    private readonly repository: courseRegistrationRepository,
    private readonly queries: CourseRegistrationQueryRepository,
  ) {}
  async execute(input: RegisterCourseInput): Promise<void> {
    if (
      await this.queries.findByEmailAndCourse(
        input.email,
        Number(input.courseId),
      )
    )
      throw new Error("Course already registered");
    await this.repository.create(CourseRegistrationEntity.create(input));
  }
}
