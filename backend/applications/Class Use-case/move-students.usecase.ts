import type { ClassMembershipRepository } from "./class.specialized.use-case.interface";
import {
  ClassNotFoundException,
  ClassInputValidationError,
} from "./class.exceptions";
import { normalizeClassId } from "./class.helpers";
export class MoveStudentsUseCase {
  constructor(private readonly repository: ClassMembershipRepository) {}
  async execute(
    fromClassId: string | number,
    toClassId: string | number,
    studentIds: number[],
  ): Promise<void> {
    const from = normalizeClassId(fromClassId);
    const to = normalizeClassId(toClassId);
    if (!Array.isArray(studentIds) || !studentIds.length)
      throw new ClassInputValidationError("studentIds are required");
    if (
      !(await this.repository.getById(from)) ||
      !(await this.repository.getById(to))
    )
      throw new ClassNotFoundException(`${from}/${to}`);
    await this.repository.moveStudents(from, to, [
      ...new Set(studentIds.map(Number)),
    ]);
  }
}
