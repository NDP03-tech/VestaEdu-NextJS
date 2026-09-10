import type { instructorRepository } from "../../domain/repositories/instructor.repository.interface";
import { normalizeInstructorId } from "./instructor.helpers";
export class DeleteInstructorUseCase {
  constructor(private readonly instructorRepository: instructorRepository) {}
  async execute(id: string | number): Promise<void> {
    await this.instructorRepository.delete(normalizeInstructorId(id));
  }
}
