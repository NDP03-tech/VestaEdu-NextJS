import type { ClassMembershipRepository } from "./class.specialized.use-case.interface";
import {
  ClassNotFoundException,
  ClassInputValidationError,
} from "./class.exceptions";
import { normalizeClassId } from "./class.helpers";
export class AddStudentsToClassUseCase {
  constructor(private readonly repository: ClassMembershipRepository) {}
  async execute(classId: string | number, studentIds: number[]): Promise<void> {
    const key = normalizeClassId(classId);
    if (!Array.isArray(studentIds) || !studentIds.length)
      throw new ClassInputValidationError("studentIds are required");
    if (!(await this.repository.getById(key)))
      throw new ClassNotFoundException(key);
    await this.repository.addStudents(key, [
      ...new Set(studentIds.map(Number)),
    ]);
  }
}
