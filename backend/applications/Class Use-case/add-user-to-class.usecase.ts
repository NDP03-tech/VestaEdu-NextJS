import type { ClassMembershipRepository } from "./class.specialized.use-case.interface";
import {
  ClassNotFoundException,
  ClassInputValidationError,
} from "./class.exceptions";
import { normalizeClassId } from "./class.helpers";
export class AddUserToClassUseCase {
  constructor(private readonly repository: ClassMembershipRepository) {}
  async execute(classId: string | number, userId: number): Promise<void> {
    const key = normalizeClassId(classId);
    if (!userId) throw new ClassInputValidationError("userId is required");
    if (!(await this.repository.getById(key)))
      throw new ClassNotFoundException(key);
    await this.repository.addStudent(key, Number(userId));
  }
}
