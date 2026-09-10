import { InstructorEntity } from "../../domain/entities";
import type { instructorRepository } from "../../domain/repositories/instructor.repository.interface";
import type { CreateInstructorInput } from "./instructor.use-case.interface";
import {
  asInputValidationError,
  InstructorInputValidationError,
} from "./instructor.exceptions";
export class CreateInstructorUseCase {
  constructor(private readonly instructorRepository: instructorRepository) {}
  async execute(input: CreateInstructorInput): Promise<void> {
    if (!input || typeof input !== "object")
      throw new InstructorInputValidationError(
        "Instructor input must be an object",
      );
    try {
      await this.instructorRepository.create(InstructorEntity.create(input));
    } catch (error) {
      throw asInputValidationError(error);
    }
  }
}
