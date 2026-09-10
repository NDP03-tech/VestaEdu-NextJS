import type { courseRepository } from "../../domain/repositories/course.repository.interface";
import { normalizeCourseId } from "./course.helpers";

export class DeleteCourseUseCase {
  constructor(private readonly courseRepository: courseRepository) {}

  async execute(id: string | number): Promise<void> {
    await this.courseRepository.delete(normalizeCourseId(id));
  }
}
