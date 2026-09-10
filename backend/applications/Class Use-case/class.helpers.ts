import type { ClassId, UpdateClassInput } from "./class.use-case.interface";
export function normalizeClassId(id: ClassId): string {
  const value = String(id).trim();
  if (!value) throw new Error("Class id is required");
  return value;
}
export function hasUpdateFields(input: UpdateClassInput): boolean {
  return Object.values(input).some((value) => value !== undefined);
}
