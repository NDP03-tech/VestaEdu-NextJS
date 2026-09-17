import type { instructorRepository } from "../../domain/repositories/instructor.repository.interface";
import type { UpdateInstructorInput } from "./instructor.use-case.interface";
import {
  asInputValidationError,
  InstructorInputValidationError,
  InstructorNotFoundException,
} from "./instructor.exceptions";
import { hasUpdateFields, normalizeInstructorId } from "./instructor.helpers";
export class UpdateInstructorUseCase {
  constructor(private readonly instructorRepository: instructorRepository) {}
  async execute(
    id: string | number,
    input: UpdateInstructorInput,
  ): Promise<void> {
    const key = normalizeInstructorId(id);
    if (!input || typeof input !== "object" || !hasUpdateFields(input))
      throw new InstructorInputValidationError(
        "At least one instructor field must be provided",
      );
    const entity = await this.instructorRepository.getById(key);
    if (!entity) throw new InstructorNotFoundException(key);
    try {
      if (input.name !== undefined) entity.rename(input.name);
      if (input.designation !== undefined)
        entity.updateDesignation(input.designation);
      if (input.bio !== undefined) entity.setBio(input.bio);
      if (input.image !== undefined) entity.setImage(input.image);
      if (
        input.facebook !== undefined ||
        input.twitter !== undefined ||
        input.linkedin !== undefined
      )
        entity.setSocial(input);
      if (input.email !== undefined || input.phone !== undefined)
        entity.setContact(input);
      if (input.status === "active") entity.activate();
      if (input.status === "inactive") entity.deactivate();
    } catch (error) {
      throw asInputValidationError(error);
    }
    await this.instructorRepository.update(key, entity);
  }
}
