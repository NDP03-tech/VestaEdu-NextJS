import { InstructorEntity } from "../../domain/entities";
import type { instructorRepository } from "../../domain/repositories/instructor.repository.interface";
import { InstructorNotFoundException } from "./instructor.exceptions";
import { normalizeInstructorId } from "./instructor.helpers";
export class GetInstructorByIdUseCase {
  constructor(private readonly instructorRepository: instructorRepository) {}
  async execute(id: string | number): Promise<InstructorEntity> {
    const key = normalizeInstructorId(id);
    const entity = await this.instructorRepository.getById(key);
    if (!entity) throw new InstructorNotFoundException(key);
    return entity;
  }
}
export { GetInstructorByIdUseCase as GetInstructorUseCase };
