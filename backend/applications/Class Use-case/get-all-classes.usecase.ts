import { ClassEntity } from "../../domain/entities";
import type { classRepository } from "../../domain/repositories/class.repository.interface";
export class GetAllClassesUseCase {
  constructor(private readonly classRepository: classRepository) {}
  async execute(): Promise<ClassEntity[]> {
    return (await this.classRepository.getAll()) ?? [];
  }
}
export { GetAllClassesUseCase as ListClassesUseCase };
