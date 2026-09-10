import type { classRepository } from "../../domain/repositories/class.repository.interface";
import { normalizeClassId } from "./class.helpers";
export class DeleteClassUseCase {
  constructor(private readonly classRepository: classRepository) {}
  async execute(id: string | number): Promise<void> {
    await this.classRepository.delete(normalizeClassId(id));
  }
}
