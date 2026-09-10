import type { CourseRegistrationEntity } from "../../domain/entities";
export interface CourseRegistrationQueryRepository {
  findByEmailAndCourse(
    email: string,
    courseId: number,
  ): Promise<CourseRegistrationEntity | null>;
}
