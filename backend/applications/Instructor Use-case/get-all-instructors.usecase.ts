import { InstructorEntity } from "../../domain/entities";
import type { instructorRepository } from "../../domain/repositories/instructor.repository.interface";
export class GetAllInstructorsUseCase {
  constructor(private readonly instructorRepository: instructorRepository) {}
  async execute(): Promise<InstructorEntity[]> {
    return (await this.instructorRepository.getAll()) ?? [];
  }
}
export { GetAllInstructorsUseCase as ListInstructorsUseCase };
