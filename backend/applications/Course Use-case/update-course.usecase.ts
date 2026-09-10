import { CourseEntity } from "../../domain/entities";
import type { courseRepository } from "../../domain/repositories/course.repository.interface";
import type { UpdateCourseInput } from "./course.use-case.interface";
import {
  asInputValidationError,
  CourseInputValidationError,
  CourseNotFoundException,
} from "./course.exceptions";
import { hasUpdateFields, normalizeCourseId } from "./course.helpers";

export class UpdateCourseUseCase {
  constructor(private readonly courseRepository: courseRepository) {}

  async execute(id: string | number, input: UpdateCourseInput): Promise<void> {
    const normalizedId = normalizeCourseId(id);
    if (!input || typeof input !== "object" || !hasUpdateFields(input)) {
      throw new CourseInputValidationError(
        "At least one course field must be provided",
      );
    }
    const course = await this.courseRepository.getById(normalizedId);
    if (!course) throw new CourseNotFoundException(normalizedId);
    try {
      course.updateBasicInfo(input);
      if (input.image !== undefined) course.setImage(input.image ?? null);
      if (input.bannerImg !== undefined)
        course.setBannerImg(input.bannerImg ?? null);
      if (input.authorImg !== undefined)
        course.setAuthorImg(input.authorImg ?? null);
      if (input.schedule !== undefined) course.setSchedule(input.schedule);
    } catch (error) {
      throw asInputValidationError(error);
    }
    await this.courseRepository.update(normalizedId);
  }
}
