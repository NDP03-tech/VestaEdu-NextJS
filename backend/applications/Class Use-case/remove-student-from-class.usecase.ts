import type { ClassMembershipRepository } from "./class.specialized.use-case.interface";
import { ClassNotFoundException } from "./class.exceptions";
import { normalizeClassId } from "./class.helpers";
export class RemoveStudentFromClassUseCase {
  constructor(private readonly repository: ClassMembershipRepository) {}
  async execute(classId: string | number, studentId: number): Promise<void> {
    const key = normalizeClassId(classId);
    if (!(await this.repository.getById(key)))
      throw new ClassNotFoundException(key);
    await this.repository.removeStudent(key, Number(studentId));
  }
}
