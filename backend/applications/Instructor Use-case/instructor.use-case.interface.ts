import type { InstructorEntity } from "../../domain/entities";
export type InstructorId = string | number;
export type CreateInstructorInput = Parameters<
  typeof InstructorEntity.create
>[0];
export interface UpdateInstructorInput {
  name?: string;
  designation?: string;
  bio?: string | null;
  image?: string;
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: "active" | "inactive";
}
