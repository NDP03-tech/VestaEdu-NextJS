import type { ScheduleEntry } from "../../utils/validation";

export type CourseId = string | number;
export type CreateCourseInput = Parameters<
  typeof import("../../domain/entities").CourseEntity.create
>[0];

export interface UpdateCourseInput {
  name?: string;
  title?: string;
  dis?: string;
  author?: string;
  lesson?: string;
  price?: string;
  duration?: string;
  type?: string;
  language?: string;
  content?: string;
  image?: string | null;
  bannerImg?: string | null;
  authorImg?: string | null;
  schedule?: ScheduleEntry[] | string;
}
