import { CourseEntity } from "../../domain/entities";
import type { courseRepository } from "../../domain/repositories/course.repository.interface";
import { CourseNotFoundException } from "./course.exceptions";
import { normalizeCourseId } from "./course.helpers";

export class GetCourseByIdUseCase {
  constructor(private readonly courseRepository: courseRepository) {}

  async execute(id: string | number): Promise<CourseEntity> {
    const normalizedId = normalizeCourseId(id);
    const course = await this.courseRepository.getById(normalizedId);
    if (!course) throw new CourseNotFoundException(normalizedId);
    return course;
  }
}

export { GetCourseByIdUseCase as GetCourseUseCase };
