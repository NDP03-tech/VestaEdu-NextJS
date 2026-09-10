import type { CourseId, UpdateCourseInput } from "./course.use-case.interface";

export function normalizeCourseId(id: CourseId): string {
  const normalizedId = String(id).trim();
  if (!normalizedId) throw new Error("Course id is required");
  return normalizedId;
}

export function hasUpdateFields(input: UpdateCourseInput): boolean {
  return Object.values(input).some((value) => value !== undefined);
}
