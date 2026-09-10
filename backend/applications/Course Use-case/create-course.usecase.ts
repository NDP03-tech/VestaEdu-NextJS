import { CourseEntity } from "../../domain/entities";
import type { courseRepository } from "../../domain/repositories/course.repository.interface";
import type { CreateCourseInput } from "./course.use-case.interface";
import {
  asInputValidationError,
  CourseInputValidationError,
} from "./course.exceptions";

export class CreateCourseUseCase {
  constructor(private readonly courseRepository: courseRepository) {}

  async execute(input: CreateCourseInput): Promise<void> {
    if (!input || typeof input !== "object") {
      throw new CourseInputValidationError("Course input must be an object");
    }
    try {
      await this.courseRepository.create(CourseEntity.create(input));
    } catch (error) {
      throw asInputValidationError(error);
    }
  }
}
