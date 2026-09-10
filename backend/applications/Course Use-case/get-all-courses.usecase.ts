import { CourseEntity } from "../../domain/entities";
import type { courseRepository } from "../../domain/repositories/course.repository.interface";

export class GetAllCoursesUseCase {
  constructor(private readonly courseRepository: courseRepository) {}

  async execute(): Promise<CourseEntity[]> {
    return (await this.courseRepository.getAll()) ?? [];
  }
}

export { GetAllCoursesUseCase as ListCoursesUseCase };
