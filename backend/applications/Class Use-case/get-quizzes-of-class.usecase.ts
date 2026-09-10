import type { ClassMembershipRepository } from "./class.specialized.use-case.interface";
import { ClassNotFoundException } from "./class.exceptions";
import { normalizeClassId } from "./class.helpers";
export class GetQuizzesOfClassUseCase {
  constructor(private readonly repository: ClassMembershipRepository) {}
  async execute(classId: string | number): Promise<number[]> {
    const key = normalizeClassId(classId);
    if (!(await this.repository.getById(key)))
      throw new ClassNotFoundException(key);
    return this.repository.getQuizIds(key);
  }
}
