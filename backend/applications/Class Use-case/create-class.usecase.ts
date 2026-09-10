import { ClassEntity } from "../../domain/entities";
import type { classRepository } from "../../domain/repositories/class.repository.interface";
import type { CreateClassInput } from "./class.use-case.interface";
import {
  asInputValidationError,
  ClassInputValidationError,
} from "./class.exceptions";
export class CreateClassUseCase {
  constructor(private readonly classRepository: classRepository) {}
  async execute(input: CreateClassInput): Promise<void> {
    if (!input || typeof input !== "object")
      throw new ClassInputValidationError("Class input must be an object");
    try {
      await this.classRepository.create(ClassEntity.create(input));
    } catch (error) {
      throw asInputValidationError(error);
    }
  }
}
