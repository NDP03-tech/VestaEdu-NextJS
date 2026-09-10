import type { ClassMembershipRepository } from "./class.specialized.use-case.interface";
import { ClassNotFoundException } from "./class.exceptions";
import { normalizeClassId } from "./class.helpers";
export class AddQuizToClassUseCase {
  constructor(private readonly repository: ClassMembershipRepository) {}
  async execute(classId: string | number, quizId: number): Promise<void> {
    const key = normalizeClassId(classId);
    if (!(await this.repository.getById(key)))
      throw new ClassNotFoundException(key);
    await this.repository.addQuiz(key, Number(quizId));
  }
}
