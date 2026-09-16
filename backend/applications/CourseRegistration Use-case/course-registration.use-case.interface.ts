import type { CourseRegistrationEntity } from "../../domain/entities";

export type CreateCourseRegistrationInput = Parameters<
  typeof CourseRegistrationEntity.create
>[0];

export type UpdateCourseRegistration = (
  entity: CourseRegistrationEntity,
) => void;
