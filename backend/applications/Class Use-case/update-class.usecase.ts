import type { classRepository } from "../../domain/repositories/class.repository.interface";
import type { UpdateClassInput } from "./class.use-case.interface";
import {
  asInputValidationError,
  ClassInputValidationError,
  ClassNotFoundException,
} from "./class.exceptions";
import { hasUpdateFields, normalizeClassId } from "./class.helpers";
export class UpdateClassUseCase {
  constructor(private readonly classRepository: classRepository) {}
  async execute(id: string | number, input: UpdateClassInput): Promise<void> {
    const key = normalizeClassId(id);
    if (!input || typeof input !== "object" || !hasUpdateFields(input))
      throw new ClassInputValidationError(
        "At least one class field must be provided",
      );
    const entity = await this.classRepository.getById(key);
    if (!entity) throw new ClassNotFoundException(key);
    try {
      if (input.name !== undefined) entity.rename(input.name);
      if (input.description !== undefined)
        entity.updateDescription(input.description);
      if (input.teacherId !== undefined) entity.assignTeacher(input.teacherId);
      if (input.addStudentIds !== undefined)
        entity.addStudents(input.addStudentIds);
      if (input.removeStudentIds !== undefined)
        entity.removeStudents(input.removeStudentIds);
    } catch (error) {
      throw asInputValidationError(error);
    }
    await this.classRepository.update(key);
  }
}
