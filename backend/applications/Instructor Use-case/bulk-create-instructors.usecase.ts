import { InstructorEntity } from "../../domain/entities";
import type { InstructorQueryRepository } from "./instructor.specialized.use-case.interface";
import type { CreateInstructorInput } from "./instructor.use-case.interface";
export class BulkCreateInstructorsUseCase {
  constructor(private readonly repository: InstructorQueryRepository) {}
  async execute(inputs: CreateInstructorInput[]): Promise<void> {
    if (!Array.isArray(inputs) || !inputs.length)
      throw new Error("Instructor list is required");
    await this.repository.bulkCreate(
      inputs.map((input) => InstructorEntity.create(input)),
    );
  }
}
