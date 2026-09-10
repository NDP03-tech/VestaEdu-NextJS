import type {
  InstructorId,
  UpdateInstructorInput,
} from "./instructor.use-case.interface";
export function normalizeInstructorId(id: InstructorId): string {
  const value = String(id).trim();
  if (!value) throw new Error("Instructor id is required");
  return value;
}
export function hasUpdateFields(input: UpdateInstructorInput): boolean {
  return Object.values(input).some((value) => value !== undefined);
}
