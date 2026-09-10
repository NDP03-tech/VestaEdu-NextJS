import { ClassEntity } from "../../domain/entities";
import type { classRepository } from "../../domain/repositories/class.repository.interface";
import { ClassNotFoundException } from "./class.exceptions";
import { normalizeClassId } from "./class.helpers";
export class GetClassByIdUseCase {
  constructor(private readonly classRepository: classRepository) {}
  async execute(id: string | number): Promise<ClassEntity> {
    const key = normalizeClassId(id);
    const entity = await this.classRepository.getById(key);
    if (!entity) throw new ClassNotFoundException(key);
    return entity;
  }
}
export { GetClassByIdUseCase as GetClassUseCase };
